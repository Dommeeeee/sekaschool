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
  try {
    const existingIssues = await getIssues();
    if (existingIssues.length > 0) return;

    const demoIssues = [
      {
        title: 'ไฟฟ้าดับในห้องเรียน ม.3/2',
        description: 'ไฟฟ้าในห้องเรียนดับตั้งแต่เช้า ไม่สามารถใช้งานได้ ส่งผลต่อการเรียนการสอน',
        category: 'ระบบไฟฟ้าและประปา' as const,
        priority: 'high' as const,
        reporterName: 'ครูสมชาย',
        reporterContact: '081-234-5678',
        location: 'อาคาร 2 ชั้น 3 ห้อง 302',
      },
      {
        title: 'ห้องน้ำนักเรียนชายชำรุด',
        description: 'ก๊อกน้ำในห้องน้ำนักเรียนชายชำรุด 3 จุด น้ำไหลตลอดเวลา',
        category: 'สุขอนามัย' as const,
        priority: 'medium' as const,
        reporterName: 'นักเรียน ม.5',
        reporterContact: '',
        location: 'อาคาร 1 ชั้น 1',
      },
      {
        title: 'คอมพิวเตอร์ห้อง Lab เปิดไม่ติด',
        description: 'คอมพิวเตอร์ในห้อง Lab จำนวน 5 เครื่องเปิดไม่ติด ไม่สามารถใช้สอนได้',
        category: 'อินเทอร์เน็ตและคอมพิวเตอร์' as const,
        priority: 'high' as const,
        reporterName: 'ครูวิทยา',
        reporterContact: '089-876-5432',
        location: 'ห้อง Computer Lab อาคาร 3',
      },
    ];

    // เพิ่มข้อมูลตัวอย่างทีละรายการ
    for (const issue of demoIssues) {
      await addIssue(issue);
    }
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}
