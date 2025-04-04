import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User, Mail, KeyRound } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/auth/AuthProvider";
import { useState } from "react";
import { patchAccountInfoToApi, patchPasswordToApi } from "@/service/patchUserSettingsToApi";
import { toast } from "sonner";

const profileFormSchema = z.object({
  username: z.string().min(5, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const passwordFormSchema = z.object({
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const AccountSettings = () => {
  const [loading, setLoading] = useState(false);
  const { user, token, setUserAndVenueAfterCreation } = useAuth();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
  });

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      if (!token || !user) {
        throw new Error("User not authenticated");
      }
      const res = await patchAccountInfoToApi(values, token, user);
      if (res.id) {
        toast.success("Your profile has been updated successfully.");
        setUserAndVenueAfterCreation(res.venue);
      }
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setLoading(true);
    try {
      if (!token || !user) {
        throw new Error("User not authenticated");
      }
      const res = await patchPasswordToApi(values, token, user);
      if (res.id) {
        toast.success("Your password has been changed successfully.");
        setUserAndVenueAfterCreation(res.venue);
      }
    } catch (error) {
      toast.error("Failed to change password.");
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Account Information</h2>

        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
            <FormField
              control={profileForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    This is your user name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    We'll use this email for notifications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4">
              Update Profile
            </Button>
          </form>
        </Form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input className="pl-10" type="password" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input className="pl-10" type="password" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4">
              Change Password
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AccountSettings;
