import type { FastifyRequest, FastifyReply } from 'fastify';
import { db } from './database/index';
export interface User {
    id: string;
    email: string;
    username: string;
    bio?: string;
    image?: string;
}
export interface Context {
    req: FastifyRequest;
    res: FastifyReply;
    db: typeof db;
    user?: User;
}
export declare function createContext({ req, res }: {
    req: FastifyRequest;
    res: FastifyReply;
}): Promise<Context>;
//# sourceMappingURL=context.d.ts.map