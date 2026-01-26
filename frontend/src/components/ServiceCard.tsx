'use client';

import { IconType } from 'react-icons';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: IconType;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  yellow: 'bg-yellow-50 text-yellow-600',
};

export default function ServiceCard({
  title,
  description,
  href,
  icon: Icon,
  color,
}: ServiceCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
        <div
          className={`${colorClasses[color]} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
        >
          <Icon size={24} />
        </div>
        <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-4">
          <span className="text-primary-600 text-sm font-medium hover:text-primary-700">
            Get Started →
          </span>
        </div>
      </div>
    </Link>
  );
}
