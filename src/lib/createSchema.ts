import { LogoPosition } from "@/service/fetchLoginTokenFromApi";
import { IntlShape } from "react-intl";
import { z } from "zod";

export const createSchema = (intl: IntlShape) => {
  const createFormSchema = z.object({
    name: z.string().min(2, { message: "Venue name must be at least 2 characters." }),
    contact_num: z.string().min(5, { message: "Contact number must be at least 5 characters." }),
    venue_logo: z.instanceof(File, { message: "Logo is required" })
      .refine(
        file => file.size <= import.meta.env.VITE_LOGO_MAX_FILE_SIZE * 1024 * 1024,
        "Max file size is 5MB."
      )
      .refine(
        file => import.meta.env.VITE_ACCEPTED_LOGO_FILE_TYPES
          .split(",")
          .includes(file.type),
        "Only .jpg, .jpeg, and .png formats are supported."
      ),
    logo_position: z.nativeEnum(LogoPosition),
    logo_ratio: z.array(z.number().min(1).max(100)),
    logo_transparency: z.array(z.number().min(16).max(255)),
  });

  const editFormSchema = z.object({
    name: z.string().min(2, { message: "Venue name must be at least 2 characters." }),
    contact_num: z.string().min(5, { message: "Contact number must be at least 5 characters." }),
    venue_logo: z.instanceof(File, { message: "Logo must be a valid file" })
      .refine(
        file => file.size <= import.meta.env.VITE_LOGO_MAX_FILE_SIZE * 1024 * 1024
        , "Max file size is 5MB."
      )
      .refine(
        file => import.meta.env.VITE_ACCEPTED_LOGO_FILE_TYPES
          .split(",")
          .includes(file.type),
        "Only .jpg, .jpeg, and .png formats are supported."
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