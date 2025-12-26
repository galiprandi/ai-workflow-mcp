import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { URL } from 'node:url';
import { loadPrompt } from '../utils.js';

export function registerTools(mcp: McpServer) {
  registerJiraDevStart(mcp);
}

function registerJiraDevStart(mcp: McpServer) {
  mcp.registerTool(
    'jira-dev-start',
    {
      title: 'Jira Development Start',
      description: 'Comando para iniciar el desarrollo de una tarea de Jira',
      // Loose typing for JSON schema (AnySchema in SDK)
      inputSchema: {
        type: 'object',
        properties: {
          jiraIdOrUrl: {
            type: 'string',
            description: 'Jira ID o URL de la tarea (ej: ARC-123 o https://.../browse/ARC-123)'
          }
        },
        required: []
      } as any
    },
    async (args: any) => {
      const jiraRef = args?.jiraIdOrUrl || 'no proporcionado';
      const promptPath = new URL('./jira-dev-start/prompt.md', import.meta.url);
      const template = await loadPrompt(promptPath);
      const text = template.replace('{{JIRA_REF}}', jiraRef);
      return {
        content: [{
          type: 'text' as const,
          text
        }]
      };
    }
  );
}
