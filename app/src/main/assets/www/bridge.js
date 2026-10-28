(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      init_buffer_inject();
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      init_buffer_inject();
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      init_buffer_inject();
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer3;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer3.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer3.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer3.prototype);
        return buf;
      }
      function Buffer3(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer3.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer3.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer3.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer3, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer3.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer3.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer3.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer3.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer3.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer3.alloc(+length);
      }
      Buffer3.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer3.prototype;
      };
      Buffer3.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
        if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer3.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer3.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer3.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer3.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer3.isBuffer(buf)) buf = Buffer3.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer3.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer3.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer3.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer3.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer3.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer3.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
      Buffer3.prototype.equals = function equals(b) {
        if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer3.compare(this, b) === 0;
      };
      Buffer3.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
      }
      Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer3.from(target, target.offset, target.byteLength);
        }
        if (!Buffer3.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer3.from(val, encoding);
        }
        if (Buffer3.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer3.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer3.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer3.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer3.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer3.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer3.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      }();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // bridge/shims/buffer-inject.js
  var import_buffer;
  var init_buffer_inject = __esm({
    "bridge/shims/buffer-inject.js"() {
      import_buffer = __toESM(require_buffer());
    }
  });

  // (disabled):node_modules/buffer/index.js
  var require_buffer2 = __commonJS({
    "(disabled):node_modules/buffer/index.js"() {
      init_buffer_inject();
    }
  });

  // node_modules/js-md5/src/md5.js
  var require_md5 = __commonJS({
    "node_modules/js-md5/src/md5.js"(exports, module) {
      init_buffer_inject();
      (function() {
        "use strict";
        var INPUT_ERROR = "input is invalid type";
        var FINALIZE_ERROR = "finalize already called";
        var WINDOW = typeof window === "object";
        var root = WINDOW ? window : {};
        if (root.JS_MD5_NO_WINDOW) {
          WINDOW = false;
        }
        var WEB_WORKER = !WINDOW && typeof self === "object";
        var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
        if (NODE_JS) {
          root = global;
        } else if (WEB_WORKER) {
          root = self;
        }
        var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && typeof module === "object" && module.exports;
        var AMD = typeof define === "function" && define.amd;
        var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
        var HEX_CHARS = "0123456789abcdef".split("");
        var EXTRA = [128, 32768, 8388608, -2147483648];
        var SHIFT = [0, 8, 16, 24];
        var OUTPUT_TYPES = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"];
        var BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
        var blocks = [], buffer8;
        if (ARRAY_BUFFER) {
          var buffer = new ArrayBuffer(68);
          buffer8 = new Uint8Array(buffer);
          blocks = new Uint32Array(buffer);
        }
        var isArray = Array.isArray;
        if (root.JS_MD5_NO_NODE_JS || !isArray) {
          isArray = function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
          };
        }
        var isView = ArrayBuffer.isView;
        if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !isView)) {
          isView = function(obj) {
            return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
          };
        }
        var formatMessage = function(message) {
          var type = typeof message;
          if (type === "string") {
            return [message, true];
          }
          if (type !== "object" || message === null) {
            throw new Error(INPUT_ERROR);
          }
          if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
            return [new Uint8Array(message), false];
          }
          if (!isArray(message) && !isView(message)) {
            throw new Error(INPUT_ERROR);
          }
          return [message, false];
        };
        var createOutputMethod = function(outputType) {
          return function(message) {
            return new Md5(true).update(message)[outputType]();
          };
        };
        var createMethod = function() {
          var method = createOutputMethod("hex");
          if (NODE_JS) {
            method = nodeWrap(method);
          }
          method.create = function() {
            return new Md5();
          };
          method.update = function(message) {
            return method.create().update(message);
          };
          for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
            var type = OUTPUT_TYPES[i];
            method[type] = createOutputMethod(type);
          }
          return method;
        };
        var nodeWrap = function(method) {
          var crypto = require_crypto();
          var Buffer3 = require_buffer2().Buffer;
          var bufferFrom;
          if (Buffer3.from && !root.JS_MD5_NO_BUFFER_FROM) {
            bufferFrom = Buffer3.from;
          } else {
            bufferFrom = function(message) {
              return new Buffer3(message);
            };
          }
          var nodeMethod = function(message) {
            if (typeof message === "string") {
              return crypto.createHash("md5").update(message, "utf8").digest("hex");
            } else {
              if (message === null || message === void 0) {
                throw new Error(INPUT_ERROR);
              } else if (message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
              }
            }
            if (isArray(message) || isView(message) || message.constructor === Buffer3) {
              return crypto.createHash("md5").update(bufferFrom(message)).digest("hex");
            } else {
              return method(message);
            }
          };
          return nodeMethod;
        };
        var createHmacOutputMethod = function(outputType) {
          return function(key, message) {
            return new HmacMd5(key, true).update(message)[outputType]();
          };
        };
        var createHmacMethod = function() {
          var method = createHmacOutputMethod("hex");
          method.create = function(key) {
            return new HmacMd5(key);
          };
          method.update = function(key, message) {
            return method.create(key).update(message);
          };
          for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
            var type = OUTPUT_TYPES[i];
            method[type] = createHmacOutputMethod(type);
          }
          return method;
        };
        function Md5(sharedMemory) {
          if (sharedMemory) {
            blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            this.blocks = blocks;
            this.buffer8 = buffer8;
          } else {
            if (ARRAY_BUFFER) {
              var buffer2 = new ArrayBuffer(68);
              this.buffer8 = new Uint8Array(buffer2);
              this.blocks = new Uint32Array(buffer2);
            } else {
              this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            }
          }
          this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
          this.finalized = this.hashed = false;
          this.first = true;
        }
        Md5.prototype.update = function(message) {
          if (this.finalized) {
            throw new Error(FINALIZE_ERROR);
          }
          var result = formatMessage(message);
          message = result[0];
          var isString = result[1];
          var code, index = 0, i, length = message.length, blocks2 = this.blocks;
          var buffer82 = this.buffer8;
          while (index < length) {
            if (this.hashed) {
              this.hashed = false;
              blocks2[0] = blocks2[16];
              blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
            }
            if (isString) {
              if (ARRAY_BUFFER) {
                for (i = this.start; index < length && i < 64; ++index) {
                  code = message.charCodeAt(index);
                  if (code < 128) {
                    buffer82[i++] = code;
                  } else if (code < 2048) {
                    buffer82[i++] = 192 | code >>> 6;
                    buffer82[i++] = 128 | code & 63;
                  } else if (code < 55296 || code >= 57344) {
                    buffer82[i++] = 224 | code >>> 12;
                    buffer82[i++] = 128 | code >>> 6 & 63;
                    buffer82[i++] = 128 | code & 63;
                  } else {
                    code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                    buffer82[i++] = 240 | code >>> 18;
                    buffer82[i++] = 128 | code >>> 12 & 63;
                    buffer82[i++] = 128 | code >>> 6 & 63;
                    buffer82[i++] = 128 | code & 63;
                  }
                }
              } else {
                for (i = this.start; index < length && i < 64; ++index) {
                  code = message.charCodeAt(index);
                  if (code < 128) {
                    blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
                  } else if (code < 2048) {
                    blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                    blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                  } else if (code < 55296 || code >= 57344) {
                    blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                    blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                    blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                  } else {
                    code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                    blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                    blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                    blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                    blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                  }
                }
              }
            } else {
              if (ARRAY_BUFFER) {
                for (i = this.start; index < length && i < 64; ++index) {
                  buffer82[i++] = message[index];
                }
              } else {
                for (i = this.start; index < length && i < 64; ++index) {
                  blocks2[i >>> 2] |= message[index] << SHIFT[i++ & 3];
                }
              }
            }
            this.lastByteIndex = i;
            this.bytes += i - this.start;
            if (i >= 64) {
              this.start = i - 64;
              this.hash();
              this.hashed = true;
            } else {
              this.start = i;
            }
          }
          if (this.bytes > 4294967295) {
            this.hBytes += this.bytes / 4294967296 << 0;
            this.bytes = this.bytes % 4294967296;
          }
          return this;
        };
        Md5.prototype.finalize = function() {
          if (this.finalized) {
            return;
          }
          this.finalized = true;
          var blocks2 = this.blocks, i = this.lastByteIndex;
          blocks2[i >>> 2] |= EXTRA[i & 3];
          if (i >= 56) {
            if (!this.hashed) {
              this.hash();
            }
            blocks2[0] = blocks2[16];
            blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          blocks2[14] = this.bytes << 3;
          blocks2[15] = this.hBytes << 3 | this.bytes >>> 29;
          this.hash();
        };
        Md5.prototype.hash = function() {
          var a, b, c, d, bc, da, blocks2 = this.blocks;
          if (this.first) {
            a = blocks2[0] - 680876937;
            a = (a << 7 | a >>> 25) - 271733879 << 0;
            d = (-1732584194 ^ a & 2004318071) + blocks2[1] - 117830708;
            d = (d << 12 | d >>> 20) + a << 0;
            c = (-271733879 ^ d & (a ^ -271733879)) + blocks2[2] - 1126478375;
            c = (c << 17 | c >>> 15) + d << 0;
            b = (a ^ c & (d ^ a)) + blocks2[3] - 1316259209;
            b = (b << 22 | b >>> 10) + c << 0;
          } else {
            a = this.h0;
            b = this.h1;
            c = this.h2;
            d = this.h3;
            a += (d ^ b & (c ^ d)) + blocks2[0] - 680876936;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ a & (b ^ c)) + blocks2[1] - 389564586;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ d & (a ^ b)) + blocks2[2] + 606105819;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ c & (d ^ a)) + blocks2[3] - 1044525330;
            b = (b << 22 | b >>> 10) + c << 0;
          }
          a += (d ^ b & (c ^ d)) + blocks2[4] - 176418897;
          a = (a << 7 | a >>> 25) + b << 0;
          d += (c ^ a & (b ^ c)) + blocks2[5] + 1200080426;
          d = (d << 12 | d >>> 20) + a << 0;
          c += (b ^ d & (a ^ b)) + blocks2[6] - 1473231341;
          c = (c << 17 | c >>> 15) + d << 0;
          b += (a ^ c & (d ^ a)) + blocks2[7] - 45705983;
          b = (b << 22 | b >>> 10) + c << 0;
          a += (d ^ b & (c ^ d)) + blocks2[8] + 1770035416;
          a = (a << 7 | a >>> 25) + b << 0;
          d += (c ^ a & (b ^ c)) + blocks2[9] - 1958414417;
          d = (d << 12 | d >>> 20) + a << 0;
          c += (b ^ d & (a ^ b)) + blocks2[10] - 42063;
          c = (c << 17 | c >>> 15) + d << 0;
          b += (a ^ c & (d ^ a)) + blocks2[11] - 1990404162;
          b = (b << 22 | b >>> 10) + c << 0;
          a += (d ^ b & (c ^ d)) + blocks2[12] + 1804603682;
          a = (a << 7 | a >>> 25) + b << 0;
          d += (c ^ a & (b ^ c)) + blocks2[13] - 40341101;
          d = (d << 12 | d >>> 20) + a << 0;
          c += (b ^ d & (a ^ b)) + blocks2[14] - 1502002290;
          c = (c << 17 | c >>> 15) + d << 0;
          b += (a ^ c & (d ^ a)) + blocks2[15] + 1236535329;
          b = (b << 22 | b >>> 10) + c << 0;
          a += (c ^ d & (b ^ c)) + blocks2[1] - 165796510;
          a = (a << 5 | a >>> 27) + b << 0;
          d += (b ^ c & (a ^ b)) + blocks2[6] - 1069501632;
          d = (d << 9 | d >>> 23) + a << 0;
          c += (a ^ b & (d ^ a)) + blocks2[11] + 643717713;
          c = (c << 14 | c >>> 18) + d << 0;
          b += (d ^ a & (c ^ d)) + blocks2[0] - 373897302;
          b = (b << 20 | b >>> 12) + c << 0;
          a += (c ^ d & (b ^ c)) + blocks2[5] - 701558691;
          a = (a << 5 | a >>> 27) + b << 0;
          d += (b ^ c & (a ^ b)) + blocks2[10] + 38016083;
          d = (d << 9 | d >>> 23) + a << 0;
          c += (a ^ b & (d ^ a)) + blocks2[15] - 660478335;
          c = (c << 14 | c >>> 18) + d << 0;
          b += (d ^ a & (c ^ d)) + blocks2[4] - 405537848;
          b = (b << 20 | b >>> 12) + c << 0;
          a += (c ^ d & (b ^ c)) + blocks2[9] + 568446438;
          a = (a << 5 | a >>> 27) + b << 0;
          d += (b ^ c & (a ^ b)) + blocks2[14] - 1019803690;
          d = (d << 9 | d >>> 23) + a << 0;
          c += (a ^ b & (d ^ a)) + blocks2[3] - 187363961;
          c = (c << 14 | c >>> 18) + d << 0;
          b += (d ^ a & (c ^ d)) + blocks2[8] + 1163531501;
          b = (b << 20 | b >>> 12) + c << 0;
          a += (c ^ d & (b ^ c)) + blocks2[13] - 1444681467;
          a = (a << 5 | a >>> 27) + b << 0;
          d += (b ^ c & (a ^ b)) + blocks2[2] - 51403784;
          d = (d << 9 | d >>> 23) + a << 0;
          c += (a ^ b & (d ^ a)) + blocks2[7] + 1735328473;
          c = (c << 14 | c >>> 18) + d << 0;
          b += (d ^ a & (c ^ d)) + blocks2[12] - 1926607734;
          b = (b << 20 | b >>> 12) + c << 0;
          bc = b ^ c;
          a += (bc ^ d) + blocks2[5] - 378558;
          a = (a << 4 | a >>> 28) + b << 0;
          d += (bc ^ a) + blocks2[8] - 2022574463;
          d = (d << 11 | d >>> 21) + a << 0;
          da = d ^ a;
          c += (da ^ b) + blocks2[11] + 1839030562;
          c = (c << 16 | c >>> 16) + d << 0;
          b += (da ^ c) + blocks2[14] - 35309556;
          b = (b << 23 | b >>> 9) + c << 0;
          bc = b ^ c;
          a += (bc ^ d) + blocks2[1] - 1530992060;
          a = (a << 4 | a >>> 28) + b << 0;
          d += (bc ^ a) + blocks2[4] + 1272893353;
          d = (d << 11 | d >>> 21) + a << 0;
          da = d ^ a;
          c += (da ^ b) + blocks2[7] - 155497632;
          c = (c << 16 | c >>> 16) + d << 0;
          b += (da ^ c) + blocks2[10] - 1094730640;
          b = (b << 23 | b >>> 9) + c << 0;
          bc = b ^ c;
          a += (bc ^ d) + blocks2[13] + 681279174;
          a = (a << 4 | a >>> 28) + b << 0;
          d += (bc ^ a) + blocks2[0] - 358537222;
          d = (d << 11 | d >>> 21) + a << 0;
          da = d ^ a;
          c += (da ^ b) + blocks2[3] - 722521979;
          c = (c << 16 | c >>> 16) + d << 0;
          b += (da ^ c) + blocks2[6] + 76029189;
          b = (b << 23 | b >>> 9) + c << 0;
          bc = b ^ c;
          a += (bc ^ d) + blocks2[9] - 640364487;
          a = (a << 4 | a >>> 28) + b << 0;
          d += (bc ^ a) + blocks2[12] - 421815835;
          d = (d << 11 | d >>> 21) + a << 0;
          da = d ^ a;
          c += (da ^ b) + blocks2[15] + 530742520;
          c = (c << 16 | c >>> 16) + d << 0;
          b += (da ^ c) + blocks2[2] - 995338651;
          b = (b << 23 | b >>> 9) + c << 0;
          a += (c ^ (b | ~d)) + blocks2[0] - 198630844;
          a = (a << 6 | a >>> 26) + b << 0;
          d += (b ^ (a | ~c)) + blocks2[7] + 1126891415;
          d = (d << 10 | d >>> 22) + a << 0;
          c += (a ^ (d | ~b)) + blocks2[14] - 1416354905;
          c = (c << 15 | c >>> 17) + d << 0;
          b += (d ^ (c | ~a)) + blocks2[5] - 57434055;
          b = (b << 21 | b >>> 11) + c << 0;
          a += (c ^ (b | ~d)) + blocks2[12] + 1700485571;
          a = (a << 6 | a >>> 26) + b << 0;
          d += (b ^ (a | ~c)) + blocks2[3] - 1894986606;
          d = (d << 10 | d >>> 22) + a << 0;
          c += (a ^ (d | ~b)) + blocks2[10] - 1051523;
          c = (c << 15 | c >>> 17) + d << 0;
          b += (d ^ (c | ~a)) + blocks2[1] - 2054922799;
          b = (b << 21 | b >>> 11) + c << 0;
          a += (c ^ (b | ~d)) + blocks2[8] + 1873313359;
          a = (a << 6 | a >>> 26) + b << 0;
          d += (b ^ (a | ~c)) + blocks2[15] - 30611744;
          d = (d << 10 | d >>> 22) + a << 0;
          c += (a ^ (d | ~b)) + blocks2[6] - 1560198380;
          c = (c << 15 | c >>> 17) + d << 0;
          b += (d ^ (c | ~a)) + blocks2[13] + 1309151649;
          b = (b << 21 | b >>> 11) + c << 0;
          a += (c ^ (b | ~d)) + blocks2[4] - 145523070;
          a = (a << 6 | a >>> 26) + b << 0;
          d += (b ^ (a | ~c)) + blocks2[11] - 1120210379;
          d = (d << 10 | d >>> 22) + a << 0;
          c += (a ^ (d | ~b)) + blocks2[2] + 718787259;
          c = (c << 15 | c >>> 17) + d << 0;
          b += (d ^ (c | ~a)) + blocks2[9] - 343485551;
          b = (b << 21 | b >>> 11) + c << 0;
          if (this.first) {
            this.h0 = a + 1732584193 << 0;
            this.h1 = b - 271733879 << 0;
            this.h2 = c - 1732584194 << 0;
            this.h3 = d + 271733878 << 0;
            this.first = false;
          } else {
            this.h0 = this.h0 + a << 0;
            this.h1 = this.h1 + b << 0;
            this.h2 = this.h2 + c << 0;
            this.h3 = this.h3 + d << 0;
          }
        };
        Md5.prototype.hex = function() {
          this.finalize();
          var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
          return HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15];
        };
        Md5.prototype.toString = Md5.prototype.hex;
        Md5.prototype.digest = function() {
          this.finalize();
          var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
          return [
            h0 & 255,
            h0 >>> 8 & 255,
            h0 >>> 16 & 255,
            h0 >>> 24 & 255,
            h1 & 255,
            h1 >>> 8 & 255,
            h1 >>> 16 & 255,
            h1 >>> 24 & 255,
            h2 & 255,
            h2 >>> 8 & 255,
            h2 >>> 16 & 255,
            h2 >>> 24 & 255,
            h3 & 255,
            h3 >>> 8 & 255,
            h3 >>> 16 & 255,
            h3 >>> 24 & 255
          ];
        };
        Md5.prototype.array = Md5.prototype.digest;
        Md5.prototype.arrayBuffer = function() {
          this.finalize();
          var buffer2 = new ArrayBuffer(16);
          var blocks2 = new Uint32Array(buffer2);
          blocks2[0] = this.h0;
          blocks2[1] = this.h1;
          blocks2[2] = this.h2;
          blocks2[3] = this.h3;
          return buffer2;
        };
        Md5.prototype.buffer = Md5.prototype.arrayBuffer;
        Md5.prototype.base64 = function() {
          var v1, v2, v3, base64Str = "", bytes = this.array();
          for (var i = 0; i < 15; ) {
            v1 = bytes[i++];
            v2 = bytes[i++];
            v3 = bytes[i++];
            base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] + BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] + BASE64_ENCODE_CHAR[v3 & 63];
          }
          v1 = bytes[i];
          base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[v1 << 4 & 63] + "==";
          return base64Str;
        };
        function HmacMd5(key, sharedMemory) {
          var i, result = formatMessage(key);
          key = result[0];
          if (result[1]) {
            var bytes = [], length = key.length, index = 0, code;
            for (i = 0; i < length; ++i) {
              code = key.charCodeAt(i);
              if (code < 128) {
                bytes[index++] = code;
              } else if (code < 2048) {
                bytes[index++] = 192 | code >>> 6;
                bytes[index++] = 128 | code & 63;
              } else if (code < 55296 || code >= 57344) {
                bytes[index++] = 224 | code >>> 12;
                bytes[index++] = 128 | code >>> 6 & 63;
                bytes[index++] = 128 | code & 63;
              } else {
                code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
                bytes[index++] = 240 | code >>> 18;
                bytes[index++] = 128 | code >>> 12 & 63;
                bytes[index++] = 128 | code >>> 6 & 63;
                bytes[index++] = 128 | code & 63;
              }
            }
            key = bytes;
          }
          if (key.length > 64) {
            key = new Md5(true).update(key).array();
          }
          var oKeyPad = [], iKeyPad = [];
          for (i = 0; i < 64; ++i) {
            var b = key[i] || 0;
            oKeyPad[i] = 92 ^ b;
            iKeyPad[i] = 54 ^ b;
          }
          Md5.call(this, sharedMemory);
          this.update(iKeyPad);
          this.oKeyPad = oKeyPad;
          this.inner = true;
          this.sharedMemory = sharedMemory;
        }
        HmacMd5.prototype = new Md5();
        HmacMd5.prototype.finalize = function() {
          Md5.prototype.finalize.call(this);
          if (this.inner) {
            this.inner = false;
            var innerHash = this.array();
            Md5.call(this, this.sharedMemory);
            this.update(this.oKeyPad);
            this.update(innerHash);
            Md5.prototype.finalize.call(this);
          }
        };
        var exports2 = createMethod();
        exports2.md5 = exports2;
        exports2.md5.hmac = createHmacMethod();
        if (COMMON_JS) {
          module.exports = exports2;
        } else {
          root.md5 = exports2;
          if (AMD) {
            define(function() {
              return exports2;
            });
          }
        }
      })();
    }
  });

  // bridge/shims/crypto.js
  var require_crypto = __commonJS({
    "bridge/shims/crypto.js"(exports, module) {
      init_buffer_inject();
      var md5 = require_md5();
      function createHash(alg) {
        if (alg !== "md5") throw new Error("hash não suportado: " + alg);
        let data = "";
        return {
          update(s) {
            data += String(s);
            return this;
          },
          digest() {
            return md5(data);
          }
        };
      }
      function randomUUID() {
        const c = globalThis.crypto;
        if (c && c.randomUUID) return c.randomUUID();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
          const r = Math.random() * 16 | 0;
          return (ch === "x" ? r : r & 3 | 8).toString(16);
        });
      }
      module.exports = { createHash, randomUUID };
    }
  });

  // ../src/parser.js
  var require_parser = __commonJS({
    "../src/parser.js"(exports, module) {
      "use strict";
      init_buffer_inject();
      var crypto = require_crypto();
      var ZW = /[​-‍﻿]/g;
      var INF = /^#EXTINF:\s*(?:-\s*)?\d+(?:\.\d+)?\s*((?:[A-Za-z0-9_-]+\s*=\s*"[^"]*"\s*)*)"*\s*,\s*,?\s*(.*)$/i;
      var ATTR = /([A-Za-z0-9_-]+)\s*=\s*"([^"]*)"/g;
      var GROUP_PREFIX = /^(canais|ao vivo)\s*\|\s*/i;
      function attrs(str) {
        const o = {};
        let m;
        ATTR.lastIndex = 0;
        while (m = ATTR.exec(str)) o[m[1].toLowerCase()] = m[2].replace(ZW, "").trim();
        return o;
      }
      function baseName(n) {
        return String(n || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[²³¹]/g, " ").replace(/\([^)]*\)/g, " ").replace(/\b(fhd|hd|sd|4k|uhd|h265|yt)\b/g, " ").replace(/[^a-z0-9+&! ]+/g, " ").replace(/\s+/g, " ").trim();
      }
      function cleanName(name) {
        const c = name.replace(/[²³¹]+/g, "").replace(/\s*\([^)]*\)\s*$/, "").replace(/\s+(FHD|HD|SD)\s*$/i, "").trim();
        return c || name.trim();
      }
      function sourceLabel(name) {
        const q = /\b(FHD|HD|SD|4K|UHD)\b/i.exec(name);
        const sup = (name.match(/[²³¹]+/) || [""])[0];
        const par = /\(([^)]*)\)/.exec(name);
        const parts = [q ? q[1].toUpperCase() + sup : sup ? "Alt" + sup : "", par ? par[1].trim() : ""];
        return parts.filter(Boolean).join(" · ") || "Padrão";
      }
      function fillPlaceholders(url) {
        if (!url.includes("[")) return url;
        const id = crypto.randomUUID();
        return url.replace(/\[([A-Z_]+)\]/g, (m, k) => {
          if (k === "DEVICE_ID" || k === "IFA") return id;
          if (k === "IFA_TYPE") return "dpid";
          if (k === "LMT" || k === "DNS" || k === "GDPR") return "0";
          return "";
        });
      }
      function parseInf(line) {
        line = line.replace(ZW, "");
        let a;
        let title;
        const m = INF.exec(line);
        if (m) {
          a = attrs(m[1]);
          title = m[2];
        } else {
          a = attrs(line);
          const i = line.lastIndexOf(",");
          title = i >= 0 ? line.slice(i + 1) : "";
        }
        title = (title || "").replace(/^[\s,"]+/, "").trim();
        return {
          name: title || a["tvg-name"] || "Sem nome",
          group: a["group-title"] || a["grupo-title"] || a["group"] || "",
          logo: a["tvg-logo"] || a["logo"] || "",
          tvgId: a["tvg-id"] || ""
        };
      }
      function groupEntries(entries) {
        const map = /* @__PURE__ */ new Map();
        for (const e of entries) {
          const group = e.group.replace(GROUP_PREFIX, "").trim() || "Sem grupo";
          const base = baseName(e.name) || e.name.toLowerCase();
          const key = group.toLowerCase() + "|" + base;
          let ch = map.get(key);
          if (!ch) {
            ch = {
              id: crypto.createHash("md5").update(key).digest("hex").slice(0, 10),
              num: 0,
              name: cleanName(e.name),
              group,
              logo: e.logo,
              base,
              tvgIds: [],
              sources: []
            };
            map.set(key, ch);
          }
          if (!ch.logo && e.logo) ch.logo = e.logo;
          if (e.tvgId && !ch.tvgIds.includes(e.tvgId)) ch.tvgIds.push(e.tvgId);
          if (!ch.sources.some((s) => s.url === e.url)) {
            ch.sources.push({ url: e.url, label: sourceLabel(e.name) });
          }
        }
        return [...map.values()];
      }
      function parseM3U(text) {
        const lines = String(text).replace(/^﻿/, "").split(/\r?\n/);
        const epgUrls = [];
        const entries = [];
        let cur = null;
        let dropped = 0;
        let vodSkipped = 0;
        for (const raw of lines) {
          const line = raw.trim();
          if (!line) continue;
          if (/^#EXTM3U/i.test(line)) {
            const a = attrs(line);
            const list = a["url-tvg"] || a["x-tvg-url"] || "";
            list.split(",").map((s) => s.trim()).filter((s) => /^https?:\/\//i.test(s)).forEach((s) => epgUrls.push(s));
            continue;
          }
          if (/^#EXTINF/i.test(line)) {
            if (cur) dropped++;
            cur = parseInf(line);
            continue;
          }
          if (line.startsWith("#")) {
            const g = /^#EXTGRP:(.*)$/i.exec(line);
            if (g && cur && !cur.group) cur.group = g[1].trim();
            continue;
          }
          if (cur && /^[a-z][a-z0-9+.-]*:\/\//i.test(line)) {
            cur.url = fillPlaceholders(line.replace(ZW, ""));
            if (isVodFile(cur.url)) vodSkipped++;
            else entries.push(cur);
            cur = null;
          }
        }
        if (cur) dropped++;
        const channels = groupEntries(entries);
        channels.forEach((c, i) => c.num = i + 1);
        const groups = [];
        const gm = /* @__PURE__ */ new Map();
        channels.forEach((c) => gm.set(c.group, (gm.get(c.group) || 0) + 1));
        gm.forEach((count, name) => groups.push({ name, count }));
        return {
          epgUrls: [...new Set(epgUrls)],
          channels,
          groups,
          stats: { entries: entries.length, dropped, vodSkipped, channels: channels.length }
        };
      }
      function isVodFile(url) {
        try {
          return /\.(mp4|mkv|avi|mov|wmv)$/i.test(new URL(url).pathname);
        } catch (e) {
          return false;
        }
      }
      function normalizePlaylistUrl(u) {
        u = String(u || "").trim();
        const m = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/i.exec(u);
        return m ? `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}` : u;
      }
      module.exports = { parseM3U, baseName, normalizePlaylistUrl, fillPlaceholders };
    }
  });

  // node_modules/fflate/lib/browser.cjs
  var require_browser = __commonJS({
    "node_modules/fflate/lib/browser.cjs"(exports) {
      "use strict";
      init_buffer_inject();
      var ch2 = {};
      var node_worker_1 = {};
      node_worker_1["default"] = function(c, id, msg, transfer, cb) {
        var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
          c + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
        ], { type: "text/javascript" }))));
        w.onmessage = function(e) {
          var d = e.data, ed = d.$e$;
          if (ed) {
            var err2 = new Error(ed[0]);
            err2["code"] = ed[1];
            err2.stack = ed[2];
            cb(err2, null);
          } else
            cb(null, d);
        };
        w.postMessage(msg, transfer);
        return w;
      };
      var u8 = Uint8Array;
      var u16 = Uint16Array;
      var i32 = Int32Array;
      var fleb = new u8([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        0,
        /* unused */
        0,
        0,
        /* impossible */
        0
      ]);
      var fdeb = new u8([
        0,
        0,
        0,
        0,
        1,
        1,
        2,
        2,
        3,
        3,
        4,
        4,
        5,
        5,
        6,
        6,
        7,
        7,
        8,
        8,
        9,
        9,
        10,
        10,
        11,
        11,
        12,
        12,
        13,
        13,
        /* unused */
        0,
        0
      ]);
      var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
      var freb = function(eb, start) {
        var b = new u16(31);
        for (var i2 = 0; i2 < 31; ++i2) {
          b[i2] = start += 1 << eb[i2 - 1];
        }
        var r = new i32(b[30]);
        for (var i2 = 1; i2 < 30; ++i2) {
          for (var j = b[i2]; j < b[i2 + 1]; ++j) {
            r[j] = j - b[i2] << 5 | i2;
          }
        }
        return { b, r };
      };
      var _a = freb(fleb, 2);
      var fl = _a.b;
      var revfl = _a.r;
      fl[28] = 258, revfl[258] = 28;
      var _b = freb(fdeb, 0);
      var fd = _b.b;
      var revfd = _b.r;
      var rev = new u16(32768);
      for (i = 0; i < 32768; ++i) {
        x = (i & 43690) >> 1 | (i & 21845) << 1;
        x = (x & 52428) >> 2 | (x & 13107) << 2;
        x = (x & 61680) >> 4 | (x & 3855) << 4;
        rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
      }
      var x;
      var i;
      var hMap = function(cd, mb, r) {
        var s = cd.length;
        var i2 = 0;
        var l = new u16(mb);
        for (; i2 < s; ++i2) {
          if (cd[i2])
            ++l[cd[i2] - 1];
        }
        var le = new u16(mb);
        for (i2 = 1; i2 < mb; ++i2) {
          le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
        }
        var co;
        if (r) {
          co = new u16(1 << mb);
          var rvb = 15 - mb;
          for (i2 = 0; i2 < s; ++i2) {
            if (cd[i2]) {
              var sv = i2 << 4 | cd[i2];
              var r_1 = mb - cd[i2];
              var v = le[cd[i2] - 1]++ << r_1;
              for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
                co[rev[v] >> rvb] = sv;
              }
            }
          }
        } else {
          co = new u16(s);
          for (i2 = 0; i2 < s; ++i2) {
            if (cd[i2]) {
              co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
            }
          }
        }
        return co;
      };
      var flt = new u8(288);
      for (i = 0; i < 144; ++i)
        flt[i] = 8;
      var i;
      for (i = 144; i < 256; ++i)
        flt[i] = 9;
      var i;
      for (i = 256; i < 280; ++i)
        flt[i] = 7;
      var i;
      for (i = 280; i < 288; ++i)
        flt[i] = 8;
      var i;
      var fdt = new u8(32);
      for (i = 0; i < 32; ++i)
        fdt[i] = 5;
      var i;
      var flm = /* @__PURE__ */ hMap(flt, 9, 0);
      var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
      var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
      var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
      var max = function(a) {
        var m = a[0];
        for (var i2 = 1; i2 < a.length; ++i2) {
          if (a[i2] > m)
            m = a[i2];
        }
        return m;
      };
      var bits = function(d, p, m) {
        var o = p / 8 | 0;
        return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
      };
      var bits16 = function(d, p) {
        var o = p / 8 | 0;
        return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
      };
      var shft = function(p) {
        return (p + 7) / 8 | 0;
      };
      var slc = function(v, s, e) {
        if (s == null || s < 0)
          s = 0;
        if (e == null || e > v.length)
          e = v.length;
        return new u8(v.subarray(s, e));
      };
      exports.FlateErrorCode = {
        UnexpectedEOF: 0,
        InvalidBlockType: 1,
        InvalidLengthLiteral: 2,
        InvalidDistance: 3,
        StreamFinished: 4,
        NoStreamHandler: 5,
        InvalidHeader: 6,
        NoCallback: 7,
        InvalidUTF8: 8,
        ExtraFieldTooLong: 9,
        InvalidDate: 10,
        FilenameTooLong: 11,
        StreamFinishing: 12,
        InvalidZipData: 13,
        UnknownCompressionMethod: 14
      };
      var ec = [
        "unexpected EOF",
        "invalid block type",
        "invalid length/literal",
        "invalid distance",
        "stream finished",
        "no stream handler",
        ,
        "no callback",
        "invalid UTF-8 data",
        "extra field too long",
        "date not in range 1980-2099",
        "filename too long",
        "stream finishing",
        "invalid zip data"
        // determined by unknown compression method
      ];
      var err = function(ind, msg, nt) {
        var e = new Error(msg || ec[ind]);
        e.code = ind;
        if (Error.captureStackTrace)
          Error.captureStackTrace(e, err);
        if (!nt)
          throw e;
        return e;
      };
      var inflt = function(dat, st, buf, dict) {
        var sl = dat.length, dl = dict ? dict.length : 0;
        if (!sl || st.f && !st.l)
          return buf || new u8(0);
        var noBuf = !buf;
        var resize = noBuf || st.i != 2;
        var noSt = st.i;
        if (noBuf)
          buf = new u8(sl * 3);
        var cbuf = function(l2) {
          var bl = buf.length;
          if (l2 > bl) {
            var nbuf = new u8(Math.max(bl * 2, l2));
            nbuf.set(buf);
            buf = nbuf;
          }
        };
        var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
        var tbts = sl * 8;
        do {
          if (!lm) {
            final = bits(dat, pos, 1);
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
              var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
              if (t > sl) {
                if (noSt)
                  err(0);
                break;
              }
              if (resize)
                cbuf(bt + l);
              buf.set(dat.subarray(s, t), bt);
              st.b = bt += l, st.p = pos = t * 8, st.f = final;
              continue;
            } else if (type == 1)
              lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
              var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
              var tl = hLit + bits(dat, pos + 5, 31) + 1;
              pos += 14;
              var ldt = new u8(tl);
              var clt = new u8(19);
              for (var i2 = 0; i2 < hcLen; ++i2) {
                clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
              }
              pos += hcLen * 3;
              var clb = max(clt), clbmsk = (1 << clb) - 1;
              var clm = hMap(clt, clb, 1);
              for (var i2 = 0; i2 < tl; ) {
                var r = clm[bits(dat, pos, clbmsk)];
                pos += r & 15;
                var s = r >> 4;
                if (s < 16) {
                  ldt[i2++] = s;
                } else {
                  var c = 0, n = 0;
                  if (s == 16)
                    n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
                  else if (s == 17)
                    n = 3 + bits(dat, pos, 7), pos += 3;
                  else if (s == 18)
                    n = 11 + bits(dat, pos, 127), pos += 7;
                  while (n--)
                    ldt[i2++] = c;
                }
              }
              var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
              lbt = max(lt);
              dbt = max(dt);
              lm = hMap(lt, lbt, 1);
              dm = hMap(dt, dbt, 1);
            } else
              err(1);
            if (pos > tbts) {
              if (noSt)
                err(0);
              break;
            }
          }
          if (resize)
            cbuf(bt + 131072);
          var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
          var lpos = pos;
          for (; ; lpos = pos) {
            var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
            pos += c & 15;
            if (pos > tbts) {
              if (noSt)
                err(0);
              break;
            }
            if (!c)
              err(2);
            if (sym < 256)
              buf[bt++] = sym;
            else if (sym == 256) {
              lpos = pos, lm = null;
              break;
            } else {
              var add = sym - 254;
              if (sym > 264) {
                var i2 = sym - 257, b = fleb[i2];
                add = bits(dat, pos, (1 << b) - 1) + fl[i2];
                pos += b;
              }
              var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
              if (!d)
                err(3);
              pos += d & 15;
              var dt = fd[dsym];
              if (dsym > 3) {
                var b = fdeb[dsym];
                dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
              }
              if (pos > tbts) {
                if (noSt)
                  err(0);
                break;
              }
              if (resize)
                cbuf(bt + 131072);
              var end = bt + add;
              if (bt < dt) {
                var shift = dl - dt, dend = Math.min(dt, end);
                if (shift + bt < 0)
                  err(3);
                for (; bt < dend; ++bt)
                  buf[bt] = dict[shift + bt];
              }
              for (; bt < end; ++bt)
                buf[bt] = buf[bt - dt];
            }
          }
          st.l = lm, st.p = lpos, st.b = bt, st.f = final;
          if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
        } while (!final);
        return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
      };
      var wbits = function(d, p, v) {
        v <<= p & 7;
        var o = p / 8 | 0;
        d[o] |= v;
        d[o + 1] |= v >> 8;
      };
      var wbits16 = function(d, p, v) {
        v <<= p & 7;
        var o = p / 8 | 0;
        d[o] |= v;
        d[o + 1] |= v >> 8;
        d[o + 2] |= v >> 16;
      };
      var hTree = function(d, mb) {
        var t = [];
        for (var i2 = 0; i2 < d.length; ++i2) {
          if (d[i2])
            t.push({ s: i2, f: d[i2] });
        }
        var s = t.length;
        var t2 = t.slice();
        if (!s)
          return { t: et, l: 0 };
        if (s == 1) {
          var v = new u8(t[0].s + 1);
          v[t[0].s] = 1;
          return { t: v, l: 1 };
        }
        t.sort(function(a, b) {
          return a.f - b.f;
        });
        t.push({ s: -1, f: 25001 });
        var l = t[0], r = t[1], i0 = 0, i1 = 1, i22 = 2;
        t[0] = { s: -1, f: l.f + r.f, l, r };
        while (i1 != s - 1) {
          l = t[t[i0].f < t[i22].f ? i0++ : i22++];
          r = t[i0 != i1 && t[i0].f < t[i22].f ? i0++ : i22++];
          t[i1++] = { s: -1, f: l.f + r.f, l, r };
        }
        var maxSym = t2[0].s;
        for (var i2 = 1; i2 < s; ++i2) {
          if (t2[i2].s > maxSym)
            maxSym = t2[i2].s;
        }
        var tr = new u16(maxSym + 1);
        var mbt = ln(t[i1 - 1], tr, 0);
        if (mbt > mb) {
          var i2 = 0, dt = 0;
          var lft = mbt - mb, cst = 1 << lft;
          t2.sort(function(a, b) {
            return tr[b.s] - tr[a.s] || a.f - b.f;
          });
          for (; i2 < s; ++i2) {
            var i2_1 = t2[i2].s;
            if (tr[i2_1] > mb) {
              dt += cst - (1 << mbt - tr[i2_1]);
              tr[i2_1] = mb;
            } else
              break;
          }
          dt >>= lft;
          while (dt > 0) {
            var i2_2 = t2[i2].s;
            if (tr[i2_2] < mb)
              dt -= 1 << mb - tr[i2_2]++ - 1;
            else
              ++i2;
          }
          for (; i2 >= 0 && dt; --i2) {
            var i2_3 = t2[i2].s;
            if (tr[i2_3] == mb) {
              --tr[i2_3];
              ++dt;
            }
          }
          mbt = mb;
        }
        return { t: new u8(tr), l: mbt };
      };
      var ln = function(n, l, d) {
        return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
      };
      var lc = function(c) {
        var s = c.length;
        while (s && !c[--s])
          ;
        var cl = new u16(++s);
        var cli = 0, cln = c[0], cls = 1;
        var w = function(v) {
          cl[cli++] = v;
        };
        for (var i2 = 1; i2 <= s; ++i2) {
          if (c[i2] == cln && i2 != s)
            ++cls;
          else {
            if (!cln && cls > 2) {
              for (; cls > 138; cls -= 138)
                w(32754);
              if (cls > 2) {
                w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
                cls = 0;
              }
            } else if (cls > 3) {
              w(cln), --cls;
              for (; cls > 6; cls -= 6)
                w(8304);
              if (cls > 2)
                w(cls - 3 << 5 | 8208), cls = 0;
            }
            while (cls--)
              w(cln);
            cls = 1;
            cln = c[i2];
          }
        }
        return { c: cl.subarray(0, cli), n: s };
      };
      var clen = function(cf, cl) {
        var l = 0;
        for (var i2 = 0; i2 < cl.length; ++i2)
          l += cf[i2] * cl[i2];
        return l;
      };
      var wfblk = function(out, pos, dat) {
        var s = dat.length;
        var o = shft(pos + 2);
        out[o] = s & 255;
        out[o + 1] = s >> 8;
        out[o + 2] = out[o] ^ 255;
        out[o + 3] = out[o + 1] ^ 255;
        for (var i2 = 0; i2 < s; ++i2)
          out[o + i2 + 4] = dat[i2];
        return (o + 4 + s) * 8;
      };
      var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
        wbits(out, p++, final);
        ++lf[256];
        var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
        var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
        var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
        var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
        var lcfreq = new u16(19);
        for (var i2 = 0; i2 < lclt.length; ++i2)
          ++lcfreq[lclt[i2] & 31];
        for (var i2 = 0; i2 < lcdt.length; ++i2)
          ++lcfreq[lcdt[i2] & 31];
        var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
        var nlcc = 19;
        for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
          ;
        var flen = bl + 5 << 3;
        var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
        var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
        if (bs >= 0 && flen <= ftlen && flen <= dtlen)
          return wfblk(out, p, dat.subarray(bs, bs + bl));
        var lm, ll, dm, dl;
        wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
        if (dtlen < ftlen) {
          lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
          var llm = hMap(lct, mlcb, 0);
          wbits(out, p, nlc - 257);
          wbits(out, p + 5, ndc - 1);
          wbits(out, p + 10, nlcc - 4);
          p += 14;
          for (var i2 = 0; i2 < nlcc; ++i2)
            wbits(out, p + 3 * i2, lct[clim[i2]]);
          p += 3 * nlcc;
          var lcts = [lclt, lcdt];
          for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i2 = 0; i2 < clct.length; ++i2) {
              var len = clct[i2] & 31;
              wbits(out, p, llm[len]), p += lct[len];
              if (len > 15)
                wbits(out, p, clct[i2] >> 5 & 127), p += clct[i2] >> 12;
            }
          }
        } else {
          lm = flm, ll = flt, dm = fdm, dl = fdt;
        }
        for (var i2 = 0; i2 < li; ++i2) {
          var sym = syms[i2];
          if (sym > 255) {
            var len = sym >> 18 & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
              wbits(out, p, sym >> 23 & 31), p += fleb[len];
            var dst = sym & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
              wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
          } else {
            wbits16(out, p, lm[sym]), p += ll[sym];
          }
        }
        wbits16(out, p, lm[256]);
        return p + ll[256];
      };
      var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
      var et = /* @__PURE__ */ new u8(0);
      var dflt = function(dat, lvl, plvl, pre, post, st) {
        var s = st.z || dat.length;
        var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
        var w = o.subarray(pre, o.length - post);
        var lst = st.l;
        var pos = (st.r || 0) & 7;
        if (lvl) {
          if (pos)
            w[0] = st.r >> 3;
          var opt = deo[lvl - 1];
          var n = opt >> 13, c = opt & 8191;
          var msk_1 = (1 << plvl) - 1;
          var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
          var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
          var hsh = function(i3) {
            return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
          };
          var syms = new i32(25e3);
          var lf = new u16(288), df = new u16(32);
          var lc_1 = 0, eb = 0, i2 = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
          for (; i2 + 2 < s; ++i2) {
            var hv = hsh(i2);
            var imod = i2 & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            if (wi <= i2) {
              var rem = s - i2;
              if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
                pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
                li = lc_1 = eb = 0, bs = i2;
                for (var j = 0; j < 286; ++j)
                  lf[j] = 0;
                for (var j = 0; j < 30; ++j)
                  df[j] = 0;
              }
              var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
              if (rem > 2 && hv == hsh(i2 - dif)) {
                var maxn = Math.min(n, rem) - 1;
                var maxd = Math.min(32767, i2);
                var ml = Math.min(258, rem);
                while (dif <= maxd && --ch_1 && imod != pimod) {
                  if (dat[i2 + l] == dat[i2 + l - dif]) {
                    var nl = 0;
                    for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                      ;
                    if (nl > l) {
                      l = nl, d = dif;
                      if (nl > maxn)
                        break;
                      var mmd = Math.min(dif, nl - 2);
                      var md = 0;
                      for (var j = 0; j < mmd; ++j) {
                        var ti = i2 - dif + j & 32767;
                        var pti = prev[ti];
                        var cd = ti - pti & 32767;
                        if (cd > md)
                          md = cd, pimod = ti;
                      }
                    }
                  }
                  imod = pimod, pimod = prev[imod];
                  dif += imod - pimod & 32767;
                }
              }
              if (d) {
                syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
                var lin = revfl[l] & 31, din = revfd[d] & 31;
                eb += fleb[lin] + fdeb[din];
                ++lf[257 + lin];
                ++df[din];
                wi = i2 + l;
                ++lc_1;
              } else {
                syms[li++] = dat[i2];
                ++lf[dat[i2]];
              }
            }
          }
          for (i2 = Math.max(i2, wi); i2 < s; ++i2) {
            syms[li++] = dat[i2];
            ++lf[dat[i2]];
          }
          pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
          if (!lst) {
            st.r = pos & 7 | w[pos / 8 | 0] << 3;
            pos -= 7;
            st.h = head, st.p = prev, st.i = i2, st.w = wi;
          }
        } else {
          for (var i2 = st.w || 0; i2 < s + lst; i2 += 65535) {
            var e = i2 + 65535;
            if (e >= s) {
              w[pos / 8 | 0] = lst;
              e = s;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i2, e));
          }
          st.i = s;
        }
        return slc(o, 0, pre + shft(pos) + post);
      };
      var crct = /* @__PURE__ */ function() {
        var t = new Int32Array(256);
        for (var i2 = 0; i2 < 256; ++i2) {
          var c = i2, k = 9;
          while (--k)
            c = (c & 1 && -306674912) ^ c >>> 1;
          t[i2] = c;
        }
        return t;
      }();
      var crc = function() {
        var c = -1;
        return {
          p: function(d) {
            var cr = c;
            for (var i2 = 0; i2 < d.length; ++i2)
              cr = crct[cr & 255 ^ d[i2]] ^ cr >>> 8;
            c = cr;
          },
          d: function() {
            return ~c;
          }
        };
      };
      var adler = function() {
        var a = 1, b = 0;
        return {
          p: function(d) {
            var n = a, m = b;
            var l = d.length | 0;
            for (var i2 = 0; i2 != l; ) {
              var e = Math.min(i2 + 2655, l);
              for (; i2 < e; ++i2)
                m += n += d[i2];
              n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
            }
            a = n, b = m;
          },
          d: function() {
            a %= 65521, b %= 65521;
            return (a & 255) << 24 | (a & 65280) << 8 | (b & 255) << 8 | b >> 8;
          }
        };
      };
      var dopt = function(dat, opt, pre, post, st) {
        if (!st) {
          st = { l: 1 };
          if (opt.dictionary) {
            var dict = opt.dictionary.subarray(-32768);
            var newDat = new u8(dict.length + dat.length);
            newDat.set(dict);
            newDat.set(dat, dict.length);
            dat = newDat;
            st.w = dict.length;
          }
        }
        return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
      };
      var mrg = function(a, b) {
        var o = {};
        for (var k in a)
          o[k] = a[k];
        for (var k in b)
          o[k] = b[k];
        return o;
      };
      var wcln = function(fn, fnStr, td2) {
        var dt = fn();
        var st = fn.toString();
        var ks = st.slice(st.indexOf("[") + 1, st.lastIndexOf("]")).replace(/\s+/g, "").split(",");
        for (var i2 = 0; i2 < dt.length; ++i2) {
          var v = dt[i2], k = ks[i2];
          if (typeof v == "function") {
            fnStr += ";" + k + "=";
            var st_1 = v.toString();
            if (v.prototype) {
              if (st_1.indexOf("[native code]") != -1) {
                var spInd = st_1.indexOf(" ", 8) + 1;
                fnStr += st_1.slice(spInd, st_1.indexOf("(", spInd));
              } else {
                fnStr += st_1;
                for (var t in v.prototype)
                  fnStr += ";" + k + ".prototype." + t + "=" + v.prototype[t].toString();
              }
            } else
              fnStr += st_1;
          } else
            td2[k] = v;
        }
        return fnStr;
      };
      var ch = [];
      var cbfs = function(v) {
        var tl = [];
        for (var k in v) {
          if (v[k].buffer) {
            tl.push((v[k] = new v[k].constructor(v[k])).buffer);
          }
        }
        return tl;
      };
      var wrkr = function(fns, init, id, cb) {
        if (!ch[id]) {
          var fnStr = "", td_1 = {}, m = fns.length - 1;
          for (var i2 = 0; i2 < m; ++i2)
            fnStr = wcln(fns[i2], fnStr, td_1);
          ch[id] = { c: wcln(fns[m], fnStr, td_1), e: td_1 };
        }
        var td2 = mrg({}, ch[id].e);
        return (0, node_worker_1.default)(ch[id].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + init.toString() + "}", id, td2, cbfs(td2), cb);
      };
      var bInflt = function() {
        return [u8, u16, i32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gopt];
      };
      var bDflt = function() {
        return [u8, u16, i32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf];
      };
      var gze = function() {
        return [gzh, gzhl, wbytes, crc, crct];
      };
      var guze = function() {
        return [gzs, gzl];
      };
      var zle = function() {
        return [zlh, wbytes, adler];
      };
      var zule = function() {
        return [zls];
      };
      var pbf = function(msg) {
        return postMessage(msg, [msg.buffer]);
      };
      var gopt = function(o) {
        return o && {
          out: o.size && new u8(o.size),
          dictionary: o.dictionary
        };
      };
      var cbify = function(dat, opts, fns, init, id, cb) {
        var w = wrkr(fns, init, id, function(err2, dat2) {
          w.terminate();
          cb(err2, dat2);
        });
        w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
        return function() {
          w.terminate();
        };
      };
      var astrm = function(strm) {
        strm.ondata = function(dat, final) {
          return postMessage([dat, final], [dat.buffer]);
        };
        return function(ev) {
          if (ev.data.length) {
            strm.push(ev.data[0], ev.data[1]);
            postMessage([ev.data[0].length]);
          } else
            strm.flush();
        };
      };
      var astrmify = function(fns, strm, opts, init, id, flush, ext) {
        var t;
        var w = wrkr(fns, init, id, function(err2, dat) {
          if (err2)
            w.terminate(), strm.ondata.call(strm, err2);
          else if (!Array.isArray(dat))
            ext(dat);
          else if (dat.length == 1) {
            strm.queuedSize -= dat[0];
            if (strm.ondrain)
              strm.ondrain(dat[0]);
          } else {
            if (dat[1])
              w.terminate();
            strm.ondata.call(strm, err2, dat[0], dat[1]);
          }
        });
        w.postMessage(opts);
        strm.queuedSize = 0;
        strm.push = function(d, f) {
          if (!strm.ondata)
            err(5);
          if (t)
            strm.ondata(err(4, 0, 1), null, !!f);
          strm.queuedSize += d.length;
          w.postMessage([d, t = f], [d.buffer]);
        };
        strm.terminate = function() {
          w.terminate();
        };
        if (flush) {
          strm.flush = function() {
            w.postMessage([]);
          };
        }
      };
      var b2 = function(d, b) {
        return d[b] | d[b + 1] << 8;
      };
      var b4 = function(d, b) {
        return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
      };
      var b8 = function(d, b) {
        return b4(d, b) + b4(d, b + 4) * 4294967296;
      };
      var wbytes = function(d, b, v) {
        for (; v; ++b)
          d[b] = v, v >>>= 8;
      };
      var gzh = function(c, o) {
        var fn = o.filename;
        c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3;
        if (o.mtime != 0)
          wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1e3));
        if (fn) {
          c[3] = 8;
          for (var i2 = 0; i2 <= fn.length; ++i2)
            c[i2 + 10] = fn.charCodeAt(i2);
        }
      };
      var gzs = function(d) {
        if (d[0] != 31 || d[1] != 139 || d[2] != 8)
          err(6, "invalid gzip data");
        var flg = d[3];
        var st = 10;
        if (flg & 4)
          st += (d[10] | d[11] << 8) + 2;
        for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
          ;
        return st + (flg & 2);
      };
      var gzl = function(d) {
        var l = d.length;
        return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
      };
      var gzhl = function(o) {
        return 10 + (o.filename ? o.filename.length + 1 : 0);
      };
      var zlh = function(c, o) {
        var lv = o.level, fl2 = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
        c[0] = 120, c[1] = fl2 << 6 | (o.dictionary && 32);
        c[1] |= 31 - (c[0] << 8 | c[1]) % 31;
        if (o.dictionary) {
          var h = adler();
          h.p(o.dictionary);
          wbytes(c, 2, h.d());
        }
      };
      var zls = function(d, dict) {
        if ((d[0] & 15) != 8 || d[0] >> 4 > 7 || (d[0] << 8 | d[1]) % 31)
          err(6, "invalid zlib data");
        if ((d[1] >> 5 & 1) == +!dict)
          err(6, "invalid zlib data: " + (d[1] & 32 ? "need" : "unexpected") + " dictionary");
        return (d[1] >> 3 & 4) + 2;
      };
      function StrmOpt(opts, cb) {
        if (typeof opts == "function")
          cb = opts, opts = {};
        this.ondata = cb;
        return opts;
      }
      var Deflate = /* @__PURE__ */ function() {
        function Deflate2(opts, cb) {
          if (typeof opts == "function")
            cb = opts, opts = {};
          this.ondata = cb;
          this.o = opts || {};
          this.s = { l: 0, i: 32768, w: 32768, z: 32768 };
          this.b = new u8(98304);
          if (this.o.dictionary) {
            var dict = this.o.dictionary.subarray(-32768);
            this.b.set(dict, 32768 - dict.length);
            this.s.i = 32768 - dict.length;
          }
        }
        Deflate2.prototype.p = function(c, f) {
          this.ondata(dopt(c, this.o, 0, 0, this.s), f);
        };
        Deflate2.prototype.push = function(chunk, final) {
          if (!this.ondata)
            err(5);
          if (this.s.l)
            err(4);
          var endLen = chunk.length + this.s.z;
          if (endLen > this.b.length) {
            if (endLen > 2 * this.b.length - 32768) {
              var newBuf = new u8(endLen & -32768);
              newBuf.set(this.b.subarray(0, this.s.z));
              this.b = newBuf;
            }
            var split = this.b.length - this.s.z;
            this.b.set(chunk.subarray(0, split), this.s.z);
            this.s.z = this.b.length;
            this.p(this.b, false);
            this.b.set(this.b.subarray(-32768));
            this.b.set(chunk.subarray(split), 32768);
            this.s.z = chunk.length - split + 32768;
            this.s.i = 32766, this.s.w = 32768;
          } else {
            this.b.set(chunk, this.s.z);
            this.s.z += chunk.length;
          }
          this.s.l = final & 1;
          if (this.s.z > this.s.w + 8191 || final) {
            this.p(this.b, final || false);
            this.s.w = this.s.i, this.s.i -= 2;
          }
        };
        Deflate2.prototype.flush = function() {
          if (!this.ondata)
            err(5);
          if (this.s.l)
            err(4);
          this.p(this.b, false);
          this.s.w = this.s.i, this.s.i -= 2;
        };
        return Deflate2;
      }();
      exports.Deflate = Deflate;
      var AsyncDeflate = /* @__PURE__ */ function() {
        function AsyncDeflate2(opts, cb) {
          astrmify([
            bDflt,
            function() {
              return [astrm, Deflate];
            }
          ], this, StrmOpt.call(this, opts, cb), function(ev) {
            var strm = new Deflate(ev.data);
            onmessage = astrm(strm);
          }, 6, 1);
        }
        return AsyncDeflate2;
      }();
      exports.AsyncDeflate = AsyncDeflate;
      function deflate(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bDflt
        ], function(ev) {
          return pbf(deflateSync(ev.data[0], ev.data[1]));
        }, 0, cb);
      }
      exports.deflate = deflate;
      function deflateSync(data, opts) {
        return dopt(data, opts || {}, 0, 0);
      }
      exports.deflateSync = deflateSync;
      var Inflate = /* @__PURE__ */ function() {
        function Inflate2(opts, cb) {
          if (typeof opts == "function")
            cb = opts, opts = {};
          this.ondata = cb;
          var dict = opts && opts.dictionary && opts.dictionary.subarray(-32768);
          this.s = { i: 0, b: dict ? dict.length : 0 };
          this.o = new u8(32768);
          this.p = new u8(0);
          if (dict)
            this.o.set(dict);
        }
        Inflate2.prototype.e = function(c) {
          if (!this.ondata)
            err(5);
          if (this.d)
            err(4);
          if (!this.p.length)
            this.p = c;
          else if (c.length) {
            var n = new u8(this.p.length + c.length);
            n.set(this.p), n.set(c, this.p.length), this.p = n;
          }
        };
        Inflate2.prototype.c = function(final) {
          this.s.i = +(this.d = final || false);
          var bts = this.s.b;
          var dt = inflt(this.p, this.s, this.o);
          this.ondata(slc(dt, bts, this.s.b), this.d);
          this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
          this.p = slc(this.p, this.s.p / 8 | 0), this.s.p &= 7;
        };
        Inflate2.prototype.push = function(chunk, final) {
          this.e(chunk), this.c(final);
        };
        return Inflate2;
      }();
      exports.Inflate = Inflate;
      var AsyncInflate = /* @__PURE__ */ function() {
        function AsyncInflate2(opts, cb) {
          astrmify([
            bInflt,
            function() {
              return [astrm, Inflate];
            }
          ], this, StrmOpt.call(this, opts, cb), function(ev) {
            var strm = new Inflate(ev.data);
            onmessage = astrm(strm);
          }, 7, 0);
        }
        return AsyncInflate2;
      }();
      exports.AsyncInflate = AsyncInflate;
      function inflate(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bInflt
        ], function(ev) {
          return pbf(inflateSync(ev.data[0], gopt(ev.data[1])));
        }, 1, cb);
      }
      exports.inflate = inflate;
      function inflateSync(data, opts) {
        return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
      }
      exports.inflateSync = inflateSync;
      var Gzip = /* @__PURE__ */ function() {
        function Gzip2(opts, cb) {
          this.c = crc();
          this.l = 0;
          this.v = 1;
          Deflate.call(this, opts, cb);
        }
        Gzip2.prototype.push = function(chunk, final) {
          this.c.p(chunk);
          this.l += chunk.length;
          Deflate.prototype.push.call(this, chunk, final);
        };
        Gzip2.prototype.p = function(c, f) {
          var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, this.s);
          if (this.v)
            gzh(raw, this.o), this.v = 0;
          if (f)
            wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
          this.ondata(raw, f);
        };
        Gzip2.prototype.flush = function() {
          Deflate.prototype.flush.call(this);
        };
        return Gzip2;
      }();
      exports.Gzip = Gzip;
      exports.Compress = Gzip;
      var AsyncGzip = /* @__PURE__ */ function() {
        function AsyncGzip2(opts, cb) {
          astrmify([
            bDflt,
            gze,
            function() {
              return [astrm, Deflate, Gzip];
            }
          ], this, StrmOpt.call(this, opts, cb), function(ev) {
            var strm = new Gzip(ev.data);
            onmessage = astrm(strm);
          }, 8, 1);
        }
        return AsyncGzip2;
      }();
      exports.AsyncGzip = AsyncGzip;
      exports.AsyncCompress = AsyncGzip;
      function gzip(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bDflt,
          gze,
          function() {
            return [gzipSync];
          }
        ], function(ev) {
          return pbf(gzipSync(ev.data[0], ev.data[1]));
        }, 2, cb);
      }
      exports.gzip = gzip;
      exports.compress = gzip;
      function gzipSync(data, opts) {
        if (!opts)
          opts = {};
        var c = crc(), l = data.length;
        c.p(data);
        var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
        return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
      }
      exports.gzipSync = gzipSync;
      exports.compressSync = gzipSync;
      var Gunzip = /* @__PURE__ */ function() {
        function Gunzip2(opts, cb) {
          this.v = 1;
          this.r = 0;
          Inflate.call(this, opts, cb);
        }
        Gunzip2.prototype.push = function(chunk, final) {
          Inflate.prototype.e.call(this, chunk);
          this.r += chunk.length;
          if (this.v) {
            var p = this.p.subarray(this.v - 1);
            var s = p.length > 3 ? gzs(p) : 4;
            if (s > p.length) {
              if (!final)
                return;
            } else if (this.v > 1 && this.onmember) {
              this.onmember(this.r - p.length);
            }
            this.p = p.subarray(s), this.v = 0;
          }
          Inflate.prototype.c.call(this, final);
          if (this.s.f && !this.s.l && !final) {
            this.v = shft(this.s.p) + 9;
            this.s = { i: 0 };
            this.o = new u8(0);
            this.push(new u8(0), final);
          }
        };
        return Gunzip2;
      }();
      exports.Gunzip = Gunzip;
      var AsyncGunzip = /* @__PURE__ */ function() {
        function AsyncGunzip2(opts, cb) {
          var _this = this;
          astrmify([
            bInflt,
            guze,
            function() {
              return [astrm, Inflate, Gunzip];
            }
          ], this, StrmOpt.call(this, opts, cb), function(ev) {
            var strm = new Gunzip(ev.data);
            strm.onmember = function(offset) {
              return postMessage(offset);
            };
            onmessage = astrm(strm);
          }, 9, 0, function(offset) {
            return _this.onmember && _this.onmember(offset);
          });
        }
        return AsyncGunzip2;
      }();
      exports.AsyncGunzip = AsyncGunzip;
      function gunzip(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bInflt,
          guze,
          function() {
            return [gunzipSync];
          }
        ], function(ev) {
          return pbf(gunzipSync(ev.data[0], ev.data[1]));
        }, 3, cb);
      }
      exports.gunzip = gunzip;
      function gunzipSync(data, opts) {
        var st = gzs(data);
        if (st + 8 > data.length)
          err(6, "invalid gzip data");
        return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
      }
      exports.gunzipSync = gunzipSync;
      var Zlib = /* @__PURE__ */ function() {
        function Zlib2(opts, cb) {
          this.c = adler();
          this.v = 1;
          Deflate.call(this, opts, cb);
        }
        Zlib2.prototype.push = function(chunk, final) {
          this.c.p(chunk);
          Deflate.prototype.push.call(this, chunk, final);
        };
        Zlib2.prototype.p = function(c, f) {
          var raw = dopt(c, this.o, this.v && (this.o.dictionary ? 6 : 2), f && 4, this.s);
          if (this.v)
            zlh(raw, this.o), this.v = 0;
          if (f)
            wbytes(raw, raw.length - 4, this.c.d());
          this.ondata(raw, f);
        };
        Zlib2.prototype.flush = function() {
          Deflate.prototype.flush.call(this);
        };
        return Zlib2;
      }();
      exports.Zlib = Zlib;
      var AsyncZlib = /* @__PURE__ */ function() {
        function AsyncZlib2(opts, cb) {
          astrmify([
            bDflt,
            zle,
            function() {
              return [astrm, Deflate, Zlib];
            }
          ], this, StrmOpt.call(this, opts, cb), function(ev) {
            var strm = new Zlib(ev.data);
            onmessage = astrm(strm);
          }, 10, 1);
        }
        return AsyncZlib2;
      }();
      exports.AsyncZlib = AsyncZlib;
      function zlib(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bDflt,
          zle,
          function() {
            return [zlibSync];
          }
        ], function(ev) {
          return pbf(zlibSync(ev.data[0], ev.data[1]));
        }, 4, cb);
      }
      exports.zlib = zlib;
      function zlibSync(data, opts) {
        if (!opts)
          opts = {};
        var a = adler();
        a.p(data);
        var d = dopt(data, opts, opts.dictionary ? 6 : 2, 4);
        return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
      }
      exports.zlibSync = zlibSync;
      var Unzlib = /* @__PURE__ */ function() {
        function Unzlib2(opts, cb) {
          Inflate.call(this, opts, cb);
          this.v = opts && opts.dictionary ? 2 : 1;
        }
        Unzlib2.prototype.push = function(chunk, final) {
          Inflate.prototype.e.call(this, chunk);
          if (this.v) {
            if (this.p.length < 6 && !final)
              return;
            this.p = this.p.subarray(zls(this.p, this.v - 1)), this.v = 0;
          }
          if (final) {
            if (this.p.length < 4)
              err(6, "invalid zlib data");
            this.p = this.p.subarray(0, -4);
          }
          Inflate.prototype.c.call(this, final);
        };
        return Unzlib2;
      }();
      exports.Unzlib = Unzlib;
      var AsyncUnzlib = /* @__PURE__ */ function() {
        function AsyncUnzlib2(opts, cb) {
          astrmify([
            bInflt,
            zule,
            function() {
              return [astrm, Inflate, Unzlib];
            }
          ], this, StrmOpt.call(this, opts, cb), function(ev) {
            var strm = new Unzlib(ev.data);
            onmessage = astrm(strm);
          }, 11, 0);
        }
        return AsyncUnzlib2;
      }();
      exports.AsyncUnzlib = AsyncUnzlib;
      function unzlib(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bInflt,
          zule,
          function() {
            return [unzlibSync];
          }
        ], function(ev) {
          return pbf(unzlibSync(ev.data[0], gopt(ev.data[1])));
        }, 5, cb);
      }
      exports.unzlib = unzlib;
      function unzlibSync(data, opts) {
        return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
      }
      exports.unzlibSync = unzlibSync;
      var Decompress = /* @__PURE__ */ function() {
        function Decompress2(opts, cb) {
          this.o = StrmOpt.call(this, opts, cb) || {};
          this.G = Gunzip;
          this.I = Inflate;
          this.Z = Unzlib;
        }
        Decompress2.prototype.i = function() {
          var _this = this;
          this.s.ondata = function(dat, final) {
            _this.ondata(dat, final);
          };
        };
        Decompress2.prototype.push = function(chunk, final) {
          if (!this.ondata)
            err(5);
          if (!this.s) {
            if (this.p && this.p.length) {
              var n = new u8(this.p.length + chunk.length);
              n.set(this.p), n.set(chunk, this.p.length);
            } else
              this.p = chunk;
            if (this.p.length > 2) {
              this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(this.o) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(this.o) : new this.Z(this.o);
              this.i();
              this.s.push(this.p, final);
              this.p = null;
            }
          } else
            this.s.push(chunk, final);
        };
        return Decompress2;
      }();
      exports.Decompress = Decompress;
      var AsyncDecompress = /* @__PURE__ */ function() {
        function AsyncDecompress2(opts, cb) {
          Decompress.call(this, opts, cb);
          this.queuedSize = 0;
          this.G = AsyncGunzip;
          this.I = AsyncInflate;
          this.Z = AsyncUnzlib;
        }
        AsyncDecompress2.prototype.i = function() {
          var _this = this;
          this.s.ondata = function(err2, dat, final) {
            _this.ondata(err2, dat, final);
          };
          this.s.ondrain = function(size) {
            _this.queuedSize -= size;
            if (_this.ondrain)
              _this.ondrain(size);
          };
        };
        AsyncDecompress2.prototype.push = function(chunk, final) {
          this.queuedSize += chunk.length;
          Decompress.prototype.push.call(this, chunk, final);
        };
        return AsyncDecompress2;
      }();
      exports.AsyncDecompress = AsyncDecompress;
      function decompress(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzip(data, opts, cb) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflate(data, opts, cb) : unzlib(data, opts, cb);
      }
      exports.decompress = decompress;
      function decompressSync(data, opts) {
        return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, opts) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, opts) : unzlibSync(data, opts);
      }
      exports.decompressSync = decompressSync;
      var fltn = function(d, p, t, o) {
        for (var k in d) {
          var val = d[k], n = p + k, op = o;
          if (Array.isArray(val))
            op = mrg(o, val[1]), val = val[0];
          if (val instanceof u8)
            t[n] = [val, op];
          else {
            t[n += "/"] = [new u8(0), op];
            fltn(val, n, t, o);
          }
        }
      };
      var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
      var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
      var tds = 0;
      try {
        td.decode(et, { stream: true });
        tds = 1;
      } catch (e) {
      }
      var dutf8 = function(d) {
        for (var r = "", i2 = 0; ; ) {
          var c = d[i2++];
          var eb = (c > 127) + (c > 223) + (c > 239);
          if (i2 + eb > d.length)
            return { s: r, r: slc(d, i2 - 1) };
          if (!eb)
            r += String.fromCharCode(c);
          else if (eb == 3) {
            c = ((c & 15) << 18 | (d[i2++] & 63) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
          } else if (eb & 1)
            r += String.fromCharCode((c & 31) << 6 | d[i2++] & 63);
          else
            r += String.fromCharCode((c & 15) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63);
        }
      };
      var DecodeUTF8 = /* @__PURE__ */ function() {
        function DecodeUTF82(cb) {
          this.ondata = cb;
          if (tds)
            this.t = new TextDecoder();
          else
            this.p = et;
        }
        DecodeUTF82.prototype.push = function(chunk, final) {
          if (!this.ondata)
            err(5);
          final = !!final;
          if (this.t) {
            this.ondata(this.t.decode(chunk, { stream: true }), final);
            if (final) {
              if (this.t.decode().length)
                err(8);
              this.t = null;
            }
            return;
          }
          if (!this.p)
            err(4);
          var dat = new u8(this.p.length + chunk.length);
          dat.set(this.p);
          dat.set(chunk, this.p.length);
          var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
          if (final) {
            if (r.length)
              err(8);
            this.p = null;
          } else
            this.p = r;
          this.ondata(s, final);
        };
        return DecodeUTF82;
      }();
      exports.DecodeUTF8 = DecodeUTF8;
      var EncodeUTF8 = /* @__PURE__ */ function() {
        function EncodeUTF82(cb) {
          this.ondata = cb;
        }
        EncodeUTF82.prototype.push = function(chunk, final) {
          if (!this.ondata)
            err(5);
          if (this.d)
            err(4);
          this.ondata(strToU8(chunk), this.d = final || false);
        };
        return EncodeUTF82;
      }();
      exports.EncodeUTF8 = EncodeUTF8;
      function strToU8(str, latin1) {
        if (latin1) {
          var ar_1 = new u8(str.length);
          for (var i2 = 0; i2 < str.length; ++i2)
            ar_1[i2] = str.charCodeAt(i2);
          return ar_1;
        }
        if (te)
          return te.encode(str);
        var l = str.length;
        var ar = new u8(str.length + (str.length >> 1));
        var ai = 0;
        var w = function(v) {
          ar[ai++] = v;
        };
        for (var i2 = 0; i2 < l; ++i2) {
          if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + (l - i2 << 1));
            n.set(ar);
            ar = n;
          }
          var c = str.charCodeAt(i2);
          if (c < 128 || latin1)
            w(c);
          else if (c < 2048)
            w(192 | c >> 6), w(128 | c & 63);
          else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i2) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
          else
            w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
        }
        return slc(ar, 0, ai);
      }
      exports.strToU8 = strToU8;
      function strFromU8(dat, latin1) {
        if (latin1) {
          var r = "";
          for (var i2 = 0; i2 < dat.length; i2 += 16384)
            r += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
          return r;
        } else if (td) {
          return td.decode(dat);
        } else {
          var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
          if (r.length)
            err(8);
          return s;
        }
      }
      exports.strFromU8 = strFromU8;
      var dbf = function(l) {
        return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0;
      };
      var slzh = function(d, b) {
        return b + 30 + b2(d, b + 26) + b2(d, b + 28);
      };
      var zh = function(d, b, z) {
        var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
        var _a2 = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a2[0], su = _a2[1], off = _a2[2];
        return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
      };
      var z64e = function(d, b) {
        for (; b2(d, b) != 1; b += 4 + b2(d, b + 2))
          ;
        return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
      };
      var exfl = function(ex) {
        var le = 0;
        if (ex) {
          for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
              err(9);
            le += l + 4;
          }
        }
        return le;
      };
      var wzh = function(d, b, f, fn, u, c, ce, co) {
        var fl2 = fn.length, ex = f.extra, col = co && co.length;
        var exl = exfl(ex);
        wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
        if (ce != null)
          d[b++] = 20, d[b++] = f.os;
        d[b] = 20, b += 2;
        d[b++] = f.flag << 1 | (c < 0 && 8), d[b++] = u && 8;
        d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
        var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
        if (y < 0 || y > 119)
          err(10);
        wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4;
        if (c != -1) {
          wbytes(d, b, f.crc);
          wbytes(d, b + 4, c < 0 ? -c - 2 : c);
          wbytes(d, b + 8, f.size);
        }
        wbytes(d, b + 12, fl2);
        wbytes(d, b + 14, exl), b += 16;
        if (ce != null) {
          wbytes(d, b, col);
          wbytes(d, b + 6, f.attrs);
          wbytes(d, b + 10, ce), b += 14;
        }
        d.set(fn, b);
        b += fl2;
        if (exl) {
          for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d, b, +k);
            wbytes(d, b + 2, l);
            d.set(exf, b + 4), b += 4 + l;
          }
        }
        if (col)
          d.set(co, b), b += col;
        return b;
      };
      var wzf = function(o, b, c, d, e) {
        wbytes(o, b, 101010256);
        wbytes(o, b + 8, c);
        wbytes(o, b + 10, c);
        wbytes(o, b + 12, d);
        wbytes(o, b + 16, e);
      };
      var ZipPassThrough = /* @__PURE__ */ function() {
        function ZipPassThrough2(filename) {
          this.filename = filename;
          this.c = crc();
          this.size = 0;
          this.compression = 0;
        }
        ZipPassThrough2.prototype.process = function(chunk, final) {
          this.ondata(null, chunk, final);
        };
        ZipPassThrough2.prototype.push = function(chunk, final) {
          if (!this.ondata)
            err(5);
          this.c.p(chunk);
          this.size += chunk.length;
          if (final)
            this.crc = this.c.d();
          this.process(chunk, final || false);
        };
        return ZipPassThrough2;
      }();
      exports.ZipPassThrough = ZipPassThrough;
      var ZipDeflate = /* @__PURE__ */ function() {
        function ZipDeflate2(filename, opts) {
          var _this = this;
          if (!opts)
            opts = {};
          ZipPassThrough.call(this, filename);
          this.d = new Deflate(opts, function(dat, final) {
            _this.ondata(null, dat, final);
          });
          this.compression = 8;
          this.flag = dbf(opts.level);
        }
        ZipDeflate2.prototype.process = function(chunk, final) {
          try {
            this.d.push(chunk, final);
          } catch (e) {
            this.ondata(e, null, final);
          }
        };
        ZipDeflate2.prototype.push = function(chunk, final) {
          ZipPassThrough.prototype.push.call(this, chunk, final);
        };
        return ZipDeflate2;
      }();
      exports.ZipDeflate = ZipDeflate;
      var AsyncZipDeflate = /* @__PURE__ */ function() {
        function AsyncZipDeflate2(filename, opts) {
          var _this = this;
          if (!opts)
            opts = {};
          ZipPassThrough.call(this, filename);
          this.d = new AsyncDeflate(opts, function(err2, dat, final) {
            _this.ondata(err2, dat, final);
          });
          this.compression = 8;
          this.flag = dbf(opts.level);
          this.terminate = this.d.terminate;
        }
        AsyncZipDeflate2.prototype.process = function(chunk, final) {
          this.d.push(chunk, final);
        };
        AsyncZipDeflate2.prototype.push = function(chunk, final) {
          ZipPassThrough.prototype.push.call(this, chunk, final);
        };
        return AsyncZipDeflate2;
      }();
      exports.AsyncZipDeflate = AsyncZipDeflate;
      var Zip = /* @__PURE__ */ function() {
        function Zip2(cb) {
          this.ondata = cb;
          this.u = [];
          this.d = 1;
        }
        Zip2.prototype.add = function(file) {
          var _this = this;
          if (!this.ondata)
            err(5);
          if (this.d & 2)
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, false);
          else {
            var f = strToU8(file.filename), fl_1 = f.length;
            var com = file.comment, o = com && strToU8(com);
            var u = fl_1 != file.filename.length || o && com.length != o.length;
            var hl_1 = fl_1 + exfl(file.extra) + 30;
            if (fl_1 > 65535)
              this.ondata(err(11, 0, 1), null, false);
            var header = new u8(hl_1);
            wzh(header, 0, file, f, u, -1);
            var chks_1 = [header];
            var pAll_1 = function() {
              for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
                var chk = chks_2[_i];
                _this.ondata(null, chk, false);
              }
              chks_1 = [];
            };
            var tr_1 = this.d;
            this.d = 0;
            var ind_1 = this.u.length;
            var uf_1 = mrg(file, {
              f,
              u,
              o,
              t: function() {
                if (file.terminate)
                  file.terminate();
              },
              r: function() {
                pAll_1();
                if (tr_1) {
                  var nxt = _this.u[ind_1 + 1];
                  if (nxt)
                    nxt.r();
                  else
                    _this.d = 1;
                }
                tr_1 = 1;
              }
            });
            var cl_1 = 0;
            file.ondata = function(err2, dat, final) {
              if (err2) {
                _this.ondata(err2, dat, final);
                _this.terminate();
              } else {
                cl_1 += dat.length;
                chks_1.push(dat);
                if (final) {
                  var dd = new u8(16);
                  wbytes(dd, 0, 134695760);
                  wbytes(dd, 4, file.crc);
                  wbytes(dd, 8, cl_1);
                  wbytes(dd, 12, file.size);
                  chks_1.push(dd);
                  uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file.crc, uf_1.size = file.size;
                  if (tr_1)
                    uf_1.r();
                  tr_1 = 1;
                } else if (tr_1)
                  pAll_1();
              }
            };
            this.u.push(uf_1);
          }
        };
        Zip2.prototype.end = function() {
          var _this = this;
          if (this.d & 2) {
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
            return;
          }
          if (this.d)
            this.e();
          else
            this.u.push({
              r: function() {
                if (!(_this.d & 1))
                  return;
                _this.u.splice(-1, 1);
                _this.e();
              },
              t: function() {
              }
            });
          this.d = 3;
        };
        Zip2.prototype.e = function() {
          var bt = 0, l = 0, tl = 0;
          for (var _i = 0, _a2 = this.u; _i < _a2.length; _i++) {
            var f = _a2[_i];
            tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
          }
          var out = new u8(tl + 22);
          for (var _b2 = 0, _c = this.u; _b2 < _c.length; _b2++) {
            var f = _c[_b2];
            wzh(out, bt, f, f.f, f.u, -f.c - 2, l, f.o);
            bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
          }
          wzf(out, bt, this.u.length, tl, l);
          this.ondata(null, out, true);
          this.d = 2;
        };
        Zip2.prototype.terminate = function() {
          for (var _i = 0, _a2 = this.u; _i < _a2.length; _i++) {
            var f = _a2[_i];
            f.t();
          }
          this.d = 2;
        };
        return Zip2;
      }();
      exports.Zip = Zip;
      function zip(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        var r = {};
        fltn(data, "", r, opts);
        var k = Object.keys(r);
        var lft = k.length, o = 0, tot = 0;
        var slft = lft, files = new Array(lft);
        var term = [];
        var tAll = function() {
          for (var i3 = 0; i3 < term.length; ++i3)
            term[i3]();
        };
        var cbd = function(a, b) {
          mt(function() {
            cb(a, b);
          });
        };
        mt(function() {
          cbd = cb;
        });
        var cbf = function() {
          var out = new u8(tot + 22), oe = o, cdl = tot - o;
          tot = 0;
          for (var i3 = 0; i3 < slft; ++i3) {
            var f = files[i3];
            try {
              var l = f.c.length;
              wzh(out, tot, f, f.f, f.u, l);
              var badd = 30 + f.f.length + exfl(f.extra);
              var loc = tot + badd;
              out.set(f.c, loc);
              wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
            } catch (e) {
              return cbd(e, null);
            }
          }
          wzf(out, o, files.length, cdl, oe);
          cbd(null, out);
        };
        if (!lft)
          cbf();
        var _loop_1 = function(i3) {
          var fn = k[i3];
          var _a2 = r[fn], file = _a2[0], p = _a2[1];
          var c = crc(), size = file.length;
          c.p(file);
          var f = strToU8(fn), s = f.length;
          var com = p.comment, m = com && strToU8(com), ms = m && m.length;
          var exl = exfl(p.extra);
          var compression = p.level == 0 ? 0 : 8;
          var cbl = function(e, d) {
            if (e) {
              tAll();
              cbd(e, null);
            } else {
              var l = d.length;
              files[i3] = mrg(p, {
                size,
                crc: c.d(),
                c: d,
                f,
                m,
                u: s != fn.length || m && com.length != ms,
                compression
              });
              o += 30 + s + exl + l;
              tot += 76 + 2 * (s + exl) + (ms || 0) + l;
              if (!--lft)
                cbf();
            }
          };
          if (s > 65535)
            cbl(err(11, 0, 1), null);
          if (!compression)
            cbl(null, file);
          else if (size < 16e4) {
            try {
              cbl(null, deflateSync(file, p));
            } catch (e) {
              cbl(e, null);
            }
          } else
            term.push(deflate(file, p, cbl));
        };
        for (var i2 = 0; i2 < slft; ++i2) {
          _loop_1(i2);
        }
        return tAll;
      }
      exports.zip = zip;
      function zipSync(data, opts) {
        if (!opts)
          opts = {};
        var r = {};
        var files = [];
        fltn(data, "", r, opts);
        var o = 0;
        var tot = 0;
        for (var fn in r) {
          var _a2 = r[fn], file = _a2[0], p = _a2[1];
          var compression = p.level == 0 ? 0 : 8;
          var f = strToU8(fn), s = f.length;
          var com = p.comment, m = com && strToU8(com), ms = m && m.length;
          var exl = exfl(p.extra);
          if (s > 65535)
            err(11);
          var d = compression ? deflateSync(file, p) : file, l = d.length;
          var c = crc();
          c.p(file);
          files.push(mrg(p, {
            size: file.length,
            crc: c.d(),
            c: d,
            f,
            m,
            u: s != fn.length || m && com.length != ms,
            o,
            compression
          }));
          o += 30 + s + exl + l;
          tot += 76 + 2 * (s + exl) + (ms || 0) + l;
        }
        var out = new u8(tot + 22), oe = o, cdl = tot - o;
        for (var i2 = 0; i2 < files.length; ++i2) {
          var f = files[i2];
          wzh(out, f.o, f, f.f, f.u, f.c.length);
          var badd = 30 + f.f.length + exfl(f.extra);
          out.set(f.c, f.o + badd);
          wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
        }
        wzf(out, o, files.length, cdl, oe);
        return out;
      }
      exports.zipSync = zipSync;
      var UnzipPassThrough = /* @__PURE__ */ function() {
        function UnzipPassThrough2() {
        }
        UnzipPassThrough2.prototype.push = function(data, final) {
          this.ondata(null, data, final);
        };
        UnzipPassThrough2.compression = 0;
        return UnzipPassThrough2;
      }();
      exports.UnzipPassThrough = UnzipPassThrough;
      var UnzipInflate = /* @__PURE__ */ function() {
        function UnzipInflate2() {
          var _this = this;
          this.i = new Inflate(function(dat, final) {
            _this.ondata(null, dat, final);
          });
        }
        UnzipInflate2.prototype.push = function(data, final) {
          try {
            this.i.push(data, final);
          } catch (e) {
            this.ondata(e, null, final);
          }
        };
        UnzipInflate2.compression = 8;
        return UnzipInflate2;
      }();
      exports.UnzipInflate = UnzipInflate;
      var AsyncUnzipInflate = /* @__PURE__ */ function() {
        function AsyncUnzipInflate2(_, sz) {
          var _this = this;
          if (sz < 32e4) {
            this.i = new Inflate(function(dat, final) {
              _this.ondata(null, dat, final);
            });
          } else {
            this.i = new AsyncInflate(function(err2, dat, final) {
              _this.ondata(err2, dat, final);
            });
            this.terminate = this.i.terminate;
          }
        }
        AsyncUnzipInflate2.prototype.push = function(data, final) {
          if (this.i.terminate)
            data = slc(data, 0);
          this.i.push(data, final);
        };
        AsyncUnzipInflate2.compression = 8;
        return AsyncUnzipInflate2;
      }();
      exports.AsyncUnzipInflate = AsyncUnzipInflate;
      var Unzip = /* @__PURE__ */ function() {
        function Unzip2(cb) {
          this.onfile = cb;
          this.k = [];
          this.o = {
            0: UnzipPassThrough
          };
          this.p = et;
        }
        Unzip2.prototype.push = function(chunk, final) {
          var _this = this;
          if (!this.onfile)
            err(5);
          if (!this.p)
            err(4);
          if (this.c > 0) {
            var len = Math.min(this.c, chunk.length);
            var toAdd = chunk.subarray(0, len);
            this.c -= len;
            if (this.d)
              this.d.push(toAdd, !this.c);
            else
              this.k[0].push(toAdd);
            chunk = chunk.subarray(len);
            if (chunk.length)
              return this.push(chunk, final);
          } else {
            var f = 0, i2 = 0, is = void 0, buf = void 0;
            if (!this.p.length)
              buf = chunk;
            else if (!chunk.length)
              buf = this.p;
            else {
              buf = new u8(this.p.length + chunk.length);
              buf.set(this.p), buf.set(chunk, this.p.length);
            }
            var l = buf.length, oc = this.c, add = oc && this.d;
            var _loop_2 = function() {
              var _a2;
              var sig = b4(buf, i2);
              if (sig == 67324752) {
                f = 1, is = i2;
                this_1.d = null;
                this_1.c = 0;
                var bf = b2(buf, i2 + 6), cmp_1 = b2(buf, i2 + 8), u = bf & 2048, dd = bf & 8, fnl = b2(buf, i2 + 26), es = b2(buf, i2 + 28);
                if (l > i2 + 30 + fnl + es) {
                  var chks_3 = [];
                  this_1.k.unshift(chks_3);
                  f = 2;
                  var sc_1 = b4(buf, i2 + 18), su_1 = b4(buf, i2 + 22);
                  var fn_1 = strFromU8(buf.subarray(i2 + 30, i2 += 30 + fnl), !u);
                  if (sc_1 == 4294967295) {
                    _a2 = dd ? [-2] : z64e(buf, i2), sc_1 = _a2[0], su_1 = _a2[1];
                  } else if (dd)
                    sc_1 = -1;
                  i2 += es;
                  this_1.c = sc_1;
                  var d_1;
                  var file_1 = {
                    name: fn_1,
                    compression: cmp_1,
                    start: function() {
                      if (!file_1.ondata)
                        err(5);
                      if (!sc_1)
                        file_1.ondata(null, et, true);
                      else {
                        var ctr = _this.o[cmp_1];
                        if (!ctr)
                          file_1.ondata(err(14, "unknown compression type " + cmp_1, 1), null, false);
                        d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                        d_1.ondata = function(err2, dat3, final2) {
                          file_1.ondata(err2, dat3, final2);
                        };
                        for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                          var dat2 = chks_4[_i];
                          d_1.push(dat2, false);
                        }
                        if (_this.k[0] == chks_3 && _this.c)
                          _this.d = d_1;
                        else
                          d_1.push(et, true);
                      }
                    },
                    terminate: function() {
                      if (d_1 && d_1.terminate)
                        d_1.terminate();
                    }
                  };
                  if (sc_1 >= 0)
                    file_1.size = sc_1, file_1.originalSize = su_1;
                  this_1.onfile(file_1);
                }
                return "break";
              } else if (oc) {
                if (sig == 134695760) {
                  is = i2 += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
                  return "break";
                } else if (sig == 33639248) {
                  is = i2 -= 4, f = 3, this_1.c = 0;
                  return "break";
                }
              }
            };
            var this_1 = this;
            for (; i2 < l - 4; ++i2) {
              var state_1 = _loop_2();
              if (state_1 === "break")
                break;
            }
            this.p = et;
            if (oc < 0) {
              var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 134695760 && 4)) : buf.subarray(0, i2);
              if (add)
                add.push(dat, !!f);
              else
                this.k[+(f == 2)].push(dat);
            }
            if (f & 2)
              return this.push(buf.subarray(i2), final);
            this.p = buf.subarray(i2);
          }
          if (final) {
            if (this.c)
              err(13);
            this.p = null;
          }
        };
        Unzip2.prototype.register = function(decoder) {
          this.o[decoder.compression] = decoder;
        };
        return Unzip2;
      }();
      exports.Unzip = Unzip;
      var mt = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(fn) {
        fn();
      };
      function unzip(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        var term = [];
        var tAll = function() {
          for (var i3 = 0; i3 < term.length; ++i3)
            term[i3]();
        };
        var files = {};
        var cbd = function(a, b) {
          mt(function() {
            cb(a, b);
          });
        };
        mt(function() {
          cbd = cb;
        });
        var e = data.length - 22;
        for (; b4(data, e) != 101010256; --e) {
          if (!e || data.length - e > 65558) {
            cbd(err(13, 0, 1), null);
            return tAll;
          }
        }
        ;
        var lft = b2(data, e + 8);
        if (lft) {
          var c = lft;
          var o = b4(data, e + 16);
          var z = o == 4294967295 || c == 65535;
          if (z) {
            var ze = b4(data, e - 12);
            z = b4(data, ze) == 101075792;
            if (z) {
              c = lft = b4(data, ze + 32);
              o = b4(data, ze + 48);
            }
          }
          var fltr = opts && opts.filter;
          var _loop_3 = function(i3) {
            var _a2 = zh(data, o, z), c_1 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
            o = no;
            var cbl = function(e2, d) {
              if (e2) {
                tAll();
                cbd(e2, null);
              } else {
                if (d)
                  files[fn] = d;
                if (!--lft)
                  cbd(null, files);
              }
            };
            if (!fltr || fltr({
              name: fn,
              size: sc,
              originalSize: su,
              compression: c_1
            })) {
              if (!c_1)
                cbl(null, slc(data, b, b + sc));
              else if (c_1 == 8) {
                var infl = data.subarray(b, b + sc);
                if (su < 524288 || sc > 0.8 * su) {
                  try {
                    cbl(null, inflateSync(infl, { out: new u8(su) }));
                  } catch (e2) {
                    cbl(e2, null);
                  }
                } else
                  term.push(inflate(infl, { size: su }, cbl));
              } else
                cbl(err(14, "unknown compression type " + c_1, 1), null);
            } else
              cbl(null, null);
          };
          for (var i2 = 0; i2 < c; ++i2) {
            _loop_3(i2);
          }
        } else
          cbd(null, {});
        return tAll;
      }
      exports.unzip = unzip;
      function unzipSync(data, opts) {
        var files = {};
        var e = data.length - 22;
        for (; b4(data, e) != 101010256; --e) {
          if (!e || data.length - e > 65558)
            err(13);
        }
        ;
        var c = b2(data, e + 8);
        if (!c)
          return {};
        var o = b4(data, e + 16);
        var z = o == 4294967295 || c == 65535;
        if (z) {
          var ze = b4(data, e - 12);
          z = b4(data, ze) == 101075792;
          if (z) {
            c = b4(data, ze + 32);
            o = b4(data, ze + 48);
          }
        }
        var fltr = opts && opts.filter;
        for (var i2 = 0; i2 < c; ++i2) {
          var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
          o = no;
          if (!fltr || fltr({
            name: fn,
            size: sc,
            originalSize: su,
            compression: c_2
          })) {
            if (!c_2)
              files[fn] = slc(data, b, b + sc);
            else if (c_2 == 8)
              files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
            else
              err(14, "unknown compression type " + c_2);
          }
        }
        return files;
      }
      exports.unzipSync = unzipSync;
    }
  });

  // bridge/shims/zlib.js
  var require_zlib = __commonJS({
    "bridge/shims/zlib.js"(exports, module) {
      init_buffer_inject();
      var { gunzipSync } = require_browser();
      module.exports = { gunzipSync: (buf) => import_buffer.Buffer.from(gunzipSync(new Uint8Array(buf))) };
    }
  });

  // bridge/shims/fs.js
  var require_fs = __commonJS({
    "bridge/shims/fs.js"(exports, module) {
      init_buffer_inject();
      module.exports = {};
    }
  });

  // bridge/shims/path.js
  var require_path = __commonJS({
    "bridge/shims/path.js"(exports, module) {
      init_buffer_inject();
      module.exports = { join: (...a) => a.join("/") };
    }
  });

  // ../src/util.js
  var require_util = __commonJS({
    "../src/util.js"(exports, module) {
      "use strict";
      init_buffer_inject();
      var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
      async function pool(items, limit, fn) {
        let next = 0;
        const out = new Array(items.length);
        const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
          for (; ; ) {
            const k = next++;
            if (k >= items.length) return;
            try {
              out[k] = await fn(items[k], k);
            } catch (e) {
              out[k] = void 0;
            }
          }
        });
        await Promise.all(workers);
        return out;
      }
      var norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
      module.exports = { UA, pool, norm };
    }
  });

  // ../src/epg.js
  var require_epg = __commonJS({
    "../src/epg.js"(exports, module) {
      "use strict";
      init_buffer_inject();
      var zlib = require_zlib();
      var fs = require_fs();
      var path = require_path();
      var crypto = require_crypto();
      var { baseName } = require_parser();
      var { pool, UA } = require_util();
      var ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
      var dec = (s) => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, k) => {
        var _a;
        if (k[0] === "#") {
          const n = k[1].toLowerCase() === "x" ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10);
          try {
            return String.fromCodePoint(n);
          } catch (e) {
            return "";
          }
        }
        return (_a = ENT[k.toLowerCase()]) != null ? _a : m;
      });
      var text = (s) => dec(s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")).trim();
      function parseTime(s) {
        const m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?\s*([+-])?(\d{2})?(\d{2})?/.exec(s || "");
        if (!m) return NaN;
        let t = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
        if (m[7] && m[8]) t -= (m[7] === "-" ? -1 : 1) * (+m[8] * 60 + +(m[9] || 0)) * 6e4;
        return t;
      }
      function parseXmltv(xml, from, to) {
        const names = /* @__PURE__ */ new Map();
        const progs = /* @__PURE__ */ new Map();
        for (const m of xml.matchAll(/<channel\s+id="([^"]*)"[^>]*>([\s\S]*?)<\/channel>/g)) {
          const list = [];
          for (const d of m[2].matchAll(/<display-name[^>]*>([\s\S]*?)<\/display-name>/g)) list.push(text(d[1]));
          names.set(dec(m[1]), list);
        }
        for (const m of xml.matchAll(/<programme\s+([^>]*?)>([\s\S]*?)<\/programme>/g)) {
          const a = m[1];
          const st = /start="([^"]*)"/.exec(a);
          const sp = /stop="([^"]*)"/.exec(a);
          const ch = /channel="([^"]*)"/.exec(a);
          if (!st || !sp || !ch) continue;
          const s = parseTime(st[1]);
          const e = parseTime(sp[1]);
          if (!(e > s) || e < from || s > to) continue;
          const t = /<title[^>]*>([\s\S]*?)<\/title>/.exec(m[2]);
          const d = /<desc[^>]*>([\s\S]*?)<\/desc>/.exec(m[2]);
          const id = dec(ch[1]);
          let arr = progs.get(id);
          if (!arr) progs.set(id, arr = []);
          arr.push([s, e, t ? text(t[1]) : "", d ? text(d[1]).slice(0, 400) : ""]);
        }
        return { names, progs };
      }
      async function fetchBuf(url, ms) {
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), ms);
        try {
          const r = await fetch(url, { signal: ac.signal, headers: { "User-Agent": UA } });
          if (!r.ok) throw new Error("HTTP " + r.status);
          return import_buffer.Buffer.from(await r.arrayBuffer());
        } finally {
          clearTimeout(timer);
        }
      }
      function toText(buf) {
        if (buf[0] === 31 && buf[1] === 139) buf = zlib.gunzipSync(buf);
        else if (buf[0] === 253 && buf[1] === 55 && buf[2] === 122) throw new Error("formato .xz não suportado");
        return buf.toString("utf8");
      }
      var push = (map, k, v) => {
        const a = map.get(k);
        if (a) {
          if (!a.includes(v)) a.push(v);
        } else map.set(k, [v]);
      };
      function matchKey(s) {
        const k = baseName(String(s).replace(/_/g, " ")).replace(/\blocal\b/g, " ").replace(/\bsao paulo\b/g, "sp").replace(/\brio de janeiro\b/g, "rj").replace(/\brecord ?tv\b/g, "record").replace(/\brede ?tv\b/g, "redetv").replace(/\b(tv globo|globo tv)\b/g, "globo");
        return k.replace(/[^a-z0-9]/g, "");
      }
      var BRANDS = ["globo", "sbt", "record", "band", "redetv", "cultura"];
      var NOT_AFFILIATE = /^(news|sport|play|kids|novela|serie|mais|max)/;
      function brandOf(key) {
        for (const b of BRANDS) if (key.startsWith(b) && !NOT_AFFILIATE.test(key.slice(b.length))) return b;
        return null;
      }
      function tidy(arr) {
        const seen = /* @__PURE__ */ new Set();
        return arr.slice().sort((a, b) => a[0] - b[0]).filter((p) => seen.has(p[0]) ? false : seen.add(p[0]));
      }
      function buildMaps(channels) {
        const idCount = /* @__PURE__ */ new Map();
        channels.forEach(
          (c) => c.tvgIds.forEach((i) => idCount.set(i.toLowerCase(), (idCount.get(i.toLowerCase()) || 0) + 1))
        );
        const byId = /* @__PURE__ */ new Map();
        const byName = /* @__PURE__ */ new Map();
        const byKey = /* @__PURE__ */ new Map();
        for (const c of channels) {
          for (const i of c.tvgIds) {
            const k = i.toLowerCase();
            if (idCount.get(k) <= 3) push(byId, k, c.id);
          }
          push(byName, c.base, c.id);
          const key = matchKey(c.name);
          if (key) push(byKey, key, c.id);
        }
        return { byId, byName, byKey };
      }
      function matchXmltv(xml, maps, from, to) {
        const { names, progs } = parseXmltv(xml, from, to);
        const res = {};
        const nat = {};
        for (const [eid, arr] of progs) {
          const targets = /* @__PURE__ */ new Set();
          const add = (list) => (list || []).forEach((x) => targets.add(x));
          add(maps.byId.get(eid.toLowerCase()));
          const labels = [eid.replace(/\.[a-z]{2}$/i, ""), ...names.get(eid) || []];
          for (const n of labels) {
            add(maps.byName.get(baseName(n)));
            const key = matchKey(n);
            add(maps.byKey.get(key));
            for (const b of BRANDS) if (key === b || key === b + "sp") nat[b] = nat[b] || arr;
          }
          for (const t of targets) if (!res[t]) res[t] = arr;
        }
        for (const k of Object.keys(res)) res[k] = tidy(res[k]);
        for (const b of Object.keys(nat)) nat[b] = tidy(nat[b]);
        Object.defineProperty(res, "__nat", { value: nat, enumerable: false });
        return res;
      }
      async function build({ urls, channels, onProgress, log }) {
        const now = Date.now();
        const from = now - 3 * 36e5;
        const to = now + 30 * 36e5;
        const maps = buildMaps(channels);
        let done = 0;
        const parts = await pool(urls, 3, async (u) => {
          try {
            const xml = toText(await fetchBuf(u, 9e4));
            if (!xml.includes("<programme")) throw new Error("não é um arquivo XMLTV");
            return matchXmltv(xml, maps, from, to);
          } catch (e) {
            if (log) log(u, e.message);
            return {};
          } finally {
            done++;
            if (onProgress) onProgress(done, urls.length);
          }
        });
        const out = {};
        const nat = {};
        for (const part of parts) {
          for (const k of Object.keys(part || {})) if (!out[k]) out[k] = part[k];
          for (const b of Object.keys(part && part.__nat || {})) nat[b] = nat[b] || part.__nat[b];
        }
        for (const c of channels) {
          if (out[c.id]) continue;
          const b = brandOf(matchKey(c.name));
          if (b && nat[b]) out[c.id] = nat[b];
        }
        return out;
      }
      var keyOf = (urls, channels) => crypto.createHash("md5").update(urls.join("\n") + "|" + channels.map((c) => c.id).join(",")).digest("hex");
      var file = (dir) => path.join(dir, "epg-cache.json");
      function readCache(dir) {
        try {
          return JSON.parse(fs.readFileSync(file(dir), "utf8"));
        } catch (e) {
          return null;
        }
      }
      function writeCache(dir, key, data) {
        fs.writeFileSync(file(dir), JSON.stringify({ key, ts: Date.now(), data }));
      }
      module.exports = { build, keyOf, readCache, writeCache, parseXmltv, matchXmltv, buildMaps, parseTime, matchKey, brandOf };
    }
  });

  // ../src/merge.js
  var require_merge = __commonJS({
    "../src/merge.js"(exports, module) {
      "use strict";
      init_buffer_inject();
      var crypto = require_crypto();
      var { matchKey } = require_epg();
      var norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
      var push = (m, k, v) => m.has(k) ? m.get(k).push(v) : m.set(k, [v]);
      function mergeLists(parts) {
        const out = [];
        const ids = /* @__PURE__ */ new Set();
        const byKey = /* @__PURE__ */ new Map();
        const byTvg = /* @__PURE__ */ new Map();
        const epgUrls = [];
        let merged = 0;
        const index = (c) => {
          const k = matchKey(c.name);
          if (k) push(byKey, k, c);
          c.tvgIds.forEach((i) => push(byTvg, i.toLowerCase(), c));
        };
        parts.forEach((part, pi) => {
          const { parsed } = part;
          (parsed.epgUrls || []).forEach((u) => !epgUrls.includes(u) && epgUrls.push(u));
          const inCount = /* @__PURE__ */ new Map();
          parsed.channels.forEach((c) => c.tvgIds.forEach((i) => inCount.set(i.toLowerCase(), (inCount.get(i.toLowerCase()) || 0) + 1)));
          const added = [];
          for (const src of parsed.channels) {
            const c = {
              ...src,
              tvgIds: [...src.tvgIds],
              sources: src.sources.map((s) => ({ url: s.url, label: pi ? `${s.label} · ${part.name}` : s.label }))
            };
            let target = null;
            if (pi > 0) {
              const cands = byKey.get(matchKey(c.name)) || [];
              target = cands.find((x) => norm(x.group) === norm(c.group)) || cands[0] || null;
              if (!target) {
                for (const id of c.tvgIds) {
                  const k = id.toLowerCase();
                  const list = byTvg.get(k);
                  if (list && list.length === 1 && inCount.get(k) === 1) {
                    target = list[0];
                    break;
                  }
                }
              }
            }
            if (target) {
              merged++;
              for (const s of c.sources) if (!target.sources.some((x) => x.url === s.url)) target.sources.push(s);
              for (const id of c.tvgIds) if (!target.tvgIds.includes(id)) target.tvgIds.push(id);
              if (!target.logo && c.logo) target.logo = c.logo;
            } else {
              if (ids.has(c.id)) c.id = crypto.createHash("md5").update(c.id + "|" + pi).digest("hex").slice(0, 10);
              ids.add(c.id);
              out.push(c);
              added.push(c);
            }
          }
          added.forEach(index);
        });
        out.forEach((c, i) => c.num = i + 1);
        const gm = /* @__PURE__ */ new Map();
        out.forEach((c) => gm.set(c.group, (gm.get(c.group) || 0) + 1));
        return { channels: out, epgUrls, groups: [...gm].map(([name, count]) => ({ name, count })), merged };
      }
      module.exports = { mergeLists };
    }
  });

  // ../src/checker.js
  var require_checker = __commonJS({
    "../src/checker.js"(exports, module) {
      "use strict";
      init_buffer_inject();
      var { pool, UA } = require_util();
      async function probe(url, ms = 7e3) {
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), ms);
        try {
          const r = await fetch(url, { signal: ac.signal, headers: { "User-Agent": UA }, redirect: "follow" });
          if (!r.ok) return false;
          const reader = r.body.getReader();
          const { value } = await reader.read();
          reader.cancel().catch(() => {
          });
          if (!value || !value.length) return false;
          const head = import_buffer.Buffer.from(value.slice(0, 32)).toString("latin1");
          if (/^\s*<(!doctype|html|\?xml)/i.test(head)) return false;
          return true;
        } catch (e) {
          return false;
        } finally {
          clearTimeout(timer);
          ac.abort();
        }
      }
      async function checkAll(urls, onProgress, ctl = {}, concurrency = 16) {
        const result = {};
        let done = 0;
        await pool(urls, concurrency, async (u) => {
          if (ctl.cancelled) return;
          const t0 = Date.now();
          const ok = await probe(u);
          result[u] = { ok, ms: Date.now() - t0, at: Date.now() };
          done++;
          if (onProgress && (done % 5 === 0 || done === urls.length)) onProgress(done, urls.length);
        });
        return result;
      }
      module.exports = { checkAll, probe };
    }
  });

  // ../src/core.js
  var require_core = __commonJS({
    "../src/core.js"(exports, module) {
      "use strict";
      init_buffer_inject();
      var { parseM3U, normalizePlaylistUrl } = require_parser();
      var epg = require_epg();
      var { mergeLists } = require_merge();
      var { checkAll } = require_checker();
      var { UA, norm } = require_util();
      var DEFAULTS = {
        playlistUrl: "https://github.com/ManoLimah/Manoteste/blob/main/ManoTV.m3u",
        // Grupos que são propaganda do dono da lista (PIX, WhatsApp, aviso de atualização)
        hiddenGroups: ["ManoTV", "DOAÇÃO PIX", "QUER UM TEST CHAMA", "ATUALIZADO"],
        extraEpg: [],
        epgEnabled: true,
        hideDead: false,
        autoPlayLast: false,
        autoCheck: false,
        playlists: null,
        // [{id, name, url, enabled}] — se vazio, usa playlistUrl
        lockedGroups: [],
        // categorias protegidas por PIN
        pin: null
        // { salt, hash } do controle dos pais
      };
      function createCore2({ store, send = () => {
      }, log = () => {
      } }) {
        let last = null;
        function getSettings() {
          const s = { ...DEFAULTS, ...store.readJson("settings.json", {}) };
          if (!Array.isArray(s.playlists) || !s.playlists.length) s.playlists = [{ id: "p1", name: "Lista principal", url: s.playlistUrl, enabled: true }];
          return s;
        }
        function setSettings(patch) {
          const s = { ...getSettings(), ...patch };
          store.writeJson("settings.json", s);
          return s;
        }
        async function fetchList(pl) {
          const id = String(pl.id || "p").replace(/[^\w-]/g, "");
          const cacheName = `playlist-${id}.m3u`;
          let body = null;
          let fromCache = false;
          let error = null;
          try {
            const ac = new AbortController();
            const timer = setTimeout(() => ac.abort(), 3e4);
            const r = await fetch(normalizePlaylistUrl(pl.url), { signal: ac.signal, headers: { "User-Agent": UA } });
            clearTimeout(timer);
            if (!r.ok) throw new Error("HTTP " + r.status);
            body = await r.text();
            if (!/#EXTM3U|#EXTINF/i.test(body)) throw new Error("o link não devolveu uma lista M3U");
            store.writeText(cacheName, body);
          } catch (e) {
            error = e.name === "AbortError" ? "tempo esgotado ao baixar a lista" : e.message;
            const cached = store.readText(cacheName) || (id === "p1" ? store.readText("playlist.m3u") : null);
            if (cached) {
              body = cached;
              fromCache = true;
            }
          }
          return { name: pl.name || "Lista", body, fromCache, error };
        }
        async function loadPlaylist() {
          const s = getSettings();
          const lists = s.playlists.filter((p) => p.enabled !== false && p.url && p.url.trim());
          if (!lists.length) return { error: "Nenhuma lista ativa. Adicione um link em Configurações." };
          const got = await Promise.all(lists.map(fetchList));
          got.forEach((g) => g.parsed = g.body ? parseM3U(g.body) : null);
          const parts = got.filter((g) => g.parsed).map((g) => ({ name: g.name, parsed: g.parsed }));
          if (!parts.length) return { error: got.map((g) => `${g.name}: ${g.error}`).join(" | ") };
          const m = mergeLists(parts);
          last = { channels: m.channels, epgUrls: m.epgUrls };
          return {
            channels: m.channels,
            epgUrls: m.epgUrls,
            stats: {
              channels: m.channels.length,
              merged: m.merged,
              lists: got.map((g) => ({ name: g.name, ok: !!g.body, fromCache: g.fromCache, error: g.error, channels: g.parsed ? g.parsed.channels.length : 0 }))
            },
            fromCache: got.every((g) => !g.body || g.fromCache),
            error: got.some((g) => g.error) ? got.filter((g) => g.error).map((g) => `${g.name}: ${g.error}`).join(" | ") : null,
            updatedAt: Date.now()
          };
        }
        let epgRunning = false;
        async function epgStart() {
          const s = getSettings();
          if (!s.epgEnabled || !last) return;
          const urls = [.../* @__PURE__ */ new Set([...last.epgUrls || [], ...s.extraEpg || []])];
          if (!urls.length) return;
          const key = epg.keyOf(urls, last.channels);
          const cached = store.readJson("epg-cache.json", null);
          if (cached && cached.key === key) {
            send("epg:data", cached.data);
            if (Date.now() - cached.ts < 3 * 36e5) return;
          }
          if (epgRunning) return;
          epgRunning = true;
          try {
            const data = await epg.build({
              urls,
              channels: last.channels,
              onProgress: (done, total) => send("epg:progress", { done, total }),
              log: (u, m) => log("[EPG]", u, m)
            });
            store.writeJson("epg-cache.json", { key, ts: Date.now(), data });
            send("epg:data", data);
          } catch (e) {
            log("[EPG]", e);
          } finally {
            epgRunning = false;
          }
        }
        let checkCtl = null;
        const checkGet = () => store.readJson("checks.json", {});
        const checkCancel = () => {
          if (checkCtl) checkCtl.cancelled = true;
        };
        async function checkRun() {
          if (!last || checkCtl) return null;
          const hidden = new Set(getSettings().hiddenGroups.map(norm));
          const urls = [];
          for (const c of last.channels) if (!hidden.has(norm(c.group))) for (const s of c.sources) urls.push(s.url);
          checkCtl = { cancelled: false };
          try {
            const res = await checkAll(urls, (done, total) => send("check:progress", { done, total }), checkCtl);
            const saved = { ...checkGet(), ...res };
            store.writeJson("checks.json", saved);
            return saved;
          } finally {
            checkCtl = null;
          }
        }
        return { getSettings, setSettings, loadPlaylist, epgStart, checkGet, checkCancel, checkRun };
      }
      module.exports = { createCore: createCore2, DEFAULTS };
    }
  });

  // bridge/bridge.js
  init_buffer_inject();
  var { createCore } = require_core();
  (function() {
    const N = window.Native;
    document.body.classList.add("tv");
    const vp = document.querySelector("meta[name=viewport]");
    if (vp && window.innerWidth > 1500) vp.setAttribute("content", "width=1280");
    const hint = document.querySelector("#miniHead span");
    if (hint) hint.textContent = "▲▼ escolhe · ◀▶ categoria · OK assiste · Voltar fecha";
    const log = (...a) => {
      try {
        N.log(a.map((x) => x && x.message || String(x)).join(" "));
      } catch (e) {
      }
    };
    const store = {
      readText(f) {
        try {
          const t = N.readFile(f);
          return t == null ? null : String(t);
        } catch (e) {
          return null;
        }
      },
      writeText(f, t) {
        N.writeFile(f, t);
      },
      readJson(f, d) {
        try {
          const t = store.readText(f);
          return t ? JSON.parse(t) : d;
        } catch (e) {
          return d;
        }
      },
      writeJson(f, v) {
        N.writeFile(f, JSON.stringify(v));
      }
    };
    const listeners = {};
    const send = (ch, data) => (listeners[ch] || []).slice().forEach((cb) => cb(data));
    const core = createCore({ store, send, log });
    const b64 = (buf) => {
      const u8 = new Uint8Array(buf);
      let s = "";
      for (let i = 0; i < u8.length; i += 32768) s += String.fromCharCode.apply(null, u8.subarray(i, i + 32768));
      return btoa(s);
    };
    window.api = {
      getSettings: async () => core.getSettings(),
      setSettings: async (p) => core.setSettings(p),
      loadPlaylist: () => core.loadPlaylist(),
      epgStart: () => core.epgStart(),
      getChecks: async () => core.checkGet(),
      checkRun: () => core.checkRun(),
      checkCancel: async () => core.checkCancel(),
      recOpen: async (name) => JSON.parse(N.recOpen(String(name || "canal"))),
      recChunk: async (id, buf) => N.recChunk(id, b64(buf)),
      recClose: async (id) => N.recClose(id) || null,
      openRecordings: async () => {
        const toast = document.querySelector("#toast");
        if (toast) {
          toast.textContent = "As gravações ficam em: " + N.recDir();
          toast.hidden = false;
          setTimeout(() => toast.hidden = true, 8e3);
        }
      },
      backupSave: async (data) => N.saveBackup(JSON.stringify({ app: "livebox", version: 1, savedAt: (/* @__PURE__ */ new Date()).toISOString(), ...data }, null, 2)) || null,
      backupOpen: async () => {
        const t = N.readBackup();
        if (!t) return { error: "Nenhum backup encontrado. Coloque o arquivo livebox-backup.json em: " + N.backupDir() };
        try {
          const d = JSON.parse(t);
          return d.app === "livebox" ? d : { error: "Este arquivo não é um backup do LiveBox." };
        } catch (e) {
          return { error: "Não consegui ler o arquivo: " + e.message };
        }
      },
      on(channel, cb) {
        (listeners[channel] = listeners[channel] || []).push(cb);
        return () => listeners[channel] = listeners[channel].filter((f) => f !== cb);
      }
    };
    const m = /Chrome\/(\d+)/.exec(navigator.userAgent);
    if (m && +m[1] < 84) {
      window.addEventListener("load", () => {
        const d = document.createElement("div");
        d.style.cssText = "position:fixed;left:0;right:0;bottom:0;padding:18px 28px;background:#7a1f1f;color:#fff;font:20px sans-serif;z-index:99999";
        d.textContent = `O WebView desta TV é antigo (Chrome ${m[1]}). Atualize "Android System WebView" na Play Store para o visual funcionar direito.`;
        document.body.appendChild(d);
      });
    }
    log("LiveBox TV iniciado. Chrome", m ? m[1] : "?", "largura", window.innerWidth, "dpr", window.devicePixelRatio);
  })();
})();
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

js-md5/src/md5.js:
  (**
   * [js-md5]{@link https://github.com/emn178/js-md5}
   *
   * @namespace md5
   * @version 0.8.3
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2023
   * @license MIT
   *)
*/
