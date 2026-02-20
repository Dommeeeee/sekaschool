'use client';

import { IssuePriority } from '@/lib/types';

interface Props {
  priority: IssuePriority;
  size?: 'sm' | 'md';
}

const config = {
  low: { label: 'ต่ำ', className: 'bg-gray-100 text-gray-600 border border-gray-200' },
  medium: { label: 'ปานกลาง', className: 'bg-orange-50 text-orange-700 border border-orange-200' },
  high: { label: 'สูง', className: 'bg-red-50 text-red-700 border border-red-200' },
};

export default function PriorityBadge({ priority, size = 'md' }: Props) {
  const { label, className } = config[priority];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${className} ${sizeClass}`}>
      {label}
    </span>
  );
}
