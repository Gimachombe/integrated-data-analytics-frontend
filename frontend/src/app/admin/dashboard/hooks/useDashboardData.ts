import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalRevenue: number;
  activeUsers: number;
  servicesThisMonth: number;
}

export interface ServiceRequest {
  id: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  kraPin?: string;
  serviceType: 'kra' | 'business' | 'website' | 'data';
  priority: 'normal' | 'urgent' | 'express';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'mpesa' | 'bank' | 'card';
  services: any[];
  submittedAt: string;
  completedAt?: string;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalRevenue: 0,
    activeUsers: 0,
    servicesThisMonth: 0,
  });

  const [recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch from backend API
      const [statsResponse, requestsResponse] = await Promise.all([
        api.getDashboardStats(),
        api.getServiceRequests({ limit: 10, sort_by: 'submitted_at', sort_order: 'desc' }),
      ]);

      // Update stats
      setStats({
        totalRequests: statsResponse.data.service_requests?.total_requests || 0,
        pendingRequests: statsResponse.data.service_requests?.pending_requests || 0,
        completedRequests: statsResponse.data.service_requests?.completed_requests || 0,
        totalRevenue: statsResponse.data.service_requests?.total_revenue || 0,
        activeUsers: statsResponse.data.users?.active_users || 0,
        servicesThisMonth: statsResponse.data.service_requests?.monthly_requests || 0,
      });

      // Update recent requests
      if (requestsResponse.data && Array.isArray(requestsResponse.data)) {
        const formattedRequests = requestsResponse.data.map((req: any) => ({
          id: req.id,
          referenceNumber: req.reference_number || req.referenceNumber,
          firstName: req.requester_first_name || req.user_first_name || 'Unknown',
          lastName: req.requester_last_name || req.user_last_name || 'User',
          email: req.requester_email || req.user_email || '',
          phone: req.requester_phone || '',
          serviceType: req.service_type,
          priority: req.priority || 'normal',
          status: req.status,
          totalAmount: req.total_amount || 0,
          paymentStatus: req.payment_status || 'pending',
          paymentMethod: req.payment_method,
          services: [],
          submittedAt: req.submitted_at || req.created_at,
          completedAt: req.completed_at,
        }));
        setRecentRequests(formattedRequests);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');

      // Fallback to localStorage for demo
      const requestsData = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');

      const totalRevenue = requestsData.reduce((sum: number, req: ServiceRequest) => {
        return sum + (req.paymentStatus === 'paid' ? req.totalAmount : 0);
      }, 0);

      const pendingRequests = requestsData.filter(
        (req: ServiceRequest) => req.status === 'pending' || req.status === 'in_progress'
      ).length;

      const completedRequests = requestsData.filter(
        (req: ServiceRequest) => req.status === 'completed'
      ).length;

      setStats({
        totalRequests: requestsData.length,
        pendingRequests,
        completedRequests,
        totalRevenue,
        activeUsers: usersData.length || Math.floor(Math.random() * 50) + 20,
        servicesThisMonth: Math.floor(Math.random() * 10) + 5,
      });

      setRecentRequests(requestsData.slice(0, 5));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequestStatus = async (requestId: string, newStatus: ServiceRequest['status']) => {
    try {
      // Update via API
      await api.updateServiceRequestStatus(requestId, newStatus);

      // Update local state
      setRecentRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? {
                ...request,
                status: newStatus,
                ...(newStatus === 'completed' && !request.completedAt
                  ? { completedAt: new Date().toISOString() }
                  : {}),
              }
            : request
        )
      );

      // Refresh dashboard data
      await loadDashboardData();

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');

      // Fallback to localStorage update
      const updatedRequests = recentRequests.map(request => {
        if (request.id === requestId) {
          return {
            ...request,
            status: newStatus,
            ...(newStatus === 'completed' && !request.completedAt
              ? { completedAt: new Date().toISOString() }
              : {}),
          };
        }
        return request;
      });

      setRecentRequests(updatedRequests);
      localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));
    }
  };

  const deleteRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this service request?')) return;

    try {
      // In a real app, call API to delete
      // For demo, update local storage
      const updatedRequests = recentRequests.filter(request => request.id !== requestId);
      setRecentRequests(updatedRequests);
      localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));

      await loadDashboardData();
      toast.success('Service request deleted');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete service request');
    }
  };

  // Load data on mount and set up polling
  useEffect(() => {
    loadDashboardData();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  return {
    stats,
    recentRequests,
    loading,
    refreshData: loadDashboardData,
    updateRequestStatus,
    deleteRequest,
  };
}
