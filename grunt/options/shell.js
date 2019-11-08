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

    function envParams(params) {
        return params.filter(p => p).map(p => `--env.${p}`).join(" ");
    }

    function withLog(cmdline) {
        grunt.log.writeln("webpack command: " + cmdline);
        return cmdline;
    }

    return {
        bundle: (target, ...params)=> {
            const prodParams = (target === "prod") ?  "-p --devtool none" : "";
            return withLog(`webpack --config webpack.bundle.js ${prodParams} ${envParams(params)}`);
        },
        watch: (...params) => {
            return withLog("webpack-dev-server --config webpack.dev.js " + envParams(params));
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
