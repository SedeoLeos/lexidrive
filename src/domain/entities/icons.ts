/**
 * Icon identifiers used by domain-level definitions (achievements, path steps).
 * Kept as a plain string union so the domain stays free of UI libraries;
 * every value is a valid Feather icon name.
 */
export type IconName =
  | 'award'
  | 'book-open'
  | 'check-circle'
  | 'clock'
  | 'edit-3'
  | 'feather'
  | 'headphones'
  | 'layers'
  | 'star'
  | 'sun'
  | 'target'
  | 'trending-up'
  | 'zap'
  | 'coffee'
  | 'compass';
