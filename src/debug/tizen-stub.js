const keyPrefix = "secure-";


class KeyManager {
    getData(keyAlias) {
        return localStorage.getItem(this.getKey(keyAlias));
    }

    saveData(name, value) {
        localStorage.setItem(this.getKey({name}), value);
    }

    removeData(keyAlias) {
        localStorage.removeItem(this.getKey(keyAlias));
    }

    getDataAliasList() {
        const aliases = [];
        for(let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index);
            if (key.startsWith(keyPrefix)) {
                aliases.push({name: key.substring(keyPrefix.length)})
            }
        }
        return aliases;
    }

    getKey(keyAlias) {
        return keyPrefix + keyAlias.name;
    }
}

if (!global.tizen) {
    global.tizen = {
        systeminfo: {
            getCapability() {
                return false;
            }
        },
        keymanager: new KeyManager()
    };
}

