interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
}

export default function PageHeader({ title, subtitle, description }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{title}</h1>
          {subtitle && <p className="text-xl text-blue-100 mb-6">{subtitle}</p>}
          {description && <p className="text-lg text-blue-50 opacity-90">{description}</p>}
        </div>
      </div>
    </div>
  );
}
