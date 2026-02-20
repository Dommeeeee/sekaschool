'use client';

import { Issue, IssueStats } from './types';

const API_BASE = '/api';

// ดึงข้อมูลปัญหาทั้งหมดจากเซิร์ฟเวอร์
export async function getIssues(): Promise<Issue[]> {
  try {
    const response = await fetch(`${API_BASE}/issues`);
    if (!response.ok) throw new Error('Failed to fetch issues');
    return await response.json();
  } catch (error) {
    console.error('Error fetching issues:', error);
    return [];
  }
}

// เพิ่มปัญหาใหม่ไปยังเซิร์ฟเวอร์
export async function addIssue(issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Issue> {
  try {
    const response = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issue),
    });
    
    if (!response.ok) throw new Error('Failed to create issue');
    return await response.json();
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
}

// อัปเดตปัญหาบนเซิร์ฟเวอร์
export async function updateIssue(id: string, updates: Partial<Issue>): Promise<Issue | null> {
  try {
    const response = await fetch(`${API_BASE}/issues`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updates }),
    });
    
    if (!response.ok) throw new Error('Failed to update issue');
    return await response.json();
  } catch (error) {
    console.error('Error updating issue:', error);
    return null;
  }
}

// ลบปัญหาจากเซิร์ฟเวอร์
export async function deleteIssue(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/issues?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete issue');
  } catch (error) {
    console.error('Error deleting issue:', error);
    throw error;
  }
}

// ดึงสถิติจากเซิร์ฟเวอร์
export async function getStats(): Promise<IssueStats> {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    return {
      total: data.total,
      pending: data.pending,
      inprogress: data.inprogress,
      resolved: data.resolved,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      total: 0,
      pending: 0,
      inprogress: 0,
      resolved: 0,
    };
  }
}

// ฟังก์ชันสำหรับ seed ข้อมูลตัวอย่างบนเซิร์ฟเวอร์
export async function seedDemoData(): Promise<void> {
  // ไม่มีข้อมูลตัวอย่าง - เริ่มต้นด้วยรายการว่างเปล่า
  console.log('Demo data seeding skipped - starting with empty issues list');
}
