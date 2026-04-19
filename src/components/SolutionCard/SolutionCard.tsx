import styles from "./SolutionCard.module.css";

interface SolutionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
}

export default function SolutionCard({ title, description, icon, href }: SolutionCardProps) {
  const content = (
    <>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${styles.card} ${styles.link}`}>
        {content}
      </a>
    );
  }

  return <article className={styles.card}>{content}</article>;
}
