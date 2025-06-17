
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export const MonitoringView = () => {
  const [metrics, setMetrics] = useState({
    totalThroughput: "0 Gbps",
    activeConnections: "0",
    packetLoss: "0.00%",
    avgLatency: "0ms"
  });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [switches, setSwitches] = useState<any[]>([]);

  useEffect(() => {
    const updateMetrics = () => {
      const storedSwitches = JSON.parse(localStorage.getItem('dvsc_switches') || '[]');
      const storedEvents = JSON.parse(localStorage.getItem('dvsc_events') || '[]');
      
      setSwitches(storedSwitches);
      setAlerts(storedEvents.slice(0, 3));

      // Calculate metrics based on switches
      const totalPorts = storedSwitches.reduce((total: number, sw: any) => total + (sw.activePorts || 0), 0);
      
      setMetrics({
        totalThroughput: `${(storedSwitches.length * 0.8).toFixed(1)} Gbps`,
        activeConnections: totalPorts.toString(),
        packetLoss: storedSwitches.length > 3 ? "0.02%" : "0.01%",
        avgLatency: `${(2 + storedSwitches.length * 0.1).toFixed(1)}ms`
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const exportReports = () => {
    const reportData = {
      metrics,
      switches: switches.length,
      alerts: alerts.length,
      generatedAt: new Date().toISOString(),
      healthStatus: getSystemHealth()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSystemHealth = () => {
    if (switches.length === 0) return { status: "Healthy", color: "bg-green-100 text-green-800" };
    if (switches.length > 5) return { status: "Warning", color: "bg-yellow-100 text-yellow-800" };
    return { status: "Healthy", color: "bg-green-100 text-green-800" };
  };

  const metricItems = [
    { 
      name: "Total Throughput", 
      value: metrics.totalThroughput, 
      change: switches.length > 0 ? "+12%" : "0%", 
      trend: "up" 
    },
    { 
      name: "Active Connections", 
      value: metrics.activeConnections, 
      change: switches.length > 0 ? "+5%" : "0%", 
      trend: "up" 
    },
    { 
      name: "Packet Loss", 
      value: metrics.packetLoss, 
      change: switches.length > 3 ? "+0.01%" : "-0.005%", 
      trend: switches.length > 3 ? "up" : "down" 
    },
    { 
      name: "Average Latency", 
      value: metrics.avgLatency, 
      change: switches.length > 0 ? "+0.1ms" : "0ms", 
      trend: "up" 
    },
  ];

  const systemHealth = getSystemHealth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportReports}>Export Reports</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Configure Alerts</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricItems.map((metric, index) => (
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
                {switches.length > 0 ? (
                  <>
                    <p className="text-gray-500">Performance charts showing:</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {switches.length} switches, {metrics.activeConnections} connections
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500">No data to display</p>
                    <p className="text-sm text-gray-400 mt-2">Create virtual switches to see performance metrics</p>
                  </>
                )}
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
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                    {alert.type === 'info' && <Activity className="h-5 w-5 text-blue-500 mt-0.5" />}
                    {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                    {alert.type === 'error' && <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent alerts</p>
                </div>
              )}
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
              <div className={`w-16 h-16 ${systemHealth.status === 'Healthy' ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                {systemHealth.status === 'Healthy' ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                )}
              </div>
              <h3 className="font-semibold text-gray-900">Network</h3>
              <p className="text-sm text-gray-600 mt-1">
                {switches.length > 0 ? `${switches.length} switches active` : 'No switches configured'}
              </p>
              <Badge className={systemHealth.color}>{systemHealth.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
