import { Server } from "http";
import server from "./server";
import { getPort } from "./utils";

export function startServer(server: Server, port: number) {
  try {
    server.listen(port, () => {
      console.log(`Service is running on http://localhost:${port}`);
    });
  } catch (e) {
    console.log("Failed to start server", e);
  }
}

startServer(server, getPort());
