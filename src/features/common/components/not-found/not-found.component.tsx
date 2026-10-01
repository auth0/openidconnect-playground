import { LinkButton } from "../button/button.component";
import { notFoundActions, notFoundContent } from "./not-found.model";
import styles from "./not-found.module.scss";

export const NotFoundComponent = () => {
  const { code, title, description } = notFoundContent;

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <p className={styles.code} aria-hidden="true">
          {code}
        </p>
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.actions}>
          {notFoundActions.map(({ id, label, href, variant }) => (
            <LinkButton
              key={id}
              label={label}
              href={href}
              variant={variant}
              showIcon={variant === "default"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
