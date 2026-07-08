// Types for GovFlow application

export type UserRole = 'employee' | 'approver' | 'hr_admin' | 'tenant_admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  position: string;
  avatarInitials: string;
  organizationId: string;
  organizationName: string;
}

export type DocumentStatus = 'pending' | 'approved' | 'declined' | 'in_review' | 'completed';
export type AttendanceStatus = 'present' | 'late' | 'on_leave' | 'official_business' | 'holiday' | 'weekend' | 'absent';
export type LeaveType = 'vacation_leave' | 'sick_leave' | 'force_leave' | 'special_leave';

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  officeName: string;
  assigneeName: string;
  status: 'pending' | 'completed' | 'current' | 'skipped';
  completedAt?: string;
  comment?: string;
  slaDays: number;
  daysInStep?: number;
}

export interface Document {
  id: string;
  qrCode: string;
  type: 'travel_order' | 'job_order' | 'leave_request' | 'purchase_request' | 'memorandum' | 'contract';
  title: string;
  requester: string;
  requesterDept: string;
  status: DocumentStatus;
  currentHolder: string;
  currentStep: number;
  totalSteps: number;
  workflowSteps: WorkflowStep[];
  submittedAt: string;
  updatedAt: string;
  destination?: string;
  purpose?: string;
  dateRange?: { from: string; to: string };
  attachmentUrl?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  leaveType: LeaveType;
  from: string;
  to: string;
  halfDay: boolean;
  halfDayPeriod?: 'am' | 'pm';
  days: number;
  reason: string;
  attachmentUrl?: string;
  status: DocumentStatus;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface TravelOrder {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  destination: string;
  purpose: string;
  date: string;
  status: DocumentStatus;
  submittedAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  timeIn?: string;
  timeOut?: string;
  status: AttendanceStatus;
  hoursWorked?: number;
  overtimeMinutes?: number;
  undertimeMinutes?: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  dateHired: string;
  avatarInitials: string;
  leaveCredits: {
    vacationLeave: { total: number; used: number; remaining: number };
    sickLeave: { total: number; used: number; remaining: number };
  };
  attendanceSummary: {
    present: number;
    absent: number;
    late: number;
    onLeave: number;
    officialBusiness: number;
    workingDays: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'info' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeave: number;
  officialBusiness: number;
  pendingRequests: number;
  approvedToday: number;
  declinedToday: number;
}

export interface OrgStats {
  documentsInProcess: number;
  delayed: number;
  pendingSignature: number;
  averageProcessingDays: number;
  mostDelayedOffice: string;
}
