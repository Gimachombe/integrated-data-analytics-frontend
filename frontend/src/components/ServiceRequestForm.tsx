'use client';

import { UseFormReturn } from 'react-hook-form';
import { FiUpload } from 'react-icons/fi';

interface ServiceRequestFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  serviceTypes: Array<{ id: string; label: string }>;
  dataSources?: Array<{ id: string; label: string }>;
}

export default function ServiceRequestForm({
  form,
  onSubmit,
  serviceTypes,
  dataSources,
}: ServiceRequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Service Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
        <div className="grid grid-cols-2 gap-4">
          {serviceTypes.map(type => (
            <label
              key={type.id}
              className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                watch('serviceType') === type.id
                  ? 'border-primary-600 ring-2 ring-primary-600'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                {...register('serviceType')}
                value={type.id}
                className="sr-only"
              />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{type.label}</p>
                  </div>
                </div>
                {watch('serviceType') === type.id && (
                  <div className="shrink-0 text-primary-600">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
                      <path
                        d="M7 13l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
        {errors.serviceType && (
          <p className="mt-1 text-sm text-red-600">{errors.serviceType.message as string}</p>
        )}
      </div>

      {/* Data Source (Conditional) */}
      {dataSources && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data Source</label>
          <select
            {...register('dataSource')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          >
            <option value="">Select data source</option>
            {dataSources.map(source => (
              <option key={source.id} value={source.id}>
                {source.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Requirements *</label>
        <textarea
          {...register('requirements')}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          placeholder="Describe your requirements in detail..."
        />
        {errors.requirements && (
          <p className="mt-1 text-sm text-red-600">{errors.requirements.message as string}</p>
        )}
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (Optional)</label>
        <input
          type="date"
          {...register('deadline')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      {/* Special Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Instructions (Optional)
        </label>
        <textarea
          {...register('specialInstructions')}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          placeholder="Any special instructions or notes..."
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Files (Optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500">
                <span>Upload files</span>
                <input
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, DOC, XLS up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
}
