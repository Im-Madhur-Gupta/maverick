import { cn } from "@/modules/common/utils/common.utils";

export interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const ExternalLink = ({
  href,
  children,
  className = "",
}: ExternalLinkProps) => {
  return (
    <a
      className={cn("text-sm text-white hover:text-white/80", className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

export default ExternalLink;
