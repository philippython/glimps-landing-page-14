import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VenueSettings, { VenueFormValues } from "@/components/VenueSettings";
import { toast } from "sonner";

export default function VenueCreation() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (values: VenueFormValues) => {
    setLoading(true);
    try {
      // Simulate API call
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
