import { VenuePhotos } from "@/service/fetchVenuePhotosFromApi";
import { VenueUser } from "@/service/fetchVenueUsersFromApi";

type AnalyticsInfoProps = {
  venueUsers: VenueUser[];
  venuePhotos: VenuePhotos[];
}

export default function AnalyticsInfo(props: AnalyticsInfoProps) {
  return (
    <div>AnalyticsInfo</div>
  )
}
