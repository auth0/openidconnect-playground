"use client";
import { DebuggerPickerComponent } from "features/common/components/debugger-picker/debugger-picker.component";
import styles from "./debugger-toolbar.module.scss";
import ConfigurationIcon from "features/common/icons/configuration-icon";
import { useState } from "react";
import { ConfigurationModal } from "../configuration-modal/configuration-modal.component";

export const DebuggerToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <p className={styles.title}>Debugger</p>
            <div className={styles.container_options}>
              <DebuggerPickerComponent
                label="Mode"
                options={[
                  { value: "OAuth2", label: "OpenID Connect + OAuth2" },
                ]}
                minWidth={"180px"}
                placeholder=""
              />
              <div className={styles.separator_line} />
              <div
                className={styles.button_container}
                onClick={() => setIsOpen(true)}
              >
                <ConfigurationIcon />
                <p>Configuration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfigurationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
