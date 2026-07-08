import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, StatusBadge } from '@/components/ui';
import { mockTravelOrders } from '@/lib/mockData';
import { getDocumentStatusColor, getDocumentStatusLabel, formatDate } from '@/lib/utils';
import { Plus, X, Paperclip, MapPin, FileText } from 'lucide-react';

function TravelOrderForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ destination: '', purpose: '', date: '' });

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
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E7ED]">
          <h2 className="font-bold text-[#122B4D] font-[family-name:var(--font-display)]">Travel Order Request</h2>
          <button onClick={onClose} className="text-[#5C6B7A] hover:text-[#122B4D]"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">Destination</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6B7A]" />
              <input
                type="text"
                placeholder="e.g., Quezon City"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="w-full pl-8 pr-4 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] placeholder:text-[#5C6B7A] focus:outline-none focus:border-[#2457D6]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">Purpose</label>
            <textarea
              rows={3}
              placeholder="State the purpose of travel..."
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] placeholder:text-[#5C6B7A] focus:outline-none focus:border-[#2457D6] resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] focus:outline-none focus:border-[#2457D6]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">Attachment (Optional)</label>
            <button className="w-full border-2 border-dashed border-[#E3E7ED] rounded-lg px-4 py-3 text-sm text-[#5C6B7A] hover:border-[#2457D6] hover:text-[#2457D6] transition-all flex items-center justify-center gap-2">
              <Paperclip size={14} /> Upload file
            </button>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <Button variant="primary" className="flex-1">Submit</Button>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function JobOrderForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ project: '', description: '', date: '' });

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
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E3E7ED]">
          <h2 className="font-bold text-[#122B4D] font-[family-name:var(--font-display)]">Job Order Request</h2>
          <button onClick={onClose} className="text-[#5C6B7A] hover:text-[#122B4D]"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">Project</label>
            <div className="relative">
              <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6B7A]" />
              <input
                type="text"
                placeholder="e.g., Road Repair Project"
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                className="w-full pl-8 pr-4 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] placeholder:text-[#5C6B7A] focus:outline-none focus:border-[#2457D6]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the job to be done..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] placeholder:text-[#5C6B7A] focus:outline-none focus:border-[#2457D6] resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] focus:outline-none focus:border-[#2457D6]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5C6B7A] uppercase tracking-wide mb-1.5">Attachment (Optional)</label>
            <button className="w-full border-2 border-dashed border-[#E3E7ED] rounded-lg px-4 py-3 text-sm text-[#5C6B7A] hover:border-[#2457D6] hover:text-[#2457D6] transition-all flex items-center justify-center gap-2">
              <Paperclip size={14} /> Upload file
            </button>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <Button variant="primary" className="flex-1">Submit</Button>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MyRequestsPage() {
  const [activeTab, setActiveTab] = useState<'travel' | 'job' | 'leave'>('travel');
  const [showTravelForm, setShowTravelForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-[#122B4D]">My Requests</h1>
          <p className="text-sm text-[#5C6B7A] mt-0.5">Submit and track your document requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowJobForm(true)}>
            <Plus size={14} /> Job Order
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowTravelForm(true)}>
            <Plus size={14} /> Travel Order
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white rounded-lg border border-[#E3E7ED] p-1 w-fit">
        {[
          { key: 'travel', label: 'Travel Orders' },
          { key: 'job', label: 'Job Orders' },
          { key: 'leave', label: 'Leave Requests' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-[120ms] ${
              activeTab === tab.key ? 'bg-[#122B4D] text-white' : 'text-[#5C6B7A] hover:text-[#122B4D]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'travel' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E3E7ED]">
                  {['Destination', 'Purpose', 'Date', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#5C6B7A] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E7ED]">
                {mockTravelOrders.map((to) => {
                  const sc = getDocumentStatusColor(to.status);
                  return (
                    <tr key={to.id} className="hover:bg-[#F8F9FB] transition-colors">
                      <td className="px-4 py-3 font-medium text-sm text-[#122B4D]">{to.destination}</td>
                      <td className="px-4 py-3 text-sm text-[#5C6B7A]">{to.purpose}</td>
                      <td className="px-4 py-3 text-sm font-[family-name:var(--font-mono)] text-[#5C6B7A] whitespace-nowrap">{formatDate(to.date)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge text={getDocumentStatusLabel(to.status)} color={sc.text} bg={sc.bg} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'job' && (
        <div className="py-16 text-center text-[#5C6B7A]">
          <FileText size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">No job orders submitted yet</p>
          <p className="text-sm mt-1">Click "Job Order" to submit your first request</p>
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="py-16 text-center text-[#5C6B7A]">
          <FileText size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">Go to Leave Management to view your requests</p>
        </div>
      )}

      <AnimatePresence>
        {showTravelForm && <TravelOrderForm onClose={() => setShowTravelForm(false)} />}
        {showJobForm && <JobOrderForm onClose={() => setShowJobForm(false)} />}
      </AnimatePresence>
    </div>
  );
}
