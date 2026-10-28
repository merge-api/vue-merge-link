import { openBlock, createElementBlock, renderSlot, createElementVNode } from 'vue';

const DEFAULT_CDN_URL = "https://cdn.merge.dev/initialize.js"; // Subset of BASE_URL_TO_CDN_MAP in merge-api/react-merge-link src/useMergeLink.tsx.

const BASE_URL_TO_CDN_MAP = {
  "https://api.merge.dev": DEFAULT_CDN_URL,
  "https://api-develop.merge.dev": "https://develop-cdn.merge.dev/initialize.js",
  "https://api-mu-develop.merge.dev": "https://mu-develop-cdn.merge.dev/initialize.js",
  "https://api-mu-staging.merge.dev": "https://mu-staging-cdn.merge.dev/initialize.js"
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
      validator: function (filePickerConfigValue) {
        // onSubmit is required
        const hasOnSubmit = "onSubmit" in filePickerConfigValue && typeof filePickerConfigValue.onSubmit === "function"; // types is optional

        const hasTypes = "types" in filePickerConfigValue ? typeof filePickerConfigValue.types === "object" : true; // arrays come back as objects
        // allowMultiSelect is optional

        const hasAllowMultiSelect = "allowMultiSelect" in filePickerConfigValue ? typeof filePickerConfigValue.allowMultiSelect === "boolean" : true;
        return hasOnSubmit && hasTypes && hasAllowMultiSelect;
      }
    },
    parentContainerID: String
  },

  data() {
    return {
      isScriptLoaded: false
    };
  },

  computed: {
    scriptSrc() {
      const apiBaseURL = this.tenantConfig && this.tenantConfig.apiBaseURL;
      return apiBaseURL && BASE_URL_TO_CDN_MAP[apiBaseURL] || DEFAULT_CDN_URL;
    },

    initializeInputs() {
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
    initializeInputsKey() {
      return JSON.stringify(this.initializeInputs);
    }

  },

  created() {
    this.loadScript(this.scriptSrc).then(this.onScriptLoaded).catch(this.onScriptError);
  },

  methods: {
    onScriptError() {
      console.error("There was an issue loading the link-initialize.js script");
    },

    onScriptLoaded() {
      this.isScriptLoaded = true;
      this.initialize();
    },

    initialize() {
      if (!this.isScriptLoaded || !window.MergeLink || this.linkToken === undefined) {
        return;
      }

      window.MergeLink.initialize(this.buildLinkConfig());
    },

    // Callbacks read the current prop at call time, so swapping a handler doesn't re-initialize Link.
    buildLinkConfig() {
      var _this = this;

      return { ...this.initializeInputs,
        filePickerConfig: this.filePickerConfig && { ...this.filePickerConfig,
          onSubmit: function () {
            return _this.filePickerConfig && _this.filePickerConfig.onSubmit(...arguments);
          }
        },
        onExit: function () {
          return _this.onExit && _this.onExit(...arguments);
        },
        onReady: function () {
          return _this.onReady && _this.onReady(...arguments);
        },
        onSuccess: function () {
          return _this.onSuccess && _this.onSuccess(...arguments);
        },
        onValidationError: function () {
          return _this.onValidationError && _this.onValidationError(...arguments);
        }
      };
    },

    handleOnClick() {
      if (window.MergeLink) {
        // initialize.js replaces its stored callbacks from this config when the token differs, so it needs them too.
        window.MergeLink.openLink(this.buildLinkConfig());
      }
    },

    loadScript(src) {
      return new Promise(function (resolve, reject) {
        if (document.querySelector('script[src="' + src + '"]')) {
          resolve();
          return;
        }

        const el = document.createElement("script");
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
    initializeInputsKey() {
      this.initialize();
    }

  }
};

const _hoisted_1 = {
  class: "merge-link-wrapper"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [renderSlot(_ctx.$slots, "button", {
    onClick: $options.handleOnClick
  }, () => [createElementVNode("button", {
    class: "merge-link-button",
    onClick: _cache[0] || (_cache[0] = function () {
      return $options.handleOnClick && $options.handleOnClick(...arguments);
    })
  }, [renderSlot(_ctx.$slots, "default")])])]);
}

script.render = render;

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = script; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('MergeLink', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
