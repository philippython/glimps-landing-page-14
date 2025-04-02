import { useState } from "react";
import { Store, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogoPosition } from "@/service/fetchLoginTokenFromApi";
import { useAuth } from "@/auth/AuthProvider";
import LogoWithText from "./LogoWithText";

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const createFormSchema = z.object({
  name: z.string().min(2, { message: "Venue name must be at least 2 characters." }),
  contact_num: z.string().min(5, { message: "Contact number must be at least 5 characters." }),
  venue_logo: z.instanceof(File, { message: "Logo is required" })
    .refine(file => file.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file.type),
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
    .refine(file => file.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, and .png formats are supported."
    )
    .optional(),
  logo_position: z.nativeEnum(LogoPosition),
  logo_ratio: z.array(z.number().min(1).max(100)),
  logo_transparency: z.array(z.number().min(16).max(255)),
});

const formSchema = (mode: Mode) => mode === "create" ? createFormSchema : editFormSchema;

export type VenueFormValues = z.infer<ReturnType<typeof formSchema>>;

type Mode = "create" | "edit";

type FormProps = {
  mode: Mode;
  loading: boolean;
  onSubmit: (data: VenueFormValues) => void;
};

const VenueSettings = (props: FormProps) => {
  const { venue, logout } = useAuth();
  const [logoPreview, setLogoPreview] = useState<string | null>(venue?.logo_url || null);
  const { mode, loading, onSubmit } = props;

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(formSchema(mode)),
    defaultValues: {
      name: venue?.name || "",
      contact_num: venue?.contact_num.toString() || "",
      venue_logo: undefined,
      logo_position: venue?.logo_position || LogoPosition.topLeft,
      logo_ratio: venue ? [venue.logo_ratio] : [50],
      logo_transparency: venue ? [venue.logo_transparency] : [80],
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("venue_logo", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (mode === "edit") {
      form.setValue("venue_logo", undefined, { shouldValidate: false });
    }
  };

  return (
    <Card className="min-w-[70vw] mx-auto">
      <CardHeader>
        {props.mode == "create" && <LogoWithText />}
        <CardTitle className="text-xl flex items-center gap-2 pt-2">
          <Store className="h-5 w-5" />
          {mode === "create" && "Create your venue"}
          {mode === "edit" && "Venue Settings"}
        </CardTitle>
        <CardDescription>
          Configure your venue booth appearance and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter venue name"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_num"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact number" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border rounded-md p-4">
              <FormField
                control={form.control}
                name="venue_logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Logo</FormLabel>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex-shrink-0 h-24 w-24 border rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Store className="h-10 w-10 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="venue_logo"
                          className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Logo
                        </Label>
                        <FormControl>
                          <Input
                            id="venue_logo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 512x512px, PNG or JPG (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo_position"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Logo Position</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select logo position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LogoPosition).map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo_ratio"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Logo Size Ratio</FormLabel>
                    <FormControl>
                      <div className="pt-2">
                        <Slider
                          defaultValue={field.value}
                          max={100}
                          step={1}
                          onValueChange={field.onChange}
                          disabled={loading}
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Small</span>
                          <span>Large</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Adjust the size of your logo relative to the photo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo_transparency"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Logo Transparency</FormLabel>
                    <FormControl>
                      <div className="pt-2">
                        <Slider
                          defaultValue={field.value}
                          max={100}
                          step={1}
                          onValueChange={field.onChange}
                          disabled={loading}
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Transparent</span>
                          <span>Solid</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Adjust the transparency of your logo overlay
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              {props.mode == "create" && <Button
                type="button"
                variant={"destructive"}
                disabled={loading}
                onClick={logout}
                className="mr-auto"
              >
                Logout
              </Button>}
              <Button type="submit" disabled={loading}>
                {mode === "create" && "Submit"}
                {mode === "edit" && "Save Settings"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VenueSettings;
