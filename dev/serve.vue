<script>
import Vue from 'vue';
import MergeLink from '../src/merge-link.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    MergeLink
  }
});
</script>

<template>
  <div id="app">
    <merge-link />
  </div>
</template>
