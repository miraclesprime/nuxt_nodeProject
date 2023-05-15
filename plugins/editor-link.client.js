import tippy from 'tippy.js';
import Link from '@tiptap/extension-link';
import { VueRenderer } from '@tiptap/vue-2';
import { getAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

import LinkTippy from '~/components/message/LinkTippy.vue';

export const ChatLink = Link.extend({
  onDestroy() {
    this.storage.tippyContent?.ref.$destroy();
    this.storage.tippy?.destroy();
  },
  addStorage() {
    const content = new VueRenderer(LinkTippy);

    return {
      tippyContent: content,
      tippy: tippy('body', {
        content: content.element,
        trigger: 'manual',
        animation: false,
        interactive: true,
        placement: 'top',
        maxWidth: null,
      })[0],
    };
  },
  addProseMirrorPlugins() {

    return [
      new Plugin({
        key: new PluginKey('handleClickOnLink'),
        props: {
          handleClick: (view, pos, event) => {
            const attrs = getAttributes(view.state, this.type.name);
            const link = event.target?.closest('a');

            if (link && attrs.href) {
              this.storage.tippyContent.updateProps({
                href: attrs.href,
                text: link.textContent,
              });
              this.storage.tippyContent.ref.$on('edit', () => {
                this.storage.tippy.hide();
                this.options.onEdit?.(link);
              });
              this.storage.tippyContent.ref.$on('remove', () => {
                this.storage.tippy.hide();
                this.options.onRemove?.(link);
              });
              this.storage.tippy.setProps({
                getReferenceClientRect: () => link.getBoundingClientRect(),
              });
              this.storage.tippy.show();
            }

            return false;
          },
        },
      }),
    ];
  },
});