-- =========================================================
-- SIMONIUM PLATFORM
-- Database schema and Row Level Security foundation
-- =========================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- 1. PLATFORM ROLES
-- ---------------------------------------------------------

create table if not exists public.platform_roles (
    id text primary key,
    name text not null,
    description text not null default '',
    permissions jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now()
);

alter table public.platform_roles enable row level security;

drop policy if exists "Authenticated users can view roles"
on public.platform_roles;

create policy "Authenticated users can view roles"
on public.platform_roles
for select
to authenticated
using (true);

insert into public.platform_roles (id, name, description, permissions)
values
(
    'community',
    'Community Member',
    'Reports community observations and local needs.',
    '["community:report:create", "community:report:read"]'::jsonb
),
(
    'student',
    'Student',
    'Participates in educational activities and submissions.',
    '["education:activity:read", "education:submission:create"]'::jsonb
),
(
    'teacher',
    'Teacher',
    'Manages educational activities and reviews submissions.',
    '["education:activity:create", "education:activity:read", "education:submission:review"]'::jsonb
),
(
    'researcher',
    'Researcher',
    'Creates research questions and manages research findings.',
    '["research:question:create", "research:question:read", "research:finding:create"]'::jsonb
),
(
    'discoverer',
    'Discoverer',
    'Contributes to discovery and verified knowledge.',
    '["research:finding:create", "research:finding:read"]'::jsonb
),
(
    'health-professional',
    'Health Professional',
    'Contributes health observations and research information.',
    '["health:report:create", "health:report:read", "research:question:read"]'::jsonb
),
(
    'institution',
    'Institution',
    'Coordinates authorized institutional activities.',
    '["institution:activity:read", "research:question:create"]'::jsonb
),
(
    'administrator',
    'Administrator',
    'Manages authorized platform operations.',
    '["*"]'::jsonb
)
on conflict (id) do nothing;


-- ---------------------------------------------------------
-- 2. USER PROFILES
-- ---------------------------------------------------------

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,

    full_name text not null default '',
    email text not null default '',

    role_id text not null default 'community'
        references public.platform_roles(id),

    account_status text not null default 'pending'
        check (
            account_status in (
                'pending',
                'active',
                'suspended'
            )
        ),

    institution_id uuid,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists profiles_role_id_idx
on public.profiles(role_id);

create index if not exists profiles_account_status_idx
on public.profiles(account_status);

alter table public.profiles enable row level security;


-- ---------------------------------------------------------
-- 3. SECURITY HELPER
-- ---------------------------------------------------------

-- SECURITY DEFINER allows this function to check the user's
-- profile without causing recursive profile-table policies.
-- The fixed search_path reduces object-substitution risks.

create or replace function public.is_active_administrator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles p
        where p.id = (select auth.uid())
          and p.role_id = 'administrator'
          and p.account_status = 'active'
    );
$$;

revoke all on function public.is_active_administrator()
from public;

grant execute on function public.is_active_administrator()
to authenticated;


-- ---------------------------------------------------------
-- 4. PROFILE ACCESS POLICIES
-- ---------------------------------------------------------

drop policy if exists "Users can read their own profile"
on public.profiles;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (
    id = (select auth.uid())
);

drop policy if exists "Administrators can read all profiles"
on public.profiles;

create policy "Administrators can read all profiles"
on public.profiles
for select
to authenticated
using (
    (select public.is_active_administrator())
);

-- Ordinary users cannot change their role or account status.
-- Profile updates are restricted to active administrators.
-- Additional safe self-service profile editing can be added
-- later using column-level privileges or a controlled function.

drop policy if exists "Administrators can update profiles"
on public.profiles;

create policy "Administrators can update profiles"
on public.profiles
for update
to authenticated
using (
    (select public.is_active_administrator())
)
with check (
    (select public.is_active_administrator())
);


-- ---------------------------------------------------------
-- 5. AUTOMATIC PROFILE CREATION
-- ---------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (
        id,
        full_name,
        email,
        role_id,
        account_status
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', ''),
        coalesce(new.email, ''),
        'community',
        'pending'
    )
    on conflict (id) do nothing;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


-- ---------------------------------------------------------
-- 6. AUDIT EVENTS
-- ---------------------------------------------------------

create table if not exists public.audit_events (
    id uuid primary key default gen_random_uuid(),

    actor_id uuid references auth.users(id) on delete set null,

    action text not null,
    resource_type text not null,
    resource_id text,

    details jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now()
);

create index if not exists audit_events_actor_id_idx
on public.audit_events(actor_id);

create index if not exists audit_events_created_at_idx
on public.audit_events(created_at desc);

alter table public.audit_events enable row level security;

drop policy if exists "Administrators can read audit events"
on public.audit_events;

create policy "Administrators can read audit events"
on public.audit_events
for select
to authenticated
using (
    (select public.is_active_administrator())
);

-- Deliberately no client insert, update, or delete policies.
-- Trusted server-side operations must write audit events.


-- ---------------------------------------------------------
-- 7. RESTRICT TABLE ACCESS
-- ---------------------------------------------------------

revoke all on public.platform_roles
from anon, authenticated;

grant select on public.platform_roles
to authenticated;

revoke all on public.profiles
from anon, authenticated;

grant select on public.profiles
to authenticated;

grant update (
    full_name,
    email,
    role_id,
    account_status,
    institution_id,
    updated_at
)
on public.profiles
to authenticated;

revoke all on public.audit_events
from anon, authenticated;

grant select on public.audit_events
to authenticated;


-- =========================================================
-- END OF INITIAL SECURITY FOUNDATION
-- =========================================================
