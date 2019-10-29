const options = {
    tizenPath: "tizen/",
    outPath: "./build/",
};

const convertSvg = require("./grunt/svg2png");

module.exports = grunt => {
    const certificate = "Samsung";
    const prod = grunt.option("prod");

    if (grunt.option("time")) {
        require("time-grunt")(grunt);
    }
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-env");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.config.init({
        env: require("./grunt/options/env"),
        tizen: require("./grunt/options/tizen")(grunt, options),
        shell: require("./grunt/options/shell")(grunt, options),
        clean: {
            build: [options.outPath]
        },
    });

    grunt.registerTask("convert-icon", function() {
        const done = this.async();
        convertSvg("./src/style/app-icon.svg", options.outPath + "app-icon.png").then(done);
    });

    grunt.registerTask("default", "watch");
    grunt.registerTask("build", "Build deployment package. Add --prod flag for optimized build.",
        ["clean", "bundle", "package"]);
    grunt.registerTask("test", ["shell:test"]);

    grunt.registerTask("install", "Install package on connected target device", [`shell:install`]);
    grunt.registerTask("uninstall", "Uninstall package from connected target device", [`shell:uninstall`]);

    grunt.registerTask("start", "Start application on connected device", ["shell:kill", "shell:start"]);
    grunt.registerTask("stop", "Stop application on connected target device", ["shell:kill"]);
    grunt.registerTask("debug", "Start application in debug mode on target device. Open debugger on http://localhost:4711",
        ["start", "shell:portForward:4711"]);

    grunt.registerTask("bundle", "Build application bundle. Add --prod flag for optimized bundling.",
        ["env:prod", `shell:bundle${prod ? ":prod" : ""}`]);
    grunt.registerTask("package", "Assemble Tizen package from build output.",
        ["convert-icon", "shell:tizen-build", `shell:tizen-package:${certificate}`]);
    grunt.registerTask("watch", "Start dev server on port 80 and watch for file changes", ["shell:watch"]);
    grunt.registerTask("watch-offline", "Same as watch but with event listener disabled ", ["shell:watch:OFFLINE"]);
};
