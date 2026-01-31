'use client';

import { useState, useEffect } from 'react';
import {
  FiDatabase,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiMinus,
  FiShoppingCart,
  FiArrowRight,
  FiArrowLeft,
  FiPieChart,
  FiBarChart,
  FiTrendingUp,
  FiFilter,
  FiDownload,
  FiUpload,
  FiCloud,
  FiEye,
  FiCode,
  FiBarChart2,
  FiActivity,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const serviceCategories = [
  {
    id: 'data_collection',
    name: 'Data Collection & Mining',
    icon: '📊',
    services: [
      {
        id: 'web_scraping',
        label: 'Web Scraping & Data Extraction',
        description: 'Extract data from websites, APIs, and online sources for analysis',
        price: 25000,
        category: 'data_collection',
        estimatedTime: '5-10 business days',
        popular: true,
        features: [
          'Custom data extraction scripts',
          'API integration and data collection',
          'Social media data extraction',
          'Competitor data gathering',
          'Real-time data collection',
          'Data validation and cleaning',
        ],
      },
      {
        id: 'survey_design',
        label: 'Survey Design & Data Collection',
        description: 'Design and conduct surveys with automated data collection',
        price: 30000,
        category: 'data_collection',
        estimatedTime: '7-14 business days',
        features: [
          'Survey questionnaire design',
          'Online/offline data collection',
          'Respondent targeting',
          'Data quality assurance',
          'Response rate optimization',
          'Multi-channel distribution',
        ],
      },
      {
        id: 'database_migration',
        label: 'Database Migration & Integration',
        description: 'Migrate and integrate data from multiple sources into unified systems',
        price: 50000,
        category: 'data_collection',
        estimatedTime: '10-20 business days',
        hasVariablePrice: true,
        minPrice: 50000,
      },
      {
        id: 'real_time_streaming',
        label: 'Real-time Data Streaming Setup',
        description: 'Set up real-time data streaming and ingestion pipelines',
        price: 75000,
        category: 'data_collection',
        estimatedTime: '15-25 business days',
        popular: true,
      },
      {
        id: 'iot_data_collection',
        label: 'IoT Data Collection Systems',
        description: 'Design systems for collecting data from IoT devices and sensors',
        price: 100000,
        category: 'data_collection',
        estimatedTime: '20-30 business days',
        hasVariablePrice: true,
        minPrice: 100000,
      },
    ],
  },
  {
    id: 'data_cleaning',
    name: 'Data Cleaning & Preparation',
    icon: '🧹',
    services: [
      {
        id: 'data_cleaning_basic',
        label: 'Basic Data Cleaning Service',
        description: 'Clean and prepare datasets by removing duplicates, handling missing values',
        price: 15000,
        category: 'data_cleaning',
        estimatedTime: '3-5 business days',
        popular: true,
        features: [
          'Duplicate removal',
          'Missing value handling',
          'Data type conversion',
          'Outlier detection',
          'Format standardization',
          'Data validation checks',
        ],
      },
      {
        id: 'advanced_data_wrangling',
        label: 'Advanced Data Wrangling',
        description: 'Complex data transformation and preparation for analysis',
        price: 30000,
        category: 'data_cleaning',
        estimatedTime: '5-10 business days',
        hasVariablePrice: true,
        minPrice: 30000,
      },
      {
        id: 'data_normalization',
        label: 'Data Normalization & Standardization',
        description: 'Normalize and standardize data for consistent analysis',
        price: 20000,
        category: 'data_cleaning',
        estimatedTime: '4-7 business days',
      },
      {
        id: 'text_data_cleaning',
        label: 'Text Data Cleaning & Processing',
        description: 'Clean and process unstructured text data for NLP applications',
        price: 25000,
        category: 'data_cleaning',
        estimatedTime: '5-8 business days',
      },
      {
        id: 'automated_cleaning_pipeline',
        label: 'Automated Cleaning Pipeline',
        description: 'Build automated data cleaning pipelines for recurring datasets',
        price: 45000,
        category: 'data_cleaning',
        estimatedTime: '10-15 business days',
      },
    ],
  },
  {
    id: 'data_analysis',
    name: 'Data Analysis & Insights',
    icon: '🔍',
    services: [
      {
        id: 'exploratory_analysis',
        label: 'Exploratory Data Analysis (EDA)',
        description: 'Comprehensive analysis to discover patterns and insights in your data',
        price: 25000,
        category: 'data_analysis',
        estimatedTime: '5-8 business days',
        popular: true,
        features: [
          'Statistical summary generation',
          'Data visualization',
          'Pattern identification',
          'Correlation analysis',
          'Hypothesis testing',
          'Insights report generation',
        ],
      },
      {
        id: 'predictive_modeling',
        label: 'Predictive Analytics & Modeling',
        description: 'Build predictive models using machine learning algorithms',
        price: 60000,
        category: 'data_analysis',
        estimatedTime: '15-25 business days',
        hasVariablePrice: true,
        minPrice: 60000,
      },
      {
        id: 'statistical_analysis',
        label: 'Statistical Analysis Services',
        description: 'Advanced statistical analysis for research and business decisions',
        price: 35000,
        category: 'data_analysis',
        estimatedTime: '7-12 business days',
      },
      {
        id: 'time_series_analysis',
        label: 'Time Series Analysis',
        description: 'Analyze time-dependent data for forecasting and trend analysis',
        price: 40000,
        category: 'data_analysis',
        estimatedTime: '8-14 business days',
      },
      {
        id: 'customer_analytics',
        label: 'Customer Analytics & Segmentation',
        description: 'Analyze customer data for segmentation and behavior prediction',
        price: 45000,
        category: 'data_analysis',
        estimatedTime: '10-16 business days',
        popular: true,
      },
    ],
  },
  {
    id: 'visualization',
    name: 'Data Visualization & Reporting',
    icon: '📈',
    services: [
      {
        id: 'dashboard_development',
        label: 'Interactive Dashboard Development',
        description: 'Create interactive dashboards for real-time data monitoring',
        price: 40000,
        category: 'visualization',
        estimatedTime: '10-15 business days',
        popular: true,
        features: [
          'Custom dashboard design',
          'Real-time data updates',
          'Interactive charts and graphs',
          'User-friendly interface',
          'Multi-device compatibility',
          'Export functionality',
        ],
      },
      {
        id: 'report_automation',
        label: 'Report Automation Service',
        description: 'Automate regular reporting with scheduled PDF/Excel generation',
        price: 30000,
        category: 'visualization',
        estimatedTime: '7-12 business days',
      },
      {
        id: 'bi_tool_setup',
        label: 'Business Intelligence Tool Setup',
        description: 'Set up and configure BI tools (Power BI, Tableau, Looker)',
        price: 35000,
        category: 'visualization',
        estimatedTime: '8-14 business days',
      },
      {
        id: 'custom_chart_development',
        label: 'Custom Chart & Graph Development',
        description: 'Develop custom visualizations for complex data representation',
        price: 25000,
        category: 'visualization',
        estimatedTime: '5-10 business days',
      },
      {
        id: 'data_storytelling',
        label: 'Data Storytelling & Presentation',
        description: 'Create compelling narratives and presentations from data insights',
        price: 20000,
        category: 'visualization',
        estimatedTime: '4-7 business days',
      },
    ],
  },
  {
    id: 'data_warehousing',
    name: 'Data Warehousing & Storage',
    icon: '🏗️',
    services: [
      {
        id: 'data_warehouse_design',
        label: 'Data Warehouse Design',
        description: 'Design and implement scalable data warehouse solutions',
        price: 80000,
        category: 'data_warehousing',
        estimatedTime: '20-30 business days',
        hasVariablePrice: true,
        minPrice: 80000,
      },
      {
        id: 'cloud_data_lake',
        label: 'Cloud Data Lake Setup',
        description: 'Set up cloud-based data lakes for big data storage',
        price: 60000,
        category: 'data_warehousing',
        estimatedTime: '15-25 business days',
      },
      {
        id: 'etl_pipeline',
        label: 'ETL Pipeline Development',
        description: 'Develop Extract, Transform, Load pipelines for data processing',
        price: 50000,
        category: 'data_warehousing',
        estimatedTime: '12-20 business days',
        popular: true,
      },
      {
        id: 'data_governance',
        label: 'Data Governance Framework',
        description: 'Implement data governance policies and procedures',
        price: 35000,
        category: 'data_warehousing',
        estimatedTime: '10-15 business days',
      },
      {
        id: 'data_quality_monitoring',
        label: 'Data Quality Monitoring System',
        description: 'Set up monitoring systems for ongoing data quality assessment',
        price: 40000,
        category: 'data_warehousing',
        estimatedTime: '12-18 business days',
      },
    ],
  },
  {
    id: 'advanced_analytics',
    name: 'Advanced Analytics & AI',
    icon: '🤖',
    services: [
      {
        id: 'machine_learning',
        label: 'Machine Learning Solutions',
        description: 'Develop custom machine learning models for business applications',
        price: 100000,
        category: 'advanced_analytics',
        estimatedTime: '25-40 business days',
        hasVariablePrice: true,
        minPrice: 100000,
      },
      {
        id: 'natural_language_processing',
        label: 'Natural Language Processing',
        description: 'Implement NLP solutions for text analysis and processing',
        price: 75000,
        category: 'advanced_analytics',
        estimatedTime: '20-30 business days',
      },
      {
        id: 'computer_vision',
        label: 'Computer Vision Solutions',
        description: 'Develop computer vision models for image and video analysis',
        price: 90000,
        category: 'advanced_analytics',
        estimatedTime: '22-35 business days',
      },
      {
        id: 'recommendation_systems',
        label: 'Recommendation Systems',
        description: 'Build personalized recommendation engines',
        price: 80000,
        category: 'advanced_analytics',
        estimatedTime: '20-30 business days',
        popular: true,
      },
      {
        id: 'anomaly_detection',
        label: 'Anomaly Detection Systems',
        description: 'Develop systems for detecting anomalies in data streams',
        price: 65000,
        category: 'advanced_analytics',
        estimatedTime: '18-28 business days',
      },
    ],
  },
  {
    id: 'consulting_training',
    name: 'Consulting & Training',
    icon: '🎓',
    services: [
      {
        id: 'data_strategy_consulting',
        label: 'Data Strategy Consulting',
        description: 'Develop comprehensive data strategies for your organization',
        price: 30000,
        category: 'consulting_training',
        estimatedTime: '5-10 business days',
        hasVariablePrice: true,
        minPrice: 30000,
      },
      {
        id: 'data_literacy_training',
        label: 'Data Literacy Training',
        description: 'Train your team in data analysis and interpretation',
        price: 25000,
        category: 'consulting_training',
        estimatedTime: '3-5 business days',
      },
      {
        id: 'tool_specific_training',
        label: 'Data Tool Training (Python/R/SQL)',
        description: 'Training on specific data analysis tools and programming languages',
        price: 20000,
        category: 'consulting_training',
        estimatedTime: '3-5 business days',
        popular: true,
      },
      {
        id: 'data_governance_consulting',
        label: 'Data Governance Consulting',
        description: 'Consult on data governance, compliance, and security',
        price: 35000,
        category: 'consulting_training',
        estimatedTime: '7-12 business days',
      },
      {
        id: 'analytics_workshop',
        label: 'Analytics Workshop Facilitation',
        description: 'Facilitate workshops for analytics problem-solving',
        price: 40000,
        category: 'consulting_training',
        estimatedTime: '2-3 days',
      },
    ],
  },
];

interface SelectedService {
  id: string;
  label: string;
  price: number;
  quantity: number;
  customPrice?: number;
  hasVariablePrice?: boolean;
  minPrice?: number;
  estimatedTime?: string;
  category: string;
  features?: string[];
}

export default function DataServicesPage() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [activeCategory, setActiveCategory] = useState('data_collection');

  // Load selected services from localStorage on mount
  useEffect(() => {
    const savedServices = localStorage.getItem('selectedDataServices');
    if (savedServices) {
      setSelectedServices(JSON.parse(savedServices));
    }
  }, []);

  // Save selected services to localStorage
  useEffect(() => {
    localStorage.setItem('selectedDataServices', JSON.stringify(selectedServices));
  }, [selectedServices]);

  // Calculate total amount
  const totalAmount = selectedServices.reduce((total, service) => {
    const price = service.customPrice || service.price;
    return total + price * service.quantity;
  }, 0);

  const toggleServiceSelection = (service: any) => {
    setSelectedServices(prev => {
      const existingIndex = prev.findIndex(s => s.id === service.id);

      if (existingIndex >= 0) {
        // Remove service if already selected
        return prev.filter(s => s.id !== service.id);
      } else {
        // Add new service
        return [
          ...prev,
          {
            id: service.id,
            label: service.label,
            price: service.price,
            quantity: 1,
            hasVariablePrice: service.hasVariablePrice,
            minPrice: service.minPrice,
            estimatedTime: service.estimatedTime,
            category: service.category,
            features: service.features,
            ...(service.hasVariablePrice && { customPrice: service.minPrice || service.price }),
          },
        ];
      }
    });
  };

  const updateServiceQuantity = (serviceId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setSelectedServices(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, quantity: newQuantity } : service
      )
    );
  };

  const updateServicePrice = (serviceId: string, newPrice: number) => {
    setSelectedServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, customPrice: Math.max(newPrice, service.minPrice || 0) }
          : service
      )
    );
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const clearAllServices = () => {
    setSelectedServices([]);
    localStorage.removeItem('selectedDataServices');
  };

  const handleAddToServiceRequest = () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    // Format services for the service request
    const formattedServices = selectedServices.map(service => ({
      type: 'data',
      serviceId: service.id,
      name: service.label,
      quantity: service.quantity,
      unitPrice: service.customPrice || service.price,
      totalPrice: (service.customPrice || service.price) * service.quantity,
      details: {
        hasVariablePrice: service.hasVariablePrice,
        minPrice: service.minPrice,
        estimatedTime: service.estimatedTime,
        category: service.category,
        features: service.features,
      },
    }));

    // Save services to localStorage for the service request form
    localStorage.setItem(
      'pendingServiceRequest',
      JSON.stringify({
        serviceType: 'data',
        services: formattedServices,
        totalAmount: totalAmount,
        timestamp: new Date().toISOString(),
      })
    );

    // Redirect to service request form
    router.push('/services/request');
  };

  const handleServiceClick = (service: any) => {
    toggleServiceSelection(service);
  };

  const handleBackToServices = () => {
    router.push('/services');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data_collection':
        return 'from-blue-600 to-blue-800';
      case 'data_cleaning':
        return 'from-green-600 to-emerald-800';
      case 'data_analysis':
        return 'from-purple-600 to-indigo-800';
      case 'visualization':
        return 'from-orange-600 to-amber-800';
      case 'data_warehousing':
        return 'from-gray-600 to-gray-800';
      case 'advanced_analytics':
        return 'from-pink-600 to-rose-800';
      case 'consulting_training':
        return 'from-teal-600 to-cyan-800';
      default:
        return 'from-blue-600 to-blue-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data_collection':
        return <FiDownload className="text-blue-600" />;
      case 'data_cleaning':
        return <FiFilter className="text-green-600" />;
      case 'data_analysis':
        return <FiBarChart2 className="text-purple-600" />;
      case 'visualization':
        return <FiPieChart className="text-orange-600" />;
      case 'data_warehousing':
        return <FiDatabase className="text-gray-600" />;
      case 'advanced_analytics':
        return <FiActivity className="text-pink-600" />;
      case 'consulting_training':
        return <FiCode className="text-teal-600" />;
      default:
        return <FiDatabase className="text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <button
              onClick={handleBackToServices}
              className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Services Page
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Data Services & Analytics</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              End-to-end data solutions including collection, cleaning, analysis, visualization, and
              advanced analytics. Transform your data into actionable insights.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Service Categories</h3>
              <div className="space-y-2">
                {serviceCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm'
                        : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-xl mr-3">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">
                        {category.services.length} services
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content - Services */}
          <div className="lg:col-span-2">
            {/* Important Notice */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-5 rounded-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiDatabase className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-semibold text-blue-900">
                    Professional Data Solutions
                  </h3>
                  <p className="text-sm text-blue-800 mt-1">
                    All services include data quality assurance, documentation, and post-service
                    support. Complex projects may require additional consultation.
                  </p>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {serviceCategories
                .find(cat => cat.id === activeCategory)
                ?.services.map(service => {
                  const isSelected = selectedServices.some(s => s.id === service.id);
                  const selectedService = selectedServices.find(s => s.id === service.id);

                  return (
                    <div
                      key={service.id}
                      className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-transparent hover:border-blue-200'
                      }`}
                    >
                      <div className="p-6">
                        {/* Service Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{service.label}</h3>
                            {service.popular && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full font-medium">
                                Most Popular
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleServiceClick(service)}
                            className={`p-2.5 rounded-full transition-all duration-200 ${
                              isSelected
                                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {isSelected ? <FiCheckCircle size={20} /> : <FiPlus size={20} />}
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Features (if any) */}
                        {service.features && (
                          <div className="mb-5 bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                              <FiCheckCircle className="mr-2 text-blue-600" size={14} />
                              Key Features:
                            </h4>
                            <ul className="text-xs text-blue-800 space-y-1.5">
                              {service.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                              {service.features.length > 3 && (
                                <li className="text-blue-600 font-medium pt-1">
                                  +{service.features.length - 3} more features
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Service Details */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <FiClock className="mr-2" size={16} />
                              <span>{service.estimatedTime}</span>
                            </div>
                            {service.hasVariablePrice && (
                              <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                <FiTrendingUp className="mr-1" size={14} />
                                Variable Pricing
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              KES {service.price.toLocaleString()}
                            </div>
                            {service.hasVariablePrice && (
                              <div className="text-xs text-gray-500">Starting from</div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          {isSelected && selectedService ? (
                            <div className="flex items-center space-x-4 w-full">
                              <div className="flex items-center bg-gray-100 rounded-lg">
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    updateServiceQuantity(service.id, selectedService.quantity - 1);
                                  }}
                                  className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                                >
                                  <FiMinus size={18} />
                                </button>
                                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                                  {selectedService.quantity}
                                </span>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    updateServiceQuantity(service.id, selectedService.quantity + 1);
                                  }}
                                  className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                                >
                                  <FiPlus size={18} />
                                </button>
                              </div>

                              {service.hasVariablePrice && selectedService && (
                                <div className="flex-1">
                                  <div className="text-xs text-gray-600 mb-1">
                                    Custom Price (KES)
                                  </div>
                                  <input
                                    type="number"
                                    min={service.minPrice}
                                    value={selectedService.customPrice || service.price}
                                    onChange={e =>
                                      updateServicePrice(service.id, Number(e.target.value))
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onClick={e => e.stopPropagation()}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleServiceClick(service)}
                              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium flex items-center justify-center"
                            >
                              <FiPlus className="mr-2" />
                              Add to Selection
                            </button>
                          )}
                        </div>

                        {/* Custom Price Input (if selected and has variable price) */}
                        {isSelected && service.hasVariablePrice && selectedService && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Custom Price (KES)
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                min={service.minPrice}
                                value={selectedService.customPrice || service.price}
                                onChange={e =>
                                  updateServicePrice(service.id, Number(e.target.value))
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onClick={e => e.stopPropagation()}
                              />
                              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                                each
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Minimum: KES {service.minPrice?.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Right sidebar - Selected Services */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiDatabase className="mr-2 text-blue-600" />
                  Selected Services
                </h3>
                {selectedServices.length > 0 && (
                  <button
                    onClick={clearAllServices}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {selectedServices.length === 0 ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <FiDatabase className="text-blue-600" size={28} />
                  </div>
                  <p className="text-gray-500 font-medium">No data services selected</p>
                  <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                    Select data services to transform your data into valuable insights
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {selectedServices.map(service => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              {getCategoryIcon(service.category)}
                              <span className="text-xs font-medium text-gray-500 uppercase ml-2">
                                {service.category.replace('_', ' ')}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                              {service.label}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeService(service.id)}
                            className="text-gray-400 hover:text-red-500 ml-2 transition-colors"
                          >
                            ×
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Quantity:</span>
                            <div className="flex items-center">
                              <button
                                onClick={() =>
                                  updateServiceQuantity(service.id, service.quantity - 1)
                                }
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                disabled={service.quantity <= 1}
                              >
                                <FiMinus size={14} />
                              </button>
                              <span className="mx-3 min-w-[2rem] text-center font-medium">
                                {service.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateServiceQuantity(service.id, service.quantity + 1)
                                }
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                          </div>

                          {service.hasVariablePrice && (
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Unit Price (KES)
                              </label>
                              <input
                                type="number"
                                min={service.minPrice || 0}
                                value={service.customPrice || service.price}
                                onChange={e =>
                                  updateServicePrice(service.id, Number(e.target.value))
                                }
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <div>
                              <span className="text-sm font-medium text-gray-900">Item Total:</span>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <FiClock className="mr-1" size={10} />
                                {service.estimatedTime}
                              </div>
                            </div>
                            <span className="font-semibold text-blue-600">
                              KES{' '}
                              {(
                                (service.customPrice || service.price) * service.quantity
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-gray-700 font-medium">Subtotal:</span>
                        <p className="text-xs text-gray-500">
                          {selectedServices.length} service(s)
                        </p>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        KES {totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={handleAddToServiceRequest}
                      className="w-full mt-4 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold flex items-center justify-center shadow-md hover:shadow-lg"
                    >
                      <span>Proceed to Request</span>
                      <FiArrowRight className="ml-2" size={18} />
                    </button>

                    <div className="mt-4 text-center">
                      <button
                        onClick={handleBackToServices}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        ← Back to All Services
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Stats */}
            {selectedServices.length > 0 && (
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                  <FiTrendingUp className="mr-2" />
                  Selection Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">Total Services:</span>
                    <span className="font-medium text-blue-900">{selectedServices.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">Categories:</span>
                    <span className="font-medium text-blue-900">
                      {[...new Set(selectedServices.map(s => s.category))].length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-800">Advanced Analytics:</span>
                    <span className="font-medium text-blue-900">
                      {selectedServices.filter(s => s.category.includes('advanced')).length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Cart Button (Mobile) */}
        {selectedServices.length > 0 && (
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <button
              onClick={handleAddToServiceRequest}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center"
            >
              <FiShoppingCart className="mr-2" size={20} />
              <span>Add {selectedServices.length} Services</span>
              <span className="ml-3 bg-white text-blue-600 px-2 py-1 rounded-full text-sm font-bold">
                KES {totalAmount.toLocaleString()}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Data Pipeline Process */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Data Analytics Pipeline
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiDownload className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Data Collection</h3>
              <p className="text-gray-600 text-sm">Gather data from various sources and APIs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiFilter className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Data Cleaning</h3>
              <p className="text-gray-600 text-sm">
                Clean, transform, and prepare data for analysis
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiBarChart2 className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Data Analysis</h3>
              <p className="text-gray-600 text-sm">Analyze data to extract insights and patterns</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiPieChart className="text-orange-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Visualization</h3>
              <p className="text-gray-600 text-sm">Create dashboards and visual representations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <FiTrendingUp className="text-pink-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Insights & Action</h3>
              <p className="text-gray-600 text-sm">
                Deliver actionable insights and recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Data Technologies We Use
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Python', color: 'bg-blue-100 text-blue-800' },
              { name: 'R', color: 'bg-blue-200 text-blue-900' },
              { name: 'SQL', color: 'bg-green-100 text-green-800' },
              { name: 'Pandas', color: 'bg-red-100 text-red-800' },
              { name: 'NumPy', color: 'bg-emerald-100 text-emerald-800' },
              { name: 'SciKit-Learn', color: 'bg-orange-100 text-orange-800' },
              { name: 'TensorFlow', color: 'bg-orange-200 text-orange-900' },
              { name: 'PyTorch', color: 'bg-red-200 text-red-900' },
              { name: 'Apache Spark', color: 'bg-yellow-100 text-yellow-800' },
              { name: 'Hadoop', color: 'bg-gray-100 text-gray-800' },
              { name: 'Power BI', color: 'bg-yellow-200 text-yellow-900' },
              { name: 'Tableau', color: 'bg-blue-100 text-blue-800' },
              { name: 'AWS Redshift', color: 'bg-orange-100 text-orange-800' },
              { name: 'Google BigQuery', color: 'bg-blue-200 text-blue-900' },
              { name: 'Apache Kafka', color: 'bg-gray-200 text-gray-900' },
              { name: 'Apache Airflow', color: 'bg-cyan-100 text-cyan-800' },
              { name: 'Docker', color: 'bg-blue-100 text-blue-800' },
              { name: 'Kubernetes', color: 'bg-blue-200 text-blue-900' },
              { name: 'Jupyter', color: 'bg-orange-100 text-orange-800' },
              { name: 'Git', color: 'bg-orange-200 text-orange-900' },
              { name: 'PostgreSQL', color: 'bg-blue-100 text-blue-800' },
              { name: 'MongoDB', color: 'bg-green-100 text-green-800' },
              { name: 'Elasticsearch', color: 'bg-green-200 text-green-900' },
              { name: 'Snowflake', color: 'bg-blue-100 text-blue-800' },
            ].map((tech, index) => (
              <div
                key={index}
                className={`${tech.color} rounded-xl p-4 text-center font-medium shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Data Analytics Use Cases
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <FiTrendingUp className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Business Intelligence</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Sales trend analysis
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Customer segmentation
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Market basket analysis
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Revenue forecasting
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <FiActivity className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Predictive Analytics</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Churn prediction
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Demand forecasting
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Risk assessment
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Price optimization
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <FiEye className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Operational Analytics</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Process optimization
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Quality control analysis
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Supply chain analytics
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Performance monitoring
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
