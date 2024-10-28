import { RequestHandler, ResponseHandler } from "itty-router";
import { Logger } from "./logger";
import { Metrics } from "./metrics";

export const upstreamMiddleware: RequestHandler = (request) => {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  request.startTime = startTime;
  request.requestId = requestId;
  Logger.info("Request received", {
    requestId,
    method: request.method,
    url: request.url,
  });
};

export const downstreamMiddleware: ResponseHandler<any> = (
  response,
  request
) => {
  const duration = Date.now() - request.startTime;
  Metrics.getInstance().recordTiming("request_duration", duration);
  Logger.info("Request completed", {
    requestId: request.requestId,
    duration,
    status: response.status,
  });
};
