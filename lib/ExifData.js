"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JpegParser_1 = require("./JpegParser");
var ThumbnailTypes;
(function (ThumbnailTypes) {
    ThumbnailTypes[ThumbnailTypes["jpeg"] = 6] = "jpeg";
    ThumbnailTypes[ThumbnailTypes["tiff"] = 1] = "tiff";
})(ThumbnailTypes = exports.ThumbnailTypes || (exports.ThumbnailTypes = {}));
var ExifData = /** @class */ (function () {
    function ExifData(startMarker, tags, imageSize, thumbnailOffset, thumbnailLength, thumbnailType, app1Offset) {
        this.startMarker = startMarker;
        this.tags = tags;
        this.imageSize = imageSize;
        this.thumbnailOffset = thumbnailOffset;
        this.thumbnailLength = thumbnailLength;
        this.thumbnailType = thumbnailType;
        this.app1Offset = app1Offset;
    }
    ExifData.prototype.hasThumbnail = function (mime) {
        if (!this.thumbnailOffset || !this.thumbnailLength) {
            return false;
        }
        if (typeof mime !== 'string') {
            return true;
        }
        if (mime.toLowerCase().trim() === 'image/jpeg') {
            return this.thumbnailType === ThumbnailTypes.jpeg;
        }
        if (mime.toLowerCase().trim() === 'image/tiff') {
            return this.thumbnailType === ThumbnailTypes.tiff;
        }
        return false;
    };
    ExifData.prototype.getThumbnailOffset = function () {
        return this.app1Offset + 6 + this.thumbnailOffset;
    };
    ExifData.prototype.getThumbnailLength = function () {
        return this.thumbnailLength;
    };
    ExifData.prototype.getThumbnailBuffer = function () {
        return this.getThumbnailStream().nextBuffer(this.thumbnailLength);
    };
    ExifData.prototype.getThumbnailStream = function () {
        return this.startMarker.openWithOffset(this.getThumbnailOffset());
    };
    ExifData.prototype.getImageSize = function () {
        return this.imageSize;
    };
    ExifData.prototype.getThumbnailSize = function () {
        var stream = this.getThumbnailStream(), size;
        JpegParser_1.JpegParser.parseSections(stream, function (sectionType, sectionStream) {
            if (JpegParser_1.JpegParser.getSectionName(sectionType).name === 'SOF') {
                size = JpegParser_1.JpegParser.getSizeFromSOFSection(sectionStream);
            }
        });
        return size;
    };
    return ExifData;
}());
exports.ExifData = ExifData;
//# sourceMappingURL=ExifData.js.map