import axios from 'axios';

export interface ModrinthProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_url: string | null;
  author?: string;
  project_type: string;
  downloads: number;
  followers: number;
  categories: string[];
  game_versions: string[];
}

const API_BASE = 'https://api.modrinth.com/v2';

export const fetchRandomMod = async (): Promise<ModrinthProject> => {
  // Use a timestamp to prevent caching if the browser/network is aggressive
  const response = await axios.get<ModrinthProject[]>(`${API_BASE}/projects_random`, {
    params: {
      count: 1,
      _t: new Date().getTime()
    }
  });

  if (response.data.length === 0) {
    throw new Error('No mods found');
  }

  return response.data[0];
};

export const getModUrl = (project: ModrinthProject) => {
  return `https://modrinth.com/${project.project_type}/${project.slug}`;
};
