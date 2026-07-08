import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui';
import { mockNotifications } from '@/lib/mockData';
import type { UserRole } from '@/types';
import {
  LayoutDashboard, FileText, Calendar, Clock, DollarSign,
  Megaphone, ClipboardCheck, BarChart2, Settings, Users,
  GitBranch, Bot, CreditCard, Server, ChevronRight,
  Bell, LogOut, ChevronDown, Briefcase, Award,
  BookOpen, TrendingUp, X
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: NavItem[];
}

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case 'employee':
      return [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, path: '/dashboard' },
        { id: 'my-requests', label: 'My Requests', icon: <FileText size={16} />, path: '/my-requests', badge: 2 },
        { id: 'my-attendance', label: 'My Attendance', icon: <Clock size={16} />, path: '/my-attendance' },
        { id: 'payslip', label: 'Payslip', icon: <DollarSign size={16} />, path: '/payslip' },
        { id: 'announcements', label: 'Announcements', icon: <Megaphone size={16} />, path: '/announcements' },
      ];
    case 'approver':
      return [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, path: '/dashboard', badge: 5 },
        { id: 'approval-history', label: 'Approval History', icon: <ClipboardCheck size={16} />, path: '/approval-history' },
        { id: 'announcements', label: 'Announcements', icon: <Megaphone size={16} />, path: '/announcements' },
      ];
    case 'hr_admin':
      return [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, path: '/dashboard' },
        { id: 'employees', label: 'Employees', icon: <Users size={16} />, path: '/employees' },
        { id: 'leave', label: 'Leave Management', icon: <Calendar size={16} />, path: '/leave', badge: 3 },
        { id: 'attendance', label: 'Attendance', icon: <Clock size={16} />, path: '/attendance' },
        { id: 'payroll', label: 'Payroll', icon: <DollarSign size={16} />, path: '/payroll' },
        {
          id: 'hr-extended', label: 'HR Extended', icon: <Briefcase size={16} />, path: '/hr-extended',
          children: [
            { id: 'evaluation', label: 'Evaluation', icon: <Award size={16} />, path: '/hr-extended/evaluation' },
            { id: 'service-record', label: 'Service Record', icon: <BookOpen size={16} />, path: '/hr-extended/service-record' },
            { id: 'training', label: 'Training', icon: <GitBranch size={16} />, path: '/hr-extended/training' },
            { id: 'promotion', label: 'Promotion', icon: <TrendingUp size={16} />, path: '/hr-extended/promotion' },
          ],
        },
        { id: 'announcements', label: 'Announcements', icon: <Megaphone size={16} />, path: '/announcements' },
      ];
    case 'tenant_admin':
      return [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, path: '/dashboard' },
        { id: 'workflow-templates', label: 'Workflow Templates', icon: <GitBranch size={16} />, path: '/workflow-templates' },
        { id: 'users-departments', label: 'Users & Departments', icon: <Users size={16} />, path: '/users-departments' },
        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} />, path: '/analytics' },
        { id: 'ai-insights', label: 'AI Insights', icon: <Bot size={16} />, path: '/ai-insights' },
        { id: 'subscription', label: 'Subscription', icon: <CreditCard size={16} />, path: '/subscription' },
        { id: 'announcements', label: 'Announcements', icon: <Megaphone size={16} />, path: '/announcements' },
      ];
    case 'super_admin':
      return [
        { id: 'platform-dashboard', label: 'Platform Dashboard', icon: <LayoutDashboard size={16} />, path: '/dashboard' },
        { id: 'tenants', label: 'Tenants', icon: <Settings size={16} />, path: '/tenants' },
        { id: 'billing', label: 'Billing', icon: <CreditCard size={16} />, path: '/billing' },
        { id: 'platform-health', label: 'Platform Health', icon: <Server size={16} />, path: '/platform-health' },
      ];
    default:
      return [];
  }
}

interface SidebarProps {
  activeRoute: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ activeRoute, onNavigate, collapsed, onToggleCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  const { currentUser, login, logout } = useAuthStore();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  if (!currentUser) return null;

