
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Server, Wifi, Cable, Network } from "lucide-react";

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
            <GitBranch className="mr-2 h-5 w-5" />
            Network Topology Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <div className="relative h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Wifi className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No Network Infrastructure Detected</p>
              <p className="text-gray-400 text-sm">
                Connect hypervisors and virtual switches to visualize your network topology
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
            <div className="text-center py-8">
              <p className="text-gray-500">No connections available</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Traffic Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">No traffic data available</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Network Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">No health data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
