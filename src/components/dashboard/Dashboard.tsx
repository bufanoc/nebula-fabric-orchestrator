
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
  const stats = [
    { title: "Active Switches", value: "12", icon: Network, color: "text-blue-600" },
    { title: "Tenants", value: "5", icon: Users, color: "text-green-600" },
    { title: "Active Policies", value: "28", icon: Shield, color: "text-purple-600" },
    { title: "Total Ports", value: "156", icon: Activity, color: "text-orange-600" },
  ];

  const hypervisors = [
    { name: "XenServer-01", status: "Online", switches: 4, ports: 48 },
    { name: "XenServer-02", status: "Online", switches: 3, ports: 36 },
    { name: "XenServer-03", status: "Warning", switches: 5, ports: 72 },
  ];

  const recentEvents = [
    { type: "info", message: "New virtual switch created in tenant 'Production'", time: "2 minutes ago" },
    { type: "warning", message: "Port utilization high on XenServer-03", time: "5 minutes ago" },
    { type: "success", message: "Policy 'DMZ-Access' successfully applied", time: "10 minutes ago" },
    { type: "error", message: "Connection timeout to hypervisor XenServer-04", time: "15 minutes ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
              {hypervisors.map((hypervisor, index) => (
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
              ))}
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
              {recentEvents.map((event, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
