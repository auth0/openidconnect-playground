type LinkInfo = {
  id: string;
  label: string;
  pathname: string;
  isExternal?: boolean;
};

export const linkPagesInfo: Array<LinkInfo> = [
  {
    id: "debugger",
    label: "Debugger",
    pathname: "/",
  },
  {
    id: "introduction",
    label: "Introduction",
    pathname: "/introduction",
  },
  {
    id: "community",
    label: "Community",
    pathname: "https://community.auth0.com/",
    isExternal: true,
  },
];
