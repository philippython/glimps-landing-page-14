export type Messages = {
  common: {
    glimps: string;
    navbar: {
      home: string;
      pricing: string;
      about: string;
      login: string;
      getStarted: string;
    };
    submit: string;
    cancel: string;
  };
  about: Record<string, never>; // Empty object
  adminDashboard: Record<string, never>;
  index: Record<string, never>;
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
      button: string;
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
  pricing: Record<string, never>;
  register: {
    title: string;
    optionalTitle: {
      or: string;
      signIn: string;
    };
    form: {
      username: string;
      usernameTips: string;
      password: string;
      button: string;
    };
  };
  venueDashboard: Record<string, never>;
};