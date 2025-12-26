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
- `PORT`: HTTP port (default 43123).
- `HOST`: listen host (default 127.0.0.1).
- `MCP_SERVER_NAME`: name shown in logs (default `AI-Workflow MCP Server`).
- `ALLOWED_HOSTS`: comma-separated list of hosts allowed for binding/protection (default `localhost,127.0.0.1,0.0.0.0`).

## Endpoints
- `GET /.well-known/mcp-configuration`: MCP metadata and SSE endpoint.
- `GET /mcp/sse`: SSE handshake.
- `POST /mcp/messages`: JSON-RPC message intake.

## Included MCP tools
- `jira-dev-start`: generates a prompt to kick off development for a Jira task. Parameters:
  - `jiraIdOrUrl` (optional): Jira ID or URL (e.g., `ARC-123` or `https://.../browse/ARC-123`).

## Containerization
Build the image:
```bash
docker build -t ai-workflow-mcp .
```

Run the container:
```bash
docker run -p 43123:43123 ai-workflow-mcp
```

Override host/port if needed:
```bash
docker run -e PORT=8080 -e HOST=0.0.0.0 -p 8080:8080 ai-workflow-mcp
```

Allow specific hosts (rebinding protection):
```bash
docker run -e ALLOWED_HOSTS=localhost,127.0.0.1 -p 43123:43123 ai-workflow-mcp
```

### Windsurf MCP client config example
Add to your Windsurf `mcp_config.json`:
```json
"Cenco": {
  "args": [
    "mcp-remote@latest",
    "http://localhost:43123/mcp/sse"
  ],
  "command": "npx",
  "disabledTools": []
}
```

### Docker Compose
Build and run:
```bash
docker compose up --build
```

Stop:
```bash
docker compose down
```

## Project structure
- `src/main.ts`: Express server and MCP tool registration.
- `src/config.ts`: basic configuration.
- `src/utils.ts`: utilities (e.g., prompt loading).
- `src/tools/jira-dev-start/prompt.md`: prompt template for Jira.

## License
MIT
