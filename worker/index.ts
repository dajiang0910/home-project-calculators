import vinextHandler from "vinext/server/fetch-handler";
import { migrationRedirectResponse } from "../src/lib/seo/migration";

type WorkerEnv = {
  ENABLE_PRODUCTION_REDIRECTS?: string;
};

type WorkerExecutionContext = {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
};

function isRedirectEnabled(value: string | undefined): boolean {
  return value === "1" || value?.toLowerCase() === "true";
}

const worker = {
  async fetch(request: Request, env: WorkerEnv, executionContext: WorkerExecutionContext): Promise<Response> {
    const redirect = migrationRedirectResponse(request, isRedirectEnabled(env.ENABLE_PRODUCTION_REDIRECTS));
    if (redirect) return redirect;
    return vinextHandler.fetch(request, env, executionContext);
  },
};

export default worker;
