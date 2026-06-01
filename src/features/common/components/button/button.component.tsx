import { ArrowIcon } from "features/common/icons/arrow.icon";
import styles from "./button.module.scss";
import clsx from "clsx";

export const Button = ({
  label,
  onClick,
  variant="normal",
}: {
  label: string;
  onClick?: () => void;
  variant?: "normal" | "transparent";
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        variant === "normal"
          ? styles.button_variant_normal
          : styles.button_variant_transparent
      )}
      onClick={onClick}
    >
      {label}
      <div className={styles.button_arrow}>
        <ArrowIcon />
      </div>
    </button>
  );
};
