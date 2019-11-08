declare var tizen: org.tizen.Tizen;


declare namespace org.tizen {

    interface Tizen {
        application: ApplicationManager;
        filesystem: FileSystemManager;
    }

    interface ApplicationManager {
        getCurrentApplication(): Application;
    }

    interface Application {
        hide(): void;

        exit(): void;
    }

    interface FileSystemManager {
        resolve(path: string, successCallback: (fileHandle: File) => void, errorCallback?: (error:Error) => void, fileMode?: string): void
    }

    interface File {
        readonly readOnly: boolean;
        readonly isFile:boolean;
        readonly isDirectory:boolean;
        readonly path: string;
        openStream(mode: string, onsuccess: (stream: FileStream) => void, onerror?: (error:Error) => void, encoding?: string): void;
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
}
