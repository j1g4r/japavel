import React, { useState } from 'react';
import { trpc } from '../../utils/trpc';

const Dashboard: React.FC = () => {
  const [tenantId] = useState('current-tenant-id'); // In real app, get from context
  const { data: metrics } = trpc.saas.getMetrics.useQuery();
  const { data: usage } = trpc.saas.getAllUsageSummaries.useQuery({ tenantId });
  const { data: auditLogs } = trpc.saas.getAuditLogs.useQuery({ tenantId, limit: 10 });

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Monitoring</h1>
        <p className="text-gray-500">Real-time insights for Tenant: {tenantId}</p>
      </header>

      {/* Usage Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Resource Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {usage?.map((item) => (
            <div key={item.metric} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500 uppercase">{item.metric}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${item.isOverLimit ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {item.current} <span className="text-xs text-gray-400 font-normal">/ {item.limit === Infinity ? '∞' : item.limit}</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${item.isNearLimit ? 'bg-yellow-400' : item.isOverLimit ? 'bg-red-600' : 'bg-blue-600'}`} 
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audit Logs Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold">Recent Audit Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Actor</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs?.items.map((log) => (
                <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{log.action}</td>
                  <td className="px-6 py-4">{log.actor.email || log.actor.id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      log.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      log.severity === 'error' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">{log.outcome}</td>
                </tr>
              ))}
              {auditLogs?.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No recent audit activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
