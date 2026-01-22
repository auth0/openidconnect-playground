import { ArrowIcon } from "features/common/icons/arrow.icon";
import styles from "./button.module.scss";
import clsx from "clsx";

type BaseButtonProps = {
  label: string;
};

type CommonButtonProps = {
  variant?: "default" | "transparent";
} & BaseButtonProps;

const ButtonBase = ({ label }: BaseButtonProps) => {
  return <span>{label}</span>;
};

type ButtonProps = {
  onClick?: () => void;
} & CommonButtonProps;

export const Button = ({
  label,
  onClick,
  variant = "default",
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        styles.button,
        variant === "default"
          ? styles.button_variant_default
          : styles.button_variant_transparent,
      )}
      onClick={onClick}
    >
      <ButtonBase label={label} />
      <div className={styles.button_arrow}>
        <ArrowIcon />
      </div>
    </button>
  );
};

type LinkButtonProps = {
  href: string;
} & CommonButtonProps;

export const LinkButton = ({
  label,
  href,
  variant = "default",
}: LinkButtonProps) => {
  return (
    <a
      className={clsx(
        styles.button,
        variant === "default"
          ? styles.button_variant_default
          : styles.button_variant_transparent,
      )}
      href={href}
    >
      <ButtonBase label={label} />
      <div className={styles.button_arrow}>
        <ArrowIcon />
      </div>
    </a>
  );
};
