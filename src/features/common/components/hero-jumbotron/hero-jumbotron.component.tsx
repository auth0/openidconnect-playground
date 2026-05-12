import React from "react";
import styles from "./hero-jumbotron.module.scss";
import Link from "next/link";

type HeroJumbotronComponentProps = {
  ctaLabel?: string;
  ctaHref?: string;
};

export const HeroJumbotronComponent: React.FC<HeroJumbotronComponentProps> = ({
  ctaLabel = "Try it now",
  ctaHref = "/",
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.hero}>
            <div className={styles.heroCopy}>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>
                  OpenID Connect Playground
                </h1>
                <p className={styles.heroDescription}>
                  The OIDC playground is for developers to test and work with
                  OpenID Connect calls step-by-step, giving them more insight
                  into how OpenID Connect works.
                </p>
              </div>

              <Link className={styles.heroCtaButton} href={ctaHref}>
                {ctaLabel}
              </Link>
            </div>
            <div className={styles.heroMedia}>
              <picture>
                <source
                  media="(min-width: 1024px)"
                  srcSet="/images/auth0-castle.svg"
                />
                <source
                  media="(min-width: 768px)"
                  srcSet="/images/auth0-castle-tablet.svg"
                />
                <img
                  className={styles.heroImage}
                  src="/images/auth0-castle-mobile.svg"
                  alt="Castle"
                  style={{ width: "100%", height: "auto" }}
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
