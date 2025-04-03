import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VenueSettings from "@/components/VenueSettings";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { postNewVenueToApi } from "@/service/postNewVenueToApi";
import { CreateVenueFormValues } from '@/lib/createSchema';

export default function VenueCreation() {
  const [loading, setLoading] = useState(false);
  const { user, token, setUserAndVenueAfterCreation } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin-dashboard");
    }

    if (user && user.role === "renter") {
      navigate("/venue-dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (values: CreateVenueFormValues) => {
    setLoading(true);
    try {
      if (token) {
        const res = await postNewVenueToApi(values, token);
        if (res.id) {
          toast.success("Venue created successfully!");
          setUserAndVenueAfterCreation(res);
        }
      }
    } catch (error) {
      toast.error("Failed to create venue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <VenueSettings mode="create" loading={loading} onSubmit={onSubmit} />
    </div>
  );
};
