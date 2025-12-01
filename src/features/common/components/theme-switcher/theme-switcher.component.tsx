"use client";

import React, { useState } from "react";
import styles from "./theme-switcher.module.scss";
import MoonIcon from "features/common/icons/moon.icon";
import { setTheme } from "features/common/actions/theme.action";
import { DEFAULT_THEME, THEMES } from "features/theme/theme.config";
import SunIcon from "features/common/icons/sun.icon";
import clsx from "clsx";

interface ThemeSwitcherComponentProps {
  theme: string;
}
export const ThemeSwitcherComponent: React.FC<ThemeSwitcherComponentProps> = ({
  theme,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const selectTheme = async (value: string) => {
    setIsDisabled(true);
    await setTheme(value);
    setIsDisabled(false);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.container}>
        <input
          type="checkbox"
          checked={theme === DEFAULT_THEME}
          onChange={(e) => {
            selectTheme(!e.target.checked ? THEMES[0] : THEMES[1]);
          }}
          aria-label="Toggle Theme"
          disabled={isDisabled}
          className={styles.toggle_input}
        />
        <span className={styles.toggle}>
          <span className={styles.thumb}></span>
          <span className={clsx(styles.icon, styles.moon)}>
            <MoonIcon />
          </span>
          <span className={clsx(styles.icon, styles.sun)}>
            {" "}
            <SunIcon/>
          </span>
        </span>
      </label>
    </div>
  );
};
