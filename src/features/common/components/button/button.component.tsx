import { ArrowIcon } from "features/common/icons/arrow.icon";
import styles from "./button.module.scss";

export const Button = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {label}
      <div className={styles.button_arrow}>
        <ArrowIcon />
      </div>
    </button>
  );
};
