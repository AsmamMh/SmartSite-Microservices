import axios, { AxiosResponse, Method } from 'axios';

const API_BASE_URL = 'http://localhost:8086'; // Changé de 8070 à 8086 (port de service-materiau)

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

// Interceptor pour ajouter le token JWT (Keycloak)
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

// Types pour Matériau
export interface Materiau {
  id: number;
  nom: string;
  localisation: string;
  unite: string;
  quantiteStock: number;
  seuilAlerte: number;
  coutUnitaire: number;
  actif: boolean;
  dateCreation: string;
}

export interface MouvementStock {
  id: number;
  materiau: Materiau;
  type: 'ENTREE' | 'SORTIE';
  quantite: number;
  commentaire: string;
  dateMouvement: string;
}

export interface ChantierResponse {
  id: number;
  nom: string;
  description: string;
}

export interface PredictionRequest {
  materiauId: number;
  heures: number;
}

export interface PredictionResponse {
  materiau: string;
  stockActuel: number;
  consommationParHeure: number;
  heuresPrediction: number;
  prediction: number;
  unite: string;
  alerte: string;
}

export interface Statistiques {
  nombreMateriaux: number;
  valeurStockTotal: number;
  stockFaible: number;
}

// ============================================
// SERVICE MATÉRIAU (COMPLET)
// ============================================
export const materiauService = {
  // CRUD
  getAll: () => requestWithFallback<Materiau[]>('get', ['/materiaux']),
  getById: (id: number) => requestWithFallback<Materiau>('get', [`/materiaux/${id}`]),
  create: (data: Partial<Materiau>) => requestWithFallback<Materiau>('post', ['/materiaux'], data),
  update: (id: number, data: Partial<Materiau>) =>
      requestWithFallback<Materiau>('put', [`/materiaux/${id}`], data),
  delete: (id: number) => requestWithFallback<void>('delete', [`/materiaux/${id}`]),

  // Gestion Stock
  entreeStock: (id: number, quantite: number, commentaire?: string) =>
      requestWithFallback<MouvementStock>('post', [`/materiaux/${id}/entree?quantite=${quantite}&commentaire=${commentaire || ''}`]),
  sortieStock: (id: number, quantite: number, commentaire?: string) =>
      requestWithFallback<MouvementStock>('post', [`/materiaux/${id}/sortie?quantite=${quantite}&commentaire=${commentaire || ''}`]),

  // Métiers Avancés
  getStockFaible: () => requestWithFallback<Materiau[]>('get', ['/materiaux/stock-faible']),
  getStatistiques: () => requestWithFallback<Statistiques>('get', ['/materiaux/statistiques']),
  search: (keyword: string) =>
      requestWithFallback<Materiau[]>('get', [`/materiaux/search?keyword=${keyword}`]),
  filterByLocalisation: (localisation: string) =>
      requestWithFallback<Materiau[]>('get', [`/materiaux/filter/localisation/${localisation}`]),
  getHistorique: (id: number) =>
      requestWithFallback<MouvementStock[]>('get', [`/materiaux/${id}/historique`]),

  // Communication Chantier
  getChantiers: () => requestWithFallback<ChantierResponse[]>('get', ['/materiaux/chantiers']),
  testChantier: () =>
      requestWithFallback<{ status: string; message: string; chantiersTrouves: number }>('get', ['/materiaux/test-chantier']),

  // Prédiction IA
  prediction: (request: PredictionRequest) =>
      requestWithFallback<PredictionResponse>('post', ['/materiaux/prediction'], request),
};

export const userService = {
  getAll: () => requestWithFallback('get', ['/api/users']),
  getById: (id: number) => requestWithFallback('get', [`/api/users/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/users'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/users/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/users/${id}`]),
};

export const projetService = {
  getAll: () => requestWithFallback('get', ['/api/projets']),
  getById: (id: number) => requestWithFallback('get', [`/api/projets/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/projets'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/projets/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/projets/${id}`]),
};

export const chantierService = {
  getAll: () => requestWithFallback('get', ['/api/chantiers']),
  getById: (id: number) => requestWithFallback('get', [`/api/chantiers/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/chantiers'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/chantiers/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/chantiers/${id}`]),
};

export const fournisseursService = {
  getAll: () => requestWithFallback('get', ['/api/fournisseurs']),
  getById: (id: number) => requestWithFallback('get', [`/api/fournisseurs/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/fournisseurs'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/fournisseurs/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/fournisseurs/${id}`]),
};

export const incidentsService = {
  getAll: () => requestWithFallback('get', ['/api/incidents']),
  getById: (id: number) => requestWithFallback('get', [`/api/incidents/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/incidents'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/incidents/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/incidents/${id}`]),
};

export const planningService = {
  getAll: () => requestWithFallback('get', ['/api/project']),
  getById: (id: number) => requestWithFallback('get', [`/api/project/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/project'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/project/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/project/${id}`]),
};

export const taskService = {
  getByProject: (projectId: number) => requestWithFallback('get', [`/api/task/project/${projectId}`]),
  getById: (id: number) => requestWithFallback('get', [`/api/task/${id}`]),
  create: (projectId: number, data: unknown) => requestWithFallback('post', [`/api/task/${projectId}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/task/${id}`]),
};

export const taskAssignService = {
  create: (taskId: number, data: unknown) => requestWithFallback('post', [`/api/taskassigne/${taskId}`], data),
  getByTask: (taskId: number) => requestWithFallback('get', [`/api/taskassigne/${taskId}`]),
};

export const notificationService = {
  getAll: () => requestWithFallback('get', ['/api/notifications']),
  getById: (id: number) => requestWithFallback('get', [`/api/notifications/${id}`]),
  create: (data: unknown) => requestWithFallback('post', ['/api/notifications'], data),
  update: (id: number, data: unknown) => requestWithFallback('put', [`/api/notifications/${id}`], data),
  delete: (id: number) => requestWithFallback('delete', [`/api/notifications/${id}`]),
};

export default api;