'use client';

import { useState, useEffect } from 'react';
import { Issue, IssueStatus, IssueCategory } from '@/lib/types';
import { getIssues, seedDemoData, getStats } from '@/lib/storage';
import IssueCard from './IssueCard';
import IssueDetailModal from './IssueDetailModal';
import StatusBadge from './StatusBadge';
import {
  Shield, Search, Filter, ChevronDown, BarChart3,
  Clock, Wrench, CheckCircle, AlertTriangle, FileText,
  TrendingUp, Users, RefreshCw
} from 'lucide-react';

const CATEGORIES: (IssueCategory | 'all')[] = [
  'all',
  'อาคารและสถานที่',
  'อุปกรณ์และครุภัณฑ์',
  'ความปลอดภัย',
  'สุขอนามัย',
  'ระบบไฟฟ้าและประปา',
  'อินเทอร์เน็ตและคอมพิวเตอร์',
  'อื่นๆ',
];

export default function AdminPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [activeTab, setActiveTab] = useState<'all' | IssueStatus>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const ADMIN_PASSWORD = 'admin1234';

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      seedDemoData();
      setIssues(getIssues());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const refreshData = () => {
    setIssues(getIssues());
  };

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === 'pending').length,
    inprogress: issues.filter((i) => i.status === 'inprogress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    high: issues.filter((i) => i.priority === 'high').length,
  };

  const filteredIssues = issues
    .filter((issue) => {
      const matchSearch =
        searchQuery === '' ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        filterStatus === 'all' && activeTab === 'all'
          ? true
          : activeTab !== 'all'
          ? issue.status === activeTab
          : issue.status === filterStatus;
      const matchCategory = filterCategory === 'all' || issue.category === filterCategory;
      const matchPriority = filterPriority === 'all' || issue.priority === filterPriority;
      return matchSearch && matchStatus && matchCategory && matchPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      const pOrder = { high: 0, medium: 1, low: 2 };
      return pOrder[a.priority] - pOrder[b.priority];
    });

  const handleIssueUpdate = (updated: Issue) => {
    setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedIssue(updated);
  };

  const handleIssueDelete = (id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
    setSelectedIssue(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="glass-card rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield size={28} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">เข้าสู่ระบบผู้ดูแล</h1>
              <p className="text-sm text-gray-400 mt-1">โรงเรียนเซกา จังหวัดบึงกาฬ</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">รหัสผ่านผู้ดูแลระบบ</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white transition-all"
                  autoFocus
                />
                {authError && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle size={12} /> {authError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-md"
              >
                เข้าสู่ระบบ
              </button>
            </form>

            <p className="text-center text-xs text-gray-300 mt-6">
              รหัสผ่านทดสอบ: <span className="font-mono text-gray-400">admin1234</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Admin Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-blue-600" />
            <h1 className="text-2xl font-bold gradient-text">แผงควบคุมผู้ดูแลระบบ</h1>
          </div>
          <p className="text-gray-400 text-sm">จัดการและติดตามปัญหาทั้งหมดในโรงเรียน</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={14} /> รีเฟรช
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-100 transition-all"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-fade-in">
        {[
          { label: 'ทั้งหมด', value: stats.total, icon: BarChart3, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
          { label: 'รอดำเนินการ', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100' },
          { label: 'กำลังดำเนินการ', value: stats.inprogress, icon: Wrench, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
          { label: 'แก้ไขแล้ว', value: stats.resolved, icon: CheckCircle, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
          { label: 'เร่งด่วน', value: stats.high, icon: AlertTriangle, color: 'bg-red-50 text-red-600', border: 'border-red-100' },
        ].map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`glass-card rounded-2xl p-4 border ${border} hover-lift`}>
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="glass-card rounded-2xl p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" />
              <span className="text-sm font-semibold text-gray-700">อัตราการแก้ไขปัญหา</span>
            </div>
            <span className="text-sm font-bold text-green-600">
              {Math.round((stats.resolved / stats.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div className="flex h-full rounded-full overflow-hidden">
              <div
                className="bg-green-400 transition-all duration-700"
                style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
              />
              <div
                className="bg-blue-400 transition-all duration-700"
                style={{ width: `${(stats.inprogress / stats.total) * 100}%` }}
              />
              <div
                className="bg-yellow-400 transition-all duration-700"
                style={{ width: `${(stats.pending / stats.total) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            {[
              { color: 'bg-green-400', label: 'แก้ไขแล้ว' },
              { color: 'bg-blue-400', label: 'กำลังดำเนินการ' },
              { color: 'bg-yellow-400', label: 'รอดำเนินการ' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(['all', 'pending', 'inprogress', 'resolved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? 'gradient-bg text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab === 'all' ? `ทั้งหมด (${stats.total})` :
             tab === 'pending' ? `รอดำเนินการ (${stats.pending})` :
             tab === 'inprogress' ? `กำลังดำเนินการ (${stats.inprogress})` :
             `แก้ไขแล้ว (${stats.resolved})`}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาปัญหา รหัส หรือผู้แจ้ง..."
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white transition-all"
          />
        </div>

        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white appearance-none pr-7 transition-all"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === 'all' ? 'ทุกหมวดหมู่' : c}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white appearance-none pr-7 transition-all"
          >
            <option value="all">ทุกความเร่งด่วน</option>
            <option value="high">สูง</option>
            <option value="medium">ปานกลาง</option>
            <option value="low">ต่ำ</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'priority')}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white appearance-none pr-7 transition-all"
          >
            <option value="newest">ใหม่สุด</option>
            <option value="oldest">เก่าสุด</option>
            <option value="priority">ความเร่งด่วน</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 mb-4">
        <Users size={14} className="text-gray-400" />
        <p className="text-sm text-gray-400">
          แสดง <span className="font-semibold text-gray-600">{filteredIssues.length}</span> รายการ
          {filteredIssues.length !== issues.length && ` จากทั้งหมด ${issues.length} รายการ`}
        </p>
      </div>

      {/* Issues Grid */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">ไม่พบรายการปัญหา</p>
          <p className="text-sm mt-1">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => setSelectedIssue(issue)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdate={handleIssueUpdate}
          onDelete={handleIssueDelete}
          isAdmin={true}
        />
      )}
    </div>
  );
}
