import styles from "./PricingCard.module.css";

interface PricingCardProps {
  name: string;
  price: string;
  currency?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
}

export default function PricingCard({
  name,
  price,
  currency = "MXN",
  description,
  features,
  ctaLabel,
  ctaHref,
  highlighted = false,
}: PricingCardProps) {
  return (
    <article className={`${styles.card} ${highlighted ? styles.highlighted : ""}`}>
      <header className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.priceRow}>
          <span className={styles.price}>{price}</span>
          <span className={styles.currency}>{currency}</span>
        </div>
        <p className={styles.description}>{description}</p>
      </header>
      <ul className={styles.features}>
        {features.map((f) => (
          <li key={f} className={styles.feature}>{f}</li>
        ))}
      </ul>
      <a href={ctaHref} className={styles.cta}>{ctaLabel}</a>
    </article>
  );
}
