export type Messages = {
  common: {
    glimps: string;
    navbar: {
      home: string;
      pricing: string;
      about: string;
      login: string;
      getStarted: string;
      venueDashboard: string;
      adminDashboard: string;
      userDashboard: string;
    },
    footer: {
      trademark: string;
      quote: string;
      menu: string;
      contactUs: string;
      email: string;
      phone: string;
      phoneNoSpace: string;
      address: string;
    },
    submit: string;
    cancel: string;
  };
  index: {
    hero: {
      tagline: string;
      title: {
        first: string;
        highlight: string;
        last: string;
      };
      description: string;
      links: {
        viewPricing: string;
        learnMore: string;
      };
      footer: string;
    };
    features: {
      title: string;
      description: string;
      preiumExperience: {
        title: string;
        description: string;
      };
      customerEngagement: {
        title: string;
        description: string;
      };
      revenueGeneration: {
        title: string;
        description: string;
      };
      socialMedia: {
        title: string;
        description: string;
      };
    };
    howItWorks: {
      tagline: string;
      title: string;
      keyPoints: {
        1: {
          number: string;
          title: string;
          description: string;
        };
        2: {
          number: string;
          title: string;
          description: string;
        };
        3: {
          number: string;
          title: string;
          description: string;
        };
      };
      cta: string;
    };
    testimonials: {
      title: string;
      description: string;
      [key: string]: {
        author: string;
        position: string;
        quote: string;
      } | string;
    };
    stats: {
      title: string;
      description: string;
      increaseCustomerDwellTime: {
        value: string;
        label: string;
      };
      increaseSales: {
        value: string;
        label: string;
      };
      mediaImpressions: {
        value: string;
        label: string;
      };
    };
    cta: {
      title: string;
      description: string;
      links: {
        seePricing: string;
        learnMore: string;
      };
    };
  };
  pricing: Record<string, never>;
  about: {
    title: string;
    description: string;
    ourStory: {
      title: string;
      description: {
        description1: string;
        description2: string;
        description3: string;
        description4: string;
      };
    };
    ourValues: {
      title: string;
      description: string;
      quality: {
        title: string;
        description: string;
      };
      partnerSuccess: {
        title: string;
        description: string;
      };
      innovation: {
        title: string;
        description: string;
      };
      service: {
        title: string;
        description: string;
      };
    };
  };
  login: {
    title: string;
    optionalTitle: {
      or: string;
      createAnAccount: string;
    };
    form: {
      username: string;
      usernameTips: string;
      password: string;
      button: {
        signIn: string,
        loading: string
      }
    };
  };
  notFound: {
    message: string;
    button: string;
  };
  photoGallery: {
    invalidId: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
    };
    noPhotoFound: {
      title: string;
      message: string;
    };
    title: string;
    photos: string;
    buttons: {
      downloadAll: string;
      download: string;
    };
    footer: {
      trademark: string;
      message: string;
    };
  };
  register: {
    title: string;
    optionalTitle: {
      or: string;
      login: string;
    };
    form: {
      username: {
        label: string;
        placeholder: string;
      };
      email: {
        label: string;
        placeholder: string;
      };
      password: {
        label: string;
        placeholder: string;
      };
      confirmPassword: {
        label: string;
        placeholder: string;
      };
      button: {
        createAccount: string;
        loading: string;
      };
    };
    messages: {
      usernameTooShort: string;
      emailInvalid: string;
      passwordTooShort: string;
      passwordMismatch: string;
      failedToCreateAccount: string;
      accountCreated: string;
      failed: string;
    };
  };
  venueDashboard: {
    navItems: {
      sessions: string;
      usersList: string;
      venueSettings: string;
      accountSettings: string;
      search: string;
      signOut: string;
    },
    sessions: {
      UUID: string;
      userUUID: string;
      sentToUser: string;
      timestamp: string;
      actions: string;
      isPhotoSent: {
        yes: string;
        no: string;
      },
      viewPhoto: string;
      userPhoto: string;
      viewSession: string;
      noPhotoFound: string;
    },
    usersList: {
      UUID: string;
      phoneNumber: string;
      telegram: string;
      lastsession: string;
      createdAt: string;
      actions: string;
      viewLastPhotos: string;
      noPhotos: string;
      noUsers: string;
    },
    venueSettings: {
      title: {
        create: string;
        edit: string;
      },
      description: string;
      form: {
        venueName: {
          label: string;
          placeholder: string;
        },
        contactNumber: {
          label: string;
          placeholder: string;
        },
        venue_logo: {
          label: string;
          button: string;
          helper: string;
        },
        logoPosition: {
          label: string;
          placeholder: string;
        },
        logoRatio: {
          label: string;
          helper: {
            max: string;
            min: string;
          },
          description: string;
        },
        logoTransparency: {
          label: string;
          helper: {
            max: string;
            min: string;
          },
          description: string;
        },
        button: {
          create: string;
          edit: string;
          signout: string;
        }
      },
      messages: {
        venueNameTooShort: string;
        contactNumberTooShort: string;
        missingLogo: string;
        exceededLogoSize: string;
        invalidLogoType: string;
      },
      logoPosition: {
        topLeft: string;
        topRight: string;
        topCenter: string;
        bottomLeft: string;
        bottomRight: string;
        bottomCenter: string;
        centerLeft: string;
        centerRight: string;
        center: string;
      }
    },
    accountSettings: {
      title: string;
      changePasswordTitle: string;
      form: {
        username: {
          label: string;
          placeholder: string;
          description: string;
        };
        email: {
          label: string;
          placeholder: string;
          description: string;
        };
        newPassword: {
          label: string;
          placeholder: string;
        };
        confirmPassword: {
          label: string;
          placeholder: string;
        };
        buttons: {
          updateProfile: string;
          updatingProfile: string;
          updatePassword: string;
          updatingPassword: string;
        };
      };
      message: {
        usernameTooShort: string;
        emailInvalid: string;
        passwordTooShort: string;
        passwordMismatch: string;
        profileUpdated: string;
        profileUpdateFailed: string;
        passwordUpdated: string;
        passwordUpdateFailed: string;
      }
    }
    messages: {
      successUpdateVenue: string;
      failedUpdateVenue: string;
    }
  };
  adminDashboard: Record<string, never>;
}