import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const PrimaryFont = Inter({
  style: ["normal"],
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
});

export const SecondaryFont = localFont({
  src: [
    {
      path: "./fonts/Aeonik-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Aeonik-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Aeonik-Bold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
});

export const MonoFont = localFont({
  src: [
    {
      path: "./fonts/AeonikMono-Medium.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-mono",
});
