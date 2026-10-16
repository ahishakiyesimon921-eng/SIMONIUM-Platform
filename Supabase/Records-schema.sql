-- =========================================================
-- SIMONIUM PLATFORM
-- Shared Records and Review Workflow
-- =========================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- 1. SHARED RECORDS TABLE
-- ---------------------------------------------------------

create table if not exists public.platform_records (
    id uuid primary key default gen_random_uuid(),

    module_id text not null,
    record_type text not null,

    title text not null,
    description text not null default '',

    data jsonb not null default '{}'::jsonb,

    location text,
    visibility text not null default 'private'
        check (
            visibility in (
                'private',
                'institution',
                'public'
            )
        ),

    status text not null default 'submitted'
        check (
            status in (
                'draft',
                'submitted',
                'under_review',
                'needs_correction',
                'approved',
                'rejected',
                'archived'
            )
        ),

    created_by uuid not null
        references auth.users(id),

    reviewed_by uuid
        references auth.users(id),

    review_feedback text,

    reviewed_at timestamptz,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint platform_records_module_check
        check (
            module_id in (
                'health',
                'education',
                'research-discovery',
                'community'
            )
        )
);

-- Indexes help the application search and filter records.

create index if not exists platform_records_module_idx
on public.platform_records(module_id);

create index if not exists platform_records_type_idx
on public.platform_records(record_type);

create index if not exists platform_records_status_idx
on public.platform_records(status);

create index if not exists platform_records_creator_idx
on public.platform_records(created_by);

create index if not exists platform_records_created_at_idx
on public.platform_records(created_at desc);


-- ---------------------------------------------------------
-- 2. ENABLE DATABASE SECURITY
-- ---------------------------------------------------------

alter table public.platform_records
enable row level security;

revoke all on public.platform_records
from anon, authenticated;

grant select, insert, update, delete
on public.platform_records
to authenticated;


-- ---------------------------------------------------------
-- 3. CHECK WHETHER A USER IS ACTIVE
-- ---------------------------------------------------------

create or replace function public.is_active_platform_user()
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
          and p.account_status = 'active'
    );
$$;

revoke all on function public.is_active_platform_user()
from public;

grant execute on function public.is_active_platform_user()
to authenticated;


-- ---------------------------------------------------------
-- 4. CHECK WHETHER A USER MAY REVIEW A RECORD
-- ---------------------------------------------------------

create or replace function public.can_review_platform_records()
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
          and p.account_status = 'active'
          and p.role_id in (
              'teacher',
              'researcher',
              'health-professional',
              'institution',
              'administrator'
          )
    );
$$;

revoke all on function public.can_review_platform_records()
from public;

grant execute on function public.can_review_platform_records()
to authenticated;


-- ---------------------------------------------------------
-- 5. CHECK WHETHER A USER MAY CREATE A RECORD
-- ---------------------------------------------------------

create or replace function public.can_create_platform_record(
    requested_module text,
    requested_type text
)
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
          and p.account_status = 'active'
          and (
              p.role_id = 'administrator'

              or (
                  requested_module = 'community'
                  and requested_type = 'community_report'
                  and p.role_id = 'community'
              )

              or (
                  requested_module = 'education'
                  and requested_type = 'student_submission'
                  and p.role_id = 'student'
              )

              or (
                  requested_module = 'education'
                  and requested_type = 'learning_activity'
                  and p.role_id = 'teacher'
              )

              or (
                  requested_module = 'research-discovery'
                  and requested_type in (
                      'research_question',
                      'research_finding'
                  )
                  and p.role_id in (
                      'researcher',
                      'discoverer'
                  )
              )

              or (
                  requested_module = 'health'
                  and requested_type = 'health_report'
                  and p.role_id = 'health-professional'
              )
          )
    );
$$;

revoke all on function public.can_create_platform_record(text, text)
from public;

grant execute on function public.can_create_platform_record(text, text)
to authenticated;


-- ---------------------------------------------------------
-- 6. READ POLICIES
-- ---------------------------------------------------------

drop policy if exists "Users read permitted records"
on public.platform_records;

create policy "Users read permitted records"
on public.platform_records
for select
to authenticated
using (
    (
        created_by = (select auth.uid())
        and public.is_active_platform_user()
    )
    or
    (
        status = 'approved'
        and visibility = 'public'
        and public.is_active_platform_user()
    )
    or
    (
        public.can_review_platform_records()
    )
);


-- ---------------------------------------------------------
-- 7. CREATE POLICY
-- ---------------------------------------------------------

drop policy if exists "Authorized users create records"
on public.platform_records;

create policy "Authorized users create records"
on public.platform_records
for insert
to authenticated
with check (
    created_by = (select auth.uid())
    and public.can_create_platform_record(
        module_id,
        record_type
    )
    and status in ('draft', 'submitted')
    and reviewed_by is null
    and reviewed_at is null
);


-- ---------------------------------------------------------
-- 8. UPDATE POLICY
-- ---------------------------------------------------------

drop policy if exists "Creators edit their unreviewed records"
on public.platform_records;

create policy "Creators edit their unreviewed records"
on public.platform_records
for update
to authenticated
using (
    created_by = (select auth.uid())
    and public.is_active_platform_user()
    and status in ('draft', 'needs_correction')
)
with check (
    created_by = (select auth.uid())
    and public.is_active_platform_user()
    and status in ('draft', 'submitted')
    and reviewed_by is null
    and reviewed_at is null
);

drop policy if exists "Authorized reviewers update records"
on public.platform_records;

create policy "Authorized reviewers update records"
on public.platform_records
for update
to authenticated
using (
    public.can_review_platform_records()
)
with check (
    public.can_review_platform_records()
);


-- ---------------------------------------------------------
-- 9. DELETE POLICY
-- ---------------------------------------------------------

drop policy if exists "Creators delete their drafts"
on public.platform_records;

create policy "Creators delete their drafts"
on public.platform_records
for delete
to authenticated
using (
    created_by = (select auth.uid())
    and public.is_active_platform_user()
    and status = 'draft'
);

drop policy if exists "Administrators delete records"
on public.platform_records;

create policy "Administrators delete records"
on public.platform_records
for delete
to authenticated
using (
    public.is_active_administrator()
);


-- ---------------------------------------------------------
-- 10. AUTOMATIC UPDATED TIMESTAMP
-- ---------------------------------------------------------

create or replace function public.set_record_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists platform_records_updated_at
on public.platform_records;

create trigger platform_records_updated_at
before update on public.platform_records
for each row
execute function public.set_record_updated_at();


-- =========================================================
-- END OF SHARED RECORDS FOUNDATION
-- =========================================================
