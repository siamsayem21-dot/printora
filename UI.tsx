import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, statusColor, statusBgColor } from '../data';

// ── Badge ──────────────────────────────────────────────────────────────────
export function Badge({ label, type }: { label: string; type: string }) {
  return (
    <View style={[styles.badge, {
      backgroundColor: statusBgColor[type] || '#1e293b',
      borderColor: (statusColor[type] || '#334155') + '44',
    }]}>
      <Text style={[styles.badgeText, { color: statusColor[type] || '#94a3b8' }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

// ── ProgressBar ────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = '#22c55e', thin = false }: {
  value: number; color?: string; thin?: boolean;
}) {
  const barColor = value > 90 ? '#3b82f6' : value > 60 ? color : value > 30 ? '#f59e0b' : '#ef4444';
  return (
    <View style={[styles.progressTrack, { height: thin ? 4 : 7 }]}>
      <View style={[styles.progressFill, { width: `${Math.min(100, value)}%`, backgroundColor: barColor }]} />
    </View>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }: { children: React.ReactNode; style?: object }) {
  return (
    <View style={[styles.card, style]}>{children}</View>
  );
}

// ── SectionTitle ───────────────────────────────────────────────────────────
export function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

// ── ScreenHeader ───────────────────────────────────────────────────────────
export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle && <Text style={styles.headerSub}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1, alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  progressTrack: {
    backgroundColor: '#1e293b', borderRadius: 99, overflow: 'hidden', flex: 1,
  },
  progressFill: { height: '100%', borderRadius: 99 },
  card: {
    backgroundColor: COLORS.card, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.2,
    textTransform: 'uppercase', color: COLORS.muted, marginBottom: 12,
  },
  header: {
    backgroundColor: '#0a0f1e', paddingHorizontal: 16,
    paddingTop: 56, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: COLORS.subtext, marginTop: 2 },
});
