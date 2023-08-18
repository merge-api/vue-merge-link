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
    /**
     * Make Link call `onSuccess` immediately after an account has been successfully linked instead of after the user closes the Link modal.
     * Defaults to `true` as of v3.0.0. The default is `false` in prior versions.
     */
    shouldSendTokenOnSuccessfulLink: { type: Boolean, default: true },
    onReady: Function,
    onSuccess: Function,
    onExit: Function,
    tenantConfig: Object,
    onValidationError: Function,
    filePickerConfig: {
      type: Object,
      required: false,
      validator: function (filePickerConfigValue) {
        // onSubmit is required
        const hasOnSubmit =
          "onSubmit" in filePickerConfigValue &&
          typeof filePickerConfigValue.onSubmit === "function";
        // types is optional
        const hasTypes =
          "types" in value
            ? typeof filePickerConfigValue.types === "object"
            : true; // arrays come back as objects
        // allowMultiSelect is optional
        const hasAllowMultiSelect =
          "allowMultiSelect" in filePickerConfigValue
            ? typeof filePickerConfigValue.allowMultiSelect === "boolean"
            : true;
        return hasOnSubmit && hasTypes && hasAllowMultiSelect;
      },
    },
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
        onValidationError: this.onValidationError,
        filePickerConfig: this.filePickerConfig,
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
