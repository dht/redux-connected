export const middlewarePing = () => (req: any, res: any, next: any) => {
    res.json({ pong: true });
};
