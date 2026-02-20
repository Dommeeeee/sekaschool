'use client';

import { Issue, IssueStatus } from '@/lib/types';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { X, MapPin, User, Phone, Calendar, Tag, MessageSquare, CheckCircle, Clock, Wrench, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { updateIssueInFirebase, deleteIssueFromFirebase } from '@/lib/firebase-storage';

interface Props {
  issue: Issue;
  onClose: () => void;
  onUpdate: (updated: Issue) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function IssueDetailModal({ issue, onClose, onUpdate, onDelete, isAdmin }: Props) {
  const [adminNote, setAdminNote] = useState(issue.adminNote || '');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleStatusChange = async (status: IssueStatus) => {
    setSaving(true);
    try {
      const updated = await updateIssueInFirebase(issue.id, { status, adminNote });
      if (updated) onUpdate(updated);
    } catch (error) {
      console.error('Error updating issue status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      const updated = await updateIssueInFirebase(issue.id, { adminNote });
      if (updated) onUpdate(updated);
    } catch (error) {
      console.error('Error saving admin note:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกหมายเหตุ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIssueFromFirebase(issue.id);
      onDelete(issue.id);
      onClose();
    } catch (error) {
      console.error('Error deleting issue:', error);
      alert('เกิดข้อผิดพลาดในการลบปัญหา');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="gradient-bg p-5 rounded-t-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-blue-200 text-xs font-mono mb-1">{issue.id}</p>
              <h2 className="text-white font-bold text-lg leading-snug">{issue.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-all flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">รายละเอียด</h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">{issue.description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Tag, label: 'หมวดหมู่', value: issue.category },
              { icon: MapPin, label: 'สถานที่', value: issue.location || 'ไม่ระบุ' },
              { icon: User, label: 'ผู้แจ้ง', value: issue.reporterName || 'ไม่ระบุ' },
              { icon: Phone, label: 'ติดต่อ', value: issue.reporterContact || 'ไม่ระบุ' },
              { icon: Calendar, label: 'วันที่แจ้ง', value: formatDate(issue.createdAt) },
              { icon: Calendar, label: 'อัปเดตล่าสุด', value: formatDate(issue.updatedAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={13} className="text-blue-400" />
                  <span className="text-xs text-gray-400 font-medium">{label}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{value}</p>
              </div>
            ))}
          </div>

          {issue.resolvedAt && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <div>
                <p className="text-xs text-green-600 font-medium">แก้ไขเสร็จสิ้น</p>
                <p className="text-sm text-green-700">{formatDate(issue.resolvedAt)}</p>
              </div>
            </div>
          )}

          {/* Admin Note Display (non-admin) */}
          {!isAdmin && issue.adminNote && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={14} className="text-blue-500" />
                <span className="text-sm font-semibold text-blue-700">หมายเหตุจากผู้ดูแล</span>
              </div>
              <p className="text-sm text-blue-600">{issue.adminNote}</p>
            </div>
          )}

          {/* Admin Controls */}
          {isAdmin && (
            <div className="border-t pt-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">จัดการปัญหา</h3>

              {/* Status Buttons */}
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">เปลี่ยนสถานะ</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange('pending')}
                    disabled={issue.status === 'pending' || saving}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      issue.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 border-2 border-transparent'
                    }`}
                  >
                    <Clock size={14} /> รอดำเนินการ
                  </button>
                  <button
                    onClick={() => handleStatusChange('inprogress')}
                    disabled={issue.status === 'inprogress' || saving}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      issue.status === 'inprogress'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700 border-2 border-transparent'
                    }`}
                  >
                    <Wrench size={14} /> กำลังดำเนินการ
                  </button>
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    disabled={issue.status === 'resolved' || saving}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      issue.status === 'resolved'
                        ? 'bg-green-100 text-green-700 border-2 border-green-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700 border-2 border-transparent'
                    }`}
                  >
                    <CheckCircle size={14} /> แก้ไขแล้ว
                  </button>
                </div>
              </div>

              {/* Admin Note */}
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">หมายเหตุผู้ดูแล</p>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="เพิ่มหมายเหตุหรือการดำเนินการ..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none transition-all"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
                >
                  บันทึกหมายเหตุ
                </button>
              </div>

              {/* Delete */}
              <div className="pt-2 border-t">
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-all"
                  >
                    <Trash2 size={14} /> ลบรายการนี้
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-red-600 font-medium">ยืนยันการลบ?</p>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
                    >
                      ยืนยัน
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                    >
                      ยกเลิก
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
