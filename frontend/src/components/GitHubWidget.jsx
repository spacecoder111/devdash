import { Activity, GitPullRequest, AlertCircle } from 'lucide-react';

function GitHubWidget({ data, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading GitHub data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-red-500">Failed to load GitHub data</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">GitHub</h2>
        <Activity className="text-gray-400" size={20} />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
          <span className="text-sm text-gray-600 dark:text-gray-300">Total tasks</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data?.count || 0}</span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Issues</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data?.issues?.slice(0, 3).map(issue => (
              <a key={issue.id} href={issue.html_url} target="_blank" rel="noopener noreferrer"
                 className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 truncate">
                • {issue.title}
              </a>
            ))}
            {data?.issues?.length === 0 && <p className="text-sm text-gray-400">No open issues assigned to you</p>}
            {data?.message && <p className="text-sm text-gray-400">{data.message}</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <GitPullRequest size={16} className="text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pull Requests</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data?.pullRequests?.slice(0, 3).map(pr => (
              <a key={pr.id} href={pr.html_url} target="_blank" rel="noopener noreferrer"
                 className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 truncate">
                • {pr.title}
              </a>
            ))}
            {data?.pullRequests?.length === 0 && <p className="text-sm text-gray-400">No open PRs assigned to you</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GitHubWidget;
