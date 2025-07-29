import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createServer } from "./mcp/index.js";

// Define our MCP agent with tools
export class FigmaMcpAgent extends McpAgent {
  server = new McpServer({
    name: "Authless Calculator",
    version: "1.0.0",
  });

  async init() {
    console.log('init');
    this.server = createServer({
      figmaApiKey: process.env.FIGMA_API_KEY || '',
      figmaOAuthToken: '',
      useOAuth: false,
    });
  }
}

export default {
  fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return FigmaMcpAgent.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return FigmaMcpAgent.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};