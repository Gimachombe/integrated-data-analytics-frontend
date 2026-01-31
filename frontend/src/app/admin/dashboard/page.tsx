'use client';

import { useState } from 'react';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStats from './components/DashboardStats';
import RecentRequests from './components/RecentRequests';
import QuickActions from './components/QuickActions';
import ServiceRequestsTable from './components/ServiceRequestsTable';
import UsersTab from './components/UsersTab';
import PaymentsTab from './components/PaymentsTab';
import InvoicesTab from './components/InvoicesTab';
import ServicesTab from './components/ServicesTab';
import ReportsTab from './components/ReportsTab';
import SettingsTab from './components/SettingsTab';
import { useDashboardData } from './hooks/useDashboardData';

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const { stats, recentRequests, loading, refreshData, updateRequestStatus, deleteRequest } =
    useDashboardData();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <DashboardStats stats={stats} loading={loading} />
            <div className="grid lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <RecentRequests
                  requests={recentRequests}
                  loading={loading}
                  onStatusUpdate={updateRequestStatus}
                />
              </div>
              <QuickActions />
            </div>
          </>
        );
      case 'requests':
        return (
          <ServiceRequestsTable
            onStatusUpdate={updateRequestStatus}
            onDeleteRequest={deleteRequest}
            refreshData={refreshData}
          />
        );
      case 'users':
        return <UsersTab />;
      case 'payments':
        return <PaymentsTab />;
      case 'invoices':
        return <InvoicesTab />;
      case 'services':
        return <ServicesTab />;
      case 'reports':
        return <ReportsTab stats={stats} />;
      case 'settings':
        return <SettingsTab />;
      default:
        return (
          <>
            <DashboardStats stats={stats} loading={loading} />
            <RecentRequests
              requests={recentRequests}
              loading={loading}
              onStatusUpdate={updateRequestStatus}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderActiveTab()
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
