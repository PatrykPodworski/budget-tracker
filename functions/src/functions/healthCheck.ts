import { app } from "@azure/functions";
import { healthCheck } from "../lib/health-check";

app.http("healthCheck", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: healthCheck,
});
