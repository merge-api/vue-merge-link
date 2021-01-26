import { openBlock, createBlock, renderSlot, createVNode } from 'vue';

var script = {
  name: "MergeLink",
  props: {
    linkToken: String,
    onReady: Function,
    onSuccess: Function,
    onExit: Function
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
        onExit: this.onExit,
        onReady: this.onReady,
        onSuccess: this.onSuccess
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
  return openBlock(), createBlock("div", _hoisted_1, [renderSlot(_ctx.$slots, "button", {
    onClick: $options.handleOnClick
  }, () => [createVNode("button", {
    class: "merge-link-button",
    onClick: _cache[1] || (_cache[1] = (...args) => $options.handleOnClick && $options.handleOnClick(...args))
  }, [renderSlot(_ctx.$slots, "default")])])]);
}

script.render = render;
script.__file = "src/MergeLink.vue";

module.exports = script;
