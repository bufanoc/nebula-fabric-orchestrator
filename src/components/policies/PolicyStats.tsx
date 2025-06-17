
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Policy, POLICY_TYPES } from "@/types/policy";

interface PolicyStatsProps {
  policies: Policy[];
}

export const PolicyStats = ({ policies }: PolicyStatsProps) => {
  const getTypeStats = () => {
    return POLICY_TYPES.map(type => ({
      type,
      count: policies.filter(p => p.type === type && p.status === 'active').length,
      color: type === 'Access Control' ? 'bg-red-100 text-red-800' :
             type === 'Quality of Service' ? 'bg-blue-100 text-blue-800' :
             type === 'Network Isolation' ? 'bg-green-100 text-green-800' :
             'bg-yellow-100 text-yellow-800'
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {getTypeStats().map((type, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{type.type}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{type.count}</p>
              </div>
              <Badge className={type.color}>Active</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
