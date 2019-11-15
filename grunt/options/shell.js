const path = require("path");

class TizenTools {
    constructor(grunt) {
        this.grunt = grunt;
        this.win32 = process.platform === "win32";
    }
    
    get tizenHome() {
        return process.env["TIZEN_HOME"] || grunt.fail.fatal(
            "TIZEN_HOME must be set to the installation path of Tizen Studio");
    }
    
    get sdb() {
        return path.join(this.tizenHome, "/tools/sdb");
    }
    
    get tizen() {
        return path.join(this.tizenHome, `/tools/ide/bin/tizen${this.win32 ? ".bat" : ""}`);
    }
}

module.exports = (grunt, options) => {

    let debugPort = 0;
    const buildDir = options.outPath;

    const tools = new TizenTools(grunt);

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
            command: () => `${tools.tizen} build-web -- ${buildDir}`
        },
        "tizen-package": {
            command: cert => `${tools.tizen} package -t wgt -s ${cert} -- ${buildDir}`
        },
        install: () => `${tools.sdb} install "${path.join(buildDir, tizen().appName)}.wgt"`,
        uninstall: () => `${tools.sdb} uninstall ${tizen().package}`,
        start: {
            command: () => `${tools.sdb} shell app_launcher -w -s ${tizen().appId}`,
            options: {
                callback: (error, stdout, stderr, done) => {
                    const match = /port:\s?(\d+)/.exec(stdout);
                    debugPort = parseInt(match[1], 10);
                    done(error);
                }
            }
        },
        portForward: localPort => `${tools.sdb} forward --remove-all && ${tools.sdb} forward tcp:${localPort} tcp:${debugPort}`,
        kill: () => `${tools.sdb} shell app_launcher -k ${tizen().appId}`,
        test: "mocha-webpack -c"
    }
};
