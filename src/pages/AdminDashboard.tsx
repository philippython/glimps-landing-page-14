
import { useState } from "react";
import {
  Users,
  Camera,
  Bell,
  Search,
  ChevronDown,
  Store,
  User,
  LogOut,
  Image,
  Phone,
  MessageSquare,
  Calendar,
  Edit,
  Globe
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
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [language, setLanguage] = useState("English");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const photoSessions = [
    {
      id: 1,
      uuid: "a1b2c3d4-e5f6",
      venue: "The Venue Club",
      phone: "+1 (555) 123-4567",
      telegram: "@user123",
      timestamp: "2023-06-15 19:32",
    },
    {
      id: 2,
      uuid: "g7h8i9j0-k1l2",
      venue: "Sky Bar",
      phone: "+1 (555) 987-6543",
      telegram: "@partyfriend42",
      timestamp: "2023-06-14 21:15",
    },
    {
      id: 3,
      uuid: "m3n4o5p6-q7r8",
      venue: "Urban Lounge",
      phone: "+1 (555) 456-7890",
      telegram: "@photolover",
      timestamp: "2023-06-14 20:45",
    },
    {
      id: 4,
      uuid: "s9t0u1v2-w3x4",
      venue: "Blue Wave",
      phone: "+1 (555) 234-5678",
      telegram: "@nightlife22",
      timestamp: "2023-06-13 22:17",
    },
    {
      id: 5,
      uuid: "y5z6a7b8-c9d0",
      venue: "Midnight Club",
      phone: "+1 (555) 345-6789",
      telegram: "@memorycollector",
      timestamp: "2023-06-12 21:30",
    },
  ];

  const users = [
    {
      id: 1,
      uuid: "a1b2c3d4-e5f6",
      venue: "The Venue Club",
      phone: "+1 (555) 123-4567",
      telegram: "@user123",
      lastSessionTimestamp: "2023-06-15 19:32",
    },
    {
      id: 2,
      uuid: "g7h8i9j0-k1l2",
      venue: "Sky Bar",
      phone: "+1 (555) 987-6543",
      telegram: "@partyfriend42",
      lastSessionTimestamp: "2023-06-14 21:15",
    },
    {
      id: 3,
      uuid: "m3n4o5p6-q7r8",
      venue: "Urban Lounge",
      phone: "+1 (555) 456-7890",
      telegram: "@photolover",
      lastSessionTimestamp: "2023-06-14 20:45",
    },
    {
      id: 4,
      uuid: "y5z6a7b8-c9d0",
      venue: "Midnight Club",
      phone: "+1 (555) 345-6789",
      telegram: "@memorycollector",
      lastSessionTimestamp: "2023-06-12 21:30",
    },
  ];

  const venues = [
    {
      id: 1,
      name: "The Venue Club",
      location: "New York, NY",
      contact: "+1 (555) 123-4567",
      status: "Active",
    },
    {
      id: 2,
      name: "Sky Bar",
      location: "Los Angeles, CA",
      contact: "+1 (555) 987-6543",
      status: "Active",
    },
    {
      id: 3,
      name: "Urban Lounge",
      location: "Chicago, IL",
      contact: "+1 (555) 456-7890",
      status: "Active",
    },
    {
      id: 4,
      name: "Blue Wave",
      location: "Miami, FL",
      contact: "+1 (555) 234-5678",
      status: "Active",
    },
    {
      id: 5,
      name: "Midnight Club",
      location: "Las Vegas, NV",
      contact: "+1 (555) 345-6789",
      status: "Maintenance",
    },
    {
      id: 6,
      name: "Azure",
      location: "Seattle, WA",
      contact: "+1 (555) 678-9012",
      status: "Active",
    },
    {
      id: 7,
      name: "The Capitol",
      location: "Washington, DC",
      contact: "+1 (555) 901-2345",
      status: "Active",
    },
  ];

  const filteredSessions = photoSessions.filter(
    session =>
      session.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.phone.includes(searchTerm) ||
      session.telegram.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    user =>
      user.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.telegram.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVenues = venues.filter(
    venue =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.contact.includes(searchTerm)
  );

  const languages = [
    { name: "English", code: "en" },
    { name: "Español", code: "es" },
    { name: "Français", code: "fr" },
    { name: "Deutsch", code: "de" },
  ];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Here you would typically call a function to change the app's language
    console.log(`Language changed to ${lang}`);
  };

  const navItems = [
    { id: "sessions", label: "Photo Sessions", icon: <Camera className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
    { id: "venues", label: "Venues", icon: <Store className="h-4 w-4" /> },
    { id: "account-settings", label: "Account Settings", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center gap-8 px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-md bg-glimps-900 p-1.5">
              <Image className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-glimps-900">
              Glimps
            </span>
          </NavLink>

          <div className="flex-1">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
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

            <button className="relative p-2 text-gray-600 hover:text-gray-700">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-glimps-accent"></span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium">
                  Admin Portal
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
                    <div className="text-sm font-medium">Admin User</div>
                    <div className="text-xs text-glimps-600">admin@glimps.com</div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("account-settings")}>
                  <User className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Globe className="mr-2 h-4 w-4" />
                  Language: {language}
                  <ChevronDown className="ml-auto h-4 w-4" />
                  <DropdownMenu>
                    <DropdownMenuTrigger className="hidden" />
                    <DropdownMenuContent align="end" side="right" className="bg-white">
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.name)}
                          className="cursor-pointer"
                        >
                          {lang.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div onClick={handleLogout} className="flex w-full items-center">
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
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedVenue(null);
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          {activeTab === "sessions" && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">All Photo Sessions</h2>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">UUID</TableHead>
                        <TableHead className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            Venue
                          </div>
                        </TableHead>
                        <TableHead className="w-[140px]">
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
                            Timestamp
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.length > 0 ? (
                        filteredSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell className="font-medium">{session.uuid}</TableCell>
                            <TableCell>{session.venue}</TableCell>
                            <TableCell>{session.phone}</TableCell>
                            <TableCell>{session.telegram}</TableCell>
                            <TableCell>{session.timestamp}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/photos/${session.uuid}`, '_blank')}
                              >
                                View Photos
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
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
                <h2 className="text-xl font-semibold mb-4">All Users</h2>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">UUID</TableHead>
                        <TableHead className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            Venue
                          </div>
                        </TableHead>
                        <TableHead className="w-[140px]">
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
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.uuid}</TableCell>
                            <TableCell>{user.venue}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{user.telegram}</TableCell>
                            <TableCell>{user.lastSessionTimestamp}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/photos/${user.uuid}`, '_blank')}
                              >
                                View Photos
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
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

          {activeTab === "venues" && !selectedVenue && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">All Venues</h2>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Name</TableHead>
                        <TableHead className="w-[180px]">Location</TableHead>
                        <TableHead className="w-[140px]">Contact</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVenues.length > 0 ? (
                        filteredVenues.map((venue) => (
                          <TableRow key={venue.id}>
                            <TableCell className="font-medium">{venue.name}</TableCell>
                            <TableCell>{venue.location}</TableCell>
                            <TableCell>{venue.contact}</TableCell>
                            <TableCell>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${venue.status === 'Active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                                  }`}
                              >
                                {venue.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                              // onClick={() => setSelectedVenue(venue)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No venues found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "venues" && selectedVenue && (
            <div className="mb-6">
              <Button
                variant="outline"
                className="mb-4"
                onClick={() => setSelectedVenue(null)}
              >
                ← Back to Venues
              </Button>
              {/* <VenueSettings /> */}
            </div>
          )}

          {activeTab === "account-settings" && (
            <AccountSettings />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
