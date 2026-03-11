"use client";
import { DebuggerPickerComponent } from "features/common/components/debugger-picker/debugger-picker.component";
import styles from "./debugger-toolbar.module.scss";
import ConfigurationIcon from "features/common/icons/configuration-icon";

export const DebuggerToolbar = () => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarWrapper}>
        <div className={styles.toolbarContent}>
          <p className={styles.toolbarTitle}>Debugger</p>
          <div className={styles.toolbarOptionsContainer}>
            <DebuggerPickerComponent
              label="Mode"
              options={[{ value: "OAuth2", label: "OpenID Connect + OAuth2" }]}
              minWidth={"180px"}
            />
            <div className={styles.toolbarSeparatorLine} />
            <button className={styles.toolbarButtonContainer}>
              <ConfigurationIcon />
              <p>Configuration</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
