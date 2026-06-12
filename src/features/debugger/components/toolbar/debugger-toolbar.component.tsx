"use client";
import { DebuggerPickerComponent } from "features/common/components/debugger-picker/debugger-picker.component";
import styles from "./debugger-toolbar.module.scss";
import ConfigurationIcon from "features/common/icons/configuration-icon";

type DebugerToolbarProps = {
  openModal: () => void;
};

export const DebuggerToolbar = ({ openModal }: DebugerToolbarProps) => {
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
              <div className={styles.toolbarButtonContainer} onClick={openModal}>
                <ConfigurationIcon />
                <p>Configuration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
