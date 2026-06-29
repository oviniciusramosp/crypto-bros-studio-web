import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { chartBlock } from './chartBlock';
import { dividerBlock } from './dividerBlock';
import { calloutBlock } from './calloutBlock';

// Full default block set (paragraph, headings, lists, checklist, quote, code,
// image, video, table, …) + our custom blocks.
// createReactBlockSpec returns a factory (options?) => BlockSpec — call it.
export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    chart: chartBlock(),
    divider: dividerBlock(),
    callout: calloutBlock(),
  },
});
