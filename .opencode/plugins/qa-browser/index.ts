import { Plugin } from '@opencode/plugin';
import { createBrowserTools, BASE_URL, schemas } from './browser.mjs';

export default Plugin.define({
  id: 'voitivaiti.qa-browser',
  async setup(ctx) {
    const browser = createBrowserTools(ctx.location.directory);
    await ctx.tool.transform(editor => {
      editor.namespace({ name: 'qa_browser', description: 'Restricted local Puppeteer browser for QA' });
      for (const [name, schema] of Object.entries(schemas)) {
        editor.add({
          name,
          description: schema.description,
          input: schema.input,
          options: { namespace: 'qa_browser', codemode: false },
          execute: async (input, context) => {
            await ctx.permission.assert({
              sessionID: context.sessionID, agent: context.agent,
              source: { type: 'tool', messageID: context.messageID, id: context.id },
              action: 'qa_browser', resources: [BASE_URL],
            });
            return { content: JSON.stringify(await browser.call(name, input, context)) };
          },
        });
      }
    });
    await ctx.session.hook('retry', async event => {
      if (event.agent === 'qa' && event.error.status === 429) {
        event.decision = { retry: false };
        await browser.cancel(event.sessionID, 'provider 429');
      }
    });
    return () => browser.dispose();
  },
});
