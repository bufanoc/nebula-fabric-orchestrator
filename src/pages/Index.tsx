
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { TenantManagement } from "@/components/tenants/TenantManagement";
import { SwitchManagement } from "@/components/switches/SwitchManagement";
import { PolicyManagement } from "@/components/policies/PolicyManagement";
import { TopologyView } from "@/components/topology/TopologyView";
import { MonitoringView } from "@/components/monitoring/MonitoringView";

type ActiveView = 'dashboard' | 'tenants' | 'switches' | 'policies' | 'topology' | 'monitoring';

const Index = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tenants':
        return <TenantManagement />;
      case 'switches':
        return <SwitchManagement />;
      case 'policies':
        return <PolicyManagement />;
      case 'topology':
        return <TopologyView />;
      case 'monitoring':
        return <MonitoringView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header />
        <main className="flex-1 p-6">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default Index;
