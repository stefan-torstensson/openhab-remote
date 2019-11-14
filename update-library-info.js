const checker = require("license-checker");
const fs = require("fs");
const path = require("path");

// Primary ordering
const ordered = ["vue@", "vue-", "aurelia", "core-js"].reverse();
const excluded = ["openhab-remote"];

const baseDir = __dirname;
const targetFile = path.join(baseDir, "src/", "libraries.json");

async function getLicenses(startDir) {
    const options = {
        start: startDir,
        customFormat: {
            "licenses": true,
            "name": true,
            "version": true,
            "description": "",
            "copyright": "",
            "repository": false,
            "path": false,
            "licenseFile": false,
            "licenseText": false
        },
        production: true
    };
    return new Promise((resolve, reject) => {
        checker.init(options, (err, packages) => {
            if (err) {
                reject(err);
            } else {
                resolve(packages);
            }
        });
    });
}

function indexIn(arr, packageName) {
    return arr.findIndex(entry => packageName.startsWith(entry)) + 1;
}

async function run() {
    console.log(`Writing library information to ${targetFile}`);

    const packages = await getLicenses(baseDir);
    const sorted = Object.keys(packages)
        .filter(name => !indexIn(excluded, name))
        .sort((a, b) => {
            const primary = indexIn(ordered, b) - indexIn(ordered, a);
            return primary || a.localeCompare(b);
        })
        .map(name => packages[name]);

    const content = JSON.stringify(sorted, null, 4);
    fs.writeFile(targetFile, content, null, err => {
        if (err) throw err;
    });
}

run();




