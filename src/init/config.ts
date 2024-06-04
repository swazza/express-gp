import * as env from 'env-var';

export type Config = {
    port: number;
};

export const config: Config = {
    port: env.get('PORT').required().asPortNumber(),
};