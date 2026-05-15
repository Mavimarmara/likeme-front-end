import React, { useMemo } from 'react';
import { Linking, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { parseMarkdownSegments } from '@/utils/parseMarkdown';
import { parseMarkdownBlocks } from '@/utils/parseMarkdownBlocks';
import type { LinkifiedSegment } from '@/utils/text/parseLinkifiedSegments';
import { parseLinkifiedPlainText } from '@/utils/text/parseLinkifiedSegments';
import { logger } from '@/utils/logger';
import { buildListMarkerStyle, defaultLinkStyle, styles } from './styles';

type MarkdownTextProps = {
  text: string;
  style?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

function openHref(href: string, context: string): void {
  Linking.openURL(href).catch((error: unknown) => {
    logger.warn(`[MarkdownText] Falha ao abrir ${context}.`, { href, error: String(error) });
  });
}

function renderLinkifiedSegments(
  segments: LinkifiedSegment[],
  keyPrefix: string,
  linkStyle?: StyleProp<TextStyle>,
): React.ReactNode[] {
  return segments.map((seg, i) => {
    const key = `${keyPrefix}-${i}`;
    if (seg.kind === 'text') {
      return <Text key={key}>{seg.text}</Text>;
    }
    if (seg.kind === 'url') {
      return (
        <Text
          key={key}
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
        key={key}
        accessibilityRole='link'
        style={[defaultLinkStyle, linkStyle]}
        onPress={() => openHref(seg.telHref, 'telefone')}
      >
        {seg.text}
      </Text>
    );
  });
}

function markdownSegmentStyle(segment: { bold: boolean; italic: boolean; underline: boolean }): TextStyle | undefined {
  if (!segment.bold && !segment.italic && !segment.underline) {
    return undefined;
  }

  return {
    ...(segment.bold ? { fontWeight: '700' as const } : null),
    ...(segment.italic ? { fontStyle: 'italic' as const } : null),
    ...(segment.underline ? { textDecorationLine: 'underline' as const } : null),
  };
}

function InlineMarkdown({
  text,
  style,
  linkStyle,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
}) {
  const markdownSegments = useMemo(() => parseMarkdownSegments(text), [text]);

  return (
    <Text style={style}>
      {markdownSegments.map((segment, index) => {
        const linkSegments = parseLinkifiedPlainText(segment.text);
        const segmentStyle = markdownSegmentStyle(segment);
        const keyPrefix = `md-${index}`;

        if (!segmentStyle) {
          return <Text key={keyPrefix}>{renderLinkifiedSegments(linkSegments, keyPrefix, linkStyle)}</Text>;
        }

        return (
          <Text key={keyPrefix} style={segmentStyle}>
            {renderLinkifiedSegments(linkSegments, keyPrefix, linkStyle)}
          </Text>
        );
      })}
    </Text>
  );
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ text, style, linkStyle, containerStyle }) => {
  const blocks = useMemo(() => parseMarkdownBlocks(text), [text]);

  if (blocks.length === 0) {
    return null;
  }

  const flatStyle = StyleSheet.flatten(style) ?? {};
  const markerStyle = buildListMarkerStyle(flatStyle);

  return (
    <View style={[styles.container, containerStyle]}>
      {blocks.map((block, blockIndex) => {
        if (block.type === 'spacer') {
          return <View key={`spacer-${blockIndex}`} style={styles.spacer} />;
        }

        if (block.type === 'paragraph') {
          return <InlineMarkdown key={`p-${blockIndex}`} style={style} linkStyle={linkStyle} text={block.text} />;
        }

        const ordered = block.type === 'ordered-list';

        return (
          <View key={`list-${blockIndex}`} style={styles.list}>
            {block.items.map((item, itemIndex) => (
              <View key={`${blockIndex}-${itemIndex}`} style={styles.listItem}>
                <Text style={markerStyle}>{ordered ? `${itemIndex + 1}.` : '•'}</Text>
                <View style={styles.listItemContent}>
                  <InlineMarkdown style={style} linkStyle={linkStyle} text={item} />
                </View>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};
