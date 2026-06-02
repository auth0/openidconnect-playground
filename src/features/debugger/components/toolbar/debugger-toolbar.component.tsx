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
      <div className={styles.toolbar}>
        <div className={styles.toolbarWrapper}>
          <div className={styles.toolbarContent}>
            <p className={styles.toolbarTitle}>Debugger</p>
            <div className={styles.toolbarOptionsContainer}>
              <DebuggerPickerComponent
                label="Mode"
                options={[
                  { value: "OAuth2", label: "OpenID Connect + OAuth2" },
                ]}
                minWidth={"180px"}
                placeholder=""
              />
              <div className={styles.toolbarSeparatorLine} />
              <div
                className={styles.toolbarButtonContainer}
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
