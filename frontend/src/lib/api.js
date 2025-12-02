const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  return data;
};

// Helper function to build query string from params object
const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const api = {
  async signup(data) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async login(data) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  // Profile CRUD operations
  async fetchProfile() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  async updateProfile(data) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  async getPublicProfile(userId) {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async deleteAccount() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  // ==========================================
  // ITEMS CRUD OPERATIONS
  // ==========================================

  /**
   * Get paginated items for the logged-in user
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 6)
   * @param {string} params.material - Filter by material (optional)
   * @param {string} params.sortBy - Sort by 'date' | 'score' | 'ideas' (default: 'date')
   * @param {string} params.search - Search by title (optional)
   */
  async getMyItems(params = {}) {
    const queryString = buildQueryString(params);
    const response = await fetch(`${API_BASE_URL}/items/me${queryString}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  /**
   * Create a new item
   * @param {Object} data - Item data
   * @param {string} data.title - Item title (required)
   * @param {string} data.material - Item material (required)
   * @param {string} data.imageUrl - Image URL (optional)
   */
  async createItem(data) {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  /**
   * Update an existing item
   * @param {string} itemId - Item ID
   * @param {Object} data - Update data
   */
  async updateItem(itemId, data) {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  /**
   * Delete an item
   * @param {string} itemId - Item ID
   */
  async deleteItem(itemId) {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  /**
   * Get a single item by ID
   * @param {string} itemId - Item ID
   */
  async getItem(itemId) {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

