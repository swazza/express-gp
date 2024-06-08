import * as env from "env-var";

export type Config = {
  port: number;
  gitSHA: string;
};

export const config: Config = {
  port: env.get("PORT").required().asPortNumber(),
  gitSHA: env.get("GIT_SHA").required().asString(),
};
