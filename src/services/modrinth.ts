import axios from 'axios';

const API_BASE_URL = 'https://api.modrinth.com/v2';

export interface ModrinthProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_url: string;
  project_type: string;
  downloads: number;
  followers: number;
  categories: string[];
  game_versions: string[];
  loaders?: string[];
}

export const fetchRandomMod = async (filters: { project_type?: string, category?: string } = {}): Promise<ModrinthProject> => {
  const { project_type = 'any', category = 'any' } = filters;
  const facets: string[][] = [];

  if (project_type && project_type !== 'any') {
    facets.push([`project_type:${project_type}`]);
  }

  if (category && category !== 'any') {
    facets.push([`categories:${category}`]);
  }

  // If no filters, use the projects_random endpoint for efficiency
  if (facets.length === 0) {
    const response = await axios.get(`${API_BASE_URL}/projects_random`, {
      params: {
        count: 1,
        // Add a timestamp to bypass any caching
        _t: new Date().getTime()
      }
    });
    return response.data[0];
  }

  // If filters are applied, use the search endpoint with a random offset
  const searchParams = {
    facets: JSON.stringify(facets),
    limit: 1
  };

  const initialSearch = await axios.get(`${API_BASE_URL}/search`, { params: searchParams });
  const totalHits = initialSearch.data.total_hits;

  if (totalHits === 0) {
    throw new Error('No projects found with these filters');
  }

  // Step 2: Fetch a random hit using offset
  const randomOffset = Math.floor(Math.random() * Math.min(totalHits, 10000));
  const randomSearch = await axios.get(`${API_BASE_URL}/search`, {
    params: {
      ...searchParams,
      offset: randomOffset,
      _t: new Date().getTime()
    }
  });

  const hit = randomSearch.data.hits[0];

  // Map search hit to ModrinthProject interface
  return {
    id: hit.project_id,
    slug: hit.slug,
    title: hit.title,
    description: hit.description,
    icon_url: hit.icon_url,
    project_type: hit.project_type,
    downloads: hit.downloads,
    followers: hit.follows,
    categories: hit.categories,
    game_versions: hit.versions || [],
  };
};

export const getModUrl = (mod: ModrinthProject) => {
  return `https://modrinth.com/${mod.project_type}/${mod.slug}`;
};
