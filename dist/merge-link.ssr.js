'use strict';var vue=require('vue');function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}var DEFAULT_CDN_URL = "https://cdn.merge.dev/initialize.js"; // Keep in sync with BASE_URL_TO_CDN_MAP in merge-api/react-merge-link src/useMergeLink.tsx.

var BASE_URL_TO_CDN_MAP = {
  "https://api.merge.dev": DEFAULT_CDN_URL,
  "https://api-oai-usw2.openaimerge.com": "https://cdn.openaimerge.com/initialize.js",
  "https://api-oai-euw1.openaimerge.com": "https://cdn.openaimerge.com/initialize.js",
  "https://api-oai-apne3.openaimerge.com": "https://cdn.openaimerge.com/initialize.js",
  "https://api-oai-apne2.openaimerge.com": "https://cdn.openaimerge.com/initialize.js",
  "https://api-oai-apse2.openaimerge.com": "https://cdn.openaimerge.com/initialize.js",
  "https://api-develop.merge.dev": "https://develop-cdn.merge.dev/initialize.js",
  "https://api-mu-develop.merge.dev": "https://mu-develop-cdn.merge.dev/initialize.js",
  "https://api-mu-staging.merge.dev": "https://mu-staging-cdn.merge.dev/initialize.js",
  "https://api-usw2.dropboxmerge.com": "https://cdn.dropboxmerge.com/initialize.js"
};
var script = {
  name: "MergeLink",
  props: {
    linkToken: String,

    /**
     * Make Link call `onSuccess` immediately after an account has been successfully linked instead of after the user closes the Link modal.
     * Defaults to `true` as of v3.0.0. The default is `false` in prior versions.
     */
    shouldSendTokenOnSuccessfulLink: {
      type: Boolean,
      default: true
    },
    onReady: Function,
    onSuccess: Function,
    onExit: Function,
    tenantConfig: Object,
    onValidationError: Function,
    // all props are optional by default
    filePickerConfig: {
      type: Object,
      required: false,
      validator: function validator(filePickerConfigValue) {
        // onSubmit is required
        var hasOnSubmit = "onSubmit" in filePickerConfigValue && typeof filePickerConfigValue.onSubmit === "function"; // types is optional

        var hasTypes = "types" in filePickerConfigValue ? _typeof(filePickerConfigValue.types) === "object" : true; // arrays come back as objects
        // allowMultiSelect is optional

        var hasAllowMultiSelect = "allowMultiSelect" in filePickerConfigValue ? typeof filePickerConfigValue.allowMultiSelect === "boolean" : true;
        return hasOnSubmit && hasTypes && hasAllowMultiSelect;
      }
    },
    parentContainerID: String
  },
  data: function data() {
    return {
      isScriptLoaded: false
    };
  },
  computed: {
    scriptSrc: function scriptSrc() {
      var apiBaseURL = this.tenantConfig && this.tenantConfig.apiBaseURL;
      return apiBaseURL && BASE_URL_TO_CDN_MAP[apiBaseURL] || DEFAULT_CDN_URL;
    },
    initializeInputs: function initializeInputs() {
      return {
        linkToken: this.linkToken,
        tenantConfig: this.tenantConfig,
        shouldSendTokenOnSuccessfulLink: this.shouldSendTokenOnSuccessfulLink,
        filePickerConfig: this.filePickerConfig,
        parentContainerID: this.parentContainerID
      };
    },
    // Parents often pass object props inline, which creates a new object every render; keying on the
    // serialized values (functions drop out of JSON) re-initializes Link only when a value actually changes.
    initializeInputsKey: function initializeInputsKey() {
      return JSON.stringify(this.initializeInputs);
    }
  },
  created: function created() {
    this.loadScript(this.scriptSrc).then(this.onScriptLoaded).catch(this.onScriptError);
  },
  methods: {
    onScriptError: function onScriptError() {
      console.error("There was an issue loading the link-initialize.js script");
    },
    onScriptLoaded: function onScriptLoaded() {
      this.isScriptLoaded = true;
      this.initialize();
    },
    initialize: function initialize() {
      var _this = this;

      if (!this.isScriptLoaded || !window.MergeLink || this.linkToken === undefined) {
        return;
      } // Callbacks read the current prop at call time, so swapping a handler doesn't re-initialize Link.


      window.MergeLink.initialize(_objectSpread2(_objectSpread2({}, this.initializeInputs), {}, {
        filePickerConfig: this.filePickerConfig && _objectSpread2(_objectSpread2({}, this.filePickerConfig), {}, {
          onSubmit: function onSubmit() {
            var _this$filePickerConfi;

            return _this.filePickerConfig && (_this$filePickerConfi = _this.filePickerConfig).onSubmit.apply(_this$filePickerConfi, arguments);
          }
        }),
        onExit: function onExit() {
          return _this.onExit && _this.onExit.apply(_this, arguments);
        },
        onReady: function onReady() {
          return _this.onReady && _this.onReady.apply(_this, arguments);
        },
        onSuccess: function onSuccess() {
          return _this.onSuccess && _this.onSuccess.apply(_this, arguments);
        },
        onValidationError: function onValidationError() {
          return _this.onValidationError && _this.onValidationError.apply(_this, arguments);
        }
      }));
    },
    handleOnClick: function handleOnClick() {
      if (window.MergeLink) {
        window.MergeLink.openLink(this.initializeInputs);
      }
    },
    loadScript: function loadScript(src) {
      return new Promise(function (resolve, reject) {
        if (document.querySelector('script[src="' + src + '"]')) {
          resolve();
          return;
        }

        var el = document.createElement("script");
        el.type = "text/javascript";
        el.async = true;
        el.src = src;
        el.addEventListener("load", resolve);
        el.addEventListener("error", reject);
        el.addEventListener("abort", reject);
        document.head.appendChild(el);
      });
    }
  },
  watch: {
    initializeInputsKey: function initializeInputsKey() {
      this.initialize();
    }
  }
};var _hoisted_1 = {
  class: "merge-link-wrapper"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [vue.renderSlot(_ctx.$slots, "button", {
    onClick: $options.handleOnClick
  }, function () {
    return [vue.createElementVNode("button", {
      class: "merge-link-button",
      onClick: _cache[0] || (_cache[0] = function () {
        return $options.handleOnClick && $options.handleOnClick.apply($options, arguments);
      })
    }, [vue.renderSlot(_ctx.$slots, "default")])];
  })]);
}script.render = render;// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(function () {
  // Get component instance
  var installable = script; // Attach install function executed by Vue.use()

  installable.install = function (Vue) {
    Vue.component('MergeLink', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
module.exports=entry_esm;