import { AlertIcon } from "features/common/icons/alert.icon";
import { CloseCircleIcon } from "features/common/icons/close-circle.icon";
import { ErrorIcon } from "features/common/icons/error.icon";
import styles from "./configuration-modal.module.scss";
import { Button } from "features/common/components/button/button.component";
import { useState } from "react";

export type InitialModalData = {
  domain: string;
  serverTemplate: string;
  authEndpoint: string;
  tokenEndpoint: string;
  tokenKeysEndpoint: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  audience: string;
};

type ModalOptions = {
  name: keyof InitialModalData;
  title: string;
  defaultValue: string | null;
  type: "input" | "select";
  options?: { label: string; value: string }[];
  readOnly?: boolean;
  optional?: boolean;
};

const MODAL_OPTIONS: ModalOptions[] = [
  {
    name: "serverTemplate",
    title: "Server template",
    defaultValue: "auth0",
    type: "select",
    options: [
      {
        label: "Auth0",
        value: "auth0",
      },
      {
        label: "Google",
        value: "google",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ],
  },
  {
    name: "domain",
    title: "Domain",
    defaultValue: "sample.auth0.com",
    type: "input",
  },
  {
    name: "authEndpoint",
    title: "Endpoint",
    defaultValue: "sample.auth0.com/authorize",
    type: "input",
    readOnly: true,
  },
  {
    name: "tokenEndpoint",
    title: "Token Endpoint",
    defaultValue: "sample.auth0.com/oauth/token",
    type: "input",
    readOnly: true,
  },
  {
    name: "clientId",
    title: "OIDC Client ID",
    defaultValue: "",
    type: "input",
  },
  {
    name: "clientSecret",
    title: "OIDC Client Secret",
    defaultValue: "",
    type: "input",
  },
  {
    name: "scope",
    title: "Scope",
    defaultValue: "",
    type: "input",
  },
  {
    name: "audience",
    title: "Audience",
    defaultValue: "",
    type: "input",
    optional: true,
  },
];

const validateForm = (values: Record<string, string>): Record<string, string> =>
  MODAL_OPTIONS
    .filter((opt) => !opt.optional && !values[opt.name]?.trim())
    .reduce<Record<string, string>>((errors, opt) => {
      errors[opt.name] = `${opt.title} is required`;
      return errors;
    }, {});
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: InitialModalData;
  onSaveData: (data: InitialModalData) => void;
};
export const ConfigurationModal = ({
  isOpen,
  onClose,
  initialData,
  onSaveData,
}: ModalProps) => {
  const SERVER_URLS: Record<string, string> = {
    auth0: "https://sample.auth0.com/.well-known/openid-configuration",
    google: "https://accounts.google.com/.well-known/openid-configuration",
    custom: "",
  };
  const [formValues, setFormValues] = useState<Record<string, string>>(() => ({
    ...Object.fromEntries(
      MODAL_OPTIONS.map((opt) => [
        opt.name,
        initialData[opt.name] ?? opt.defaultValue,
      ]),
    ),
    tokenKeysEndpoint: initialData.tokenKeysEndpoint ?? "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [discoverError, setDiscoverError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { value, name } = e.target;
    setFormValues((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "domain" && prev.serverTemplate === "auth0") {
        next.authEndpoint = `https://${value}/authorize`;
        next.tokenEndpoint = `https://${value}/oauth/token`;
        next.tokenKeysEndpoint = `https://${value}/.well-known/jwks.json`;
      }
      return next;
    });
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };
  const handleServerChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { value } = e.target;
    if (!value || value === "custom") {
      setFormValues((prev) => {
        return {
          ...prev,
          authEndpoint: "",
          tokenEndpoint: "",
          tokenKeysEndpoint: "",
          domain: "",
        };
      });
      return;
    }
    try {
      setDiscoverError(null);
      setIsLoading(true);
      const queryString = new URLSearchParams({
        url: SERVER_URLS[value],
      }).toString();
      const response = await fetch(`api/discover?${queryString}`);
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Couldn't fetch the server data. Try again",
        );
      }
      const data = await response.json();
      setFormValues((prev) => {
        return {
          ...prev,
          authEndpoint: data.authorization_endpoint,
          tokenEndpoint: data.token_endpoint,
          tokenKeysEndpoint: data.jwks_uri,
          domain: value !== "auth0" ? SERVER_URLS[value] : "samples.auth0.com",
        };
      });
    } catch (error) {
      setIsLoading(false);
      setDiscoverError(
        error instanceof Error
          ? error.message
          : "Couldn't fetch the server data. Try again",
      );
      setFormValues((prev) => {
        return {
          ...prev,
          authEndpoint: "",
          tokenEndpoint: "",
          tokenKeysEndpoint: "",
        };
      });
    }
  };
  if (!isOpen) return null;
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.headingContainer}>
          <p className={styles.title}>OpenID Connect Configuration</p>
          <button onClick={onClose} aria-label="Close">
            <CloseCircleIcon />
          </button>
        </div>
        <div className={styles.content}>
          {MODAL_OPTIONS.map((modalOption) => {
            const { name, title, type, readOnly } = modalOption;
            let updatedTitle = title;
            let updatedReadOnly = readOnly;
            if (name === "domain" && formValues["serverTemplate"] !== "auth0") {
              updatedTitle = "Discovery Document URL";
              updatedReadOnly = true;
            }
            if (formValues["serverTemplate"] === "custom") {
              updatedReadOnly = false;
            }
            return (
              <div className={styles.input_container} key={name}>
                <label htmlFor={name}>{updatedTitle}</label>
                {type === "input" ? (
                  <>
                    <input
                      readOnly={updatedReadOnly}
                      id={name}
                      name={name}
                      value={formValues[name] ?? ""}
                      className={`${styles.input} ${errors[name] ? styles.input_error : ""}`}
                      onChange={handleInputChange}
                    />
                    {errors[name] && (
                      <span className={styles.error_message}>{errors[name]}</span>
                    )}
                  </>
                ) : (
                  <select
                    onChange={(e) => {
                      handleServerChange(e);
                      handleInputChange(e);
                    }}
                    id={name}
                    name={name}
                    disabled={isLoading}
                    value={formValues[name]}
                  >
                    {modalOption.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
          {discoverError && (
            <div className={styles.discover_error}>
              <ErrorIcon />
              <p>{discoverError}</p>
            </div>
          )}
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
                  className={styles.clearStorageButton}
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
            <Button
              label="Save"
              showIcon={false}
              onClick={() => {
                const validationErrors = validateForm(formValues);
                if (Object.keys(validationErrors).length > 0) {
                  setErrors(validationErrors);
                  return;
                }
                onSaveData(formValues as InitialModalData);
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
