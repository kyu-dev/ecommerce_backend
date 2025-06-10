import { Request, Response } from 'express'; // import pour les types

export function sayHello(req: Request, res: Response) {
    res.send("Hello TypeScript 👋");
}