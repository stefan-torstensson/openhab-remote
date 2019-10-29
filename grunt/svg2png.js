const sharp=require("sharp");

module.exports = function(src, dest) {
    return sharp(src).png().toFile(dest);
};

