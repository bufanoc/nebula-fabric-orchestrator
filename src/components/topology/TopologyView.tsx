
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Server, Wifi, Cable } from "lucide-react";

export const TopologyView = () => {
  const [switches, setSwitches] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<any[]>([]);

  useEffect(() => {
    // Load switches and generate topology data
    const storedSwitches = JSON.parse(localStorage.getItem('dvsc_switches') || '[]');
    setSwitches(storedSwitches);

    // Generate connection status based on switches
    const connections = [
      { name: "Controller ↔ XenServer-01", status: "Connected" },
      { name: "Controller ↔ XenServer-02", status: "Connected" },
      { name: "Controller ↔ XenServer-03", status: storedSwitches.length > 3 ? "Warning" : "Connected" },
    ];
    setConnectionStatus(connections);
  }, []);

  const exportTopology = () => {
    const topologyData = {
      switches,
      connectionStatus,
      exportedAt: new Date().toISOString(),
      hypervisors: ["XenServer-01", "XenServer-02", "XenServer-03"]
    };
    
    const blob = new Blob([JSON.stringify(topologyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `topology-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const refreshView = () => {
    const storedSwitches = JSON.parse(localStorage.getItem('dvsc_switches') || '[]');
    setSwitches(storedSwitches);
    
    // Add refresh event
    const events = JSON.parse(localStorage.getItem('dvsc_events') || '[]');
    events.unshift({
      type: 'info',
      message: 'Network topology view refreshed',
      time: new Date().toLocaleString()
    });
    localStorage.setItem('dvsc_events', JSON.stringify(events.slice(0, 10)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Topology</h1>
          <p className="text-gray-600 mt-1">Visualize your distributed virtual network infrastructure</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportTopology}>Export Topology</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={refreshView}>Refresh View</Button>
        </div>
      </div>

      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center">
            <GitBranch className="mr-2 h-5 w-5" />
            Network Topology Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <div className="relative h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex justify-center space-x-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Server className="h-8 w-8 text-blue-600" />
                  </div>
                  <Badge className="bg-green-100 text-green-800">XenServer-01</Badge>
                  <div className="space-y-1">
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <Wifi className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <Wifi className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {switches.filter(s => s.hypervisor === 'XenServer-01').length} switches
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <Cable className="h-8 w-8 text-gray-400 rotate-90" />
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <Wifi className="h-8 w-8 text-green-600" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">DVSC Controller</Badge>
                  <p className="text-xs text-gray-500">
                    Managing {switches.length} switches
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <Cable className="h-8 w-8 text-gray-400 rotate-90" />
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Server className="h-8 w-8 text-blue-600" />
                  </div>
                  <Badge className="bg-green-100 text-green-800">XenServer-02</Badge>
                  <div className="space-y-1">
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <Wifi className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <Wifi className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {switches.filter(s => s.hypervisor === 'XenServer-02').length} switches
                  </p>
                </div>
              </div>
              
              {switches.length === 0 ? (
                <p className="text-gray-500 text-sm mt-8">
                  No virtual switches configured. Create switches to see topology.
                </p>
              ) : (
                <p className="text-gray-500 text-sm mt-8">
                  Interactive topology showing {switches.length} virtual switches
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {connectionStatus.map((connection, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{connection.name}</span>
                  <Badge className={
                    connection.status === 'Connected' ? 'bg-green-100 text-green-800' :
                    connection.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {connection.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Traffic Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">North-South</span>
                <span className="text-sm font-medium">{(switches.length * 0.4).toFixed(1)} Gbps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">East-West</span>
                <span className="text-sm font-medium">{(switches.length * 0.3).toFixed(1)} Gbps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Inter-Tenant</span>
                <span className="text-sm font-medium">{(switches.length * 0.1).toFixed(1)} Gbps</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Network Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall Health</span>
                <Badge className={switches.length > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                  {switches.length > 5 ? 'Warning' : 'Healthy'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Packet Loss</span>
                <span className="text-sm font-medium">{switches.length > 3 ? '0.02%' : '0.01%'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Latency</span>
                <span className="text-sm font-medium">{(2 + switches.length * 0.1).toFixed(1)}ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
