import { Issue } from './types';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'issues.json');

// สร้างโฟลเดอร์ data ถ้ายังไม่มี
function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// อ่านข้อมูลจากไฟล์
export function readIssues(): Issue[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// เขียนข้อมูลลงไฟล์
export function writeIssues(issues: Issue[]): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(issues, null, 2));
}
