import React from "react";
import styles from "./site-brand.module.scss";
import Image from "next/image";
import clsx from "clsx";
import { SecondaryFont } from "libs/theme/fonts";

export interface StaticImageMetadataModel {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface SiteBrandComponentProps {
  siteLogo: StaticImageMetadataModel;
  path: string;
  title?: string;
  subtitle?: string;
}

export const SiteBrandComponent: React.FC<SiteBrandComponentProps> = ({
  siteLogo,
  path,
  title = "OpenID",
  subtitle = "Playground",
}) => {
  return (
    <a className={styles.brand} href={path}>
      <Image
        className={styles.brand__logo}
        src={siteLogo.src}
        alt={siteLogo.alt}
        sizes="100vw"
        style={{
          height: "100%",
          width: "auto",
        }}
        width={siteLogo.width}
        height={siteLogo.height}
      />
      <div className={clsx(SecondaryFont.className, styles.brand__headline)}>
        <span className={styles.brand__title}>{title}</span>
        <span className={styles.brand__subtitle}>{subtitle}</span>
      </div>
    </a>
  );
};
