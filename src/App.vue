<script setup lang="ts">
import MergeLink from './lib/MergeLink.vue';
</script>

<template>
  <div id="app">
    <merge-link :link-token="''">
      <template #button="{onClick, isReady}">
        <button @click="onClick" :disabled="!isReady">Open Merge Link</button>
      </template>
    </merge-link>
  </div>
</template>
