type LinkInfo = {
    id: string
    label: string
    pathname: string
    isExternal?: boolean
}
export const linkPagesInfo: Array<LinkInfo> = [
    {
        id: "debugger",
        label: "Debugger",
        pathname: "/"
    },
    {
        id: "tutorial",
        label: "Tutorial",
        pathname: "/tutorial"
    },
    {
        id: "community",
        label: "Community",
        pathname: "https://community.auth0.com/",
        isExternal: true
    },
    {
        id: "shop",
        label: "Get a T-Shirt!",
        pathname: "https://auth0.myspreadshop.com/",
        isExternal: true
    }
]