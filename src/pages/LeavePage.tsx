import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, StatusBadge, Button, Avatar } from '@/components/ui';
import { mockLeaveRequests, mockEmployees } from '@/lib/mockData';
import { getDocumentStatusColor, getDocumentStatusLabel, getLeaveTypeLabel, formatDate } from '@/lib/utils';
import type { LeaveRequest } from '@/types';
import { Search, Plus, X, Paperclip, ChevronDown } from 'lucide-react';

// ── Leave Application Form Modal ─────────────────────────────────────────────
function LeaveFormModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    leaveType: 'vacation_leave',
    from: '',
    to: '',
    halfDay: false,
    halfDayPeriod: 'am',
    reason: '',
  });

  const computeDays = () => {
    if (!form.from || !form.to) return 0;
    const from = new Date(form.from);
    const to = new Date(form.to);
    let count = 0;
    const cur = new Date(from);
    while (cur <= to) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return form.halfDay ? count - 0.5 : count;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-[12px] border border-[#E3E7ED] w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E7ED]">
          <h2 className="font-bold text-[#122B4D] font-[family-name:var(--font-display)]">Leave Application</h2>
          <button onClick={onClose} className="text-[#5C6B7A] hover:text-[#122B4D]"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Leave Type */}
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">Leave Type</label>
            <div className="relative">
              <select
                value={form.leaveType}
                onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] focus:outline-none focus:border-[#2457D6] appearance-none pr-8"
              >
                <option value="vacation_leave">Vacation Leave (VL)</option>
                <option value="sick_leave">Sick Leave (SL)</option>
                <option value="force_leave">Force Leave</option>
                <option value="special_leave">Special Leave</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5C6B7A] pointer-events-none" />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">From</label>
              <input
                type="date"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] focus:outline-none focus:border-[#2457D6]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">To</label>
              <input
                type="date"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] focus:outline-none focus:border-[#2457D6]"
              />
            </div>
          </div>

          {/* Half Day Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#122B4D]">Half Day?</p>
              <p className="text-xs text-[#5C6B7A]">Deducts 0.5 day from leave credits</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setForm({ ...form, halfDay: !form.halfDay })}
                className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${form.halfDay ? 'bg-[#2457D6]' : 'bg-[#E3E7ED]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.halfDay ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              {form.halfDay && (
                <div className="flex gap-1">
                  {['am', 'pm'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm({ ...form, halfDayPeriod: p })}
                      className={`px-2 py-1 text-xs rounded font-medium uppercase transition-all ${
                        form.halfDayPeriod === p ? 'bg-[#122B4D] text-white' : 'bg-[#F1F3F5] text-[#5C6B7A]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Number of Days (auto-computed) */}
          {(form.from && form.to) && (
            <div className="bg-[#EEF2FD] rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-sm text-[#2457D6]">Number of working days</span>
              <span className="font-bold font-[family-name:var(--font-display)] text-[#2457D6]">{computeDays()}</span>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">Reason</label>
            <textarea
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="State your reason for leave..."
              className="w-full px-3 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] placeholder:text-[#5C6B7A] focus:outline-none focus:border-[#2457D6] resize-none"
            />
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">
              Attachment {form.leaveType === 'sick_leave' ? <span className="text-[#D64545]">* Required</span> : '(Optional)'}
            </label>
            <button className="w-full border-2 border-dashed border-[#E3E7ED] rounded-lg px-4 py-3 text-sm text-[#5C6B7A] hover:border-[#2457D6] hover:text-[#2457D6] transition-all flex items-center justify-center gap-2">
              <Paperclip size={14} /> Upload file
            </button>
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <Button variant="primary" className="flex-1">Submit Application</Button>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Leave Approval Detail Modal ──────────────────────────────────────────────
function LeaveDetailModal({ request, onClose }: { request: LeaveRequest; onClose: () => void }) {
  const employee = mockEmployees.find((e) => e.name === request.employeeName);
  const sc = getDocumentStatusColor(request.status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-[12px] border border-[#E3E7ED] w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#E3E7ED]">
          <div className="flex items-center gap-3">
            <Avatar initials={request.employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2)} size="lg" color="#2457D6" />
            <div>
              <h2 className="font-bold text-[#122B4D] font-[family-name:var(--font-display)]">{request.employeeName}</h2>
              <p className="text-sm text-[#5C6B7A]">{request.department}</p>
              <p className="text-xs text-[#5C6B7A]">{request.position}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#5C6B7A] hover:text-[#122B4D]"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Leave Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide">Leave Type</p>
              <p className="font-semibold text-sm text-[#122B4D] mt-0.5">{getLeaveTypeLabel(request.leaveType)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide">Status</p>
              <div className="mt-0.5">
                <StatusBadge text={getDocumentStatusLabel(request.status)} color={sc.text} bg={sc.bg} />
              </div>
            </div>
            <div>
              <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide">Dates</p>
              <p className="font-semibold text-sm text-[#122B4D] mt-0.5 font-[family-name:var(--font-mono)]">
                {formatDate(request.from)} – {formatDate(request.to)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide">Days</p>
              <p className="font-semibold text-sm text-[#122B4D] mt-0.5">{request.days} day(s){request.halfDay ? ` (${request.halfDayPeriod?.toUpperCase()} half)` : ''}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-[#F8F9FB] rounded-lg px-3 py-2.5">
            <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide mb-1">Reason</p>
            <p className="text-sm text-[#122B4D]">{request.reason}</p>
          </div>

          {/* Leave Credits Snapshot */}
          {employee && (
            <div>
              <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide mb-2">Leave Credits Snapshot</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Vacation Leave', data: employee.leaveCredits.vacationLeave },
                  { label: 'Sick Leave', data: employee.leaveCredits.sickLeave },
                ].map(({ label, data }) => (
                  <div key={label} className="bg-[#F8F9FB] rounded-lg p-3 border border-[#E3E7ED]">
                    <p className="text-xs font-medium text-[#5C6B7A] mb-2">{label}</p>
                    <div className="space-y-1">
                      {[
                        { key: 'Total', val: data.total },
                        { key: 'Used', val: data.used, color: '#D64545' },
                        { key: 'Remaining', val: data.remaining, color: '#1A8754' },
                      ].map(({ key, val, color }) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-[#5C6B7A]">{key}</span>
                          <span className="font-semibold font-[family-name:var(--font-mono)]" style={{ color: color || '#122B4D' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachment */}
          {request.attachmentUrl && (
            <Button variant="secondary" size="sm" className="w-full">
              <Paperclip size={13} /> View Attachment (Medical Certificate)
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        {(request.status === 'pending' || request.status === 'in_review') && (
          <div className="px-5 pb-5 flex gap-2">
            <Button variant="primary" className="flex-1">Approve</Button>
            <Button variant="secondary">Decline</Button>
          </div>
        )}
        {request.status === 'approved' && (
          <div className="px-5 pb-5">
            <div className="bg-[#EBF7F2] rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-[#1A8754] text-sm">✓</span>
              <p className="text-sm text-[#1A8754]">Approved by {request.approvedBy} · {formatDate(request.approvedAt!)}</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Leave Management Page ────────────────────────────────────────────────────
export default function LeavePage() {
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = mockLeaveRequests.filter((r) => {
    const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-[#122B4D]">Leave Management</h1>
          <p className="text-sm text-[#5C6B7A] mt-0.5">Review and approve employee leave requests</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={15} /> New Leave Request
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6B7A]" />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] placeholder:text-[#5C6B7A] focus:outline-none focus:border-[#2457D6] transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'pending', 'in_review', 'approved', 'declined'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-[120ms] capitalize ${
                filterStatus === s ? 'bg-[#122B4D] text-white' : 'bg-white text-[#5C6B7A] border border-[#E3E7ED] hover:bg-[#F8F9FB]'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E3E7ED]">
                {['Employee', 'Leave Type', 'Date', 'Days', 'Status', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#5C6B7A] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7ED]">
              {filtered.map((req) => {
                const sc = getDocumentStatusColor(req.status);
                return (
                  <tr key={req.id} className="hover:bg-[#F8F9FB] transition-colors cursor-pointer" onClick={() => setSelectedRequest(req)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar initials={req.employeeName.split(' ').map(n => n[0]).join('').slice(0,2)} size="sm" color="#2457D6" />
                        <div>
                          <p className="text-sm font-medium text-[#122B4D] whitespace-nowrap">{req.employeeName}</p>
                          <p className="text-xs text-[#5C6B7A]">{req.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5C6B7A]">{getLeaveTypeLabel(req.leaveType)}</td>
                    <td className="px-4 py-3 text-sm font-[family-name:var(--font-mono)] text-[#5C6B7A] whitespace-nowrap">
                      {formatDate(req.from)} – {formatDate(req.to)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#122B4D]">{req.days}d</td>
                    <td className="px-4 py-3">
                      <StatusBadge text={getDocumentStatusLabel(req.status)} color={sc.text} bg={sc.bg} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-xs font-medium text-[#2457D6] hover:underline"
                        onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {selectedRequest && <LeaveDetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
        {showForm && <LeaveFormModal onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}
