import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { MetricCard, StatusBadge, Card, Button } from '@/components/ui';
import { RouteTrail } from '@/components/RouteTrail';
import {
  mockDashboardStats, mockOrgStats, mockLeaveRequests,
  mockTravelOrders, mockDocuments, mockDocumentTrends, mockAttendanceTrends
} from '@/lib/mockData';
import {
  getDocumentStatusColor, getDocumentStatusLabel,
  getAttendanceStatusColor, getAttendanceStatusLabel,
  formatDate, timeAgo
} from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { AlertTriangle, TrendingUp, Clock, Users, FileText, CheckCircle } from 'lucide-react';
import type { UserRole } from '@/types';

const cardVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: [0.16, 1, 0.3, 1] as any }
  }),
};

// ── Employee Dashboard ───────────────────────────────────────────────────────
function EmployeeDashboard() {
  const stats = [
    { label: 'Present (Total)', value: '224', color: '#1A8754', icon: <CheckCircle size={14} /> },
    { label: 'Absent', value: '2', color: '#D64545', icon: <AlertTriangle size={14} /> },
    { label: 'Late', value: '8', color: '#D4890A', icon: <Clock size={14} /> },
    { label: 'Vacation Leave Left', value: '12', sublabel: 'of 15 days', color: '#2457D6', icon: <TrendingUp size={14} /> },
    { label: 'Sick Leave Left', value: '15', sublabel: 'of 15 days', color: '#2457D6', icon: <TrendingUp size={14} /> },
    { label: 'Pending Requests', value: '2', color: '#D4890A', icon: <FileText size={14} /> },
  ];

  const recentDocs = mockDocuments.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <MetricCard label={s.label} value={s.value} sublabel={s.sublabel} color={s.color} icon={s.icon} />
          </motion.div>
        ))}
      </div>

      {/* My Recent Documents */}
      <Card>
        <div className="px-5 py-4 border-b border-[#E3E7ED] flex items-center justify-between">
          <h2 className="font-semibold text-[#122B4D] font-[family-name:var(--font-display)]">My Recent Requests</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="divide-y divide-[#E3E7ED]">
          {recentDocs.map((doc) => {
            const sc = getDocumentStatusColor(doc.status);
            return (
              <div key={doc.id} className="px-5 py-4 hover:bg-[#F8F9FB] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-[#122B4D] truncate">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-[family-name:var(--font-mono)] text-[#5C6B7A]">{doc.qrCode}</span>
                      <span className="text-[#E3E7ED]">·</span>
                      <span className="text-xs text-[#5C6B7A]">{timeAgo(doc.updatedAt)}</span>
                    </div>
                    <div className="mt-2">
                      <RouteTrail steps={doc.workflowSteps} compact />
                    </div>
                  </div>
                  <StatusBadge
                    text={getDocumentStatusLabel(doc.status)}
                    color={sc.text}
                    bg={sc.bg}
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── Approver Dashboard ───────────────────────────────────────────────────────
function ApproverDashboard() {
  const pending = mockLeaveRequests.filter((r) => r.status === 'pending' || r.status === 'in_review');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: 'Pending Approvals', value: pending.length, color: '#D4890A' },
          { label: 'Approved Today', value: 3, color: '#1A8754' },
          { label: 'Declined Today', value: 1, color: '#D64545' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <MetricCard label={s.label} value={s.value} color={s.color} />
          </motion.div>
        ))}
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-[#E3E7ED]">
          <h2 className="font-semibold text-[#122B4D] font-[family-name:var(--font-display)]">Pending Approvals</h2>
        </div>
        <div className="divide-y divide-[#E3E7ED]">
          {mockLeaveRequests.map((req) => {
            const sc = getDocumentStatusColor(req.status);
            return (
              <div key={req.id} className="px-5 py-4 hover:bg-[#F8F9FB] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm text-[#122B4D]">{req.employeeName}</p>
                    <p className="text-xs text-[#5C6B7A]">{req.department} · {req.leaveType.replace('_', ' ')}</p>
                    <p className="text-xs text-[#5C6B7A] mt-0.5">{formatDate(req.from)} – {formatDate(req.to)} · {req.days} day(s)</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge text={getDocumentStatusLabel(req.status)} color={sc.text} bg={sc.bg} />
                    {(req.status === 'pending' || req.status === 'in_review') && (
                      <div className="flex gap-1.5">
                        <Button variant="primary" size="sm">Approve</Button>
                        <Button variant="secondary" size="sm">Decline</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── HR Admin Dashboard ───────────────────────────────────────────────────────
function HRAdminDashboard() {
  const s = mockDashboardStats;
  const stats = [
    { label: 'Total Employees', value: s.totalEmployees, icon: <Users size={14} />, color: '#122B4D' },
    { label: 'Present Today', value: s.presentToday, color: '#1A8754', icon: <CheckCircle size={14} /> },
    { label: 'Absent Today', value: s.absentToday, color: '#D64545', icon: <AlertTriangle size={14} /> },
    { label: 'Late Today', value: s.lateToday, color: '#D4890A', icon: <Clock size={14} /> },
    { label: 'On Leave', value: s.onLeave, color: '#2457D6', icon: <TrendingUp size={14} /> },
    { label: 'Official Business', value: s.officialBusiness, color: '#6B48D6', icon: <FileText size={14} /> },
    { label: 'Pending Requests', value: s.pendingRequests, color: '#D4890A', icon: <FileText size={14} /> },
    { label: 'Approved Today', value: s.approvedToday, color: '#1A8754', icon: <CheckCircle size={14} /> },
    { label: 'Declined Today', value: s.declinedToday, color: '#D64545', icon: <AlertTriangle size={14} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
        {stats.map((s, i) => (
          <motion.div key={s.label} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <MetricCard label={s.label} value={s.value} color={s.color} icon={s.icon} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance Trend Chart */}
        <Card className="p-5">
          <h3 className="font-semibold text-sm text-[#122B4D] font-[family-name:var(--font-display)] mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockAttendanceTrends}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2457D6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2457D6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E7ED" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#5C6B7A', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5C6B7A', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'Inter', border: '0.5px solid #E3E7ED', borderRadius: 8 }} />
              <Area type="monotone" dataKey="present" stroke="#2457D6" strokeWidth={2} fill="url(#presentGrad)" name="Present" />
              <Area type="monotone" dataKey="late" stroke="#F4B400" strokeWidth={1.5} fill="none" name="Late" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="absent" stroke="#D64545" strokeWidth={1.5} fill="none" name="Absent" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Leave Requests Table */}
        <Card>
          <div className="px-5 py-4 border-b border-[#E3E7ED] flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#122B4D] font-[family-name:var(--font-display)]">Leave Requests</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E3E7ED]">
                  {['Employee', 'Type', 'Dates', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#5C6B7A] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E7ED]">
                {mockLeaveRequests.map((req) => {
                  const sc = getDocumentStatusColor(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-[#F8F9FB] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#122B4D] whitespace-nowrap">{req.employeeName}</p>
                        <p className="text-xs text-[#5C6B7A]">{req.department}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#5C6B7A] whitespace-nowrap">
                        {req.leaveType === 'vacation_leave' ? 'VL' : req.leaveType === 'sick_leave' ? 'SL' : req.leaveType === 'force_leave' ? 'FL' : 'SpL'}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#5C6B7A] whitespace-nowrap font-[family-name:var(--font-mono)]">
                        {formatDate(req.from)} — {req.days}d
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge text={getDocumentStatusLabel(req.status)} color={sc.text} bg={sc.bg} />
                      </td>
                      <td className="px-4 py-3">
                        {(req.status === 'pending' || req.status === 'in_review') && (
                          <div className="flex gap-1.5">
                            <Button variant="primary" size="sm">Approve</Button>
                            <Button variant="secondary" size="sm">Decline</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Document Volume Chart */}
      <Card className="p-5">
        <h3 className="font-semibold text-sm text-[#122B4D] font-[family-name:var(--font-display)] mb-4">Document Volume by Month</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={mockDocumentTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E7ED" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5C6B7A', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#5C6B7A', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'Inter', border: '0.5px solid #E3E7ED', borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter' }} />
            <Bar dataKey="travelOrders" name="Travel Orders" fill="#2457D6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="leaveRequests" name="Leave Requests" fill="#F4B400" radius={[2, 2, 0, 0]} />
            <Bar dataKey="jobOrders" name="Job Orders" fill="#6B48D6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="purchaseRequests" name="Purchase Requests" fill="#1A8754" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── Tenant Admin Dashboard ───────────────────────────────────────────────────
function TenantAdminDashboard() {
  const org = mockOrgStats;

  return (
    <div className="space-y-6">
      {/* At-a-Glance Widget */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-[#5C6B7A] uppercase tracking-wide font-semibold">Today</span>
          <div className="flex-1 h-px bg-[#E3E7ED]" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          <div>
            <p className="text-3xl font-bold font-[family-name:var(--font-display)] text-[#122B4D]">{org.documentsInProcess}</p>
            <p className="text-sm text-[#5C6B7A] mt-0.5">Documents in Process</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-[family-name:var(--font-display)] text-[#D64545]">{org.delayed}</p>
            <p className="text-sm text-[#5C6B7A] mt-0.5">Delayed</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-[family-name:var(--font-display)] text-[#F4B400]">{org.pendingSignature}</p>
            <p className="text-sm text-[#5C6B7A] mt-0.5">Pending Signature</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-[family-name:var(--font-display)] text-[#2457D6]">{org.averageProcessingDays}d</p>
            <p className="text-sm text-[#5C6B7A] mt-0.5">Avg. Processing Time</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 bg-[#FDF0F0] rounded-lg px-3 py-2">
          <AlertTriangle size={14} className="text-[#D64545] flex-shrink-0" />
          <p className="text-sm text-[#D64545]">
            Most delayed office: <span className="font-semibold">{org.mostDelayedOffice}</span>
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold text-sm text-[#122B4D] font-[family-name:var(--font-display)] mb-4">Document Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockDocumentTrends}>
              <defs>
                <linearGradient id="docGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2457D6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2457D6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E7ED" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5C6B7A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5C6B7A' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, border: '0.5px solid #E3E7ED', borderRadius: 8 }} />
              <Area type="monotone" dataKey="travelOrders" stroke="#2457D6" strokeWidth={2} fill="url(#docGrad)" name="Travel Orders" />
              <Area type="monotone" dataKey="leaveRequests" stroke="#F4B400" strokeWidth={1.5} fill="none" name="Leave Requests" strokeDasharray="3 2" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Active Documents */}
        <Card>
          <div className="px-5 py-4 border-b border-[#E3E7ED]">
            <h3 className="font-semibold text-sm text-[#122B4D] font-[family-name:var(--font-display)]">Active Documents</h3>
          </div>
          <div className="divide-y divide-[#E3E7ED]">
            {mockDocuments.map((doc) => {
              const sc = getDocumentStatusColor(doc.status);
              return (
                <div key={doc.id} className="px-5 py-3 hover:bg-[#F8F9FB] transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#122B4D] truncate">{doc.title}</p>
                      <p className="text-xs text-[#5C6B7A]">{doc.requester} · {doc.currentHolder}</p>
                    </div>
                    <StatusBadge text={getDocumentStatusLabel(doc.status)} color={sc.text} bg={sc.bg} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Super Admin Dashboard ────────────────────────────────────────────────────
function SuperAdminDashboard() {
  const tenants = [
    { name: 'Municipality of San Jose', plan: 'Professional', users: 127, status: 'active', docs: 1240 },
    { name: 'Municipality of Taytay', plan: 'Starter', users: 48, status: 'active', docs: 312 },
    { name: 'City of Antipolo', plan: 'Enterprise', users: 412, status: 'active', docs: 5821 },
    { name: 'Municipality of Cainta', plan: 'Starter', users: 31, status: 'trial', docs: 89 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Tenants', value: 4, color: '#1A8754' },
          { label: 'Total Users', value: 618, color: '#2457D6' },
          { label: 'Docs Processed', value: '7.5K', color: '#122B4D' },
          { label: 'MRR', value: '₱23K', color: '#6B48D6' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <MetricCard label={s.label} value={s.value} color={s.color} />
          </motion.div>
        ))}
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-[#E3E7ED]">
          <h2 className="font-semibold text-[#122B4D] font-[family-name:var(--font-display)]">Tenants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E3E7ED]">
                {['Organization', 'Plan', 'Users', 'Docs Processed', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#5C6B7A] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7ED]">
              {tenants.map((t) => (
                <tr key={t.name} className="hover:bg-[#F8F9FB] transition-colors">
                  <td className="px-4 py-3 font-medium text-sm text-[#122B4D]">{t.name}</td>
                  <td className="px-4 py-3 text-xs text-[#5C6B7A]">{t.plan}</td>
                  <td className="px-4 py-3 text-sm font-[family-name:var(--font-mono)] text-[#122B4D]">{t.users}</td>
                  <td className="px-4 py-3 text-sm font-[family-name:var(--font-mono)] text-[#122B4D]">{t.docs.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      text={t.status === 'active' ? 'Active' : 'Trial'}
                      color={t.status === 'active' ? '#1A8754' : '#D4890A'}
                      bg={t.status === 'active' ? '#EBF7F2' : '#FEF9EC'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── Main Dashboard Router ────────────────────────────────────────────────────
export default function DashboardPage() {
  const { currentUser } = useAuthStore();

  const dashboards: Record<UserRole, React.ReactNode> = {
    employee: <EmployeeDashboard />,
    approver: <ApproverDashboard />,
    hr_admin: <HRAdminDashboard />,
    tenant_admin: <TenantAdminDashboard />,
    super_admin: <SuperAdminDashboard />,
  };

  const titles: Record<UserRole, string> = {
    employee: 'My Dashboard',
    approver: 'Pending Approvals',
    hr_admin: 'HR Dashboard',
    tenant_admin: "Mayor's Overview",
    super_admin: 'Platform Dashboard',
  };

  if (!currentUser) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-[#122B4D]">
          {titles[currentUser.role]}
        </h1>
        <p className="text-sm text-[#5C6B7A] mt-0.5">
          {currentUser.organizationName} · {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      {dashboards[currentUser.role]}
    </div>
  );
}
