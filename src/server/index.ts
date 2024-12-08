#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { toolDefinitions } from './toolDefinitions';
import { ConfigManager } from '../config';
import { FileSystemManager } from '../utils/fileSystem';
import { KnowledgeGraphManager } from "../services/KnowledgeGraphManager";
import path from "path";

async function initializeServer() {
  const memoryFilePath = ConfigManager.getMemoryFilePath(process.argv.slice(2));
  await FileSystemManager.ensureDirectoryExists(path.dirname(memoryFilePath));

  const knowledgeGraphManager = new KnowledgeGraphManager(memoryFilePath);
  const server = createServer();

  setupRequestHandlers(server, knowledgeGraphManager);

  return { server, memoryFilePath };
}

function createServer() {
  return new Server({
    name: "memory-server",
    version: "1.0.0",
  }, {
    capabilities: {
      tools: {},
    },
  });
}

function setupRequestHandlers(server: Server, manager: KnowledgeGraphManager) {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error(`No arguments provided for tool: ${name}`);
    }

    return handleToolRequest(name, args, manager);
  });
}

async function handleToolRequest(name: string, args: any, manager: KnowledgeGraphManager) {
  const handlers = {
    // Create operations
    create_entities: () => manager.createEntities(args.entities),
    create_relations: () => manager.createRelations(args.relations),

    // Add operations
    add_observations: () => manager.addObservations(args.observations),

    // Delete operations
    delete_entities: async () => {
      await manager.deleteEntities(args.entityNames);
      return "Entities deleted successfully";
    },
    delete_observations: async () => {
      await manager.deleteObservations(args.deletions);
      return "Observations deleted successfully";
    },
    delete_relations: async () => {
      await manager.deleteRelations(args.relations);
      return "Relations deleted successfully";
    },

    // Read operations
    read_graph: () => manager.readGraph(),

    // Search operations
    search_nodes: () => manager.searchNodes(args.query),
    open_nodes: () => manager.openNodes(args.names)
  };

  const handler = handlers[name as keyof typeof handlers];
  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }

  const result = await handler();
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
}

async function main() {
  try {
    const { server, memoryFilePath } = await initializeServer();
    console.error(`Knowledge Graph MCP Server running on stdio with memory file: ${memoryFilePath}`);

    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
  }
}

main();
