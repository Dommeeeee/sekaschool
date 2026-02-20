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
  // ไม่มีข้อมูลตัวอย่าง - เริ่มต้นด้วยรายการว่างเปล่า
  console.log('LocalStorage demo data seeding skipped - starting with empty issues list');
}
