import { Server } from "http";
import server from "./server";
import { getPort, serverLogger } from "./utils";

export function startServer(server: Server, port: number) {
  try {
    server.listen(port, () => {
      serverLogger.info({ port }, "Service is running");
    });
  } catch (e) {
    serverLogger.error({ error: e }, "Failed to start server");
  }
}

startServer(server, getPort());
