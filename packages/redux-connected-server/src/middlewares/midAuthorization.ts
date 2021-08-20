const isAuthorized = (req: any) => true;

export const middlewareAuthorization = () => (
    req: any,
    res: any,
    next: any
) => {
    if (isAuthorized(req)) {
        next();
    } else {
        res.sendStatus(401);
    }
};
