
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export const MonitoringView = () => {
  const metrics = [
    { name: "Total Throughput", value: "4.8 Gbps", change: "+12%", trend: "up" },
    { name: "Active Connections", value: "1,234", change: "+5%", trend: "up" },
    { name: "Packet Loss", value: "0.01%", change: "-0.005%", trend: "down" },
    { name: "Average Latency", value: "2.3ms", change: "+0.1ms", trend: "up" },
  ];

  const alerts = [
    { id: 1, type: "warning", message: "High port utilization on XenServer-03", time: "5 min ago" },
    { id: 2, type: "info", message: "New policy applied to Production tenant", time: "10 min ago" },
    { id: 3, type: "success", message: "Backup controller synchronized", time: "15 min ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Reports</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Configure Alerts</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`h-4 w-4 mr-1 ${
                      metric.trend === 'up' && metric.name === 'Packet Loss' ? 'text-red-500' :
                      metric.trend === 'up' ? 'text-green-500' : 'text-green-500'
                    }`} />
                    <span className={`text-sm ${
                      metric.trend === 'up' && metric.name === 'Packet Loss' ? 'text-red-600' :
                      'text-green-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Performance charts will be integrated here</p>
                <p className="text-sm text-gray-400 mt-2">Real-time throughput, latency, and utilization metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                  {alert.type === 'info' && <Activity className="h-5 w-5 text-blue-500 mt-0.5" />}
                  {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Controller</h3>
              <p className="text-sm text-gray-600 mt-1">All systems operational</p>
              <Badge className="bg-green-100 text-green-800 mt-2">Healthy</Badge>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Hypervisors</h3>
              <p className="text-sm text-gray-600 mt-1">3/3 connected and responsive</p>
              <Badge className="bg-green-100 text-green-800 mt-2">Online</Badge>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Network</h3>
              <p className="text-sm text-gray-600 mt-1">Minor performance issues</p>
              <Badge className="bg-yellow-100 text-yellow-800 mt-2">Warning</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
