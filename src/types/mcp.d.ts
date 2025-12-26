// Tipos para el SDK de MCP
declare module '@modelcontextprotocol/sdk/dist/esm/server/mcp' {
  export class McpServer {
    constructor(serverInfo: { name: string; version: string });
    registerTool(
      name: string,
      config: {
        title?: string;
        description?: string;
        inputSchema?: any;
      },
      callback: (args: any) => Promise<any>
    ): void;
    connect(app: any): Promise<void>;
  }
}

declare module '@modelcontextprotocol/sdk/dist/esm/server/express' {
  export function createMcpExpressApp(options?: { host?: string }): any;
}