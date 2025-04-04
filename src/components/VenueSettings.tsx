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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogoPosition } from "@/service/fetchLoginTokenFromApi";
import { useAuth } from "@/auth/AuthProvider";
import LogoWithText from "./LogoWithText";
import { FormattedMessage, useIntl } from "react-intl";
import { CreateVenueFormValues, EditVenueFormValues, createVenueSchema, editVenueSchema } from "@/lib/createSchema";
import { z } from "zod";

type Mode = "create" | "edit";

type FormProps =
  | {
    mode: "create";
    loading: boolean;
    onSubmit: (values: CreateVenueFormValues) => void;
  }
  | {
    mode: "edit";
    loading: boolean;
    onSubmit: (values: EditVenueFormValues) => void;
  };;

const VenueSettings = (props: FormProps) => {
  const { venue, logout } = useAuth();
  const [logoPreview, setLogoPreview] = useState<string | null>(venue?.logo_url || null);
  const { mode, loading, onSubmit } = props;
  const intl = useIntl();

  const formSchema = mode === "create" ? createVenueSchema(intl) : editVenueSchema(intl);

  const logoPositionText = {
    [LogoPosition.topLeft]: <FormattedMessage id="venueDashboard.venueSettings.logoPosition.topLeft" />,
    [LogoPosition.topRight]: <FormattedMessage id="venueDashboard.venueSettings.logoPosition.topRight" />,
    [LogoPosition.topCenter]: <FormattedMessage id="venueDashboard.venueSettings.logoPosition.topCenter" />,
    [LogoPosition.bottomLeft]: <FormattedMessage id="venueDashboard.venueSettings.logoPosition.bottomLeft" />,
    [LogoPosition.bottomRight]: <FormattedMessage id="venueDashboard.venueSettings.logoPosition.bottomRight" />,
    [LogoPosition.bottomCenter]: <FormattedMessage id="venueDashboard.venueSettings.logoPosition.bottomCenter" />,
    [LogoPosition.centerLeft]: <FormattedMessage id="venueDashboard.venueSettings.logoPosition.centerLeft" />,
    [LogoPosition.centerRight]: <FormattedMessage id="venueDashboard.venueSettings.logoPosition.centerRight" />,
    [LogoPosition.center]: <FormattedMessage id="venueDashboard.venueSettings.logoPosition.center" />,
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: venue?.name || "",
      contact_num: venue?.contact_num.toString() || "",
      venue_logo: undefined,
      logo_position: venue?.logo_position || LogoPosition.bottomCenter,
      logo_ratio: venue ? [venue.logo_ratio] : [50],
      logo_transparency: venue ? [venue.logo_transparency] : [255],
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

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (mode === "create") {
      onSubmit(values as CreateVenueFormValues);
    } else {
      onSubmit(values as EditVenueFormValues);
    }
  };

  return (
    <Card className="min-w-[70vw] mx-auto">
      <CardHeader>
        {props.mode == "create" && <LogoWithText />}
        <CardTitle className="text-xl flex items-center gap-2 pt-2">
          <Store className="h-5 w-5" />
          {mode === "create" && <FormattedMessage id="venueDashboard.venueSettings.title.create" />}
          {mode === "edit" && <FormattedMessage id="venueDashboard.venueSettings.title.edit" />}
        </CardTitle>
        <CardDescription>
          <FormattedMessage id="venueDashboard.venueSettings.description" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="venueDashboard.venueSettings.form.venueName.label" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({
                          id: "venueDashboard.venueSettings.form.venueName.placeholder"
                        })}
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
                    <FormLabel>
                      <FormattedMessage id="venueDashboard.venueSettings.form.contactNumber.label" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({
                          id: "venueDashboard.venueSettings.form.contactNumber.placeholder"
                        })}
                        {...field}
                        disabled={loading}
                      />
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
                render={() => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="venueDashboard.venueSettings.form.venue_logo.label" />
                    </FormLabel>
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
                          <FormattedMessage id="venueDashboard.venueSettings.form.venue_logo.button" />
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
                          <FormattedMessage id="venueDashboard.venueSettings.form.venue_logo.helper" />
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
                    <FormLabel>
                      <FormattedMessage id="venueDashboard.venueSettings.form.logoPosition.label" />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={intl.formatMessage({
                              id: "venueDashboard.venueSettings.form.logoPosition.placeholder"
                            })}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LogoPosition).map((position) => (
                          <SelectItem key={position} value={position}>
                            {logoPositionText[position]}
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
                    <FormLabel>
                      <FormattedMessage id="venueDashboard.venueSettings.form.logoRatio.label" />
                    </FormLabel>
                    <FormControl>
                      <div className="pt-2">
                        <Slider
                          defaultValue={field.value}
                          max={100}
                          min={1}
                          step={1}
                          onValueChange={field.onChange}
                          disabled={loading}
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>
                            <FormattedMessage id="venueDashboard.venueSettings.form.logoRatio.helper.min" />
                          </span>
                          <span>
                            <FormattedMessage id="venueDashboard.venueSettings.form.logoRatio.helper.max" />
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      <FormattedMessage id="venueDashboard.venueSettings.form.logoRatio.description" />
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
                    <FormLabel>
                      <FormattedMessage id="venueDashboard.venueSettings.form.logoTransparency.label" />
                    </FormLabel>
                    <FormControl>
                      <div className="pt-2">
                        <Slider
                          defaultValue={field.value}
                          max={255}
                          min={16}
                          step={1}
                          onValueChange={field.onChange}
                          disabled={loading}
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>
                            <FormattedMessage id="venueDashboard.venueSettings.form.logoTransparency.helper.min" />
                          </span>
                          <span>
                            <FormattedMessage id="venueDashboard.venueSettings.form.logoTransparency.helper.max" />
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      <FormattedMessage id="venueDashboard.venueSettings.form.logoTransparency.description" />
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
                <FormattedMessage id="venueDashboard.venueSettings.form.button.signout" />
              </Button>}
              <Button type="submit" disabled={loading}>
                {mode === "create" && <FormattedMessage id="venueDashboard.venueSettings.form.button.create" />}
                {mode === "edit" && <FormattedMessage id="venueDashboard.venueSettings.form.button.edit" />}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VenueSettings;
