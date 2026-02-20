'use client';

import { Issue, IssueStats } from './types';
import { database, ref, push, set, get, update, remove, onValue } from './firebase';

const ISSUES_REF = 'issues';

// ดึงข้อมูลปัญหาทั้งหมดจาก Firebase
export function getIssuesFromFirebase(callback: (issues: Issue[]) => void) {
  const issuesRef = ref(database, ISSUES_REF);
  
  // Real-time listener
  const unsubscribe = onValue(issuesRef, (snapshot) => {
    const data = snapshot.val();
    const issues: Issue[] = data ? Object.values(data) : [];
    callback(issues);
  });
  
  return unsubscribe; // Return unsubscribe function for cleanup
}

// ดึงข้อมูลปัญหาทั้งหมดแบบครั้งเดียว
export async function getIssuesOnce(): Promise<Issue[]> {
  const issuesRef = ref(database, ISSUES_REF);
  const snapshot = await get(issuesRef);
  const data = snapshot.val();
  return data ? Object.values(data) : [];
}

// เพิ่มปัญหาใหม่ไปยัง Firebase
export async function addIssueToFirebase(issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Issue> {
  const issuesRef = ref(database, ISSUES_REF);
  const newIssueRef = push(issuesRef);
  
  const newIssue: Issue = {
    ...issue,
    id: newIssueRef.key || `ISS-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await set(newIssueRef, newIssue);
  return newIssue;
}

// อัปเดตปัญหาบน Firebase
export async function updateIssueInFirebase(id: string, updates: Partial<Issue>): Promise<Issue | null> {
  try {
    const issuesRef = ref(database, ISSUES_REF);
    const snapshot = await get(issuesRef);
    const data = snapshot.val();
    
    if (!data) return null;
    
    // Find the issue by ID
    const issueKey = Object.keys(data).find(key => data[key].id === id);
    if (!issueKey) return null;
    
    const issueRef = ref(database, `${ISSUES_REF}/${issueKey}`);
    const updatedIssue: Issue = {
      ...data[issueKey],
      ...updates,
      updatedAt: new Date().toISOString(),
      ...(updates.status === 'resolved' && !data[issueKey].resolvedAt
        ? { resolvedAt: new Date().toISOString() }
        : {}),
    };
    
    await update(issueRef, updatedIssue);
    return updatedIssue;
  } catch (error) {
    console.error('Error updating issue:', error);
    return null;
  }
}

// ลบปัญหาจาก Firebase
export async function deleteIssueFromFirebase(id: string): Promise<void> {
  try {
    const issuesRef = ref(database, ISSUES_REF);
    const snapshot = await get(issuesRef);
    const data = snapshot.val();
    
    if (!data) return;
    
    // Find the issue by ID
    const issueKey = Object.keys(data).find(key => data[key].id === id);
    if (!issueKey) return;
    
    const issueRef = ref(database, `${ISSUES_REF}/${issueKey}`);
    await remove(issueRef);
  } catch (error) {
    console.error('Error deleting issue:', error);
    throw error;
  }
}

// ดึงสถิติจาก Firebase
export async function getStatsFromFirebase(): Promise<IssueStats> {
  try {
    const issues = await getIssuesOnce();
    
    return {
      total: issues.length,
      pending: issues.filter(i => i.status === 'pending').length,
      inprogress: issues.filter(i => i.status === 'inprogress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      total: 0,
      pending: 0,
      inprogress: 0,
      resolved: 0,
    };
  }
}

// ฟังก์ชันสำหรับ seed ข้อมูลตัวอย่างบน Firebase
export async function seedDemoDataToFirebase(): Promise<void> {
  try {
    const existingIssues = await getIssuesOnce();
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
      await addIssueToFirebase(issue);
    }
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}
