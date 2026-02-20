import { NextResponse } from 'next/server';
import { readIssues } from '@/lib/server-storage';
import { Issue } from '@/lib/types';

export async function GET() {
  try {
    const issues = readIssues();
    
    const stats = {
      total: issues.length,
      pending: issues.filter((i: Issue) => i.status === 'pending').length,
      inprogress: issues.filter((i: Issue) => i.status === 'inprogress').length,
      resolved: issues.filter((i: Issue) => i.status === 'resolved').length,
      high: issues.filter((i: Issue) => i.priority === 'high').length,
      medium: issues.filter((i: Issue) => i.priority === 'medium').length,
      low: issues.filter((i: Issue) => i.priority === 'low').length,
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}
