import { LogoPosition } from "@/service/fetchLoginTokenFromApi";
import { IntlShape } from "react-intl";
import { z } from "zod";

export const createSchema = (intl: IntlShape) => {
  const createFormSchema = z.object({
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
  });

  const editFormSchema = z.object({
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
  });

  return { createFormSchema, editFormSchema }
}

export type CreateVenueFormValues = z.infer<ReturnType<typeof createSchema>["createFormSchema"]>;
export type EditVenueFormValues = z.infer<ReturnType<typeof createSchema>["editFormSchema"]>;