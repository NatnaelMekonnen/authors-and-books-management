import * as cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import * as express from "express";
import { WebSocketServer } from "ws";
import { execute, subscribe } from "graphql";
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from "graphql-ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { SubscriptionServer, GRAPHQL_WS } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema/index";
import resolvers from "./resolver/index";
import env from "./config/env.config";
import { connection } from "./config/db.config";

const { PORT } = env;
const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();

// graphql-ws
const graphqlWs = new WebSocketServer({ noServer: true });
useServer({ schema }, graphqlWs);

// subscriptions-transport-ws
const subTransWs = new WebSocketServer({ noServer: true });
SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  subTransWs,
);

// create http server
const httpServer = createServer(app);

// listen for upgrades and delegate requests according to the WS sub-protocol
httpServer.on("upgrade", (req, socket, head) => {
  // extract websocket sub-protocol = require( header)
  const protocol = req.headers["sec-websocket-protocol"];
  const protocols = Array.isArray(protocol)
    ? protocol
    : protocol?.split(",").map((p) => p.trim());

  // decide which websocket server to use
  const wss =
    protocols?.includes(GRAPHQL_WS) && // subscriptions-transport-ws sub-protocol
    !protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL) // graphql-ws sub-protocol
      ? subTransWs
      : // graphql-ws will welcome its own sub-protocol and
        // gracefully reject invalid ones. if the client supports
        // both transports, graphql-ws will prevail
        graphqlWs;
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

/* Creating a new ApolloServer instance. */
const server = new ApolloServer({
  // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  schema,
  context: ({ req }) => ({ req }),
  cache: "bounded",
});

/* Initializing the firebase admin SDK. */
// initializeFirebase();

/* Setting the limit of the data that can be sent to the server. */
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ limit: "3mb", extended: true }));
app.use(express.static("public"));
app.use(cors({ origin: "*" }));

app.get("/", (_req, res) => res.end("API running..."));

connection().then(async () => {
  await server.start();
  server.applyMiddleware({ app, path: "/API/v1" });
  httpServer.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Server is now running on http://localhost:${PORT}${server.graphqlPath}`,
    );
  });
});
