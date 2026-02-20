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
    id: `ISS-${Date.now().toString().slice(-6)}`,
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
  // ไม่มีข้อมูลตัวอย่าง - เริ่มต้นด้วยรายการว่างเปล่า
  console.log('Firebase demo data seeding skipped - starting with empty issues list');
}
