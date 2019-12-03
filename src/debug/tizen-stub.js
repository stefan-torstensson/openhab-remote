if (!global.tizen) {
    global.tizen = {
        systeminfo: {
            getCapability() {
                return false;
            }
        }
    };
}

