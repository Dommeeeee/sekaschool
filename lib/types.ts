export type IssueStatus = 'pending' | 'inprogress' | 'resolved';
export type IssuePriority = 'low' | 'medium' | 'high';
export type IssueCategory =
  | 'อาคารและสถานที่'
  | 'อุปกรณ์และครุภัณฑ์'
  | 'ความปลอดภัย'
  | 'สุขอนามัย'
  | 'ระบบไฟฟ้าและประปา'
  | 'อินเทอร์เน็ตและคอมพิวเตอร์'
  | 'อื่นๆ';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  reporterName: string;
  reporterContact: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  adminNote?: string;
  imageUrl?: string;
}

export interface IssueStats {
  total: number;
  pending: number;
  inprogress: number;
  resolved: number;
}
