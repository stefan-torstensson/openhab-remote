const path = require("path");

module.exports = (grunt, options) => {

    let debugPort = 0;

    const win32 = process.platform === "win32";
    const tizenHome = process.env["TIZEN_HOME"];

    const tizenCmd = path.join(tizenHome, `/tools/ide/bin/tizen${win32 ? ".bat" : ""}`);
    const sdbCmd = path.join(tizenHome, "/tools/sdb");

    const buildDir = options.outPath;

    function tizen() {
        return grunt.config.get("tizen");
    }

    return {
        bundle: target => {
            const prodParams = (target === "prod") ?  "-p --devtool none" : "";
            return `webpack --config webpack.bundle.js ${prodParams}`
        },
        watch: params => {
            const cmd = "webpack-dev-server --config webpack.dev.js";
            if (params) {
                return cmd + ` --define ${params}`;
            }
            return cmd;
        },
        "tizen-build": {
            command: `${tizenCmd} build-web -- ${buildDir}`
        },
        "tizen-package": {
            command: cert => `${tizenCmd} package -t wgt -s ${cert} -- ${buildDir}`
        },
        install: () => `${sdbCmd} install "${path.join(buildDir, tizen().appName)}.wgt"`,
        uninstall: () => `${sdbCmd} uninstall ${tizen().package}`,
        start: {
            command: () => `${sdbCmd} shell app_launcher -w -s ${tizen().appId}`,
            options: {
                callback: (error, stdout, stderr, done) => {
                    const match = /port:\s?(\d+)/.exec(stdout);
                    debugPort = parseInt(match[1], 10);
                    done(error);
                }
            }
        },
        portForward: localPort => `${sdbCmd} forward --remove-all && ${sdbCmd} forward tcp:${localPort} tcp:${debugPort}`,
        kill: () => `${sdbCmd} shell app_launcher -k ${tizen().appId}`,
        test: "mocha-webpack -c"
    }
};
