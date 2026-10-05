import { Pressable, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import { AppText, Icon, type IconName } from '../atoms';

export interface QuickActionTileProps {
  icon: IconName;
  label: string;
  caption?: string;
  onPress: () => void;
  emphasis?: boolean;
  disabled?: boolean;
}

/** Floating action row: icon in a soft disc, generous padding, no box border. */
export function QuickActionTile({
  icon,
  label,
  caption,
  onPress,
  emphasis = false,
  disabled = false,
}: QuickActionTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      className={`flex-row items-center gap-5 rounded-3xl px-5 py-5 active:opacity-70 ${
        emphasis ? 'bg-brand' : 'bg-surface'
      } ${disabled ? 'opacity-40' : ''}`}
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-full ${emphasis ? 'bg-brand-deep' : 'bg-canvas'}`}
      >
        <Icon name={icon} size={18} color={emphasis ? colors.white : colors.brand} />
      </View>
      <View className="flex-1 gap-0.5">
        <AppText variant="subheading" tone={emphasis ? 'inverse' : 'ink'}>
          {label}
        </AppText>
        {caption ? (
          <AppText
            variant="caption"
            tone={emphasis ? 'inverse' : 'muted'}
            className={emphasis ? 'opacity-80' : ''}
            numberOfLines={2}
          >
            {caption}
          </AppText>
        ) : null}
      </View>
      <Icon name="arrow-up-right" size={18} color={emphasis ? colors.white : colors.inkFaint} />
    </Pressable>
  );
}
