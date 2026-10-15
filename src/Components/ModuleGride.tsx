import type { PlatformModule } from "../types/platform";
import ModuleCard from "./ModuleCard";

interface ModuleGridProps {
  modules: PlatformModule[];
  onOpenModule?: (moduleId: string) => void;
}

export default function ModuleGrid({
  modules,
  onOpenModule,
}: ModuleGridProps) {
  if (modules.length === 0) {
    return (
      <div className="module-grid-empty" role="status">
        <p>No platform modules are currently available.</p>
      </div>
    );
  }

  return (
    <div className="module-grid">
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          onOpen={onOpenModule}
        />
      ))}
    </div>
  );
}
