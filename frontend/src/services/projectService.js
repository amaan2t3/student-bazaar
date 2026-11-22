import api from './api';

export const normalizeProject = (project) => {
  const seller = Array.isArray(project.seller) ? project.seller[0] : project.seller || {};
  const packageIncludes = project.packageIncludes ?? project.package_includes ?? [];

  return {
    ...project,
    pricePKR: Number(project.pricePKR ?? project.price_pkr ?? 0),
    rating: Number(project.rating ?? project.average_rating ?? 0),
    reviewsCount: Number(project.reviewsCount ?? project.ratings_count ?? 0),
    detailedDescription: project.detailedDescription ?? project.detailed_description ?? '',
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
    screenshots: Array.isArray(project.screenshots) ? project.screenshots.filter(Boolean) : [],
    packageIncludes: Array.isArray(packageIncludes)
      ? packageIncludes.map((item) => typeof item === 'string' ? { name: item, ready: true } : item)
      : [],
    systemRequirements: project.systemRequirements ?? project.system_prerequisites ?? [],
    installationSummary: project.installationSummary ?? project.installation_guide ?? '',
    seller: {
      id: seller.id ?? project.seller_id,
      name: seller.name ?? seller.full_name ?? '',
      university: seller.university ?? 'University not specified',
      rating: Number(seller.rating ?? project.average_rating ?? 0),
      salesCount: Number(seller.salesCount ?? project.total_sales_count ?? 0),
      avatar: seller.avatar ?? seller.avatar_url ?? null
    }
  };
};

export const projectService = {
  // Public catalog query
  async getProjects(params = {}) {
    try {
      const response = await api.get('/projects', { params });
      return {
        ...response.data,
        data: (response.data.data || []).map(normalizeProject)
      };
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load projects.';
    }
  },

  // Public project details
  async getProjectBySlug(slug) {
    try {
      const response = await api.get(`/projects/detail/${slug}`);
      return {
        ...response.data,
        data: response.data.data ? normalizeProject(response.data.data) : null
      };
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load project details.';
    }
  },

  // Seller creates new listing
  async createProject(projectData) {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to submit project listing.';
    }
  },

  // Seller gets own listings
  async getSellerProjects() {
    try {
      const response = await api.get('/projects/seller/my-projects');
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load seller projects.';
    }
  },

  // Admin moderation queue
  async getAdminModerationQueue() {
    try {
      const response = await api.get('/projects/admin/moderation');
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || (
        err.request
          ? `Cannot reach the API at ${api.defaults.baseURL}. Check that the backend is running and allows this frontend origin.`
          : err.message || 'Failed to load moderation queue.'
      );
    }
  },

  async getAdminProject(id) {
    try {
      const response = await api.get(`/projects/admin/${id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load project details.';
    }
  },

  // Admin approves or rejects
  async moderateProject(id, status, moderation_feedback) {
    try {
      const response = await api.put(`/projects/admin/${id}/moderate`, {
        status,
        moderation_feedback
      });
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update project status.';
    }
  },

  async updateAdminProject(id, projectData) {
    try {
      const response = await api.put(`/projects/admin/${id}`, projectData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update project.';
    }
  },

  async deleteAdminProject(id) {
    try {
      const response = await api.delete(`/projects/admin/${id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to delete project.';
    }
  }
};

export default projectService;
