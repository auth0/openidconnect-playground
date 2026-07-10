"use client";

import React, { useState } from "react";
import styles from "./cookie-consent-modal.module.scss"

const CookiesModal: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleOpenCookieSettings = () => {
    if (window.OneTrust?.ToggleInfoDisplay) {
      setStatusMessage("");
      window.OneTrust.ToggleInfoDisplay();
      return;
    }

    setStatusMessage("Cookie settings are temporarily unavailable. Please try again later.");
  };

  return (
    <>
      If you wish to opt out of this sharing of your personal data in connection
      with cookies, please update your{" "}
      <button
        className={styles.modal_button}
        onClick={handleOpenCookieSettings}
      >
        cookie settings
      </button>
      .
      {statusMessage ? (
        <span className={styles.modal_status} role="status" aria-live="polite">
          {statusMessage}
        </span>
      ) : null}
    </>
  );
};

const EmailModal: React.FC = () => {
  return (
    <>
      If you wish to opt out of email-based sharing, provide your email address
      at{" "}
      <a
        className={styles.modal_link}
        href="https://www.okta.com/your-privacy-choices"
        target="_blank"
        rel="noopener noreferrer"
      >
        this link
      </a>
      .
    </>
  );
};

export const modalsDictionary = {
  cookies: {
    Modal: CookiesModal,
  },
  email: {
    Modal: EmailModal,
  },
};

export type ModalId = keyof typeof modalsDictionary;
