import { supabase } from '@/lib/supabase';

export interface GitHubUserData {
  login: string;
  id: number;
  name: string | null;
  email: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  archived: boolean;
  fork: boolean;
}

export interface GitHubLanguageStats {
  [language: string]: number;
}

export interface EnhancedGitHubProfile {
  user: GitHubUserData;
  repositories: GitHubRepository[];
  topLanguages: string[];
  totalStars: number;
  totalForks: number;
  skills: string[];
  achievements: string[];
}

export class GitHubService {
  private static instance: GitHubService;
  
  private constructor() {}
  
  static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  /**
   * Get the current user's GitHub access token from Supabase
   */
  private async getGitHubAccessToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.provider_token) {
        console.log('No GitHub provider token found');
        return null;
      }
      
      return session.provider_token;
    } catch (error) {
      console.error('Error getting GitHub access token:', error);
      return null;
    }
  }

  /**
   * Fetch GitHub user data using the access token
   */
  async fetchGitHubUserData(): Promise<GitHubUserData | null> {
    const accessToken = await this.getGitHubAccessToken();
    
    if (!accessToken) {
      return null;
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'HashTribe/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const userData = await response.json();
      return userData as GitHubUserData;
    } catch (error) {
      console.error('Error fetching GitHub user data:', error);
      return null;
    }
  }

  /**
   * Fetch user's repositories
   */
  async fetchGitHubRepositories(username: string, perPage: number = 100): Promise<GitHubRepository[]> {
    const accessToken = await this.getGitHubAccessToken();
    
    if (!accessToken) {
      return [];
    }

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&sort=updated`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'HashTribe/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos = await response.json();
      return repos as GitHubRepository[];
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      return [];
    }
  }

  /**
   * Fetch language statistics from repositories
   */
  async fetchLanguageStats(username: string): Promise<GitHubLanguageStats> {
    const repos = await this.fetchGitHubRepositories(username);
    const languageStats: GitHubLanguageStats = {};

    repos.forEach(repo => {
      if (repo.language && !repo.fork && !repo.archived) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
    });

    return languageStats;
  }

  /**
   * Generate skills based on GitHub data
   */
  generateSkillsFromGitHub(repos: GitHubRepository[], languages: GitHubLanguageStats): string[] {
    const skills: string[] = [];
    
    // Add top languages as skills
    const topLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lang]) => lang);
    
    skills.push(...topLanguages);

    // Add popular technologies/frameworks based on repo names and topics
    const techKeywords = [
      'react', 'vue', 'angular', 'svelte',
      'node', 'express', 'fastify', 'nestjs',
      'python', 'django', 'flask', 'fastapi',
      'java', 'spring', 'kotlin',
      'go', 'rust', 'typescript', 'javascript',
      'docker', 'kubernetes', 'aws', 'gcp', 'azure'
    ];

    repos.forEach(repo => {
      const repoText = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')}`.toLowerCase();
      
      techKeywords.forEach(keyword => {
        if (repoText.includes(keyword) && !skills.includes(keyword)) {
          skills.push(keyword);
        }
      });
    });

    return skills.slice(0, 10); // Limit to top 10 skills
  }

  /**
   * Generate achievements based on GitHub activity
   */
  generateAchievementsFromGitHub(userData: GitHubUserData, repos: GitHubRepository[]): string[] {
    const achievements: string[] = [];

    // Follower milestones
    if (userData.followers >= 1000) achievements.push('GitHub Influencer');
    else if (userData.followers >= 100) achievements.push('Community Builder');
    else if (userData.followers >= 10) achievements.push('Growing Following');

    // Repository milestones
    if (userData.public_repos >= 50) achievements.push('Prolific Creator');
    else if (userData.public_repos >= 20) achievements.push('Active Developer');
    else if (userData.public_repos >= 5) achievements.push('Open Source Contributor');

    // Star milestones
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    if (totalStars >= 1000) achievements.push('Star Collector');
    else if (totalStars >= 100) achievements.push('Popular Projects');
    else if (totalStars >= 10) achievements.push('Recognized Work');

    // Special achievements
    const hasOriginalRepos = repos.some(repo => !repo.fork && repo.stargazers_count > 5);
    if (hasOriginalRepos) achievements.push('Original Creator');

    const hasPopularRepo = repos.some(repo => repo.stargazers_count >= 100);
    if (hasPopularRepo) achievements.push('Hit Maker');

    const contributesToOthers = repos.some(repo => repo.fork && repo.stargazers_count > 0);
    if (contributesToOthers) achievements.push('Team Player');

    return achievements;
  }

  /**
   * Fetch complete enhanced GitHub profile
   */
  async fetchEnhancedGitHubProfile(): Promise<EnhancedGitHubProfile | null> {
    const userData = await this.fetchGitHubUserData();
    
    if (!userData) {
      return null;
    }

    try {
      const [repositories, languageStats] = await Promise.all([
        this.fetchGitHubRepositories(userData.login),
        this.fetchLanguageStats(userData.login)
      ]);

      const topLanguages = Object.entries(languageStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([lang]) => lang);

      const skills = this.generateSkillsFromGitHub(repositories, languageStats);
      const achievements = this.generateAchievementsFromGitHub(userData, repositories);
      
      const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);

      return {
        user: userData,
        repositories: repositories.slice(0, 10), // Top 10 repos
        topLanguages,
        totalStars,
        totalForks,
        skills,
        achievements
      };
    } catch (error) {
      console.error('Error fetching enhanced GitHub profile:', error);
      return {
        user: userData,
        repositories: [],
        topLanguages: [],
        totalStars: 0,
        totalForks: 0,
        skills: [],
        achievements: []
      };
    }
  }

  /**
   * Update user profile with GitHub data
   */
  async updateUserProfileWithGitHubData(): Promise<boolean> {
    try {
      const enhancedProfile = await this.fetchEnhancedGitHubProfile();
      
      if (!enhancedProfile) {
        return false;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return false;
      }

      // Prepare profile updates
      const profileUpdates = {
        full_name: enhancedProfile.user.name || enhancedProfile.user.login,
        display_name: enhancedProfile.user.name || enhancedProfile.user.login,
        bio: enhancedProfile.user.bio || `GitHub developer with ${enhancedProfile.user.public_repos} repositories`,
        avatar_url: enhancedProfile.user.avatar_url,
        github_username: enhancedProfile.user.login,
        github_id: enhancedProfile.user.id,
        skills: enhancedProfile.skills,
        badges: enhancedProfile.achievements,
        activity_stats: {
          posts: 0,
          comments: 0,
          tribes: 0,
          joined_at: enhancedProfile.user.created_at,
          github_stars: enhancedProfile.totalStars,
          github_repos: enhancedProfile.user.public_repos,
          github_followers: enhancedProfile.user.followers
        }
      };

      // Update the user profile
      const { error } = await supabase
        .from('users')
        .update(profileUpdates)
        .eq('id', session.user.id);

      if (error) {
        console.error('Error updating user profile with GitHub data:', error);
        return false;
      }

      console.log('Successfully updated user profile with GitHub data');
      return true;
    } catch (error) {
      console.error('Error in updateUserProfileWithGitHubData:', error);
      return false;
    }
  }
}