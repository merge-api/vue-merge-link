import { openBlock, createElementBlock, renderSlot, createElementVNode } from 'vue';

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

        const hasTypes = "types" in value ? typeof filePickerConfigValue.types === "object" : true; // arrays come back as objects
        // allowMultiSelect is optional

        const hasAllowMultiSelect = "allowMultiSelect" in filePickerConfigValue ? typeof filePickerConfigValue.allowMultiSelect === "boolean" : true;
        return hasOnSubmit && hasTypes && hasAllowMultiSelect;
      }
    }
  },

  created() {
    this.loadScript("https://cdn.merge.dev/initialize.js").then(this.onScriptLoaded).catch(this.onScriptError);
  },

  methods: {
    onScriptError() {
      console.error("There was an issue loading the link-initialize.js script");
    },

    onScriptLoaded() {
      window.MergeLink.initialize({
        linkToken: this.linkToken,
        tenantConfig: this.tenantConfig,
        shouldSendTokenOnSuccessfulLink: this.shouldSendTokenOnSuccessfulLink,
        onExit: this.onExit,
        onReady: this.onReady,
        onSuccess: this.onSuccess,
        onValidationError: this.onValidationError,
        filePickerConfig: this.filePickerConfig
      });
    },

    handleOnClick() {
      window.MergeLink.openLink();
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
    $data: {
      handler() {
        this.onScriptLoaded();
      },

      deep: true
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
