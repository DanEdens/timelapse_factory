const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

const promiseLoop = function (condition, body) {
    var loop = function () {
        if (condition()) {
            return body().then(loop);
        }
    };
    return Promise.resolve().then(loop);
};

const getBrowserFrames = function (frame) {
    return [frame].concat(...frame.childFrames().map(getBrowserFrames));
};

const getSelectorDimensions = function (page, selector) {
    return page.evaluate(function (selector) {
        var el = document.querySelector(selector);
        var dim = el.getBoundingClientRect();
        if (el) {
            return {
                left: dim.left,
                top: dim.top,
                right: dim.right,
                bottom: dim.bottom,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
                x: dim.x,
                y: dim.y,
                width: dim.width,
                height: dim.height
            };
        }
    }, selector);
};

const makeFilePathConverter = function (config) {
    var fileNameConverter = config.fileNameConverter;
    if (!fileNameConverter) {
        if (config.outputPattern) {
            fileNameConverter = function (num) {
                return sprintf(config.outputPattern, num);
            };
        } else if (config.frameProcessor && !config.outputDirectory) {
            fileNameConverter = function () {
                return undefined;
            };
        } else {
            fileNameConverter = function (num, maxNum) {
                var extension = config.screenshotType === 'jpeg' ? 'd.jpg' : 'd.png';
                var outputPattern = '%0' + maxNum.toString().length + extension;
                return sprintf(outputPattern, num);
            };
        }
    }
    return function (num, maxNum) {
        var fileName = fileNameConverter(num, maxNum);
        if (fileName) {
            return path.resolve(config.outputPath, fileName);
        } else {
            return undefined;
        }
    };
};

const writeFile = function (filePath, buffer) {
    makeFileDirectoryIfNeeded(filePath);
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, buffer, 'binary', function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

const makeFileDirectoryIfNeeded = function (filepath) {
    var dir = path.parse(filepath).dir, ind, currDir;
    var directories = dir.split(path.sep);
    for (ind = 1; ind <= directories.length; ind++) {
        currDir = directories.slice(0, ind).join(path.sep);
        if (currDir && !fs.existsSync(currDir)) {
            fs.mkdirSync(currDir);
        }
    }
};

module.exports = {
    promiseLoop,
    getBrowserFrames,
    getSelectorDimensions,
    writeFile,
    makeFilePathConverter,
    makeFileDirectoryIfNeeded
};
