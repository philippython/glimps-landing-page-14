import { LogoPosition } from "@/service/fetchLoginTokenFromApi";
import { IntlShape } from "react-intl";
import { z } from "zod";

export const createVenueSchema = (intl: IntlShape) => {
  return z.object({
    name: z.string().min(2, {
      message: intl.formatMessage({
        id: "venueDashboard.venueSettings.messages.venueNameTooShort"
      })
    }),
    contact_num: z.string().min(5, {
      message: intl.formatMessage({
        id: "venueDashboard.venueSettings.messages.contactNumberTooShort"
      })
    }),
    venue_logo: z.instanceof(File, {
      message: intl.formatMessage({
        id: "venueDashboard.venueSettings.messages.missingLogo"
      })
    })
      .refine(
        file => file.size <= import.meta.env.VITE_LOGO_MAX_FILE_SIZE * 1024 * 1024,
        intl.formatMessage({
          id: "venueDashboard.venueSettings.messages.exceededLogoSize"
        })
      )
      .refine(
        file => import.meta.env.VITE_ACCEPTED_LOGO_FILE_TYPES
          .split(",")
          .includes(file.type),
        intl.formatMessage({
          id: "venueDashboard.venueSettings.messages.invalidLogoType"
        })
      ),
    logo_position: z.nativeEnum(LogoPosition),
    logo_ratio: z.array(z.number().min(1).max(100)),
    logo_transparency: z.array(z.number().min(16).max(255)),
  })
};

export const editVenueSchema = (intl: IntlShape) => {
  return z.object({
    name: z.string().min(2, {
      message: intl.formatMessage({
        id: "venueDashboard.venueSettings.messages.venueNameTooShort"
      })
    }),
    contact_num: z.string().min(5, {
      message: intl.formatMessage({
        id: "venueDashboard.venueSettings.messages.contactNumberTooShort"
      })
    }),
    venue_logo: z.instanceof(File, {
      message: intl.formatMessage({
        id: "venueDashboard.venueSettings.messages.missingLogo"
      })
    })
      .refine(
        file => file.size <= import.meta.env.VITE_LOGO_MAX_FILE_SIZE * 1024 * 1024,
        intl.formatMessage({
          id: "venueDashboard.venueSettings.messages.exceededLogoSize"
        })
      )
      .refine(
        file => import.meta.env.VITE_ACCEPTED_LOGO_FILE_TYPES
          .split(",")
          .includes(file.type),
        intl.formatMessage({
          id: "venueDashboard.venueSettings.messages.invalidLogoType"
        })
      )
      .optional(),
    logo_position: z.nativeEnum(LogoPosition),
    logo_ratio: z.array(z.number().min(1).max(100)),
    logo_transparency: z.array(z.number().min(16).max(255)),
  })
};

export const registerFormSchema = (intl: IntlShape) => {
  return z.object({
    username: z.string().min(5, {
      message: intl.formatMessage({ id: "register.messages.usernameTooShort" }),
    }),
    email: z.string().email({
      message: intl.formatMessage({ id: "register.messages.emailInvalid" }),
    }),
    password: z.string().min(8, {
      message: intl.formatMessage({ id: "register.messages.passwordTooShort" }),
    }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: intl.formatMessage({ id: "register.messages.passwordMismatch" }),
    path: ["confirmPassword"],
  })
};

export const profileFormSchema = (intl: IntlShape) => {
  return z.object({
    username: z.string().min(5, {
      message: intl.formatMessage({ id: "venueDashboard.accountSettings.message.usernameTooShort" }),
    }),
    email: z.string().email({
      message: intl.formatMessage({ id: "venueDashboard.accountSettings.message.emailInvalid" }),
    }),
  })
};

export const passwordFormSchema = (intl: IntlShape) => {
  return z.object({
    newPassword: z.string().min(8, {
      message: intl.formatMessage({ id: "venueDashboard.accountSettings.messages.passwordTooShort" }),
    }),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: intl.formatMessage({ id: "venueDashboard.accountSettings.messages.passwordMismatch" }),
    path: ["confirmPassword"],
  })
};

export type CreateVenueFormValues = z.infer<ReturnType<typeof createVenueSchema>>;
export type EditVenueFormValues = z.infer<ReturnType<typeof editVenueSchema>>;
export type RegisterFormValues = z.infer<ReturnType<typeof registerFormSchema>>;
export type ProfileFormValues = z.infer<ReturnType<typeof profileFormSchema>>;
export type PasswordFormValues = z.infer<ReturnType<typeof passwordFormSchema>>;