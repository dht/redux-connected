type HookType = 'postBuild' | 'preBuild';

type Hook = {
    type: HookType;
    callback: (data: any) => void;
};

export class Hooks {
    private hooks: Hook[] = [];

    set preBuild(callback: any) {
        this.hooks.push({
            type: 'preBuild',
            callback,
        });
    }

    set postBuild(callback: any) {
        this.hooks.push({
            type: 'postBuild',
            callback,
        });
    }

    getHooksByType(hookType: HookType) {
        return this.hooks.filter((hook) => hook.type === hookType);
    }
}
