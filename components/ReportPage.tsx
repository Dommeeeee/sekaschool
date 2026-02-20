'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { addIssueToFirebase, getIssuesFromFirebase, seedDemoDataToFirebase } from '@/lib/firebase-storage';
import { Issue, IssueCategory } from '@/lib/types';
import IssueCard from './IssueCard';
import IssueDetailModal from './IssueDetailModal';
import {
  AlertCircle, CheckCircle, Send, Search, Filter,
  ChevronDown, FileText, Megaphone
} from 'lucide-react';

const CATEGORIES: IssueCategory[] = [
  'อาคารและสถานที่',
  'อุปกรณ์และครุภัณฑ์',
  'ความปลอดภัย',
  'สุขอนามัย',
  'ระบบไฟฟ้าและประปา',
  'อินเทอร์เน็ตและคอมพิวเตอร์',
  'อื่นๆ',
];

export default function ReportPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [submitting, setSubmitting] = useState(false);

  const [logoError, setLogoError] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    priority: 'medium' as 'low' | 'medium' | 'high',
    reporterName: '',
    reporterContact: '',
    location: '',
  });

  useEffect(() => {
    const initializeData = async () => {
      await seedDemoDataToFirebase();
    };
    initializeData();

    // Set up real-time listener
    const unsubscribe = getIssuesFromFirebase((issuesData) => {
      setIssues(issuesData);
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newIssue = await addIssueToFirebase(form);
      setSubmittedId(newIssue.id);
      setSubmitted(true);
      
      // รีเซ็ตฟอร์ม - ข้อมูลจะอัปเดตอัตโนมัติจาก real-time listener
      setForm({
        title: '',
        description: '',
        category: CATEGORIES[0],
        priority: 'medium',
        reporterName: '',
        reporterContact: '',
        location: '',
      });
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('เกิดข้อผิดพลาดในการส่งปัญหา กรุณาลองใหม่');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchSearch =
      searchQuery === '' ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || issue.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleIssueUpdate = (updated: Issue) => {
    setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedIssue(updated);
  };

  const handleIssueDelete = (id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
    setSelectedIssue(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="flex justify-center mb-5">
          <div className="w-24 h-24 rounded-full bg-white shadow-xl p-1.5 border-4 border-blue-100 flex items-center justify-center overflow-hidden">
            {!logoError ? (
              <Image
                src="/logo.png"
                alt="โรงเรียนเซกา"
                width={96}
                height={96}
                className="w-full h-full object-contain rounded-full"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-blue-700 font-bold text-4xl">ซ</span>
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">ระบบแจ้งปัญหาโรงเรียนเซกา</h1>
        <p className="text-gray-500 text-base">แจ้งปัญหาและติดตามสถานะการแก้ไขได้ที่นี่</p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => { setShowForm(true); setSubmitted(false); }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
          >
            <Megaphone size={18} />
            แจ้งปัญหาใหม่
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 border-2 border-blue-200 rounded-2xl font-semibold hover:bg-blue-50 transition-all"
          >
            <FileText size={18} />
            ดูรายการปัญหา
          </button>
        </div>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="mb-10 animate-fade-in">
          {submitted ? (
            <div className="glass-card rounded-2xl p-8 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">แจ้งปัญหาสำเร็จ!</h2>
              <p className="text-gray-500 mb-4">ระบบได้รับการแจ้งปัญหาของคุณแล้ว</p>
              <div className="bg-blue-50 rounded-xl px-4 py-3 mb-6">
                <p className="text-xs text-blue-500 mb-1">รหัสการแจ้งปัญหา</p>
                <p className="text-blue-700 font-bold font-mono text-lg">{submittedId}</p>
                <p className="text-xs text-gray-400 mt-1">กรุณาจดรหัสนี้ไว้เพื่อติดตามสถานะ</p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
                >
                  แจ้งปัญหาเพิ่มเติม
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  ดูรายการปัญหา
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <AlertCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">แจ้งปัญหาใหม่</h2>
                  <p className="text-sm text-gray-400">กรอกข้อมูลให้ครบถ้วนเพื่อให้ผู้ดูแลดำเนินการได้รวดเร็ว</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                    หัวข้อปัญหา <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="เช่น ไฟฟ้าดับในห้องเรียน ม.3/2"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                      หมวดหมู่ <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value as IssueCategory })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white appearance-none transition-all pr-8"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">ความเร่งด่วน</label>
                    <div className="relative">
                      <select
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value as 'low' | 'medium' | 'high' })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white appearance-none transition-all pr-8"
                      >
                        <option value="low">ต่ำ</option>
                        <option value="medium">ปานกลาง</option>
                        <option value="high">สูง / เร่งด่วน</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                    รายละเอียดปัญหา <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    placeholder="อธิบายปัญหาที่พบให้ละเอียด เช่น เกิดขึ้นเมื่อไหร่ มีผลกระทบอย่างไร..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white resize-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                    สถานที่เกิดปัญหา <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="เช่น อาคาร 2 ชั้น 3 ห้อง 302"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">ชื่อผู้แจ้ง</label>
                    <input
                      type="text"
                      value={form.reporterName}
                      onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
                      placeholder="ชื่อ-นามสกุล (ไม่บังคับ)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">เบอร์โทร / ติดต่อ</label>
                    <input
                      type="text"
                      value={form.reporterContact}
                      onChange={(e) => setForm({ ...form, reporterContact: e.target.value })}
                      placeholder="เบอร์โทรหรืออีเมล (ไม่บังคับ)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-60"
                  >
                    {submitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    {submitting ? 'กำลังส่ง...' : 'ส่งการแจ้งปัญหา'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Issues List */}
      {!showForm && (
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาปัญหา หรือรหัส ISS-..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white transition-all"
              />
            </div>
            <div className="relative">
              <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm bg-white appearance-none transition-all"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="inprogress">กำลังดำเนินการ</option>
                <option value="resolved">แก้ไขแล้ว</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileText size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">ไม่พบรายการปัญหา</p>
              <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => setSelectedIssue(issue)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdate={handleIssueUpdate}
          onDelete={handleIssueDelete}
          isAdmin={false}
        />
      )}
    </div>
  );
}
