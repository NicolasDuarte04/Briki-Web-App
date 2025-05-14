import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUp, 
  ArrowDown, 
  Users, 
  MousePointer, 
  SendIcon, 
  ActivityIcon,
  Zap,
  Shield
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useAuth } from "@/hooks/use-auth";
import CompanyLayout from "@/components/layout/company-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Simulated analytics data
const dailyData = [
  { date: "May 1", users: 120, clicks: 45, quotes: 12 },
  { date: "May 2", users: 132, clicks: 56, quotes: 15 },
  { date: "May 3", users: 101, clicks: 36, quotes: 8 },
  { date: "May 4", users: 134, clicks: 65, quotes: 21 },
  { date: "May 5", users: 158, clicks: 91, quotes: 29 },
  { date: "May 6", users: 149, clicks: 72, quotes: 22 },
  { date: "May 7", users: 187, clicks: 99, quotes: 31 },
  { date: "May 8", users: 192, clicks: 108, quotes: 39 },
  { date: "May 9", users: 204, clicks: 95, quotes: 34 },
  { date: "May 10", users: 231, clicks: 116, quotes: 42 },
  { date: "May 11", users: 222, clicks: 102, quotes: 35 },
  { date: "May 12", users: 245, clicks: 122, quotes: 48 },
  { date: "May 13", users: 267, clicks: 132, quotes: 52 },
];

const planTypeData = [
  { name: "Travel", value: 42 },
  { name: "Auto", value: 28 },
  { name: "Pet", value: 15 },
  { name: "Health", value: 15 },
];

const regionData = [
  { name: "Colombia", users: 520, quotes: 143 },
  { name: "Mexico", users: 480, quotes: 126 },
  { name: "Other", users: 120, quotes: 31 },
];

const conversionData = [
  { name: "Viewed", value: 3200 },
  { name: "Clicked", value: 1200 },
  { name: "Quoted", value: 400 },
  { name: "Purchased", value: 120 },
];

