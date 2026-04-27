import { AlertIcon } from "features/common/icons/alert.icon";
import { CloseCircleIcon } from "features/common/icons/close-circle.icon";
import styles from "./configuration-modal.module.scss";
import { Button } from "features/common/components/button/button.component";

type ModalOptions = {
  title: string;
  defaultValue: string | null;
  type: "input" | "select";
  isEditable?: boolean;
  optional?: boolean;
};

const MODAL_OPTIONS: ModalOptions[] = [
  {
    title: "Server template",
    defaultValue: "Placeholder",
    type: "input",
  },
  {
    title: "Auth0 domain",
    defaultValue: "sample.auth0.com",
    type: "input",
  },
  {
    title: "Endpoint",
    defaultValue: "sample.auth0.com/authorize",
    type: "input",
    isEditable: false,
  },
  {
    title: "Token Endpoint",
    defaultValue: "sample.auth0.com/oauth/token",
    type: "input",
    isEditable: false,
  },
  {
    title: "OIDC Client ID",
    defaultValue: "Placeholder",
    type: "input",
  },
  {
    title: "Title",
    defaultValue: "Placeholder",
    type: "input",
  },
  {
    title: "Scope",
    defaultValue: "Placeholder",
    type: "input",
  },
  {
    title: "Audience",
    defaultValue: "Placeholder",
    type: "input",
  },
];
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
export const ConfigurationModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.heading_container}>
          <p className={styles.title}>OpenID Connect Configuration</p>
          <button onClick={onClose} aria-label="Close">
            <CloseCircleIcon />
          </button>
        </div>
        <div className={styles.content}>
          {MODAL_OPTIONS.map((modalOption, idx) => {
            return (
              <div className={styles.input_container} key={idx}>
                <label>{modalOption.title}</label>
                <input
                  defaultValue={modalOption.defaultValue}
                  className={styles.input}
                />
              </div>
            );
          })}
          <div className={styles.alert_container}>
            <div className={styles.alert_content_container}>
              <AlertIcon />
              <p>
                <strong>Note.</strong> We store stuff like your keys in
                LocalStorage so that when you redirect to authenticate, you
                don&apos;t lose them.
                <br />
                You can clear them by clicking on this button:{" "}
                <button
                  className={styles.clear_storage_button}
                  onClick={() => {
                    localStorage.clear();
                    onClose();
                    window.location.reload();
                  }}
                >
                  Clear Localstorage
                </button>
              </p>
            </div>
          </div>
          <div className={styles.button_container}>
            <Button label="Save" showIcon={false} />
          </div>
        </div>
      </div>
    </div>
  );
};
