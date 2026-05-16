import { Cpu, HardDrive, Clock } from 'lucide-react';

function SystemWidget({ data }) {
  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading system stats...</div>
      </div>
    );
  }

  const memUsagePercent = Math.round(((data.memory.total - data.memory.free) / data.memory.total) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Health</h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">CPU Load</span>
          </div>
          <span className="text-sm font-medium">{data.cpu.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Memory</span>
          </div>
          <span className="text-sm font-medium">{memUsagePercent}% used</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${memUsagePercent}%` }}></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Uptime</span>
          </div>
          <span className="text-sm font-medium">{data.uptime} hours</span>
        </div>
      </div>
    </div>
  );
}

export default SystemWidget;