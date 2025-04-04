import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { PasswordFormValues, ProfileFormValues, passwordFormSchema, profileFormSchema } from "@/lib/createSchema";
import { useIntl } from 'react-intl';

const AccountSettings = () => {
  const [loading, setLoading] = useState(false);
  const { user, token, setUserAndVenueAfterCreation } = useAuth();
  const intl = useIntl();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema(intl)),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema(intl)),
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
                      <Input
                        className="pl-10"
                        {...field}
                        placeholder="Enter your username"
                        disabled={loading}
                      />
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
                      <Input
                        className="pl-10"
                        {...field}
                        placeholder="Enter your email"
                        disabled={loading}
                      />
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
              {loading ? "Updating profile..." : "Update Profile"}
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
                      <Input
                        className="pl-10"
                        type="password"
                        placeholder="*********"
                        disabled={loading}
                        {...field}
                      />
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
                      <Input
                        className="pl-10"
                        type="password"
                        placeholder="*********"
                        disabled={loading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4">
              {loading ? "Changing password..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AccountSettings;
