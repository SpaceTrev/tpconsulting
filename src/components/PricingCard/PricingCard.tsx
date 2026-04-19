import Link from "next/link";
import styles from "./PricingCard.module.css";

interface Feature {
  label: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: Feature[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
}

export default function PricingCard({
  name,
  price,
  period = "MXN",
  description,
  features,
  ctaLabel,
  ctaHref,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <article className={`${styles.card} ${highlighted ? styles.highlighted : ""}`}>
      {badge && <span className={styles.badge}>{badge}</span>}
      <header className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.pricing}>
          <span className={styles.price}>{price}</span>
          <span className={styles.period}> {period}</span>
        </div>
        <p className={styles.description}>{description}</p>
      </header>
      <ul className={styles.features}>
        {features.map(({ label, included }) => (
          <li key={label} className={`${styles.feature} ${included ? styles.included : styles.excluded}`}>
            <span className={styles.featureIcon} aria-hidden="true">
              {included ? "✓" : "×"}
            </span>
            {label}
          </li>
        ))}
      </ul>
      <Link href={ctaHref} className={`${styles.cta} ${highlighted ? styles.ctaHighlighted : ""}`}>
        {ctaLabel}
      </Link>
    </article>
  );
}
