'use strict';var vue=require('vue');var script = {
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
    filePickerConfig: Object
  },
  created: function created() {
    this.loadScript("https://cdn.merge.dev/initialize.js").then(this.onScriptLoaded).catch(this.onScriptError);
  },
  methods: {
    onScriptError: function onScriptError() {
      console.error("There was an issue loading the link-initialize.js script");
    },
    onScriptLoaded: function onScriptLoaded() {
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
    handleOnClick: function handleOnClick() {
      window.MergeLink.openLink();
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
    $data: {
      handler: function handler() {
        this.onScriptLoaded();
      },
      deep: true
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