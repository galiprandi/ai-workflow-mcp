import express from 'express';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { config } from './config.js';
import { URL } from 'node:url';
import { loadPrompt } from './utils.js';

// MCP server instance using official SDK
const mcp = new McpServer({
  name: config.serverName,
  version: config.serverVersion
});

// MCP tool registration
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
    const promptPath = new URL('./tools/jira-dev-start/prompt.md', import.meta.url);
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

// Express app from SDK with DNS rebinding protection on localhost
const app = createMcpExpressApp({ host: config.host });

// MCP config: indicates where to initialize SSE
app.get('/.well-known/mcp-configuration', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host') ?? `${config.host}:${config.port}`}`;
  res.json({
    mcpVersion: '2024-11-05',
    name: config.serverName,
    version: config.serverVersion,
    capabilities: {},
    endpoints: {
      sse: {
        url: `${baseUrl}/mcp/sse`
      }
    }
  });
});

// Active transports map by sessionId
const transports: Record<string, SSEServerTransport> = {};

// SSE handshake: create transport and connect MCP server
app.get('/mcp/sse', async (req, res) => {
  try {
    const transport = new SSEServerTransport('/mcp/messages', res);
    const sessionId = transport.sessionId;
    transports[sessionId] = transport;

    transport.onclose = () => {
      delete transports[sessionId];
    };

    await mcp.connect(transport);
  } catch (error: any) {
    console.error('Error estableciendo SSE:', error);
    if (!res.headersSent) {
      res.status(500).send('Error estableciendo SSE');
    }
  }
});

// Endpoint to receive client JSON-RPC messages
app.post('/mcp/messages', async (req, res) => {
  const sessionId = req.query.sessionId as string | undefined;
  if (!sessionId) {
    res.status(400).send('Missing sessionId parameter');
    return;
  }

  const transport = transports[sessionId];
  if (!transport) {
    res.status(404).send('Session not found');
    return;
  }

  try {
    await transport.handlePostMessage(req as any, res as any, req.body);
  } catch (error: any) {
    console.error('Error manejando mensaje:', error);
    if (!res.headersSent) {
      res.status(500).send('Error manejando mensaje');
    }
  }
});

const port = config.port;
const host = config.host;
const serverName = process.env.MCP_SERVER_NAME || config.serverName;

app.listen(port, host, () => {
  console.log(`${serverName} listening on http://${host}:${port}`);
  console.log('Available endpoints:');
  console.log(`  GET  /.well-known/mcp-configuration - MCP configuration`);
  console.log(`  GET  /mcp/sse                   - SSE initialization`);
  console.log(`  POST /mcp/messages              - Receive JSON-RPC messages`);
});