// ── Types ──────────────────────────────────────────────────────────────────
export type MachineStatus = 'running' | 'idle' | 'error' | 'maintenance';
export type JobStatus = 'printing' | 'queued' | 'done' | 'error';
export type Priority = 'urgent' | 'high' | 'normal' | 'low';

export interface Machine {
  id: string; name: string; type: string;
  status: MachineStatus; job: string | null;
  progress: number; operator: string; tempOk: boolean;
}

export interface Job {
  id: string; client: string; type: string; qty: number;
  status: JobStatus; priority: Priority;
  machine: string | null; progress: number;
  deadline: string; operator: string;
}

export interface InkLevel { color: string; hex: string; level: number; }
export interface MediaStock { name: string; unit: string; stock: number; warn: number; }
export interface Operator { name: string; jobs: number; hours: number; status: string; }
export interface Alert { id: number; type: 'error' | 'warn' | 'info'; msg: string; time: string; }

// ── Seed Data ──────────────────────────────────────────────────────────────
export const MACHINES: Machine[] = [
  { id: 'M1', name: 'HP Latex 700', type: 'Wide Format', status: 'running', job: 'JOB-041', progress: 67, operator: 'Amir K.', tempOk: true },
  { id: 'M2', name: 'Roland VG3-64', type: 'Eco-Solvent', status: 'running', job: 'JOB-038', progress: 91, operator: 'Sara M.', tempOk: true },
  { id: 'M3', name: 'Epson S80600', type: 'Sublimation', status: 'idle', job: null, progress: 0, operator: '—', tempOk: true },
  { id: 'M4', name: 'Mimaki JV300', type: 'Solvent', status: 'error', job: 'JOB-039', progress: 34, operator: 'Lena P.', tempOk: false },
  { id: 'M5', name: 'Canon Arizona', type: 'Flatbed UV', status: 'running', job: 'JOB-042', progress: 22, operator: 'Tom R.', tempOk: true },
  { id: 'M6', name: 'HP Indigo 7K', type: 'Digital Offset', status: 'maintenance', job: null, progress: 0, operator: 'Amir K.', tempOk: true },
];

export const JOBS: Job[] = [
  { id: 'JOB-041', client: 'NovaBrand', type: 'Banner 5×2m', qty: 12, status: 'printing', priority: 'high', machine: 'M1', progress: 67, deadline: 'Today 17:00', operator: 'Amir K.' },
  { id: 'JOB-038', client: 'CityEvents', type: 'Roll-up 85×200', qty: 30, status: 'printing', priority: 'high', machine: 'M2', progress: 91, deadline: 'Today 15:30', operator: 'Sara M.' },
  { id: 'JOB-039', client: 'RetailPlus', type: 'Window Decal A1', qty: 50, status: 'error', priority: 'urgent', machine: 'M4', progress: 34, deadline: 'Today 16:00', operator: 'Lena P.' },
  { id: 'JOB-042', client: 'MegaMart', type: 'Backlit PVC A0', qty: 8, status: 'printing', priority: 'normal', machine: 'M5', progress: 22, deadline: 'Tomorrow 10:00', operator: 'Tom R.' },
  { id: 'JOB-043', client: 'UrbanPrint', type: 'Fabric Flag 1×2m', qty: 20, status: 'queued', priority: 'normal', machine: null, progress: 0, deadline: 'Tomorrow 14:00', operator: '—' },
  { id: 'JOB-044', client: 'ArtHouse', type: 'Canvas 60×90cm', qty: 5, status: 'queued', priority: 'low', machine: null, progress: 0, deadline: 'Apr 3', operator: '—' },
  { id: 'JOB-040', client: 'FreshFoods', type: 'Floor Sticker A2', qty: 60, status: 'done', priority: 'normal', machine: null, progress: 100, deadline: 'Today 12:00', operator: 'Sara M.' },
];

export const INK: InkLevel[] = [
  { color: 'Cyan', hex: '#06b6d4', level: 78 },
  { color: 'Magenta', hex: '#ec4899', level: 45 },
  { color: 'Yellow', hex: '#fbbf24', level: 62 },
  { color: 'Black', hex: '#94a3b8', level: 31 },
  { color: 'White', hex: '#e2e8f0', level: 88 },
  { color: 'Varnish', hex: '#a78bfa', level: 19 },
];

export const MEDIA: MediaStock[] = [
  { name: 'Vinyl Gloss', unit: 'm²', stock: 340, warn: 100 },
  { name: 'Vinyl Matte', unit: 'm²', stock: 210, warn: 100 },
  { name: 'PVC Banner', unit: 'm²', stock: 87, warn: 80 },
  { name: 'Fabric', unit: 'm²', stock: 55, warn: 60 },
  { name: 'Canvas', unit: 'm²', stock: 120, warn: 80 },
];

export const OPERATORS_DATA: Operator[] = [
  { name: 'Amir K.', jobs: 2, hours: 6.5, status: 'active' },
  { name: 'Sara M.', jobs: 2, hours: 7.0, status: 'active' },
  { name: 'Lena P.', jobs: 1, hours: 5.0, status: 'active' },
  { name: 'Tom R.', jobs: 1, hours: 4.5, status: 'active' },
];

export const ALERTS_DATA: Alert[] = [
  { id: 1, type: 'error', msg: 'M4 Mimaki JV300 — Print head error on JOB-039', time: '2m ago' },
  { id: 2, type: 'warn', msg: 'Varnish ink critically low — 19% remaining', time: '8m ago' },
  { id: 3, type: 'warn', msg: 'Fabric media below threshold — 55m²', time: '15m ago' },
  { id: 4, type: 'info', msg: 'JOB-040 completed by Sara M.', time: '22m ago' },
];

// ── Style Helpers ──────────────────────────────────────────────────────────
export const statusColor: Record<string, string> = {
  running: '#22c55e', idle: '#94a3b8', error: '#ef4444',
  maintenance: '#f59e0b', printing: '#22c55e', queued: '#64748b',
  done: '#3b82f6', urgent: '#ef4444', high: '#f59e0b',
  normal: '#64748b', low: '#334155',
};

export const statusBgColor: Record<string, string> = {
  running: '#052e16', idle: '#1e293b', error: '#2d0a0a',
  maintenance: '#2d1a00', printing: '#052e16', queued: '#1e293b',
  done: '#0f172a', urgent: '#2d0a0a', high: '#2d1800',
  normal: '#1e293b', low: '#1e293b',
};

export const COLORS = {
  bg: '#020817', card: '#0f172a', cardBorder: '#1e293b',
  surface: '#060d1a', text: '#e2e8f0', subtext: '#64748b',
  muted: '#475569', dim: '#334155', accent: '#3b82f6',
};
