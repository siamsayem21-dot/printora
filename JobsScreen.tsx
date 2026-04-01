import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { JOBS, MACHINES, COLORS, Job } from '../data';
import { Card, Badge, ProgressBar, ScreenHeader } from '../components/UI';

const FILTERS = ['all', 'printing', 'queued', 'done', 'error'] as const;

export default function JobsScreen() {
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const [filter, setFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ client: '', type: '', qty: '', priority: 'normal', deadline: '' });

  const filtered = jobs.filter(j => filter === 'all' || j.status === filter);

  const addJob = () => {
    if (!form.client.trim() || !form.type.trim()) return;
    const newJob: Job = {
      id: `JOB-0${50 + jobs.length}`,
      client: form.client, type: form.type,
      qty: parseInt(form.qty) || 1,
      status: 'queued', priority: form.priority as any,
      machine: null, progress: 0,
      deadline: form.deadline || 'TBD', operator: '—',
    };
    setJobs(prev => [...prev, newJob]);
    setShowAdd(false);
    setForm({ client: '', type: '', qty: '', priority: 'normal', deadline: '' });
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Job Queue" subtitle={`${jobs.filter(j => j.status === 'printing').length} printing  ·  ${jobs.filter(j => j.status === 'queued').length} waiting`} />

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, filter === f && styles.filterBtnActive]}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.map(job => {
          const machine = MACHINES.find(m => m.id === job.machine);
          return (
            <Card key={job.id} style={{ borderColor: job.status === 'error' ? '#ef444433' : '#1e293b' }}>
              <View style={styles.jobTop}>
                <View>
                  <Text style={styles.jobId}>{job.id}</Text>
                  <Text style={styles.jobClient}>{job.client}</Text>
                  <Text style={styles.jobType}>{job.type}  ×{job.qty}</Text>
                </View>
                <View style={styles.badgeCol}>
                  <Badge label={job.priority} type={job.priority} />
                  <View style={{ height: 5 }} />
                  <Badge label={job.status} type={job.status} />
                </View>
              </View>
              {job.progress > 0 && (
                <View style={styles.progRow}>
                  <ProgressBar value={job.progress} />
                  <Text style={styles.progPct}>{Math.round(job.progress)}%</Text>
                </View>
              )}
              <View style={styles.jobFooter}>
                <Text style={styles.jobMeta}>⏱ {job.deadline}</Text>
                {machine && <Text style={styles.jobMeta}>🖨 {machine.name.split(' ').slice(0, 2).join(' ')}</Text>}
                <Text style={styles.jobMeta}>👤 {job.operator}</Text>
              </View>
            </Card>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add Job FAB */}
      <TouchableOpacity onPress={() => setShowAdd(true)} style={styles.fab}>
        <Text style={styles.fabText}>+ New Job</Text>
      </TouchableOpacity>

      {/* Add Job Modal */}
      <Modal visible={showAdd} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add New Job</Text>
            {[
              { placeholder: 'Client name *', key: 'client' },
              { placeholder: 'Print type & size *', key: 'type' },
              { placeholder: 'Quantity', key: 'qty' },
              { placeholder: 'Deadline (e.g. Today 17:00)', key: 'deadline' },
            ].map(f => (
              <TextInput
                key={f.key}
                placeholder={f.placeholder}
                placeholderTextColor={COLORS.muted}
                value={form[f.key as keyof typeof form]}
                onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                keyboardType={f.key === 'qty' ? 'numeric' : 'default'}
                style={styles.input}
              />
            ))}
            {/* Priority Picker */}
            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {['urgent', 'high', 'normal', 'low'].map(p => (
                <TouchableOpacity key={p} onPress={() => setForm(prev => ({ ...prev, priority: p }))}
                  style={[styles.priorityBtn, form.priority === p && styles.priorityBtnActive]}>
                  <Text style={[styles.priorityText, form.priority === p && { color: '#e2e8f0' }]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowAdd(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addJob} style={styles.addBtn}>
                <Text style={styles.addText}>Add Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { padding: 14 },
  filterBar: { backgroundColor: '#0a0f1e', borderBottomWidth: 1, borderBottomColor: '#1e293b', maxHeight: 46 },
  filterContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 6, flexDirection: 'row' },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 6, backgroundColor: '#1e293b' },
  filterBtnActive: { backgroundColor: '#1d4ed8' },
  filterText: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  jobTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badgeCol: { alignItems: 'flex-end' },
  jobId: { fontSize: 10, color: COLORS.muted, fontFamily: 'monospace', marginBottom: 2 },
  jobClient: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  jobType: { fontSize: 12, color: COLORS.subtext, marginTop: 2 },
  progRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  progPct: { fontSize: 11, color: COLORS.subtext, minWidth: 30, textAlign: 'right', fontFamily: 'monospace' },
  jobFooter: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1e293b' },
  jobMeta: { fontSize: 11, color: COLORS.dim },
  fab: {
    position: 'absolute', bottom: 20, right: 16,
    backgroundColor: '#1d4ed8', borderRadius: 24,
    paddingHorizontal: 20, paddingVertical: 12,
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
    elevation: 8,
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000088' },
  modal: {
    backgroundColor: '#0f172a', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, borderTopWidth: 1, borderColor: '#1e293b',
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  input: {
    backgroundColor: COLORS.surface, borderRadius: 8, padding: 12,
    color: COLORS.text, fontSize: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#1e293b',
  },
  inputLabel: { fontSize: 11, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  priorityBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 7,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: '#1e293b',
    alignItems: 'center',
  },
  priorityBtnActive: { backgroundColor: '#1d4ed8', borderColor: '#3b82f6' },
  priorityText: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: '#1e293b', borderRadius: 8, padding: 12, alignItems: 'center' },
  cancelText: { color: COLORS.subtext, fontWeight: '600' },
  addBtn: { flex: 2, backgroundColor: '#1d4ed8', borderRadius: 8, padding: 12, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '700' },
});
