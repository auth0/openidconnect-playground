"use client";

import React from "react";
import styles from "./hero-jumbotron.module.scss";
import { useRouter } from "next/navigation";

type HeroJumbotronComponentProps = {
  ctaLabel?: string;
  ctaTargetId?: string;
};

export const HeroJumbotronComponent: React.FC<HeroJumbotronComponentProps> = ({
  ctaLabel = "Try it now",
  ctaTargetId = "debugger",
}) => {
  const router = useRouter();

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(ctaTargetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/?scrollTo=${ctaTargetId}`);
    }
  };

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

              <a className={styles.heroCtaButton} href={`/?scrollTo=${ctaTargetId}`} onClick={handleCtaClick}>
                {ctaLabel}
              </a>
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
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
