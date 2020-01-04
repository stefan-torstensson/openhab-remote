declare var tizen: org.tizen.Tizen;


declare namespace org.tizen {

    interface Tizen {
        application: ApplicationManager;
        filesystem: FileSystemManager;
        systeminfo: SystemInfo;
        keymanager: KeyManager;
    }

    interface SystemInfo {
        getCapability(key: string): any;
    }

    interface ApplicationManager {
        getCurrentApplication(): Application;
    }

    interface Application {
        hide(): void;

        exit(): void;
    }

    interface FileSystemManager {
        resolve(path: string, successCallback: (fileHandle: File) => void, errorCallback?: (error: Error) => void, fileMode?: string): void
    }

    interface File {
        readonly readOnly: boolean;
        readonly isFile: boolean;
        readonly isDirectory: boolean;
        readonly path: string;

        openStream(mode: string, onsuccess: (stream: FileStream) => void, onerror?: (error: Error) => void, encoding?: string): void;

        resolve(relativePath: string): File;

        createFile(relativePath: string): File
    }

    interface FileStream {
        readonly eof: boolean;
        position: number;
        readonly bytesAvailable: number;

        close(): void;

        read(charCount: number): string;

        write(text: string): void;
    }

    enum PermissionType {
        NONE = "NONE",
        READ = "READ",
        REMOVE = "REMOVE",
        READ_REMOVE = "READ_REMOVE"
    }

    interface KeyManagerAlias {
        packageId?: string;
        name: string;
        isProtected?: boolean;
    }

    interface KeyManager {
        saveData(name: string, rawData: string, password?: string, successCallback?: SuccessCallback,
                 errorCallback?: ErrorCallback): void;

        removeData(dataAlias: KeyManagerAlias): void;

        getData(dataAlias: KeyManagerAlias, password?: string): string;

        getDataAliasList(): KeyManagerAlias[];

        setPermission(dataAlias: KeyManagerAlias, packageId: string, permissionType: PermissionType,
                      successCallback?: SuccessCallback, errorCallback?: ErrorCallback): void;
    }

    interface SuccessCallback {
        onsuccess(): void;
    }

    interface ErrorCallback {
        onerror(e: Error): void;
    }
}

