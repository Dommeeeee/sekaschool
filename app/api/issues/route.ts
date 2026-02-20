import { NextRequest, NextResponse } from 'next/server';
import { Issue } from '@/lib/types';
import { readIssues, writeIssues } from '@/lib/server-storage';

// GET - ดึงข้อมูลปัญหาทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const issues = readIssues();
    return NextResponse.json(issues);
  } catch (error) {
    console.error('Error reading issues:', error);
    return NextResponse.json({ error: 'Failed to read issues' }, { status: 500 });
  }
}

// POST - เพิ่มปัญหาใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const issues = readIssues();
    
    const newIssue: Issue = {
      ...body,
      id: `ISS-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    issues.unshift(newIssue);
    writeIssues(issues);
    
    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
  }
}

// PUT - อัปเดตปัญหา
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const issues = readIssues();
    const index = issues.findIndex(issue => issue.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    
    const updatedIssue: Issue = {
      ...issues[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      ...(updates.status === 'resolved' && !issues[index].resolvedAt
        ? { resolvedAt: new Date().toISOString() }
        : {}),
    };
    
    issues[index] = updatedIssue;
    writeIssues(issues);
    
    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
  }
}

// DELETE - ลบปัญหา
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Issue ID is required' }, { status: 400 });
    }
    
    const issues = readIssues();
    const filteredIssues = issues.filter(issue => issue.id !== id);
    
    if (issues.length === filteredIssues.length) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    
    writeIssues(filteredIssues);
    
    return NextResponse.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 });
  }
}
