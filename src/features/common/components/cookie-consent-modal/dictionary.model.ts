export interface LinkMetadataModel {
  label: string;
  path: string;
}

export interface ImageMetadataModel {
  url: string;
  alt: string;
}

export interface StaticImageMetadataModel {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface LayoutDictionaryModel {
  ribbon: {
    cta: {
      title: string;
      description: string;
      link: string;
    };
    themePicker: {
      themes: {
        code: string;
        label: string;
      }[];
    };
    languagePicker: {
      languages: {
        code: string;
        label: string;
      }[];
    };
  };
  footer: {
    site: {
      url: string;
      label: string;
    };
    copyright: string;
    resources: {
      title: string;
      links: LinkMetadataModel[];
    };
    legal: {
      title: string;
      links: LinkMetadataModel[];
      modalTriggers: {
        text: string;
        icon?: ImageMetadataModel;
      }[];
    };
    social: {
      title: string;
      links: {
        youtube: LinkMetadataModel;
        facebook: LinkMetadataModel;
        twitter: LinkMetadataModel;
        linkedin: LinkMetadataModel;
        discord: LinkMetadataModel;
      };
    };
    modal: {
      title: string;
      content: string;
      list: {
        id: string;
      }[];
    };
  };
  errors: {
    notFound: {
      message: string;
      link: LinkMetadataModel;
    };
    error: {
      message: string;
      actions: {
        tryAgain: {
          label: string;
        };
        report: LinkMetadataModel;
      };
    };
  };
  logos: {
    site: StaticImageMetadataModel;
    auth0: StaticImageMetadataModel;
  };
}


export const enLayoutDictionary: LayoutDictionaryModel = {
  ribbon: {
    cta: {
      title: `Ready to implement a secure alternative to passwords?`,
      description: "Get the Passkeys Handbook",
      link: "https://auth0.com/resources/ebooks/the-passkeys-handbook?utm_source=learnpasskeys&utm_medium=microsites&utm_campaign=passkeys",
    },
    themePicker: {
      themes: [
        {
          code: "dark",
          label: "Dark",
        },
        {
          code: "light",
          label: "Light",
        },
      ],
    },
    languagePicker: {
      languages: [
        {
          code: "en",
          label: "English",
        },
        {
          code: "ja",
          label: "日本語",
        },
      ],
    },
  },
  footer: {
    site: {
      url: "/",
      label: "OpenID Playground",
    },
    copyright: `Copyright © ${new Date().getFullYear()} Okta. All rights reserved.`,
    resources: {
      title: "Powered by Auth0",
      links: [
        {
          label: "JWT",
          path: "https://jwt.io/",
        },
        {
          label: "Webauthn",
          path: "https://webauthn.me/",
        },
        {
          label: "Zanzibar Academy",
          path: "https://academy.auth0.com/",
        },
        {
          label: "OpenID",
          path: "https://openidconnect.net/",
        },
      ],
    },
    legal: {
      title: "LEGAL",
      links: [
        {
          label: "Privacy Policy",
          path: "https://www.okta.com/privacy-policy/",
        },
        {
          label: "Security",
          path: "https://trust.okta.com/",
        },
      ],
      modalTriggers: [
        {
          text: "Your Privacy Choices",
          icon: {
            url: "https://cdn.auth0.com/website/footer/ccpa.svg",
            alt: "A button that resembles a pill is divided into two pieces: on the right side, there’s an X mark; on the left side, there’s a checkmark.",
          },
        },
      ],
    },
    social: {
      title: "Community",
      links: {
        youtube: {
          label: "YouTube",
          path: "https://www.youtube.com/oktadev",
        },
        facebook: {
          label: "Facebook",
          path: "https://www.facebook.com/Okta/",
        },
        twitter: {
          label: "Twitter",
          path: "https://x.com/auth0",
        },
        linkedin: {
          label: "LinkedIn",
          path: "https://www.linkedin.com/company/oktadev/",
        },
        discord: {
          label: "Discord",
          path: "https://discord.gg/auth0",
        },
      },
    },
    modal: {
      title: "Your Privacy Choices",
      content:
        "Depending on your state of residence, including if you are a California resident, you have the right to opt out of certain sharing of personal information with third-party ad partners. We may share personal information with third-party ad partners, such as through cookies or by providing lists of email addresses for potential customers, so that we can reach them across the web with relevant ads.",
      list: [
        {
          id: "cookies",
        },
        {
          id: "email",
        },
      ],
    },
  },
  errors: {
    notFound: {
      message: "Sorry, the page that you were looking for doesn't exist.",
      link: {
        path: "/",
        label: "Go home",
      },
    },
    error: {
      message: "Sorry, an error occurred.",
      actions: {
        tryAgain: {
          label: "Try again",
        },
        report: {
          label: "Report this error",
          path: "https://community.auth0.com/new-topic?category=passkeys&tags=feedback,playground&title=%5BError%20Report%5D%20&body=%28Please%20share%20details%20on%20the%20error%20that%20you%20encountered.%29",
        },
      },
    },
  },
  logos: {
    site: {
      src: "/images/openid-logo.svg",
      alt: "OpenID Connect logo",
      width: 36,
      height: 36,
    },
    auth0: {
      src: "/images/auth0-footer-logo-dark.svg",
      alt: "This logo has the word “Auth0” and a shield on its left side. The shield has a four-pointed star inside, which spans across its surface.",
      width: 220,
      height: 32,
    },
  },
};

