
import DashboardSidebar from "../components/DashboardSidebar";
import { 
  BarChart3, 
  Building, 
  TrendingUp, 
  Camera, 
  CircleDollarSign, 
  AlertCircle,
  Bell,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  CheckCircle2,
  XCircle
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      name: "Total Venues",
      value: "142",
      change: "+4.2%",
      isPositive: true,
      icon: <Building className="h-5 w-5 text-glimps-accent" />,
    },
    {
      name: "Total Photos",
      value: "1.2M",
      change: "+16.3%",
      isPositive: true,
      icon: <Camera className="h-5 w-5 text-glimps-accent" />,
    },
    {
      name: "Monthly Revenue",
      value: "$89,452",
      change: "+7.5%",
      isPositive: true,
      icon: <CircleDollarSign className="h-5 w-5 text-glimps-accent" />,
    },
    {
      name: "Active Issues",
      value: "8",
      change: "-3",
      isPositive: true,
      icon: <AlertCircle className="h-5 w-5 text-glimps-accent" />,
    },
  ];

  const topVenues = [
    {
      name: "Urban Lounge",
      location: "New York, NY",
      revenue: "$8,245",
      photos: "45,231",
      status: "Active",
      growth: 12.4,
      isPositive: true,
    },
    {
      name: "Sky Bar",
      location: "Los Angeles, CA",
      revenue: "$7,891",
      photos: "38,129",
      status: "Active",
      growth: 8.7,
      isPositive: true,
    },
    {
      name: "The Capitol",
      location: "Washington, DC",
      revenue: "$6,452",
      photos: "32,456",
      status: "Active",
      growth: -2.3,
      isPositive: false,
    },
    {
      name: "Midnight Club",
      location: "Miami, FL",
      revenue: "$5,934",
      photos: "29,874",
      status: "Active",
      growth: 5.1,
      isPositive: true,
    },
    {
      name: "Azure",
      location: "Chicago, IL",
      revenue: "$5,127",
      photos: "27,129",
      status: "Maintenance",
      growth: 0,
      isPositive: false,
    },
  ];

  const pendingIssues = [
    {
      id: 1,
      venue: "Midnight Club",
      issue: "Touchscreen calibration issue",
      priority: "High",
      date: "Jun 24, 2023",
      status: "In Progress",
    },
    {
      id: 2,
      venue: "Sky Bar",
      issue: "Printer not responding",
      priority: "Medium",
      date: "Jun 25, 2023",
      status: "Open",
    },
    {
      id: 3,
      venue: "Azure",
      issue: "Software update failed",
      priority: "High",
      date: "Jun 25, 2023",
      status: "Open",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      venue: "The Capitol",
      alert: "Photobooth #3 offline for 2 hours",
      time: "Just now",
    },
    {
      id: 2,
      venue: "Urban Lounge",
      alert: "High usage detected",
      time: "3 hours ago",
    },
    {
      id: 3,
      venue: "Blue Wave",
      alert: "Maintenance completed",
      time: "Yesterday",
    },
    {
      id: 4,
      venue: "Sky Bar",
      alert: "New issue reported",
      time: "2 days ago",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} />
      
      <div className="flex-1 overflow-auto">
        <div className="border-b bg-white">
          <div className="flex h-16 items-center gap-8 px-6">
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>
            
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="search"
                placeholder="Search venues, issues..."
                className="w-full rounded-full bg-gray-100 pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-glimps-accent"
              />
            </div>
            
            <button className="relative p-2 text-gray-600 hover:text-gray-700">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-glimps-accent"></span>
            </button>
            
            <button className="flex items-center gap-2 text-sm font-medium">
              Admin Portal
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <main className="p-6">
          <div className="grid gap-6">
            <section>
              <h2 className="text-xl font-semibold mb-5">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="rounded-lg border bg-white p-5 shadow-sm">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className="rounded-full bg-glimps-50 p-3">
                        {stat.icon}
                      </div>
                    </div>
                    <p className={`mt-2 text-xs font-medium ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                ))}
              </div>
            </section>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 rounded-lg border bg-white shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Top Performing Venues</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">This Month</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium text-gray-500">Venue</th>
                          <th className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium text-gray-500">Revenue</th>
                          <th className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium text-gray-500">Photos</th>
                          <th className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium text-gray-500">Growth</th>
                          <th className="whitespace-nowrap px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topVenues.map((venue, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="whitespace-nowrap px-4 py-3">
                              <div>
                                <div className="font-medium">{venue.name}</div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {venue.location}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-medium">{venue.revenue}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-gray-600">{venue.photos}</td>
                            <td className="whitespace-nowrap px-4 py-3">
                              <div className={`flex items-center ${venue.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {venue.isPositive ? (
                                  <ArrowUpRight className="h-4 w-4 mr-1" />
                                ) : venue.growth === 0 ? (
                                  <span className="text-gray-500">—</span>
                                ) : (
                                  <ArrowDownRight className="h-4 w-4 mr-1" />
                                )}
                                {venue.growth === 0 ? '0%' : `${Math.abs(venue.growth)}%`}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                              <span 
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  venue.status === 'Active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-orange-100 text-orange-800'
                                }`}
                              >
                                {venue.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
              
              <section className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Recent Alerts</h3>
                    <a href="#" className="text-sm text-glimps-accent">View all</a>
                  </div>
                  <div className="space-y-4">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-4">
                        <div className="mt-0.5 rounded-full p-1.5 bg-yellow-100 text-yellow-600">
                          <AlertCircle className="h-3 w-3" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{alert.venue}</p>
                          <p className="text-sm">{alert.alert}</p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
            
            <section className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Pending Issues</h3>
                <a href="#" className="text-sm text-glimps-accent">View all issues</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Venue</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Issue</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Priority</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingIssues.map((issue) => (
                      <tr key={issue.id} className="border-b">
                        <td className="px-4 py-3 text-sm font-medium">{issue.venue}</td>
                        <td className="px-4 py-3 text-sm">{issue.issue}</td>
                        <td className="px-4 py-3 text-sm">
                          <span 
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              issue.priority === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : issue.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {issue.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{issue.date}</td>
                        <td className="px-4 py-3 text-sm">
                          <span 
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              issue.status === 'Open' 
                                ? 'bg-orange-100 text-orange-800' 
                                : issue.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {issue.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          <div className="flex justify-end gap-2">
                            <button className="rounded-full p-1 text-green-600 hover:bg-green-50">
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button className="rounded-full p-1 text-red-600 hover:bg-red-50">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
