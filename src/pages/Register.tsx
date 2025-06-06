import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { postNewUserToApi } from "@/service/postNewUserToApi";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/auth/AuthProvider";
import { RegisterFormValues } from "@/lib/createSchema";
import { FormattedMessage } from "react-intl";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { user, token, login } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      navigate("/venue-creation");
    }

    if (user && user.role === "admin") {
      navigate("/admin-dashboard");
    }

    if (user && user.role === "renter") {
      navigate("/venue-dashboard");
    }
  }, [user, token, navigate]);

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const res = await postNewUserToApi(values.username, values.email, values.password);
      if (res.username) {
        toast.success(<FormattedMessage id="register.messages.accountCreated" />);

        const res = await login(values.username, values.password);
      }
    } catch (error) {
      toast.error(<FormattedMessage id="register.messages.failed" />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <RegisterForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
};

export default Register;