// Using navy-based color palette
const COLORS = ['#0074FF', '#33BFFF', '#005CB8', '#003087', '#001A40'];

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("week");

  // Get company name from user data
  const getCompanyName = () => {
    if (!user) return "Partner";
    
    if (user.companyProfile?.name) {
      return user.companyProfile.name;
    }
    
    return user.username;
  };
  
  // Determine if metrics are up or down
  const isUp = (metric: 'users' | 'clicks' | 'quotes') => {
    const lastDay = dailyData[dailyData.length - 1][metric];
    const prevDay = dailyData[dailyData.length - 2][metric];
    return lastDay > prevDay;
  };
  
  // Calculate percentage change
  const getPercentChange = (metric: 'users' | 'clicks' | 'quotes') => {
    const lastDay = dailyData[dailyData.length - 1][metric];
    const prevDay = dailyData[dailyData.length - 2][metric];
    const change = ((lastDay - prevDay) / prevDay) * 100;
    return change.toFixed(1);
  };

  return (
    <CompanyLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {getCompanyName()}</h1>
            <p className="text-gray-400">Here's what's happening with your insurance plans on Briki</p>
          </div>
          
          <div className="flex items-center">
            <div className="px-3 py-1 bg-[#002C7A] text-[#33BFFF] text-xs rounded-full border border-[#0074FF]/30">
              Partner Dashboard
            </div>
          </div>
        </motion.div>
        
        {/* Stat cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* DAU Card */}
          <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)] hover:shadow-[0_6px_16px_rgba(51,191,255,0.15)] transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Daily Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-white">{dailyData[dailyData.length - 1].users}</div>
                  <div className={`text-xs flex items-center ${isUp('users') ? 'text-[#60CDFF]' : 'text-red-400'}`}>
                    {isUp('users') ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {getPercentChange('users')}% {isUp('users') ? 'increase' : 'decrease'}
                  </div>
                </div>
                <div className="p-2 bg-[#002C7A]/70 rounded-full">
                  <Users className="h-5 w-5 text-[#33BFFF]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Plan Clicks Card */}
          <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)] hover:shadow-[0_6px_16px_rgba(51,191,255,0.15)] transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Insurance Plan Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-white">{dailyData[dailyData.length - 1].clicks}</div>
                  <div className={`text-xs flex items-center ${isUp('clicks') ? 'text-[#60CDFF]' : 'text-red-400'}`}>
                    {isUp('clicks') ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {getPercentChange('clicks')}% {isUp('clicks') ? 'increase' : 'decrease'}
                  </div>
                </div>
                <div className="p-2 bg-[#002C7A]/70 rounded-full">
                  <MousePointer className="h-5 w-5 text-[#33BFFF]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quote Requests Card */}
          <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)] hover:shadow-[0_6px_16px_rgba(51,191,255,0.15)] transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Quote Interest Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-white">{dailyData[dailyData.length - 1].quotes}</div>
                  <div className={`text-xs flex items-center ${isUp('quotes') ? 'text-[#60CDFF]' : 'text-red-400'}`}>
                    {isUp('quotes') ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {getPercentChange('quotes')}% {isUp('quotes') ? 'increase' : 'decrease'}
                  </div>
                </div>
                <div className="p-2 bg-[#002C7A]/70 rounded-full">
                  <SendIcon className="h-5 w-5 text-[#33BFFF]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Analytics Overview</CardTitle>
                <Tabs defaultValue="week" className="w-[400px]" onValueChange={setTimeRange}>
                  <TabsList className="grid grid-cols-3 bg-[#002050] border border-[#003087]">
                    <TabsTrigger 
                      value="week" 
                      className="data-[state=active]:bg-[#0055CC] data-[state=active]:text-white"
                    >
                      7 Days
                    </TabsTrigger>
                    <TabsTrigger 
                      value="month"
                      className="data-[state=active]:bg-[#0055CC] data-[state=active]:text-white"
                    >
                      30 Days
                    </TabsTrigger>
                    <TabsTrigger 
                      value="quarter"
                      className="data-[state=active]:bg-[#0055CC] data-[state=active]:text-white"
                    >
                      Quarter
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription className="text-gray-400">
                Customer interaction with your insurance plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyData.slice(-7)}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#002C7A" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#556581"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#556581"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#001A40", 
                        borderColor: "#002C7A",
                        color: "#fff" 
                      }}
                      itemStyle={{ color: "#fff" }}
                      labelStyle={{ color: "#33BFFF" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      name="Active Users"
                      stroke="#0074FF"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#0074FF", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#33BFFF", stroke: "#fff", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      name="Plan Clicks"
                      stroke="#33BFFF"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#33BFFF", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#33BFFF", stroke: "#fff", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="quotes"
                      name="Quote Requests"
                      stroke="#60CDFF"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#60CDFF", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#60CDFF", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Charts Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Plan Type Distribution */}
          <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">Top Plan Types Searched</CardTitle>
              <CardDescription className="text-gray-400">
                Distribution of user interest by insurance category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {planTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#001A40", 
                        borderColor: "#002C7A",
                        color: "#fff" 
                      }}
                      itemStyle={{ color: "#fff" }}
                      labelStyle={{ color: "#33BFFF" }}
                      formatter={(value) => [`${value}%`, 'Interest']} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* User Interest by Region */}
          <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">User Interest by Region</CardTitle>
              <CardDescription className="text-gray-400">
                Geographic breakdown of users and quote requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={regionData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#002C7A" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#556581"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#556581"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#001A40", 
                        borderColor: "#002C7A",
                        color: "#fff" 
                      }}
                      itemStyle={{ color: "#fff" }}
                      labelStyle={{ color: "#33BFFF" }}
                    />
                    <Bar dataKey="users" name="Active Users" fill="#0074FF" radius={[4, 4, 0, 0]}>
                      {regionData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill="#0074FF" 
                          className="animate-pulse-slow"
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="quotes" name="Quote Requests" fill="#33BFFF" radius={[4, 4, 0, 0]}>
                      {regionData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill="#33BFFF"
                          className="animate-pulse-slow"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Conversion Funnel */}
          <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">Conversion Funnel</CardTitle>
              <CardDescription className="text-gray-400">
                User journey from view to purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversionData}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 60,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#002C7A" opacity={0.3} />
                    <XAxis type="number" stroke="#556581" tickLine={false} axisLine={false} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      scale="band" 
                      stroke="#556581"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#001A40", 
                        borderColor: "#002C7A",
                        color: "#fff" 
                      }}
                      itemStyle={{ color: "#fff" }}
                      labelStyle={{ color: "#33BFFF" }}
                    />
                    <Bar 
                      dataKey="value" 
                      name="Users"
                      fill="#8884d8" 
                      radius={[0, 4, 4, 0]} 
                      barSize={30}
                    >
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card className="bg-[#001A40]/60 backdrop-blur-sm border-[#002C7A] shadow-[0_4px_12px_rgba(0,46,115,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Latest interactions with your plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Activity item 1 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-[#003087]/50 rounded-full border border-[#0074FF]/30">
                    <Zap className="h-4 w-4 text-[#33BFFF]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">Quote Request</h4>
                      <span className="text-xs text-gray-400">10 min ago</span>
                    </div>
                    <p className="text-sm text-gray-400">New quote request for "Premium Travel Insurance"</p>
                  </div>
                </div>
                
                {/* Activity item 2 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-[#003087]/50 rounded-full border border-[#0074FF]/30">
                    <Shield className="h-4 w-4 text-[#33BFFF]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">Placement Changed</h4>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-400">Your "Family Auto Insurance" is now prominently featured</p>
                  </div>
                </div>
                
                {/* Activity item 3 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-[#003087]/50 rounded-full border border-[#0074FF]/30">
                    <ActivityIcon className="h-4 w-4 text-[#33BFFF]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">Analytics Update</h4>
                      <span className="text-xs text-gray-400">1 day ago</span>
                    </div>
                    <p className="text-sm text-gray-400">Weekly performance report available for your plans</p>
                  </div>
                </div>
                
                {/* Activity item 4 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-[#003087]/50 rounded-full border border-[#0074FF]/30">
                    <Users className="h-4 w-4 text-[#33BFFF]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">Traffic Spike</h4>
                      <span className="text-xs text-gray-400">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-400">Unusual increase in visitors to your "Pet Insurance" plan</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </CompanyLayout>
  );
}