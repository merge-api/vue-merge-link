<template>
  <div class="merge-link-wrapper">
    <slot name="button" v-bind:onClick="handleOnClick">
      <button class="merge-link-button" @click="handleOnClick">
        <slot />
      </button>
    </slot>
  </div>
</template>

<script>
export default {
  name: "MergeLink",
  props: {
    linkToken: String,
    shouldSendTokenOnSuccessfulLink: Boolean,
    onReady: Function,
    onSuccess: Function,
    onExit: Function,
    tenantConfig: Object,
  },
  created() {
    this.loadScript("https://cdn.merge.dev/initialize.js")
      .then(this.onScriptLoaded)
      .catch(this.onScriptError);
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
    },
  },
  watch: {
    $data: {
      handler() {
        this.onScriptLoaded();
      },
      deep: true,
    },
  },
};
</script>
