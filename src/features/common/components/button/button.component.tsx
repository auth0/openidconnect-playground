import { ArrowIcon } from "features/common/icons/arrow.icon";
import styles from "./button.module.scss";
import clsx from "clsx";

type BaseButtonProps = {
  label: string;
};

type ButtonVariant = "default" | "transparent" | "gradient";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default: styles.button_variant_default,
  transparent: styles.button_variant_transparent,
  gradient: styles.button_variant_gradient,
};

type CommonButtonProps = {
  variant?: ButtonVariant;
  showIcon?: boolean;
} & BaseButtonProps;

const ButtonBase = ({ label }: BaseButtonProps) => {
  return <span>{label}</span>;
};

type ButtonProps = {
  onClick?: () => void;
  isLoading?: boolean;
} & CommonButtonProps;

export const Button = ({
  label,
  onClick,
  variant = "default",
  isLoading = false,
  showIcon = true,
}: ButtonProps) => {
  return (
    <button
      className={clsx(styles.button, VARIANT_CLASS[variant])}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className={styles.spinner} role="status">
          <span className={styles.visually_hidden}>Loading...</span>
        </div>
      ) : (
        <>
          <ButtonBase label={label} />
          {showIcon && (
            <div className={styles.button_arrow}>
              <ArrowIcon />
            </div>
          )}
        </>
      )}
    </button>
  );
};

type LinkButtonProps = {
  href: string;
} & CommonButtonProps;

export const LinkButton = ({
  label,
  href,
  showIcon = true,
  variant = "default",
}: LinkButtonProps) => {
  return (
    <a
      className={clsx(styles.button, VARIANT_CLASS[variant])}
      href={href}
    >
      <ButtonBase label={label} />
      {showIcon && (
        <div className={styles.button_arrow}>
          <ArrowIcon />
        </div>
      )}
    </a>
  );
};
