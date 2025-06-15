
import { useState } from "react";
import { XenServerOnboarding } from "@/components/xenserver/XenServerOnboarding";
import { VirtualNetworkManagement } from "@/components/networks/VirtualNetworkManagement";
import { VMManagement } from "@/components/vms/VMManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface XenServerHost {
  id: string;
  name: string;
  managementIp: string;
  status: 'connecting' | 'connected' | 'error';
  openVSwitchVersion?: string;
  virtualSwitches?: string[];
}

interface VirtualNetwork {
  id: string;
  name: string;
  vxlanId: number;
  subnet: string;
  description: string;
  connectedHosts: string[];
  activeVMs: number;
  status: 'active' | 'provisioning' | 'error';
  created: Date;
}

export const SwitchManagement = () => {
  const [hosts, setHosts] = useState<XenServerHost[]>([]);
  const [networks, setNetworks] = useState<VirtualNetwork[]>([]);

  const connectedHosts = hosts.filter(host => host.status === 'connected');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Network Infrastructure Management</h1>
        <p className="text-gray-600 mt-1">Manage XenServer hosts, virtual networks, and VM connectivity</p>
      </div>

      <Tabs defaultValue="hosts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hosts">XenServer Hosts</TabsTrigger>
          <TabsTrigger value="networks" disabled={connectedHosts.length < 2}>
            Virtual Networks ({networks.length})
          </TabsTrigger>
          <TabsTrigger value="vms" disabled={connectedHosts.length === 0}>
            Virtual Machines
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hosts">
          <XenServerOnboarding 
            hosts={hosts} 
            setHosts={setHosts}
          />
        </TabsContent>

        <TabsContent value="networks">
          <VirtualNetworkManagement 
            hosts={connectedHosts}
            networks={networks}
            setNetworks={setNetworks}
          />
        </TabsContent>

        <TabsContent value="vms">
          <VMManagement 
            networks={networks.filter(n => n.status === 'active')}
            hosts={connectedHosts}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
