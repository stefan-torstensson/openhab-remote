declare var tizen: org.tizen.Tizen;

declare namespace org.tizen {

    interface Tizen {
        application: ApplicationManager;
    }

    interface ApplicationManager {
        getCurrentApplication(): Application;
    }

    interface Application {
        hide(): void;
        exit(): void;
    }
}
