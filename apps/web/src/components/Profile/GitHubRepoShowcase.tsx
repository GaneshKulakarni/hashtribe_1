import { useState, useEffect } from 'react';
import { GitHubService } from '@/services/githubService';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  archived: boolean;
  fork: boolean;
}

interface GitHubRepoShowcaseProps {
  username: string;
  maxRepos?: number;
}

export const GitHubRepoShowcase: React.FC<GitHubRepoShowcaseProps> = ({ username, maxRepos = 6 }) => {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRepositories();
  }, [username]);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const githubService = GitHubService.getInstance();
      const repos = await githubService.fetchGitHubRepositories(username, maxRepos);
      
      // Filter out forks and archived repos, sort by stars
      const filteredRepos = repos
        .filter(repo => !repo.fork && !repo.archived)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, maxRepos);
      
      setRepositories(filteredRepos);
    } catch (err) {
      console.error('Error fetching GitHub repositories:', err);
      setError('Failed to load GitHub repositories');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string | null) => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'C++': '#f34b7d',
      'C': '#555555',
      'C#': '#178600',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Shell': '#89e051',
      'Vue': '#41b883',
      'React': '#61dafb'
    };
    return colors[language || ''] || '#959da5';
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-6">GitHub Repositories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 animate-pulse">
              <div className="h-4 bg-zinc-700 rounded mb-2"></div>
              <div className="h-3 bg-zinc-700 rounded mb-4"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-zinc-700 rounded w-12"></div>
                <div className="h-3 bg-zinc-700 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-6">GitHub Repositories</h3>
        <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
          <p className="text-zinc-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-6">GitHub Repositories</h3>
        <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
          <p className="text-zinc-400 text-sm">No public repositories found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-6">GitHub Repositories</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repositories.map((repo) => (
          <div 
            key={repo.id} 
            className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/30 hover:border-zinc-600 transition-all hover:bg-zinc-800/50"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-zinc-100 font-semibold text-sm truncate pr-2">
                {repo.name}
              </h4>
              <a 
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
            
            {repo.description && (
              <p className="text-zinc-400 text-xs mb-3 line-clamp-2">
                {repo.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <div className="flex items-center gap-3">
                {repo.language && (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    ></div>
                    <span>{repo.language}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                  </svg>
                  <span>{repo.stargazers_count}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.128 19.825c0 1.131-.902 2.048-2.048 2.048s-2.048-.917-2.048-2.048.902-2.048 2.048-2.048 2.048.917 2.048 2.048zm6.464-2.112c-1.131 0-2.048.917-2.048 2.048s.917 2.048 2.048 2.048 2.048-.917 2.048-2.048-.917-2.048-2.048-2.048zm-2.336-6.88c0 1.131-.902 2.048-2.048 2.048s-2.048-.917-2.048-2.048.902-2.048 2.048-2.048 2.048.917 2.048 2.048zm8.032-2.112c-1.131 0-2.048.917-2.048 2.048s.917 2.048 2.048 2.048 2.048-.917 2.048-2.048-.917-2.048-2.048-2.048zm-3.168-6.88c0 1.131-.902 2.048-2.048 2.048s-2.048-.917-2.048-2.048.902-2.048 2.048-2.048 2.048.917 2.048 2.048zm-9.856-2.112c-1.131 0-2.048.917-2.048 2.048s.917 2.048 2.048 2.048 2.048-.917 2.048-2.048-.917-2.048-2.048-2.048z"/>
                  </svg>
                  <span>{repo.forks_count}</span>
                </div>
              </div>
              
              <span>{formatDate(repo.updated_at)}</span>
            </div>
            
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span 
                    key={topic} 
                    className="px-2 py-0.5 bg-zinc-700/50 text-zinc-400 text-xs rounded"
                  >
                    {topic}
                  </span>
                ))}
                {repo.topics.length > 3 && (
                  <span className="px-2 py-0.5 bg-zinc-700/50 text-zinc-400 text-xs rounded">
                    +{repo.topics.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {repositories.length > 0 && (
        <div className="mt-4 text-center">
          <a 
            href={`https://github.com/${username}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 text-sm hover:text-primary-300 transition-colors"
          >
            View all repositories on GitHub →
          </a>
        </div>
      )}
    </div>
  );
};