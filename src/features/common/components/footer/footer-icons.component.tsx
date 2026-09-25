import styles from "./footer.module.scss";
import React from "react";
import { LayoutDictionaryModel } from "../cookie-consent-modal/dictionary.model";
import { YoutubeIcon } from "features/common/icons/youtube.icon";
import { XIcon } from "features/common/icons/x.icon";
import { LinkedinIcon } from "features/common/icons/linkedin.icon";

interface FooterIconsComponentProps {
  dictionary: LayoutDictionaryModel["footer"]["social"];
}

export const FooterIconsComponent: React.FC<FooterIconsComponentProps> = ({
  dictionary,
}) => (
  <div className={styles.socialWrapper}>
    <a
      href={dictionary.links.youtube.path}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dictionary.links.youtube.label}
    >
      <YoutubeIcon />
    </a>
    <a
      href={dictionary.links.twitter.path}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dictionary.links.twitter.label}
    >
      <XIcon />
    </a>
    <a
      href={dictionary.links.linkedin.path}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dictionary.links.linkedin.label}
    >
      <LinkedinIcon />
    </a>
  </div>
);
