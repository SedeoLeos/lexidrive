import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { countWords } from '@/core/utils/text';
import type { JournalKind } from '@/domain/entities';
import type { SpellToken } from '@/domain/services';
import { useSpellChecker } from '../../hooks/useSpellChecker';
import { useSettings } from '../../state/SettingsProvider';
import { AppText, Button, Pill, TextArea } from '../atoms';
import { SpeakerButton, SpellCheckedText } from '../molecules';
import { DictionaryPopup } from './DictionaryPopup';

export interface JournalDraftValue {
  frenchText: string;
  englishText: string;
}

export interface JournalEditorProps {
  prompt: string;
  kind: JournalKind;
  value: JournalDraftValue;
  onChange: (value: JournalDraftValue) => void;
  onSave: () => void;
  saving?: boolean;
  savedAt?: string | null;
  speechKey: string;
}

/**
 * Active production workspace: French on top, the learner's own English translation below,
 * a local spell-check proofreading pane (soft underlines, tap for suggestions) and the dictionary.
 * Deliberately non-blocking: nothing is graded, the learner stays free.
 */
export function JournalEditor({
  prompt,
  kind,
  value,
  onChange,
  onSave,
  saving = false,
  savedAt,
  speechKey,
}: JournalEditorProps) {
  const { ready, checker } = useSpellChecker();
  const { addCustomWord, settings } = useSettings();
  const [focusToken, setFocusToken] = useState<SpellToken | null>(null);
  const [popupWord, setPopupWord] = useState<string | null>(null);

  const tokens = useMemo(
    () => (ready ? checker.tokenize(value.englishText) : []),
    // `checker` is stable; `ready` flips once the lexicon is loaded; custom words extend it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, value.englishText, settings.customWords],
  );
  const misspelled = tokens.filter((t) => t.misspelled);
  const suggestions = useMemo(
    () => (focusToken?.misspelled ? checker.suggest(focusToken.text) : []),
    [checker, focusToken],
  );

  const replaceToken = (token: SpellToken, replacement: string) => {
    const text = value.englishText;
    // Guard against the text having changed since the token was computed.
    if (text.slice(token.start, token.start + token.text.length) !== token.text) return;
    onChange({
      ...value,
      englishText: text.slice(0, token.start) + replacement + text.slice(token.start + token.text.length),
    });
    setFocusToken(null);
  };

  const onPressWord = (token: SpellToken) => {
    if (token.misspelled) setFocusToken(focusToken?.start === token.start ? null : token);
    else setPopupWord(token.text);
  };

  const englishWords = countWords(value.englishText);
  const frenchWords = countWords(value.frenchText);

  return (
    <View className="gap-8">
      <View className="gap-4 rounded-3xl bg-brand-haze px-6 py-6">
        <View className="flex-row items-center justify-between">
          <AppText variant="overline" tone="brand">
            Consigne du jour
          </AppText>
          <Pill label={kind === 'debate' ? 'Débat' : 'Journal de vie'} tone="neutral" />
        </View>
        <AppText variant="heading" className="leading-8">
          {prompt}
        </AppText>
      </View>

      <View className="gap-3">
        <View className="flex-row items-baseline justify-between px-1">
          <AppText variant="overline" tone="muted">
            1 · En français
          </AppText>
          <AppText variant="caption" tone="faint">
            {frenchWords} mots
          </AppText>
        </View>
        <TextArea
          value={value.frenchText}
          onChangeText={(frenchText) => onChange({ ...value, frenchText })}
          placeholder="Écris librement, avec tes mots…"
          accessibilityLabel="Texte en français"
        />
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between px-1">
          <AppText variant="overline" tone="muted" className="flex-1" numberOfLines={1}>
            2 · En anglais
          </AppText>
          <View className="flex-row items-center gap-2">
            <AppText variant="caption" tone="faint">
              {englishWords} words
            </AppText>
            <SpeakerButton text={value.englishText} speechKey={speechKey} />
          </View>
        </View>
        <TextArea
          value={value.englishText}
          onChangeText={(englishText) => {
            setFocusToken(null);
            onChange({ ...value, englishText });
          }}
          placeholder="Ta propre traduction, en anglais…"
          autoCorrect={false}
          spellCheck={false}
          autoCapitalize="sentences"
          accessibilityLabel="Texte en anglais"
          minHeight={160}
        />
        <View className="flex-row gap-3 px-1">
          <Button
            label="Dictionnaire"
            icon="book"
            variant="secondary"
            onPress={() => setPopupWord('')}
            className="px-5 py-3"
          />
        </View>
      </View>

      {value.englishText.trim() ? (
        <View className="gap-4">
          <View className="flex-row items-center justify-between px-1">
            <AppText variant="overline" tone="muted">
              Relecture
            </AppText>
            <AppText variant="caption" tone={misspelled.length ? 'danger' : 'success'}>
              {!ready
                ? 'Chargement du lexique…'
                : misspelled.length
                  ? `${misspelled.length} mot(s) à vérifier`
                  : 'Aucune faute détectée'}
            </AppText>
          </View>
          <View className="rounded-3xl bg-surface px-6 py-5">
            {ready ? (
              <SpellCheckedText tokens={tokens} onPressWord={onPressWord} activeStart={focusToken?.start ?? null} />
            ) : (
              <AppText variant="body">{value.englishText}</AppText>
            )}
          </View>
          <AppText variant="caption" tone="faint" className="px-1">
            Touche un mot souligné pour voir des suggestions, ou n'importe quel mot pour l'ouvrir dans le dictionnaire.
          </AppText>

          {focusToken ? (
            <View className="gap-3 rounded-3xl bg-white px-5 py-5">
              <AppText variant="caption" tone="muted">
                « {focusToken.text} » — suggestions
              </AppText>
              <View className="flex-row flex-wrap gap-2">
                {suggestions.length === 0 ? (
                  <AppText variant="caption" tone="soft">
                    Aucune suggestion proche.
                  </AppText>
                ) : (
                  suggestions.map((s) => (
                    <Pressable
                      key={s}
                      accessibilityRole="button"
                      accessibilityLabel={`Remplacer par ${s}`}
                      onPress={() => replaceToken(focusToken, s)}
                      className="rounded-full bg-brand px-4 py-2 active:opacity-80"
                    >
                      <AppText variant="caption" tone="inverse" className="font-medium">
                        {s}
                      </AppText>
                    </Pressable>
                  ))
                )}
              </View>
              <View className="flex-row flex-wrap gap-4 pt-1">
                <Pressable accessibilityRole="button" onPress={() => setPopupWord(focusToken.text)} hitSlop={8}>
                  <AppText variant="caption" tone="brand">
                    Chercher dans le dictionnaire
                  </AppText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    checker.addWords([focusToken.text]);
                    void addCustomWord(focusToken.text);
                    setFocusToken(null);
                  }}
                  hitSlop={8}
                >
                  <AppText variant="caption" tone="muted">
                    Accepter ce mot
                  </AppText>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
      ) : null}

      <View className="gap-3">
        <Button label="Sauvegarder dans le coffre-fort" icon="lock" fullWidth loading={saving} onPress={onSave} />
        {savedAt ? (
          <AppText variant="caption" tone="success" className="text-center">
            Enregistré à {savedAt}. Tu peux revenir le compléter à tout moment.
          </AppText>
        ) : null}
      </View>

      <DictionaryPopup visible={popupWord !== null} initialQuery={popupWord ?? ''} onClose={() => setPopupWord(null)} />
    </View>
  );
}
