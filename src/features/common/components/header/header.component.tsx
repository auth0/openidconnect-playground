"use client";

import React from "react";
import styles from "./header.module.scss";
import Link from "next/link";
import Image from "next/image";
import { ThemeSwitcherComponent } from "../theme-switcher/theme-switcher.component";
import { usePathname } from "next/navigation";
import { linkPagesInfo } from "./utils";
import ControlIcon from "features/common/icons/control-icon";
import clsx from "clsx";

interface HeaderComponentProps {
  theme: string;
}

export const HeaderComponent: React.FC<HeaderComponentProps> = ({ theme }) => {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <nav className={styles.content}>
          <div className={styles.nav_container}>
            <Image
              src={"/images/openid-logo.svg"}
              alt="openid-connect logo"
              width={36}
              height={36}
              className={styles.logo_img}
            />
            <div>
              <h1 className={styles.logo_title}>OpenID Connect</h1>
              <h3 className={styles.logo_small_title}>Playground</h3>
            </div>
            <div className={styles.navTabs}>
              <ul className={styles.navList}>
                {linkPagesInfo.map((linkInfo) => {
                  return !linkInfo.isExternal ? (
                    <li
                      className={styles.navList__item}
                      role="menuitem"
                      key={linkInfo.id}
                      data-active={pathname === linkInfo.pathname}
                    >
                      <Link href={linkInfo.pathname}>{linkInfo.label}</Link>
                    </li>
                  ) : (
                    <li
                      className={clsx(
                        styles.navList__item,
                        linkInfo.id === "shop"
                          && styles.navList__external__link
                      )}
                      role="menuitem"
                      key={linkInfo.label}
                    >
                      <a href={linkInfo.pathname} target="_blank">
                        {linkInfo.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className={styles.icon__container}>
            <ThemeSwitcherComponent theme={theme} />
            <ControlIcon />
          </div>
        </nav>
      </div>
    </div>
  );
};
