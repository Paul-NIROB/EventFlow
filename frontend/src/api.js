const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { detail: await response.text() || 'Server Error' };
    }

    if (!response.ok) {
      let errorMessage = 'Something went wrong';
      if (data.detail) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
        } else {
          errorMessage = JSON.stringify(data.detail);
        }
      }
      throw new Error(errorMessage);
    }

    return data;
  },

  auth: {
    login: (credentials) => api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData) => api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    me: () => api.request('/auth/me'),
  },

  events: {
    list: (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.type) query.append('type', params.type);
      if (params.date_from) query.append('date_from', params.date_from);
      if (params.date_to) query.append('date_to', params.date_to);
      
      return api.request(`/events?${query.toString()}`);
    },
    get: (id) => api.request(`/events/${id}`),
    create: (eventData) => api.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
    delete: (id) => api.request(`/events/${id}`, {
      method: 'DELETE',
    }),
    register: (id) => api.request(`/events/${id}/register`, {
      method: 'POST',
    }),
    unregister: (id) => api.request(`/events/${id}/register`, {
      method: 'DELETE',
    }),
    myRegistrations: () => api.request('/my/registrations'),
  },
};

export default api;
