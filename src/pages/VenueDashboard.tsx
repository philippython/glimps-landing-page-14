
import DashboardSidebar from "../components/DashboardSidebar";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Camera, 
  Calendar, 
  MessageSquare,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";

const VenueDashboard = () => {
  const stats = [
    {
      name: "Total Photos",
      value: "14,298",
      change: "+12.5%",
      isPositive: true,
      icon: <Camera className="h-5 w-5 text-glimps-accent" />,
    },
    {
      name: "User Engagement",
      value: "87%",
      change: "+4.3%",
      isPositive: true,
      icon: <Users className="h-5 w-5 text-glimps-accent" />,
    },
    {
      name: "Social Shares",
      value: "9,432",
      change: "+18.2%",
      isPositive: true,
      icon: <TrendingUp className="h-5 w-5 text-glimps-accent" />,
    },
    {
      name: "Upcoming Bookings",
      value: "12",
      change: "-2",
      isPositive: false,
      icon: <Calendar className="h-5 w-5 text-glimps-accent" />,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Booth #2 needs maintenance",
      time: "Just now",
      isAlert: true,
    },
    {
      id: 2,
      action: "42 photos taken yesterday",
      time: "2 hours ago",
      isAlert: false,
    },
    {
      id: 3,
      action: "New booking confirmed for next Saturday",
      time: "Yesterday",
      isAlert: false,
    },
    {
      id: 4,
      action: "Software update available",
      time: "2 days ago",
      isAlert: true,
    },
    {
      id: 5,
      action: "Monthly report ready for download",
      time: "1 week ago",
      isAlert: false,
    },
  ];

  const weeklyData = [
    { day: "Mon", photos: 58 },
    { day: "Tue", photos: 45 },
    { day: "Wed", photos: 73 },
    { day: "Thu", photos: 91 },
    { day: "Fri", photos: 130 },
    { day: "Sat", photos: 176 },
    { day: "Sun", photos: 112 },
  ];

  const maxPhotos = Math.max(...weeklyData.map(d => d.photos));

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
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-full bg-gray-100 pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-glimps-accent"
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
            <section>
              <h2 className="text-xl font-semibold mb-5">Overview</h2>
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
            
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              <section className="lg:col-span-4 rounded-lg border bg-white shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Weekly Photo Activity</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">This Week</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="h-64 flex items-end gap-2">
                    {weeklyData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-glimps-100 hover:bg-glimps-200 transition-all rounded-t-sm"
                          style={{ height: `${(item.photos / maxPhotos) * 200}px` }}
                        >
                          <div className="bg-glimps-accent h-1 w-full"></div>
                        </div>
                        <span className="text-xs text-gray-600">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              
              <section className="lg:col-span-2 rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Recent Activity</h3>
                    <a href="#" className="text-sm text-glimps-accent">View all</a>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className={`mt-0.5 rounded-full p-1.5 ${activity.isAlert ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {activity.isAlert ? <Bell className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
            
            <section className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Upcoming Bookings</h3>
                <a href="#" className="text-sm text-glimps-accent">View all bookings</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Event</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Contact</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-sm">Private Party</td>
                      <td className="px-4 py-3 text-sm">Jun 28, 2023</td>
                      <td className="px-4 py-3 text-sm">7:00 PM - 11:00 PM</td>
                      <td className="px-4 py-3 text-sm">Sarah Johnson</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Confirmed</span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <button className="text-glimps-accent hover:text-glimps-accent/90">Details</button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-sm">Corporate Event</td>
                      <td className="px-4 py-3 text-sm">Jul 2, 2023</td>
                      <td className="px-4 py-3 text-sm">6:00 PM - 9:00 PM</td>
                      <td className="px-4 py-3 text-sm">Michael Chen</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Pending</span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <button className="text-glimps-accent hover:text-glimps-accent/90">Details</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">Wedding Reception</td>
                      <td className="px-4 py-3 text-sm">Jul 15, 2023</td>
                      <td className="px-4 py-3 text-sm">5:00 PM - 12:00 AM</td>
                      <td className="px-4 py-3 text-sm">Jessica Williams</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Confirmed</span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <button className="text-glimps-accent hover:text-glimps-accent/90">Details</button>
                      </td>
                    </tr>
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

export default VenueDashboard;
