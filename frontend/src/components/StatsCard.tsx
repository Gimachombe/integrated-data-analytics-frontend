'use client';

import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: number;
  icon: IconType;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  yellow: 'bg-yellow-50 text-yellow-600',
};

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
