
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Cpu, HardDrive, Wifi } from "lucide-react";

export const SwitchManagement = () => {
  const switches = [
    {
      id: "vswitch-001",
      name: "Production-Main",
      tenant: "Production",
      hypervisor: "XenServer-01",
      ports: 24,
      activePorts: 18,
      status: "active",
      uptime: "15 days",
      throughput: "2.4 Gbps"
    },
    {
      id: "vswitch-002",
      name: "Dev-Network",
      tenant: "Development",
      hypervisor: "XenServer-02",
      ports: 16,
      activePorts: 12,
      status: "active",
      uptime: "8 days",
      throughput: "1.2 Gbps"
    },
    {
      id: "vswitch-003",
      name: "DMZ-Switch",
      tenant: "Production",
      hypervisor: "XenServer-03",
      ports: 32,
      activePorts: 28,
      status: "warning",
      uptime: "22 days",
      throughput: "3.1 Gbps"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Virtual Switch Management</h1>
          <p className="text-gray-600 mt-1">Configure and monitor distributed virtual switches</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create Virtual Switch
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {switches.map((vswitch) => (
          <Card key={vswitch.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Network className="mr-2 h-5 w-5 text-blue-600" />
                  {vswitch.name}
                </CardTitle>
                <Badge 
                  variant={vswitch.status === 'active' ? 'default' : 'secondary'}
                  className={
                    vswitch.status === 'active' ? 'bg-green-100 text-green-800' :
                    vswitch.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {vswitch.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Tenant</p>
                    <p className="font-medium">{vswitch.tenant}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Hypervisor</p>
                    <p className="font-medium">{vswitch.hypervisor}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cpu className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">Ports</span>
                    </div>
                    <span className="text-sm font-medium">
                      {vswitch.activePorts}/{vswitch.ports}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wifi className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">Throughput</span>
                    </div>
                    <span className="text-sm font-medium">{vswitch.throughput}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HardDrive className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">Uptime</span>
                    </div>
                    <span className="text-sm font-medium">{vswitch.uptime}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(vswitch.activePorts / vswitch.ports) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Port Utilization: {Math.round((vswitch.activePorts / vswitch.ports) * 100)}%
                </p>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Monitor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
