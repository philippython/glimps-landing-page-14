
import { useEffect, useState } from "react";
import {
  Users,
  Camera,
  Search,
  ChevronDown,
  Phone,
  MessageSquare,
  Calendar,
  Store,
  User,
  LogOut,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import VenueSettings from "../components/VenueSettings";
import AccountSettings from "../components/AccountSettings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/auth/AuthProvider";
import LanguagePicker from "@/components/LanguagePicker";
import LogoWithText from "@/components/LogoWithText";
import { VenueUser, fetchVenueUsersFromApi } from "@/service/fetchVenueUsersFromApi";
import { convertDateTime } from '@/lib/utils';
import { VenuePhotos, fetchVenuePhotosFromApi } from "@/service/fetchVenuePhotosFromApi";

const photoSessions = [
  {
    id: 1,
    uuid: "a1b2c3d4-e5f6",
    phone: "+1 (555) 123-4567",
    telegram: "@user123",
    timestamp: "2023-06-15 19:32",
  },
  {
    id: 2,
    uuid: "g7h8i9j0-k1l2",
    phone: "+1 (555) 987-6543",
    telegram: "@partyfriend42",
    timestamp: "2023-06-14 21:15",
  },
  {
    id: 3,
    uuid: "m3n4o5p6-q7r8",
    phone: "+1 (555) 456-7890",
    telegram: "@photolover",
    timestamp: "2023-06-14 20:45",
  },
  {
    id: 4,
    uuid: "s9t0u1v2-w3x4",
    phone: "+1 (555) 234-5678",
    telegram: "@nightlife22",
    timestamp: "2023-06-13 22:17",
  },
  {
    id: 5,
    uuid: "y5z6a7b8-c9d0",
    phone: "+1 (555) 345-6789",
    telegram: "@memorycollector",
    timestamp: "2023-06-12 21:30",
  },
];

const VenueDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("sessions");
  const [venueUsers, setVenueUsers] = useState<VenueUser[]>([]);
  const [venuePhotos, setVenuePhotos] = useState<VenuePhotos[]>([]);
  const { user, venue, token, logout } = useAuth();

  useEffect(() => {
    if (venue && token) {
      fetchVenueUsersFromApi(token, venue.id)
        .then((data) => setVenueUsers(data))
        .catch((error) => console.error("Error fetching venue users", error));

      fetchVenuePhotosFromApi(token, venue.id)
        .then((data) => setVenuePhotos(data))
        .catch((error) => console.error("Error fetching venue photos", error));
    }
  }, [venue, token]);

  const filteredSessions = photoSessions.filter(
    session =>
      session.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.phone.includes(searchTerm) ||
      session.telegram.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVenuePhotos = venuePhotos.filter(
    photo =>
      photo.id.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()) ||
      photo.user_id.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()) ||
      photo.link_id.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
  );

  const filteredVenueUsers = venueUsers.filter(
    user =>
      user.user_id.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
  );

  const navItems = [
    { id: "sessions", label: "Photo Sessions", icon: <Camera className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
    { id: "venue-settings", label: "Venue Settings", icon: <Store className="h-4 w-4" /> },
    { id: "account-settings", label: "Account Settings", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center gap-4 px-6 align-middle">
          <LogoWithText />

          <div className="flex-1">
            <h1 className="text-lg font-semibold">Venue Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-full bg-gray-100 pl-9 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <LanguagePicker />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium">
                  The Venue Club
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <div className="flex items-center gap-3 p-3">
                  <img
                    src="/placeholder.svg"
                    alt="User"
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium">John Smith</div>
                    <div className="text-xs text-glimps-600">john@thevenueclub.com</div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("account-settings")}>
                  <User className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("venue-settings")}>
                  <Store className="mr-2 h-4 w-4" />
                  Venue Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div onClick={logout} className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border-t px-6">
          <nav className="flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`flex items-center gap-2 py-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === item.id
                  ? "border-glimps-900 text-glimps-900"
                  : "border-transparent text-glimps-600 hover:text-glimps-900"
                  }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="p-6">
        <div className="grid gap-6">
          {activeTab === "sessions" && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Photo Sessions</h2>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">UUID</TableHead>
                        <TableHead className="">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            User UUID
                          </div>
                        </TableHead>
                        <TableHead className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Sent to user
                          </div>
                        </TableHead>
                        <TableHead className="">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Timestamp
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVenuePhotos.length > 0 ? (
                        filteredVenuePhotos.map((photo) => (
                          <TableRow key={photo.id}>
                            <TableCell className="font-medium">{photo.id}</TableCell>
                            <TableCell>{photo.user_id}</TableCell>
                            <TableCell>{photo.sent ? "Yes" : "No"}</TableCell>
                            <TableCell>{convertDateTime(photo.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(``, '_blank')}
                              >
                                View Photo
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/photos/${photo.link_id}`, '_blank')}
                              >
                                View photo session
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No photo sessions found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">User List</h2>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">UUID</TableHead>
                        <TableHead className="w-[160px]">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number
                          </div>
                        </TableHead>
                        <TableHead className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Telegram
                          </div>
                        </TableHead>
                        <TableHead className="w-[180px]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Last Session
                          </div>
                        </TableHead>
                        <TableHead className="w-[180px]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Created At
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVenueUsers.length > 0 ? (
                        filteredVenueUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.user_id}</TableCell>
                            <TableCell>{""}</TableCell>
                            <TableCell>{""}</TableCell>
                            <TableCell>{convertDateTime(user.created_at)}</TableCell>
                            <TableCell>{convertDateTime(user.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/photos/`, '_blank')}
                              >
                                View Photos
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "venue-settings" && (
            <VenueSettings />
          )}

          {activeTab === "account-settings" && (
            <AccountSettings />
          )}
        </div>
      </main>
    </div>
  );
};

export default VenueDashboard;
