import Link from "next/link";
import { contactFormUrl } from "@/lib/constants";

type ContactLinkProps = {
  subject?: string;
  topic?: string;
  spa?: string;
  className?: string;
  children: React.ReactNode;
};

export function ContactLink({ subject, topic, spa, className = "", children }: ContactLinkProps) {
  return (
    <Link
      href={contactFormUrl({ subject, topic, spa })}
      className={`text-gold transition hover:underline ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
