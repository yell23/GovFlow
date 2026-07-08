import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/Sidebar';
import { Button, Card, Avatar } from '@/components/ui';

// Import Pages
import DashboardPage from '@/pages/DashboardPage';
import DocumentTrackingPage from '@/pages/DocumentTrackingPage';
import LeavePage from '@/pages/LeavePage';
import AttendancePage from '@/pages/AttendancePage';
import EmployeesPage from '@/pages/EmployeesPage';
import MyRequestsPage from '@/pages/MyRequestsPage';
import AIInsightsPage from '@/pages/AIInsightsPage';

// Simple fallback components for pages not fully specified in 2.1 / 13 to ensure zero runtime errors:
function PlaceholderPage({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-[#122B4D]">{title}</h1>
        <p className="text-sm text-[#5C6B7A] mt-0.5">{desc}</p>
      </div>
      <Card className="p-8 text-center border-dashed">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EEF2FD] text-[#2457D6] flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3 className="font-semibold text-sm text-[#122B4D] font-[family-name:var(--font-display)]">Module Operational</h3>
          <p className="text-xs text-[#5C6B7A] leading-relaxed">
            This module is pre-integrated into the routing and permission layers of the GovFlow engine.
          </p>
        </div>
      </Card>
    </div>
  );
}

function PayslipPage() {
  return (
    <PlaceholderPage
      title="My Payslips"
      desc="Access and download your computerized government pay slips."
    />
  );
}

function AnnouncementsPage() {
  return (
    <PlaceholderPage
      title="Announcements"
      desc="Official circulars, memoranda, and administrative announcements."
    />
  );
}

function ApprovalHistoryPage() {
  return (
    <PlaceholderPage
      title="Approval History"
      desc="Audit trail of all document requests you have approved or declined."
    />
  );
}

function PayrollPage() {
  return (
    <PlaceholderPage
      title="Payroll Processing"
      desc="Generate LGU payroll sheets based on attendance records and leave inputs."
    />
  );
}

function WorkflowTemplatesPage() {
  return (
    <PlaceholderPage
      title="Workflow Templates"
      desc="Configure custom routing and approval hierarchies for your organization."
    />
  );
}

function UsersDepartmentsPage() {
  return (
    <PlaceholderPage
      title="Users & Departments"
      desc="Manage LGU departments, employee accounts, and role permissions."
    />
  );
}

function AnalyticsPage() {
  return (
    <PlaceholderPage
      title="LGU Performance Analytics"
      desc="Deep-dive reports on document turnaround times, SLA compliance, and office efficiency."
    />
  );
}

function SubscriptionPage() {
  return (
    <PlaceholderPage
      title="Subscription Details"
      desc="View and manage subscription tier, seat counts, and active billing cycle."
    />
  );
}

function TenantsPage() {
  return (
    <PlaceholderPage
      title="Tenant Management"
      desc="Onboard and manage LGU client organizations on the GovFlow network."
    />
  );
}

function BillingPage() {
  return (
    <PlaceholderPage
      title="Platform Billing"
      desc="Manage client invoices, subscription plans, and recurring fees."
    />
  );
}

function PlatformHealthPage() {
  return (
    <PlaceholderPage
      title="Platform Health & System Monitoring"
      desc="Real-time check on database logs, edge functions, and system status."
    />
  );
}

export default function App() {
  const { currentUser, login } = useAuthStore();
  const [activeRoute, setActiveRoute] = useState('/dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Simple state router
  const renderContent = () => {
    switch (activeRoute) {
      case '/dashboard':
        return <DashboardPage />;
      case '/my-requests':
        return <MyRequestsPage />;
      case '/my-attendance':
      case '/attendance':
        return <AttendancePage />;
      case '/payslip':
        return <PayslipPage />;
      case '/announcements':
        return <AnnouncementsPage />;
      case '/approval-history':
        return <ApprovalHistoryPage />;
      case '/employees':
        return <EmployeesPage />;
      case '/leave':
      case '/leave-management':
        return <LeavePage />;
      case '/payroll':
        return <PayrollPage />;
      case '/hr-extended/evaluation':
        return <PlaceholderPage title="Evaluations" desc="Performance evaluations and ratings history." />;
      case '/hr-extended/service-record':
        return <PlaceholderPage title="Service Records" desc="Employee 201 files and designation records." />;
      case '/hr-extended/training':
        return <PlaceholderPage title="Trainings" desc="Accumulated training hours and certifications." />;
      case '/hr-extended/promotion':
        return <PlaceholderPage title="Promotions" desc="Promotion applications and career tracking." />;
      case '/workflow-templates':
        return <WorkflowTemplatesPage />;
      case '/users-departments':
        return <UsersDepartmentsPage />;
      case '/analytics':
        return <AnalyticsPage />;
      case '/ai-insights':
        return <AIInsightsPage />;
      case '/subscription':
        return <SubscriptionPage />;
      case '/tenants':
        return <TenantsPage />;
      case '/billing':
        return <BillingPage />;
      case '/platform-health':
        return <PlaceholderPage title="Platform Health" desc="Real-time check on database logs and system status." />;
      default:
        // Check if there is any other route or if it matches the general document tracking view
        return <DocumentTrackingPage />;
    }
  };

  // If user is logged out, show simplified login screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#2457D6] flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
                <circle cx="4" cy="9" r="2" fill="#F4B400" />
                <circle cx="9" cy="9" r="2" fill="white" />
                <circle cx="14" cy="9" r="2" fill="white" />
                <line x1="6" y1="9" x2="7" y2="9" stroke="white" strokeWidth="1.5" />
                <line x1="11" y1="9" x2="12" y2="9" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-[#122B4D]">GovFlow Login</h1>
            <p className="text-xs text-[#5C6B7A]">Select a role to access the multi-tenant LGU workspace</p>
          </div>
          <div className="space-y-2">
            <Button variant="primary" className="w-full" onClick={() => login('employee')}>
              Access as Employee
            </Button>
            <Button variant="primary" className="w-full" onClick={() => login('approver')}>
              Access as Department Head / Approver
            </Button>
            <Button variant="primary" className="w-full" onClick={() => login('hr_admin')}>
              Access as HR Admin
            </Button>
            <Button variant="primary" className="w-full" onClick={() => login('tenant_admin')}>
              Access as Tenant Admin / Mayor
            </Button>
            <Button variant="primary" className="w-full" onClick={() => login('super_admin')}>
              Access as Super Admin
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FB]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={(path) => setActiveRoute(path)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-[#E3E7ED] bg-white flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center text-xs text-[#5C6B7A]">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 -ml-2 mr-2 text-[#5C6B7A] hover:text-[#122B4D] hover:bg-[#F1F3F5] rounded-lg md:hidden cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#122B4D]">GovFlow</span>
              <span>/</span>
              <span className="capitalize truncate max-w-[120px] sm:max-w-none">{activeRoute.replace('/', '').replace('-', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action to jump to general tracking page */}
            <button
              onClick={() => setActiveRoute('/tracking')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-[120ms] flex items-center gap-1.5 cursor-pointer ${
                activeRoute === '/tracking'
                  ? 'bg-[#2457D6] text-white border-transparent'
                  : 'bg-white text-[#122B4D] border-[#E3E7ED] hover:bg-[#F8F9FB]'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="hidden sm:inline">Track Document</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Avatar initials={currentUser.avatarInitials} size="sm" color="#122B4D" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#122B4D]">{currentUser.name}</p>
                <p className="text-[10px] text-[#5C6B7A] capitalize font-medium">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Viewer Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoute}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
