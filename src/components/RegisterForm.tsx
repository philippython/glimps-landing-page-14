import { NavLink } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LogoWithText from "@/components/LogoWithText";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerFormSchema } from "@/lib/createSchema";
import { FormattedMessage, useIntl } from "react-intl";

type RegisterFormProps = {
  loading: boolean;
  onSubmit: (values: RegisterFormValues) => void;
};

export default function RegisterForm(props: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const intl = useIntl();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema(intl)),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Card className="w-full max-w-md border-0">
      <CardHeader className="text-center">
        <LogoWithText />
        <CardTitle className="mt-6 text-3xl font-bold tracking-tight text-glimps-900">
          <FormattedMessage id="register.title" />
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-glimps-600">
          <FormattedMessage id="register.optionalTitle.or" />{" "}
          <NavLink
            to="/login"
            className="font-medium text-glimps-accent hover:text-glimps-accent/90"
          >
            <FormattedMessage id="register.optionalTitle.login" />
          </NavLink>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="register.form.username.label" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={intl.formatMessage({
                        id: "register.form.username.placeholder",
                      })}
                      {...field}
                      disabled={props.loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="register.form.email.label" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={intl.formatMessage({
                        id: "register.form.email.placeholder",
                      })}
                      {...field}
                      disabled={props.loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="register.form.password.label" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={intl.formatMessage({
                          id: "register.form.password.placeholder"
                        })
                        }
                        {...field}
                        disabled={props.loading}
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
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="register.form.confirmPassword.label" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={intl.formatMessage({
                          id: "register.form.confirmPassword.placeholder"
                        })
                        }
                        {...field}
                        disabled={props.loading}
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

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={props.loading}
            >
              {props.loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <FormattedMessage id="register.form.button.loading" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <FormattedMessage id="register.form.button.createAccount" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
