export const config = {
  port: parseInt(process.env.PORT || '43123', 10),
  host: process.env.HOST || '127.0.0.1',
  allowedHosts: (process.env.ALLOWED_HOSTS || 'localhost,127.0.0.1,0.0.0.0')
    .split(',')
    .map(h => h.trim())
    .filter(Boolean),
  serverName: 'AI-Workflow MCP Server',
  serverVersion: '1.0.0'
};