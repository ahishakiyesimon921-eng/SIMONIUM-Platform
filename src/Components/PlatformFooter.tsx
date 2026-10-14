interface PlatformFooterProps {
  platformName?: string;
  description?: string;
  developmentNotice?: string;
}

export default function PlatformFooter({
  platformName = "SIMONIUM",
  description = "Scientific Information Management, Organization, Network, Intelligence and Unified Multidisciplinary Platform.",
  developmentNotice = "Early development preview. Authentication, secure backend services, and shared database integration are not yet configured.",
}: PlatformFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <strong>{platformName}</strong>

      <p>{description}</p>

      <small>{developmentNotice}</small>

      <div className="footer-bottom">
        <small>
          © {currentYear} {platformName}. All rights reserved.
        </small>
      </div>
    </footer>
  );
}￼Enter
