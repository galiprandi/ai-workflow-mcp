# AI Workflow - MCP

MCP server that enables development workflows (for example, bootstrapping Jira tasks) using the official Model Context Protocol SDK on Express.

## Requirements
- Node.js ≥ 18
- npm

## Installation
```bash
npm install
```

## Development usage
```bash
npm run dev
```

## Build and run
```bash
npm run build
npm start
```

## Configuration
Optional environment variables:
- `PORT`: HTTP port (default 3000).
- `HOST`: listen host (default 127.0.0.1).
- `MCP_SERVER_NAME`: name shown in logs (default `AI-Workflow MCP Server`).

## Endpoints
- `GET /.well-known/mcp-configuration`: MCP metadata and SSE endpoint.
- `GET /mcp/sse`: SSE handshake.
- `POST /mcp/messages`: JSON-RPC message intake.

## Included MCP tools
- `jira-dev-start`: generates a prompt to kick off development for a Jira task. Parameters:
  - `jiraIdOrUrl` (optional): Jira ID or URL (e.g., `ARC-123` or `https://.../browse/ARC-123`).

## Project structure
- `src/main.ts`: Express server and MCP tool registration.
- `src/config.ts`: basic configuration.
- `src/utils.ts`: utilities (e.g., prompt loading).
- `src/tools/jira-dev-start/prompt.md`: prompt template for Jira.

## License
MIT
