'use client';

import { Issue, IssueStats } from './types';

const STORAGE_KEY = 'school_issues';

export function getIssues(): Issue[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveIssues(issues: Issue[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

export function addIssue(issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Issue {
  const issues = getIssues();
  const newIssue: Issue = {
    ...issue,
    id: `ISS-${Date.now().toString().slice(-6)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  issues.unshift(newIssue);
  saveIssues(issues);
  return newIssue;
}

export function updateIssue(id: string, updates: Partial<Issue>): Issue | null {
  const issues = getIssues();
  const idx = issues.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const updated: Issue = {
    ...issues[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
    ...(updates.status === 'resolved' && !issues[idx].resolvedAt
      ? { resolvedAt: new Date().toISOString() }
      : {}),
  };
  issues[idx] = updated;
  saveIssues(issues);
  return updated;
}

export function deleteIssue(id: string): void {
  const issues = getIssues().filter((i) => i.id !== id);
  saveIssues(issues);
}

export function getStats(): IssueStats {
  const issues = getIssues();
  return {
    total: issues.length,
    pending: issues.filter((i) => i.status === 'pending').length,
    inprogress: issues.filter((i) => i.status === 'inprogress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
  };
}

export function seedDemoData(): void {
  const existing = getIssues();
  if (existing.length > 0) return;

  const demos: Issue[] = [
    {
      id: 'ISS-DEMO-001',
      title: 'ไฟฟ้าดับในห้องเรียน ม.3/2',
      description: 'ไฟฟ้าในห้องเรียนดับตั้งแต่เช้า ไม่สามารถใช้งานได้ ส่งผลต่อการเรียนการสอน',
      category: 'ระบบไฟฟ้าและประปา',
      priority: 'high',
      status: 'inprogress',
      reporterName: 'ครูสมชาย',
      reporterContact: '081-234-5678',
      location: 'อาคาร 2 ชั้น 3 ห้อง 302',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      adminNote: 'ช่างไฟกำลังดำเนินการแก้ไข',
    },
    {
      id: 'ISS-DEMO-002',
      title: 'ห้องน้ำนักเรียนชายชำรุด',
      description: 'ก๊อกน้ำในห้องน้ำนักเรียนชายชำรุด 3 จุด น้ำไหลตลอดเวลา',
      category: 'สุขอนามัย',
      priority: 'medium',
      status: 'resolved',
      reporterName: 'นักเรียน ม.5',
      reporterContact: '',
      location: 'อาคาร 1 ชั้น 1',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      resolvedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      adminNote: 'ซ่อมแซมเรียบร้อยแล้ว',
    },
    {
      id: 'ISS-DEMO-003',
      title: 'คอมพิวเตอร์ห้อง Lab เปิดไม่ติด',
      description: 'คอมพิวเตอร์ในห้อง Lab จำนวน 5 เครื่องเปิดไม่ติด ไม่สามารถใช้สอนได้',
      category: 'อินเทอร์เน็ตและคอมพิวเตอร์',
      priority: 'high',
      status: 'pending',
      reporterName: 'ครูวิทยา',
      reporterContact: '089-876-5432',
      location: 'ห้อง Computer Lab อาคาร 3',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ];

  saveIssues(demos);
}
