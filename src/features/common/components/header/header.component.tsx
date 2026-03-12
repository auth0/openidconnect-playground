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
    <div className={styles.header}>
      <div className={styles.headerWrapper}>
        <nav className={styles.headerContent}>
          <div className={styles.headerNav}>
            <Image
              src={"/images/openid-logo.svg"}
              alt="openid-connect logo"
              width={36}
              height={36}
              className={styles.headerLogo}
            />
            <div>
              <h1 className={styles.headerLogoTitle}>OpenID Connect</h1>
              <h3 className={styles.headerLogoSmallTitle}>Playground</h3>
            </div>
            <div className={styles.headerTabs}>
              <ul className={styles.headerNavList}>
                {linkPagesInfo.map((linkInfo) => {
                  return !linkInfo.isExternal ? (
                    <li
                      className={styles.headerItem}
                      role="menuitem"
                      key={linkInfo.id}
                      data-active={pathname === linkInfo.pathname}
                    >
                      <Link href={linkInfo.pathname}>{linkInfo.label}</Link>
                    </li>
                  ) : (
                    <li
                      className={clsx(
                        styles.headerItem,
                        linkInfo.id === "shop"
                          && styles.headerExternalLink
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
          <div className={styles.headerIcons}>
            <ThemeSwitcherComponent theme={theme} />
            <ControlIcon />
          </div>
        </nav>
      </div>
    </div>
  );
};
