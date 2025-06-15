
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
    { title: "Active Switches", value: "0", icon: Network, color: "text-blue-600" },
    { title: "Tenants", value: "0", icon: Users, color: "text-green-600" },
    { title: "Active Policies", value: "0", icon: Shield, color: "text-purple-600" },
    { title: "Total Ports", value: "0", icon: Activity, color: "text-orange-600" },
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
            <div className="text-center py-8">
              <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No Hypervisors Connected</p>
              <p className="text-gray-400 text-sm">
                Connect hypervisors to view their status and configuration
              </p>
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
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No Recent Events</p>
              <p className="text-gray-400 text-sm">
                System events and notifications will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
