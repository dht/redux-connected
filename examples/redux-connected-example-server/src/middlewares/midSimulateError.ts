let simulatedErrorCount = 0;

export const middlewareSimulateError = (statusCode: number, limit?: number) => (
    req: any,
    res: any,
    next: any
) => {
    if (limit && simulatedErrorCount >= limit) {
        next();
        return;
    }

    switch (statusCode) {
        case 401:
            res.sendStatus(401);
            break;
        case 404:
            res.sendStatus(404);
            break;
        case 500:
            res.status(500).json({ message: 'could not find user' });
            break;
    }

    simulatedErrorCount++;
};
