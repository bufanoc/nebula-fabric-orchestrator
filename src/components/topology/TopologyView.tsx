
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Server, Wifi, Cable } from "lucide-react";

export const TopologyView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Topology</h1>
          <p className="text-gray-600 mt-1">Visualize your distributed virtual network infrastructure</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Topology</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Refresh View</Button>
        </div>
      </div>

      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Network className="mr-2 h-5 w-5" />
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
                      <Network className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <Network className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <Cable className="h-8 w-8 text-gray-400 rotate-90" />
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <Wifi className="h-8 w-8 text-green-600" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">DVSC Controller</Badge>
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
                      <Network className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <Network className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mt-8">
                Interactive topology visualization will be enhanced with canvas-based diagrams
              </p>
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
              <div className="flex items-center justify-between">
                <span className="text-sm">Controller ↔ XenServer-01</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Controller ↔ XenServer-02</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Controller ↔ XenServer-03</span>
                <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
              </div>
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
                <span className="text-sm font-medium">2.4 Gbps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">East-West</span>
                <span className="text-sm font-medium">1.8 Gbps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Inter-Tenant</span>
                <span className="text-sm font-medium">0.6 Gbps</span>
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
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Packet Loss</span>
                <span className="text-sm font-medium">0.01%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Latency</span>
                <span className="text-sm font-medium">2.3ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
