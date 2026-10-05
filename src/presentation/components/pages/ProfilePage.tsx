import { useState } from 'react';
import { Alert, Switch, View } from 'react-native';
import { LEVEL_META } from '@/core/constants/levels';
import { colors } from '@/core/theme/colors';
import { formatClock, formatDuration, fromLocalDateKey } from '@/core/utils/date';
import type { Accent } from '@/domain/entities';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { useSettings } from '../../state/SettingsProvider';
import { AppText, Button, Surface } from '../atoms';
import {
  LoadingState,
  SectionHeader,
  SegmentedControl,
  SpeakerButton,
  StatBlock,
  Stepper,
  XpBadge,
} from '../molecules';
import { AchievementGrid } from '../organisms';
import { ScreenTemplate } from '../templates';

const DAY_INITIALS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const RATES = [
  { value: '0.75', label: 'Lente' },
  { value: '0.92', label: 'Naturelle' },
  { value: '1.1', label: 'Rapide' },
] as const;

type RateValue = (typeof RATES)[number]['value'];

function closestRate(rate: number): RateValue {
  return RATES.reduce((best, r) => (Math.abs(Number(r.value) - rate) < Math.abs(Number(best.value) - rate) ? r : best))
    .value;
}

/** Progress overview, pronunciation preferences, daily reminder and offline promise. */
export function ProfilePage() {
  const { getProgressOverview, getMotivationOverview } = useUseCases();
  const { data: motivation } = useAsync(() => getMotivationOverview.execute(), [getMotivationOverview], {
    refreshOnFocus: true,
  });
  const { settings, update } = useSettings();
  const { data, loading } = useAsync(() => getProgressOverview.execute(), [getProgressOverview], {
    refreshOnFocus: true,
  });
  const [reminderError, setReminderError] = useState<string | null>(null);

  const safeUpdate = async (patch: Parameters<typeof update>[0]) => {
    try {
      setReminderError(null);
      await update(patch);
    } catch (e) {
      setReminderError(e instanceof Error ? e.message : 'Réglage impossible.');
    }
  };

  const maxDay = Math.max(1, ...(data?.history.map((d) => d.totalSeconds) ?? [1]));
  const sample =
    settings.accent === 'en-GB' ? 'Good evening. Shall we have a cup of tea?' : "Hey there! Let's grab a coffee.";

  const header = (
    <View className="gap-2">
      <AppText variant="overline" tone="muted">
        Profil
      </AppText>
      <AppText variant="title">Ta discipline</AppText>
    </View>
  );

  return (
    <ScreenTemplate header={header}>
      {loading && !data ? <LoadingState /> : null}
      {data ? (
        <View className="gap-10">
          <View className="flex-row gap-10">
            <StatBlock value={data.level} label={LEVEL_META[data.level].title} />
            <StatBlock value={String(data.streak.current)} label="jours d'affilée" />
            <StatBlock value={String(data.streak.longest)} label="record" />
          </View>

          <Surface tone="white" className="gap-6">
            <View className="flex-row items-baseline justify-between">
              <AppText variant="overline" tone="muted">
                7 derniers jours
              </AppText>
              <AppText variant="caption" tone="soft">
                {formatDuration(data.totalSecondsAllTime)}
              </AppText>
            </View>
            <View className="h-32 flex-row justify-between gap-3">
              {data.history.map((d) => (
                <View key={d.dateKey} className="flex-1 items-center gap-2">
                  <View className="w-full flex-1 justify-end overflow-hidden rounded-full bg-brand-haze">
                    <View
                      className="w-full rounded-full bg-brand"
                      style={{ height: `${Math.round((d.totalSeconds / maxDay) * 100)}%` }}
                    />
                  </View>
                  <AppText variant="caption" tone="muted" className="text-[11px]">
                    {DAY_INITIALS[fromLocalDateKey(d.dateKey).getDay()]}
                  </AppText>
                </View>
              ))}
            </View>
          </Surface>

          {data.scores.length > 0 ? (
            <View className="gap-3">
              <SectionHeader overline="Historique" title="Derniers scores" />
              {data.scores.slice(0, 8).map((s) => (
                <View key={s.id} className="flex-row items-center justify-between rounded-3xl bg-surface px-5 py-4">
                  <View className="gap-0.5">
                    <AppText variant="subheading">
                      {s.source === 'exam' ? 'Examen' : 'Quiz'} · {s.refId.replace('exam-', '').toUpperCase()}
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      {new Date(s.takenAt).toLocaleDateString('fr-FR')}
                    </AppText>
                  </View>
                  <AppText variant="heading" tone="brand">
                    {s.score}/{s.maxScore}
                  </AppText>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {motivation ? (
        <View className="gap-5">
          <SectionHeader
            overline="Expérience"
            title={`${motivation.unlockedCount} succès sur ${motivation.achievements.length}`}
          />
          <XpBadge xp={motivation.xp} />
          <AppText variant="caption" tone="muted">
            {motivation.wordsLearned} mot(s) ancré(s) durablement grâce aux révisions.
          </AppText>
          <AchievementGrid achievements={motivation.achievements} />
        </View>
      ) : null}

      <View className="gap-5">
        <SectionHeader overline="Immersion" title="Penser en anglais" />
        <View className="flex-row items-center justify-between rounded-3xl bg-surface px-5 py-4">
          <View className="flex-1 gap-0.5 pr-4">
            <AppText variant="subheading">Mode immersion</AppText>
            <AppText variant="caption" tone="muted">
              Le français se cache jusqu’au toucher ; les cartes mémoire sont lues à voix haute.
            </AppText>
          </View>
          <Switch
            value={settings.immersionMode}
            onValueChange={(immersionMode) => void safeUpdate({ immersionMode })}
            trackColor={{ false: colors.brandMist, true: colors.brand }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.brandMist}
            accessibilityLabel="Mode immersion"
          />
        </View>
      </View>

      <View className="gap-5">
        <SectionHeader overline="Prononciation" title="Accent et vitesse" />
        <SegmentedControl<Accent>
          segments={[
            { value: 'en-GB', label: 'Britannique' },
            { value: 'en-US', label: 'Américain' },
          ]}
          value={settings.accent}
          onChange={(accent) => void safeUpdate({ accent })}
        />
        <SegmentedControl<RateValue>
          segments={RATES}
          value={closestRate(settings.speechRate)}
          onChange={(v) => void safeUpdate({ speechRate: Number(v) })}
        />
        <View className="flex-row items-center gap-4 rounded-3xl bg-surface px-5 py-4">
          <AppText variant="body" tone="soft" className="flex-1 italic">
            {sample}
          </AppText>
          <SpeakerButton
            text={sample}
            speechKey={`sample:${settings.accent}:${settings.speechRate}`}
            size="md"
            tone="plain"
          />
        </View>
        <AppText variant="caption" tone="faint">
          Synthèse vocale native du téléphone, sans Internet. Si la voix choisie n'est pas installée, ajoute-la dans les
          réglages de synthèse vocale du système.
        </AppText>
      </View>

      <View className="gap-5">
        <SectionHeader overline="Coach" title="Rappel quotidien" />
        <View className="flex-row items-center justify-between rounded-3xl bg-surface px-5 py-4">
          <View className="flex-1 gap-0.5 pr-4">
            <AppText variant="subheading">Me rappeler mon devoir</AppText>
            <AppText variant="caption" tone="muted">
              Une notification locale chaque jour à {formatClock(settings.reminderHour, settings.reminderMinute)}.
            </AppText>
          </View>
          <Switch
            value={settings.reminderEnabled}
            onValueChange={(reminderEnabled) => void safeUpdate({ reminderEnabled })}
            trackColor={{ false: colors.brandMist, true: colors.brand }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.brandMist}
            accessibilityLabel="Activer le rappel quotidien"
          />
        </View>
        <View className="flex-row items-center justify-between px-1">
          <Stepper
            label="heure"
            value={settings.reminderHour}
            min={0}
            max={23}
            format={(v) => String(v).padStart(2, '0')}
            onChange={(reminderHour) => void safeUpdate({ reminderHour })}
          />
          <AppText variant="heading" tone="faint">
            :
          </AppText>
          <Stepper
            label="minutes"
            value={settings.reminderMinute}
            min={0}
            max={55}
            step={5}
            format={(v) => String(v).padStart(2, '0')}
            onChange={(reminderMinute) => void safeUpdate({ reminderMinute })}
          />
        </View>
        {reminderError ? (
          <AppText variant="caption" tone="danger">
            {reminderError}
          </AppText>
        ) : null}
      </View>

      <View className="gap-5">
        <SectionHeader overline="Correcteur" title="Mots acceptés" />
        <AppText variant="caption" tone="muted">
          {settings.customWords.length === 0
            ? 'Aucun mot ajouté. Dans le journal, touche un mot souligné puis « Accepter ce mot ».'
            : settings.customWords.join(', ')}
        </AppText>
        {settings.customWords.length > 0 ? (
          <Button
            label="Réinitialiser la liste"
            variant="secondary"
            onPress={() =>
              Alert.alert('Réinitialiser ?', 'Les mots seront de nouveau vérifiés (effet au prochain lancement).', [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Réinitialiser', style: 'destructive', onPress: () => void safeUpdate({ customWords: [] }) },
              ])
            }
          />
        ) : null}
      </View>

      <Surface tone="brand" className="gap-2">
        <AppText variant="subheading" tone="brand">
          100 % hors ligne
        </AppText>
        <AppText variant="caption" tone="soft">
          Cours, dictionnaire, examens, voix et journal vivent sur ton téléphone. Aucune donnée ne le quitte.
        </AppText>
      </Surface>
    </ScreenTemplate>
  );
}
