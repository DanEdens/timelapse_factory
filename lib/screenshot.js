const {getSelectorDimensions, makeFilePathConverter, makeFileDirectoryIfNeeded} = require('./utils.js');

module.exports = function (config) {
    var page = config.page;
    var log = config.log;
    var frameProcessor = config.frameProcessor;
    var screenshotClip;
    var filePathConverter = makeFilePathConverter(config);
    return {
        beforeCapture: function () {
            return Promise.resolve().then(function () {
                if (config.selector) {
                    return getSelectorDimensions(page, config.selector).then(function (dimensions) {
                        if (!dimensions) {
                            log('Warning: no element found for ' + config.selector);
                            return;
                        }
                        return dimensions;
                    });
                }
            }).then(function (dimensions) {
                var viewport = page.viewport();
                var x = config.xOffset || config.left || 0;
                var y = config.yOffset || config.top || 0;
                var right = config.right || 0;
                var bottom = config.bottom || 0;
                var width;
                var height;
                if (dimensions) {
                    width = config.width || (dimensions.width - x - right);
                    height = config.height || (dimensions.height - y - bottom);
                    x += dimensions.scrollX + dimensions.left;
                    y += dimensions.scrollY + dimensions.top;
                } else {
                    width = config.width || (viewport.width - x - right);
                    height = config.height || (viewport.height - y - bottom);
                }
                width = Math.ceil(width);
                if (config.roundToEvenWidth && (width % 2 === 1)) {
                    width++;
                }
                height = Math.ceil(height);
                if (config.roundToEvenHeight && (height % 2 === 1)) {
                    height++;
                }
                screenshotClip = {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                };
                if (screenshotClip.height <= 0) {
                    throw new Error('Capture height is ' + (screenshotClip.height < 0 ? 'negative!' : '0!'));
                }
                if (screenshotClip.width <= 0) {
                    throw new Error('Capture width is ' + (screenshotClip.width < 0 ? 'negative!' : '0!'));
                }
            });
        },
        capture: function (sameConfig, frameCount, framesToCapture) {
            var filePath = filePathConverter(frameCount, framesToCapture);
            if (filePath) {
                makeFileDirectoryIfNeeded(filePath);
            }
            log('Capturing Frame ' + frameCount + (filePath ? ' to ' + filePath : '') + '...');
            var p = page.screenshot({
                type: config.screenshotType,
                quality: typeof config.screenshotQuality === 'number' ? config.screenshotQuality * 100 : config.screenshotQuality,
                path: filePath,
                clip: screenshotClip,
                omitBackground: config.transparentBackground ? true : false
            });
            if (frameProcessor) {
                p = p.then(function (buffer) {
                    return frameProcessor(buffer, frameCount, framesToCapture);
                });
            }
            return p;
        }
    };
};
