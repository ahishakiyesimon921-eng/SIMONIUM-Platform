imimport type { PlatformModule } from "../types/platform";

interface ModuleCardProps {
  module: PlatformModule;
  onOpen?: (moduleId: string) => void;
}

const MODULE_ICONS: Record<string, string> = {
  health: "✚",
  education: "▤",
  research: "⌕",
  community: "◎",
};

export default function ModuleCard({
  module,
  onOpen,
}: ModuleCardProps) {
  const isAvailable =
    module.enabled && module.status === "active";

  const canOpen = isAvailable && Boolean(onOpen);

  return (
    <article
      className="module-card"
      aria-labelledby={`module-${module.id}`}
    >
      <span className="module-icon" aria-hidden="true">
        {MODULE_ICONS[module.icon] ?? "◇"}
      </span>

      <div className="module-content">
        <h3 id={`module-${module.id}`}>
          {module.name}
        </h3>

        <p>{module.description}</p>

        <span
          className={`module-status ${
            isAvailable
              ? "module-status-active"
              : "module-status-planned"
          }`}
        >
          {isAvailable
            ? "Configured module"
            : "Planned module"}
        </span>

        {canOpen && (
          <button
            type="button"
            onClick={() => onOpen(module.id)}
            aria-label={`Open ${module.name} module`}
          >
            Open {module.name}
          </button>
        )}
      </div>
    </article>
  );
}￼Enter
