// node_modules/@vue/devtools-shared/dist/index.js
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
var __toESM = (mod, isNodeMode, target2) => (target2 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target2, "default", { value: mod, enumerable: true }) : target2,
  mod
));
var init_esm_shims = __esm({
  "../../node_modules/.pnpm/tsup@8.4.0_@microsoft+api-extractor@7.51.1_@types+node@22.13.14__jiti@2.4.2_postcss@8.5_96eb05a9d65343021e53791dd83f3773/node_modules/tsup/assets/esm_shims.js"() {
    "use strict";
  }
});
var require_rfdc = __commonJS({
  "../../node_modules/.pnpm/rfdc@1.4.1/node_modules/rfdc/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    module.exports = rfdc2;
    function copyBuffer(cur) {
      if (cur instanceof Buffer) {
        return Buffer.from(cur);
      }
      return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
    }
    function rfdc2(opts) {
      opts = opts || {};
      if (opts.circles) return rfdcCircles(opts);
      const constructorHandlers = /* @__PURE__ */ new Map();
      constructorHandlers.set(Date, (o) => new Date(o));
      constructorHandlers.set(Map, (o, fn) => new Map(cloneArray(Array.from(o), fn)));
      constructorHandlers.set(Set, (o, fn) => new Set(cloneArray(Array.from(o), fn)));
      if (opts.constructorHandlers) {
        for (const handler2 of opts.constructorHandlers) {
          constructorHandlers.set(handler2[0], handler2[1]);
        }
      }
      let handler = null;
      return opts.proto ? cloneProto : clone;
      function cloneArray(a, fn) {
        const keys = Object.keys(a);
        const a2 = new Array(keys.length);
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          const cur = a[k];
          if (typeof cur !== "object" || cur === null) {
            a2[k] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            a2[k] = handler(cur, fn);
          } else if (ArrayBuffer.isView(cur)) {
            a2[k] = copyBuffer(cur);
          } else {
            a2[k] = fn(cur);
          }
        }
        return a2;
      }
      function clone(o) {
        if (typeof o !== "object" || o === null) return o;
        if (Array.isArray(o)) return cloneArray(o, clone);
        if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
          return handler(o, clone);
        }
        const o2 = {};
        for (const k in o) {
          if (Object.hasOwnProperty.call(o, k) === false) continue;
          const cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            o2[k] = handler(cur, clone);
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            o2[k] = clone(cur);
          }
        }
        return o2;
      }
      function cloneProto(o) {
        if (typeof o !== "object" || o === null) return o;
        if (Array.isArray(o)) return cloneArray(o, cloneProto);
        if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
          return handler(o, cloneProto);
        }
        const o2 = {};
        for (const k in o) {
          const cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            o2[k] = handler(cur, cloneProto);
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            o2[k] = cloneProto(cur);
          }
        }
        return o2;
      }
    }
    function rfdcCircles(opts) {
      const refs = [];
      const refsNew = [];
      const constructorHandlers = /* @__PURE__ */ new Map();
      constructorHandlers.set(Date, (o) => new Date(o));
      constructorHandlers.set(Map, (o, fn) => new Map(cloneArray(Array.from(o), fn)));
      constructorHandlers.set(Set, (o, fn) => new Set(cloneArray(Array.from(o), fn)));
      if (opts.constructorHandlers) {
        for (const handler2 of opts.constructorHandlers) {
          constructorHandlers.set(handler2[0], handler2[1]);
        }
      }
      let handler = null;
      return opts.proto ? cloneProto : clone;
      function cloneArray(a, fn) {
        const keys = Object.keys(a);
        const a2 = new Array(keys.length);
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          const cur = a[k];
          if (typeof cur !== "object" || cur === null) {
            a2[k] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            a2[k] = handler(cur, fn);
          } else if (ArrayBuffer.isView(cur)) {
            a2[k] = copyBuffer(cur);
          } else {
            const index = refs.indexOf(cur);
            if (index !== -1) {
              a2[k] = refsNew[index];
            } else {
              a2[k] = fn(cur);
            }
          }
        }
        return a2;
      }
      function clone(o) {
        if (typeof o !== "object" || o === null) return o;
        if (Array.isArray(o)) return cloneArray(o, clone);
        if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
          return handler(o, clone);
        }
        const o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for (const k in o) {
          if (Object.hasOwnProperty.call(o, k) === false) continue;
          const cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            o2[k] = handler(cur, clone);
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            const i = refs.indexOf(cur);
            if (i !== -1) {
              o2[k] = refsNew[i];
            } else {
              o2[k] = clone(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o2;
      }
      function cloneProto(o) {
        if (typeof o !== "object" || o === null) return o;
        if (Array.isArray(o)) return cloneArray(o, cloneProto);
        if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
          return handler(o, cloneProto);
        }
        const o2 = {};
        refs.push(o);
        refsNew.push(o2);
        for (const k in o) {
          const cur = o[k];
          if (typeof cur !== "object" || cur === null) {
            o2[k] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            o2[k] = handler(cur, cloneProto);
          } else if (ArrayBuffer.isView(cur)) {
            o2[k] = copyBuffer(cur);
          } else {
            const i = refs.indexOf(cur);
            if (i !== -1) {
              o2[k] = refsNew[i];
            } else {
              o2[k] = cloneProto(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o2;
      }
    }
  }
});
init_esm_shims();
init_esm_shims();
init_esm_shims();
var isBrowser = typeof navigator !== "undefined";
var target = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : {};
var isInChromePanel = typeof target.chrome !== "undefined" && !!target.chrome.devtools;
var isInIframe = isBrowser && target.self !== target.top;
var _a;
var isInElectron = typeof navigator !== "undefined" && ((_a = navigator.userAgent) == null ? void 0 : _a.toLowerCase().includes("electron"));
var isNuxtApp = typeof window !== "undefined" && !!window.__NUXT__;
init_esm_shims();
var import_rfdc = __toESM(require_rfdc(), 1);
var classifyRE = /(?:^|[-_/])(\w)/g;
var camelizeRE = /-(\w)/g;
var kebabizeRE = /([a-z0-9])([A-Z])/g;
function toUpper(_, c) {
  return c ? c.toUpperCase() : "";
}
function classify(str) {
  return str && `${str}`.replace(classifyRE, toUpper);
}
function camelize(str) {
  return str && str.replace(camelizeRE, toUpper);
}
function kebabize(str) {
  return str && str.replace(kebabizeRE, (_, lowerCaseCharacter, upperCaseLetter) => {
    return `${lowerCaseCharacter}-${upperCaseLetter}`;
  }).toLowerCase();
}
function basename(filename, ext) {
  let normalizedFilename = filename.replace(/^[a-z]:/i, "").replace(/\\/g, "/");
  if (normalizedFilename.endsWith(`index${ext}`)) {
    normalizedFilename = normalizedFilename.replace(`/index${ext}`, ext);
  }
  const lastSlashIndex = normalizedFilename.lastIndexOf("/");
  const baseNameWithExt = normalizedFilename.substring(lastSlashIndex + 1);
  if (ext) {
    const extIndex = baseNameWithExt.lastIndexOf(ext);
    return baseNameWithExt.substring(0, extIndex);
  }
  return "";
}
var HTTP_URL_RE = /^https?:\/\//;
function isUrlString(str) {
  return str.startsWith("/") || HTTP_URL_RE.test(str);
}
var deepClone = (0, import_rfdc.default)({ circles: true });

// node_modules/perfect-debounce/dist/index.mjs
var DEBOUNCE_DEFAULTS = {
  trailing: true
};
function debounce(fn, wait = 25, options = {}) {
  options = { ...DEBOUNCE_DEFAULTS, ...options };
  if (!Number.isFinite(wait)) {
    throw new TypeError("Expected `wait` to be a finite number");
  }
  let leadingValue;
  let timeout;
  let resolveList = [];
  let currentPromise;
  let trailingArgs;
  const applyFn = (_this, args) => {
    currentPromise = _applyPromised(fn, _this, args);
    currentPromise.finally(() => {
      currentPromise = null;
      if (options.trailing && trailingArgs && !timeout) {
        const promise = applyFn(_this, trailingArgs);
        trailingArgs = null;
        return promise;
      }
    });
    return currentPromise;
  };
  return function(...args) {
    if (currentPromise) {
      if (options.trailing) {
        trailingArgs = args;
      }
      return currentPromise;
    }
    return new Promise((resolve) => {
      const shouldCallNow = !timeout && options.leading;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        const promise = options.leading ? leadingValue : applyFn(this, args);
        for (const _resolve of resolveList) {
          _resolve(promise);
        }
        resolveList = [];
      }, wait);
      if (shouldCallNow) {
        leadingValue = applyFn(this, args);
        resolve(leadingValue);
      } else {
        resolveList.push(resolve);
      }
    });
  };
}
async function _applyPromised(fn, _this, args) {
  return await fn.apply(_this, args);
}

// node_modules/@vue/devtools-kit/dist/index.js
import { createHooks } from "hookable";
import { createHooks as createHooks2 } from "hookable";

// node_modules/birpc/dist/index.mjs
var TYPE_REQUEST = "q";
var TYPE_RESPONSE = "s";
var DEFAULT_TIMEOUT = 6e4;
function defaultSerialize(i) {
  return i;
}
var defaultDeserialize = defaultSerialize;
var { clearTimeout: clearTimeout2, setTimeout: setTimeout2 } = globalThis;
var random = Math.random.bind(Math);
function createBirpc(functions, options) {
  const {
    post,
    on: on2,
    off = () => {
    },
    eventNames = [],
    serialize: serialize2 = defaultSerialize,
    deserialize: deserialize2 = defaultDeserialize,
    resolver,
    bind = "rpc",
    timeout = DEFAULT_TIMEOUT
  } = options;
  const rpcPromiseMap = /* @__PURE__ */ new Map();
  let _promise;
  let closed = false;
  const rpc = new Proxy({}, {
    get(_, method) {
      if (method === "$functions")
        return functions;
      if (method === "$close")
        return close;
      if (method === "$rejectPendingCalls") {
        return rejectPendingCalls;
      }
      if (method === "$closed")
        return closed;
      if (method === "then" && !eventNames.includes("then") && !("then" in functions))
        return void 0;
      const sendEvent = (...args) => {
        post(serialize2({ m: method, a: args, t: TYPE_REQUEST }));
      };
      if (eventNames.includes(method)) {
        sendEvent.asEvent = sendEvent;
        return sendEvent;
      }
      const sendCall = async (...args) => {
        if (closed)
          throw new Error(`[birpc] rpc is closed, cannot call "${method}"`);
        if (_promise) {
          try {
            await _promise;
          } finally {
            _promise = void 0;
          }
        }
        return new Promise((resolve, reject) => {
          const id = nanoid();
          let timeoutId;
          if (timeout >= 0) {
            timeoutId = setTimeout2(() => {
              try {
                const handleResult = options.onTimeoutError?.(method, args);
                if (handleResult !== true)
                  throw new Error(`[birpc] timeout on calling "${method}"`);
              } catch (e) {
                reject(e);
              }
              rpcPromiseMap.delete(id);
            }, timeout);
            if (typeof timeoutId === "object")
              timeoutId = timeoutId.unref?.();
          }
          rpcPromiseMap.set(id, { resolve, reject, timeoutId, method });
          post(serialize2({ m: method, a: args, i: id, t: "q" }));
        });
      };
      sendCall.asEvent = sendEvent;
      return sendCall;
    }
  });
  function close(customError) {
    closed = true;
    rpcPromiseMap.forEach(({ reject, method }) => {
      const error = new Error(`[birpc] rpc is closed, cannot call "${method}"`);
      if (customError) {
        customError.cause ??= error;
        return reject(customError);
      }
      reject(error);
    });
    rpcPromiseMap.clear();
    off(onMessage);
  }
  function rejectPendingCalls(handler) {
    const entries = Array.from(rpcPromiseMap.values());
    const handlerResults = entries.map(({ method, reject }) => {
      if (!handler) {
        return reject(new Error(`[birpc]: rejected pending call "${method}".`));
      }
      return handler({ method, reject });
    });
    rpcPromiseMap.clear();
    return handlerResults;
  }
  async function onMessage(data, ...extra) {
    let msg;
    try {
      msg = deserialize2(data);
    } catch (e) {
      if (options.onGeneralError?.(e) !== true)
        throw e;
      return;
    }
    if (msg.t === TYPE_REQUEST) {
      const { m: method, a: args } = msg;
      let result, error;
      const fn = resolver ? resolver(method, functions[method]) : functions[method];
      if (!fn) {
        error = new Error(`[birpc] function "${method}" not found`);
      } else {
        try {
          result = await fn.apply(bind === "rpc" ? rpc : functions, args);
        } catch (e) {
          error = e;
        }
      }
      if (msg.i) {
        if (error && options.onError)
          options.onError(error, method, args);
        if (error && options.onFunctionError) {
          if (options.onFunctionError(error, method, args) === true)
            return;
        }
        if (!error) {
          try {
            post(serialize2({ t: TYPE_RESPONSE, i: msg.i, r: result }), ...extra);
            return;
          } catch (e) {
            error = e;
            if (options.onGeneralError?.(e, method, args) !== true)
              throw e;
          }
        }
        try {
          post(serialize2({ t: TYPE_RESPONSE, i: msg.i, e: error }), ...extra);
        } catch (e) {
          if (options.onGeneralError?.(e, method, args) !== true)
            throw e;
        }
      }
    } else {
      const { i: ack, r: result, e: error } = msg;
      const promise = rpcPromiseMap.get(ack);
      if (promise) {
        clearTimeout2(promise.timeoutId);
        if (error)
          promise.reject(error);
        else
          promise.resolve(result);
      }
      rpcPromiseMap.delete(ack);
    }
  }
  _promise = on2(onMessage);
  return rpc;
}
var cacheMap = /* @__PURE__ */ new WeakMap();
function cachedMap(items, fn) {
  return items.map((i) => {
    let r = cacheMap.get(i);
    if (!r) {
      r = fn(i);
      cacheMap.set(i, r);
    }
    return r;
  });
}
function createBirpcGroup(functions, channels, options = {}) {
  const getChannels = () => typeof channels === "function" ? channels() : channels;
  const getClients = (channels2 = getChannels()) => cachedMap(channels2, (s) => createBirpc(functions, { ...options, ...s }));
  const broadcastProxy = new Proxy({}, {
    get(_, method) {
      const client = getClients();
      const callbacks = client.map((c) => c[method]);
      const sendCall = (...args) => {
        return Promise.all(callbacks.map((i) => i(...args)));
      };
      sendCall.asEvent = (...args) => {
        callbacks.map((i) => i.asEvent(...args));
      };
      return sendCall;
    }
  });
  function updateChannels(fn) {
    const channels2 = getChannels();
    fn?.(channels2);
    return getClients(channels2);
  }
  getClients();
  return {
    get clients() {
      return getClients();
    },
    functions,
    updateChannels,
    broadcast: broadcastProxy,
    /**
     * @deprecated use `broadcast`
     */
    // @ts-expect-error deprecated
    boardcast: broadcastProxy
  };
}
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
function nanoid(size = 21) {
  let id = "";
  let i = size;
  while (i--)
    id += urlAlphabet[random() * 64 | 0];
  return id;
}

