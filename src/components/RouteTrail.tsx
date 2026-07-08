import { motion } from 'framer-motion';
import type { WorkflowStep } from '@/types';
import { formatDateTime } from '@/lib/utils';

interface RouteTrailProps {
  steps: WorkflowStep[];
  compact?: boolean;
}

export function RouteTrail({ steps, compact = false }: RouteTrailProps) {
  return (
    <div className={compact ? 'flex items-center gap-0' : 'relative'}>
      {compact ? (
        // Compact version: mini dot trail for table badges
        <div className="flex items-center gap-0.5">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <span
                className={`block rounded-full flex-shrink-0 ${step.status === 'current' ? 'w-2.5 h-2.5 ring-2 ring-[#F4B400]/40' : 'w-1.5 h-1.5'}`}
                style={{
                  backgroundColor:
                    step.status === 'completed'
                      ? '#2457D6'
                      : step.status === 'current'
                      ? '#F4B400'
                      : '#E3E7ED',
                }}
              />
              {i < steps.length - 1 && (
                <span
                  className="block h-px w-3 flex-shrink-0"
                  style={{ backgroundColor: step.status === 'completed' ? '#2457D6' : '#E3E7ED' }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        // Full version: vertical route trail for tracking view
        <div className="relative pl-6">
          {/* Vertical connector line */}
          <div
            className="absolute left-[11px] top-3 bottom-3 w-px"
            style={{ backgroundColor: '#E3E7ED' }}
          />

          {steps.map((step, i) => (
            <div key={step.id} className="relative flex items-start gap-4 mb-6 last:mb-0">
              {/* Step dot */}
              <div className="relative flex-shrink-0 -ml-6">
                {step.status === 'current' ? (
                  <motion.div
                    className="w-6 h-6 rounded-full border-2 border-[#F4B400] bg-white flex items-center justify-center"
                    animate={{ boxShadow: ['0 0 0 0px rgba(244,180,0,0.3)', '0 0 0 6px rgba(244,180,0,0)', '0 0 0 0px rgba(244,180,0,0)'] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F4B400] block" />
                  </motion.div>
                ) : step.status === 'completed' ? (
                  <div className="w-6 h-6 rounded-full bg-[#2457D6] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-[#E3E7ED] bg-white flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#E3E7ED] block" />
                  </div>
                )}
                {/* Progress fill on connector line */}
                {i < steps.length - 1 && step.status === 'completed' && (
                  <div
                    className="absolute left-[11px] top-6 w-px bg-[#2457D6]"
                    style={{ height: 'calc(100% + 1.5rem)' }}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-sm font-[family-name:var(--font-display)] text-[#122B4D]">
                      {step.officeName}
                    </p>
                    <p className="text-xs text-[#5C6B7A]">{step.assigneeName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {step.status === 'completed' && step.completedAt && (
                      <p className="text-xs font-[family-name:var(--font-mono)] text-[#1A8754]">
                        ✓ {formatDateTime(step.completedAt)}
                      </p>
                    )}
                    {step.status === 'current' && (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-xs font-medium text-[#F4B400]">● In Progress</span>
                        {step.daysInStep !== undefined && (
                          <span className={`text-xs font-[family-name:var(--font-mono)] ${step.daysInStep > step.slaDays ? 'text-[#D64545]' : 'text-[#5C6B7A]'}`}>
                            Day {step.daysInStep} of {step.slaDays}
                          </span>
                        )}
                      </div>
                    )}
                    {step.status === 'pending' && (
                      <span className="text-xs text-[#5C6B7A]">SLA: {step.slaDays}d</span>
                    )}
                  </div>
                </div>
                {step.comment && (
                  <div className="mt-2 bg-[#F8F9FB] rounded-lg px-3 py-2 text-xs text-[#5C6B7A] border border-[#E3E7ED]">
                    💬 {step.comment}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
