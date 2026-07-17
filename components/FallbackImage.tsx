import { useState } from 'react';
import { Image, ImageProps, ImageSourcePropType, View, StyleSheet } from 'react-native';
import { ImageOff } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface FallbackImageProps extends Omit<ImageProps, 'source'> {
  source: ImageSourcePropType;
}

export default function FallbackImage({ source, style, ...rest }: FallbackImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View style={[style, styles.placeholder]}>
        <ImageOff size={24} color={Colors.textMuted} strokeWidth={1.5} />
      </View>
    );
  }

  return <Image source={source} style={style} onError={() => setFailed(true)} {...rest} />;
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
