import { useState } from 'react';
import { Card, StatusBadge, MetricCard } from '@/components/ui';
import { mockAttendance } from '@/lib/mockData';
import { getAttendanceStatusColor, getAttendanceStatusLabel, formatDate, formatTime } from '@/lib/utils';
import { Clock, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'log' | 'summary'>('log');

  const summary = {
    workingDays: 244,
    present: 224,
    late: 8,
    absent: 2,
    onLeave: 6,
    officialBusiness: 4,
  };

  const leaveCredits = [
    { type: 'Vacation Leave', total: 15, used: 3, remaining: 12 },
    { type: 'Sick Leave', total: 15, used: 0, remaining: 15 },
    { type: 'Force Leave', total: 3, used: 0, remaining: 3 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-[#122B4D]">My Attendance</h1>
        <p className="text-sm text-[#5C6B7A] mt-0.5">Your attendance records for 2026</p>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 mb-5">
        {[
          { label: 'Working Days', value: summary.workingDays, icon: <Clock size={13} />, color: '#5C6B7A' },
          { label: 'Present', value: summary.present, icon: <CheckCircle size={13} />, color: '#1A8754' },
          { label: 'Late', value: summary.late, icon: <Clock size={13} />, color: '#D4890A' },
          { label: 'Absent', value: summary.absent, icon: <AlertTriangle size={13} />, color: '#D64545' },
          { label: 'On Leave', value: summary.onLeave, icon: <TrendingDown size={13} />, color: '#2457D6' },
          { label: 'Official Biz', value: summary.officialBusiness, icon: <CheckCircle size={13} />, color: '#6B48D6' },
        ].map((s) => (
          <MetricCard key={s.label} label={s.label} value={s.value} color={s.color} icon={s.icon} />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white rounded-lg border border-[#E3E7ED] p-1 w-fit">
        {[
          { key: 'log', label: 'Attendance Log' },
          { key: 'summary', label: 'Leave Balance' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'log' | 'summary')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-[120ms] ${
              activeTab === tab.key ? 'bg-[#122B4D] text-white' : 'text-[#5C6B7A] hover:text-[#122B4D]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'log' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E3E7ED]">
                  {['Date', 'Time In', 'Time Out', 'Hours', 'Overtime', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#5C6B7A] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E7ED]">
                {mockAttendance.map((record) => {
                  const sc = getAttendanceStatusColor(record.status);
                  return (
                    <tr key={record.id} className="hover:bg-[#F8F9FB] transition-colors">
                      <td className="px-4 py-3 text-sm font-[family-name:var(--font-mono)] text-[#122B4D] whitespace-nowrap">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-4 py-3 text-sm font-[family-name:var(--font-mono)] text-[#5C6B7A] whitespace-nowrap">
                        {record.timeIn ? formatTime(record.timeIn) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-[family-name:var(--font-mono)] text-[#5C6B7A] whitespace-nowrap">
                        {record.timeOut ? formatTime(record.timeOut) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-[family-name:var(--font-mono)] text-[#5C6B7A]">
                        {record.hoursWorked ? `${record.hoursWorked}h` : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-[family-name:var(--font-mono)]" style={{ color: (record.overtimeMinutes ?? 0) > 0 ? '#1A8754' : '#5C6B7A' }}>
                        {(record.overtimeMinutes ?? 0) > 0 ? `+${record.overtimeMinutes}m` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          text={getAttendanceStatusLabel(record.status)}
                          color={sc.text}
                          bg={sc.bg}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {leaveCredits.map((lc) => (
            <Card key={lc.type} className="p-5">
              <h3 className="font-semibold text-sm text-[#122B4D] font-[family-name:var(--font-display)] mb-4">{lc.type}</h3>
              {/* Bar visualization */}
              <div className="mb-4">
                <div className="h-2 bg-[#E3E7ED] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2457D6] rounded-full transition-all"
                    style={{ width: `${(lc.remaining / lc.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Total', value: lc.total, color: '#5C6B7A' },
                  { label: 'Used', value: lc.used, color: '#D64545' },
                  { label: 'Remaining', value: lc.remaining, color: '#1A8754' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-[#5C6B7A]">{label}</span>
                    <span className="text-sm font-bold font-[family-name:var(--font-mono)]" style={{ color }}>{value} days</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
