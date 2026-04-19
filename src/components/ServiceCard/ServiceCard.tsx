import Link from "next/link";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  href: string;
  deliverable?: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  tags,
  href,
  deliverable,
}: ServiceCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.iconWrapper} aria-hidden="true">
          {icon}
        </div>
        {deliverable && (
          <span className={styles.deliverable}>{deliverable}</span>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <footer className={styles.footer}>
        <ul className={styles.tags}>
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
        <Link href={href} className={styles.link}>
          Saber más
        </Link>
      </footer>
    </article>
  );
}
