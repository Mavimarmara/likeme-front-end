import React, { useMemo } from 'react';
import { Linking, StyleProp, Text, TextStyle } from 'react-native';
import { parseLinkifiedPlainText } from '@/utils/text/parseLinkifiedSegments';
import { logger } from '@/utils/logger';

const defaultLinkStyle: TextStyle = {
  color: '#2563eb',
  textDecorationLine: 'underline',
};

type LinkifiedTextProps = {
  text: string;
  style?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
};

function openHref(href: string, context: string): void {
  Linking.openURL(href).catch((error: unknown) => {
    logger.warn(`[LinkifiedText] Falha ao abrir ${context}.`, { href, error: String(error) });
  });
}

export const LinkifiedText: React.FC<LinkifiedTextProps> = ({ text, style, linkStyle }) => {
  const segments = useMemo(() => parseLinkifiedPlainText(text), [text]);

  return (
    <Text style={style}>
      {segments.map((seg, i) => {
        if (seg.kind === 'text') {
          return <Text key={i}>{seg.text}</Text>;
        }
        if (seg.kind === 'url') {
          return (
            <Text
              key={i}
              accessibilityRole='link'
              style={[defaultLinkStyle, linkStyle]}
              onPress={() => openHref(seg.href, 'URL')}
            >
              {seg.text}
            </Text>
          );
        }
        return (
          <Text
            key={i}
            accessibilityRole='link'
            style={[defaultLinkStyle, linkStyle]}
            onPress={() => openHref(seg.telHref, 'telefone')}
          >
            {seg.text}
          </Text>
        );
      })}
    </Text>
  );
};
