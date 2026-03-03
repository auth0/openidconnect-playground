"use client";

import React, { MouseEvent, useState } from "react";
import { FooterIconsComponent } from "./footer-icons.component";
import Image from "next/image";
import clsx from "clsx";

import styles from "./footer.module.scss";
import Link from "next/link";
import {
  SiteBrandComponent,
  StaticImageMetadataModel,
} from "../site-brand/site-brand.component";
import {
  CookieConsentModalComponent,
  ModalStateValues,
} from "../cookie-consent-modal/cookie-consent-modal.component";
import { MonoFont, SecondaryFont } from "libs/theme/fonts";
import { LayoutDictionaryModel } from "../cookie-consent-modal/dictionary.model";

interface FooterComponentProps {
  dictionary: LayoutDictionaryModel["footer"];
  siteLogo: StaticImageMetadataModel;
  auth0Logo: StaticImageMetadataModel;
}

export const FooterComponent: React.FC<FooterComponentProps> = ({
  dictionary,
  siteLogo,
  auth0Logo,
}) => {
  const [modalState, setModalState] = useState(ModalStateValues.CLOSED);

  const closeModal = () => {
    document.body.classList.remove("mobile-scroll-lock");
    setModalState(ModalStateValues.CLOSED);
  };

  const openModal = () => {
    document.body.classList.add("mobile-scroll-lock");
    setModalState(ModalStateValues.OPEN);
  };

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleBackdropClick = () => {
    closeModal();
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <div className={styles.siteLogo}>
              <SiteBrandComponent siteLogo={siteLogo} path="" />
            </div>
            <div className={styles.resources}>
              <span
                className={clsx(styles.resources__title, MonoFont.className)}
              >
                {dictionary.resources.title}
              </span>
              <ul className={styles.resource__list}>
                {dictionary.resources.links.map((item) => (
                  <li key={item.path}>
                    <a
                      className={styles.resource__anchor}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.resources}>
              <span
                className={clsx(styles.resources__title, MonoFont.className)}
              >
                {dictionary.legal.title}
              </span>
              <ul className={styles.resource__list}>
                {dictionary.legal.links.map((item) => (
                  <li key={item.path}>
                    <a
                      className={styles.resource__anchor}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                {dictionary.legal.modalTriggers.map((trigger) => (
                  <li key={trigger.text}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        openModal();
                      }}
                      className={clsx(
                        styles.resource__button,
                        SecondaryFont.className,
                      )}
                    >
                      {trigger.text}
                      {trigger.icon && (
                        <Image
                          height={14}
                          width={30}
                          className={styles.privacyIcon}
                          src={trigger.icon.url}
                          alt={trigger.icon.alt}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.resources}>
              <span
                className={clsx(styles.resources__title, MonoFont.className)}
              >
                {dictionary.social.title}
              </span>
              <ul className={styles.resource__list}>
                <FooterIconsComponent dictionary={dictionary.social} />
              </ul>
            </div>
            {/* TODO: Move privacy modal to a page like auth0.com */}
            <CookieConsentModalComponent
              dictionary={dictionary}
              modalState={modalState}
              handleBackdropClick={handleBackdropClick}
              handleModalClick={handleModalClick}
              closeModal={closeModal}
            />
          </div>
        </div>
      </div>
      <div className={styles.subFooter__container}>
        <div className={styles.subFooter__wrapper}>
          <div className={styles.subFooter__content}>
            <div className={styles.bottomSection}>
              <Link
                className={styles.bottomSection__logo}
                rel="noreferrer noopener"
                target="_blank"
                href="https://auth0.com/"
              >
                <Image
                  src={auth0Logo.src}
                  alt={auth0Logo.alt}
                  sizes="100vh"
                  style={{
                    width: "auto",
                    height: "100%",
                  }}
                  height={auth0Logo.height}
                  width={auth0Logo.width}
                />
              </Link>
              <span className={styles.bottomSection__copyright}>
                {dictionary.copyright}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
