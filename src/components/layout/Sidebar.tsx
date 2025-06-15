
import { 
  LayoutDashboard, 
  Users, 
  Network, 
  Shield, 
  Topology, 
  Activity,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tenants', label: 'Tenants', icon: Users },
  { id: 'switches', label: 'Virtual Switches', icon: Network },
  { id: 'policies', label: 'Policies', icon: Shield },
  { id: 'topology', label: 'Network Topology', icon: Topology },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
];

export const Sidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed }: SidebarProps) => {
  return (
    <div className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-blue-400">DVSC Controller</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-slate-700"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>
      
      <nav className="mt-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                activeView === item.id ? 'bg-blue-600 border-r-2 border-blue-400' : ''
              }`}
            >
              <IconComponent size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
      
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-400">
          <div className="border-t border-slate-700 pt-4">
            <p>Distributed Virtual Switch Controller</p>
            <p className="mt-1">v1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
};