  const navItems = getNavItems(currentUser.role);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const roles: { role: UserRole; label: string }[] = [
    { role: 'employee', label: 'Employee' },
    { role: 'approver', label: 'Approver / Dept Head' },
    { role: 'hr_admin', label: 'HR Admin' },
    { role: 'tenant_admin', label: 'Tenant Admin / Mayor' },
    { role: 'super_admin', label: 'Super Admin' },
  ];

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = activeRoute === item.path || activeRoute.startsWith(item.path + '/');
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups.has(item.id);

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleGroup(item.id);
            } else {
              onNavigate(item.path);
              onMobileClose(); // Auto-close drawer on mobile when clicking nav item
            }
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-[120ms] relative group ${
            isActive
              ? 'bg-[#EEF2FD] text-[#122B4D] font-medium'
              : 'text-[#5C6B7A] hover:bg-[#F8F9FB] hover:text-[#122B4D]'
          } ${depth > 0 ? 'pl-7' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          {/* Yellow left accent bar for active item */}
          {isActive && (
            <motion.span
              layoutId="active-indicator"
              className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#F4B400] rounded-full"
              initial={false}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          )}

          <span className={`flex-shrink-0 ${isActive ? 'text-[#2457D6]' : ''}`}>
            {item.icon}
          </span>

          {(!collapsed || mobileOpen) && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="bg-[#F4B400] text-[#122B4D] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <motion.span
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronRight size={14} className="text-[#5C6B7A]" />
                </motion.span>
              )}
            </>
          )}
        </button>

        {/* Children */}
        {hasChildren && (!collapsed || mobileOpen) && (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="mt-0.5 ml-2 pl-2 border-l border-[#E3E7ED]">
                  {item.children!.map((child) => renderNavItem(child, depth + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:relative flex flex-col h-full bg-[#122B4D] overflow-hidden transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-16' : 'md:w-60'}
        `}
      >
        {/* Logo / Wordmark */}
        <div className="flex items-center gap-3 px-4 py-5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#2457D6] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="4" cy="9" r="2" fill="#F4B400" />
              <circle cx="9" cy="9" r="2" fill="white" />
              <circle cx="14" cy="9" r="2" fill="white" />
              <line x1="6" y1="9" x2="7" y2="9" stroke="white" strokeWidth="1.5" />
              <line x1="11" y1="9" x2="12" y2="9" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="font-[family-name:var(--font-display)] font-bold text-white text-lg tracking-tight whitespace-nowrap"
            >
              GovFlow
            </motion.span>
          )}
        </div>

        {/* Org Name */}
        {!collapsed && (
          <div className="px-4 mb-3">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium truncate">
              {currentUser.organizationName}
            </p>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-4">
          {navItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Divider */}
        <div className="border-t border-white/10 mx-2" />

        {/* Notification Bell */}
        <div className="px-2 py-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-[120ms] relative ${!collapsed ? '' : 'justify-center'}`}
          >
            <div className="relative flex-shrink-0">
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F4B400] rounded-full text-[8px] font-bold text-[#122B4D] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            {!collapsed && <span>Notifications</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <div className="px-2 pb-2">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-[120ms]"
          >
            <motion.span animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={16} />
            </motion.span>
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mx-2" />

        {/* User Profile */}
        <div className="p-2">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-[120ms] group"
          >
            <Avatar initials={currentUser.avatarInitials} size="sm" color="#2457D6" />
            {(!collapsed || mobileOpen) && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-white/40 truncate">{currentUser.position}</p>
              </div>
            )}
            {(!collapsed || mobileOpen) && <ChevronDown size={14} className="text-white/40 flex-shrink-0" />}
          </button>

          {/* Role switcher (demo helper) */}
          <AnimatePresence>
            {showRoleSwitcher && (!collapsed || mobileOpen) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="mt-1 bg-[#0E2240] rounded-lg border border-white/10 overflow-hidden"
              >
                <p className="px-3 py-1.5 text-[10px] text-white/30 uppercase tracking-wider">Switch Role (Demo)</p>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => { login(r.role); setShowRoleSwitcher(false); onNavigate('/dashboard'); onMobileClose(); }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-white/10 ${currentUser.role === r.role ? 'text-[#F4B400] font-medium' : 'text-white/60'}`}
                  >
                    {r.label}
                  </button>
                ))}
                <div className="border-t border-white/10 m-1" />
                <button
                  onClick={() => { logout(); setShowRoleSwitcher(false); onMobileClose(); }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#D64545] hover:bg-white/10 flex items-center gap-2"
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowNotifications(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-[264px] top-4 z-50 w-80 bg-white rounded-[12px] border border-[#E3E7ED] shadow-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E3E7ED]">
                <h3 className="font-semibold text-sm text-[#122B4D] font-[family-name:var(--font-display)]">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-[#5C6B7A] hover:text-[#122B4D]">
                  <X size={16} />
                </button>
              </div>
              <div className="divide-y divide-[#E3E7ED] max-h-96 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 ${!n.read ? 'bg-[#EEF2FD]' : ''}`}>
                    <div className="flex items-start gap-2">
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === 'approval' ? 'bg-[#1A8754]' :
                        n.type === 'warning' ? 'bg-[#F4B400]' :
                        n.type === 'error' ? 'bg-[#D64545]' : 'bg-[#2457D6]'
                      }`} />
                      <div>
                        <p className="text-xs font-semibold text-[#122B4D]">{n.title}</p>
                        <p className="text-xs text-[#5C6B7A] mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
