export type MarkdownParagraphBlock = {
  type: 'paragraph';
  text: string;
};

export type MarkdownUnorderedListBlock = {
  type: 'unordered-list';
  items: string[];
};

export type MarkdownOrderedListBlock = {
  type: 'ordered-list';
  items: string[];
};

export type MarkdownSpacerBlock = {
  type: 'spacer';
};

export type MarkdownBlock =
  | MarkdownParagraphBlock
  | MarkdownUnorderedListBlock
  | MarkdownOrderedListBlock
  | MarkdownSpacerBlock;

const UNORDERED_LIST_LINE = /^[-*•]\s+(.+)$/;
const ORDERED_LIST_LINE = /^\d+[.)]\s+(.+)$/;

function parseUnorderedListItem(line: string): string | null {
  const match = line.trim().match(UNORDERED_LIST_LINE);
  return match?.[1] ?? null;
}

function parseOrderedListItem(line: string): string | null {
  const match = line.trim().match(ORDERED_LIST_LINE);
  return match?.[1] ?? null;
}

function isListLine(line: string): boolean {
  const trimmed = line.trim();
  return UNORDERED_LIST_LINE.test(trimmed) || ORDERED_LIST_LINE.test(trimmed);
}

export function parseMarkdownBlocks(input: string): MarkdownBlock[] {
  const lines = input.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      const previous = blocks[blocks.length - 1];
      if (previous?.type !== 'spacer') {
        blocks.push({ type: 'spacer' });
      }
      index += 1;
      continue;
    }

    const unorderedItem = parseUnorderedListItem(line);
    if (unorderedItem != null) {
      const items: string[] = [unorderedItem];
      index += 1;
      while (index < lines.length) {
        const nextItem = parseUnorderedListItem(lines[index]);
        if (nextItem == null) {
          break;
        }
        items.push(nextItem);
        index += 1;
      }
      blocks.push({ type: 'unordered-list', items });
      continue;
    }

    const orderedItem = parseOrderedListItem(line);
    if (orderedItem != null) {
      const items: string[] = [orderedItem];
      index += 1;
      while (index < lines.length) {
        const nextItem = parseOrderedListItem(lines[index]);
        if (nextItem == null) {
          break;
        }
        items.push(nextItem);
        index += 1;
      }
      blocks.push({ type: 'ordered-list', items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const current = lines[index];
      if (current.trim().length === 0 || isListLine(current)) {
        break;
      }
      paragraphLines.push(current);
      index += 1;
    }

    blocks.push({ type: 'paragraph', text: paragraphLines.join('\n') });
  }

  return blocks;
}

export function markdownBlocksToPlainText(blocks: MarkdownBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === 'paragraph') {
        return block.text;
      }
      if (block.type === 'unordered-list' || block.type === 'ordered-list') {
        return block.items.join('\n');
      }
      return '';
    })
    .filter((part) => part.length > 0)
    .join('\n\n');
}
