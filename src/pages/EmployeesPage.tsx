import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, StatusBadge, Avatar, Button } from '@/components/ui';
import { mockEmployees } from '@/lib/mockData';
import { getAttendanceStatusColor, getAttendanceStatusLabel, formatDate } from '@/lib/utils';
import type { Employee } from '@/types';
import { Search, Plus, X, Mail, Calendar, Briefcase } from 'lucide-react';

function EmployeeDetailModal({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'leave' | 'documents'>('attendance');

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
        className="bg-white rounded-[12px] border border-[#E3E7ED] w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E3E7ED] px-5 py-4 rounded-t-[12px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar initials={employee.avatarInitials} size="lg" color="#2457D6" />
              <div>
                <h2 className="font-bold text-[#122B4D] font-[family-name:var(--font-display)]">{employee.name}</h2>
                <p className="text-sm text-[#5C6B7A]">{employee.position}</p>
                <p className="text-xs text-[#5C6B7A]">{employee.department}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-[#5C6B7A] hover:text-[#122B4D]"><X size={18} /></button>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-[#5C6B7A]">
            <span className="flex items-center gap-1.5"><Mail size={12} />{employee.email}</span>
            <span className="flex items-center gap-1.5"><Calendar size={12} />Hired {formatDate(employee.dateHired)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-4">
          <div className="flex gap-1 bg-[#F8F9FB] rounded-lg p-1 w-fit">
            {[
              { key: 'attendance', label: 'Attendance' },
              { key: 'leave', label: 'Leave Credits' },
              { key: 'documents', label: 'Documents' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-[120ms] ${
                  activeTab === tab.key ? 'bg-white text-[#122B4D] shadow-sm' : 'text-[#5C6B7A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-3">
          {activeTab === 'attendance' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Working Days', value: employee.attendanceSummary.workingDays },
                  { label: 'Present', value: employee.attendanceSummary.present, color: '#1A8754' },
                  { label: 'Absent', value: employee.attendanceSummary.absent, color: '#D64545' },
                  { label: 'Late', value: employee.attendanceSummary.late, color: '#D4890A' },
                  { label: 'On Leave', value: employee.attendanceSummary.onLeave, color: '#2457D6' },
                  { label: 'Official Biz', value: employee.attendanceSummary.officialBusiness, color: '#6B48D6' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#F8F9FB] rounded-lg p-3 border border-[#E3E7ED] text-center">
                    <p className="text-lg font-bold font-[family-name:var(--font-display)]" style={{ color: color || '#122B4D' }}>{value}</p>
                    <p className="text-[10px] text-[#5C6B7A] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'leave' && (
            <div className="space-y-3">
              {[
                { label: 'Vacation Leave', data: employee.leaveCredits.vacationLeave },
                { label: 'Sick Leave', data: employee.leaveCredits.sickLeave },
              ].map(({ label, data }) => (
                <div key={label} className="border border-[#E3E7ED] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-sm text-[#122B4D]">{label}</p>
                    <span className="text-sm font-bold font-[family-name:var(--font-mono)] text-[#1A8754]">{data.remaining}/{data.total} remaining</span>
                  </div>
                  <div className="h-1.5 bg-[#E3E7ED] rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#2457D6] rounded-full" style={{ width: `${(data.remaining / data.total) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-[#5C6B7A]">
                    <span>Used: <span className="font-semibold text-[#D64545]">{data.used}d</span></span>
                    <span>Total: <span className="font-semibold text-[#122B4D]">{data.total}d</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-2">
              {['Leave Request #LR-2026-042', 'Travel Order #TO-2026-018', 'Job Order #JO-2026-005'].map((doc) => (
                <div key={doc} className="flex items-center justify-between px-3 py-2.5 bg-[#F8F9FB] rounded-lg border border-[#E3E7ED]">
                  <p className="text-sm text-[#122B4D] font-[family-name:var(--font-mono)]">{doc}</p>
                  <button className="text-xs text-[#2457D6] hover:underline">View</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filtered = mockEmployees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-[#122B4D]">Employees</h1>
          <p className="text-sm text-[#5C6B7A] mt-0.5">{mockEmployees.length} employees in your organization</p>
        </div>
        <Button variant="primary">
          <Plus size={15} /> Add Employee
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6B7A]" />
        <input
          type="text"
          placeholder="Search by name, department, or position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-4 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] placeholder:text-[#5C6B7A] focus:outline-none focus:border-[#2457D6] transition-colors"
        />
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((emp, i) => (
          <motion.div
            key={emp.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-4 hover:border-[#2457D6] transition-colors cursor-pointer" >
              <div className="flex items-start gap-3" onClick={() => setSelectedEmployee(emp)}>
                <Avatar initials={emp.avatarInitials} size="lg" color="#2457D6" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[#122B4D] truncate">{emp.name}</p>
                    <StatusBadge
                      text={emp.status === 'active' ? 'Active' : 'Inactive'}
                      color={emp.status === 'active' ? '#1A8754' : '#D64545'}
                      bg={emp.status === 'active' ? '#EBF7F2' : '#FDF0F0'}
                    />
                  </div>
                  <p className="text-xs text-[#5C6B7A] mt-0.5 truncate">{emp.position}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Briefcase size={10} className="text-[#5C6B7A]" />
                    <p className="text-xs text-[#5C6B7A] truncate">{emp.department}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E3E7ED] grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Present', value: emp.attendanceSummary.present, color: '#1A8754' },
                  { label: 'Late', value: emp.attendanceSummary.late, color: '#D4890A' },
                  { label: 'VL Left', value: emp.leaveCredits.vacationLeave.remaining, color: '#2457D6' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <p className="text-sm font-bold font-[family-name:var(--font-display)]" style={{ color }}>{value}</p>
                    <p className="text-[10px] text-[#5C6B7A]">{label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEmployee && (
          <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
