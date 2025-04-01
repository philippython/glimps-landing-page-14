import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VenueSettings from "@/components/VenueSettings";
import { toast } from "sonner";
import { postNewUserToApi } from "@/service/postNewUserToApi";
import RegisterForm, { RegisterFormValues } from "@/components/RegisterForm";

type Steps = "register" | "venue";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Steps>("register");

  const navigate = useNavigate();

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      // Simulate API call
      const res = await postNewUserToApi(values.username, values.email, values.password);
      if (res.username) {
        toast.success("Account created successfully!");
        setStep("venue");
      }

    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {step === "register" && <RegisterForm onSubmit={onSubmit} loading={loading} />}

      {step === "venue" && <VenueSettings mode="create" loading={loading} />}
    </div>
  );
};

export default Register;