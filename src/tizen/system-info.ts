export enum Capability {
    BEZEL_SUPPORT = "http://tizen.org/feature/input.rotating_bezel"
}

export class SystemInfo {
    private static _instance: SystemInfo;
    private readonly tizen: org.tizen.Tizen;

    constructor(tizen: Tizen) {
        this.tizen = tizen;
    }

    static get instance(): SystemInfo {
        if (!SystemInfo._instance) {
            SystemInfo._instance = new SystemInfo(global.tizen);
        }
        return SystemInfo._instance;
    }

    has(capability: Capability) {
        if (this.tizen) {
            return !!this.tizen.systeminfo.getCapability(capability);
        }
        console.warn(`Can't check if ${capability} is supported`);
    }
}

