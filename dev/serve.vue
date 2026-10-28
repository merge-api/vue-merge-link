<script>
import MergeLink from "../src/merge-link.vue";

let mountCount = 0;

export default {
  name: "ServeDev",
  components: { MergeLink },
  data() {
    return { tokenInput: "", linkToken: undefined, useContainer: false, logs: [], mounts: 0 };
  },
  created() {
    const wrap = () => {
      if (!window.MergeLink || window.MergeLink.__devWrapped) return;
      const original = window.MergeLink.initialize.bind(window.MergeLink);
      window.MergeLink.initialize = (config) => {
        this.log(`initialize(linkToken=…${String(config.linkToken).slice(-6)}, parentContainerID=${config.parentContainerID})`);
        return original(config);
      };
      window.MergeLink.__devWrapped = true;
    };
    const timer = setInterval(() => {
      wrap();
      if (window.MergeLink && window.MergeLink.__devWrapped) clearInterval(timer);
    }, 10);
  },
  methods: {
    log(message) {
      this.logs.push(`${new Date().toLocaleTimeString()}  ${message}`);
    },
    applyToken() {
      this.linkToken = this.tokenInput.trim() || undefined;
      this.log(`linkToken prop set to …${String(this.linkToken).slice(-6)} (no remount)`);
    },
    onMounted() {
      mountCount += 1;
      this.mounts = mountCount;
    },
  },
};
</script>

<template>
  <div id="app" style="font-family: sans-serif; max-width: 720px; margin: 24px auto">
    <h3>vue-merge-link dev harness</h3>
    <p>
      <input v-model="tokenInput" placeholder="Paste a link token" style="width: 420px" />
      <button @click="applyToken">Apply token</button>
    </p>
    <p>
      <label><input type="checkbox" v-model="useContainer" /> Embed in #link-container (parentContainerID)</label>
    </p>
    <p>MergeLink component mounts: <b>{{ mounts }}</b></p>
    <merge-link
      :linkToken="linkToken"
      :parentContainerID="useContainer ? 'link-container' : undefined"
      :onReady="() => log('onReady')"
      :onSuccess="(publicToken) => log(`onSuccess(…${publicToken.slice(-6)})`)"
      :onExit="() => log('onExit')"
      @vue:mounted="onMounted"
    >Open Merge Link</merge-link>
    <div id="link-container" style="margin-top: 12px; min-height: 40px; border: 1px dashed #aaa"></div>
    <pre style="background: #f4f4f4; padding: 8px; margin-top: 12px">{{ logs.join("\n") }}</pre>
  </div>
</template>
