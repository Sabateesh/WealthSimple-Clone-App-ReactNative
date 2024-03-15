function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { ckEnum, getCkEnum, HostObject } from "./Host";
import { JsiSkMatrix } from "./JsiSkMatrix";
import { JsiSkShader } from "./JsiSkShader"; // https://github.com/google/skia/blob/1f193df9b393d50da39570dab77a0bb5d28ec8ef/modules/canvaskit/htmlcanvas/util.js

export const toBase64String = bytes => {
  if (typeof Buffer !== "undefined") {
    // Are we on node?
    return Buffer.from(bytes).toString("base64");
  } else {
    // From https://stackoverflow.com/a/25644409
    // because the naive solution of
    //     btoa(String.fromCharCode.apply(null, bytes));
    // would occasionally throw "Maximum call stack size exceeded"
    var CHUNK_SIZE = 0x8000; //arbitrary number

    var index = 0;
    var {
      length
    } = bytes;
    var result = "";
    var slice;

    while (index < length) {
      slice = bytes.slice(index, Math.min(index + CHUNK_SIZE, length)); // eslint-disable-next-line @typescript-eslint/no-explicit-any

      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }

    return btoa(result);
  }
};
export class JsiSkImage extends HostObject {
  constructor(CanvasKit, ref) {
    super(CanvasKit, ref, "Image");

    _defineProperty(this, "dispose", () => {
      this.ref.delete();
    });
  }

  height() {
    return this.ref.height();
  }

  width() {
    return this.ref.width();
  }

  getImageInfo() {
    const info = this.ref.getImageInfo();
    return {
      width: info.width,
      height: info.height,
      colorType: info.colorType.value,
      alphaType: info.alphaType.value
    };
  }

  makeShaderOptions(tx, ty, fm, mm, localMatrix) {
    return new JsiSkShader(this.CanvasKit, this.ref.makeShaderOptions(ckEnum(tx), ckEnum(ty), ckEnum(fm), ckEnum(mm), localMatrix ? JsiSkMatrix.fromValue(localMatrix) : undefined));
  }

  makeShaderCubic(tx, ty, B, C, localMatrix) {
    return new JsiSkShader(this.CanvasKit, this.ref.makeShaderCubic(ckEnum(tx), ckEnum(ty), B, C, localMatrix ? JsiSkMatrix.fromValue(localMatrix) : undefined));
  }

  encodeToBytes(fmt, quality) {
    let result;

    if (fmt && quality) {
      result = this.ref.encodeToBytes(ckEnum(fmt), quality);
    } else if (fmt) {
      result = this.ref.encodeToBytes(ckEnum(fmt));
    } else {
      result = this.ref.encodeToBytes();
    }

    if (!result) {
      throw new Error("encodeToBytes failed");
    }

    return result;
  }

  encodeToBase64(fmt, quality) {
    const bytes = this.encodeToBytes(fmt, quality);
    return toBase64String(bytes);
  }

  readPixels(srcX, srcY, imageInfo) {
    var _imageInfo$width, _imageInfo$height;

    const info = this.getImageInfo();
    console.log({
      alphaType: ckEnum(info.alphaType),
      colorType: ckEnum(info.colorType),
      realAlphaType: this.CanvasKit.AlphaType.Opaque.value,
      realColorType: this.CanvasKit.ColorType.RGBA_8888.value
    });
    const pxInfo = {
      colorSpace: this.CanvasKit.ColorSpace.SRGB,
      width: (_imageInfo$width = imageInfo === null || imageInfo === void 0 ? void 0 : imageInfo.width) !== null && _imageInfo$width !== void 0 ? _imageInfo$width : info.width,
      height: (_imageInfo$height = imageInfo === null || imageInfo === void 0 ? void 0 : imageInfo.height) !== null && _imageInfo$height !== void 0 ? _imageInfo$height : info.height,
      alphaType: getCkEnum(this.CanvasKit.AlphaType, (imageInfo !== null && imageInfo !== void 0 ? imageInfo : info).alphaType),
      colorType: getCkEnum(this.CanvasKit.ColorType, (imageInfo !== null && imageInfo !== void 0 ? imageInfo : info).colorType)
    };
    return this.ref.readPixels(srcX !== null && srcX !== void 0 ? srcX : 0, srcY !== null && srcY !== void 0 ? srcY : 0, pxInfo);
  }

  makeNonTextureImage() {
    return new JsiSkImage(this.CanvasKit, this.CanvasKit.MakeImageFromEncoded(this.encodeToBytes()));
  }

}
//# sourceMappingURL=JsiSkImage.js.map