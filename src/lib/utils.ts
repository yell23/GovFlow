import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AttendanceStatus, DocumentStatus, LeaveType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function getAttendanceStatusLabel(status: AttendanceStatus): string {
  const labels: Record<AttendanceStatus, string> = {
    present: 'Present',
    late: 'Late',
    on_leave: 'On Leave',
    official_business: 'Official Business',
    holiday: 'Holiday',
    weekend: 'Weekend',
    absent: 'Absent',
  };
  return labels[status];
}

export function getAttendanceStatusColor(status: AttendanceStatus): {
  text: string;
  bg: string;
  dot: string;
} {
  const colors: Record<AttendanceStatus, { text: string; bg: string; dot: string }> = {
    present: { text: '#1A8754', bg: '#EBF7F2', dot: '#1A8754' },
    late: { text: '#D4890A', bg: '#FEF9EC', dot: '#F4B400' },
    on_leave: { text: '#2457D6', bg: '#EEF2FD', dot: '#2457D6' },
    official_business: { text: '#6B48D6', bg: '#F3F0FD', dot: '#6B48D6' },
    holiday: { text: '#1A8754', bg: '#EBF7F2', dot: '#1A8754' },
    weekend: { text: '#5C6B7A', bg: '#F1F3F5', dot: '#5C6B7A' },
    absent: { text: '#D64545', bg: '#FDF0F0', dot: '#D64545' },
  };
  return colors[status];
}

export function getDocumentStatusColor(status: DocumentStatus): {
  text: string;
  bg: string;
} {
  const colors: Record<DocumentStatus, { text: string; bg: string }> = {
    pending: { text: '#D4890A', bg: '#FEF9EC' },
    approved: { text: '#1A8754', bg: '#EBF7F2' },
    declined: { text: '#D64545', bg: '#FDF0F0' },
    in_review: { text: '#2457D6', bg: '#EEF2FD' },
    completed: { text: '#1A8754', bg: '#EBF7F2' },
  };
  return colors[status];
}

export function getDocumentStatusLabel(status: DocumentStatus): string {
  const labels: Record<DocumentStatus, string> = {
    pending: 'Pending',
    approved: 'Approved',
    declined: 'Declined',
    in_review: 'In Review',
    completed: 'Completed',
  };
  return labels[status];
}

export function getLeaveTypeLabel(type: LeaveType): string {
  const labels: Record<LeaveType, string> = {
    vacation_leave: 'Vacation Leave',
    sick_leave: 'Sick Leave',
    force_leave: 'Force Leave',
    special_leave: 'Special Leave',
  };
  return labels[type];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
