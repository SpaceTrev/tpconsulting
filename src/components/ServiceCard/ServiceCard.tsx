import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  title: string;
  description: string;
  price?: string;
  duration?: string;
  href?: string;
}

export default function ServiceCard({ title, description, price, duration, href }: ServiceCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <footer className={styles.footer}>
        {(price || duration) && (
          <div className={styles.meta}>
            {price && <span className={styles.price}>{price}</span>}
            {duration && <span className={styles.duration}>{duration}</span>}
          </div>
        )}
        {href && (
          <a href={href} className={styles.cta}>Ver más →</a>
        )}
      </footer>
    </article>
  );
}
