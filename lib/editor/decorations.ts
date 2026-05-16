"use client";

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, type EditorState, type Transaction } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { Node as PMNode } from "@tiptap/pm/model";
import { findKeyphraseRanges } from "@/lib/seo/nlp/stem";
import { isSentencePassive } from "@/lib/seo/nlp/passive-voice.en";
import { tokenizeSentences, tokenizeWords } from "@/lib/seo/nlp/tokenize";

export type DecorationSettings = {
  focusKeyword: string;
  showKeyword: boolean;
  showPassive: boolean;
  showLongSentence: boolean;
  showMissingAlt: boolean;
  longSentenceMin: number;
};

export const DEFAULT_DECORATION_SETTINGS: DecorationSettings = {
  focusKeyword: "",
  showKeyword: true,
  showPassive: false,
  showLongSentence: false,
  showMissingAlt: true,
  longSentenceMin: 20,
};

export const seoDecorationsKey = new PluginKey<{
  decos: DecorationSet;
  settings: DecorationSettings;
}>("seoDecorations");

/**
 * For each block node containing text, return the absolute start position of
 * its inline content, plus its concatenated text. We use these to map text
 * offsets back to absolute doc positions for inline decorations.
 */
function collectBlocks(doc: PMNode): { from: number; text: string; node: PMNode; pos: number }[] {
  const out: { from: number; text: string; node: PMNode; pos: number }[] = [];
  doc.descendants((node, pos) => {
    if (!node.isTextblock) return undefined;
    let text = "";
    node.descendants((child) => {
      if (child.isText) text += child.text ?? "";
      else if (child.type.name === "hardBreak") text += "\n";
      return false;
    });
    // pos is the position BEFORE the block; +1 = inside first child
    out.push({ from: pos + 1, text, node, pos });
    return false; // don't dive into children for our block-level walk
  });
  return out;
}

function buildDecorations(doc: PMNode, settings: DecorationSettings): DecorationSet {
  const decos: Decoration[] = [];
  const blocks = collectBlocks(doc);

  // 1. Focus keyword highlight
  if (settings.showKeyword && settings.focusKeyword.trim()) {
    for (const b of blocks) {
      const ranges = findKeyphraseRanges(b.text, settings.focusKeyword);
      for (const r of ranges) {
        decos.push(Decoration.inline(b.from + r.start, b.from + r.end, { class: "adm-kw" }));
      }
    }
  }

  // 2/3. Sentence-level: passive voice + long sentences
  if (settings.showPassive || settings.showLongSentence) {
    for (const b of blocks) {
      const sentences = tokenizeSentences(b.text);
      let cursor = 0;
      for (const sent of sentences) {
        const idx = b.text.indexOf(sent, cursor);
        if (idx < 0) continue;
        const absStart = b.from + idx;
        const absEnd = absStart + sent.length;
        cursor = idx + sent.length;

        if (settings.showLongSentence && tokenizeWords(sent).length > settings.longSentenceMin) {
          decos.push(Decoration.inline(absStart, absEnd, { class: "adm-long" }));
        }
        if (settings.showPassive && isSentencePassive(sent)) {
          decos.push(Decoration.inline(absStart, absEnd, { class: "adm-passive" }));
        }
      }
    }
  }

  // 4. Images missing alt
  if (settings.showMissingAlt) {
    doc.descendants((node, pos) => {
      if (node.type.name === "image") {
        const alt = String(node.attrs?.alt ?? "").trim();
        if (!alt) {
          decos.push(Decoration.node(pos, pos + node.nodeSize, { class: "img-missing-alt" }));
        }
      }
      return undefined;
    });
  }

  return DecorationSet.create(doc, decos);
}

export const SeoDecorations = Extension.create({
  name: "seoDecorations",

  addOptions() {
    return { settings: { ...DEFAULT_DECORATION_SETTINGS } } as { settings: DecorationSettings };
  },

  addProseMirrorPlugins() {
    const initialSettings = this.options.settings;
    return [
      new Plugin({
        key: seoDecorationsKey,
        state: {
          init(_, state: EditorState) {
            return {
              settings: initialSettings,
              decos: buildDecorations(state.doc, initialSettings),
            };
          },
          apply(tr: Transaction, value, _oldState, newState) {
            const next = tr.getMeta(seoDecorationsKey) as DecorationSettings | undefined;
            const settings = next ?? value.settings;
            if (next || tr.docChanged) {
              return { settings, decos: buildDecorations(newState.doc, settings) };
            }
            return value;
          },
        },
        props: {
          decorations(state) {
            return seoDecorationsKey.getState(state)?.decos;
          },
        },
      }),
    ];
  },
});

/** Helper: dispatch new settings to the editor via a meta transaction. */
export function setDecorationSettings(view: { state: EditorState; dispatch: (tr: Transaction) => void }, settings: DecorationSettings) {
  const tr = view.state.tr.setMeta(seoDecorationsKey, settings);
  view.dispatch(tr);
}
