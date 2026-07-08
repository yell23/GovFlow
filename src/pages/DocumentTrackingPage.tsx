import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, StatusBadge, Button, Avatar } from '@/components/ui';
import { RouteTrail } from '@/components/RouteTrail';
import { mockDocuments } from '@/lib/mockData';
import { getDocumentStatusColor, getDocumentStatusLabel, formatDate, formatDateTime, timeAgo } from '@/lib/utils';
import type { Document } from '@/types';
import { Search, QrCode, Filter, Eye, X } from 'lucide-react';

function DocumentDetailModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const sc = getDocumentStatusColor(doc.status);
  
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
        <div className="sticky top-0 bg-white border-b border-[#E3E7ED] px-5 py-4 flex items-start justify-between gap-4 rounded-t-[12px]">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-[#5C6B7A] mb-1">{doc.qrCode}</p>
            <h2 className="font-bold text-[#122B4D] font-[family-name:var(--font-display)]">{doc.title}</h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge text={getDocumentStatusLabel(doc.status)} color={sc.text} bg={sc.bg} />
            <button onClick={onClose} className="text-[#5C6B7A] hover:text-[#122B4D] transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide">Requester</p>
              <p className="font-medium text-[#122B4D] mt-0.5">{doc.requester}</p>
              <p className="text-xs text-[#5C6B7A]">{doc.requesterDept}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide">Submitted</p>
              <p className="font-medium text-[#122B4D] mt-0.5 font-[family-name:var(--font-mono)] text-xs">{formatDateTime(doc.submittedAt)}</p>
            </div>
            {doc.destination && (
              <div>
                <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide">Destination</p>
                <p className="font-medium text-[#122B4D] mt-0.5">{doc.destination}</p>
              </div>
            )}
            {doc.purpose && (
              <div>
                <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide">Purpose</p>
                <p className="font-medium text-[#122B4D] mt-0.5">{doc.purpose}</p>
              </div>
            )}
            {doc.dateRange && (
              <div>
                <p className="text-[11px] text-[#5C6B7A] uppercase tracking-wide">Date Range</p>
                <p className="font-medium text-[#122B4D] mt-0.5 font-[family-name:var(--font-mono)] text-xs">
                  {formatDate(doc.dateRange.from)} – {formatDate(doc.dateRange.to)}
                </p>
              </div>
            )}
          </div>

          {/* Route Trail */}
          <div>
            <h3 className="font-semibold text-sm text-[#122B4D] font-[family-name:var(--font-display)] mb-3">
              Document Trail · Step {doc.currentStep} of {doc.totalSteps}
            </h3>
            <RouteTrail steps={doc.workflowSteps} compact={false} />
          </div>

          {/* Action Buttons */}
          {doc.status !== 'approved' && doc.status !== 'declined' && (
            <div className="flex gap-2 pt-2 border-t border-[#E3E7ED]">
              <Button variant="primary" className="flex-1">Approve & Forward</Button>
              <Button variant="secondary">Decline</Button>
              <Button variant="secondary">Comment</Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DocumentTrackingPage() {
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = mockDocuments.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.qrCode.toLowerCase().includes(search.toLowerCase()) ||
      d.requester.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statuses = ['all', 'pending', 'in_review', 'approved', 'declined'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-[#122B4D]">Document Tracking</h1>
        <p className="text-sm text-[#5C6B7A] mt-0.5">Track every document's journey through the approval chain</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6B7A]" />
          <input
            type="text"
            placeholder="Search by title, QR code, or requester…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-[#E3E7ED] rounded-lg bg-white text-[#122B4D] placeholder:text-[#5C6B7A] focus:outline-none focus:border-[#2457D6] transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-[120ms] capitalize ${
                filterStatus === s
                  ? 'bg-[#122B4D] text-white'
                  : 'bg-white text-[#5C6B7A] border border-[#E3E7ED] hover:bg-[#F8F9FB]'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm">
          <QrCode size={14} /> Scan QR
        </Button>
      </div>

      {/* Documents Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E3E7ED]">
                {['QR Code', 'Document', 'Requester', 'Current Step', 'Progress', 'Status', 'Updated', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-[#5C6B7A] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7ED]">
              {filtered.map((doc) => {
                const sc = getDocumentStatusColor(doc.status);
                return (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-mono)] text-xs text-[#5C6B7A]">{doc.qrCode}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm text-[#122B4D] whitespace-nowrap max-w-[200px] truncate">{doc.title}</p>
                      <p className="text-xs text-[#5C6B7A] capitalize">{doc.type.replace('_', ' ')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar initials={doc.requester.split(' ').map(n => n[0]).join('').slice(0,2)} size="sm" color="#5C6B7A" />
                        <div>
                          <p className="text-sm text-[#122B4D] whitespace-nowrap">{doc.requester}</p>
                          <p className="text-xs text-[#5C6B7A]">{doc.requesterDept}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5C6B7A] whitespace-nowrap">{doc.currentHolder}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <RouteTrail steps={doc.workflowSteps} compact />
                        <span className="text-[10px] text-[#5C6B7A] font-[family-name:var(--font-mono)] whitespace-nowrap">
                          {doc.currentStep}/{doc.totalSteps}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge text={getDocumentStatusLabel(doc.status)} color={sc.text} bg={sc.bg} />
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5C6B7A] whitespace-nowrap">{timeAgo(doc.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        className="p-1.5 text-[#5C6B7A] hover:text-[#2457D6] hover:bg-[#EEF2FD] rounded-lg transition-all"
                        onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); }}
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[#5C6B7A] text-sm">No documents found matching your search.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <DocumentDetailModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
