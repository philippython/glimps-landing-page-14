import { useEffect, useState } from "react";
import {
  Users,
  Camera,
  Search,
  ChevronDown,
  Phone,
  MessageSquare,
  CalendarIcon,
  Store,
  User,
  LogOut,
  ChartNoAxesCombined,
  Megaphone
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
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogOverlay, DialogPortal, DialogTrigger } from "@/components/ui/dialog";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { patchVenueSettingsToApi } from "@/service/patchVenueSettingsToApi";
import { toast } from "sonner";
import { FormattedMessage, useIntl } from "react-intl";
import { EditVenueFormValues } from "@/lib/createSchema";
import AnalyticsInfo from "@/components/AnalyticsInfo";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import AdvertisingManager from "@/components/AdvertisingManager";

const ITEMS_PER_PAGE = 10;

const VenueDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const [venueUsers, setVenueUsers] = useState<VenueUser[]>([]);
  const [venuePhotos, setVenuePhotos] = useState<VenuePhotos[]>([]);
  const [loading, setLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const { user, venue, token, logout, setUserAndVenueAfterCreation } = useAuth();
  const intl = useIntl();

  // Pagination state
  const [currentPhotoPage, setCurrentPhotoPage] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);

  // Date filter state
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      navigate("/venue-creation");
    }

    if (venue && token) {
      fetchVenueUsersFromApi(token, venue.id)
        .then((data) => setVenueUsers(data))
        .catch((error) => console.error("Error fetching venue users", error));

      fetchVenuePhotosFromApi(token, venue.id)
        .then((data) => setVenuePhotos(data))
        .catch((error) => console.error("Error fetching venue photos", error));
    }
  }, [venue, token, user, navigate]);

  // Reset pagination when search or date filters change
  useEffect(() => {
    setCurrentPhotoPage(1);
    setCurrentUserPage(1);
  }, [searchTerm, dateFrom, dateTo, userSearchTerm]);

  // Filter functions with date filtering
  const filterByDate = (date: string | undefined) => {
    if (!date || (!dateFrom && !dateTo)) return true;
    
    const itemDate = new Date(`${date}Z`);
    
    if (dateFrom && dateTo) {
      // Set the time of dateTo to end of day for inclusive range
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      return itemDate >= dateFrom && itemDate <= endDate;
    } else if (dateFrom) {
      return itemDate >= dateFrom;
    } else if (dateTo) {
      // Set the time of dateTo to end of day for inclusive range
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      return itemDate <= endDate;
    }
    
    return true;
  };

  const filteredVenuePhotos = venuePhotos.filter(
    photo =>
      (photo.id.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()) ||
      photo.user_id.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()) ||
      photo.link_id.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())) &&
      filterByDate(photo.created_at)
  );

  const filteredVenueUsers = venueUsers.filter(
    user =>
      (user.id.toLowerCase().trim().includes(userSearchTerm.toLowerCase().trim()) ||
      (user.phone_number && user.phone_number.toString().includes(userSearchTerm)) ||
      (user.telegram_username && user.telegram_username.toLowerCase().trim().includes(userSearchTerm.toLowerCase().trim()))) &&
      filterByDate(user.created_at)
  );

  // Pagination calculations
  const totalPhotoPages = Math.ceil(filteredVenuePhotos.length / ITEMS_PER_PAGE);
  const totalUserPages = Math.ceil(filteredVenueUsers.length / ITEMS_PER_PAGE);
  
  const paginatedPhotos = filteredVenuePhotos.slice(
    (currentPhotoPage - 1) * ITEMS_PER_PAGE,
    currentPhotoPage * ITEMS_PER_PAGE
  );
  
  const paginatedUsers = filteredVenueUsers.slice(
    (currentUserPage - 1) * ITEMS_PER_PAGE,
    currentUserPage * ITEMS_PER_PAGE
  );

  // Function to render pagination numbers
  const renderPaginationItems = (currentPage: number, totalPages: number, setPage: (page: number) => void) => {
    const items = [];
    
    if (totalPages <= 7) {
      // If we have 7 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={currentPage === i} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={currentPage === 1} onClick={() => setPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Add ellipsis if current page is more than 3
      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      // Calculate start and end of visible page numbers around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at boundaries
      if (currentPage <= 3) {
        end = Math.min(5, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 4);
      }

      // Add visible page numbers
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={currentPage === i} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Add ellipsis if current page is less than totalPages - 2
      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink isActive={currentPage === totalPages} onClick={() => setPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Date filtering reset function
  const resetDateFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const navItems = [
    {
      id: "analytics",
      label: <FormattedMessage id="venueDashboard.navItems.analytics" />,
      icon: <ChartNoAxesCombined className="h-4 w-4" />
    },
    {
      id: "sessions",
      label: <FormattedMessage id="venueDashboard.navItems.sessions" />,
      icon: <Camera className="h-4 w-4" />
    },
    {
      id: "users",
      label: <FormattedMessage id="venueDashboard.navItems.usersList" />,
      icon: <Users className="h-4 w-4" />
    },
    {
      id: "advertising",
      label: <FormattedMessage id="venueDashboard.navItems.advertising" />,
      icon: <Megaphone className="h-4 w-4" />
    },
    {
      id: "venue-settings",
      label: <FormattedMessage id="venueDashboard.navItems.venueSettings" />,
      icon: <Store className="h-4 w-4" />
    },
    {
      id: "account-settings",
      label: <FormattedMessage id="venueDashboard.navItems.accountSettings" />,
      icon: <User className="h-4 w-4" />
    },
  ];

  const onVenueSettingsSubmit = async (values: EditVenueFormValues) => {
    setLoading(true);
    try {
      if (!token || !venue) {
        throw new Error("No token found");
      }
      const res = await patchVenueSettingsToApi(values, token, venue.id);
      if (res.id) {
        toast.success(<FormattedMessage id="venueDashboard.messages.successUpdateVenue" />);
        setUserAndVenueAfterCreation(res);
      }
    } catch (error) {
      toast.error(<FormattedMessage id="venueDashboard.messages.failedUpdateVenue" />);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex h-16 items-center gap-4 px-6 align-middle">
          <LogoWithText />

          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              <FormattedMessage id="common.navbar.venueDashboard" />
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder={intl.formatMessage({ id: "venueDashboard.navItems.search" })}
                className="w-full rounded-full bg-gray-100 pl-9 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <LanguagePicker />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium">
                  {user && user.username}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <div className="flex items-center gap-3 p-3">
                  <img
                    src={venue?.logo_url}
                    alt="User"
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium">{user ? user.username : ""}</div>
                    <div className="text-xs text-glimps-600">{user ? user.email : ""}</div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("account-settings")}>
                  <User className="mr-2 h-4 w-4" />
                  <FormattedMessage id="venueDashboard.navItems.accountSettings" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("venue-settings")}>
                  <Store className="mr-2 h-4 w-4" />
                  <FormattedMessage id="venueDashboard.navItems.venueSettings" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div onClick={logout} className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <FormattedMessage id="venueDashboard.navItems.signOut" />
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl font-semibold mb-4 sm:mb-0">
                    <FormattedMessage id="venueDashboard.navItems.sessions" />
                  </h2>
                  
                  {/* Date filter controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? (
                              format(dateFrom, "PPP")
                            ) : (
                              <span><FormattedMessage id="venueDashboard.filters.dateFrom" /></span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateFrom}
                            onSelect={(date) => setDateFrom(date)}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? (
                              format(dateTo, "PPP")
                            ) : (
                              <span><FormattedMessage id="venueDashboard.filters.dateTo" /></span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={(date) => setDateTo(date)}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button variant="ghost" size="sm" onClick={resetDateFilters}>
                      <FormattedMessage id="venueDashboard.filters.reset" />
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">
                          <FormattedMessage id="venueDashboard.sessions.UUID" />
                        </TableHead>
                        <TableHead className="">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <FormattedMessage id="venueDashboard.sessions.userUUID" />
                          </div>
                        </TableHead>
                        <TableHead className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <FormattedMessage id="venueDashboard.sessions.sentToUser" />
                          </div>
                        </TableHead>
                        <TableHead className="">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <FormattedMessage id="venueDashboard.sessions.timestamp" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">
                          <FormattedMessage id="venueDashboard.sessions.actions" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPhotos.length > 0 ? (
                        paginatedPhotos.map((photo) => (
                          <TableRow key={photo.id}>
                            <TableCell className="font-medium">{photo.id}</TableCell>
                            <TableCell>{photo.user_id}</TableCell>
                            <TableCell>
                              <FormattedMessage id={
                                `venueDashboard.sessions.isPhotoSent.${photo.sent ? "yes" : "no"}`
                              } />
                            </TableCell>
                            <TableCell>{convertDateTime(photo.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <FormattedMessage id="venueDashboard.sessions.viewPhoto" />
                                  </Button>
                                </DialogTrigger>
                                <DialogPortal>
                                  <DialogOverlay className="fixed bg-transparent backdrop-blur-sm" />
                                  <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg w-full p-0 bg-transparent overflow-hidden flex items-center justify-center">
                                    <DialogTitle className="hidden">
                                      <FormattedMessage id="venueDashboard.sessions.userPhoto" />
                                    </DialogTitle>
                                    <DialogDescription className="hidden">
                                      <FormattedMessage id="venueDashboard.sessions.userPhoto" />
                                    </DialogDescription>
                                    <ImageWithFallback
                                      src={photo.photo_url}
                                      alt="User photo"
                                      className="object-scale-down"
                                    />
                                  </DialogContent>
                                </DialogPortal>
                              </Dialog>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/photos/${photo.link_id}`, '_blank')}
                              >
                                <FormattedMessage id="venueDashboard.sessions.viewSession" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            <FormattedMessage id="venueDashboard.sessions.noPhotoFound" />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredVenuePhotos.length > 0 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        {currentPhotoPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious onClick={() => setCurrentPhotoPage(prev => Math.max(1, prev - 1))} />
                          </PaginationItem>
                        )}
                        
                        {renderPaginationItems(currentPhotoPage, totalPhotoPages, setCurrentPhotoPage)}
                        
                        {currentPhotoPage < totalPhotoPages && (
                          <PaginationItem>
                            <PaginationNext onClick={() => setCurrentPhotoPage(prev => Math.min(totalPhotoPages, prev + 1))} />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl font-semibold mb-4 sm:mb-0">
                    <FormattedMessage id="venueDashboard.navItems.usersList" />
                  </h2>
                  
                  {/* Date filter controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? (
                              format(dateFrom, "PPP")
                            ) : (
                              <span><FormattedMessage id="venueDashboard.filters.dateFrom" /></span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateFrom}
                            onSelect={(date) => setDateFrom(date)}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? (
                              format(dateTo, "PPP")
                            ) : (
                              <span><FormattedMessage id="venueDashboard.filters.dateTo" /></span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={(date) => setDateTo(date)}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button variant="ghost" size="sm" onClick={resetDateFilters}>
                      <FormattedMessage id="venueDashboard.filters.reset" />
                    </Button>
                  </div>
                </div>
                
                {/* User search input */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder={intl.formatMessage({ id: "venueDashboard.filters.search" })}
                      className="w-full pl-9 pr-4"
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">
                          <FormattedMessage id="venueDashboard.usersList.UUID" />
                        </TableHead>
                        <TableHead className="w-[160px]">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <FormattedMessage id="venueDashboard.usersList.phoneNumber" />
                          </div>
                        </TableHead>
                        <TableHead className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <FormattedMessage id="venueDashboard.usersList.telegram" />
                          </div>
                        </TableHead>
                        <TableHead className="w-[180px]">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <FormattedMessage id="venueDashboard.usersList.lastSession" />
                          </div>
                        </TableHead>
                        <TableHead className="w-[180px]">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <FormattedMessage id="venueDashboard.usersList.createdAt" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">
                          <FormattedMessage id="venueDashboard.usersList.actions" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.phone_number}</TableCell>
                            <TableCell>{user.telegram_username}</TableCell>
                            <TableCell>{convertDateTime(user.photos.at(-1)?.created_at)}</TableCell>
                            <TableCell>{convertDateTime(user.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/photos/${user.photos.at(-1)?.link_id}`, '_blank')}
                                disabled={user.photos.length === 0}
                              >
                                {user.photos.length > 0
                                  ? <FormattedMessage id="venueDashboard.usersList.viewLastPhotos" />
                                  : <FormattedMessage id="venueDashboard.usersList.noPhotos" />
                                }
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <FormattedMessage id="venueDashboard.usersList.noUsers" />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredVenueUsers.length > 0 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        {currentUserPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious onClick={() => setCurrentUserPage(prev => Math.max(1, prev - 1))} />
                          </PaginationItem>
                        )}
                        
                        {renderPaginationItems(currentUserPage, totalUserPages, setCurrentUserPage)}
                        
                        {currentUserPage < totalUserPages && (
                          <PaginationItem>
                            <PaginationNext onClick={() => setCurrentUserPage(prev => Math.min(totalUserPages, prev + 1))} />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === "venue-settings" && (
            <VenueSettings 
              mode="edit" 
              loading={loading} 
              onSubmit={onVenueSettingsSubmit} 
            />
          )}

          {activeTab === "account-settings" && (
            <AccountSettings />
          )}
          
          {activeTab === "analytics" && (
            <AnalyticsInfo venueUsers={venueUsers} venuePhotos={venuePhotos} />
          )}
          
          {activeTab === "advertising" && (
            <AdvertisingManager />
          )}
        </div>
      </main>
    </div>
  );
};

export default VenueDashboard;
