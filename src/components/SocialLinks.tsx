import { Instagram, Youtube, Facebook } from "lucide-react";

interface Props {
  className?: string;
  iconSize?: number;
}

const links = [
  { href: "#", label: "Instagram", Icon: Instagram },
  { href: "#", label: "YouTube", Icon: Youtube },
  { href: "#", label: "Facebook", Icon: Facebook },
];

const SocialLinks = ({ className = "", iconSize = 20 }: Props) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {links.map(({ href, label, Icon }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <Icon size={iconSize} />
      </a>
    ))}
  </div>
);

export default SocialLinks;
