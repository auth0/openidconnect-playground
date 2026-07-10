import React, { MouseEvent } from "react";
import styles from "./cookie-consent-modal.module.scss";
import { modalsDictionary } from "./modals-dictionary";
import { LayoutDictionaryModel } from "./dictionary.model";

type CookieConsentModalComponentProps = {
  dictionary: LayoutDictionaryModel["footer"];
  modalState: ModalStateValues;
  handleBackdropClick: () => void;
  handleModalClick: (e: MouseEvent<HTMLDivElement>) => void;
  closeModal: () => void;
};

export enum ModalStateValues {
  CLOSED = "closed",
  OPEN = "open",
}

export const CookieConsentModalComponent: React.FC<
  CookieConsentModalComponentProps
> = ({
  dictionary,
  modalState,
  handleBackdropClick,
  handleModalClick,
  closeModal,
}) => {
  return (
    <div
      className={styles.backdrop}
      aria-hidden={modalState === ModalStateValues.CLOSED}
      onClick={handleBackdropClick}
    >
      <div className={styles.wrapper} onClick={handleModalClick}>
        <div className={styles.modal}>
          <button className={styles.modal__closeButton} onClick={closeModal} />
          <div className={styles.modal__header}>
            <h4 className={styles.modal__title}>{dictionary.modal.title}</h4>
          </div>
          <div className={styles.modal__body}>
            <p className={styles.modal__paragraph}>
              {dictionary.modal.content}
            </p>
            <ul className={styles.modal__list}>
              {dictionary.modal.list.map(({ id }) => {
                const entry = modalsDictionary[id] || null;

                return (
                  <li className={styles.modal__listItem} key={id}>
                    {entry && <entry.Modal />}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
