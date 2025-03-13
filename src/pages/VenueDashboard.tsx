
import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import VenueSettings from "../components/VenueSettings";
import AccountSettings from "../components/AccountSettings";
import { 
  Users, 
  Camera,
  Bell,
  Search,
  ChevronDown,
  Phone,
  MessageSquare,
  Calendar,
  Store,
  User
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for photo sessions
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

// Mock data for users
const users = [
  {
    id: 1,
    uuid: "a1b2c3d4-e5f6",
    phone: "+1 (555) 123-4567",
    telegram: "@user123",
    lastSessionTimestamp: "2023-06-15 19:32",
  },
  {
    id: 2,
    uuid: "g7h8i9j0-k1l2",
    phone: "+1 (555) 987-6543",
    telegram: "@partyfriend42",
    lastSessionTimestamp: "2023-06-14 21:15",
  },
  {
    id: 3,
    uuid: "m3n4o5p6-q7r8",
    phone: "+1 (555) 456-7890",
    telegram: "@photolover",
    lastSessionTimestamp: "2023-06-14 20:45",
  },
  {
    id: 4,
    uuid: "y5z6a7b8-c9d0",
    phone: "+1 (555) 345-6789",
    telegram: "@memorycollector",
    lastSessionTimestamp: "2023-06-12 21:30",
  },
];

const VenueDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSessions = photoSessions.filter(
    session => 
      session.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.phone.includes(searchTerm) ||
      session.telegram.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredUsers = users.filter(
    user => 
      user.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.telegram.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="border-b bg-white">
          <div className="flex h-16 items-center gap-8 px-6">
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Venue Dashboard</h1>
            </div>
            
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
            
            <button className="flex items-center gap-2 text-sm font-medium">
              The Venue Club
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <main className="p-6">
          <div className="grid gap-6">
            <Tabs defaultValue="sessions" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="sessions" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo Sessions
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="venue-settings" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Venue Settings
                </TabsTrigger>
                <TabsTrigger value="account-settings" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sessions">
                <Card>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Photo Sessions</h2>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">UUID</TableHead>
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
              </TabsContent>
              
              <TabsContent value="users">
                <Card>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">User List</h2>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">UUID</TableHead>
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
              </TabsContent>
              
              <TabsContent value="venue-settings">
                <VenueSettings />
              </TabsContent>
              
              <TabsContent value="account-settings">
                <AccountSettings />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VenueDashboard;
