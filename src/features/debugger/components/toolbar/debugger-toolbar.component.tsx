"use client";
import { DebuggerPickerComponent } from "features/common/components/debugger-picker/debugger-picker.component";
import styles from "./debugger-toolbar.module.scss";
import { useState } from "react";
import ConfigurationIcon from "features/common/icons/configuration-icon";

export const DebuggerToolbar = () => {
  const [selectedOption, setSelectedOption] = useState("OAuth2");
  const handleSelection = (selection) => {
    console.log("handling selection@@@@@", selection);
    setSelectedOption(selection);
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <p className={styles.title}>Debugger</p>
          <div className={styles.container_options}>
            <DebuggerPickerComponent
              label="Mode"
              options={[{ value: "OAuth2", label: "OpenID Connect + OAuth2" }]}
              minWidth={"180px"}
              placeholder=""
            />
            <div className={styles.separator_line}/>
            <div className={styles.button_container}>
              <ConfigurationIcon />
              <p>Configuration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
