'use client';

import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiGlobe, FiFileText, FiDatabase } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  category: 'kra' | 'business' | 'website' | 'data';
  price: number;
  status: 'active' | 'inactive';
  description: string;
}

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'KRA PIN Registration',
      category: 'kra',
      price: 1500,
      status: 'active',
      description: 'Register your KRA PIN quickly',
    },
    {
      id: '2',
      name: 'Company Registration',
      category: 'business',
      price: 25000,
      status: 'active',
      description: 'Complete company registration',
    },
    {
      id: '3',
      name: 'Basic Website Development',
      category: 'website',
      price: 25000,
      status: 'active',
      description: '5-page responsive website',
    },
    {
      id: '4',
      name: 'Data Collection & Entry',
      category: 'data',
      price: 15000,
      status: 'active',
      description: 'Professional data services',
    },
    {
      id: '5',
      name: 'Tax Returns Filing',
      category: 'kra',
      price: 5000,
      status: 'inactive',
      description: 'Tax filing services',
    },
    {
      id: '6',
      name: 'E-commerce Website',
      category: 'website',
      price: 75000,
      status: 'active',
      description: 'Full online store setup',
    },
  ]);

  const handleAddService = () => {
    toast.success('Add service functionality coming soon');
  };

  const handleEditService = (service: Service) => {
    toast.success(`Edit service: ${service.name}`);
  };

  const handleDeleteService = (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    setServices(services.filter(service => service.id !== serviceId));
    toast.success('Service deleted');
  };

  const handleToggleStatus = (serviceId: string) => {
    setServices(
      services.map(service =>
        service.id === serviceId
          ? { ...service, status: service.status === 'active' ? 'inactive' : 'active' }
          : service
      )
    );
    toast.success('Service status updated');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'kra':
        return <FiFileText className="text-blue-600" />;
      case 'business':
        return <FiGlobe className="text-purple-600" />;
      case 'website':
        return <FiGlobe className="text-indigo-600" />;
      case 'data':
        return <FiDatabase className="text-cyan-600" />;
      default:
        return <FiFileText className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'kra':
        return 'bg-blue-100 text-blue-800';
      case 'business':
        return 'bg-purple-100 text-purple-800';
      case 'website':
        return 'bg-indigo-100 text-indigo-800';
      case 'data':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Services Management</h3>
          <button
            onClick={handleAddService}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="mr-2" />
            Add Service
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {services.map(service => (
          <div
            key={service.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                <div className="flex items-center mt-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      service.category === 'kra'
                        ? 'bg-blue-500'
                        : service.category === 'business'
                          ? 'bg-purple-500'
                          : service.category === 'website'
                            ? 'bg-indigo-500'
                            : 'bg-cyan-500'
                    }`}
                  ></span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(service.category)}`}
                  >
                    {service.category}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  service.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {service.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  KES {service.price.toLocaleString()}
                </div>
                <button
                  onClick={() => handleToggleStatus(service.id)}
                  className={`text-xs ${service.status === 'active' ? 'text-red-600' : 'text-green-600'} hover:underline mt-1`}
                >
                  {service.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditService(service)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                  title="Edit Service"
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Delete Service"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
