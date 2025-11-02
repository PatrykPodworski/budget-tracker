import { app } from "@azure/functions";
import { healthCheck } from "../lib/health-check";

app.http("health-check", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: healthCheck,
});
