'use client';

import { IssueStatus } from '@/lib/types';
import { Clock, Wrench, CheckCircle } from 'lucide-react';

interface Props {
  status: IssueStatus;
  size?: 'sm' | 'md';
}

const config = {
  pending: {
    label: 'รอดำเนินการ',
    className: 'status-pending',
    Icon: Clock,
  },
  inprogress: {
    label: 'กำลังดำเนินการ',
    className: 'status-inprogress',
    Icon: Wrench,
  },
  resolved: {
    label: 'แก้ไขแล้ว',
    className: 'status-resolved',
    Icon: CheckCircle,
  },
};

export default function StatusBadge({ status, size = 'md' }: Props) {
  const { label, className, Icon } = config[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${className} ${sizeClass}`}>
      <Icon size={size === 'sm' ? 10 : 13} />
      {label}
    </span>
  );
}
