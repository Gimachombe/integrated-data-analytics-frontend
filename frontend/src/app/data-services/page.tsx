'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiUpload, FiDownload, FiFilter } from 'react-icons/fi';
import ServiceRequestForm from '@/components/ServiceRequestForm';
import ServiceRequestsTable from '@/components/ServiceRequestsTable';

const serviceTypes = [
  { id: 'mining', label: 'Data Mining' },
  { id: 'cleaning', label: 'Data Cleaning' },
  { id: 'collection', label: 'Data Collection' },
  { id: 'analysis', label: 'Data Analysis' },
];

const dataSources = [
  { id: 'web', label: 'Web Sources' },
  { id: 'api', label: 'API Integration' },
  { id: 'database', label: 'Database' },
  { id: 'files', label: 'File Uploads' },
];

const serviceRequestSchema = z.object({
  serviceType: z.enum(['mining', 'cleaning', 'collection', 'analysis']),
  dataSource: z.string().optional(),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
  deadline: z.string().optional(),
  specialInstructions: z.string().optional(),
});

export default function DataServices() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  const form = useForm({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      serviceType: 'analysis',
      requirements: '',
      deadline: '',
      specialInstructions: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // TODO: Submit to API
      console.log('Submitting request:', data);
      setIsRequestFormOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to submit request:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Services</h1>
          <p className="text-gray-600 mt-2">
            Professional data mining, cleaning, collection, and analysis services
          </p>
        </div>
        <button
          onClick={() => setIsRequestFormOpen(true)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FiUpload />
          <span>New Service Request</span>
        </button>
      </div>

      {/* Service Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceTypes.map(type => (
          <div
            key={type.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              form.setValue('serviceType', type.id as any);
              setIsRequestFormOpen(true);
            }}
          >
            <div className="text-primary-600 mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <FiDownload size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">{type.label}</h3>
            <p className="text-gray-600 text-sm mt-2">
              Professional {type.label.toLowerCase()} services for your business needs
            </p>
          </div>
        ))}
      </div>

      {/* Service Request Form Modal */}
      {isRequestFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">New Data Service Request</h2>
                <button
                  onClick={() => setIsRequestFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <ServiceRequestForm
                form={form}
                onSubmit={onSubmit}
                serviceTypes={serviceTypes}
                dataSources={dataSources}
              />
            </div>
          </div>
        </div>
      )}

      {/* My Requests Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">My Service Requests</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiFilter />
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <ServiceRequestsTable requests={requests} />
        </div>
      </div>
    </div>
  );
}
