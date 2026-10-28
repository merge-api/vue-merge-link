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
const DEFAULT_CDN_URL = "https://cdn.merge.dev/initialize.js";
// Keep in sync with BASE_URL_TO_CDN_MAP in merge-api/react-merge-link src/useMergeLink.tsx.
const BASE_URL_TO_CDN_MAP = {
  "https://api.merge.dev": DEFAULT_CDN_URL,
  "https://api-oai-usw2.openaimerge.com": "https://cdn.openaimerge.com/initialize.js",
  "https://api-oai-euw1.openaimerge.com": "https://cdn.openaimerge.com/initialize.js",
  "https://api-oai-apne3.openaimerge.com": "https://cdn.openaimerge.com/initialize.js",
  "https://api-oai-apne2.openaimerge.com": "https://cdn.openaimerge.com/initialize.js",
  "https://api-oai-apse2.openaimerge.com": "https://cdn.openaimerge.com/initialize.js",
  "https://api-develop.merge.dev": "https://develop-cdn.merge.dev/initialize.js",
  "https://api-mu-develop.merge.dev": "https://mu-develop-cdn.merge.dev/initialize.js",
  "https://api-mu-staging.merge.dev": "https://mu-staging-cdn.merge.dev/initialize.js",
  "https://api-usw2.dropboxmerge.com": "https://cdn.dropboxmerge.com/initialize.js",
};

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
    // all props are optional by default
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
          "types" in filePickerConfigValue
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
    parentContainerID: String,
  },
  data() {
    return { isScriptLoaded: false };
  },
  computed: {
    scriptSrc() {
      const apiBaseURL = this.tenantConfig && this.tenantConfig.apiBaseURL;
      return (apiBaseURL && BASE_URL_TO_CDN_MAP[apiBaseURL]) || DEFAULT_CDN_URL;
    },
    initializeInputs() {
      return {
        linkToken: this.linkToken,
        tenantConfig: this.tenantConfig,
        shouldSendTokenOnSuccessfulLink: this.shouldSendTokenOnSuccessfulLink,
        filePickerConfig: this.filePickerConfig,
        parentContainerID: this.parentContainerID,
      };
    },
    // Parents often pass object props inline, which creates a new object every render; keying on the
    // serialized values (functions drop out of JSON) re-initializes Link only when a value actually changes.
    initializeInputsKey() {
      return JSON.stringify(this.initializeInputs);
    },
  },
  created() {
    this.loadScript(this.scriptSrc)
      .then(this.onScriptLoaded)
      .catch(this.onScriptError);
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
      // Callbacks read the current prop at call time, so swapping a handler doesn't re-initialize Link.
      window.MergeLink.initialize({
        ...this.initializeInputs,
        filePickerConfig: this.filePickerConfig && {
          ...this.filePickerConfig,
          onSubmit: (...args) => this.filePickerConfig && this.filePickerConfig.onSubmit(...args),
        },
        onExit: (...args) => this.onExit && this.onExit(...args),
        onReady: (...args) => this.onReady && this.onReady(...args),
        onSuccess: (...args) => this.onSuccess && this.onSuccess(...args),
        onValidationError: (...args) => this.onValidationError && this.onValidationError(...args),
      });
    },
    handleOnClick() {
      if (window.MergeLink) {
        window.MergeLink.openLink(this.initializeInputs);
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
    },
  },
  watch: {
    initializeInputsKey() {
      this.initialize();
    },
  },
};
</script>
