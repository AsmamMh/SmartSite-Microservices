import axios, { AxiosResponse, Method } from 'axios';

const API_BASE_URL = 'http://localhost:8070';

let tokenSupplier: (() => Promise<string | undefined>) | null = null;

export const registerTokenSupplier = (supplier: () => Promise<string | undefined>) => {
  tokenSupplier = supplier;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (tokenSupplier) {
    const token = await tokenSupplier();
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      } as typeof config.headers;
    }
  }

  return config;
});

const shouldTryFallback = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  return status === 404 || status === 502 || status === 503;
};

const requestWithFallback = async <T>(
    method: Method,
    paths: string[],
    data?: unknown
): Promise<AxiosResponse<T>> => {
  let lastError: unknown;

  for (let index = 0; index < paths.length; index += 1) {
    const path = paths[index];
    try {
      return await api.request<T>({ method, url: path, data });
    } catch (error) {
      lastError = error;
      const canTryNext = index < paths.length - 1 && shouldTryFallback(error);
      if (!canTryNext) {
        throw error;
      }
    }
  }

  throw lastError;
};

// =============================================
// USER SERVICE
// =============================================
export const userService = {
  getAll: () => requestWithFallback('get', ['/api/users']),
  getById: (id: number) => requestWithFallback('get', [`/api/users/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/users'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/users/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/users/${id}`]),
};

// =============================================
// PROJET SERVICE
// =============================================
export const projetService = {
  getAll: () => requestWithFallback('get', ['/api/projets']),
  getById: (id: number) => requestWithFallback('get', [`/api/projets/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/projets'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/projets/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/projets/${id}`]),
};

// =============================================
// CHANTIER SERVICE
// =============================================
export const chantierService = {
  getAll: () => requestWithFallback('get', ['/api/chantiers']),
  getById: (id: number) => requestWithFallback('get', [`/api/chantiers/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/chantiers'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/chantiers/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/chantiers/${id}`]),
};

// =============================================
// MATERIAU SERVICE (COMPLET - AVEC IA)
// =============================================
export const materiauService = {
  // ========== CRUD ==========
  getAll: () => requestWithFallback('get', ['/materiaux', '/api/materiaux']),
  getById: (id: number) => requestWithFallback('get', [`/materiaux/${id}`, `/api/materiaux/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/materiaux', '/api/materiaux'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/materiaux/${id}`, `/api/materiaux/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/materiaux/${id}`, `/api/materiaux/${id}`]),

  // ========== Consommation ==========
  consommer: (id: number, quantite: number, chantierId: number) =>
      requestWithFallback('post', [`/materiaux/${id}/consommer?quantite=${quantite}&chantierId=${chantierId}`]),

  // ========== Historique ==========
  getHistorique: (id: number) =>
      requestWithFallback('get', [`/materiaux/${id}/historique`]),

  // ========== Alertes Stock ==========
  getAlertes: () =>
      requestWithFallback('get', ['/materiaux/alertes']),

  // ========== IA Prédiction ==========
  getPrediction: (id: number) =>
      requestWithFallback('get', [`/materiaux/${id}/prediction`]),

  // ========== Statistiques Globales ==========
  getStatistiques: () =>
      requestWithFallback('get', ['/materiaux/statistiques']),

  // ========== Chantiers Externes (Feign Client) ==========
  getChantiersExternes: () =>
      requestWithFallback('get', ['/materiaux/chantiers-externes']),
};

// =============================================
// FOURNISSEURS SERVICE
// =============================================
export const fournisseursService = {
  getAll: () => requestWithFallback('get', ['/api/fournisseurs']),
  getById: (id: number) => requestWithFallback('get', [`/api/fournisseurs/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/fournisseurs'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/fournisseurs/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/fournisseurs/${id}`]),
};

// =============================================
// INCIDENTS SERVICE
// =============================================
export const incidentsService = {
  getAll: () => requestWithFallback('get', ['/api/incidents']),
  getById: (id: number) => requestWithFallback('get', [`/api/incidents/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/incidents'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/incidents/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/incidents/${id}`]),
};

// =============================================
// PLANNING SERVICE
// =============================================
export const planningService = {
  getAll: () => requestWithFallback('get', ['/api/project']),
  getById: (id: number) => requestWithFallback('get', [`/api/project/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/project'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/project/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/project/${id}`]),
};

// =============================================
// TASK SERVICE
// =============================================
export const taskService = {
  getByProject: (projectId: number) => requestWithFallback('get', [`/api/task/project/${projectId}`]),
  getById: (id: number) => requestWithFallback('get', [`/api/task/${id}`]),
  create: (projectId: number, data: unknown) => requestWithFallback('post', [`/api/task/${projectId}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/task/${id}`]),
};

// =============================================
// TASK ASSIGN SERVICE
// =============================================
export const taskAssignService = {
  create: (taskId: number, data: unknown) => requestWithFallback('post', [`/api/taskassigne/${taskId}`], data),
  getByTask: (taskId: number) => requestWithFallback('get', [`/api/taskassigne/${taskId}`]),
};

// =============================================
// NOTIFICATION SERVICE
// =============================================
export const notificationService = {
  getAll: () => requestWithFallback('get', ['/api/notifications']),
  getById: (id: number) => requestWithFallback('get', [`/api/notifications/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/notifications'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/notifications/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/notifications/${id}`]),
};

export default api;