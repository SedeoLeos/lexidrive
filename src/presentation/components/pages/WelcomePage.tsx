import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/core/theme/colors';
import { useUseCases } from '../../di/DependenciesProvider';
import { useSettings } from '../../state/SettingsProvider';
import { AppText, Button, Icon, type IconName } from '../atoms';

const SLIDES: { icon: IconName; overline: string; title: string; body: string }[] = [
  {
    icon: 'compass',
    overline: 'Bienvenue dans LexiDrive',
    title: 'L’anglais, une étape à la fois.',
    body: 'Chaque jour, un parcours guidé de quatre étapes courtes. Tu n’as jamais à te demander quoi faire : un seul bouton, « Continuer ».',
  },
  {
    icon: 'headphones',
    overline: 'Immersion',
    title: 'Entendre, comprendre, parler.',
    body: 'Des écoutes actives, des dictées et une voix native hors ligne sur chaque mot. Tes oreilles s’habituent avant même que tu t’en rendes compte.',
  },
  {
    icon: 'star',
    overline: 'Motivation',
    title: 'Chaque effort compte.',
    body: 'Gagne de l’expérience, débloque des succès, garde ta série de jours. Tes 7 heures se font en autant de petites sessions que tu veux.',
  },
];

/** First launch: three calm slides, then the learner chooses where to start. */
export function WelcomePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { update, settings } = useSettings();
  const { getExamEligibility } = useUseCases();
  const [step, setStep] = useState(0);
  const [immersion, setImmersion] = useState(settings.immersionMode);
  const isChoice = step === SLIDES.length;

  const finish = async (alreadyHasBasics: boolean) => {
    await update({ onboarded: true, immersionMode: immersion });
    if (alreadyHasBasics) {
      const { exam } = await getExamEligibility.execute('A1');
      router.replace(exam ? `/exam/${exam.id}` : '/');
    } else {
      router.replace('/');
    }
  };

  return (
    <View className="flex-1 bg-canvas px-8" style={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 28 }}>
      <View className="flex-row gap-2">
        {[...SLIDES, null].map((_, i) => (
          <View key={i} className={`h-[3px] flex-1 rounded-full ${i <= step ? 'bg-brand' : 'bg-brand-mist'}`} />
        ))}
      </View>

      {!isChoice ? (
        <View className="flex-1 justify-center gap-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-haze">
            <Icon name={SLIDES[step].icon} size={26} color={colors.brand} />
          </View>
          <AppText variant="overline" tone="muted">
            {SLIDES[step].overline}
          </AppText>
          <AppText variant="display" className="text-5xl leading-[58px]">
            {SLIDES[step].title}
          </AppText>
          <AppText variant="body" tone="soft">
            {SLIDES[step].body}
          </AppText>
        </View>
      ) : (
        <View className="flex-1 justify-center gap-6">
          <AppText variant="overline" tone="muted">
            Ton point de départ
          </AppText>
          <AppText variant="title">Où en es-tu en anglais ?</AppText>
          <Pressable
            accessibilityRole="button"
            onPress={() => void finish(false)}
            className="gap-1 rounded-3xl bg-brand px-6 py-6 active:opacity-80"
          >
            <AppText variant="heading" tone="inverse">
              Je débute
            </AppText>
            <AppText variant="caption" tone="inverse" className="opacity-80">
              On commence ensemble au niveau A1, en douceur.
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => void finish(true)}
            className="gap-1 rounded-3xl bg-surface px-6 py-6 active:opacity-80"
          >
            <AppText variant="heading">J’ai déjà des bases</AppText>
            <AppText variant="caption" tone="muted">
              Passe directement le test A1 ➔ A2 et monte de niveau en niveau.
            </AppText>
          </Pressable>
          <View className="flex-row items-center justify-between rounded-3xl bg-white px-6 py-5">
            <View className="flex-1 gap-0.5 pr-4">
              <AppText variant="subheading">Mode immersion</AppText>
              <AppText variant="caption" tone="muted">
                Le français reste caché jusqu’à ce que tu le touches, l’anglais est lu à voix haute.
              </AppText>
            </View>
            <Switch
              value={immersion}
              onValueChange={setImmersion}
              trackColor={{ false: colors.brandMist, true: colors.brand }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.brandMist}
              accessibilityLabel="Mode immersion"
            />
          </View>
        </View>
      )}

      {!isChoice ? (
        <View className="gap-3">
          <Button
            label={step === SLIDES.length - 1 ? 'Choisir mon départ' : 'Suivant'}
            icon="arrow-right"
            fullWidth
            onPress={() => setStep(step + 1)}
          />
          <Button label="Passer" variant="ghost" fullWidth onPress={() => setStep(SLIDES.length)} />
        </View>
      ) : null}
    </View>
  );
}
