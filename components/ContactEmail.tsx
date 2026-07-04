import { PUBLIC_BUSINESS_EMAIL, contactMailtoUrl } from "@/lib/constants";

type ContactEmailProps = {
  subject?: string;
  className?: string;
  children?: React.ReactNode;
};

export function ContactEmail({ subject, className = "", children }: ContactEmailProps) {
  const label = children ?? PUBLIC_BUSINESS_EMAIL;

  return (
    <a
      href={contactMailtoUrl(subject)}
      className={`text-gold transition hover:underline ${className}`.trim()}
    >
      {label}
    </a>
  );
}
