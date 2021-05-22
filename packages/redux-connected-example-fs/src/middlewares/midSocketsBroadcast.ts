export const middlewareSockets = () => (req: any, res: any, next: any) => {
    console.log('req.method ->', req.method);
    console.log('req.path ->', req.path);

    next();
};
