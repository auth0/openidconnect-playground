import Image from "next/image";
import { LinkButton } from "../button/button.component";
import styles from "./handbook-banner.module.scss";

export const HandbookBanner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.left_container}>
            <p className={styles.title}>Get the OpenID Handbook</p>
            <p className={styles.subtitle}>
              Download it now for free and get up-to-speed faster.
            </p>
            <div className={styles.button_container}>
              <LinkButton
                label="Download Ebook"
                href="https://auth0.com/resources/ebooks/the-openid-connect-handbook?utm_source=openidconnect&utm_medium=gc_banner&utm_campaign=oidc_gc_banner_12_2019"
              />
            </div>
          </div>
          <div className={styles.right_container}>
            <Image
              src={"/images/book.png"}
              width={250}
              height={250}
              alt="openid connect handbook"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
