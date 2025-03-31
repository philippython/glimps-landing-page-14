
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
import { toast } from "sonner";
import { LogoPosition } from "@/service/fetchLoginTokenFromApi";

const formSchema = z.object({
  venueName: z.string().min(2, {
    message: "Venue name must be at least 2 characters.",
  }),
  contactNumber: z.string().min(5, {
    message: "Contact number must be at least 5 characters.",
  }),
  logoPosition: z.nativeEnum(LogoPosition),
  logoRatio: z.array(z.number()),
  logoTransparency: z.array(z.number()),
});

type FormValues = z.infer<typeof formSchema>;

type FormProps = {
  mode: "create" | "edit";
  loading: boolean;
};

const VenueSettings = (props: FormProps) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { mode, loading } = props;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      venueName: "The Venue Club",
      contactNumber: "+1 (555) 123-4567",
      logoPosition: LogoPosition.topLeft,
      logoRatio: [50],
      logoTransparency: [80],
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormValues) => {
    // In a real app, we would upload the logo file and save the settings
    console.log("Form submitted:", data, logoFile);
    toast.success("Venue settings updated successfully!");
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
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
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter venue name" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
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
              <div className="mb-4">
                <Label htmlFor="logo-upload">Venue Logo</Label>
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
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Label>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 512x512px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="logoPosition"
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
                name="logoRatio"
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
                name="logoTransparency"
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
