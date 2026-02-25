import Image from "next/image";
import { LinkButton } from "../button/button.component";
import styles from "./auth0-banner.module.scss";

export const Auth0Banner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.left_container}>
            <p className={styles.title}>
              The OIDC playground is brought to you by Auth0
            </p>
            <p className={styles.subtitle}>
              A cloud service, APIs and tools that eliminate the friction of identity for your applications and APIs.
            </p>
            <div className={styles.button_container}>
              <LinkButton
                label="Try Auth0 for free"
                href="https://auth0.com/signup/?utm_source=openidconnect.net&utm_medium=microsites&utm_campaign=devn_signup"
                showIcon={false}
              />
            </div>
          </div>
          <div className={styles.right_container}>
            <div className={styles.background_layout}></div>
            <Image
              src={"/images/auth0-banner.svg"}
              width={365}
              height={425}
              alt="openid connect handbook"
              className={styles.banner_image}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
