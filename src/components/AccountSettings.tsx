import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User, Mail, KeyRound, EyeOff, Eye } from "lucide-react";
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
import { FormattedMessage, useIntl } from 'react-intl';

const AccountSettings = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        toast.success(<FormattedMessage id="venueDashboard.accountSettings.messages.profileUpdated" />);
        setUserAndVenueAfterCreation(res.venue);
      }
    } catch (error) {
      toast.error(<FormattedMessage id="venueDashboard.accountSettings.messages.profileUpdateFailed" />);
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
        toast.success(<FormattedMessage id="venueDashboard.accountSettings.messages.passwordUpdated" />);
        setUserAndVenueAfterCreation(res.venue);
      }
    } catch (error) {
      toast.error(<FormattedMessage id="venueDashboard.accountSettings.messages.passwordUpdateFailed" />);
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">
          <FormattedMessage id="venueDashboard.accountSettings.title" />
        </h2>

        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
            <FormField
              control={profileForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="venueDashboard.accountSettings.form.username.label" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        className="pl-10"
                        {...field}
                        placeholder={intl.formatMessage({ id: "venueDashboard.accountSettings.form.username.placeholder" })}
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    <FormattedMessage id="venueDashboard.accountSettings.form.username.description" />
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
                  <FormLabel>
                    <FormattedMessage id="venueDashboard.accountSettings.form.email.label" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        className="pl-10"
                        {...field}
                        placeholder={intl.formatMessage({ id: "venueDashboard.accountSettings.form.email.placeholder" })}
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    <FormattedMessage id="venueDashboard.accountSettings.form.email.description" />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4">
              {loading
                ? <FormattedMessage id="venueDashboard.accountSettings.form.buttons.updatingProfile" />
                : <FormattedMessage id="venueDashboard.accountSettings.form.buttons.updateProfile" />
              }
            </Button>
          </form>
        </Form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">
          <FormattedMessage id="venueDashboard.accountSettings.changePasswordTitle" />
        </h2>

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="venueDashboard.accountSettings.form.newPassword.label" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        className="pl-10"
                        type={showPassword ? "text" : "password"}
                        placeholder={intl.formatMessage({ id: "venueDashboard.accountSettings.form.newPassword.placeholder" })}
                        disabled={loading}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
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
                  <FormLabel>
                    <FormattedMessage id="venueDashboard.accountSettings.form.confirmPassword.label" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        className="pl-10"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={intl.formatMessage({ id: "venueDashboard.accountSettings.form.confirmPassword.placeholder" })}
                        disabled={loading}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4">
              {loading
                ? <FormattedMessage id="venueDashboard.accountSettings.form.buttons.updatingPassword" />
                : <FormattedMessage id="venueDashboard.accountSettings.form.buttons.updatePassword" />
              }
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AccountSettings;
