import { FiFileText, FiGlobe, FiDatabase, FiPackage } from 'react-icons/fi';

interface ServiceTypeIconProps {
  type: string;
  size?: number;
}

export default function ServiceTypeIcon({ type, size = 20 }: ServiceTypeIconProps) {
  switch (type) {
    case 'kra':
      return <FiFileText className="text-blue-600" size={size} />;
    case 'business':
      return <FiGlobe className="text-purple-600" size={size} />;
    case 'website':
      return <FiGlobe className="text-indigo-600" size={size} />;
    case 'data':
      return <FiDatabase className="text-cyan-600" size={size} />;
    default:
      return <FiPackage className="text-gray-600" size={size} />;
  }
}
