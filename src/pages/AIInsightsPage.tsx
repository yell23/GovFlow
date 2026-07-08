import { Card } from '@/components/ui';
import { Bot, TrendingDown, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const insights = [
  {
    id: 'i1',
    icon: <TrendingDown size={18} className="text-[#D64545]" />,
    bg: '#FDF0F0',
    border: '#FAD4D4',
    title: 'Bottleneck Detected: Accounting Office',
    body: 'Purchase Requests are averaging 8 days in the Accounting Office, compared to the 3-day SLA target. This is causing downstream delays for 23% of all active documents this month.',
    recommendation: 'Consider redistributing workload or temporarily increasing staff capacity in Accounting.',
    severity: 'high',
  },
  {
    id: 'i2',
    icon: <Clock size={18} className="text-[#D4890A]" />,
    bg: '#FEF9EC',
    border: '#FDF0C0',
    title: 'Leave Surge Expected: July 14–18',
    body: '12 employees have approved leave or pending leave requests overlapping the week of July 14. Departments most affected: Engineering (4), Administrative (3).',
    recommendation: 'Coordinate with department heads to ensure coverage for critical approval roles during this period.',
    severity: 'medium',
  },
  {
    id: 'i3',
    icon: <CheckCircle size={18} className="text-[#1A8754]" />,
    bg: '#EBF7F2',
    border: '#C3EADA',
    title: 'Improved: Budget Office Processing Time',
    body: "The Budget Office's average processing time dropped from 5.2 days to 2.1 days over the past 30 days — within the 2-day SLA target.",
    recommendation: 'Document the workflow change that led to this improvement and replicate in other offices.',
    severity: 'positive',
  },
  {
    id: 'i4',
    icon: <AlertTriangle size={18} className="text-[#D4890A]" />,
    bg: '#FEF9EC',
    border: '#FDF0C0',
    title: '6 Documents Awaiting Mayor\'s Signature',
    body: 'Six documents across Travel Order, Purchase Request, and Leave Request have been at the Mayor\'s Office for more than 2 days without action.',
    recommendation: 'Escalate via in-app reminder or schedule a signature review session.',
    severity: 'medium',
  },
];

export default function AIInsightsPage() {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2457D6] to-[#122B4D] flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-[#122B4D]">AI Insights</h1>
            <p className="text-sm text-[#5C6B7A]">Powered by Claude · Updated 2 hours ago</p>
          </div>
        </div>
      </div>

      {/* Summary banner */}
      <Card className="p-4 mb-5 bg-gradient-to-r from-[#122B4D] to-[#1D3A6E]">
        <p className="text-white/60 text-xs uppercase tracking-wide font-semibold mb-1">This Week's Summary</p>
        <p className="text-white font-medium text-sm leading-relaxed">
          Your organization has <span className="text-[#F4B400] font-semibold">127 active documents</span> with an average processing time of <span className="text-[#F4B400] font-semibold">2.3 days</span>. 
          The biggest opportunity for improvement is the <span className="text-[#F4B400] font-semibold">Accounting Office</span>, which is responsible for 41% of total delays.
        </p>
      </Card>

      {/* Insight Cards */}
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <Card key={insight.id} className="p-5 hover:border-[#2457D6] transition-colors">
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: insight.bg, border: `1px solid ${insight.border}` }}
              >
                {insight.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-[#122B4D] font-[family-name:var(--font-display)]">{insight.title}</h3>
                <p className="text-sm text-[#5C6B7A] mt-1.5 leading-relaxed">{insight.body}</p>
                <div className="mt-2.5 flex items-start gap-1.5 bg-[#EEF2FD] rounded-lg px-3 py-2">
                  <span className="text-[#2457D6] text-xs font-semibold flex-shrink-0 mt-0.5">→</span>
                  <p className="text-xs text-[#2457D6]">{insight.recommendation}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded-[12px] border border-dashed border-[#E3E7ED] text-center">
        <Bot size={32} className="mx-auto mb-2 text-[#5C6B7A] opacity-30" />
        <p className="text-sm font-medium text-[#5C6B7A]">Ask a question about your workflow data</p>
        <p className="text-xs text-[#5C6B7A] mt-0.5">e.g., "Bakit bumagal ang processing ngayong buwan?"</p>
        <div className="mt-3 relative max-w-sm mx-auto">
          <input
            type="text"
            placeholder="Type your question..."
            className="w-full px-4 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] placeholder:text-[#5C6B7A] focus:outline-none focus:border-[#2457D6] pr-12"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2457D6] text-white rounded-md px-2.5 py-1 text-xs font-medium hover:bg-[#1D49B5] transition-colors">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
