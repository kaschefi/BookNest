import React from "react";
import RoughCardBackground from "@/components/RoughCardBackground";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
  subtitleColorClass?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColorClass, 
  iconBgClass,
  subtitleColorClass = "text-gray-500" 
}: StatCardProps) {
  return (
    <div className="relative p-6 rounded-2xl flex items-center space-x-4 group/card min-h-[120px]">
      <RoughCardBackground />
      <div className="relative z-10 flex items-center space-x-4 w-full">
        <div className={`p-4 rounded-full ${iconBgClass}`}>
          <Icon className={`h-6 w-6 ${iconColorClass}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 leading-tight">{value}</h3>
          <p className={`text-sm ${subtitleColorClass} mt-1`}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
