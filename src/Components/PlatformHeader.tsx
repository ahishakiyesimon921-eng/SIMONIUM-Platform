interface PlatformHeaderProps {
  platformName?: string;
  label?: string;
}

export default function PlatformHeader({
  platformName = "SIMONIUM",
  label = "Platform Preview",
}: PlatformHeaderProps) {
  return (
    <header className="header">
      <a
        className="brand"
        href="#home"
        aria-label={`${platformName} home`}
      >
        <span className="brand-mark" aria-hidden="true">
          S
        </span>

        <span>{platformName}</span>
      </a>

      <span className="platform-label">
        {label}
      </span>
    </header>
  );
}
