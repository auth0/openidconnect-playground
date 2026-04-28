import React from "react";
import Image from "next/image";
import styles from "./hero-jumbotron.module.scss";
import Link from "next/link";

export const HeroJumbotronComponent: React.FC = () => {
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

              <Link className={styles.heroCtaButton} href={"/test"}>
                Try it now
              </Link>
            </div>
            <div className={styles.heroMedia}>
              <Image
                className={styles.heroImage}
                src={"/images/castle.png"}
                alt={"Castle"}
                sizes="100vw"
                priority
                style={{
                  width: "100%",
                  height: "auto",
                }}
                height={1200}
                width={1600}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
