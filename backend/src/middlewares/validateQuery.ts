import type { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import z from 'zod';

export function validateQuery(querySchema: ZodType) {

    type Query = z.infer<typeof querySchema>
    return (req: Request<unknown, unknown, unknown, Query>, res: Response, next: NextFunction) => {
        const parseResult = querySchema.safeParse(req.query);
        if (!parseResult.success) {
            return res.status(400).json({ message: "Invalid query", errors: z.treeifyError(parseResult.error) });
        }
        req.query = parseResult.data;
        next();
    }


}