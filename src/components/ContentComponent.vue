<template>
  <div class="ql-editor content">
    <div v-html="content" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<style>
.content {
  padding: 0 !important;
}
</style>
