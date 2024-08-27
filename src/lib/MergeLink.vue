<template>
  <div class="merge-link-wrapper">
    <slot name="button" :onClick="handleOnClick" :isReady="isReady"/>
  </div>
</template>

<script setup lang="ts">
import type { UseMergeLinkProps } from './types'
import { useMergeLink } from './useMergeLink';

const props = withDefaults(defineProps<UseMergeLinkProps>(), {
  shouldSendTokenOnSuccessfulLink: true
})

const { open, isReady } = useMergeLink(props);

const handleOnClick = () => open();

</script>
