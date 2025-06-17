
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Users, 
  Shield, 
  Activity,
  Server,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    activeSwitches: 0,
    tenants: 0,
    activePolicies: 0,
    totalPorts: 0
  });

  const [hypervisors, setHypervisors] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const updateStats = () => {
      // Get data from localStorage or set defaults
      const tenants = JSON.parse(localStorage.getItem('dvsc_tenants') || '[]');
      const switches = JSON.parse(localStorage.getItem('dvsc_switches') || '[]');
      const policies = JSON.parse(localStorage.getItem('dvsc_policies') || '[]');
      
      setStats({
        activeSwitches: switches.length,
        tenants: tenants.length,
        activePolicies: policies.filter((p: any) => p.status === 'active').length,
        totalPorts: switches.reduce((total: number, sw: any) => total + (sw.ports || 0), 0)
      });

      // Update hypervisors status
      setHypervisors([
        { name: "XenServer-01", status: "Online", switches: switches.filter((s: any) => s.hypervisor === "XenServer-01").length, ports: 48 },
        { name: "XenServer-02", status: "Online", switches: switches.filter((s: any) => s.hypervisor === "XenServer-02").length, ports: 36 },
        { name: "XenServer-03", status: switches.length > 5 ? "Warning" : "Online", switches: switches.filter((s: any) => s.hypervisor === "XenServer-03").length, ports: 72 },
      ]);

      // Update recent events
      const events = JSON.parse(localStorage.getItem('dvsc_events') || '[]');
      setRecentEvents(events.slice(0, 4));
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    { title: "Active Switches", value: stats.activeSwitches.toString(), icon: Network, color: "text-blue-600" },
    { title: "Tenants", value: stats.tenants.toString(), icon: Users, color: "text-green-600" },
    { title: "Active Policies", value: stats.activePolicies.toString(), icon: Shield, color: "text-purple-600" },
    { title: "Total Ports", value: stats.totalPorts.toString(), icon: Activity, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5" />
              Hypervisor Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hypervisors.length > 0 ? (
                hypervisors.map((hypervisor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        hypervisor.status === 'Online' ? 'bg-green-500' : 
                        hypervisor.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">{hypervisor.name}</p>
                        <p className="text-sm text-gray-600">
                          {hypervisor.switches} switches, {hypervisor.ports} ports
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={hypervisor.status === 'Online' ? 'default' : 'secondary'}
                      className={
                        hypervisor.status === 'Online' ? 'bg-green-100 text-green-800' :
                        hypervisor.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {hypervisor.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Server className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hypervisors connected</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.length > 0 ? (
                recentEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {event.type === 'info' && <Zap className="h-4 w-4 text-blue-500 mt-0.5" />}
                    {event.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                    {event.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                    {event.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{event.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent events</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
