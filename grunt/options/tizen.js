const convert = require("xml-js");
const path = require("path");

module.exports = (grunt, options) => {
    const configXml = grunt.file.read(path.join(options.tizenPath, "config.xml"));
    const tizenConfig = convert.xml2js(configXml, {compact: true});
    const tizenAppAttrs = tizenConfig.widget["tizen:application"]._attributes;
    const tizenAppName = tizenConfig.widget.name._text;
    return {
        appId: tizenAppAttrs.id,
        package: tizenAppAttrs.package,
        appName: tizenAppName
    };
};
