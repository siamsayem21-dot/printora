// ── MachinesScreen ─────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MACHINES, ALERTS_DATA, OPERATORS_DATA, JOBS, COLORS, statusColor, Alert } from '../data';
import { Card, SectionTitle, ProgressBar, Badge, ScreenHeader } from '../components/UI';

export function MachinesScreen() {
  const [machines, setMachines] = useState(MACHINES);

  useEffect(() => {
    const i = setInterval(() => {
      setMachines(prev => prev.map(m =>
        m.status === 'running' ? { ...m, progress: Math.min(100, m.progress + Math.random() * 0.4) } : m
      ));
    }, 2500);
    return () => clearInterval(i);
  }, []);

  return (
    <View style={s.screen}>
      <ScreenHeader title="Machines" subtitle={`${machines.filter(m => m.status === 'running').length} running  ·  ${machines.filter(m => m.status === 'error').length} errors`} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {machines.map(m => (
          <Card key={m.id} style={{ borderColor: m.status === 'error' ? '#ef444433' : m.status === 'maintenance' ? '#f59e0b22' : '#1e293b' }}>
            <View style={s.machineTop}>
              <View>
                <Text style={s.machineId}>{m.id}  ·  {m.type}</Text>
                <Text style={s.machineName}>{m.name}</Text>
              </View>
              <View style={s.machineRight}>
                <View style={[s.dot, { backgroundColor: statusColor[m.status] }]} />
                <Badge label={m.status} type={m.status} />
              </View>
            </View>

            {m.status === 'running' && m.job && (
              <View style={s.jobBlock}>
                <View style={s.progHeader}>
                  <Text style={s.jobLabel}>Current: <Text style={s.jobId2}>{m.job}</Text></Text>
                  <Text style={s.progPct}>{Math.round(m.progress)}%</Text>
                </View>
                <ProgressBar value={m.progress} />
              </View>
            )}
            {m.status === 'error' && (
              <View style={s.errorBlock}>
                <Text style={s.errorText}>⚠  Print head error — immediate attention required</Text>
              </View>
            )}
            {m.status === 'maintenance' && (
              <View style={s.maintBlock}>
                <Text style={s.maintText}>🔧  Scheduled maintenance in progress</Text>
              </View>
            )}
            <View style={s.machineFooter}>
              <Text style={s.metaText}>👤 {m.operator}</Text>
              {!m.tempOk && <Text style={s.tempWarn}>🌡 Temperature warning</Text>}
            </View>
          </Card>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// ── AlertsScreen ───────────────────────────────────────────────────────────
export function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS_DATA);
  const dismiss = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id));

  return (
    <View style={s.screen}>
      <ScreenHeader title="Alerts" subtitle={`${alerts.filter(a => a.type === 'error').length} critical  ·  ${alerts.filter(a => a.type === 'warn').length} warnings`} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {alerts.length === 0 && (
          <View style={s.emptyBox}>
            <Text style={s.emptyText}>✓  No active alerts</Text>
          </View>
        )}
        {alerts.map(a => (
          <View key={a.id} style={[s.alertCard, {
            backgroundColor: a.type === 'error' ? '#2d0a0a' : a.type === 'warn' ? '#1a1200' : COLORS.surface,
            borderColor: a.type === 'error' ? '#ef444433' : a.type === 'warn' ? '#f59e0b22' : '#1e293b',
          }]}>
            <Text style={s.alertIcon}>{a.type === 'error' ? '🔴' : a.type === 'warn' ? '🟡' : '🔵'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.alertMsg, { color: a.type === 'error' ? '#fca5a5' : a.type === 'warn' ? '#fcd34d' : '#93c5fd' }]}>{a.msg}</Text>
              <Text style={s.alertTime}>{a.time}</Text>
            </View>
            <Text onPress={() => dismiss(a.id)} style={s.dismissBtn}>✕</Text>
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// ── OperatorsScreen ────────────────────────────────────────────────────────
export function OperatorsScreen() {
  const operators = OPERATORS_DATA;
  const jobs = JOBS;

  return (
    <View style={s.screen}>
      <ScreenHeader title="Operators" subtitle={`${operators.filter(o => o.status === 'active').length} on shift`} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {operators.map(op => {
          const opJobs = jobs.filter(j => j.operator === op.name);
          const initials = op.name.split(' ').map(n => n[0]).join('');
          return (
            <Card key={op.name}>
              <View style={s.opHeader}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.opName}>{op.name}</Text>
                  <Text style={s.opHours}>{op.hours}h on shift</Text>
                </View>
                <Badge label={op.status} type="running" />
              </View>
              <View style={s.opStats}>
                {[
                  { label: 'Today', value: op.jobs, color: '#3b82f6' },
                  { label: 'Done', value: opJobs.filter(j => j.status === 'done').length, color: '#22c55e' },
                  { label: 'Active', value: opJobs.filter(j => j.status === 'printing').length, color: '#f59e0b' },
                ].map(stat => (
                  <View key={stat.label} style={s.statBox}>
                    <Text style={[s.statVal, { color: stat.color }]}>{stat.value}</Text>
                    <Text style={s.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
              <SectionTitle>Assigned Jobs</SectionTitle>
              {opJobs.length === 0
                ? <Text style={s.noJobs}>No jobs assigned</Text>
                : opJobs.map(j => (
                  <View key={j.id} style={s.opJobRow}>
                    <View>
                      <Text style={s.opJobId}>{j.id}</Text>
                      <Text style={s.opJobClient}>{j.client}  ·  {j.type}</Text>
                    </View>
                    <Badge label={j.status} type={j.status} />
                  </View>
                ))
              }
            </Card>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 14 },
  // Machines
  machineTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  machineId: { fontSize: 10, color: COLORS.muted, fontFamily: 'monospace', marginBottom: 3 },
  machineName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  machineRight: { alignItems: 'flex-end', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
  jobBlock: { marginBottom: 10 },
  progHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  jobLabel: { fontSize: 12, color: COLORS.subtext },
  jobId2: { fontFamily: 'monospace', color: COLORS.muted },
  progPct: { fontSize: 11, color: COLORS.subtext, fontFamily: 'monospace' },
  errorBlock: { backgroundColor: '#2d0a0a', borderRadius: 7, padding: 10, marginBottom: 10 },
  errorText: { fontSize: 12, color: '#fca5a5' },
  maintBlock: { backgroundColor: '#1a1200', borderRadius: 7, padding: 10, marginBottom: 10 },
  maintText: { fontSize: 12, color: '#fcd34d' },
  machineFooter: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1e293b' },
  metaText: { fontSize: 12, color: COLORS.dim },
  tempWarn: { fontSize: 12, color: '#ef4444' },
  // Alerts
  alertCard: { borderRadius: 10, padding: 12, marginBottom: 10, flexDirection: 'row', gap: 10, borderWidth: 1 },
  alertIcon: { fontSize: 14, marginTop: 1 },
  alertMsg: { fontSize: 13, lineHeight: 17 },
  alertTime: { fontSize: 10, color: COLORS.dim, marginTop: 3 },
  dismissBtn: { color: COLORS.muted, fontSize: 18, lineHeight: 20 },
  emptyBox: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#22c55e', fontSize: 14 },
  // Operators
  opHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#1d4ed8', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  opName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  opHours: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  opStats: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#1e293b', paddingVertical: 12, marginBottom: 14 },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '700', fontFamily: 'monospace' },
  statLabel: { fontSize: 10, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase', marginTop: 2 },
  opJobRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  opJobId: { fontSize: 10, color: COLORS.muted, fontFamily: 'monospace' },
  opJobClient: { fontSize: 13, color: COLORS.text, marginTop: 1 },
  noJobs: { fontSize: 12, color: COLORS.dim },
});

export default MachinesScreen;
