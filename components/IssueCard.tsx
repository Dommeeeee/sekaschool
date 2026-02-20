'use client';

import { Issue } from '@/lib/types';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { MapPin, User, Calendar, Tag } from 'lucide-react';

interface Props {
  issue: Issue;
  onClick?: () => void;
  showActions?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function IssueCard({ issue, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="glass-card rounded-2xl p-5 hover-lift cursor-pointer animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-500 font-mono mb-1">{issue.id}</p>
          <h3 className="font-semibold text-gray-800 text-base leading-snug line-clamp-2">
            {issue.title}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <StatusBadge status={issue.status} size="sm" />
          <PriorityBadge priority={issue.priority} size="sm" />
        </div>
      </div>

      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{issue.description}</p>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Tag size={11} className="text-blue-400 flex-shrink-0" />
          <span className="truncate">{issue.category}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User size={11} className="text-blue-400 flex-shrink-0" />
          <span className="truncate">{issue.reporterName || 'ไม่ระบุ'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-blue-400 flex-shrink-0" />
          <span className="truncate">{issue.location || 'ไม่ระบุ'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={11} className="text-blue-400 flex-shrink-0" />
          <span className="truncate">{formatDate(issue.createdAt)}</span>
        </div>
      </div>

      {issue.adminNote && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
            <span className="font-semibold">หมายเหตุผู้ดูแล:</span> {issue.adminNote}
          </p>
        </div>
      )}
    </div>
  );
}
