import axios from 'axios';

const API_BASE_URL = 'http://localhost:8070/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export const projetService = {
  getAll: () => api.get('/projets'),
  getById: (id: number) => api.get(`/projets/${id}`),
  create: (data: any) => api.post('/projets', data),
  update: (id: number, data: any) => api.put(`/projets/${id}`, data),
  delete: (id: number) => api.delete(`/projets/${id}`),
};

export const chantierService = {
  getAll: () => api.get('/chantiers'),
  getById: (id: number) => api.get(`/chantiers/${id}`),
  create: (data: any) => api.post('/chantiers', data),
  update: (id: number, data: any) => api.put(`/chantiers/${id}`, data),
  delete: (id: number) => api.delete(`/chantiers/${id}`),
};

export const materiauService = {
  getAll: () => api.get('/materiaux'),
  getById: (id: number) => api.get(`/materiaux/${id}`),
  create: (data: any) => api.post('/materiaux', data),
  update: (id: number, data: any) => api.put(`/materiaux/${id}`, data),
  delete: (id: number) => api.delete(`/materiaux/${id}`),
};

export const fournisseursService = {
  getAll: () => api.get('/fournisseurs'),
  getById: (id: number) => api.get(`/fournisseurs/${id}`),
  create: (data: any) => api.post('/fournisseurs', data),
  update: (id: number, data: any) => api.put(`/fournisseurs/${id}`, data),
  delete: (id: number) => api.delete(`/fournisseurs/${id}`),
};

export const incidentsService = {
  getAll: () => api.get('/incidents'),
  getById: (id: number) => api.get(`/incidents/${id}`),
  create: (data: any) => api.post('/incidents', data),
  update: (id: number, data: any) => api.put(`/incidents/${id}`, data),
  delete: (id: number) => api.delete(`/incidents/${id}`),
};

export const planningService = {
  getAll: () => api.get('/plannings'),
  getById: (id: number) => api.get(`/plannings/${id}`),
  create: (data: any) => api.post('/plannings', data),
  update: (id: number, data: any) => api.put(`/plannings/${id}`, data),
  delete: (id: number) => api.delete(`/plannings/${id}`),
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  getById: (id: number) => api.get(`/notifications/${id}`),
  create: (data: any) => api.post('/notifications', data),
  update: (id: number, data: any) => api.put(`/notifications/${id}`, data),
  delete: (id: number) => api.delete(`/notifications/${id}`),
};

export default api;
