import Link from "next/link";
import styles from "./SolutionCard.module.css";

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  outcomes: string[];
  href: string;
}

export default function SolutionCard({
  icon,
  title,
  description,
  outcomes,
  href,
}: SolutionCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.iconWrapper} aria-hidden="true">
        {icon}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        {outcomes.length > 0 && (
          <ul className={styles.outcomes}>
            {outcomes.map((outcome) => (
              <li key={outcome} className={styles.outcome}>
                {outcome}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link href={href} className={styles.link}>
        Ver solución
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </article>
  );
}
