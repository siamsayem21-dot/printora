import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MACHINES, JOBS, INK, ALERTS_DATA, COLORS, statusColor } from '../data';
import { Card, SectionTitle, ProgressBar, Badge, ScreenHeader } from '../components/UI';

export default function DashboardScreen() {
  const [machines, setMachines] = useState(MACHINES);
  const jobs = JOBS;
  const alerts = ALERTS_DATA;

  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(m =>
        m.status === 'running' ? { ...m, progress: Math.min(100, m.progress + Math.random() * 0.4) } : m
      ));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const runningJobs = jobs.filter(j => j.status === 'printing').length;
  const queuedJobs = jobs.filter(j => j.status === 'queued').length;
  const doneJobs = jobs.filter(j => j.status === 'done').length;
  const errorJobs = jobs.filter(j => j.status === 'error').length;
  const runningMachines = machines.filter(m => m.status === 'running').length;
  const criticalAlerts = alerts.filter(a => a.type === 'error').length;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="PrintOps Monitor"
        subtitle={`${runningMachines}/${machines.length} machines active  ·  ${criticalAlerts > 0 ? `⚠ ${criticalAlerts} critical` : 'All clear'}`}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* KPI Row */}
        <View style={styles.kpiRow}>
          {[
            { label: 'Printing', value: runningJobs, color: '#22c55e' },
            { label: 'Queued', value: queuedJobs, color: '#64748b' },
            { label: 'Done', value: doneJobs, color: '#3b82f6' },
            { label: 'Errors', value: errorJobs, color: '#ef4444' },
          ].map(k => (
            <View key={k.label} style={styles.kpiCard}>
              <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* Active Jobs */}
        <Card>
          <SectionTitle>Active Jobs</SectionTitle>
          {jobs.filter(j => j.status === 'printing' || j.status === 'error').map(job => (
            <View key={job.id} style={[styles.jobRow, { borderColor: job.status === 'error' ? '#ef444422' : '#1e293b' }]}>
              <View style={styles.jobHeader}>
                <View>
                  <Text style={styles.jobId}>{job.id}</Text>
                  <Text style={styles.jobClient}>{job.client}</Text>
                  <Text style={styles.jobType}>{job.type} ×{job.qty}</Text>
                </View>
                <View style={styles.jobBadges}>
                  <Badge label={job.priority} type={job.priority} />
                  <View style={{ height: 4 }} />
                  <Badge label={job.status} type={job.status} />
                </View>
              </View>
              <View style={styles.progressRow}>
                <ProgressBar value={job.progress} />
                <Text style={styles.progressPct}>{Math.round(job.progress)}%</Text>
              </View>
              <Text style={styles.jobMeta}>⏱ {job.deadline}  ·  {job.operator}</Text>
            </View>
          ))}
        </Card>

        {/* Machine Overview */}
        <Card>
          <SectionTitle>Machine Overview</SectionTitle>
          {machines.map(m => (
            <View key={m.id} style={styles.machineRow}>
              <View style={[styles.statusDot, { backgroundColor: statusColor[m.status] }]} />
              <View style={{ flex: 1 }}>
                <View style={styles.machineHeader}>
                  <Text style={styles.machineName}>{m.name}</Text>
                  <Text style={styles.machineType}>{m.type}</Text>
                </View>
                {m.status === 'running' && (
                  <View style={styles.progressRow}>
                    <ProgressBar value={m.progress} thin />
                    <Text style={styles.progressPctSm}>{Math.round(m.progress)}%</Text>
                  </View>
                )}
                <Text style={styles.machineOp}>{m.operator}{m.job ? `  ·  ${m.job}` : ''}</Text>
              </View>
              <Badge label={m.status} type={m.status} />
            </View>
          ))}
        </Card>

        {/* Ink Levels */}
        <Card>
          <SectionTitle>Ink Levels</SectionTitle>
          {INK.map(i => (
            <View key={i.color} style={styles.inkRow}>
              <View style={[styles.inkDot, { backgroundColor: i.hex }]} />
              <Text style={styles.inkLabel}>{i.color}</Text>
              <View style={{ flex: 1 }}><ProgressBar value={i.level} color={i.hex} thin /></View>
              <Text style={[styles.inkPct, { color: i.level < 25 ? '#ef4444' : i.level < 50 ? '#f59e0b' : '#64748b' }]}>
                {i.level}%
              </Text>
            </View>
          ))}
        </Card>

        {/* Recent Alerts */}
        <Card>
          <SectionTitle>Recent Alerts</SectionTitle>
          {alerts.slice(0, 3).map(a => (
            <View key={a.id} style={[styles.alertRow, {
              backgroundColor: a.type === 'error' ? '#2d0a0a' : a.type === 'warn' ? '#1a1200' : '#060d1a',
            }]}>
              <Text style={styles.alertIcon}>{a.type === 'error' ? '🔴' : a.type === 'warn' ? '🟡' : '🔵'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.alertMsg, { color: a.type === 'error' ? '#fca5a5' : a.type === 'warn' ? '#fcd34d' : '#93c5fd' }]}>{a.msg}</Text>
                <Text style={styles.alertTime}>{a.time}</Text>
              </View>
            </View>
          ))}
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { padding: 14 },
  kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  kpiCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: 10, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  kpiValue: { fontSize: 26, fontWeight: '700', lineHeight: 30 },
  kpiLabel: { fontSize: 10, color: COLORS.muted, marginTop: 2, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  jobRow: {
    backgroundColor: COLORS.surface, borderRadius: 8, padding: 12,
    marginBottom: 10, borderWidth: 1,
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  jobBadges: { alignItems: 'flex-end' },
  jobId: { fontSize: 10, color: COLORS.muted, fontFamily: 'monospace', marginBottom: 2 },
  jobClient: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  jobType: { fontSize: 11, color: COLORS.subtext, marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  progressPct: { fontSize: 11, color: COLORS.subtext, minWidth: 32, textAlign: 'right', fontFamily: 'monospace' },
  progressPctSm: { fontSize: 10, color: COLORS.muted, minWidth: 28, textAlign: 'right' },
  jobMeta: { fontSize: 11, color: COLORS.dim, marginTop: 4 },
  machineRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  machineHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  machineName: { fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 1 },
  machineType: { fontSize: 11, color: COLORS.muted },
  machineOp: { fontSize: 11, color: COLORS.dim, marginTop: 3 },
  inkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  inkDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  inkLabel: { fontSize: 12, color: COLORS.subtext, width: 56 },
  inkPct: { fontSize: 11, fontFamily: 'monospace', minWidth: 32, textAlign: 'right' },
  alertRow: { flexDirection: 'row', gap: 8, padding: 10, borderRadius: 7, marginBottom: 6 },
  alertIcon: { fontSize: 12, marginTop: 1 },
  alertMsg: { fontSize: 12, lineHeight: 16 },
  alertTime: { fontSize: 10, color: COLORS.dim, marginTop: 2 },
});
