#!/usr/bin/env node
/**
 * dashboard-only.js
 * 
 * Run the WP-MCP Dashboard standalone (without MCP stdio connection)
 * Use this when you want to access the dashboard at http://localhost:5175
 */

import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.error(`[Dashboard] Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.error(`[Dashboard] Client disconnected: ${socket.id}`);
  });
});

const DASHBOARD_PORT = process.env.WP_MCP_DASHBOARD_PORT || 5175;

httpServer.listen(DASHBOARD_PORT, () => {
  console.error(`\n🎨 WP-MCP Dashboard running on http://localhost:${DASHBOARD_PORT}\n`);
  console.error("Note: This is the dashboard-only mode. For full MCP functionality, use the main server.\n");
});
