import { LinkButton } from "../button/button.component";
import styles from "./handbook-banner.module.scss";

export const HandbookBanner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.textContainer}>
            <div className={styles.textGroup}>
              <p className={styles.title}>Get the openID Handbook</p>
              <p className={styles.subtitle}>
                Download it now for free and  get up-to-speed faster.
              </p>
            </div>
            <div className={styles.buttonContainer}>
              <LinkButton
                label="Download Ebook"
                href="https://auth0.com/resources/ebooks/the-openid-connect-handbook?utm_source=openidconnect&utm_medium=gc_banner&utm_campaign=oidc_gc_banner_12_2019"
              />
            </div>
          </div>
          <div className={styles.imageContainer}>
            <img
              className={styles.bgPattern}
              src="/images/handbook-bg-pattern.svg"
              alt=""
              aria-hidden="true"
            />
            <div className={styles.book}>
              <img
                className={styles.bookCover}
                src="/images/handbook-cover.svg"
                alt="The OpenID Connect Handbook by Bruno Krebs"
              />
              <img
                className={styles.bookTexture}
                src="/images/handbook-texture.svg"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
