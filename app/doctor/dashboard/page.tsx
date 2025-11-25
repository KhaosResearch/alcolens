'use client';
import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Activity, 
  Clock, 
  Search, 
  Bell, 
  MoreVertical, 
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

// --- Types ---
interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: 'General Checkup' | 'Surgery' | 'Consultation' | 'Follow-up';
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  image: string;
}

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: string;
}

// --- Mock Data ---
const appointments: Appointment[] = [
  { id: '1', patientName: 'Sarah Wilson', time: '09:00 AM', type: 'General Checkup', status: 'Confirmed', image: 'https://i.pravatar.cc/150?u=a' },
  { id: '2', patientName: 'James Rodriguez', time: '10:30 AM', type: 'Surgery', status: 'Pending', image: 'https://i.pravatar.cc/150?u=b' },
  { id: '3', patientName: 'Emily Chen', time: '11:15 AM', type: 'Consultation', status: 'Confirmed', image: 'https://i.pravatar.cc/150?u=c' },
  { id: '4', patientName: 'Michael Brown', time: '02:00 PM', type: 'Follow-up', status: 'Cancelled', image: 'https://i.pravatar.cc/150?u=d' },
];

const pendingReports = [
  { id: 1, patient: "Marcus Johnson", test: "Blood Panel (CBC)", date: "Today" },
  { id: 2, patient: "Linda Foster", test: "X-Ray (Thoracic)", date: "Yesterday" },
  { id: 3, patient: "William Kao", test: "MRI Scan", date: "Nov 23" },
];

// --- Sub-Components ---

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} text-white`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trend}
      </span>
      <span className="text-sm text-gray-400 ml-2">vs last month</span>
    </div>
  </div>
);

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`flex items-center w-full px-4 py-3 mb-1 rounded-lg transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
    {icon}
    <span className="ml-3 font-medium text-sm">{label}</span>
  </button>
);

// --- Main Dashboard Component ---

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-800">Alcolens</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <SidebarItem icon={<Activity size={20} />} label="Overview" active={true} />
          <SidebarItem icon={<Calendar size={20} />} label="Appointments" />
          <SidebarItem icon={<Users size={20} />} label="Patients" />
          <SidebarItem icon={<MessageSquare size={20} />} label="Messages" />
          <SidebarItem icon={<FileText size={20} />} label="Reports" />
        </nav>

        <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                <img src="https://i.pravatar.cc/150?u=doctor" alt="Dr. Smith" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="text-sm font-semibold text-gray-800">Dr. Alex Smith</p>
                    <p className="text-xs text-gray-500">Cardiologist</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for patients, appointments..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Good Morning, Dr. Smith</h1>
            <p className="text-gray-500 mt-1">Here is what's happening with your patients today.</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Appointments" 
              value="24" 
              trend="+12%" 
              trendUp={true} 
              icon={<Calendar className="w-6 h-6" />}
              color="bg-blue-500"
            />
            <StatCard 
              title="Total Patients" 
              value="1,234" 
              trend="+3.5%" 
              trendUp={true} 
              icon={<Users className="w-6 h-6" />}
              color="bg-purple-500"
            />
            <StatCard 
              title="Pending Reports" 
              value="12" 
              trend="-2%" 
              trendUp={false} 
              icon={<FileText className="w-6 h-6" />}
              color="bg-orange-500"
            />
            <StatCard 
              title="Avg. Wait Time" 
              value="14m" 
              trend="-5%" 
              trendUp={true} 
              icon={<Clock className="w-6 h-6" />}
              color="bg-teal-500"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Appointments Schedule */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Today's Schedule</h2>
                <button className="text-sm text-blue-600 font-medium hover:underline">View Calendar</button>
              </div>
              
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center justify-center w-16 bg-white rounded-lg p-2 shadow-sm">
                        <span className="text-xs font-bold text-gray-500 uppercase">{apt.time.split(' ')[1]}</span>
                        <span className="text-lg font-bold text-blue-600">{apt.time.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                         <img src={apt.image} alt={apt.patientName} className="w-10 h-10 rounded-full" />
                         <div>
                           <p className="font-semibold text-gray-800">{apt.patientName}</p>
                           <p className="text-xs text-gray-500">{apt.type}</p>
                         </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                          apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'}`}>
                        {apt.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Activity & Requests */}
            <div className="space-y-8">
              
              {/* Patient Requests */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Urgent Actions</h2>
                <div className="space-y-4">
                   <div className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Activity className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Abnormal Blood Test</p>
                        <p className="text-xs text-gray-500 mb-2">Patient: John Doe • 2 hrs ago</p>
                        <div className="flex space-x-2">
                           <button className="flex-1 text-xs bg-red-600 text-white py-1.5 rounded hover:bg-red-700 transition">Call Patient</button>
                           <button className="flex-1 text-xs bg-gray-100 text-gray-700 py-1.5 rounded hover:bg-gray-200 transition">Review</button>
                        </div>
                      </div>
                   </div>
                   
                   <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Prescription Refill</p>
                        <p className="text-xs text-gray-500 mb-2">Patient: Alice M. • 5 hrs ago</p>
                        <div className="flex space-x-2">
                           <button className="flex-1 text-xs bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition">Approve</button>
                           <button className="flex-1 text-xs bg-gray-100 text-gray-700 py-1.5 rounded hover:bg-gray-200 transition">Deny</button>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Pending Reports */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Lab Results</h2>
                </div>
                <div className="space-y-3">
                  {pendingReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <FileText className="text-gray-400 w-5 h-5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{report.test}</p>
                          <p className="text-xs text-gray-500">{report.patient}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{report.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}