// node_modules/@vue/devtools-kit/dist/index.js
var __create2 = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __getProtoOf2 = Object.getPrototypeOf;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __esm2 = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames2(fn)[0]])(fn = 0)), res;
};
var __commonJS2 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps2 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames2(from))
      if (!__hasOwnProp2.call(to, key) && key !== except)
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM2 = (mod, isNodeMode, target22) => (target22 = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp2(target22, "default", { value: mod, enumerable: true }) : target22,
  mod
));
var init_esm_shims2 = __esm2({
  "../../node_modules/.pnpm/tsup@8.4.0_@microsoft+api-extractor@7.51.1_@types+node@22.13.14__jiti@2.4.2_postcss@8.5_96eb05a9d65343021e53791dd83f3773/node_modules/tsup/assets/esm_shims.js"() {
    "use strict";
  }
});
var require_speakingurl = __commonJS2({
  "../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/lib/speakingurl.js"(exports, module) {
    "use strict";
    init_esm_shims2();
    (function(root) {
      "use strict";
      var charMap = {
        // latin
        "À": "A",
        "Á": "A",
        "Â": "A",
        "Ã": "A",
        "Ä": "Ae",
        "Å": "A",
        "Æ": "AE",
        "Ç": "C",
        "È": "E",
        "É": "E",
        "Ê": "E",
        "Ë": "E",
        "Ì": "I",
        "Í": "I",
        "Î": "I",
        "Ï": "I",
        "Ð": "D",
        "Ñ": "N",
        "Ò": "O",
        "Ó": "O",
        "Ô": "O",
        "Õ": "O",
        "Ö": "Oe",
        "Ő": "O",
        "Ø": "O",
        "Ù": "U",
        "Ú": "U",
        "Û": "U",
        "Ü": "Ue",
        "Ű": "U",
        "Ý": "Y",
        "Þ": "TH",
        "ß": "ss",
        "à": "a",
        "á": "a",
        "â": "a",
        "ã": "a",
        "ä": "ae",
        "å": "a",
        "æ": "ae",
        "ç": "c",
        "è": "e",
        "é": "e",
        "ê": "e",
        "ë": "e",
        "ì": "i",
        "í": "i",
        "î": "i",
        "ï": "i",
        "ð": "d",
        "ñ": "n",
        "ò": "o",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ö": "oe",
        "ő": "o",
        "ø": "o",
        "ù": "u",
        "ú": "u",
        "û": "u",
        "ü": "ue",
        "ű": "u",
        "ý": "y",
        "þ": "th",
        "ÿ": "y",
        "ẞ": "SS",
        // language specific
        // Arabic
        "ا": "a",
        "أ": "a",
        "إ": "i",
        "آ": "aa",
        "ؤ": "u",
        "ئ": "e",
        "ء": "a",
        "ب": "b",
        "ت": "t",
        "ث": "th",
        "ج": "j",
        "ح": "h",
        "خ": "kh",
        "د": "d",
        "ذ": "th",
        "ر": "r",
        "ز": "z",
        "س": "s",
        "ش": "sh",
        "ص": "s",
        "ض": "dh",
        "ط": "t",
        "ظ": "z",
        "ع": "a",
        "غ": "gh",
        "ف": "f",
        "ق": "q",
        "ك": "k",
        "ل": "l",
        "م": "m",
        "ن": "n",
        "ه": "h",
        "و": "w",
        "ي": "y",
        "ى": "a",
        "ة": "h",
        "ﻻ": "la",
        "ﻷ": "laa",
        "ﻹ": "lai",
        "ﻵ": "laa",
        // Persian additional characters than Arabic
        "گ": "g",
        "چ": "ch",
        "پ": "p",
        "ژ": "zh",
        "ک": "k",
        "ی": "y",
        // Arabic diactrics
        "َ": "a",
        "ً": "an",
        "ِ": "e",
        "ٍ": "en",
        "ُ": "u",
        "ٌ": "on",
        "ْ": "",
        // Arabic numbers
        "٠": "0",
        "١": "1",
        "٢": "2",
        "٣": "3",
        "٤": "4",
        "٥": "5",
        "٦": "6",
        "٧": "7",
        "٨": "8",
        "٩": "9",
        // Persian numbers
        "۰": "0",
        "۱": "1",
        "۲": "2",
        "۳": "3",
        "۴": "4",
        "۵": "5",
        "۶": "6",
        "۷": "7",
        "۸": "8",
        "۹": "9",
        // Burmese consonants
        "က": "k",
        "ခ": "kh",
        "ဂ": "g",
        "ဃ": "ga",
        "င": "ng",
        "စ": "s",
        "ဆ": "sa",
        "ဇ": "z",
        "စျ": "za",
        "ည": "ny",
        "ဋ": "t",
        "ဌ": "ta",
        "ဍ": "d",
        "ဎ": "da",
        "ဏ": "na",
        "တ": "t",
        "ထ": "ta",
        "ဒ": "d",
        "ဓ": "da",
        "န": "n",
        "ပ": "p",
        "ဖ": "pa",
        "ဗ": "b",
        "ဘ": "ba",
        "မ": "m",
        "ယ": "y",
        "ရ": "ya",
        "လ": "l",
        "ဝ": "w",
        "သ": "th",
        "ဟ": "h",
        "ဠ": "la",
        "အ": "a",
        // consonant character combos
        "ြ": "y",
        "ျ": "ya",
        "ွ": "w",
        "ြွ": "yw",
        "ျွ": "ywa",
        "ှ": "h",
        // independent vowels
        "ဧ": "e",
        "၏": "-e",
        "ဣ": "i",
        "ဤ": "-i",
        "ဉ": "u",
        "ဦ": "-u",
        "ဩ": "aw",
        "သြော": "aw",
        "ဪ": "aw",
        // numbers
        "၀": "0",
        "၁": "1",
        "၂": "2",
        "၃": "3",
        "၄": "4",
        "၅": "5",
        "၆": "6",
        "၇": "7",
        "၈": "8",
        "၉": "9",
        // virama and tone marks which are silent in transliteration
        "္": "",
        "့": "",
        "း": "",
        // Czech
        "č": "c",
        "ď": "d",
        "ě": "e",
        "ň": "n",
        "ř": "r",
        "š": "s",
        "ť": "t",
        "ů": "u",
        "ž": "z",
        "Č": "C",
        "Ď": "D",
        "Ě": "E",
        "Ň": "N",
        "Ř": "R",
        "Š": "S",
        "Ť": "T",
        "Ů": "U",
        "Ž": "Z",
        // Dhivehi
        "ހ": "h",
        "ށ": "sh",
        "ނ": "n",
        "ރ": "r",
        "ބ": "b",
        "ޅ": "lh",
        "ކ": "k",
        "އ": "a",
        "ވ": "v",
        "މ": "m",
        "ފ": "f",
        "ދ": "dh",
        "ތ": "th",
        "ލ": "l",
        "ގ": "g",
        "ޏ": "gn",
        "ސ": "s",
        "ޑ": "d",
        "ޒ": "z",
        "ޓ": "t",
        "ޔ": "y",
        "ޕ": "p",
        "ޖ": "j",
        "ޗ": "ch",
        "ޘ": "tt",
        "ޙ": "hh",
        "ޚ": "kh",
        "ޛ": "th",
        "ޜ": "z",
        "ޝ": "sh",
        "ޞ": "s",
        "ޟ": "d",
        "ޠ": "t",
        "ޡ": "z",
        "ޢ": "a",
        "ޣ": "gh",
        "ޤ": "q",
        "ޥ": "w",
        "ަ": "a",
        "ާ": "aa",
        "ި": "i",
        "ީ": "ee",
        "ު": "u",
        "ޫ": "oo",
        "ެ": "e",
        "ޭ": "ey",
        "ޮ": "o",
        "ޯ": "oa",
        "ް": "",
        // Georgian https://en.wikipedia.org/wiki/Romanization_of_Georgian
        // National system (2002)
        "ა": "a",
        "ბ": "b",
        "გ": "g",
        "დ": "d",
        "ე": "e",
        "ვ": "v",
        "ზ": "z",
        "თ": "t",
        "ი": "i",
        "კ": "k",
        "ლ": "l",
        "მ": "m",
        "ნ": "n",
        "ო": "o",
        "პ": "p",
        "ჟ": "zh",
        "რ": "r",
        "ს": "s",
        "ტ": "t",
        "უ": "u",
        "ფ": "p",
        "ქ": "k",
        "ღ": "gh",
        "ყ": "q",
        "შ": "sh",
        "ჩ": "ch",
        "ც": "ts",
        "ძ": "dz",
        "წ": "ts",
        "ჭ": "ch",
        "ხ": "kh",
        "ჯ": "j",
        "ჰ": "h",
        // Greek
        "α": "a",
        "β": "v",
        "γ": "g",
        "δ": "d",
        "ε": "e",
        "ζ": "z",
        "η": "i",
        "θ": "th",
        "ι": "i",
        "κ": "k",
        "λ": "l",
        "μ": "m",
        "ν": "n",
        "ξ": "ks",
        "ο": "o",
        "π": "p",
        "ρ": "r",
        "σ": "s",
        "τ": "t",
        "υ": "y",
        "φ": "f",
        "χ": "x",
        "ψ": "ps",
        "ω": "o",
        "ά": "a",
        "έ": "e",
        "ί": "i",
        "ό": "o",
        "ύ": "y",
        "ή": "i",
        "ώ": "o",
        "ς": "s",
        "ϊ": "i",
        "ΰ": "y",
        "ϋ": "y",
        "ΐ": "i",
        "Α": "A",
        "Β": "B",
        "Γ": "G",
        "Δ": "D",
        "Ε": "E",
        "Ζ": "Z",
        "Η": "I",
        "Θ": "TH",
        "Ι": "I",
        "Κ": "K",
        "Λ": "L",
        "Μ": "M",
        "Ν": "N",
        "Ξ": "KS",
        "Ο": "O",
        "Π": "P",
        "Ρ": "R",
        "Σ": "S",
        "Τ": "T",
        "Υ": "Y",
        "Φ": "F",
        "Χ": "X",
        "Ψ": "PS",
        "Ω": "O",
        "Ά": "A",
        "Έ": "E",
        "Ί": "I",
        "Ό": "O",
        "Ύ": "Y",
        "Ή": "I",
        "Ώ": "O",
        "Ϊ": "I",
        "Ϋ": "Y",
        // Latvian
        "ā": "a",
        // 'č': 'c', // duplicate
        "ē": "e",
        "ģ": "g",
        "ī": "i",
        "ķ": "k",
        "ļ": "l",
        "ņ": "n",
        // 'š': 's', // duplicate
        "ū": "u",
        // 'ž': 'z', // duplicate
        "Ā": "A",
        // 'Č': 'C', // duplicate
        "Ē": "E",
        "Ģ": "G",
        "Ī": "I",
        "Ķ": "k",
        "Ļ": "L",
        "Ņ": "N",
        // 'Š': 'S', // duplicate
        "Ū": "U",
        // 'Ž': 'Z', // duplicate
        // Macedonian
        "Ќ": "Kj",
        "ќ": "kj",
        "Љ": "Lj",
        "љ": "lj",
        "Њ": "Nj",
        "њ": "nj",
        "Тс": "Ts",
        "тс": "ts",
        // Polish
        "ą": "a",
        "ć": "c",
        "ę": "e",
        "ł": "l",
        "ń": "n",
        // 'ó': 'o', // duplicate
        "ś": "s",
        "ź": "z",
        "ż": "z",
        "Ą": "A",
        "Ć": "C",
        "Ę": "E",
        "Ł": "L",
        "Ń": "N",
        "Ś": "S",
        "Ź": "Z",
        "Ż": "Z",
        // Ukranian
        "Є": "Ye",
        "І": "I",
        "Ї": "Yi",
        "Ґ": "G",
        "є": "ye",
        "і": "i",
        "ї": "yi",
        "ґ": "g",
        // Romanian
        "ă": "a",
        "Ă": "A",
        "ș": "s",
        "Ș": "S",
        // 'ş': 's', // duplicate
        // 'Ş': 'S', // duplicate
        "ț": "t",
        "Ț": "T",
        "ţ": "t",
        "Ţ": "T",
        // Russian https://en.wikipedia.org/wiki/Romanization_of_Russian
        // ICAO
        "а": "a",
        "б": "b",
        "в": "v",
        "г": "g",
        "д": "d",
        "е": "e",
        "ё": "yo",
        "ж": "zh",
        "з": "z",
        "и": "i",
        "й": "i",
        "к": "k",
        "л": "l",
        "м": "m",
        "н": "n",
        "о": "o",
        "п": "p",
        "р": "r",
        "с": "s",
        "т": "t",
        "у": "u",
        "ф": "f",
        "х": "kh",
        "ц": "c",
        "ч": "ch",
        "ш": "sh",
        "щ": "sh",
        "ъ": "",
        "ы": "y",
        "ь": "",
        "э": "e",
        "ю": "yu",
        "я": "ya",
        "А": "A",
        "Б": "B",
        "В": "V",
        "Г": "G",
        "Д": "D",
        "Е": "E",
        "Ё": "Yo",
        "Ж": "Zh",
        "З": "Z",
        "И": "I",
        "Й": "I",
        "К": "K",
        "Л": "L",
        "М": "M",
        "Н": "N",
        "О": "O",
        "П": "P",
        "Р": "R",
        "С": "S",
        "Т": "T",
        "У": "U",
        "Ф": "F",
        "Х": "Kh",
        "Ц": "C",
        "Ч": "Ch",
        "Ш": "Sh",
        "Щ": "Sh",
        "Ъ": "",
        "Ы": "Y",
        "Ь": "",
        "Э": "E",
        "Ю": "Yu",
        "Я": "Ya",
        // Serbian
        "ђ": "dj",
        "ј": "j",
        // 'љ': 'lj',  // duplicate
        // 'њ': 'nj', // duplicate
        "ћ": "c",
        "џ": "dz",
        "Ђ": "Dj",
        "Ј": "j",
        // 'Љ': 'Lj', // duplicate
        // 'Њ': 'Nj', // duplicate
        "Ћ": "C",
        "Џ": "Dz",
        // Slovak
        "ľ": "l",
        "ĺ": "l",
        "ŕ": "r",
        "Ľ": "L",
        "Ĺ": "L",
        "Ŕ": "R",
        // Turkish
        "ş": "s",
        "Ş": "S",
        "ı": "i",
        "İ": "I",
        // 'ç': 'c', // duplicate
        // 'Ç': 'C', // duplicate
        // 'ü': 'u', // duplicate, see langCharMap
        // 'Ü': 'U', // duplicate, see langCharMap
        // 'ö': 'o', // duplicate, see langCharMap
        // 'Ö': 'O', // duplicate, see langCharMap
        "ğ": "g",
        "Ğ": "G",
        // Vietnamese
        "ả": "a",
        "Ả": "A",
        "ẳ": "a",
        "Ẳ": "A",
        "ẩ": "a",
        "Ẩ": "A",
        "đ": "d",
        "Đ": "D",
        "ẹ": "e",
        "Ẹ": "E",
        "ẽ": "e",
        "Ẽ": "E",
        "ẻ": "e",
        "Ẻ": "E",
        "ế": "e",
        "Ế": "E",
        "ề": "e",
        "Ề": "E",
        "ệ": "e",
        "Ệ": "E",
        "ễ": "e",
        "Ễ": "E",
        "ể": "e",
        "Ể": "E",
        "ỏ": "o",
        "ọ": "o",
        "Ọ": "o",
        "ố": "o",
        "Ố": "O",
        "ồ": "o",
        "Ồ": "O",
        "ổ": "o",
        "Ổ": "O",
        "ộ": "o",
        "Ộ": "O",
        "ỗ": "o",
        "Ỗ": "O",
        "ơ": "o",
        "Ơ": "O",
        "ớ": "o",
        "Ớ": "O",
        "ờ": "o",
        "Ờ": "O",
        "ợ": "o",
        "Ợ": "O",
        "ỡ": "o",
        "Ỡ": "O",
        "Ở": "o",
        "ở": "o",
        "ị": "i",
        "Ị": "I",
        "ĩ": "i",
        "Ĩ": "I",
        "ỉ": "i",
        "Ỉ": "i",
        "ủ": "u",
        "Ủ": "U",
        "ụ": "u",
        "Ụ": "U",
        "ũ": "u",
        "Ũ": "U",
        "ư": "u",
        "Ư": "U",
        "ứ": "u",
        "Ứ": "U",
        "ừ": "u",
        "Ừ": "U",
        "ự": "u",
        "Ự": "U",
        "ữ": "u",
        "Ữ": "U",
        "ử": "u",
        "Ử": "ư",
        "ỷ": "y",
        "Ỷ": "y",
        "ỳ": "y",
        "Ỳ": "Y",
        "ỵ": "y",
        "Ỵ": "Y",
        "ỹ": "y",
        "Ỹ": "Y",
        "ạ": "a",
        "Ạ": "A",
        "ấ": "a",
        "Ấ": "A",
        "ầ": "a",
        "Ầ": "A",
        "ậ": "a",
        "Ậ": "A",
        "ẫ": "a",
        "Ẫ": "A",
        // 'ă': 'a', // duplicate
        // 'Ă': 'A', // duplicate
        "ắ": "a",
        "Ắ": "A",
        "ằ": "a",
        "Ằ": "A",
        "ặ": "a",
        "Ặ": "A",
        "ẵ": "a",
        "Ẵ": "A",
        "⓪": "0",
        "①": "1",
        "②": "2",
        "③": "3",
        "④": "4",
        "⑤": "5",
        "⑥": "6",
        "⑦": "7",
        "⑧": "8",
        "⑨": "9",
        "⑩": "10",
        "⑪": "11",
        "⑫": "12",
        "⑬": "13",
        "⑭": "14",
        "⑮": "15",
        "⑯": "16",
        "⑰": "17",
        "⑱": "18",
        "⑲": "18",
        "⑳": "18",
        "⓵": "1",
        "⓶": "2",
        "⓷": "3",
        "⓸": "4",
        "⓹": "5",
        "⓺": "6",
        "⓻": "7",
        "⓼": "8",
        "⓽": "9",
        "⓾": "10",
        "⓿": "0",
        "⓫": "11",
        "⓬": "12",
        "⓭": "13",
        "⓮": "14",
        "⓯": "15",
        "⓰": "16",
        "⓱": "17",
        "⓲": "18",
        "⓳": "19",
        "⓴": "20",
        "Ⓐ": "A",
        "Ⓑ": "B",
        "Ⓒ": "C",
        "Ⓓ": "D",
        "Ⓔ": "E",
        "Ⓕ": "F",
        "Ⓖ": "G",
        "Ⓗ": "H",
        "Ⓘ": "I",
        "Ⓙ": "J",
        "Ⓚ": "K",
        "Ⓛ": "L",
        "Ⓜ": "M",
        "Ⓝ": "N",
        "Ⓞ": "O",
        "Ⓟ": "P",
        "Ⓠ": "Q",
        "Ⓡ": "R",
        "Ⓢ": "S",
        "Ⓣ": "T",
        "Ⓤ": "U",
        "Ⓥ": "V",
        "Ⓦ": "W",
        "Ⓧ": "X",
        "Ⓨ": "Y",
        "Ⓩ": "Z",
        "ⓐ": "a",
        "ⓑ": "b",
        "ⓒ": "c",
        "ⓓ": "d",
        "ⓔ": "e",
        "ⓕ": "f",
        "ⓖ": "g",
        "ⓗ": "h",
        "ⓘ": "i",
        "ⓙ": "j",
        "ⓚ": "k",
        "ⓛ": "l",
        "ⓜ": "m",
        "ⓝ": "n",
        "ⓞ": "o",
        "ⓟ": "p",
        "ⓠ": "q",
        "ⓡ": "r",
        "ⓢ": "s",
        "ⓣ": "t",
        "ⓤ": "u",
        "ⓦ": "v",
        "ⓥ": "w",
        "ⓧ": "x",
        "ⓨ": "y",
        "ⓩ": "z",
        // symbols
        "“": '"',
        "”": '"',
        "‘": "'",
        "’": "'",
        "∂": "d",
        "ƒ": "f",
        "™": "(TM)",
        "©": "(C)",
        "œ": "oe",
        "Œ": "OE",
        "®": "(R)",
        "†": "+",
        "℠": "(SM)",
        "…": "...",
        "˚": "o",
        "º": "o",
        "ª": "a",
        "•": "*",
        "၊": ",",
        "။": ".",
        // currency
        "$": "USD",
        "€": "EUR",
        "₢": "BRN",
        "₣": "FRF",
        "£": "GBP",
        "₤": "ITL",
        "₦": "NGN",
        "₧": "ESP",
        "₩": "KRW",
        "₪": "ILS",
        "₫": "VND",
        "₭": "LAK",
        "₮": "MNT",
        "₯": "GRD",
        "₱": "ARS",
        "₲": "PYG",
        "₳": "ARA",
        "₴": "UAH",
        "₵": "GHS",
        "¢": "cent",
        "¥": "CNY",
        "元": "CNY",
        "円": "YEN",
        "﷼": "IRR",
        "₠": "EWE",
        "฿": "THB",
        "₨": "INR",
        "₹": "INR",
        "₰": "PF",
        "₺": "TRY",
        "؋": "AFN",
        "₼": "AZN",
        "лв": "BGN",
        "៛": "KHR",
        "₡": "CRC",
        "₸": "KZT",
        "ден": "MKD",
        "zł": "PLN",
        "₽": "RUB",
        "₾": "GEL"
      };
      var lookAheadCharArray = [
        // burmese
        "်",
        // Dhivehi
        "ް"
      ];
      var diatricMap = {
        // Burmese
        // dependent vowels
        "ာ": "a",
        "ါ": "a",
        "ေ": "e",
        "ဲ": "e",
        "ိ": "i",
        "ီ": "i",
        "ို": "o",
        "ု": "u",
        "ူ": "u",
        "ေါင်": "aung",
        "ော": "aw",
        "ော်": "aw",
        "ေါ": "aw",
        "ေါ်": "aw",
        "်": "်",
        // this is special case but the character will be converted to latin in the code
        "က်": "et",
        "ိုက်": "aik",
        "ောက်": "auk",
        "င်": "in",
        "ိုင်": "aing",
        "ောင်": "aung",
        "စ်": "it",
        "ည်": "i",
        "တ်": "at",
        "ိတ်": "eik",
        "ုတ်": "ok",
        "ွတ်": "ut",
        "ေတ်": "it",
        "ဒ်": "d",
        "ိုဒ်": "ok",
        "ုဒ်": "ait",
        "န်": "an",
        "ာန်": "an",
        "ိန်": "ein",
        "ုန်": "on",
        "ွန်": "un",
        "ပ်": "at",
        "ိပ်": "eik",
        "ုပ်": "ok",
        "ွပ်": "ut",
        "န်ုပ်": "nub",
        "မ်": "an",
        "ိမ်": "ein",
        "ုမ်": "on",
        "ွမ်": "un",
        "ယ်": "e",
        "ိုလ်": "ol",
        "ဉ်": "in",
        "ံ": "an",
        "ိံ": "ein",
        "ုံ": "on",
        // Dhivehi
        "ައް": "ah",
        "ަށް": "ah"
      };
      var langCharMap = {
        "en": {},
        // default language
        "az": {
          // Azerbaijani
          "ç": "c",
          "ə": "e",
          "ğ": "g",
          "ı": "i",
          "ö": "o",
          "ş": "s",
          "ü": "u",
          "Ç": "C",
          "Ə": "E",
          "Ğ": "G",
          "İ": "I",
          "Ö": "O",
          "Ş": "S",
          "Ü": "U"
        },
        "cs": {
          // Czech
          "č": "c",
          "ď": "d",
          "ě": "e",
          "ň": "n",
          "ř": "r",
          "š": "s",
          "ť": "t",
          "ů": "u",
          "ž": "z",
          "Č": "C",
          "Ď": "D",
          "Ě": "E",
          "Ň": "N",
          "Ř": "R",
          "Š": "S",
          "Ť": "T",
          "Ů": "U",
          "Ž": "Z"
        },
        "fi": {
          // Finnish
          // 'å': 'a', duplicate see charMap/latin
          // 'Å': 'A', duplicate see charMap/latin
          "ä": "a",
          // ok
          "Ä": "A",
          // ok
          "ö": "o",
          // ok
          "Ö": "O"
          // ok
        },
        "hu": {
          // Hungarian
          "ä": "a",
          // ok
          "Ä": "A",
          // ok
          // 'á': 'a', duplicate see charMap/latin
          // 'Á': 'A', duplicate see charMap/latin
          "ö": "o",
          // ok
          "Ö": "O",
          // ok
          // 'ő': 'o', duplicate see charMap/latin
          // 'Ő': 'O', duplicate see charMap/latin
          "ü": "u",
          "Ü": "U",
          "ű": "u",
          "Ű": "U"
        },
        "lt": {
          // Lithuanian
          "ą": "a",
          "č": "c",
          "ę": "e",
          "ė": "e",
          "į": "i",
          "š": "s",
          "ų": "u",
          "ū": "u",
          "ž": "z",
          "Ą": "A",
          "Č": "C",
          "Ę": "E",
          "Ė": "E",
          "Į": "I",
          "Š": "S",
          "Ų": "U",
          "Ū": "U"
        },
        "lv": {
          // Latvian
          "ā": "a",
          "č": "c",
          "ē": "e",
          "ģ": "g",
          "ī": "i",
          "ķ": "k",
          "ļ": "l",
          "ņ": "n",
          "š": "s",
          "ū": "u",
          "ž": "z",
          "Ā": "A",
          "Č": "C",
          "Ē": "E",
          "Ģ": "G",
          "Ī": "i",
          "Ķ": "k",
          "Ļ": "L",
          "Ņ": "N",
          "Š": "S",
          "Ū": "u",
          "Ž": "Z"
        },
        "pl": {
          // Polish
          "ą": "a",
          "ć": "c",
          "ę": "e",
          "ł": "l",
          "ń": "n",
          "ó": "o",
          "ś": "s",
          "ź": "z",
          "ż": "z",
          "Ą": "A",
          "Ć": "C",
          "Ę": "e",
          "Ł": "L",
          "Ń": "N",
          "Ó": "O",
          "Ś": "S",
          "Ź": "Z",
          "Ż": "Z"
        },
        "sv": {
          // Swedish
          // 'å': 'a', duplicate see charMap/latin
          // 'Å': 'A', duplicate see charMap/latin
          "ä": "a",
          // ok
          "Ä": "A",
          // ok
          "ö": "o",
          // ok
          "Ö": "O"
          // ok
        },
        "sk": {
          // Slovak
          "ä": "a",
          "Ä": "A"
        },
        "sr": {
          // Serbian
          "љ": "lj",
          "њ": "nj",
          "Љ": "Lj",
          "Њ": "Nj",
          "đ": "dj",
          "Đ": "Dj"
        },
        "tr": {
          // Turkish
          "Ü": "U",
          "Ö": "O",
          "ü": "u",
          "ö": "o"
        }
      };
      var symbolMap = {
        "ar": {
          "∆": "delta",
          "∞": "la-nihaya",
          "♥": "hob",
          "&": "wa",
          "|": "aw",
          "<": "aqal-men",
          ">": "akbar-men",
          "∑": "majmou",
          "¤": "omla"
        },
        "az": {},
        "ca": {
          "∆": "delta",
          "∞": "infinit",
          "♥": "amor",
          "&": "i",
          "|": "o",
          "<": "menys que",
          ">": "mes que",
          "∑": "suma dels",
          "¤": "moneda"
        },
        "cs": {
          "∆": "delta",
          "∞": "nekonecno",
          "♥": "laska",
          "&": "a",
          "|": "nebo",
          "<": "mensi nez",
          ">": "vetsi nez",
          "∑": "soucet",
          "¤": "mena"
        },
        "de": {
          "∆": "delta",
          "∞": "unendlich",
          "♥": "Liebe",
          "&": "und",
          "|": "oder",
          "<": "kleiner als",
          ">": "groesser als",
          "∑": "Summe von",
          "¤": "Waehrung"
        },
        "dv": {
          "∆": "delta",
          "∞": "kolunulaa",
          "♥": "loabi",
          "&": "aai",
          "|": "noonee",
          "<": "ah vure kuda",
          ">": "ah vure bodu",
          "∑": "jumula",
          "¤": "faisaa"
        },
        "en": {
          "∆": "delta",
          "∞": "infinity",
          "♥": "love",
          "&": "and",
          "|": "or",
          "<": "less than",
          ">": "greater than",
          "∑": "sum",
          "¤": "currency"
        },
        "es": {
          "∆": "delta",
          "∞": "infinito",
          "♥": "amor",
          "&": "y",
          "|": "u",
          "<": "menos que",
          ">": "mas que",
          "∑": "suma de los",
          "¤": "moneda"
        },
        "fa": {
          "∆": "delta",
          "∞": "bi-nahayat",
          "♥": "eshgh",
          "&": "va",
          "|": "ya",
          "<": "kamtar-az",
          ">": "bishtar-az",
          "∑": "majmooe",
          "¤": "vahed"
        },
        "fi": {
          "∆": "delta",
          "∞": "aarettomyys",
          "♥": "rakkaus",
          "&": "ja",
          "|": "tai",
          "<": "pienempi kuin",
          ">": "suurempi kuin",
          "∑": "summa",
          "¤": "valuutta"
        },
        "fr": {
          "∆": "delta",
          "∞": "infiniment",
          "♥": "Amour",
          "&": "et",
          "|": "ou",
          "<": "moins que",
          ">": "superieure a",
          "∑": "somme des",
          "¤": "monnaie"
        },
        "ge": {
          "∆": "delta",
          "∞": "usasruloba",
          "♥": "siqvaruli",
          "&": "da",
          "|": "an",
          "<": "naklebi",
          ">": "meti",
          "∑": "jami",
          "¤": "valuta"
        },
        "gr": {},
        "hu": {
          "∆": "delta",
          "∞": "vegtelen",
          "♥": "szerelem",
          "&": "es",
          "|": "vagy",
          "<": "kisebb mint",
          ">": "nagyobb mint",
          "∑": "szumma",
          "¤": "penznem"
        },
        "it": {
          "∆": "delta",
          "∞": "infinito",
          "♥": "amore",
          "&": "e",
          "|": "o",
          "<": "minore di",
          ">": "maggiore di",
          "∑": "somma",
          "¤": "moneta"
        },
        "lt": {
          "∆": "delta",
          "∞": "begalybe",
          "♥": "meile",
          "&": "ir",
          "|": "ar",
          "<": "maziau nei",
          ">": "daugiau nei",
          "∑": "suma",
          "¤": "valiuta"
        },
        "lv": {
          "∆": "delta",
          "∞": "bezgaliba",
          "♥": "milestiba",
          "&": "un",
          "|": "vai",
          "<": "mazak neka",
          ">": "lielaks neka",
          "∑": "summa",
          "¤": "valuta"
        },
        "my": {
          "∆": "kwahkhyaet",
          "∞": "asaonasme",
          "♥": "akhyait",
          "&": "nhin",
          "|": "tho",
          "<": "ngethaw",
          ">": "kyithaw",
          "∑": "paungld",
          "¤": "ngwekye"
        },
        "mk": {},
        "nl": {
          "∆": "delta",
          "∞": "oneindig",
          "♥": "liefde",
          "&": "en",
          "|": "of",
          "<": "kleiner dan",
          ">": "groter dan",
          "∑": "som",
          "¤": "valuta"
        },
        "pl": {
          "∆": "delta",
          "∞": "nieskonczonosc",
          "♥": "milosc",
          "&": "i",
          "|": "lub",
          "<": "mniejsze niz",
          ">": "wieksze niz",
          "∑": "suma",
          "¤": "waluta"
        },
        "pt": {
          "∆": "delta",
          "∞": "infinito",
          "♥": "amor",
          "&": "e",
          "|": "ou",
          "<": "menor que",
          ">": "maior que",
          "∑": "soma",
          "¤": "moeda"
        },
        "ro": {
          "∆": "delta",
          "∞": "infinit",
          "♥": "dragoste",
          "&": "si",
          "|": "sau",
          "<": "mai mic ca",
          ">": "mai mare ca",
          "∑": "suma",
          "¤": "valuta"
        },
        "ru": {
          "∆": "delta",
          "∞": "beskonechno",
          "♥": "lubov",
          "&": "i",
          "|": "ili",
          "<": "menshe",
          ">": "bolshe",
          "∑": "summa",
          "¤": "valjuta"
        },
        "sk": {
          "∆": "delta",
          "∞": "nekonecno",
          "♥": "laska",
          "&": "a",
          "|": "alebo",
          "<": "menej ako",
          ">": "viac ako",
          "∑": "sucet",
          "¤": "mena"
        },
        "sr": {},
        "tr": {
          "∆": "delta",
          "∞": "sonsuzluk",
          "♥": "ask",
          "&": "ve",
          "|": "veya",
          "<": "kucuktur",
          ">": "buyuktur",
          "∑": "toplam",
          "¤": "para birimi"
        },
        "uk": {
          "∆": "delta",
          "∞": "bezkinechnist",
          "♥": "lubov",
          "&": "i",
          "|": "abo",
          "<": "menshe",
          ">": "bilshe",
          "∑": "suma",
          "¤": "valjuta"
        },
        "vn": {
          "∆": "delta",
          "∞": "vo cuc",
          "♥": "yeu",
          "&": "va",
          "|": "hoac",
          "<": "nho hon",
          ">": "lon hon",
          "∑": "tong",
          "¤": "tien te"
        }
      };
      var uricChars = [";", "?", ":", "@", "&", "=", "+", "$", ",", "/"].join("");
      var uricNoSlashChars = [";", "?", ":", "@", "&", "=", "+", "$", ","].join("");
      var markChars = [".", "!", "~", "*", "'", "(", ")"].join("");
      var getSlug = function getSlug2(input, opts) {
        var separator = "-";
        var result = "";
        var diatricString = "";
        var convertSymbols = true;
        var customReplacements = {};
        var maintainCase;
        var titleCase;
        var truncate;
        var uricFlag;
        var uricNoSlashFlag;
        var markFlag;
        var symbol;
        var langChar;
        var lucky;
        var i;
        var ch;
        var l;
        var lastCharWasSymbol;
        var lastCharWasDiatric;
        var allowedChars = "";
        if (typeof input !== "string") {
          return "";
        }
        if (typeof opts === "string") {
          separator = opts;
        }
        symbol = symbolMap.en;
        langChar = langCharMap.en;
        if (typeof opts === "object") {
          maintainCase = opts.maintainCase || false;
          customReplacements = opts.custom && typeof opts.custom === "object" ? opts.custom : customReplacements;
          truncate = +opts.truncate > 1 && opts.truncate || false;
          uricFlag = opts.uric || false;
          uricNoSlashFlag = opts.uricNoSlash || false;
          markFlag = opts.mark || false;
          convertSymbols = opts.symbols === false || opts.lang === false ? false : true;
          separator = opts.separator || separator;
          if (uricFlag) {
            allowedChars += uricChars;
          }
          if (uricNoSlashFlag) {
            allowedChars += uricNoSlashChars;
          }
          if (markFlag) {
            allowedChars += markChars;
          }
          symbol = opts.lang && symbolMap[opts.lang] && convertSymbols ? symbolMap[opts.lang] : convertSymbols ? symbolMap.en : {};
          langChar = opts.lang && langCharMap[opts.lang] ? langCharMap[opts.lang] : opts.lang === false || opts.lang === true ? {} : langCharMap.en;
          if (opts.titleCase && typeof opts.titleCase.length === "number" && Array.prototype.toString.call(opts.titleCase)) {
            opts.titleCase.forEach(function(v) {
              customReplacements[v + ""] = v + "";
            });
            titleCase = true;
          } else {
            titleCase = !!opts.titleCase;
          }
          if (opts.custom && typeof opts.custom.length === "number" && Array.prototype.toString.call(opts.custom)) {
            opts.custom.forEach(function(v) {
              customReplacements[v + ""] = v + "";
            });
          }
          Object.keys(customReplacements).forEach(function(v) {
            var r;
            if (v.length > 1) {
              r = new RegExp("\\b" + escapeChars(v) + "\\b", "gi");
            } else {
              r = new RegExp(escapeChars(v), "gi");
            }
            input = input.replace(r, customReplacements[v]);
          });
          for (ch in customReplacements) {
            allowedChars += ch;
          }
        }
        allowedChars += separator;
        allowedChars = escapeChars(allowedChars);
        input = input.replace(/(^\s+|\s+$)/g, "");
        lastCharWasSymbol = false;
        lastCharWasDiatric = false;
        for (i = 0, l = input.length; i < l; i++) {
          ch = input[i];
          if (isReplacedCustomChar(ch, customReplacements)) {
            lastCharWasSymbol = false;
          } else if (langChar[ch]) {
            ch = lastCharWasSymbol && langChar[ch].match(/[A-Za-z0-9]/) ? " " + langChar[ch] : langChar[ch];
            lastCharWasSymbol = false;
          } else if (ch in charMap) {
            if (i + 1 < l && lookAheadCharArray.indexOf(input[i + 1]) >= 0) {
              diatricString += ch;
              ch = "";
            } else if (lastCharWasDiatric === true) {
              ch = diatricMap[diatricString] + charMap[ch];
              diatricString = "";
            } else {
              ch = lastCharWasSymbol && charMap[ch].match(/[A-Za-z0-9]/) ? " " + charMap[ch] : charMap[ch];
            }
            lastCharWasSymbol = false;
            lastCharWasDiatric = false;
          } else if (ch in diatricMap) {
            diatricString += ch;
            ch = "";
            if (i === l - 1) {
              ch = diatricMap[diatricString];
            }
            lastCharWasDiatric = true;
          } else if (
            // process symbol chars
            symbol[ch] && !(uricFlag && uricChars.indexOf(ch) !== -1) && !(uricNoSlashFlag && uricNoSlashChars.indexOf(ch) !== -1)
          ) {
            ch = lastCharWasSymbol || result.substr(-1).match(/[A-Za-z0-9]/) ? separator + symbol[ch] : symbol[ch];
            ch += input[i + 1] !== void 0 && input[i + 1].match(/[A-Za-z0-9]/) ? separator : "";
            lastCharWasSymbol = true;
          } else {
            if (lastCharWasDiatric === true) {
              ch = diatricMap[diatricString] + ch;
              diatricString = "";
              lastCharWasDiatric = false;
            } else if (lastCharWasSymbol && (/[A-Za-z0-9]/.test(ch) || result.substr(-1).match(/A-Za-z0-9]/))) {
              ch = " " + ch;
            }
            lastCharWasSymbol = false;
          }
          result += ch.replace(new RegExp("[^\\w\\s" + allowedChars + "_-]", "g"), separator);
        }
        if (titleCase) {
          result = result.replace(/(\w)(\S*)/g, function(_, i2, r) {
            var j = i2.toUpperCase() + (r !== null ? r : "");
            return Object.keys(customReplacements).indexOf(j.toLowerCase()) < 0 ? j : j.toLowerCase();
          });
        }
        result = result.replace(/\s+/g, separator).replace(new RegExp("\\" + separator + "+", "g"), separator).replace(new RegExp("(^\\" + separator + "+|\\" + separator + "+$)", "g"), "");
        if (truncate && result.length > truncate) {
          lucky = result.charAt(truncate) === separator;
          result = result.slice(0, truncate);
          if (!lucky) {
            result = result.slice(0, result.lastIndexOf(separator));
          }
        }
        if (!maintainCase && !titleCase) {
          result = result.toLowerCase();
        }
        return result;
      };
      var createSlug = function createSlug2(opts) {
        return function getSlugWithConfig(input) {
          return getSlug(input, opts);
        };
      };
      var escapeChars = function escapeChars2(input) {
        return input.replace(/[-\\^$*+?.()|[\]{}\/]/g, "\\$&");
      };
      var isReplacedCustomChar = function(ch, customReplacements) {
        for (var c in customReplacements) {
          if (customReplacements[c] === ch) {
            return true;
          }
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = getSlug;
        module.exports.createSlug = createSlug;
      } else if (typeof define !== "undefined" && define.amd) {
        define([], function() {
          return getSlug;
        });
      } else {
        try {
          if (root.getSlug || root.createSlug) {
            throw "speakingurl: globals exists /(getSlug|createSlug)/";
          } else {
            root.getSlug = getSlug;
            root.createSlug = createSlug;
          }
        } catch (e) {
        }
      }
    })(exports);
  }
});
var require_speakingurl2 = __commonJS2({
  "../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/index.js"(exports, module) {
    "use strict";
    init_esm_shims2();
    module.exports = require_speakingurl();
  }
});
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
function onLegacyDevToolsPluginApiAvailable(cb) {
  if (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__) {
    cb();
    return;
  }
  Object.defineProperty(target, "__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__", {
    set(value) {
      if (value)
        cb();
    },
    configurable: true
  });
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
function getComponentTypeName(options) {
  var _a25;
  const name = options.name || options._componentTag || options.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ || options.__name;
  if (name === "index" && ((_a25 = options.__file) == null ? void 0 : _a25.endsWith("index.vue"))) {
    return "";
  }
  return name;
}
function getComponentFileName(options) {
  const file = options.__file;
  if (file)
    return classify(basename(file, ".vue"));
}
function getComponentName(options) {
  const name = options.displayName || options.name || options._componentTag;
  if (name)
    return name;
  return getComponentFileName(options);
}
function saveComponentGussedName(instance, name) {
  instance.type.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ = name;
  return name;
}
function getAppRecord(instance) {
  if (instance.__VUE_DEVTOOLS_NEXT_APP_RECORD__)
    return instance.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
  else if (instance.root)
    return instance.appContext.app.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
}
async function getComponentId(options) {
  const { app, uid, instance } = options;
  try {
    if (instance.__VUE_DEVTOOLS_NEXT_UID__)
      return instance.__VUE_DEVTOOLS_NEXT_UID__;
    const appRecord = await getAppRecord(app);
    if (!appRecord)
      return null;
    const isRoot = appRecord.rootInstance === instance;
    return `${appRecord.id}:${isRoot ? "root" : uid}`;
  } catch (e) {
  }
}
function isFragment(instance) {
  var _a25, _b25;
  const subTreeType = (_a25 = instance.subTree) == null ? void 0 : _a25.type;
  const appRecord = getAppRecord(instance);
  if (appRecord) {
    return ((_b25 = appRecord == null ? void 0 : appRecord.types) == null ? void 0 : _b25.Fragment) === subTreeType;
  }
  return false;
}
function isBeingDestroyed(instance) {
  return instance._isBeingDestroyed || instance.isUnmounted;
}
function getInstanceName(instance) {
  var _a25, _b25, _c;
  const name = getComponentTypeName((instance == null ? void 0 : instance.type) || {});
  if (name)
    return name;
  if ((instance == null ? void 0 : instance.root) === instance)
    return "Root";
  for (const key in (_b25 = (_a25 = instance.parent) == null ? void 0 : _a25.type) == null ? void 0 : _b25.components) {
    if (instance.parent.type.components[key] === (instance == null ? void 0 : instance.type))
      return saveComponentGussedName(instance, key);
  }
  for (const key in (_c = instance.appContext) == null ? void 0 : _c.components) {
    if (instance.appContext.components[key] === (instance == null ? void 0 : instance.type))
      return saveComponentGussedName(instance, key);
  }
  const fileName = getComponentFileName((instance == null ? void 0 : instance.type) || {});
  if (fileName)
    return fileName;
  return "Anonymous Component";
}
function getUniqueComponentId(instance) {
  var _a25, _b25, _c;
  const appId = (_c = (_b25 = (_a25 = instance == null ? void 0 : instance.appContext) == null ? void 0 : _a25.app) == null ? void 0 : _b25.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__) != null ? _c : 0;
  const instanceId = instance === (instance == null ? void 0 : instance.root) ? "root" : instance.uid;
  return `${appId}:${instanceId}`;
}
function getRenderKey(value) {
  if (value == null)
    return "";
  if (typeof value === "number")
    return value;
  else if (typeof value === "string")
    return `'${value}'`;
  else if (Array.isArray(value))
    return "Array";
  else
    return "Object";
}
function returnError(cb) {
  try {
    return cb();
  } catch (e) {
    return e;
  }
}
function getComponentInstance(appRecord, instanceId) {
  instanceId = instanceId || `${appRecord.id}:root`;
  const instance = appRecord.instanceMap.get(instanceId);
  return instance || appRecord.instanceMap.get(":root");
}
function ensurePropertyExists(obj, key, skipObjCheck = false) {
  return skipObjCheck ? key in obj : typeof obj === "object" && obj !== null ? key in obj : false;
}
function createRect() {
  const rect = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    get width() {
      return rect.right - rect.left;
    },
    get height() {
      return rect.bottom - rect.top;
    }
  };
  return rect;
}
var range;
function getTextRect(node) {
  if (!range)
    range = document.createRange();
  range.selectNode(node);
  return range.getBoundingClientRect();
}
function getFragmentRect(vnode) {
  const rect = createRect();
  if (!vnode.children)
    return rect;
  for (let i = 0, l = vnode.children.length; i < l; i++) {
    const childVnode = vnode.children[i];
    let childRect;
    if (childVnode.component) {
      childRect = getComponentBoundingRect(childVnode.component);
    } else if (childVnode.el) {
      const el = childVnode.el;
      if (el.nodeType === 1 || el.getBoundingClientRect)
        childRect = el.getBoundingClientRect();
      else if (el.nodeType === 3 && el.data.trim())
        childRect = getTextRect(el);
    }
    if (childRect)
      mergeRects(rect, childRect);
  }
  return rect;
}
function mergeRects(a, b) {
  if (!a.top || b.top < a.top)
    a.top = b.top;
  if (!a.bottom || b.bottom > a.bottom)
    a.bottom = b.bottom;
  if (!a.left || b.left < a.left)
    a.left = b.left;
  if (!a.right || b.right > a.right)
    a.right = b.right;
  return a;
}
var DEFAULT_RECT = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};
function getComponentBoundingRect(instance) {
  const el = instance.subTree.el;
  if (typeof window === "undefined") {
    return DEFAULT_RECT;
  }
  if (isFragment(instance))
    return getFragmentRect(instance.subTree);
  else if ((el == null ? void 0 : el.nodeType) === 1)
    return el == null ? void 0 : el.getBoundingClientRect();
  else if (instance.subTree.component)
    return getComponentBoundingRect(instance.subTree.component);
  else
    return DEFAULT_RECT;
}
init_esm_shims2();
function getRootElementsFromComponentInstance(instance) {
  if (isFragment(instance))
    return getFragmentRootElements(instance.subTree);
  if (!instance.subTree)
    return [];
  return [instance.subTree.el];
}
function getFragmentRootElements(vnode) {
  if (!vnode.children)
    return [];
  const list = [];
  vnode.children.forEach((childVnode) => {
    if (childVnode.component)
      list.push(...getRootElementsFromComponentInstance(childVnode.component));
    else if (childVnode == null ? void 0 : childVnode.el)
      list.push(childVnode.el);
  });
  return list;
}
var CONTAINER_ELEMENT_ID = "__vue-devtools-component-inspector__";
var CARD_ELEMENT_ID = "__vue-devtools-component-inspector__card__";
var COMPONENT_NAME_ELEMENT_ID = "__vue-devtools-component-inspector__name__";
var INDICATOR_ELEMENT_ID = "__vue-devtools-component-inspector__indicator__";
var containerStyles = {
  display: "block",
  zIndex: 2147483640,
  position: "fixed",
  backgroundColor: "#42b88325",
  border: "1px solid #42b88350",
  borderRadius: "5px",
  transition: "all 0.1s ease-in",
  pointerEvents: "none"
};
var cardStyles = {
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: "5px 8px",
  borderRadius: "4px",
  textAlign: "left",
  position: "absolute",
  left: 0,
  color: "#e9e9e9",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "24px",
  backgroundColor: "#42b883",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
};
var indicatorStyles = {
  display: "inline-block",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "12px",
  opacity: 0.7
};
function getContainerElement() {
  return document.getElementById(CONTAINER_ELEMENT_ID);
}
function getCardElement() {
  return document.getElementById(CARD_ELEMENT_ID);
}
function getIndicatorElement() {
  return document.getElementById(INDICATOR_ELEMENT_ID);
}
function getNameElement() {
  return document.getElementById(COMPONENT_NAME_ELEMENT_ID);
}
function getStyles(bounds) {
  return {
    left: `${Math.round(bounds.left * 100) / 100}px`,
    top: `${Math.round(bounds.top * 100) / 100}px`,
    width: `${Math.round(bounds.width * 100) / 100}px`,
    height: `${Math.round(bounds.height * 100) / 100}px`
  };
}
function create(options) {
  var _a25;
  const containerEl = document.createElement("div");
  containerEl.id = (_a25 = options.elementId) != null ? _a25 : CONTAINER_ELEMENT_ID;
  Object.assign(containerEl.style, {
    ...containerStyles,
    ...getStyles(options.bounds),
    ...options.style
  });
  const cardEl = document.createElement("span");
  cardEl.id = CARD_ELEMENT_ID;
  Object.assign(cardEl.style, {
    ...cardStyles,
    top: options.bounds.top < 35 ? 0 : "-35px"
  });
  const nameEl = document.createElement("span");
  nameEl.id = COMPONENT_NAME_ELEMENT_ID;
  nameEl.innerHTML = `&lt;${options.name}&gt;&nbsp;&nbsp;`;
  const indicatorEl = document.createElement("i");
  indicatorEl.id = INDICATOR_ELEMENT_ID;
  indicatorEl.innerHTML = `${Math.round(options.bounds.width * 100) / 100} x ${Math.round(options.bounds.height * 100) / 100}`;
  Object.assign(indicatorEl.style, indicatorStyles);
  cardEl.appendChild(nameEl);
  cardEl.appendChild(indicatorEl);
  containerEl.appendChild(cardEl);
  document.body.appendChild(containerEl);
  return containerEl;
}
function update(options) {
  const containerEl = getContainerElement();
  const cardEl = getCardElement();
  const nameEl = getNameElement();
  const indicatorEl = getIndicatorElement();
  if (containerEl) {
    Object.assign(containerEl.style, {
      ...containerStyles,
      ...getStyles(options.bounds)
    });
    Object.assign(cardEl.style, {
      top: options.bounds.top < 35 ? 0 : "-35px"
    });
    nameEl.innerHTML = `&lt;${options.name}&gt;&nbsp;&nbsp;`;
    indicatorEl.innerHTML = `${Math.round(options.bounds.width * 100) / 100} x ${Math.round(options.bounds.height * 100) / 100}`;
  }
}
function highlight(instance) {
  const bounds = getComponentBoundingRect(instance);
  if (!bounds.width && !bounds.height)
    return;
  const name = getInstanceName(instance);
  const container = getContainerElement();
  container ? update({ bounds, name }) : create({ bounds, name });
}
function unhighlight() {
  const el = getContainerElement();
  if (el)
    el.style.display = "none";
}
var inspectInstance = null;
function inspectFn(e) {
  const target22 = e.target;
  if (target22) {
    const instance = target22.__vueParentComponent;
    if (instance) {
      inspectInstance = instance;
      const el = instance.vnode.el;
      if (el) {
        const bounds = getComponentBoundingRect(instance);
        const name = getInstanceName(instance);
        const container = getContainerElement();
        container ? update({ bounds, name }) : create({ bounds, name });
      }
    }
  }
}
function selectComponentFn(e, cb) {
  e.preventDefault();
  e.stopPropagation();
  if (inspectInstance) {
    const uniqueComponentId = getUniqueComponentId(inspectInstance);
    cb(uniqueComponentId);
  }
}
var inspectComponentHighLighterSelectFn = null;
function cancelInspectComponentHighLighter() {
  unhighlight();
  window.removeEventListener("mouseover", inspectFn);
  window.removeEventListener("click", inspectComponentHighLighterSelectFn, true);
  inspectComponentHighLighterSelectFn = null;
}
function inspectComponentHighLighter() {
  window.addEventListener("mouseover", inspectFn);
  return new Promise((resolve) => {
    function onSelect(e) {
      e.preventDefault();
      e.stopPropagation();
      selectComponentFn(e, (id) => {
        window.removeEventListener("click", onSelect, true);
        inspectComponentHighLighterSelectFn = null;
        window.removeEventListener("mouseover", inspectFn);
        const el = getContainerElement();
        if (el)
          el.style.display = "none";
        resolve(JSON.stringify({ id }));
      });
    }
    inspectComponentHighLighterSelectFn = onSelect;
    window.addEventListener("click", onSelect, true);
  });
}
function scrollToComponent(options) {
  const instance = getComponentInstance(activeAppRecord.value, options.id);
  if (instance) {
    const [el] = getRootElementsFromComponentInstance(instance);
    if (typeof el.scrollIntoView === "function") {
      el.scrollIntoView({
        behavior: "smooth"
      });
    } else {
      const bounds = getComponentBoundingRect(instance);
      const scrollTarget = document.createElement("div");
      const styles = {
        ...getStyles(bounds),
        position: "absolute"
      };
      Object.assign(scrollTarget.style, styles);
      document.body.appendChild(scrollTarget);
      scrollTarget.scrollIntoView({
        behavior: "smooth"
      });
      setTimeout(() => {
        document.body.removeChild(scrollTarget);
      }, 2e3);
    }
    setTimeout(() => {
      const bounds = getComponentBoundingRect(instance);
      if (bounds.width || bounds.height) {
        const name = getInstanceName(instance);
        const el2 = getContainerElement();
        el2 ? update({ ...options, name, bounds }) : create({ ...options, name, bounds });
        setTimeout(() => {
          if (el2)
            el2.style.display = "none";
        }, 1500);
      }
    }, 1200);
  }
}
init_esm_shims2();
var _a2;
var _b;
(_b = (_a2 = target).__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__) != null ? _b : _a2.__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ = true;
function toggleComponentInspectorEnabled(enabled) {
  target.__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ = enabled;
}
function waitForInspectorInit(cb) {
  let total = 0;
  const timer = setInterval(() => {
    if (target.__VUE_INSPECTOR__) {
      clearInterval(timer);
      total += 30;
      cb();
    }
    if (total >= /* 5s */
    5e3)
      clearInterval(timer);
  }, 30);
}
function setupInspector() {
  const inspector = target.__VUE_INSPECTOR__;
  const _openInEditor = inspector.openInEditor;
  inspector.openInEditor = async (...params) => {
    inspector.disable();
    _openInEditor(...params);
  };
}
function getComponentInspector() {
  return new Promise((resolve) => {
    function setup() {
      setupInspector();
      resolve(target.__VUE_INSPECTOR__);
    }
    if (!target.__VUE_INSPECTOR__) {
      waitForInspectorInit(() => {
        setup();
      });
    } else {
      setup();
    }
  });
}
init_esm_shims2();
init_esm_shims2();
function isReadonly(value) {
  return !!(value && value[
    "__v_isReadonly"
    /* IS_READONLY */
  ]);
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value[
      "__v_raw"
      /* RAW */
    ]);
  }
  return !!(value && value[
    "__v_isReactive"
    /* IS_REACTIVE */
  ]);
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function toRaw(observed) {
  const raw = observed && observed[
    "__v_raw"
    /* RAW */
  ];
  return raw ? toRaw(raw) : observed;
}
var Fragment = Symbol.for("v-fgt");
var StateEditor = class {
  constructor() {
    this.refEditor = new RefStateEditor();
  }
  set(object, path, value, cb) {
    const sections = Array.isArray(path) ? path : path.split(".");
    const markRef = false;
    while (sections.length > 1) {
      const section = sections.shift();
      if (object instanceof Map)
        object = object.get(section);
      else if (object instanceof Set)
        object = Array.from(object.values())[section];
      else object = object[section];
      if (this.refEditor.isRef(object))
        object = this.refEditor.get(object);
    }
    const field = sections[0];
    const item = this.refEditor.get(object)[field];
    if (cb) {
      cb(object, field, value);
    } else {
      if (this.refEditor.isRef(item))
        this.refEditor.set(item, value);
      else if (markRef)
        object[field] = value;
      else
        object[field] = value;
    }
  }
  get(object, path) {
    const sections = Array.isArray(path) ? path : path.split(".");
    for (let i = 0; i < sections.length; i++) {
      if (object instanceof Map)
        object = object.get(sections[i]);
      else
        object = object[sections[i]];
      if (this.refEditor.isRef(object))
        object = this.refEditor.get(object);
      if (!object)
        return void 0;
    }
    return object;
  }
  has(object, path, parent = false) {
    if (typeof object === "undefined")
      return false;
    const sections = Array.isArray(path) ? path.slice() : path.split(".");
    const size = !parent ? 1 : 2;
    while (object && sections.length > size) {
      const section = sections.shift();
      object = object[section];
      if (this.refEditor.isRef(object))
        object = this.refEditor.get(object);
    }
    return object != null && Object.prototype.hasOwnProperty.call(object, sections[0]);
  }
  createDefaultSetCallback(state) {
    return (object, field, value) => {
      if (state.remove || state.newKey) {
        if (Array.isArray(object))
          object.splice(field, 1);
        else if (toRaw(object) instanceof Map)
          object.delete(field);
        else if (toRaw(object) instanceof Set)
          object.delete(Array.from(object.values())[field]);
        else Reflect.deleteProperty(object, field);
      }
      if (!state.remove) {
        const target22 = object[state.newKey || field];
        if (this.refEditor.isRef(target22))
          this.refEditor.set(target22, value);
        else if (toRaw(object) instanceof Map)
          object.set(state.newKey || field, value);
        else if (toRaw(object) instanceof Set)
          object.add(value);
        else
          object[state.newKey || field] = value;
      }
    };
  }
};
var RefStateEditor = class {
  set(ref, value) {
    if (isRef(ref)) {
      ref.value = value;
    } else {
      if (ref instanceof Set && Array.isArray(value)) {
        ref.clear();
        value.forEach((v) => ref.add(v));
        return;
      }
      const currentKeys = Object.keys(value);
      if (ref instanceof Map) {
        const previousKeysSet2 = new Set(ref.keys());
        currentKeys.forEach((key) => {
          ref.set(key, Reflect.get(value, key));
          previousKeysSet2.delete(key);
        });
        previousKeysSet2.forEach((key) => ref.delete(key));
        return;
      }
      const previousKeysSet = new Set(Object.keys(ref));
      currentKeys.forEach((key) => {
        Reflect.set(ref, key, Reflect.get(value, key));
        previousKeysSet.delete(key);
      });
      previousKeysSet.forEach((key) => Reflect.deleteProperty(ref, key));
    }
  }
  get(ref) {
    return isRef(ref) ? ref.value : ref;
  }
  isRef(ref) {
    return isRef(ref) || isReactive(ref);
  }
};
async function editComponentState(payload, stateEditor2) {
  const { path, nodeId, state, type } = payload;
  const instance = getComponentInstance(activeAppRecord.value, nodeId);
  if (!instance)
    return;
  const targetPath = path.slice();
  let target22;
  if (Object.keys(instance.props).includes(path[0])) {
    target22 = instance.props;
  } else if (instance.devtoolsRawSetupState && Object.keys(instance.devtoolsRawSetupState).includes(path[0])) {
    target22 = instance.devtoolsRawSetupState;
  } else if (instance.data && Object.keys(instance.data).includes(path[0])) {
    target22 = instance.data;
  } else {
    target22 = instance.proxy;
  }
  if (target22 && targetPath) {
    if (state.type === "object" && type === "reactive") {
    }
    stateEditor2.set(target22, targetPath, state.value, stateEditor2.createDefaultSetCallback(state));
  }
}
var stateEditor = new StateEditor();
async function editState(payload) {
  editComponentState(payload, stateEditor);
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var TIMELINE_LAYERS_STATE_STORAGE_ID = "__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS_STATE__";
function addTimelineLayersStateToStorage(state) {
  if (!isBrowser || typeof localStorage === "undefined" || localStorage === null) {
    return;
  }
  localStorage.setItem(TIMELINE_LAYERS_STATE_STORAGE_ID, JSON.stringify(state));
}
function getTimelineLayersStateFromStorage() {
  if (!isBrowser || typeof localStorage === "undefined" || localStorage === null) {
    return {
      recordingState: false,
      mouseEventEnabled: false,
      keyboardEventEnabled: false,
      componentEventEnabled: false,
      performanceEventEnabled: false,
      selected: ""
    };
  }
  const state = localStorage.getItem(TIMELINE_LAYERS_STATE_STORAGE_ID);
  return state ? JSON.parse(state) : {
    recordingState: false,
    mouseEventEnabled: false,
    keyboardEventEnabled: false,
    componentEventEnabled: false,
    performanceEventEnabled: false,
    selected: ""
  };
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var _a22;
var _b2;
(_b2 = (_a22 = target).__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS) != null ? _b2 : _a22.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS = [];
var devtoolsTimelineLayers = new Proxy(target.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS, {
  get(target22, prop, receiver) {
    return Reflect.get(target22, prop, receiver);
  }
});
function addTimelineLayer(options, descriptor) {
  devtoolsState.timelineLayersState[descriptor.id] = false;
  devtoolsTimelineLayers.push({
    ...options,
    descriptorId: descriptor.id,
    appRecord: getAppRecord(descriptor.app)
  });
}
function updateTimelineLayersState(state) {
  const updatedState = {
    ...devtoolsState.timelineLayersState,
    ...state
  };
  addTimelineLayersStateToStorage(updatedState);
  updateDevToolsState({
    timelineLayersState: updatedState
  });
}
var _a3;
var _b3;
(_b3 = (_a3 = target).__VUE_DEVTOOLS_KIT_INSPECTOR__) != null ? _b3 : _a3.__VUE_DEVTOOLS_KIT_INSPECTOR__ = [];
var devtoolsInspector = new Proxy(target.__VUE_DEVTOOLS_KIT_INSPECTOR__, {
  get(target22, prop, receiver) {
    return Reflect.get(target22, prop, receiver);
  }
});
var callInspectorUpdatedHook = debounce(() => {
  devtoolsContext.hooks.callHook("sendInspectorToClient", getActiveInspectors());
});
function addInspector(inspector, descriptor) {
  var _a25, _b25;
  devtoolsInspector.push({
    options: inspector,
    descriptor,
    treeFilterPlaceholder: (_a25 = inspector.treeFilterPlaceholder) != null ? _a25 : "Search tree...",
    stateFilterPlaceholder: (_b25 = inspector.stateFilterPlaceholder) != null ? _b25 : "Search state...",
    treeFilter: "",
    selectedNodeId: "",
    appRecord: getAppRecord(descriptor.app)
  });
  callInspectorUpdatedHook();
}
function getActiveInspectors() {
  return devtoolsInspector.filter((inspector) => inspector.descriptor.app === activeAppRecord.value.app).filter((inspector) => inspector.descriptor.id !== "components").map((inspector) => {
    var _a25;
    const descriptor = inspector.descriptor;
    const options = inspector.options;
    return {
      id: options.id,
      label: options.label,
      logo: descriptor.logo,
      icon: `custom-ic-baseline-${(_a25 = options == null ? void 0 : options.icon) == null ? void 0 : _a25.replace(/_/g, "-")}`,
      packageName: descriptor.packageName,
      homepage: descriptor.homepage,
      pluginId: descriptor.id
    };
  });
}
function getInspectorInfo(id) {
  const inspector = getInspector(id, activeAppRecord.value.app);
  if (!inspector)
    return;
  const descriptor = inspector.descriptor;
  const options = inspector.options;
  const timelineLayers = devtoolsTimelineLayers.filter((layer) => layer.descriptorId === descriptor.id).map((item) => ({
    id: item.id,
    label: item.label,
    color: item.color
  }));
  return {
    id: options.id,
    label: options.label,
    logo: descriptor.logo,
    packageName: descriptor.packageName,
    homepage: descriptor.homepage,
    timelineLayers,
    treeFilterPlaceholder: inspector.treeFilterPlaceholder,
    stateFilterPlaceholder: inspector.stateFilterPlaceholder
  };
}
function getInspector(id, app) {
  return devtoolsInspector.find((inspector) => inspector.options.id === id && (app ? inspector.descriptor.app === app : true));
}
function getInspectorActions(id) {
  const inspector = getInspector(id);
  return inspector == null ? void 0 : inspector.options.actions;
}
function getInspectorNodeActions(id) {
  const inspector = getInspector(id);
  return inspector == null ? void 0 : inspector.options.nodeActions;
}
var DevToolsV6PluginAPIHookKeys = ((DevToolsV6PluginAPIHookKeys2) => {
  DevToolsV6PluginAPIHookKeys2["VISIT_COMPONENT_TREE"] = "visitComponentTree";
  DevToolsV6PluginAPIHookKeys2["INSPECT_COMPONENT"] = "inspectComponent";
  DevToolsV6PluginAPIHookKeys2["EDIT_COMPONENT_STATE"] = "editComponentState";
  DevToolsV6PluginAPIHookKeys2["GET_INSPECTOR_TREE"] = "getInspectorTree";
  DevToolsV6PluginAPIHookKeys2["GET_INSPECTOR_STATE"] = "getInspectorState";
  DevToolsV6PluginAPIHookKeys2["EDIT_INSPECTOR_STATE"] = "editInspectorState";
  DevToolsV6PluginAPIHookKeys2["INSPECT_TIMELINE_EVENT"] = "inspectTimelineEvent";
  DevToolsV6PluginAPIHookKeys2["TIMELINE_CLEARED"] = "timelineCleared";
  DevToolsV6PluginAPIHookKeys2["SET_PLUGIN_SETTINGS"] = "setPluginSettings";
  return DevToolsV6PluginAPIHookKeys2;
})(DevToolsV6PluginAPIHookKeys || {});
var DevToolsContextHookKeys = ((DevToolsContextHookKeys2) => {
  DevToolsContextHookKeys2["ADD_INSPECTOR"] = "addInspector";
  DevToolsContextHookKeys2["SEND_INSPECTOR_TREE"] = "sendInspectorTree";
  DevToolsContextHookKeys2["SEND_INSPECTOR_STATE"] = "sendInspectorState";
  DevToolsContextHookKeys2["CUSTOM_INSPECTOR_SELECT_NODE"] = "customInspectorSelectNode";
  DevToolsContextHookKeys2["TIMELINE_LAYER_ADDED"] = "timelineLayerAdded";
  DevToolsContextHookKeys2["TIMELINE_EVENT_ADDED"] = "timelineEventAdded";
  DevToolsContextHookKeys2["GET_COMPONENT_INSTANCES"] = "getComponentInstances";
  DevToolsContextHookKeys2["GET_COMPONENT_BOUNDS"] = "getComponentBounds";
  DevToolsContextHookKeys2["GET_COMPONENT_NAME"] = "getComponentName";
  DevToolsContextHookKeys2["COMPONENT_HIGHLIGHT"] = "componentHighlight";
  DevToolsContextHookKeys2["COMPONENT_UNHIGHLIGHT"] = "componentUnhighlight";
  return DevToolsContextHookKeys2;
})(DevToolsContextHookKeys || {});
var DevToolsMessagingHookKeys = ((DevToolsMessagingHookKeys2) => {
  DevToolsMessagingHookKeys2["SEND_INSPECTOR_TREE_TO_CLIENT"] = "sendInspectorTreeToClient";
  DevToolsMessagingHookKeys2["SEND_INSPECTOR_STATE_TO_CLIENT"] = "sendInspectorStateToClient";
  DevToolsMessagingHookKeys2["SEND_TIMELINE_EVENT_TO_CLIENT"] = "sendTimelineEventToClient";
  DevToolsMessagingHookKeys2["SEND_INSPECTOR_TO_CLIENT"] = "sendInspectorToClient";
  DevToolsMessagingHookKeys2["SEND_ACTIVE_APP_UNMOUNTED_TO_CLIENT"] = "sendActiveAppUpdatedToClient";
  DevToolsMessagingHookKeys2["DEVTOOLS_STATE_UPDATED"] = "devtoolsStateUpdated";
  DevToolsMessagingHookKeys2["DEVTOOLS_CONNECTED_UPDATED"] = "devtoolsConnectedUpdated";
  DevToolsMessagingHookKeys2["ROUTER_INFO_UPDATED"] = "routerInfoUpdated";
  return DevToolsMessagingHookKeys2;
})(DevToolsMessagingHookKeys || {});
function createDevToolsCtxHooks() {
  const hooks2 = createHooks();
  hooks2.hook("addInspector", ({ inspector, plugin }) => {
    addInspector(inspector, plugin.descriptor);
  });
  const debounceSendInspectorTree = debounce(async ({ inspectorId, plugin }) => {
    var _a25;
    if (!inspectorId || !((_a25 = plugin == null ? void 0 : plugin.descriptor) == null ? void 0 : _a25.app) || devtoolsState.highPerfModeEnabled)
      return;
    const inspector = getInspector(inspectorId, plugin.descriptor.app);
    const _payload = {
      app: plugin.descriptor.app,
      inspectorId,
      filter: (inspector == null ? void 0 : inspector.treeFilter) || "",
      rootNodes: []
    };
    await new Promise((resolve) => {
      hooks2.callHookWith(
        async (callbacks) => {
          await Promise.all(callbacks.map((cb) => cb(_payload)));
          resolve();
        },
        "getInspectorTree"
        /* GET_INSPECTOR_TREE */
      );
    });
    hooks2.callHookWith(
      async (callbacks) => {
        await Promise.all(callbacks.map((cb) => cb({
          inspectorId,
          rootNodes: _payload.rootNodes
        })));
      },
      "sendInspectorTreeToClient"
      /* SEND_INSPECTOR_TREE_TO_CLIENT */
    );
  }, 120);
  hooks2.hook("sendInspectorTree", debounceSendInspectorTree);
  const debounceSendInspectorState = debounce(async ({ inspectorId, plugin }) => {
    var _a25;
    if (!inspectorId || !((_a25 = plugin == null ? void 0 : plugin.descriptor) == null ? void 0 : _a25.app) || devtoolsState.highPerfModeEnabled)
      return;
    const inspector = getInspector(inspectorId, plugin.descriptor.app);
    const _payload = {
      app: plugin.descriptor.app,
      inspectorId,
      nodeId: (inspector == null ? void 0 : inspector.selectedNodeId) || "",
      state: null
    };
    const ctx = {
      currentTab: `custom-inspector:${inspectorId}`
    };
    if (_payload.nodeId) {
      await new Promise((resolve) => {
        hooks2.callHookWith(
          async (callbacks) => {
            await Promise.all(callbacks.map((cb) => cb(_payload, ctx)));
            resolve();
          },
          "getInspectorState"
          /* GET_INSPECTOR_STATE */
        );
      });
    }
    hooks2.callHookWith(
      async (callbacks) => {
        await Promise.all(callbacks.map((cb) => cb({
          inspectorId,
          nodeId: _payload.nodeId,
          state: _payload.state
        })));
      },
      "sendInspectorStateToClient"
      /* SEND_INSPECTOR_STATE_TO_CLIENT */
    );
  }, 120);
  hooks2.hook("sendInspectorState", debounceSendInspectorState);
  hooks2.hook("customInspectorSelectNode", ({ inspectorId, nodeId, plugin }) => {
    const inspector = getInspector(inspectorId, plugin.descriptor.app);
    if (!inspector)
      return;
    inspector.selectedNodeId = nodeId;
  });
  hooks2.hook("timelineLayerAdded", ({ options, plugin }) => {
    addTimelineLayer(options, plugin.descriptor);
  });
  hooks2.hook("timelineEventAdded", ({ options, plugin }) => {
    var _a25;
    const internalLayerIds = ["performance", "component-event", "keyboard", "mouse"];
    if (devtoolsState.highPerfModeEnabled || !((_a25 = devtoolsState.timelineLayersState) == null ? void 0 : _a25[plugin.descriptor.id]) && !internalLayerIds.includes(options.layerId))
      return;
    hooks2.callHookWith(
      async (callbacks) => {
        await Promise.all(callbacks.map((cb) => cb(options)));
      },
      "sendTimelineEventToClient"
      /* SEND_TIMELINE_EVENT_TO_CLIENT */
    );
  });
  hooks2.hook("getComponentInstances", async ({ app }) => {
    const appRecord = app.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
    if (!appRecord)
      return null;
    const appId = appRecord.id.toString();
    const instances = [...appRecord.instanceMap].filter(([key]) => key.split(":")[0] === appId).map(([, instance]) => instance);
    return instances;
  });
  hooks2.hook("getComponentBounds", async ({ instance }) => {
    const bounds = getComponentBoundingRect(instance);
    return bounds;
  });
  hooks2.hook("getComponentName", ({ instance }) => {
    const name = getInstanceName(instance);
    return name;
  });
  hooks2.hook("componentHighlight", ({ uid }) => {
    const instance = activeAppRecord.value.instanceMap.get(uid);
    if (instance) {
      highlight(instance);
    }
  });
  hooks2.hook("componentUnhighlight", () => {
    unhighlight();
  });
  return hooks2;
}
var _a4;
var _b4;
(_b4 = (_a4 = target).__VUE_DEVTOOLS_KIT_APP_RECORDS__) != null ? _b4 : _a4.__VUE_DEVTOOLS_KIT_APP_RECORDS__ = [];
var _a5;
var _b5;
(_b5 = (_a5 = target).__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__) != null ? _b5 : _a5.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = {};
var _a6;
var _b6;
(_b6 = (_a6 = target).__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__) != null ? _b6 : _a6.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = "";
var _a7;
var _b7;
(_b7 = (_a7 = target).__VUE_DEVTOOLS_KIT_CUSTOM_TABS__) != null ? _b7 : _a7.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ = [];
var _a8;
var _b8;
(_b8 = (_a8 = target).__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__) != null ? _b8 : _a8.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ = [];
var STATE_KEY = "__VUE_DEVTOOLS_KIT_GLOBAL_STATE__";
function initStateFactory() {
  return {
    connected: false,
    clientConnected: false,
    vitePluginDetected: true,
    appRecords: [],
    activeAppRecordId: "",
    tabs: [],
    commands: [],
    highPerfModeEnabled: true,
    devtoolsClientDetected: {},
    perfUniqueGroupId: 0,
    timelineLayersState: getTimelineLayersStateFromStorage()
  };
}
var _a9;
var _b9;
(_b9 = (_a9 = target)[STATE_KEY]) != null ? _b9 : _a9[STATE_KEY] = initStateFactory();
var callStateUpdatedHook = debounce((state) => {
  devtoolsContext.hooks.callHook("devtoolsStateUpdated", { state });
});
var callConnectedUpdatedHook = debounce((state, oldState) => {
  devtoolsContext.hooks.callHook("devtoolsConnectedUpdated", { state, oldState });
});
var devtoolsAppRecords = new Proxy(target.__VUE_DEVTOOLS_KIT_APP_RECORDS__, {
  get(_target, prop, receiver) {
    if (prop === "value")
      return target.__VUE_DEVTOOLS_KIT_APP_RECORDS__;
    return target.__VUE_DEVTOOLS_KIT_APP_RECORDS__[prop];
  }
});
var addDevToolsAppRecord = (app) => {
  target.__VUE_DEVTOOLS_KIT_APP_RECORDS__ = [
    ...target.__VUE_DEVTOOLS_KIT_APP_RECORDS__,
    app
  ];
};
var removeDevToolsAppRecord = (app) => {
  target.__VUE_DEVTOOLS_KIT_APP_RECORDS__ = devtoolsAppRecords.value.filter((record) => record.app !== app);
};
var activeAppRecord = new Proxy(target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__, {
  get(_target, prop, receiver) {
    if (prop === "value")
      return target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__;
    else if (prop === "id")
      return target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__;
    return target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__[prop];
  }
});
function updateAllStates() {
  callStateUpdatedHook({
    ...target[STATE_KEY],
    appRecords: devtoolsAppRecords.value,
    activeAppRecordId: activeAppRecord.id,
    tabs: target.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__,
    commands: target.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__
  });
}
function setActiveAppRecord(app) {
  target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = app;
  updateAllStates();
}
function setActiveAppRecordId(id) {
  target.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = id;
  updateAllStates();
}
var devtoolsState = new Proxy(target[STATE_KEY], {
  get(target22, property) {
    if (property === "appRecords") {
      return devtoolsAppRecords;
    } else if (property === "activeAppRecordId") {
      return activeAppRecord.id;
    } else if (property === "tabs") {
      return target.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__;
    } else if (property === "commands") {
      return target.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__;
    }
    return target[STATE_KEY][property];
  },
  deleteProperty(target22, property) {
    delete target22[property];
    return true;
  },
  set(target22, property, value) {
    const oldState = { ...target[STATE_KEY] };
    target22[property] = value;
    target[STATE_KEY][property] = value;
    return true;
  }
});
function resetDevToolsState() {
  Object.assign(target[STATE_KEY], initStateFactory());
}
function updateDevToolsState(state) {
  const oldState = {
    ...target[STATE_KEY],
    appRecords: devtoolsAppRecords.value,
    activeAppRecordId: activeAppRecord.id
  };
  if (oldState.connected !== state.connected && state.connected || oldState.clientConnected !== state.clientConnected && state.clientConnected) {
    callConnectedUpdatedHook(target[STATE_KEY], oldState);
  }
  Object.assign(target[STATE_KEY], state);
  updateAllStates();
}
function onDevToolsConnected(fn) {
  return new Promise((resolve) => {
    if (devtoolsState.connected) {
      fn();
      resolve();
    }
    devtoolsContext.hooks.hook("devtoolsConnectedUpdated", ({ state }) => {
      if (state.connected) {
        fn();
        resolve();
      }
    });
  });
}
var resolveIcon = (icon) => {
  if (!icon)
    return;
  if (icon.startsWith("baseline-")) {
    return `custom-ic-${icon}`;
  }
  if (icon.startsWith("i-") || isUrlString(icon))
    return icon;
  return `custom-ic-baseline-${icon}`;
};
function addCustomTab(tab) {
  const tabs = target.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__;
  if (tabs.some((t) => t.name === tab.name))
    return;
  tabs.push({
    ...tab,
    icon: resolveIcon(tab.icon)
  });
  updateAllStates();
}
function addCustomCommand(action) {
  const commands = target.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__;
  if (commands.some((t) => t.id === action.id))
    return;
  commands.push({
    ...action,
    icon: resolveIcon(action.icon),
    children: action.children ? action.children.map((child) => ({
      ...child,
      icon: resolveIcon(child.icon)
    })) : void 0
  });
  updateAllStates();
}
function removeCustomCommand(actionId) {
  const commands = target.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__;
  const index = commands.findIndex((t) => t.id === actionId);
  if (index === -1)
    return;
  commands.splice(index, 1);
  updateAllStates();
}
function toggleClientConnected(state) {
  updateDevToolsState({ clientConnected: state });
}
function setOpenInEditorBaseUrl(url) {
  target.__VUE_DEVTOOLS_OPEN_IN_EDITOR_BASE_URL__ = url;
}
function openInEditor(options = {}) {
  var _a25, _b25, _c;
  const { file, host, baseUrl = window.location.origin, line = 0, column = 0 } = options;
  if (file) {
    if (host === "chrome-extension") {
      const fileName = file.replace(/\\/g, "\\\\");
      const _baseUrl = (_b25 = (_a25 = window.VUE_DEVTOOLS_CONFIG) == null ? void 0 : _a25.openInEditorHost) != null ? _b25 : "/";
      fetch(`${_baseUrl}__open-in-editor?file=${encodeURI(file)}`).then((response) => {
        if (!response.ok) {
          const msg = `Opening component ${fileName} failed`;
          console.log(`%c${msg}`, "color:red");
        }
      });
    } else if (devtoolsState.vitePluginDetected) {
      const _baseUrl = (_c = target.__VUE_DEVTOOLS_OPEN_IN_EDITOR_BASE_URL__) != null ? _c : baseUrl;
      target.__VUE_INSPECTOR__.openInEditor(_baseUrl, file, line, column);
    }
  }
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var _a10;
var _b10;
(_b10 = (_a10 = target).__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__) != null ? _b10 : _a10.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__ = [];
var devtoolsPluginBuffer = new Proxy(target.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__, {
  get(target22, prop, receiver) {
    return Reflect.get(target22, prop, receiver);
  }
});
function addDevToolsPluginToBuffer(pluginDescriptor, setupFn) {
  devtoolsPluginBuffer.push([pluginDescriptor, setupFn]);
}
function _getSettings(settings) {
  const _settings = {};
  Object.keys(settings).forEach((key) => {
    _settings[key] = settings[key].defaultValue;
  });
  return _settings;
}
function getPluginLocalKey(pluginId) {
  return `__VUE_DEVTOOLS_NEXT_PLUGIN_SETTINGS__${pluginId}__`;
}
function getPluginSettingsOptions(pluginId) {
  var _a25, _b25, _c;
  const item = (_b25 = (_a25 = devtoolsPluginBuffer.find((item2) => {
    var _a26;
    return item2[0].id === pluginId && !!((_a26 = item2[0]) == null ? void 0 : _a26.settings);
  })) == null ? void 0 : _a25[0]) != null ? _b25 : null;
  return (_c = item == null ? void 0 : item.settings) != null ? _c : null;
}
function getPluginSettings(pluginId, fallbackValue) {
  var _a25, _b25, _c;
  const localKey = getPluginLocalKey(pluginId);
  if (localKey) {
    const localSettings = localStorage.getItem(localKey);
    if (localSettings) {
      return JSON.parse(localSettings);
    }
  }
  if (pluginId) {
    const item = (_b25 = (_a25 = devtoolsPluginBuffer.find((item2) => item2[0].id === pluginId)) == null ? void 0 : _a25[0]) != null ? _b25 : null;
    return _getSettings((_c = item == null ? void 0 : item.settings) != null ? _c : {});
  }
  return _getSettings(fallbackValue);
}
function initPluginSettings(pluginId, settings) {
  const localKey = getPluginLocalKey(pluginId);
  const localSettings = localStorage.getItem(localKey);
  if (!localSettings) {
    localStorage.setItem(localKey, JSON.stringify(_getSettings(settings)));
  }
}
function setPluginSettings(pluginId, key, value) {
  const localKey = getPluginLocalKey(pluginId);
  const localSettings = localStorage.getItem(localKey);
  const parsedLocalSettings = JSON.parse(localSettings || "{}");
  const updated = {
    ...parsedLocalSettings,
    [key]: value
  };
  localStorage.setItem(localKey, JSON.stringify(updated));
  devtoolsContext.hooks.callHookWith(
    (callbacks) => {
      callbacks.forEach((cb) => cb({
        pluginId,
        key,
        oldValue: parsedLocalSettings[key],
        newValue: value,
        settings: updated
      }));
    },
    "setPluginSettings"
    /* SET_PLUGIN_SETTINGS */
  );
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var _a11;
var _b11;
var devtoolsHooks = (_b11 = (_a11 = target).__VUE_DEVTOOLS_HOOK) != null ? _b11 : _a11.__VUE_DEVTOOLS_HOOK = createHooks2();
var on = {
  vueAppInit(fn) {
    devtoolsHooks.hook("app:init", fn);
  },
  vueAppUnmount(fn) {
    devtoolsHooks.hook("app:unmount", fn);
  },
  vueAppConnected(fn) {
    devtoolsHooks.hook("app:connected", fn);
  },
  componentAdded(fn) {
    return devtoolsHooks.hook("component:added", fn);
  },
  componentEmit(fn) {
    return devtoolsHooks.hook("component:emit", fn);
  },
  componentUpdated(fn) {
    return devtoolsHooks.hook("component:updated", fn);
  },
  componentRemoved(fn) {
    return devtoolsHooks.hook("component:removed", fn);
  },
  setupDevtoolsPlugin(fn) {
    devtoolsHooks.hook("devtools-plugin:setup", fn);
  },
  perfStart(fn) {
    return devtoolsHooks.hook("perf:start", fn);
  },
  perfEnd(fn) {
    return devtoolsHooks.hook("perf:end", fn);
  }
};
function createDevToolsHook() {
  return {
    id: "vue-devtools-next",
    devtoolsVersion: "7.0",
    enabled: false,
    appRecords: [],
    apps: [],
    events: /* @__PURE__ */ new Map(),
    on(event, fn) {
      var _a25;
      if (!this.events.has(event))
        this.events.set(event, []);
      (_a25 = this.events.get(event)) == null ? void 0 : _a25.push(fn);
      return () => this.off(event, fn);
    },
    once(event, fn) {
      const onceFn = (...args) => {
        this.off(event, onceFn);
        fn(...args);
      };
      this.on(event, onceFn);
      return [event, onceFn];
    },
    off(event, fn) {
      if (this.events.has(event)) {
        const eventCallbacks = this.events.get(event);
        const index = eventCallbacks.indexOf(fn);
        if (index !== -1)
          eventCallbacks.splice(index, 1);
      }
    },
    emit(event, ...payload) {
      if (this.events.has(event))
        this.events.get(event).forEach((fn) => fn(...payload));
    }
  };
}
function subscribeDevToolsHook(hook2) {
  hook2.on("app:init", (app, version, types) => {
    var _a25, _b25, _c;
    if ((_c = (_b25 = (_a25 = app == null ? void 0 : app._instance) == null ? void 0 : _a25.type) == null ? void 0 : _b25.devtools) == null ? void 0 : _c.hide)
      return;
    devtoolsHooks.callHook("app:init", app, version, types);
  });
  hook2.on("app:unmount", (app) => {
    devtoolsHooks.callHook("app:unmount", app);
  });
  hook2.on("component:added", async (app, uid, parentUid, component) => {
    var _a25, _b25, _c;
    if (((_c = (_b25 = (_a25 = app == null ? void 0 : app._instance) == null ? void 0 : _a25.type) == null ? void 0 : _b25.devtools) == null ? void 0 : _c.hide) || devtoolsState.highPerfModeEnabled)
      return;
    if (!app || typeof uid !== "number" && !uid || !component)
      return;
    devtoolsHooks.callHook("component:added", app, uid, parentUid, component);
  });
  hook2.on("component:updated", (app, uid, parentUid, component) => {
    if (!app || typeof uid !== "number" && !uid || !component || devtoolsState.highPerfModeEnabled)
      return;
    devtoolsHooks.callHook("component:updated", app, uid, parentUid, component);
  });
  hook2.on("component:removed", async (app, uid, parentUid, component) => {
    if (!app || typeof uid !== "number" && !uid || !component || devtoolsState.highPerfModeEnabled)
      return;
    devtoolsHooks.callHook("component:removed", app, uid, parentUid, component);
  });
  hook2.on("component:emit", async (app, instance, event, params) => {
    if (!app || !instance || devtoolsState.highPerfModeEnabled)
      return;
    devtoolsHooks.callHook("component:emit", app, instance, event, params);
  });
  hook2.on("perf:start", (app, uid, vm, type, time) => {
    if (!app || devtoolsState.highPerfModeEnabled)
      return;
    devtoolsHooks.callHook("perf:start", app, uid, vm, type, time);
  });
  hook2.on("perf:end", (app, uid, vm, type, time) => {
    if (!app || devtoolsState.highPerfModeEnabled)
      return;
    devtoolsHooks.callHook("perf:end", app, uid, vm, type, time);
  });
  hook2.on("devtools-plugin:setup", (pluginDescriptor, setupFn, options) => {
    if ((options == null ? void 0 : options.target) === "legacy")
      return;
    devtoolsHooks.callHook("devtools-plugin:setup", pluginDescriptor, setupFn);
  });
}
var hook = {
  on,
  setupDevToolsPlugin(pluginDescriptor, setupFn) {
    return devtoolsHooks.callHook("devtools-plugin:setup", pluginDescriptor, setupFn);
  }
};
var DevToolsV6PluginAPI = class {
  constructor({ plugin, ctx }) {
    this.hooks = ctx.hooks;
    this.plugin = plugin;
  }
  get on() {
    return {
      // component inspector
      visitComponentTree: (handler) => {
        this.hooks.hook("visitComponentTree", handler);
      },
      inspectComponent: (handler) => {
        this.hooks.hook("inspectComponent", handler);
      },
      editComponentState: (handler) => {
        this.hooks.hook("editComponentState", handler);
      },
      // custom inspector
      getInspectorTree: (handler) => {
        this.hooks.hook("getInspectorTree", handler);
      },
      getInspectorState: (handler) => {
        this.hooks.hook("getInspectorState", handler);
      },
      editInspectorState: (handler) => {
        this.hooks.hook("editInspectorState", handler);
      },
      // timeline
      inspectTimelineEvent: (handler) => {
        this.hooks.hook("inspectTimelineEvent", handler);
      },
      timelineCleared: (handler) => {
        this.hooks.hook("timelineCleared", handler);
      },
      // settings
      setPluginSettings: (handler) => {
        this.hooks.hook("setPluginSettings", handler);
      }
    };
  }
  // component inspector
  notifyComponentUpdate(instance) {
    var _a25;
    if (devtoolsState.highPerfModeEnabled) {
      return;
    }
    const inspector = getActiveInspectors().find((i) => i.packageName === this.plugin.descriptor.packageName);
    if (inspector == null ? void 0 : inspector.id) {
      if (instance) {
        const args = [
          instance.appContext.app,
          instance.uid,
          (_a25 = instance.parent) == null ? void 0 : _a25.uid,
          instance
        ];
        devtoolsHooks.callHook("component:updated", ...args);
      } else {
        devtoolsHooks.callHook(
          "component:updated"
          /* COMPONENT_UPDATED */
        );
      }
      this.hooks.callHook("sendInspectorState", { inspectorId: inspector.id, plugin: this.plugin });
    }
  }
  // custom inspector
  addInspector(options) {
    this.hooks.callHook("addInspector", { inspector: options, plugin: this.plugin });
    if (this.plugin.descriptor.settings) {
      initPluginSettings(options.id, this.plugin.descriptor.settings);
    }
  }
  sendInspectorTree(inspectorId) {
    if (devtoolsState.highPerfModeEnabled) {
      return;
    }
    this.hooks.callHook("sendInspectorTree", { inspectorId, plugin: this.plugin });
  }
  sendInspectorState(inspectorId) {
    if (devtoolsState.highPerfModeEnabled) {
      return;
    }
    this.hooks.callHook("sendInspectorState", { inspectorId, plugin: this.plugin });
  }
  selectInspectorNode(inspectorId, nodeId) {
    this.hooks.callHook("customInspectorSelectNode", { inspectorId, nodeId, plugin: this.plugin });
  }
  visitComponentTree(payload) {
    return this.hooks.callHook("visitComponentTree", payload);
  }
  // timeline
  now() {
    if (devtoolsState.highPerfModeEnabled) {
      return 0;
    }
    return Date.now();
  }
  addTimelineLayer(options) {
    this.hooks.callHook("timelineLayerAdded", { options, plugin: this.plugin });
  }
  addTimelineEvent(options) {
    if (devtoolsState.highPerfModeEnabled) {
      return;
    }
    this.hooks.callHook("timelineEventAdded", { options, plugin: this.plugin });
  }
  // settings
  getSettings(pluginId) {
    return getPluginSettings(pluginId != null ? pluginId : this.plugin.descriptor.id, this.plugin.descriptor.settings);
  }
  // utilities
  getComponentInstances(app) {
    return this.hooks.callHook("getComponentInstances", { app });
  }
  getComponentBounds(instance) {
    return this.hooks.callHook("getComponentBounds", { instance });
  }
  getComponentName(instance) {
    return this.hooks.callHook("getComponentName", { instance });
  }
  highlightElement(instance) {
    const uid = instance.__VUE_DEVTOOLS_NEXT_UID__;
    return this.hooks.callHook("componentHighlight", { uid });
  }
  unhighlightElement() {
    return this.hooks.callHook(
      "componentUnhighlight"
      /* COMPONENT_UNHIGHLIGHT */
    );
  }
};
var DevToolsPluginAPI = DevToolsV6PluginAPI;
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var vueBuiltins = /* @__PURE__ */ new Set([
  "nextTick",
  "defineComponent",
  "defineAsyncComponent",
  "defineCustomElement",
  "ref",
  "computed",
  "reactive",
  "readonly",
  "watchEffect",
  "watchPostEffect",
  "watchSyncEffect",
  "watch",
  "isRef",
  "unref",
  "toRef",
  "toRefs",
  "isProxy",
  "isReactive",
  "isReadonly",
  "shallowRef",
  "triggerRef",
  "customRef",
  "shallowReactive",
  "shallowReadonly",
  "toRaw",
  "markRaw",
  "effectScope",
  "getCurrentScope",
  "onScopeDispose",
  "onMounted",
  "onUpdated",
  "onUnmounted",
  "onBeforeMount",
  "onBeforeUpdate",
  "onBeforeUnmount",
  "onErrorCaptured",
  "onRenderTracked",
  "onRenderTriggered",
  "onActivated",
  "onDeactivated",
  "onServerPrefetch",
  "provide",
  "inject",
  "h",
  "mergeProps",
  "cloneVNode",
  "isVNode",
  "resolveComponent",
  "resolveDirective",
  "withDirectives",
  "withModifiers"
]);
var symbolRE = /^\[native Symbol Symbol\((.*)\)\]$/;
var rawTypeRE = /^\[object (\w+)\]$/;
var specialTypeRE = /^\[native (\w+) (.*?)(<>(([\s\S])*))?\]$/;
var fnTypeRE = /^(?:function|class) (\w+)/;
var MAX_STRING_SIZE = 1e4;
var MAX_ARRAY_SIZE = 5e3;
var UNDEFINED = "__vue_devtool_undefined__";
var INFINITY = "__vue_devtool_infinity__";
var NEGATIVE_INFINITY = "__vue_devtool_negative_infinity__";
var NAN = "__vue_devtool_nan__";
var ESC = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "&": "&amp;"
};
init_esm_shims2();
init_esm_shims2();
function isVueInstance(value) {
  if (!ensurePropertyExists(value, "_")) {
    return false;
  }
  if (!isPlainObject(value._)) {
    return false;
  }
  return Object.keys(value._).includes("vnode");
}
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function isPrimitive(data) {
  if (data == null)
    return true;
  const type = typeof data;
  return type === "string" || type === "number" || type === "boolean";
}
function isRef2(raw) {
  return !!raw.__v_isRef;
}
function isComputed(raw) {
  return isRef2(raw) && !!raw.effect;
}
function isReactive2(raw) {
  return !!raw.__v_isReactive;
}
function isReadOnly(raw) {
  return !!raw.__v_isReadonly;
}
var tokenMap = {
  [UNDEFINED]: "undefined",
  [NAN]: "NaN",
  [INFINITY]: "Infinity",
  [NEGATIVE_INFINITY]: "-Infinity"
};
var reversedTokenMap = Object.entries(tokenMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});
function internalStateTokenToString(value) {
  if (value === null)
    return "null";
  return typeof value === "string" && tokenMap[value] || false;
}
function replaceTokenToString(value) {
  const replaceRegex = new RegExp(`"(${Object.keys(tokenMap).join("|")})"`, "g");
  return value.replace(replaceRegex, (_, g1) => tokenMap[g1]);
}
function replaceStringToToken(value) {
  const literalValue = reversedTokenMap[value.trim()];
  if (literalValue)
    return `"${literalValue}"`;
  const replaceRegex = new RegExp(`:\\s*(${Object.keys(reversedTokenMap).join("|")})`, "g");
  return value.replace(replaceRegex, (_, g1) => `:"${reversedTokenMap[g1]}"`);
}
function getPropType(type) {
  if (Array.isArray(type))
    return type.map((t) => getPropType(t)).join(" or ");
  if (type == null)
    return "null";
  const match = type.toString().match(fnTypeRE);
  return typeof type === "function" ? match && match[1] || "any" : "any";
}
function sanitize(data) {
  if (!isPrimitive(data) && !Array.isArray(data) && !isPlainObject(data)) {
    return Object.prototype.toString.call(data);
  } else {
    return data;
  }
}
function getSetupStateType(raw) {
  try {
    return {
      ref: isRef2(raw),
      computed: isComputed(raw),
      reactive: isReactive2(raw),
      readonly: isReadOnly(raw)
    };
  } catch (e) {
    return {
      ref: false,
      computed: false,
      reactive: false,
      readonly: false
    };
  }
}
function toRaw2(value) {
  if (value == null ? void 0 : value.__v_raw)
    return value.__v_raw;
  return value;
}
function escape(s) {
  return s.replace(/[<>"&]/g, (s2) => {
    return ESC[s2] || s2;
  });
}
function mergeOptions(to, from, instance) {
  if (typeof from === "function")
    from = from.options;
  if (!from)
    return to;
  const { mixins, extends: extendsOptions } = from;
  extendsOptions && mergeOptions(to, extendsOptions, instance);
  mixins && mixins.forEach(
    (m) => mergeOptions(to, m, instance)
  );
  for (const key of ["computed", "inject"]) {
    if (Object.prototype.hasOwnProperty.call(from, key)) {
      if (!to[key])
        to[key] = from[key];
      else
        Object.assign(to[key], from[key]);
    }
  }
  return to;
}
function resolveMergedOptions(instance) {
  const raw = instance == null ? void 0 : instance.type;
  if (!raw)
    return {};
  const { mixins, extends: extendsOptions } = raw;
  const globalMixins = instance.appContext.mixins;
  if (!globalMixins.length && !mixins && !extendsOptions)
    return raw;
  const options = {};
  globalMixins.forEach((m) => mergeOptions(options, m, instance));
  mergeOptions(options, raw, instance);
  return options;
}
function processProps(instance) {
  var _a25;
  const props = [];
  const propDefinitions = (_a25 = instance == null ? void 0 : instance.type) == null ? void 0 : _a25.props;
  for (const key in instance == null ? void 0 : instance.props) {
    const propDefinition = propDefinitions ? propDefinitions[key] : null;
    const camelizeKey = camelize(key);
    props.push({
      type: "props",
      key: camelizeKey,
      value: returnError(() => instance.props[key]),
      editable: true,
      meta: propDefinition ? {
        type: propDefinition.type ? getPropType(propDefinition.type) : "any",
        required: !!propDefinition.required,
        ...propDefinition.default ? {
          default: propDefinition.default.toString()
        } : {}
      } : { type: "invalid" }
    });
  }
  return props;
}
function processState(instance) {
  const type = instance.type;
  const props = type == null ? void 0 : type.props;
  const getters = type.vuex && type.vuex.getters;
  const computedDefs = type.computed;
  const data = {
    ...instance.data,
    ...instance.renderContext
  };
  return Object.keys(data).filter((key) => !(props && key in props) && !(getters && key in getters) && !(computedDefs && key in computedDefs)).map((key) => ({
    key,
    type: "data",
    value: returnError(() => data[key]),
    editable: true
  }));
}
function getStateTypeAndName(info) {
  const stateType = info.computed ? "computed" : info.ref ? "ref" : info.reactive ? "reactive" : null;
  const stateTypeName = stateType ? `${stateType.charAt(0).toUpperCase()}${stateType.slice(1)}` : null;
  return {
    stateType,
    stateTypeName
  };
}
function processSetupState(instance) {
  const raw = instance.devtoolsRawSetupState || {};
  return Object.keys(instance.setupState).filter((key) => !vueBuiltins.has(key) && key.split(/(?=[A-Z])/)[0] !== "use").map((key) => {
    var _a25, _b25, _c, _d;
    const value = returnError(() => toRaw2(instance.setupState[key]));
    const accessError = value instanceof Error;
    const rawData = raw[key];
    let result;
    let isOtherType = accessError || typeof value === "function" || ensurePropertyExists(value, "render") && typeof value.render === "function" || ensurePropertyExists(value, "__asyncLoader") && typeof value.__asyncLoader === "function" || typeof value === "object" && value && ("setup" in value || "props" in value) || /^v[A-Z]/.test(key);
    if (rawData && !accessError) {
      const info = getSetupStateType(rawData);
      const { stateType, stateTypeName } = getStateTypeAndName(info);
      const isState = info.ref || info.computed || info.reactive;
      const raw2 = ensurePropertyExists(rawData, "effect") ? ((_b25 = (_a25 = rawData.effect) == null ? void 0 : _a25.raw) == null ? void 0 : _b25.toString()) || ((_d = (_c = rawData.effect) == null ? void 0 : _c.fn) == null ? void 0 : _d.toString()) : null;
      if (stateType)
        isOtherType = false;
      result = {
        ...stateType ? { stateType, stateTypeName } : {},
        ...raw2 ? { raw: raw2 } : {},
        editable: isState && !info.readonly
      };
    }
    const type = isOtherType ? "setup (other)" : "setup";
    return {
      key,
      value,
      type,
      // @ts-expect-error ignore
      ...result
    };
  });
}
function processComputed(instance, mergedType) {
  const type = mergedType;
  const computed = [];
  const defs = type.computed || {};
  for (const key in defs) {
    const def = defs[key];
    const type2 = typeof def === "function" && def.vuex ? "vuex bindings" : "computed";
    computed.push({
      type: type2,
      key,
      value: returnError(() => {
        var _a25;
        return (_a25 = instance == null ? void 0 : instance.proxy) == null ? void 0 : _a25[key];
      }),
      editable: typeof def.set === "function"
    });
  }
  return computed;
}
function processAttrs(instance) {
  return Object.keys(instance.attrs).map((key) => ({
    type: "attrs",
    key,
    value: returnError(() => instance.attrs[key])
  }));
}
function processProvide(instance) {
  return Reflect.ownKeys(instance.provides).map((key) => ({
    type: "provided",
    key: key.toString(),
    value: returnError(() => instance.provides[key])
  }));
}
function processInject(instance, mergedType) {
  if (!(mergedType == null ? void 0 : mergedType.inject))
    return [];
  let keys = [];
  let defaultValue;
  if (Array.isArray(mergedType.inject)) {
    keys = mergedType.inject.map((key) => ({
      key,
      originalKey: key
    }));
  } else {
    keys = Reflect.ownKeys(mergedType.inject).map((key) => {
      const value = mergedType.inject[key];
      let originalKey;
      if (typeof value === "string" || typeof value === "symbol") {
        originalKey = value;
      } else {
        originalKey = value.from;
        defaultValue = value.default;
      }
      return {
        key,
        originalKey
      };
    });
  }
  return keys.map(({ key, originalKey }) => ({
    type: "injected",
    key: originalKey && key !== originalKey ? `${originalKey.toString()} ➞ ${key.toString()}` : key.toString(),
    // eslint-disable-next-line no-prototype-builtins
    value: returnError(() => instance.ctx.hasOwnProperty(key) ? instance.ctx[key] : instance.provides.hasOwnProperty(originalKey) ? instance.provides[originalKey] : defaultValue)
  }));
}
function processRefs(instance) {
  return Object.keys(instance.refs).map((key) => ({
    type: "template refs",
    key,
    value: returnError(() => instance.refs[key])
  }));
}
function processEventListeners(instance) {
  var _a25, _b25;
  const emitsDefinition = instance.type.emits;
  const declaredEmits = Array.isArray(emitsDefinition) ? emitsDefinition : Object.keys(emitsDefinition != null ? emitsDefinition : {});
  const keys = Object.keys((_b25 = (_a25 = instance == null ? void 0 : instance.vnode) == null ? void 0 : _a25.props) != null ? _b25 : {});
  const result = [];
  for (const key of keys) {
    const [prefix, ...eventNameParts] = key.split(/(?=[A-Z])/);
    if (prefix === "on") {
      const eventName = eventNameParts.join("-").toLowerCase();
      const isDeclared = declaredEmits.includes(eventName);
      result.push({
        type: "event listeners",
        key: eventName,
        value: {
          _custom: {
            displayText: isDeclared ? "✅ Declared" : "⚠️ Not declared",
            key: isDeclared ? "✅ Declared" : "⚠️ Not declared",
            value: isDeclared ? "✅ Declared" : "⚠️ Not declared",
            tooltipText: !isDeclared ? `The event <code>${eventName}</code> is not declared in the <code>emits</code> option. It will leak into the component's attributes (<code>$attrs</code>).` : null
          }
        }
      });
    }
  }
  return result;
}
function processInstanceState(instance) {
  const mergedType = resolveMergedOptions(instance);
  return processProps(instance).concat(
    processState(instance),
    processSetupState(instance),
    processComputed(instance, mergedType),
    processAttrs(instance),
    processProvide(instance),
    processInject(instance, mergedType),
    processRefs(instance),
    processEventListeners(instance)
  );
}
function getInstanceState(params) {
  var _a25;
  const instance = getComponentInstance(activeAppRecord.value, params.instanceId);
  const id = getUniqueComponentId(instance);
  const name = getInstanceName(instance);
  const file = (_a25 = instance == null ? void 0 : instance.type) == null ? void 0 : _a25.__file;
  const state = processInstanceState(instance);
  return {
    id,
    name,
    file,
    state,
    instance
  };
}
init_esm_shims2();
init_esm_shims2();
var ComponentFilter = class {
  constructor(filter) {
    this.filter = filter || "";
  }
  /**
   * Check if an instance is qualified.
   *
   * @param {Vue|Vnode} instance
   * @return {boolean}
   */
  isQualified(instance) {
    const name = getInstanceName(instance);
    return classify(name).toLowerCase().includes(this.filter) || kebabize(name).toLowerCase().includes(this.filter);
  }
};
function createComponentFilter(filterText) {
  return new ComponentFilter(filterText);
}
var ComponentWalker = class {
  constructor(options) {
    this.captureIds = /* @__PURE__ */ new Map();
    const { filterText = "", maxDepth, recursively, api } = options;
    this.componentFilter = createComponentFilter(filterText);
    this.maxDepth = maxDepth;
    this.recursively = recursively;
    this.api = api;
  }
  getComponentTree(instance) {
    this.captureIds = /* @__PURE__ */ new Map();
    return this.findQualifiedChildren(instance, 0);
  }
  getComponentParents(instance) {
    this.captureIds = /* @__PURE__ */ new Map();
    const parents = [];
    this.captureId(instance);
    let parent = instance;
    while (parent = parent.parent) {
      this.captureId(parent);
      parents.push(parent);
    }
    return parents;
  }
  captureId(instance) {
    if (!instance)
      return null;
    const id = instance.__VUE_DEVTOOLS_NEXT_UID__ != null ? instance.__VUE_DEVTOOLS_NEXT_UID__ : getUniqueComponentId(instance);
    instance.__VUE_DEVTOOLS_NEXT_UID__ = id;
    if (this.captureIds.has(id))
      return null;
    else
      this.captureIds.set(id, void 0);
    this.mark(instance);
    return id;
  }
  /**
   * Capture the meta information of an instance. (recursive)
   *
   * @param {Vue} instance
   * @return {object}
   */
  async capture(instance, depth) {
    var _a25;
    if (!instance)
      return null;
    const id = this.captureId(instance);
    const name = getInstanceName(instance);
    const children = this.getInternalInstanceChildren(instance.subTree).filter((child) => !isBeingDestroyed(child));
    const parents = this.getComponentParents(instance) || [];
    const inactive = !!instance.isDeactivated || parents.some((parent) => parent.isDeactivated);
    const treeNode = {
      uid: instance.uid,
      id,
      name,
      renderKey: getRenderKey(instance.vnode ? instance.vnode.key : null),
      inactive,
      children: [],
      isFragment: isFragment(instance),
      tags: typeof instance.type !== "function" ? [] : [
        {
          label: "functional",
          textColor: 5592405,
          backgroundColor: 15658734
        }
      ],
      autoOpen: this.recursively,
      file: instance.type.__file || ""
    };
    if (depth < this.maxDepth || instance.type.__isKeepAlive || parents.some((parent) => parent.type.__isKeepAlive)) {
      treeNode.children = await Promise.all(children.map((child) => this.capture(child, depth + 1)).filter(Boolean));
    }
    if (this.isKeepAlive(instance)) {
      const cachedComponents = this.getKeepAliveCachedInstances(instance);
      const childrenIds = children.map((child) => child.__VUE_DEVTOOLS_NEXT_UID__);
      for (const cachedChild of cachedComponents) {
        if (!childrenIds.includes(cachedChild.__VUE_DEVTOOLS_NEXT_UID__)) {
          const node = await this.capture({ ...cachedChild, isDeactivated: true }, depth + 1);
          if (node)
            treeNode.children.push(node);
        }
      }
    }
    const rootElements = getRootElementsFromComponentInstance(instance);
    const firstElement = rootElements[0];
    if (firstElement == null ? void 0 : firstElement.parentElement) {
      const parentInstance = instance.parent;
      const parentRootElements = parentInstance ? getRootElementsFromComponentInstance(parentInstance) : [];
      let el = firstElement;
      const indexList = [];
      do {
        indexList.push(Array.from(el.parentElement.childNodes).indexOf(el));
        el = el.parentElement;
      } while (el.parentElement && parentRootElements.length && !parentRootElements.includes(el));
      treeNode.domOrder = indexList.reverse();
    } else {
      treeNode.domOrder = [-1];
    }
    if ((_a25 = instance.suspense) == null ? void 0 : _a25.suspenseKey) {
      treeNode.tags.push({
        label: instance.suspense.suspenseKey,
        backgroundColor: 14979812,
        textColor: 16777215
      });
      this.mark(instance, true);
    }
    this.api.visitComponentTree({
      treeNode,
      componentInstance: instance,
      app: instance.appContext.app,
      filter: this.componentFilter.filter
    });
    return treeNode;
  }
  /**
   * Find qualified children from a single instance.
   * If the instance itself is qualified, just return itself.
   * This is ok because [].concat works in both cases.
   *
   * @param {Vue|Vnode} instance
   * @return {Vue|Array}
   */
  async findQualifiedChildren(instance, depth) {
    var _a25;
    if (this.componentFilter.isQualified(instance) && !((_a25 = instance.type.devtools) == null ? void 0 : _a25.hide)) {
      return [await this.capture(instance, depth)];
    } else if (instance.subTree) {
      const list = this.isKeepAlive(instance) ? this.getKeepAliveCachedInstances(instance) : this.getInternalInstanceChildren(instance.subTree);
      return this.findQualifiedChildrenFromList(list, depth);
    } else {
      return [];
    }
  }
  /**
   * Iterate through an array of instances and flatten it into
   * an array of qualified instances. This is a depth-first
   * traversal - e.g. if an instance is not matched, we will
   * recursively go deeper until a qualified child is found.
   *
   * @param {Array} instances
   * @return {Array}
   */
  async findQualifiedChildrenFromList(instances, depth) {
    instances = instances.filter((child) => {
      var _a25;
      return !isBeingDestroyed(child) && !((_a25 = child.type.devtools) == null ? void 0 : _a25.hide);
    });
    if (!this.componentFilter.filter)
      return Promise.all(instances.map((child) => this.capture(child, depth)));
    else
      return Array.prototype.concat.apply([], await Promise.all(instances.map((i) => this.findQualifiedChildren(i, depth))));
  }
  /**
   * Get children from a component instance.
   */
  getInternalInstanceChildren(subTree, suspense = null) {
    const list = [];
    if (subTree) {
      if (subTree.component) {
        !suspense ? list.push(subTree.component) : list.push({ ...subTree.component, suspense });
      } else if (subTree.suspense) {
        const suspenseKey = !subTree.suspense.isInFallback ? "suspense default" : "suspense fallback";
        list.push(...this.getInternalInstanceChildren(subTree.suspense.activeBranch, { ...subTree.suspense, suspenseKey }));
      } else if (Array.isArray(subTree.children)) {
        subTree.children.forEach((childSubTree) => {
          if (childSubTree.component)
            !suspense ? list.push(childSubTree.component) : list.push({ ...childSubTree.component, suspense });
          else
            list.push(...this.getInternalInstanceChildren(childSubTree, suspense));
        });
      }
    }
    return list.filter((child) => {
      var _a25;
      return !isBeingDestroyed(child) && !((_a25 = child.type.devtools) == null ? void 0 : _a25.hide);
    });
  }
  /**
   * Mark an instance as captured and store it in the instance map.
   *
   * @param {Vue} instance
   */
  mark(instance, force = false) {
    const instanceMap = getAppRecord(instance).instanceMap;
    if (force || !instanceMap.has(instance.__VUE_DEVTOOLS_NEXT_UID__)) {
      instanceMap.set(instance.__VUE_DEVTOOLS_NEXT_UID__, instance);
      activeAppRecord.value.instanceMap = instanceMap;
    }
  }
  isKeepAlive(instance) {
    return instance.type.__isKeepAlive && instance.__v_cache;
  }
  getKeepAliveCachedInstances(instance) {
    return Array.from(instance.__v_cache.values()).map((vnode) => vnode.component).filter(Boolean);
  }
};
init_esm_shims2();
init_esm_shims2();
var markEndQueue = /* @__PURE__ */ new Map();
var PERFORMANCE_EVENT_LAYER_ID = "performance";
async function performanceMarkStart(api, app, uid, vm, type, time) {
  const appRecord = await getAppRecord(app);
  if (!appRecord) {
    return;
  }
  const componentName = getInstanceName(vm) || "Unknown Component";
  const groupId = devtoolsState.perfUniqueGroupId++;
  const groupKey = `${uid}-${type}`;
  appRecord.perfGroupIds.set(groupKey, { groupId, time });
  await api.addTimelineEvent({
    layerId: PERFORMANCE_EVENT_LAYER_ID,
    event: {
      time: Date.now(),
      data: {
        component: componentName,
        type,
        measure: "start"
      },
      title: componentName,
      subtitle: type,
      groupId
    }
  });
  if (markEndQueue.has(groupKey)) {
    const {
      app: app2,
      uid: uid2,
      instance,
      type: type2,
      time: time2
    } = markEndQueue.get(groupKey);
    markEndQueue.delete(groupKey);
    await performanceMarkEnd(
      api,
      app2,
      uid2,
      instance,
      type2,
      time2
    );
  }
}
function performanceMarkEnd(api, app, uid, vm, type, time) {
  const appRecord = getAppRecord(app);
  if (!appRecord)
    return;
  const componentName = getInstanceName(vm) || "Unknown Component";
  const groupKey = `${uid}-${type}`;
  const groupInfo = appRecord.perfGroupIds.get(groupKey);
  if (groupInfo) {
    const groupId = groupInfo.groupId;
    const startTime = groupInfo.time;
    const duration = time - startTime;
    api.addTimelineEvent({
      layerId: PERFORMANCE_EVENT_LAYER_ID,
      event: {
        time: Date.now(),
        data: {
          component: componentName,
          type,
          measure: "end",
          duration: {
            _custom: {
              type: "Duration",
              value: duration,
              display: `${duration} ms`
            }
          }
        },
        title: componentName,
        subtitle: type,
        groupId
      }
    });
  } else {
    markEndQueue.set(groupKey, { app, uid, instance: vm, type, time });
  }
}
var COMPONENT_EVENT_LAYER_ID = "component-event";
function setupBuiltinTimelineLayers(api) {
  if (!isBrowser)
    return;
  api.addTimelineLayer({
    id: "mouse",
    label: "Mouse",
    color: 10768815
  });
  ["mousedown", "mouseup", "click", "dblclick"].forEach((eventType) => {
    if (!devtoolsState.timelineLayersState.recordingState || !devtoolsState.timelineLayersState.mouseEventEnabled)
      return;
    window.addEventListener(eventType, async (event) => {
      await api.addTimelineEvent({
        layerId: "mouse",
        event: {
          time: Date.now(),
          data: {
            type: eventType,
            x: event.clientX,
            y: event.clientY
          },
          title: eventType
        }
      });
    }, {
      capture: true,
      passive: true
    });
  });
  api.addTimelineLayer({
    id: "keyboard",
    label: "Keyboard",
    color: 8475055
  });
  ["keyup", "keydown", "keypress"].forEach((eventType) => {
    window.addEventListener(eventType, async (event) => {
      if (!devtoolsState.timelineLayersState.recordingState || !devtoolsState.timelineLayersState.keyboardEventEnabled)
        return;
      await api.addTimelineEvent({
        layerId: "keyboard",
        event: {
          time: Date.now(),
          data: {
            type: eventType,
            key: event.key,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey
          },
          title: event.key
        }
      });
    }, {
      capture: true,
      passive: true
    });
  });
  api.addTimelineLayer({
    id: COMPONENT_EVENT_LAYER_ID,
    label: "Component events",
    color: 5226637
  });
  hook.on.componentEmit(async (app, instance, event, params) => {
    if (!devtoolsState.timelineLayersState.recordingState || !devtoolsState.timelineLayersState.componentEventEnabled)
      return;
    const appRecord = await getAppRecord(app);
    if (!appRecord)
      return;
    const componentId = `${appRecord.id}:${instance.uid}`;
    const componentName = getInstanceName(instance) || "Unknown Component";
    api.addTimelineEvent({
      layerId: COMPONENT_EVENT_LAYER_ID,
      event: {
        time: Date.now(),
        data: {
          component: {
            _custom: {
              type: "component-definition",
              display: componentName
            }
          },
          event,
          params
        },
        title: event,
        subtitle: `by ${componentName}`,
        meta: {
          componentId
        }
      }
    });
  });
  api.addTimelineLayer({
    id: "performance",
    label: PERFORMANCE_EVENT_LAYER_ID,
    color: 4307050
  });
  hook.on.perfStart((app, uid, vm, type, time) => {
    if (!devtoolsState.timelineLayersState.recordingState || !devtoolsState.timelineLayersState.performanceEventEnabled)
      return;
    performanceMarkStart(api, app, uid, vm, type, time);
  });
  hook.on.perfEnd((app, uid, vm, type, time) => {
    if (!devtoolsState.timelineLayersState.recordingState || !devtoolsState.timelineLayersState.performanceEventEnabled)
      return;
    performanceMarkEnd(api, app, uid, vm, type, time);
  });
}
init_esm_shims2();
var MAX_$VM = 10;
var $vmQueue = [];
function exposeInstanceToWindow(componentInstance) {
  if (typeof window === "undefined")
    return;
  const win = window;
  if (!componentInstance)
    return;
  win.$vm = componentInstance;
  if ($vmQueue[0] !== componentInstance) {
    if ($vmQueue.length >= MAX_$VM) {
      $vmQueue.pop();
    }
    for (let i = $vmQueue.length; i > 0; i--) {
      win[`$vm${i}`] = $vmQueue[i] = $vmQueue[i - 1];
    }
    win.$vm0 = $vmQueue[0] = componentInstance;
  }
}
var INSPECTOR_ID = "components";
function createComponentsDevToolsPlugin(app) {
  const descriptor = {
    id: INSPECTOR_ID,
    label: "Components",
    app
  };
  const setupFn = (api) => {
    api.addInspector({
      id: INSPECTOR_ID,
      label: "Components",
      treeFilterPlaceholder: "Search components"
    });
    setupBuiltinTimelineLayers(api);
    api.on.getInspectorTree(async (payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const instance = getComponentInstance(activeAppRecord.value, payload.instanceId);
        if (instance) {
          const walker2 = new ComponentWalker({
            filterText: payload.filter,
            // @TODO: should make this configurable?
            maxDepth: 100,
            recursively: false,
            api
          });
          payload.rootNodes = await walker2.getComponentTree(instance);
        }
      }
    });
    api.on.getInspectorState(async (payload) => {
      var _a25;
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const result = getInstanceState({
          instanceId: payload.nodeId
        });
        const componentInstance = result.instance;
        const app2 = (_a25 = result.instance) == null ? void 0 : _a25.appContext.app;
        const _payload = {
          componentInstance,
          app: app2,
          instanceData: result
        };
        devtoolsContext.hooks.callHookWith(
          (callbacks) => {
            callbacks.forEach((cb) => cb(_payload));
          },
          "inspectComponent"
          /* INSPECT_COMPONENT */
        );
        payload.state = result;
        exposeInstanceToWindow(componentInstance);
      }
    });
    api.on.editInspectorState(async (payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        editState(payload);
        await api.sendInspectorState("components");
      }
    });
    const debounceSendInspectorTree = debounce(() => {
      api.sendInspectorTree(INSPECTOR_ID);
    }, 120);
    const debounceSendInspectorState = debounce(() => {
      api.sendInspectorState(INSPECTOR_ID);
    }, 120);
    const componentAddedCleanup = hook.on.componentAdded(async (app2, uid, parentUid, component) => {
      var _a25, _b25, _c;
      if (devtoolsState.highPerfModeEnabled)
        return;
      if ((_c = (_b25 = (_a25 = app2 == null ? void 0 : app2._instance) == null ? void 0 : _a25.type) == null ? void 0 : _b25.devtools) == null ? void 0 : _c.hide)
        return;
      if (!app2 || typeof uid !== "number" && !uid || !component)
        return;
      const id = await getComponentId({
        app: app2,
        uid,
        instance: component
      });
      const appRecord = await getAppRecord(app2);
      if (component) {
        if (component.__VUE_DEVTOOLS_NEXT_UID__ == null)
          component.__VUE_DEVTOOLS_NEXT_UID__ = id;
        if (!(appRecord == null ? void 0 : appRecord.instanceMap.has(id))) {
          appRecord == null ? void 0 : appRecord.instanceMap.set(id, component);
          if (activeAppRecord.value.id === (appRecord == null ? void 0 : appRecord.id))
            activeAppRecord.value.instanceMap = appRecord.instanceMap;
        }
      }
      if (!appRecord)
        return;
      debounceSendInspectorTree();
    });
    const componentUpdatedCleanup = hook.on.componentUpdated(async (app2, uid, parentUid, component) => {
      var _a25, _b25, _c;
      if (devtoolsState.highPerfModeEnabled)
        return;
      if ((_c = (_b25 = (_a25 = app2 == null ? void 0 : app2._instance) == null ? void 0 : _a25.type) == null ? void 0 : _b25.devtools) == null ? void 0 : _c.hide)
        return;
      if (!app2 || typeof uid !== "number" && !uid || !component)
        return;
      const id = await getComponentId({
        app: app2,
        uid,
        instance: component
      });
      const appRecord = await getAppRecord(app2);
      if (component) {
        if (component.__VUE_DEVTOOLS_NEXT_UID__ == null)
          component.__VUE_DEVTOOLS_NEXT_UID__ = id;
        if (!(appRecord == null ? void 0 : appRecord.instanceMap.has(id))) {
          appRecord == null ? void 0 : appRecord.instanceMap.set(id, component);
          if (activeAppRecord.value.id === (appRecord == null ? void 0 : appRecord.id))
            activeAppRecord.value.instanceMap = appRecord.instanceMap;
        }
      }
      if (!appRecord)
        return;
      debounceSendInspectorTree();
      debounceSendInspectorState();
    });
    const componentRemovedCleanup = hook.on.componentRemoved(async (app2, uid, parentUid, component) => {
      var _a25, _b25, _c;
      if (devtoolsState.highPerfModeEnabled)
        return;
      if ((_c = (_b25 = (_a25 = app2 == null ? void 0 : app2._instance) == null ? void 0 : _a25.type) == null ? void 0 : _b25.devtools) == null ? void 0 : _c.hide)
        return;
      if (!app2 || typeof uid !== "number" && !uid || !component)
        return;
      const appRecord = await getAppRecord(app2);
      if (!appRecord)
        return;
      const id = await getComponentId({
        app: app2,
        uid,
        instance: component
      });
      appRecord == null ? void 0 : appRecord.instanceMap.delete(id);
      if (activeAppRecord.value.id === (appRecord == null ? void 0 : appRecord.id))
        activeAppRecord.value.instanceMap = appRecord.instanceMap;
      debounceSendInspectorTree();
    });
  };
  return [descriptor, setupFn];
}
var _a12;
var _b12;
(_b12 = (_a12 = target).__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__) != null ? _b12 : _a12.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__ = /* @__PURE__ */ new Set();
function setupDevToolsPlugin(pluginDescriptor, setupFn) {
  return hook.setupDevToolsPlugin(pluginDescriptor, setupFn);
}
function callDevToolsPluginSetupFn(plugin, app) {
  const [pluginDescriptor, setupFn] = plugin;
  if (pluginDescriptor.app !== app)
    return;
  const api = new DevToolsPluginAPI({
    plugin: {
      setupFn,
      descriptor: pluginDescriptor
    },
    ctx: devtoolsContext
  });
  if (pluginDescriptor.packageName === "vuex") {
    api.on.editInspectorState((payload) => {
      api.sendInspectorState(payload.inspectorId);
    });
  }
  setupFn(api);
}
function removeRegisteredPluginApp(app) {
  target.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.delete(app);
}
function registerDevToolsPlugin(app, options) {
  if (target.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.has(app)) {
    return;
  }
  if (devtoolsState.highPerfModeEnabled && !(options == null ? void 0 : options.inspectingComponent)) {
    return;
  }
  target.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.add(app);
  devtoolsPluginBuffer.forEach((plugin) => {
    callDevToolsPluginSetupFn(plugin, app);
  });
}
init_esm_shims2();
init_esm_shims2();
var ROUTER_KEY = "__VUE_DEVTOOLS_ROUTER__";
var ROUTER_INFO_KEY = "__VUE_DEVTOOLS_ROUTER_INFO__";
var _a13;
var _b13;
(_b13 = (_a13 = target)[ROUTER_INFO_KEY]) != null ? _b13 : _a13[ROUTER_INFO_KEY] = {
  currentRoute: null,
  routes: []
};
var _a14;
var _b14;
(_b14 = (_a14 = target)[ROUTER_KEY]) != null ? _b14 : _a14[ROUTER_KEY] = {};
var devtoolsRouterInfo = new Proxy(target[ROUTER_INFO_KEY], {
  get(target22, property) {
    return target[ROUTER_INFO_KEY][property];
  }
});
var devtoolsRouter = new Proxy(target[ROUTER_KEY], {
  get(target22, property) {
    if (property === "value") {
      return target[ROUTER_KEY];
    }
  }
});
function getRoutes(router) {
  const routesMap = /* @__PURE__ */ new Map();
  return ((router == null ? void 0 : router.getRoutes()) || []).filter((i) => !routesMap.has(i.path) && routesMap.set(i.path, 1));
}
function filterRoutes(routes) {
  return routes.map((item) => {
    let { path, name, children, meta } = item;
    if (children == null ? void 0 : children.length)
      children = filterRoutes(children);
    return {
      path,
      name,
      children,
      meta
    };
  });
}
function filterCurrentRoute(route) {
  if (route) {
    const { fullPath, hash, href, path, name, matched, params, query } = route;
    return {
      fullPath,
      hash,
      href,
      path,
      name,
      params,
      query,
      matched: filterRoutes(matched)
    };
  }
  return route;
}
function normalizeRouterInfo(appRecord, activeAppRecord2) {
  function init() {
    var _a25;
    const router = (_a25 = appRecord.app) == null ? void 0 : _a25.config.globalProperties.$router;
    const currentRoute = filterCurrentRoute(router == null ? void 0 : router.currentRoute.value);
    const routes = filterRoutes(getRoutes(router));
    const c = console.warn;
    console.warn = () => {
    };
    target[ROUTER_INFO_KEY] = {
      currentRoute: currentRoute ? deepClone(currentRoute) : {},
      routes: deepClone(routes)
    };
    target[ROUTER_KEY] = router;
    console.warn = c;
  }
  init();
  hook.on.componentUpdated(debounce(() => {
    var _a25;
    if (((_a25 = activeAppRecord2.value) == null ? void 0 : _a25.app) !== appRecord.app)
      return;
    init();
    if (devtoolsState.highPerfModeEnabled)
      return;
    devtoolsContext.hooks.callHook("routerInfoUpdated", { state: target[ROUTER_INFO_KEY] });
  }, 200));
}
function createDevToolsApi(hooks2) {
  return {
    // get inspector tree
    async getInspectorTree(payload) {
      const _payload = {
        ...payload,
        app: activeAppRecord.value.app,
        rootNodes: []
      };
      await new Promise((resolve) => {
        hooks2.callHookWith(
          async (callbacks) => {
            await Promise.all(callbacks.map((cb) => cb(_payload)));
            resolve();
          },
          "getInspectorTree"
          /* GET_INSPECTOR_TREE */
        );
      });
      return _payload.rootNodes;
    },
    // get inspector state
    async getInspectorState(payload) {
      const _payload = {
        ...payload,
        app: activeAppRecord.value.app,
        state: null
      };
      const ctx = {
        currentTab: `custom-inspector:${payload.inspectorId}`
      };
      await new Promise((resolve) => {
        hooks2.callHookWith(
          async (callbacks) => {
            await Promise.all(callbacks.map((cb) => cb(_payload, ctx)));
            resolve();
          },
          "getInspectorState"
          /* GET_INSPECTOR_STATE */
        );
      });
      return _payload.state;
    },
    // edit inspector state
    editInspectorState(payload) {
      const stateEditor2 = new StateEditor();
      const _payload = {
        ...payload,
        app: activeAppRecord.value.app,
        set: (obj, path = payload.path, value = payload.state.value, cb) => {
          stateEditor2.set(obj, path, value, cb || stateEditor2.createDefaultSetCallback(payload.state));
        }
      };
      hooks2.callHookWith(
        (callbacks) => {
          callbacks.forEach((cb) => cb(_payload));
        },
        "editInspectorState"
        /* EDIT_INSPECTOR_STATE */
      );
    },
    // send inspector state
    sendInspectorState(inspectorId) {
      const inspector = getInspector(inspectorId);
      hooks2.callHook("sendInspectorState", { inspectorId, plugin: {
        descriptor: inspector.descriptor,
        setupFn: () => ({})
      } });
    },
    // inspect component inspector
    inspectComponentInspector() {
      return inspectComponentHighLighter();
    },
    // cancel inspect component inspector
    cancelInspectComponentInspector() {
      return cancelInspectComponentHighLighter();
    },
    // get component render code
    getComponentRenderCode(id) {
      const instance = getComponentInstance(activeAppRecord.value, id);
      if (instance)
        return !(typeof (instance == null ? void 0 : instance.type) === "function") ? instance.render.toString() : instance.type.toString();
    },
    // scroll to component
    scrollToComponent(id) {
      return scrollToComponent({ id });
    },
    // open in editor
    openInEditor,
    // get vue inspector
    getVueInspector: getComponentInspector,
    // toggle app
    toggleApp(id, options) {
      const appRecord = devtoolsAppRecords.value.find((record) => record.id === id);
      if (appRecord) {
        setActiveAppRecordId(id);
        setActiveAppRecord(appRecord);
        normalizeRouterInfo(appRecord, activeAppRecord);
        callInspectorUpdatedHook();
        registerDevToolsPlugin(appRecord.app, options);
      }
    },
    // inspect dom
    inspectDOM(instanceId) {
      const instance = getComponentInstance(activeAppRecord.value, instanceId);
      if (instance) {
        const [el] = getRootElementsFromComponentInstance(instance);
        if (el) {
          target.__VUE_DEVTOOLS_INSPECT_DOM_TARGET__ = el;
        }
      }
    },
    updatePluginSettings(pluginId, key, value) {
      setPluginSettings(pluginId, key, value);
    },
    getPluginSettings(pluginId) {
      return {
        options: getPluginSettingsOptions(pluginId),
        values: getPluginSettings(pluginId)
      };
    }
  };
}
init_esm_shims2();
var _a15;
var _b15;
(_b15 = (_a15 = target).__VUE_DEVTOOLS_ENV__) != null ? _b15 : _a15.__VUE_DEVTOOLS_ENV__ = {
  vitePluginDetected: false
};
function getDevToolsEnv() {
  return target.__VUE_DEVTOOLS_ENV__;
}
function setDevToolsEnv(env) {
  target.__VUE_DEVTOOLS_ENV__ = {
    ...target.__VUE_DEVTOOLS_ENV__,
    ...env
  };
}
var hooks = createDevToolsCtxHooks();
var _a16;
var _b16;
(_b16 = (_a16 = target).__VUE_DEVTOOLS_KIT_CONTEXT__) != null ? _b16 : _a16.__VUE_DEVTOOLS_KIT_CONTEXT__ = {
  hooks,
  get state() {
    return {
      ...devtoolsState,
      activeAppRecordId: activeAppRecord.id,
      activeAppRecord: activeAppRecord.value,
      appRecords: devtoolsAppRecords.value
    };
  },
  api: createDevToolsApi(hooks)
};
var devtoolsContext = target.__VUE_DEVTOOLS_KIT_CONTEXT__;
init_esm_shims2();
var import_speakingurl = __toESM2(require_speakingurl2(), 1);
var _a17;
var _b17;
var appRecordInfo = (_b17 = (_a17 = target).__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__) != null ? _b17 : _a17.__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__ = {
  id: 0,
  appIds: /* @__PURE__ */ new Set()
};
function getAppRecordName(app, fallbackName) {
  var _a25;
  return ((_a25 = app == null ? void 0 : app._component) == null ? void 0 : _a25.name) || `App ${fallbackName}`;
}
function getAppRootInstance(app) {
  var _a25, _b25, _c, _d;
  if (app._instance)
    return app._instance;
  else if ((_b25 = (_a25 = app._container) == null ? void 0 : _a25._vnode) == null ? void 0 : _b25.component)
    return (_d = (_c = app._container) == null ? void 0 : _c._vnode) == null ? void 0 : _d.component;
}
function removeAppRecordId(app) {
  const id = app.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__;
  if (id != null) {
    appRecordInfo.appIds.delete(id);
    appRecordInfo.id--;
  }
}
function getAppRecordId(app, defaultId) {
  if (app.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__ != null)
    return app.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__;
  let id = defaultId != null ? defaultId : (appRecordInfo.id++).toString();
  if (defaultId && appRecordInfo.appIds.has(id)) {
    let count = 1;
    while (appRecordInfo.appIds.has(`${defaultId}_${count}`))
      count++;
    id = `${defaultId}_${count}`;
  }
  appRecordInfo.appIds.add(id);
  app.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__ = id;
  return id;
}
function createAppRecord(app, types) {
  var _a25, _b25;
  const rootInstance = getAppRootInstance(app);
  if (rootInstance) {
    appRecordInfo.id++;
    const name = getAppRecordName(app, appRecordInfo.id.toString());
    const id = getAppRecordId(app, (0, import_speakingurl.default)(name));
    const [el] = getRootElementsFromComponentInstance(rootInstance);
    const record = {
      id,
      name,
      types,
      instanceMap: /* @__PURE__ */ new Map(),
      perfGroupIds: /* @__PURE__ */ new Map(),
      rootInstance,
      iframe: isBrowser && document !== (el == null ? void 0 : el.ownerDocument) ? (_b25 = (_a25 = el == null ? void 0 : el.ownerDocument) == null ? void 0 : _a25.location) == null ? void 0 : _b25.pathname : void 0
    };
    app.__VUE_DEVTOOLS_NEXT_APP_RECORD__ = record;
    const rootId = `${record.id}:root`;
    record.instanceMap.set(rootId, record.rootInstance);
    record.rootInstance.__VUE_DEVTOOLS_NEXT_UID__ = rootId;
    return record;
  } else {
    return {};
  }
}
init_esm_shims2();
function detectIframeApp(target22, inIframe = false) {
  if (inIframe) {
    let sendEventToParent2 = function(cb) {
      try {
        const hook3 = window.parent.__VUE_DEVTOOLS_GLOBAL_HOOK__;
        if (hook3) {
          cb(hook3);
        }
      } catch (e) {
      }
    };
    var sendEventToParent = sendEventToParent2;
    const hook2 = {
      id: "vue-devtools-next",
      devtoolsVersion: "7.0",
      on: (event, cb) => {
        sendEventToParent2((hook3) => {
          hook3.on(event, cb);
        });
      },
      once: (event, cb) => {
        sendEventToParent2((hook3) => {
          hook3.once(event, cb);
        });
      },
      off: (event, cb) => {
        sendEventToParent2((hook3) => {
          hook3.off(event, cb);
        });
      },
      emit: (event, ...payload) => {
        sendEventToParent2((hook3) => {
          hook3.emit(event, ...payload);
        });
      }
    };
    Object.defineProperty(target22, "__VUE_DEVTOOLS_GLOBAL_HOOK__", {
      get() {
        return hook2;
      },
      configurable: true
    });
  }
  function injectVueHookToIframe(iframe) {
    if (iframe.__vdevtools__injected) {
      return;
    }
    try {
      iframe.__vdevtools__injected = true;
      const inject = () => {
        try {
          iframe.contentWindow.__VUE_DEVTOOLS_IFRAME__ = iframe;
          const script = iframe.contentDocument.createElement("script");
          script.textContent = `;(${detectIframeApp.toString()})(window, true)`;
          iframe.contentDocument.documentElement.appendChild(script);
          script.parentNode.removeChild(script);
        } catch (e) {
        }
      };
      inject();
      iframe.addEventListener("load", () => inject());
    } catch (e) {
    }
  }
  function injectVueHookToIframes() {
    if (typeof window === "undefined") {
      return;
    }
    const iframes = Array.from(document.querySelectorAll("iframe:not([data-vue-devtools-ignore])"));
    for (const iframe of iframes) {
      injectVueHookToIframe(iframe);
    }
  }
  injectVueHookToIframes();
  let iframeAppChecks = 0;
  const iframeAppCheckTimer = setInterval(() => {
    injectVueHookToIframes();
    iframeAppChecks++;
    if (iframeAppChecks >= 5) {
      clearInterval(iframeAppCheckTimer);
    }
  }, 1e3);
}
function initDevTools() {
  var _a25;
  detectIframeApp(target);
  updateDevToolsState({
    vitePluginDetected: getDevToolsEnv().vitePluginDetected
  });
  const isDevToolsNext = ((_a25 = target.__VUE_DEVTOOLS_GLOBAL_HOOK__) == null ? void 0 : _a25.id) === "vue-devtools-next";
  if (target.__VUE_DEVTOOLS_GLOBAL_HOOK__ && isDevToolsNext)
    return;
  const _devtoolsHook = createDevToolsHook();
  if (target.__VUE_DEVTOOLS_HOOK_REPLAY__) {
    try {
      target.__VUE_DEVTOOLS_HOOK_REPLAY__.forEach((cb) => cb(_devtoolsHook));
      target.__VUE_DEVTOOLS_HOOK_REPLAY__ = [];
    } catch (e) {
      console.error("[vue-devtools] Error during hook replay", e);
    }
  }
  _devtoolsHook.once("init", (Vue) => {
    target.__VUE_DEVTOOLS_VUE2_APP_DETECTED__ = true;
    console.log("%c[_____Vue DevTools v7 log_____]", "color: red; font-bold: 600; font-size: 16px;");
    console.log("%cVue DevTools v7 detected in your Vue2 project. v7 only supports Vue3 and will not work.", "font-bold: 500; font-size: 14px;");
    const legacyChromeUrl = "https://chromewebstore.google.com/detail/vuejs-devtools/iaajmlceplecbljialhhkmedjlpdblhp";
    const legacyFirefoxUrl = "https://addons.mozilla.org/firefox/addon/vue-js-devtools-v6-legacy";
    console.log(`%cThe legacy version of chrome extension that supports both Vue 2 and Vue 3 has been moved to %c ${legacyChromeUrl}`, "font-size: 14px;", "text-decoration: underline; cursor: pointer;font-size: 14px;");
    console.log(`%cThe legacy version of firefox extension that supports both Vue 2 and Vue 3 has been moved to %c ${legacyFirefoxUrl}`, "font-size: 14px;", "text-decoration: underline; cursor: pointer;font-size: 14px;");
    console.log("%cPlease install and enable only the legacy version for your Vue2 app.", "font-bold: 500; font-size: 14px;");
    console.log("%c[_____Vue DevTools v7 log_____]", "color: red; font-bold: 600; font-size: 16px;");
  });
  hook.on.setupDevtoolsPlugin((pluginDescriptor, setupFn) => {
    var _a26;
    addDevToolsPluginToBuffer(pluginDescriptor, setupFn);
    const { app } = (_a26 = activeAppRecord) != null ? _a26 : {};
    if (pluginDescriptor.settings) {
      initPluginSettings(pluginDescriptor.id, pluginDescriptor.settings);
    }
    if (!app)
      return;
    callDevToolsPluginSetupFn([pluginDescriptor, setupFn], app);
  });
  onLegacyDevToolsPluginApiAvailable(() => {
    const normalizedPluginBuffer = devtoolsPluginBuffer.filter(([item]) => item.id !== "components");
    normalizedPluginBuffer.forEach(([pluginDescriptor, setupFn]) => {
      _devtoolsHook.emit("devtools-plugin:setup", pluginDescriptor, setupFn, { target: "legacy" });
    });
  });
  hook.on.vueAppInit(async (app, version, types) => {
    const appRecord = createAppRecord(app, types);
    const normalizedAppRecord = {
      ...appRecord,
      app,
      version
    };
    addDevToolsAppRecord(normalizedAppRecord);
    if (devtoolsAppRecords.value.length === 1) {
      setActiveAppRecord(normalizedAppRecord);
      setActiveAppRecordId(normalizedAppRecord.id);
      normalizeRouterInfo(normalizedAppRecord, activeAppRecord);
      registerDevToolsPlugin(normalizedAppRecord.app);
    }
    setupDevToolsPlugin(...createComponentsDevToolsPlugin(normalizedAppRecord.app));
    updateDevToolsState({
      connected: true
    });
    _devtoolsHook.apps.push(app);
  });
  hook.on.vueAppUnmount(async (app) => {
    const activeRecords = devtoolsAppRecords.value.filter((appRecord) => appRecord.app !== app);
    if (activeRecords.length === 0) {
      updateDevToolsState({
        connected: false
      });
    }
    removeDevToolsAppRecord(app);
    removeAppRecordId(app);
    if (activeAppRecord.value.app === app) {
      setActiveAppRecord(activeRecords[0]);
      devtoolsContext.hooks.callHook(
        "sendActiveAppUpdatedToClient"
        /* SEND_ACTIVE_APP_UNMOUNTED_TO_CLIENT */
      );
    }
    target.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps.splice(target.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps.indexOf(app), 1);
    removeRegisteredPluginApp(app);
  });
  subscribeDevToolsHook(_devtoolsHook);
  if (!target.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    Object.defineProperty(target, "__VUE_DEVTOOLS_GLOBAL_HOOK__", {
      get() {
        return _devtoolsHook;
      },
      configurable: true
    });
  } else {
    if (!isNuxtApp) {
      Object.assign(__VUE_DEVTOOLS_GLOBAL_HOOK__, _devtoolsHook);
    }
  }
}
function onDevToolsClientConnected(fn) {
  return new Promise((resolve) => {
    if (devtoolsState.connected && devtoolsState.clientConnected) {
      fn();
      resolve();
      return;
    }
    devtoolsContext.hooks.hook("devtoolsConnectedUpdated", ({ state }) => {
      if (state.connected && state.clientConnected) {
        fn();
        resolve();
      }
    });
  });
}
init_esm_shims2();
function toggleHighPerfMode(state) {
  devtoolsState.highPerfModeEnabled = state != null ? state : !devtoolsState.highPerfModeEnabled;
  if (!state && activeAppRecord.value) {
    registerDevToolsPlugin(activeAppRecord.value.app);
  }
}
init_esm_shims2();
init_esm_shims2();
function reviveSet(val) {
  const result = /* @__PURE__ */ new Set();
  const list = val._custom.value;
  for (let i = 0; i < list.length; i++) {
    const value = list[i];
    result.add(revive(value));
  }
  return result;
}
function reviveMap(val) {
  const result = /* @__PURE__ */ new Map();
  const list = val._custom.value;
  for (let i = 0; i < list.length; i++) {
    const { key, value } = list[i];
    result.set(key, revive(value));
  }
  return result;
}
function revive(val) {
  if (val === UNDEFINED) {
    return void 0;
  } else if (val === INFINITY) {
    return Number.POSITIVE_INFINITY;
  } else if (val === NEGATIVE_INFINITY) {
    return Number.NEGATIVE_INFINITY;
  } else if (val === NAN) {
    return Number.NaN;
  } else if (val && val._custom) {
    const { _custom: custom } = val;
    if (custom.type === "component")
      return activeAppRecord.value.instanceMap.get(custom.id);
    else if (custom.type === "map")
      return reviveMap(val);
    else if (custom.type === "set")
      return reviveSet(val);
    else if (custom.type === "bigint")
      return BigInt(custom.value);
    else
      return revive(custom.value);
  } else if (symbolRE.test(val)) {
    const [, string] = symbolRE.exec(val);
    return Symbol.for(string);
  } else if (specialTypeRE.test(val)) {
    const [, type, string, , details] = specialTypeRE.exec(val);
    const result = new target[type](string);
    if (type === "Error" && details)
      result.stack = details;
    return result;
  } else {
    return val;
  }
}
function reviver(key, value) {
  return revive(value);
}
function getInspectorStateValueType(value, raw = true) {
  const type = typeof value;
  if (value == null || value === UNDEFINED || value === "undefined") {
    return "null";
  } else if (type === "boolean" || type === "number" || value === INFINITY || value === NEGATIVE_INFINITY || value === NAN) {
    return "literal";
  } else if (value == null ? void 0 : value._custom) {
    if (raw || value._custom.display != null || value._custom.displayText != null)
      return "custom";
    else
      return getInspectorStateValueType(value._custom.value);
  } else if (typeof value === "string") {
    const typeMatch = specialTypeRE.exec(value);
    if (typeMatch) {
      const [, type2] = typeMatch;
      return `native ${type2}`;
    } else {
      return "string";
    }
  } else if (Array.isArray(value) || (value == null ? void 0 : value._isArray)) {
    return "array";
  } else if (isPlainObject(value)) {
    return "plain-object";
  } else {
    return "unknown";
  }
}
function formatInspectorStateValue(value, quotes = false, options) {
  var _a25, _b25, _c;
  const { customClass } = options != null ? options : {};
  let result;
  const type = getInspectorStateValueType(value, false);
  if (type !== "custom" && (value == null ? void 0 : value._custom))
    value = value._custom.value;
  if (result = internalStateTokenToString(value)) {
    return result;
  } else if (type === "custom") {
    const nestedName = ((_a25 = value._custom.value) == null ? void 0 : _a25._custom) && formatInspectorStateValue(value._custom.value, quotes, options);
    return nestedName || value._custom.displayText || value._custom.display;
  } else if (type === "array") {
    return `Array[${value.length}]`;
  } else if (type === "plain-object") {
    return `Object${Object.keys(value).length ? "" : " (empty)"}`;
  } else if (type == null ? void 0 : type.includes("native")) {
    return escape((_b25 = specialTypeRE.exec(value)) == null ? void 0 : _b25[2]);
  } else if (typeof value === "string") {
    const typeMatch = value.match(rawTypeRE);
    if (typeMatch) {
      value = escapeString(typeMatch[1]);
    } else if (quotes) {
      value = `<span>"</span>${(customClass == null ? void 0 : customClass.string) ? `<span class=${customClass.string}>${escapeString(value)}</span>` : escapeString(value)}<span>"</span>`;
    } else {
      value = (customClass == null ? void 0 : customClass.string) ? `<span class="${(_c = customClass == null ? void 0 : customClass.string) != null ? _c : ""}">${escapeString(value)}</span>` : escapeString(value);
    }
  }
  return value;
}
function escapeString(value) {
  return escape(value).replace(/ /g, "&nbsp;").replace(/\n/g, "<span>\\n</span>");
}
function getRaw(value) {
  var _a25, _b25, _c;
  let customType;
  const isCustom = getInspectorStateValueType(value) === "custom";
  let inherit = {};
  if (isCustom) {
    const data = value;
    const customValue = (_a25 = data._custom) == null ? void 0 : _a25.value;
    const currentCustomType = (_b25 = data._custom) == null ? void 0 : _b25.type;
    const nestedCustom = typeof customValue === "object" && customValue !== null && "_custom" in customValue ? getRaw(customValue) : { inherit: void 0, value: void 0, customType: void 0 };
    inherit = nestedCustom.inherit || ((_c = data._custom) == null ? void 0 : _c.fields) || {};
    value = nestedCustom.value || customValue;
    customType = nestedCustom.customType || currentCustomType;
  }
  if (value && value._isArray)
    value = value.items;
  return { value, inherit, customType };
}
function toEdit(value, customType) {
  if (customType === "bigint")
    return value;
  if (customType === "date")
    return value;
  return replaceTokenToString(JSON.stringify(value));
}
function toSubmit(value, customType) {
  if (customType === "bigint")
    return BigInt(value);
  if (customType === "date")
    return new Date(value);
  return JSON.parse(replaceStringToToken(value), reviver);
}
init_esm_shims2();
function updateDevToolsClientDetected(params) {
  devtoolsState.devtoolsClientDetected = {
    ...devtoolsState.devtoolsClientDetected,
    ...params
  };
  const devtoolsClientVisible = Object.values(devtoolsState.devtoolsClientDetected).some(Boolean);
  toggleHighPerfMode(!devtoolsClientVisible);
}
var _a18;
var _b18;
(_b18 = (_a18 = target).__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__) != null ? _b18 : _a18.__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__ = updateDevToolsClientDetected;
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var DoubleIndexedKV = class {
  constructor() {
    this.keyToValue = /* @__PURE__ */ new Map();
    this.valueToKey = /* @__PURE__ */ new Map();
  }
  set(key, value) {
    this.keyToValue.set(key, value);
    this.valueToKey.set(value, key);
  }
  getByKey(key) {
    return this.keyToValue.get(key);
  }
  getByValue(value) {
    return this.valueToKey.get(value);
  }
  clear() {
    this.keyToValue.clear();
    this.valueToKey.clear();
  }
};
var Registry = class {
  constructor(generateIdentifier) {
    this.generateIdentifier = generateIdentifier;
    this.kv = new DoubleIndexedKV();
  }
  register(value, identifier) {
    if (this.kv.getByValue(value)) {
      return;
    }
    if (!identifier) {
      identifier = this.generateIdentifier(value);
    }
    this.kv.set(identifier, value);
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(value) {
    return this.kv.getByValue(value);
  }
  getValue(identifier) {
    return this.kv.getByKey(identifier);
  }
};
var ClassRegistry = class extends Registry {
  constructor() {
    super((c) => c.name);
    this.classToAllowedProps = /* @__PURE__ */ new Map();
  }
  register(value, options) {
    if (typeof options === "object") {
      if (options.allowProps) {
        this.classToAllowedProps.set(value, options.allowProps);
      }
      super.register(value, options.identifier);
    } else {
      super.register(value, options);
    }
  }
  getAllowedProps(value) {
    return this.classToAllowedProps.get(value);
  }
};
init_esm_shims2();
init_esm_shims2();
function valuesOfObj(record) {
  if ("values" in Object) {
    return Object.values(record);
  }
  const values = [];
  for (const key in record) {
    if (record.hasOwnProperty(key)) {
      values.push(record[key]);
    }
  }
  return values;
}
function find(record, predicate) {
  const values = valuesOfObj(record);
  if ("find" in values) {
    return values.find(predicate);
  }
  const valuesNotNever = values;
  for (let i = 0; i < valuesNotNever.length; i++) {
    const value = valuesNotNever[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
function forEach(record, run) {
  Object.entries(record).forEach(([key, value]) => run(value, key));
}
function includes(arr, value) {
  return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
  for (let i = 0; i < record.length; i++) {
    const value = record[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
var CustomTransformerRegistry = class {
  constructor() {
    this.transfomers = {};
  }
  register(transformer) {
    this.transfomers[transformer.name] = transformer;
  }
  findApplicable(v) {
    return find(this.transfomers, (transformer) => transformer.isApplicable(v));
  }
  findByName(name) {
    return this.transfomers[name];
  }
};
init_esm_shims2();
init_esm_shims2();
var getType = (payload) => Object.prototype.toString.call(payload).slice(8, -1);
var isUndefined = (payload) => typeof payload === "undefined";
var isNull = (payload) => payload === null;
var isPlainObject2 = (payload) => {
  if (typeof payload !== "object" || payload === null)
    return false;
  if (payload === Object.prototype)
    return false;
  if (Object.getPrototypeOf(payload) === null)
    return true;
  return Object.getPrototypeOf(payload) === Object.prototype;
};
var isEmptyObject = (payload) => isPlainObject2(payload) && Object.keys(payload).length === 0;
var isArray = (payload) => Array.isArray(payload);
var isString = (payload) => typeof payload === "string";
var isNumber = (payload) => typeof payload === "number" && !isNaN(payload);
var isBoolean = (payload) => typeof payload === "boolean";
var isRegExp = (payload) => payload instanceof RegExp;
var isMap = (payload) => payload instanceof Map;
var isSet = (payload) => payload instanceof Set;
var isSymbol = (payload) => getType(payload) === "Symbol";
var isDate = (payload) => payload instanceof Date && !isNaN(payload.valueOf());
var isError = (payload) => payload instanceof Error;
var isNaNValue = (payload) => typeof payload === "number" && isNaN(payload);
var isPrimitive2 = (payload) => isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
var isBigint = (payload) => typeof payload === "bigint";
var isInfinite = (payload) => payload === Infinity || payload === -Infinity;
var isTypedArray = (payload) => ArrayBuffer.isView(payload) && !(payload instanceof DataView);
var isURL = (payload) => payload instanceof URL;
init_esm_shims2();
var escapeKey = (key) => key.replace(/\./g, "\\.");
var stringifyPath = (path) => path.map(String).map(escapeKey).join(".");
var parsePath = (string) => {
  const result = [];
  let segment = "";
  for (let i = 0; i < string.length; i++) {
    let char = string.charAt(i);
    const isEscapedDot = char === "\\" && string.charAt(i + 1) === ".";
    if (isEscapedDot) {
      segment += ".";
      i++;
      continue;
    }
    const isEndOfSegment = char === ".";
    if (isEndOfSegment) {
      result.push(segment);
      segment = "";
      continue;
    }
    segment += char;
  }
  const lastSegment = segment;
  result.push(lastSegment);
  return result;
};
init_esm_shims2();
function simpleTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
var simpleRules = [
  simpleTransformation(isUndefined, "undefined", () => null, () => void 0),
  simpleTransformation(isBigint, "bigint", (v) => v.toString(), (v) => {
    if (typeof BigInt !== "undefined") {
      return BigInt(v);
    }
    console.error("Please add a BigInt polyfill.");
    return v;
  }),
  simpleTransformation(isDate, "Date", (v) => v.toISOString(), (v) => new Date(v)),
  simpleTransformation(isError, "Error", (v, superJson) => {
    const baseError = {
      name: v.name,
      message: v.message
    };
    superJson.allowedErrorProps.forEach((prop) => {
      baseError[prop] = v[prop];
    });
    return baseError;
  }, (v, superJson) => {
    const e = new Error(v.message);
    e.name = v.name;
    e.stack = v.stack;
    superJson.allowedErrorProps.forEach((prop) => {
      e[prop] = v[prop];
    });
    return e;
  }),
  simpleTransformation(isRegExp, "regexp", (v) => "" + v, (regex) => {
    const body = regex.slice(1, regex.lastIndexOf("/"));
    const flags = regex.slice(regex.lastIndexOf("/") + 1);
    return new RegExp(body, flags);
  }),
  simpleTransformation(
    isSet,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (v) => [...v.values()],
    (v) => new Set(v)
  ),
  simpleTransformation(isMap, "map", (v) => [...v.entries()], (v) => new Map(v)),
  simpleTransformation((v) => isNaNValue(v) || isInfinite(v), "number", (v) => {
    if (isNaNValue(v)) {
      return "NaN";
    }
    if (v > 0) {
      return "Infinity";
    } else {
      return "-Infinity";
    }
  }, Number),
  simpleTransformation((v) => v === 0 && 1 / v === -Infinity, "number", () => {
    return "-0";
  }, Number),
  simpleTransformation(isURL, "URL", (v) => v.toString(), (v) => new URL(v))
];
function compositeTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
var symbolRule = compositeTransformation((s, superJson) => {
  if (isSymbol(s)) {
    const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
    return isRegistered;
  }
  return false;
}, (s, superJson) => {
  const identifier = superJson.symbolRegistry.getIdentifier(s);
  return ["symbol", identifier];
}, (v) => v.description, (_, a, superJson) => {
  const value = superJson.symbolRegistry.getValue(a[1]);
  if (!value) {
    throw new Error("Trying to deserialize unknown symbol");
  }
  return value;
});
var constructorToName = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((obj, ctor) => {
  obj[ctor.name] = ctor;
  return obj;
}, {});
var typedArrayRule = compositeTransformation(isTypedArray, (v) => ["typed-array", v.constructor.name], (v) => [...v], (v, a) => {
  const ctor = constructorToName[a[1]];
  if (!ctor) {
    throw new Error("Trying to deserialize unknown typed array");
  }
  return new ctor(v);
});
function isInstanceOfRegisteredClass(potentialClass, superJson) {
  if (potentialClass == null ? void 0 : potentialClass.constructor) {
    const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
    return isRegistered;
  }
  return false;
}
var classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson) => {
  const identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
  return ["class", identifier];
}, (clazz, superJson) => {
  const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
  if (!allowedProps) {
    return { ...clazz };
  }
  const result = {};
  allowedProps.forEach((prop) => {
    result[prop] = clazz[prop];
  });
  return result;
}, (v, a, superJson) => {
  const clazz = superJson.classRegistry.getValue(a[1]);
  if (!clazz) {
    throw new Error(`Trying to deserialize unknown class '${a[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
  }
  return Object.assign(Object.create(clazz.prototype), v);
});
var customRule = compositeTransformation((value, superJson) => {
  return !!superJson.customTransformerRegistry.findApplicable(value);
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return ["custom", transformer.name];
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return transformer.serialize(value);
}, (v, a, superJson) => {
  const transformer = superJson.customTransformerRegistry.findByName(a[1]);
  if (!transformer) {
    throw new Error("Trying to deserialize unknown custom value");
  }
  return transformer.deserialize(v);
});
var compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
var transformValue = (value, superJson) => {
  const applicableCompositeRule = findArr(compositeRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableCompositeRule) {
    return {
      value: applicableCompositeRule.transform(value, superJson),
      type: applicableCompositeRule.annotation(value, superJson)
    };
  }
  const applicableSimpleRule = findArr(simpleRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableSimpleRule) {
    return {
      value: applicableSimpleRule.transform(value, superJson),
      type: applicableSimpleRule.annotation
    };
  }
  return void 0;
};
var simpleRulesByAnnotation = {};
simpleRules.forEach((rule) => {
  simpleRulesByAnnotation[rule.annotation] = rule;
});
var untransformValue = (json, type, superJson) => {
  if (isArray(type)) {
    switch (type[0]) {
      case "symbol":
        return symbolRule.untransform(json, type, superJson);
      case "class":
        return classRule.untransform(json, type, superJson);
      case "custom":
        return customRule.untransform(json, type, superJson);
      case "typed-array":
        return typedArrayRule.untransform(json, type, superJson);
      default:
        throw new Error("Unknown transformation: " + type);
    }
  } else {
    const transformation = simpleRulesByAnnotation[type];
    if (!transformation) {
      throw new Error("Unknown transformation: " + type);
    }
    return transformation.untransform(json, superJson);
  }
};
init_esm_shims2();
var getNthKey = (value, n) => {
  if (n > value.size)
    throw new Error("index out of bounds");
  const keys = value.keys();
  while (n > 0) {
    keys.next();
    n--;
  }
  return keys.next().value;
};
function validatePath(path) {
  if (includes(path, "__proto__")) {
    throw new Error("__proto__ is not allowed as a property");
  }
  if (includes(path, "prototype")) {
    throw new Error("prototype is not allowed as a property");
  }
  if (includes(path, "constructor")) {
    throw new Error("constructor is not allowed as a property");
  }
}
var getDeep = (object, path) => {
  validatePath(path);
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (isSet(object)) {
      object = getNthKey(object, +key);
    } else if (isMap(object)) {
      const row = +key;
      const type = +path[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(object, row);
      switch (type) {
        case "key":
          object = keyOfRow;
          break;
        case "value":
          object = object.get(keyOfRow);
          break;
      }
    } else {
      object = object[key];
    }
  }
  return object;
};
var setDeep = (object, path, mapper) => {
  validatePath(path);
  if (path.length === 0) {
    return mapper(object);
  }
  let parent = object;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (isArray(parent)) {
      const index = +key;
      parent = parent[index];
    } else if (isPlainObject2(parent)) {
      parent = parent[key];
    } else if (isSet(parent)) {
      const row = +key;
      parent = getNthKey(parent, row);
    } else if (isMap(parent)) {
      const isEnd = i === path.length - 2;
      if (isEnd) {
        break;
      }
      const row = +key;
      const type = +path[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(parent, row);
      switch (type) {
        case "key":
          parent = keyOfRow;
          break;
        case "value":
          parent = parent.get(keyOfRow);
          break;
      }
    }
  }
  const lastKey = path[path.length - 1];
  if (isArray(parent)) {
    parent[+lastKey] = mapper(parent[+lastKey]);
  } else if (isPlainObject2(parent)) {
    parent[lastKey] = mapper(parent[lastKey]);
  }
  if (isSet(parent)) {
    const oldValue = getNthKey(parent, +lastKey);
    const newValue = mapper(oldValue);
    if (oldValue !== newValue) {
      parent.delete(oldValue);
      parent.add(newValue);
    }
  }
  if (isMap(parent)) {
    const row = +path[path.length - 2];
    const keyToRow = getNthKey(parent, row);
    const type = +lastKey === 0 ? "key" : "value";
    switch (type) {
      case "key": {
        const newKey = mapper(keyToRow);
        parent.set(newKey, parent.get(keyToRow));
        if (newKey !== keyToRow) {
          parent.delete(keyToRow);
        }
        break;
      }
      case "value": {
        parent.set(keyToRow, mapper(parent.get(keyToRow)));
        break;
      }
    }
  }
  return object;
};
function traverse(tree, walker2, origin = []) {
  if (!tree) {
    return;
  }
  if (!isArray(tree)) {
    forEach(tree, (subtree, key) => traverse(subtree, walker2, [...origin, ...parsePath(key)]));
    return;
  }
  const [nodeValue, children] = tree;
  if (children) {
    forEach(children, (child, key) => {
      traverse(child, walker2, [...origin, ...parsePath(key)]);
    });
  }
  walker2(nodeValue, origin);
}
function applyValueAnnotations(plain, annotations, superJson) {
  traverse(annotations, (type, path) => {
    plain = setDeep(plain, path, (v) => untransformValue(v, type, superJson));
  });
  return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
  function apply(identicalPaths, path) {
    const object = getDeep(plain, parsePath(path));
    identicalPaths.map(parsePath).forEach((identicalObjectPath) => {
      plain = setDeep(plain, identicalObjectPath, () => object);
    });
  }
  if (isArray(annotations)) {
    const [root, other] = annotations;
    root.forEach((identicalPath) => {
      plain = setDeep(plain, parsePath(identicalPath), () => plain);
    });
    if (other) {
      forEach(other, apply);
    }
  } else {
    forEach(annotations, apply);
  }
  return plain;
}
var isDeep = (object, superJson) => isPlainObject2(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
function addIdentity(object, path, identities) {
  const existingSet = identities.get(object);
  if (existingSet) {
    existingSet.push(path);
  } else {
    identities.set(object, [path]);
  }
}
function generateReferentialEqualityAnnotations(identitites, dedupe) {
  const result = {};
  let rootEqualityPaths = void 0;
  identitites.forEach((paths) => {
    if (paths.length <= 1) {
      return;
    }
    if (!dedupe) {
      paths = paths.map((path) => path.map(String)).sort((a, b) => a.length - b.length);
    }
    const [representativePath, ...identicalPaths] = paths;
    if (representativePath.length === 0) {
      rootEqualityPaths = identicalPaths.map(stringifyPath);
    } else {
      result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
    }
  });
  if (rootEqualityPaths) {
    if (isEmptyObject(result)) {
      return [rootEqualityPaths];
    } else {
      return [rootEqualityPaths, result];
    }
  } else {
    return isEmptyObject(result) ? void 0 : result;
  }
}
var walker = (object, identities, superJson, dedupe, path = [], objectsInThisPath = [], seenObjects = /* @__PURE__ */ new Map()) => {
  var _a25;
  const primitive = isPrimitive2(object);
  if (!primitive) {
    addIdentity(object, path, identities);
    const seen = seenObjects.get(object);
    if (seen) {
      return dedupe ? {
        transformedValue: null
      } : seen;
    }
  }
  if (!isDeep(object, superJson)) {
    const transformed2 = transformValue(object, superJson);
    const result2 = transformed2 ? {
      transformedValue: transformed2.value,
      annotations: [transformed2.type]
    } : {
      transformedValue: object
    };
    if (!primitive) {
      seenObjects.set(object, result2);
    }
    return result2;
  }
  if (includes(objectsInThisPath, object)) {
    return {
      transformedValue: null
    };
  }
  const transformationResult = transformValue(object, superJson);
  const transformed = (_a25 = transformationResult == null ? void 0 : transformationResult.value) != null ? _a25 : object;
  const transformedValue = isArray(transformed) ? [] : {};
  const innerAnnotations = {};
  forEach(transformed, (value, index) => {
    if (index === "__proto__" || index === "constructor" || index === "prototype") {
      throw new Error(`Detected property ${index}. This is a prototype pollution risk, please remove it from your object.`);
    }
    const recursiveResult = walker(value, identities, superJson, dedupe, [...path, index], [...objectsInThisPath, object], seenObjects);
    transformedValue[index] = recursiveResult.transformedValue;
    if (isArray(recursiveResult.annotations)) {
      innerAnnotations[index] = recursiveResult.annotations;
    } else if (isPlainObject2(recursiveResult.annotations)) {
      forEach(recursiveResult.annotations, (tree, key) => {
        innerAnnotations[escapeKey(index) + "." + key] = tree;
      });
    }
  });
  const result = isEmptyObject(innerAnnotations) ? {
    transformedValue,
    annotations: !!transformationResult ? [transformationResult.type] : void 0
  } : {
    transformedValue,
    annotations: !!transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
  };
  if (!primitive) {
    seenObjects.set(object, result);
  }
  return result;
};
init_esm_shims2();
init_esm_shims2();
function getType2(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
}
function isArray2(payload) {
  return getType2(payload) === "Array";
}
function isPlainObject3(payload) {
  if (getType2(payload) !== "Object")
    return false;
  const prototype = Object.getPrototypeOf(payload);
  return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
}
function isNull2(payload) {
  return getType2(payload) === "Null";
}
function isOneOf(a, b, c, d, e) {
  return (value) => a(value) || b(value) || !!c && c(value) || !!d && d(value) || !!e && e(value);
}
function isUndefined2(payload) {
  return getType2(payload) === "Undefined";
}
var isNullOrUndefined = isOneOf(isNull2, isUndefined2);
function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
  const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
  if (propType === "enumerable")
    carry[key] = newVal;
  if (includeNonenumerable && propType === "nonenumerable") {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
}
function copy(target22, options = {}) {
  if (isArray2(target22)) {
    return target22.map((item) => copy(item, options));
  }
  if (!isPlainObject3(target22)) {
    return target22;
  }
  const props = Object.getOwnPropertyNames(target22);
  const symbols = Object.getOwnPropertySymbols(target22);
  return [...props, ...symbols].reduce((carry, key) => {
    if (isArray2(options.props) && !options.props.includes(key)) {
      return carry;
    }
    const val = target22[key];
    const newVal = copy(val, options);
    assignProp(carry, key, newVal, target22, options.nonenumerable);
    return carry;
  }, {});
}
var SuperJSON = class {
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe = false } = {}) {
    this.classRegistry = new ClassRegistry();
    this.symbolRegistry = new Registry((s) => {
      var _a25;
      return (_a25 = s.description) != null ? _a25 : "";
    });
    this.customTransformerRegistry = new CustomTransformerRegistry();
    this.allowedErrorProps = [];
    this.dedupe = dedupe;
  }
  serialize(object) {
    const identities = /* @__PURE__ */ new Map();
    const output = walker(object, identities, this, this.dedupe);
    const res = {
      json: output.transformedValue
    };
    if (output.annotations) {
      res.meta = {
        ...res.meta,
        values: output.annotations
      };
    }
    const equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
    if (equalityAnnotations) {
      res.meta = {
        ...res.meta,
        referentialEqualities: equalityAnnotations
      };
    }
    return res;
  }
  deserialize(payload) {
    const { json, meta } = payload;
    let result = copy(json);
    if (meta == null ? void 0 : meta.values) {
      result = applyValueAnnotations(result, meta.values, this);
    }
    if (meta == null ? void 0 : meta.referentialEqualities) {
      result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
    }
    return result;
  }
  stringify(object) {
    return JSON.stringify(this.serialize(object));
  }
  parse(string) {
    return this.deserialize(JSON.parse(string));
  }
  registerClass(v, options) {
    this.classRegistry.register(v, options);
  }
  registerSymbol(v, identifier) {
    this.symbolRegistry.register(v, identifier);
  }
  registerCustom(transformer, name) {
    this.customTransformerRegistry.register({
      name,
      ...transformer
    });
  }
  allowErrorProps(...props) {
    this.allowedErrorProps.push(...props);
  }
};
SuperJSON.defaultInstance = new SuperJSON();
SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);
var serialize = SuperJSON.serialize;
var deserialize = SuperJSON.deserialize;
var stringify = SuperJSON.stringify;
var parse = SuperJSON.parse;
var registerClass = SuperJSON.registerClass;
var registerCustom = SuperJSON.registerCustom;
var registerSymbol = SuperJSON.registerSymbol;
var allowErrorProps = SuperJSON.allowErrorProps;
init_esm_shims2();
var __DEVTOOLS_KIT_BROADCAST_MESSAGING_EVENT_KEY = "__devtools-kit-broadcast-messaging-event-key__";
var BROADCAST_CHANNEL_NAME = "__devtools-kit:broadcast-channel__";
function createBroadcastChannel() {
  const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  return {
    post: (data) => {
      channel.postMessage(SuperJSON.stringify({
        event: __DEVTOOLS_KIT_BROADCAST_MESSAGING_EVENT_KEY,
        data
      }));
    },
    on: (handler) => {
      channel.onmessage = (event) => {
        const parsed = SuperJSON.parse(event.data);
        if (parsed.event === __DEVTOOLS_KIT_BROADCAST_MESSAGING_EVENT_KEY) {
          handler(parsed.data);
        }
      };
    }
  };
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var __ELECTRON_CLIENT_CONTEXT__ = "electron:client-context";
var __ELECTRON_RPOXY_CONTEXT__ = "electron:proxy-context";
var __ELECTRON_SERVER_CONTEXT__ = "electron:server-context";
var __DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__ = {
  // client
  CLIENT_TO_PROXY: "client->proxy",
  // on: proxy->client
  // proxy
  PROXY_TO_CLIENT: "proxy->client",
  // on: server->proxy
  PROXY_TO_SERVER: "proxy->server",
  // on: client->proxy
  // server
  SERVER_TO_PROXY: "server->proxy"
  // on: proxy->server
};
function getElectronClientContext() {
  return target[__ELECTRON_CLIENT_CONTEXT__];
}
function setElectronClientContext(context) {
  target[__ELECTRON_CLIENT_CONTEXT__] = context;
}
function getElectronProxyContext() {
  return target[__ELECTRON_RPOXY_CONTEXT__];
}
function setElectronProxyContext(context) {
  target[__ELECTRON_RPOXY_CONTEXT__] = context;
}
function getElectronServerContext() {
  return target[__ELECTRON_SERVER_CONTEXT__];
}
function setElectronServerContext(context) {
  target[__ELECTRON_SERVER_CONTEXT__] = context;
}
function createElectronClientChannel() {
  const socket = getElectronClientContext();
  return {
    post: (data) => {
      socket.emit(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.CLIENT_TO_PROXY, SuperJSON.stringify(data));
    },
    on: (handler) => {
      socket.on(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.PROXY_TO_CLIENT, (e) => {
        handler(SuperJSON.parse(e));
      });
    }
  };
}
init_esm_shims2();
function createElectronProxyChannel() {
  const socket = getElectronProxyContext();
  return {
    post: (data) => {
    },
    on: (handler) => {
      socket.on(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.SERVER_TO_PROXY, (data) => {
        socket.broadcast.emit(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.PROXY_TO_CLIENT, data);
      });
      socket.on(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.CLIENT_TO_PROXY, (data) => {
        socket.broadcast.emit(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.PROXY_TO_SERVER, data);
      });
    }
  };
}
init_esm_shims2();
function createElectronServerChannel() {
  const socket = getElectronServerContext();
  return {
    post: (data) => {
      socket.emit(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.SERVER_TO_PROXY, SuperJSON.stringify(data));
    },
    on: (handler) => {
      socket.on(__DEVTOOLS_KIT_ELECTRON_MESSAGING_EVENT_KEY__.PROXY_TO_SERVER, (data) => {
        handler(SuperJSON.parse(data));
      });
    }
  };
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var __EXTENSION_CLIENT_CONTEXT__ = "electron:client-context";
var __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__ = {
  // client
  CLIENT_TO_PROXY: "client->proxy",
  // on: proxy->client
  // proxy
  PROXY_TO_CLIENT: "proxy->client",
  // on: server->proxy
  PROXY_TO_SERVER: "proxy->server",
  // on: client->proxy
  // server
  SERVER_TO_PROXY: "server->proxy"
  // on: proxy->server
};
function getExtensionClientContext() {
  return target[__EXTENSION_CLIENT_CONTEXT__];
}
function setExtensionClientContext(context) {
  target[__EXTENSION_CLIENT_CONTEXT__] = context;
}
function createExtensionClientChannel() {
  let disconnected = false;
  let port = null;
  let reconnectTimer = null;
  let onMessageHandler = null;
  function connect() {
    try {
      clearTimeout(reconnectTimer);
      port = chrome.runtime.connect({
        name: `${chrome.devtools.inspectedWindow.tabId}`
      });
      setExtensionClientContext(port);
      disconnected = false;
      port == null ? void 0 : port.onMessage.addListener(onMessageHandler);
      port.onDisconnect.addListener(() => {
        disconnected = true;
        port == null ? void 0 : port.onMessage.removeListener(onMessageHandler);
        reconnectTimer = setTimeout(connect, 1e3);
      });
    } catch (e) {
      disconnected = true;
    }
  }
  connect();
  return {
    post: (data) => {
      if (disconnected) {
        return;
      }
      port == null ? void 0 : port.postMessage(SuperJSON.stringify(data));
    },
    on: (handler) => {
      onMessageHandler = (data) => {
        if (disconnected) {
          return;
        }
        handler(SuperJSON.parse(data));
      };
      port == null ? void 0 : port.onMessage.addListener(onMessageHandler);
    }
  };
}
init_esm_shims2();
function createExtensionProxyChannel() {
  const port = chrome.runtime.connect({
    name: "content-script"
  });
  function sendMessageToUserApp(payload) {
    window.postMessage({
      source: __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__.PROXY_TO_SERVER,
      payload
    }, "*");
  }
  function sendMessageToDevToolsClient(e) {
    if (e.data && e.data.source === __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__.SERVER_TO_PROXY) {
      try {
        port.postMessage(e.data.payload);
      } catch (e2) {
      }
    }
  }
  port.onMessage.addListener(sendMessageToUserApp);
  window.addEventListener("message", sendMessageToDevToolsClient);
  port.onDisconnect.addListener(() => {
    window.removeEventListener("message", sendMessageToDevToolsClient);
    sendMessageToUserApp(SuperJSON.stringify({
      event: "shutdown"
    }));
  });
  sendMessageToUserApp(SuperJSON.stringify({
    event: "init"
  }));
  return {
    post: (data) => {
    },
    on: (handler) => {
    }
  };
}
init_esm_shims2();
function createExtensionServerChannel() {
  return {
    post: (data) => {
      window.postMessage({
        source: __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__.SERVER_TO_PROXY,
        payload: SuperJSON.stringify(data)
      }, "*");
    },
    on: (handler) => {
      const listener = (event) => {
        if (event.data.source === __DEVTOOLS_KIT_EXTENSION_MESSAGING_EVENT_KEY__.PROXY_TO_SERVER && event.data.payload) {
          handler(SuperJSON.parse(event.data.payload));
        }
      };
      window.addEventListener("message", listener);
      return () => {
        window.removeEventListener("message", listener);
      };
    }
  };
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY = "__devtools-kit-iframe-messaging-event-key__";
var __IFRAME_SERVER_CONTEXT__ = "iframe:server-context";
function getIframeServerContext() {
  return target[__IFRAME_SERVER_CONTEXT__];
}
function setIframeServerContext(context) {
  target[__IFRAME_SERVER_CONTEXT__] = context;
}
function createIframeClientChannel() {
  if (!isBrowser) {
    return {
      post: (data) => {
      },
      on: (handler) => {
      }
    };
  }
  return {
    post: (data) => window.parent.postMessage(SuperJSON.stringify({
      event: __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY,
      data
    }), "*"),
    on: (handler) => window.addEventListener("message", (event) => {
      try {
        const parsed = SuperJSON.parse(event.data);
        if (event.source === window.parent && parsed.event === __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY) {
          handler(parsed.data);
        }
      } catch (e) {
      }
    })
  };
}
init_esm_shims2();
function createIframeServerChannel() {
  if (!isBrowser) {
    return {
      post: (data) => {
      },
      on: (handler) => {
      }
    };
  }
  return {
    post: (data) => {
      var _a25;
      const iframe = getIframeServerContext();
      (_a25 = iframe == null ? void 0 : iframe.contentWindow) == null ? void 0 : _a25.postMessage(SuperJSON.stringify({
        event: __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY,
        data
      }), "*");
    },
    on: (handler) => {
      window.addEventListener("message", (event) => {
        const iframe = getIframeServerContext();
        try {
          const parsed = SuperJSON.parse(event.data);
          if (event.source === (iframe == null ? void 0 : iframe.contentWindow) && parsed.event === __DEVTOOLS_KIT_IFRAME_MESSAGING_EVENT_KEY) {
            handler(parsed.data);
          }
        } catch (e) {
        }
      });
    }
  };
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var __DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY = "__devtools-kit-vite-messaging-event-key__";
var __VITE_CLIENT_CONTEXT__ = "vite:client-context";
var __VITE_SERVER_CONTEXT__ = "vite:server-context";
function getViteClientContext() {
  return target[__VITE_CLIENT_CONTEXT__];
}
function setViteClientContext(context) {
  target[__VITE_CLIENT_CONTEXT__] = context;
}
function getViteServerContext() {
  return target[__VITE_SERVER_CONTEXT__];
}
function setViteServerContext(context) {
  target[__VITE_SERVER_CONTEXT__] = context;
}
function createViteClientChannel() {
  const client = getViteClientContext();
  return {
    post: (data) => {
      client == null ? void 0 : client.send(__DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY, SuperJSON.stringify(data));
    },
    on: (handler) => {
      client == null ? void 0 : client.on(__DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY, (event) => {
        handler(SuperJSON.parse(event));
      });
    }
  };
}
init_esm_shims2();
function createViteServerChannel() {
  var _a25;
  const viteServer = getViteServerContext();
  const ws = (_a25 = viteServer.hot) != null ? _a25 : viteServer.ws;
  return {
    post: (data) => ws == null ? void 0 : ws.send(__DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY, SuperJSON.stringify(data)),
    on: (handler) => ws == null ? void 0 : ws.on(__DEVTOOLS_KIT_VITE_MESSAGING_EVENT_KEY, (event) => {
      handler(SuperJSON.parse(event));
    })
  };
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
var _a19;
var _b19;
(_b19 = (_a19 = target).__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__) != null ? _b19 : _a19.__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__ = [];
var _a20;
var _b20;
(_b20 = (_a20 = target).__VUE_DEVTOOLS_KIT_RPC_CLIENT__) != null ? _b20 : _a20.__VUE_DEVTOOLS_KIT_RPC_CLIENT__ = null;
var _a21;
var _b21;
(_b21 = (_a21 = target).__VUE_DEVTOOLS_KIT_RPC_SERVER__) != null ? _b21 : _a21.__VUE_DEVTOOLS_KIT_RPC_SERVER__ = null;
var _a222;
var _b22;
(_b22 = (_a222 = target).__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__) != null ? _b22 : _a222.__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__ = null;
var _a23;
var _b23;
(_b23 = (_a23 = target).__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__) != null ? _b23 : _a23.__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__ = null;
var _a24;
var _b24;
(_b24 = (_a24 = target).__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__) != null ? _b24 : _a24.__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__ = null;
function setRpcClientToGlobal(rpc) {
  target.__VUE_DEVTOOLS_KIT_RPC_CLIENT__ = rpc;
}
function setRpcServerToGlobal(rpc) {
  target.__VUE_DEVTOOLS_KIT_RPC_SERVER__ = rpc;
}
function getRpcClient() {
  return target.__VUE_DEVTOOLS_KIT_RPC_CLIENT__;
}
function getRpcServer() {
  return target.__VUE_DEVTOOLS_KIT_RPC_SERVER__;
}
function setViteRpcClientToGlobal(rpc) {
  target.__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__ = rpc;
}
function setViteRpcServerToGlobal(rpc) {
  target.__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__ = rpc;
}
function getViteRpcClient() {
  return target.__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__;
}
function getViteRpcServer() {
  return target.__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__;
}
function getChannel(preset, host = "client") {
  const channel = {
    iframe: {
      client: createIframeClientChannel,
      server: createIframeServerChannel
    }[host],
    electron: {
      client: createElectronClientChannel,
      proxy: createElectronProxyChannel,
      server: createElectronServerChannel
    }[host],
    vite: {
      client: createViteClientChannel,
      server: createViteServerChannel
    }[host],
    broadcast: {
      client: createBroadcastChannel,
      server: createBroadcastChannel
    }[host],
    extension: {
      client: createExtensionClientChannel,
      proxy: createExtensionProxyChannel,
      server: createExtensionServerChannel
    }[host]
  }[preset];
  return channel();
}
function createRpcClient(functions, options = {}) {
  const { channel: _channel, options: _options, preset } = options;
  const channel = preset ? getChannel(preset) : _channel;
  const rpc = createBirpc(functions, {
    ..._options,
    ...channel,
    timeout: -1
  });
  if (preset === "vite") {
    setViteRpcClientToGlobal(rpc);
    return;
  }
  setRpcClientToGlobal(rpc);
  return rpc;
}
function createRpcServer(functions, options = {}) {
  const { channel: _channel, options: _options, preset } = options;
  const channel = preset ? getChannel(preset, "server") : _channel;
  const rpcServer = getRpcServer();
  if (!rpcServer) {
    const group = createBirpcGroup(functions, [channel], {
      ..._options,
      timeout: -1
    });
    if (preset === "vite") {
      setViteRpcServerToGlobal(group);
      return;
    }
    setRpcServerToGlobal(group);
  } else {
    rpcServer.updateChannels((channels) => {
      channels.push(channel);
    });
  }
}
function createRpcProxy(options = {}) {
  const { channel: _channel, options: _options, preset } = options;
  const channel = preset ? getChannel(preset, "proxy") : _channel;
  return createBirpc({}, {
    ..._options,
    ...channel,
    timeout: -1
  });
}
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
init_esm_shims2();
function getFunctionDetails(func) {
  let string = "";
  let matches = null;
  try {
    string = Function.prototype.toString.call(func);
    matches = String.prototype.match.call(string, /\([\s\S]*?\)/);
  } catch (e) {
  }
  const match = matches && matches[0];
  const args = typeof match === "string" ? match : "(?)";
  const name = typeof func.name === "string" ? func.name : "";
  return {
    _custom: {
      type: "function",
      displayText: `<span style="opacity:.8;margin-right:5px;">function</span> <span style="white-space:nowrap;">${escape(name)}${args}</span>`,
      tooltipText: string.trim() ? `<pre>${string}</pre>` : null
    }
  };
}
function getBigIntDetails(val) {
  const stringifiedBigInt = BigInt.prototype.toString.call(val);
  return {
    _custom: {
      type: "bigint",
      displayText: `BigInt(${stringifiedBigInt})`,
      value: stringifiedBigInt
    }
  };
}
function getDateDetails(val) {
  const date = new Date(val.getTime());
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return {
    _custom: {
      type: "date",
      displayText: Date.prototype.toString.call(val),
      value: date.toISOString().slice(0, -1)
    }
  };
}
function getMapDetails(val) {
  const list = Object.fromEntries(val);
  return {
    _custom: {
      type: "map",
      displayText: "Map",
      value: list,
      readOnly: true,
      fields: {
        abstract: true
      }
    }
  };
}
function getSetDetails(val) {
  const list = Array.from(val);
  return {
    _custom: {
      type: "set",
      displayText: `Set[${list.length}]`,
      value: list,
      readOnly: true
    }
  };
}
function getCaughtGetters(store) {
  const getters = {};
  const origGetters = store.getters || {};
  const keys = Object.keys(origGetters);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    Object.defineProperty(getters, key, {
      enumerable: true,
      get: () => {
        try {
          return origGetters[key];
        } catch (e) {
          return e;
        }
      }
    });
  }
  return getters;
}
function reduceStateList(list) {
  if (!list.length)
    return void 0;
  return list.reduce((map, item) => {
    const key = item.type || "data";
    const obj = map[key] = map[key] || {};
    obj[item.key] = item.value;
    return map;
  }, {});
}
function namedNodeMapToObject(map) {
  const result = {};
  const l = map.length;
  for (let i = 0; i < l; i++) {
    const node = map.item(i);
    result[node.name] = node.value;
  }
  return result;
}
function getStoreDetails(store) {
  return {
    _custom: {
      type: "store",
      displayText: "Store",
      value: {
        state: store.state,
        getters: getCaughtGetters(store)
      },
      fields: {
        abstract: true
      }
    }
  };
}
function getRouterDetails(router) {
  return {
    _custom: {
      type: "router",
      displayText: "VueRouter",
      value: {
        options: router.options,
        currentRoute: router.currentRoute
      },
      fields: {
        abstract: true
      }
    }
  };
}
function getInstanceDetails(instance) {
  if (instance._)
    instance = instance._;
  const state = processInstanceState(instance);
  return {
    _custom: {
      type: "component",
      id: instance.__VUE_DEVTOOLS_NEXT_UID__,
      displayText: getInstanceName(instance),
      tooltipText: "Component instance",
      value: reduceStateList(state),
      fields: {
        abstract: true
      }
    }
  };
}
function getComponentDefinitionDetails(definition) {
  let display = getComponentName(definition);
  if (display) {
    if (definition.name && definition.__file)
      display += ` <span>(${definition.__file})</span>`;
  } else {
    display = "<i>Unknown Component</i>";
  }
  return {
    _custom: {
      type: "component-definition",
      displayText: display,
      tooltipText: "Component definition",
      ...definition.__file ? {
        file: definition.__file
      } : {}
    }
  };
}
function getHTMLElementDetails(value) {
  try {
    return {
      _custom: {
        type: "HTMLElement",
        displayText: `<span class="opacity-30">&lt;</span><span class="text-blue-500">${value.tagName.toLowerCase()}</span><span class="opacity-30">&gt;</span>`,
        value: namedNodeMapToObject(value.attributes)
      }
    };
  } catch (e) {
    return {
      _custom: {
        type: "HTMLElement",
        displayText: `<span class="text-blue-500">${String(value)}</span>`
      }
    };
  }
}
function tryGetRefValue(ref) {
  if (ensurePropertyExists(ref, "_value", true)) {
    return ref._value;
  }
  if (ensurePropertyExists(ref, "value", true)) {
    return ref.value;
  }
}
function getObjectDetails(object) {
  var _a25, _b25, _c, _d;
  const info = getSetupStateType(object);
  const isState = info.ref || info.computed || info.reactive;
  if (isState) {
    const stateTypeName = info.computed ? "Computed" : info.ref ? "Ref" : info.reactive ? "Reactive" : null;
    const value = toRaw2(info.reactive ? object : tryGetRefValue(object));
    const raw = ensurePropertyExists(object, "effect") ? ((_b25 = (_a25 = object.effect) == null ? void 0 : _a25.raw) == null ? void 0 : _b25.toString()) || ((_d = (_c = object.effect) == null ? void 0 : _c.fn) == null ? void 0 : _d.toString()) : null;
    return {
      _custom: {
        type: stateTypeName == null ? void 0 : stateTypeName.toLowerCase(),
        stateTypeName,
        value,
        ...raw ? { tooltipText: `<span class="font-mono">${raw}</span>` } : {}
      }
    };
  }
  if (ensurePropertyExists(object, "__asyncLoader") && typeof object.__asyncLoader === "function") {
    return {
      _custom: {
        type: "component-definition",
        display: "Async component definition"
      }
    };
  }
}
function stringifyReplacer(key, _value, depth, seenInstance) {
  var _a25;
  if (key === "compilerOptions")
    return;
  const val = this[key];
  const type = typeof val;
  if (Array.isArray(val)) {
    const l = val.length;
    if (l > MAX_ARRAY_SIZE) {
      return {
        _isArray: true,
        length: l,
        items: val.slice(0, MAX_ARRAY_SIZE)
      };
    }
    return val;
  } else if (typeof val === "string") {
    if (val.length > MAX_STRING_SIZE)
      return `${val.substring(0, MAX_STRING_SIZE)}... (${val.length} total length)`;
    else
      return val;
  } else if (type === "undefined") {
    return UNDEFINED;
  } else if (val === Number.POSITIVE_INFINITY) {
    return INFINITY;
  } else if (val === Number.NEGATIVE_INFINITY) {
    return NEGATIVE_INFINITY;
  } else if (typeof val === "function") {
    return getFunctionDetails(val);
  } else if (type === "symbol") {
    return `[native Symbol ${Symbol.prototype.toString.call(val)}]`;
  } else if (typeof val === "bigint") {
    return getBigIntDetails(val);
  } else if (val !== null && typeof val === "object") {
    const proto = Object.prototype.toString.call(val);
    if (proto === "[object Map]") {
      return getMapDetails(val);
    } else if (proto === "[object Set]") {
      return getSetDetails(val);
    } else if (proto === "[object RegExp]") {
      return `[native RegExp ${RegExp.prototype.toString.call(val)}]`;
    } else if (proto === "[object Date]") {
      return getDateDetails(val);
    } else if (proto === "[object Error]") {
      return `[native Error ${val.message}<>${val.stack}]`;
    } else if (ensurePropertyExists(val, "state", true) && ensurePropertyExists(val, "_vm", true)) {
      return getStoreDetails(val);
    } else if (val.constructor && val.constructor.name === "VueRouter") {
      return getRouterDetails(val);
    } else if (isVueInstance(val)) {
      const componentVal = getInstanceDetails(val);
      const parentInstanceDepth = seenInstance == null ? void 0 : seenInstance.get(val);
      if (parentInstanceDepth && parentInstanceDepth < depth) {
        return `[[CircularRef]] <${componentVal._custom.displayText}>`;
      }
      seenInstance == null ? void 0 : seenInstance.set(val, depth);
      return componentVal;
    } else if (ensurePropertyExists(val, "render", true) && typeof val.render === "function") {
      return getComponentDefinitionDetails(val);
    } else if (val.constructor && val.constructor.name === "VNode") {
      return `[native VNode <${val.tag}>]`;
    } else if (typeof HTMLElement !== "undefined" && val instanceof HTMLElement) {
      return getHTMLElementDetails(val);
    } else if (((_a25 = val.constructor) == null ? void 0 : _a25.name) === "Store" && "_wrappedGetters" in val) {
      return "[object Store]";
    } else if (ensurePropertyExists(val, "currentRoute", true)) {
      return "[object Router]";
    }
    const customDetails = getObjectDetails(val);
    if (customDetails != null)
      return customDetails;
  } else if (Number.isNaN(val)) {
    return NAN;
  }
  return sanitize(val);
}
init_esm_shims2();
var MAX_SERIALIZED_SIZE = 2 * 1024 * 1024;
function isObject(_data, proto) {
  return proto === "[object Object]";
}
function isArray3(_data, proto) {
  return proto === "[object Array]";
}
function isVueReactiveLinkNode(node) {
  var _a25;
  const constructorName = (_a25 = node == null ? void 0 : node.constructor) == null ? void 0 : _a25.name;
  return constructorName === "Dep" && "activeLink" in node || constructorName === "Link" && "dep" in node;
}
function encode(data, replacer, list, seen, depth = 0, seenVueInstance = /* @__PURE__ */ new Map()) {
  let stored;
  let key;
  let value;
  let i;
  let l;
  const seenIndex = seen.get(data);
  if (seenIndex != null)
    return seenIndex;
  const index = list.length;
  const proto = Object.prototype.toString.call(data);
  if (isObject(data, proto)) {
    if (isVueReactiveLinkNode(data)) {
      return index;
    }
    stored = {};
    seen.set(data, index);
    list.push(stored);
    const keys = Object.keys(data);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      if (key === "compilerOptions")
        return index;
      value = data[key];
      const isVm = value != null && isObject(value, Object.prototype.toString.call(data)) && isVueInstance(value);
      try {
        if (replacer) {
          value = replacer.call(data, key, value, depth, seenVueInstance);
        }
      } catch (e) {
        value = e;
      }
      stored[key] = encode(value, replacer, list, seen, depth + 1, seenVueInstance);
      if (isVm) {
        seenVueInstance.delete(value);
      }
    }
  } else if (isArray3(data, proto)) {
    stored = [];
    seen.set(data, index);
    list.push(stored);
    for (i = 0, l = data.length; i < l; i++) {
      try {
        value = data[i];
        if (replacer)
          value = replacer.call(data, i, value, depth, seenVueInstance);
      } catch (e) {
        value = e;
      }
      stored[i] = encode(value, replacer, list, seen, depth + 1, seenVueInstance);
    }
  } else {
    list.push(data);
  }
  return index;
}
function decode(list, reviver2 = null) {
  let i = list.length;
  let j, k, data, key, value, proto;
  while (i--) {
    data = list[i];
    proto = Object.prototype.toString.call(data);
    if (proto === "[object Object]") {
      const keys = Object.keys(data);
      for (j = 0, k = keys.length; j < k; j++) {
        key = keys[j];
        value = list[data[key]];
        if (reviver2)
          value = reviver2.call(data, key, value);
        data[key] = value;
      }
    } else if (proto === "[object Array]") {
      for (j = 0, k = data.length; j < k; j++) {
        value = list[data[j]];
        if (reviver2)
          value = reviver2.call(data, j, value);
        data[j] = value;
      }
    }
  }
}
function stringifyCircularAutoChunks(data, replacer = null, space = null) {
  let result;
  try {
    result = arguments.length === 1 ? JSON.stringify(data) : JSON.stringify(data, (k, v) => {
      var _a25;
      return (_a25 = replacer == null ? void 0 : replacer(k, v)) == null ? void 0 : _a25.call(this);
    }, space);
  } catch (e) {
    result = stringifyStrictCircularAutoChunks(data, replacer, space);
  }
  if (result.length > MAX_SERIALIZED_SIZE) {
    const chunkCount = Math.ceil(result.length / MAX_SERIALIZED_SIZE);
    const chunks = [];
    for (let i = 0; i < chunkCount; i++)
      chunks.push(result.slice(i * MAX_SERIALIZED_SIZE, (i + 1) * MAX_SERIALIZED_SIZE));
    return chunks;
  }
  return result;
}
function stringifyStrictCircularAutoChunks(data, replacer = null, space = null) {
  const list = [];
  encode(data, replacer, list, /* @__PURE__ */ new Map());
  return space ? ` ${JSON.stringify(list, null, space)}` : ` ${JSON.stringify(list)}`;
}
function parseCircularAutoChunks(data, reviver2 = null) {
  if (Array.isArray(data))
    data = data.join("");
  const hasCircular = /^\s/.test(data);
  if (!hasCircular) {
    return arguments.length === 1 ? JSON.parse(data) : JSON.parse(data, reviver2);
  } else {
    const list = JSON.parse(data);
    decode(list, reviver2);
    return list[0];
  }
}
function stringify2(data) {
  return stringifyCircularAutoChunks(data, stringifyReplacer);
}
function parse2(data, revive2 = false) {
  if (data == void 0)
    return {};
  return revive2 ? parseCircularAutoChunks(data, reviver) : parseCircularAutoChunks(data);
}
var devtools = {
  hook,
  init: () => {
    initDevTools();
  },
  get ctx() {
    return devtoolsContext;
  },
  get api() {
    return devtoolsContext.api;
  }
};

export {
  isBrowser,
  target,
  toggleComponentInspectorEnabled,
  updateTimelineLayersState,
  devtoolsInspector,
  callInspectorUpdatedHook,
  addInspector,
  getActiveInspectors,
  getInspectorInfo,
  getInspector,
  getInspectorActions,
  getInspectorNodeActions,
  DevToolsV6PluginAPIHookKeys,
  DevToolsContextHookKeys,
  DevToolsMessagingHookKeys,
  createDevToolsCtxHooks,
  callStateUpdatedHook,
  callConnectedUpdatedHook,
  devtoolsAppRecords,
  addDevToolsAppRecord,
  removeDevToolsAppRecord,
  activeAppRecord,
  setActiveAppRecord,
  setActiveAppRecordId,
  devtoolsState,
  resetDevToolsState,
  updateDevToolsState,
  onDevToolsConnected,
  addCustomTab,
  addCustomCommand,
  removeCustomCommand,
  toggleClientConnected,
  setOpenInEditorBaseUrl,
  devtoolsPluginBuffer,
  addDevToolsPluginToBuffer,
  UNDEFINED,
  INFINITY,
  NEGATIVE_INFINITY,
  NAN,
  isPlainObject,
  escape,
  createComponentsDevToolsPlugin,
  setupDevToolsPlugin,
  callDevToolsPluginSetupFn,
  removeRegisteredPluginApp,
  registerDevToolsPlugin,
  ROUTER_KEY,
  ROUTER_INFO_KEY,
  devtoolsRouterInfo,
  devtoolsRouter,
  createDevToolsApi,
  getDevToolsEnv,
  setDevToolsEnv,
  devtoolsContext,
  initDevTools,
  onDevToolsClientConnected,
  toggleHighPerfMode,
  getInspectorStateValueType,
  formatInspectorStateValue,
  getRaw,
  toEdit,
  toSubmit,
  updateDevToolsClientDetected,
  setElectronClientContext,
  setElectronProxyContext,
  setElectronServerContext,
  getExtensionClientContext,
  setExtensionClientContext,
  setIframeServerContext,
  setViteClientContext,
  setViteServerContext,
  setRpcServerToGlobal,
  getRpcClient,
  getRpcServer,
  setViteRpcClientToGlobal,
  setViteRpcServerToGlobal,
  getViteRpcClient,
  getViteRpcServer,
  createRpcClient,
  createRpcServer,
  createRpcProxy,
  stringify2,
  parse2,
  devtools
};
//# sourceMappingURL=chunk-TBHQQEY2.js.map
