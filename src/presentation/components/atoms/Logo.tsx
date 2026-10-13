import { Image } from 'react-native';

const LOGO = require('../../../../assets/logo.png');

export interface LogoProps {
  size?: number;
}

/** The LexiDrive mark: an "L" drawn as a turning road, with the dot of the "i". */
export function Logo({ size = 56 }: LogoProps) {
  return <Image source={LOGO} style={{ width: size, height: size }} accessibilityLabel="LexiDrive" />;
}
