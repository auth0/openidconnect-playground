"use client";
import React from "react";
import styles from "./debugger-picker.module.scss";
import ReactSelect from "react-select";

interface PickerLabelProps {
  label?: string;
}


const PickerLabel: React.FC<PickerLabelProps> = ({ label }) => {
  return (
    <div className={styles.picker__label}>
      <span className={styles.picker__fullName}>{label}</span>
    </div>
  );
};

interface DebuggerPickerComponentProps {
  label?: string;
  options: {
    value: string;
    label: string;
  }[];
  placeholder?: string;
  minWidth?: string;
}

export const DebuggerPickerComponent: React.FC<
  DebuggerPickerComponentProps
> = ({
  label,
  options,
  placeholder,
  minWidth,
}) => {

  return (
    <div className={styles.picker} data-has-label={label !== null}>
      {label && <PickerLabel label={label} />}
      <ReactSelect
        instanceId={`debugger-picker-${label ?? "default"}`}
        aria-label={"Debugger picker"}
        className="react-select-container"
        options={options}
        defaultValue={options[0]}
        classNamePrefix={"react-select"}
        isSearchable={false}
        placeholder={placeholder}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "1.75rem",
            height: "1.75rem",
            padding: "4px",
            ...(minWidth ? { minWidth: minWidth } : {}),
          }),

          valueContainer: (base) => ({
            ...base,
            height: "1.75rem",
            padding: "0 8px",
          }),

          input: (base) => ({
            ...base,
            margin: "0px",
          }),
          indicatorSeparator: () => ({
            display: "none",
          }),
          indicatorsContainer: (base) => ({
            ...base,
            height: "1.75rem",
          }),
        }}
      ></ReactSelect>
    </div>
  );
};
