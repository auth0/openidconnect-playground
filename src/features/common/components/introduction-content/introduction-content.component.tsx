import Image from "next/image";
import styles from "./introduction-content.module.scss";

type Resource = {
  id: string;
  label: string;
  href: string;
  isFeatured?: boolean;
};

const resources: Resource[] = [
  {
    id: "handbook",
    label: "The OpenID Connect Handbook - free eBook",
    href: "https://auth0.com/resources/ebooks/the-openid-connect-handbook?ref=oidc-microsite",
    isFeatured: true,
  },
  {
    id: "standards",
    label: "The OpenID Connect Standards site",
    href: "https://openid.net/",
  },
  {
    id: "faq",
    label: "OpenID Connect FAQ and Q&As",
    href: "https://openid.net/connect/faq/",
  },
  {
    id: "blog",
    label: "OpenID Connect posts on Auth0 Blog",
    href: "https://auth0.com/blog/search/?query=open%20id%20connect&page=1",
  },
];

export const IntroductionContent = () => {
  return (
    <section className={styles.container} aria-labelledby="intro-welcome-title">
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.title} id="intro-welcome-title">
              Welcome to the OpenID Connect Playground!
            </h2>
            <p className={styles.paragraph}>
              This project was created at Auth0 to educate developers about OpenID
              Connect (also known as OIDC) and allow users to play with and test every
              step of the OpenID Connect login process.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.title}>What is OpenID Connect/OIDC?</h2>
            <p className={styles.paragraph}>
              OIDC was created as an identity layer for OAuth 2.0-- because while OAuth
              provides a solid standard for user Authentication (proving they are who they
              say they are), developers needed a standard way of expressing user identity.
              Before, getting the same pieces of user information could be a completely
              different process for each OAuth provider. But with OIDC, you get the same
              fields in the same format, from any provider (as long as they implement OIDC!).
            </p>
            <p className={styles.paragraph}>
              You can learn even more about OIDC at the following resources:
            </p>

            <ul className={styles.resourcesList}>
              {resources.map((resource) => (
                <li key={resource.id}>
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resourceCard}
                    data-featured={resource.isFeatured}
                  >
                    <div className={styles.iconShell}>
                      <Image
                        src="/images/openid-logo.svg"
                        width={18}
                        height={18}
                        alt=""
                        aria-hidden="true"
                        className={styles.icon}
                      />
                    </div>
                    <span>{resource.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.title}>How will the playground help?</h2>
            <p className={styles.paragraph}>
              The playground allows users to see and test each step in the OIDC, with an
              Auth0 template, a Google Accounts API template, or adding your own OIDC URLs.
              This is so users can not only learn more about OIDC, but test their own
              implementation and see each step working in series to create a robust login
              solution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
