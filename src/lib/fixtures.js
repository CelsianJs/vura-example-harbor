export const services = [
  { id: 'edge-router', name: 'Edge Router', tier: 'critical', region: 'Global', status: 'degraded', latency: 48, deploy: 'r4118' },
  { id: 'control-api', name: 'Control API', tier: 'critical', region: 'iad', status: 'watch', latency: 122, deploy: 'r4115' },
  { id: 'asset-packager', name: 'Asset Packager', tier: 'core', region: 'ord', status: 'healthy', latency: 36, deploy: 'r4109' },
  { id: 'webhook-relay', name: 'Webhook Relay', tier: 'core', region: 'sfo', status: 'healthy', latency: 64, deploy: 'r4113' },
  { id: 'cache-index', name: 'Cache Index', tier: 'support', region: 'ams', status: 'degraded', latency: 89, deploy: 'r4107' },
];

export const incidents = [
  {
    id: 'inc-1048',
    title: 'Synthetic cold-start regression on edge router',
    serviceId: 'edge-router',
    severity: 'critical',
    status: 'triage',
    owner: 'Mara',
    opened: '09:14',
    summary: 'Bundled fixture shows elevated boot time after the r4118 deploy. This is synthetic demo data.',
    notes: ['Compare bundle chunk split against r4115.', 'Check fallback path before changing deploy status.'],
  },
  {
    id: 'inc-1047',
    title: 'Cache index stale read fixture',
    serviceId: 'cache-index',
    severity: 'major',
    status: 'investigating',
    owner: 'Theo',
    opened: '08:42',
    summary: 'Synthetic cache index row remains stale after a demo purge action.',
    notes: ['Validate tag fanout.', 'Confirm UI does not promise real purge behavior.'],
  },
  {
    id: 'inc-1042',
    title: 'Webhook retry burst in demo receiver',
    serviceId: 'webhook-relay',
    severity: 'minor',
    status: 'monitoring',
    owner: 'Inez',
    opened: 'Yesterday',
    summary: 'Local seed data simulates retries backing off successfully.',
    notes: ['Document replay window.', 'No external receiver is contacted by this local console.'],
  },
  {
    id: 'inc-1039',
    title: 'Control API schema drift warning',
    serviceId: 'control-api',
    severity: 'major',
    status: 'triage',
    owner: 'Mara',
    opened: 'Yesterday',
    summary: 'Synthetic validation warning for changed payload fields.',
    notes: ['Add migration note.', 'Route all users to current API docs.'],
  },
];

export const deploys = [
  { id: 'r4118', serviceId: 'edge-router', title: 'Router manifest parser cleanup', state: 'watch', actor: 'demo-bot', age: '18m', risk: 82 },
  { id: 'r4115', serviceId: 'control-api', title: 'Webhook endpoint labels', state: 'stable', actor: 'mara', age: '2h', risk: 38 },
  { id: 'r4113', serviceId: 'webhook-relay', title: 'Retry jitter constants', state: 'stable', actor: 'inez', age: '4h', risk: 22 },
  { id: 'r4109', serviceId: 'asset-packager', title: 'Static alias compression', state: 'stable', actor: 'theo', age: '1d', risk: 16 },
];

export const severityOrder = ['critical', 'major', 'minor'];
export const statusOptions = ['triage', 'investigating', 'monitoring', 'resolved'];
export const owners = ['Mara', 'Theo', 'Inez', 'No owner'];

export function serviceName(id) {
  return services.find((service) => service.id === id)?.name || id;
}

export function deployRiskTone(risk) {
  if (risk >= 70) return 'risk-high';
  if (risk >= 35) return 'risk-medium';
  return 'risk-low';
}

export function riskMeterStyle(risk) {
  const bounded = Math.max(0, Math.min(100, Math.round(Number(risk) || 0)));
  return `--risk:${bounded}`;
}

export function serviceStatusTone(status) {
  if (status === 'healthy') return 'tone-healthy';
  if (status === 'watch') return 'tone-watch';
  return 'tone-warning';
}

export function ownerLoadRows(rows) {
  const load = {};
  for (const incident of rows.filter((entry) => entry.status !== 'resolved')) {
    load[incident.owner] = (load[incident.owner] || 0) + 1;
  }
  const max = Math.max(...Object.values(load), 1);
  return Object.entries(load)
    .map(([owner, count]) => ({ owner, count, share: count / max }))
    .sort((a, b) => b.count - a.count || a.owner.localeCompare(b.owner));
}
