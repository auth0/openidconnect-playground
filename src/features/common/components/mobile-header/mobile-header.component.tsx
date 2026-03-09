"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./mobile-header.module.scss";
import Image from "next/image";
import { MobileMenuStateValues } from "./mobile-header.utils";
import { linkPagesInfo } from "../header/utils";
import { ThemeSwitcherComponent } from "../theme-switcher/theme-switcher.component";
import ControlIcon from "features/common/icons/control-icon";

interface MobileHeaderComponentProps {
  theme: string;
}

export const MobileHeaderComponent: React.FC<MobileHeaderComponentProps> = ({
  theme,
}) => {
  const pathname = usePathname();
  const [currentPathname, setCurrentPathname] = useState<string | null>(null);
  const [mobileMenuState, setMobileMenuState] = useState(
    MobileMenuStateValues.CLOSED
  );

  const closeMobileMenu = useCallback(() => {
    document.body.classList.remove("mobile-scroll-lock");
    setMobileMenuState(MobileMenuStateValues.CLOSED);
  }, []);

  const openMobileMenu = useCallback(() => {
    document.body.classList.add("mobile-scroll-lock");
    setMobileMenuState(MobileMenuStateValues.OPEN);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    if (mobileMenuState === MobileMenuStateValues.OPEN) {
      closeMobileMenu();

      return;
    }

    openMobileMenu();
  }, [closeMobileMenu, mobileMenuState, openMobileMenu]);

  const handleLinkClick = useCallback(
    (isActive: boolean) => {
      if (isActive) {
        closeMobileMenu();
      }
    },
    [closeMobileMenu]
  );
useEffect(() => {
    if (currentPathname !== pathname) {
      closeMobileMenu();
      setCurrentPathname(pathname);
    }
  }, [closeMobileMenu, currentPathname, pathname]);
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerWrapper}>
          <nav className={styles.headerContent}>
            <div className={styles.headerLogo}>
              <Image
                src={"/images/openid-logo.svg"}
                alt="openid-connect logo"
                width={36}
                height={36}
                className={styles.headerImageLogo}
              />
              <div>
                <h1 className={styles.logo_title}>OpenID Connect</h1>
                <h3 className={styles.logo_small_title}>Playground</h3>
              </div>
            </div>
            <ControlIcon />
            <button
              className={styles.burgerIconWrapper}
              onClick={toggleMobileMenu}
              aria-label={
                mobileMenuState === MobileMenuStateValues.OPEN
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={mobileMenuState === MobileMenuStateValues.OPEN}
            >
              <span
                className={styles.burgerIcon}
                aria-hidden={mobileMenuState === MobileMenuStateValues.CLOSED}
              />
            </button>
          </nav>
        </div>
      </div>
      <section
        className={styles.menu}
        aria-hidden={mobileMenuState === MobileMenuStateValues.CLOSED}
      >
        <div className={styles.menuContainer}>
          <div className={styles.menuContent}>
            <ul className={styles.menuList}>
              {linkPagesInfo.map((link) => {
                const linkPath = link.pathname;

                const isActiveLink = pathname === link.pathname;

                return (
                  <li
                    key={link.label}
                    className={styles.menuItem}
                    role="menuitem"
                  >
                    <Link
                      {...(link.isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      href={linkPath}
                      className={styles.menuItemLink}
                      data-active={isActiveLink}
                      onClick={() => handleLinkClick(isActiveLink)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className={styles.menuItemAction} role="menuitem">
                <p>Switch Theme</p>
                <ThemeSwitcherComponent theme={theme} />
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
