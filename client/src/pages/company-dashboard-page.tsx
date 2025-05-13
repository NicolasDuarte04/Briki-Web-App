import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUp, 
  ArrowDown, 
  Users, 
  MousePointer, 
  SendIcon, 
  ActivityIcon 
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {getCompanyName()}</h1>
            <p className="text-gray-600">Here's what's happening with your insurance plans on Briki</p>
          </div>
          
          <div className="flex items-center">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Partner Preview
            </div>
          </div>
        </div>
        
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* DAU Card */}
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Daily Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">{dailyData[dailyData.length - 1].users}</div>
                  <div className={`text-xs flex items-center ${isUp('users') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isUp('users') ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {getPercentChange('users')}% {isUp('users') ? 'increase' : 'decrease'}
                  </div>
                </div>
                <div className="p-2 bg-blue-100/50 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Plan Clicks Card */}
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Insurance Plan Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">{dailyData[dailyData.length - 1].clicks}</div>
                  <div className={`text-xs flex items-center ${isUp('clicks') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isUp('clicks') ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {getPercentChange('clicks')}% {isUp('clicks') ? 'increase' : 'decrease'}
                  </div>
                </div>
                <div className="p-2 bg-blue-100/50 rounded-full">
                  <MousePointer className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quote Requests Card */}
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Quote Interest Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">{dailyData[dailyData.length - 1].quotes}</div>
                  <div className={`text-xs flex items-center ${isUp('quotes') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isUp('quotes') ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {getPercentChange('quotes')}% {isUp('quotes') ? 'increase' : 'decrease'}
                  </div>
                </div>
                <div className="p-2 bg-blue-100/50 rounded-full">
                  <SendIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Analytics Section */}
        <Card className="bg-white border-blue-100 shadow-sm overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Analytics Overview</CardTitle>
              <Tabs defaultValue="week" className="w-[400px]" onValueChange={setTimeRange}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="week">7 Days</TabsTrigger>
                  <TabsTrigger value="month">30 Days</TabsTrigger>
                  <TabsTrigger value="quarter">Quarter</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Active Users"
                    stroke="#0088FE"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    name="Plan Clicks"
                    stroke="#00C49F"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="quotes"
                    name="Quote Requests"
                    stroke="#FFBB28"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Type Distribution */}
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle>Top Plan Types Searched</CardTitle>
              <CardDescription>
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
                    <Legend />
                    <Tooltip formatter={(value) => [`${value}%`, 'Interest']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* User Interest by Region */}
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle>User Interest by Region</CardTitle>
              <CardDescription>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip />
                    <Bar dataKey="users" name="Active Users" fill="#0088FE" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="quotes" name="Quote Requests" fill="#00C49F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Conversion Funnel */}
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      scale="band" 
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip />
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
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest interactions with your plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Activity item 1 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <ActivityIcon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Quote Request</h4>
                      <span className="text-xs text-gray-500">10 min ago</span>
                    </div>
                    <p className="text-sm text-gray-600">New quote request for "Premium Travel Insurance"</p>
                  </div>
                </div>
                
                {/* Activity item 2 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <ActivityIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">AI Assistant Mention</h4>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-600">Your plan was featured in 15 AI Assistant recommendations</p>
                  </div>
                </div>
                
                {/* Activity item 3 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <ActivityIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Top Performer</h4>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                    <p className="text-sm text-gray-600">"Family Protection Plan" was viewed 128 times yesterday</p>
                  </div>
                </div>
                
                {/* Activity item 4 */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <ActivityIcon className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Comparison Feature</h4>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-600">Users compared your plans with competitors 56 times</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CompanyLayout>
  );
}