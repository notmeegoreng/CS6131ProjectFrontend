<template>
  <v-card class="mb-10 rounded-lg">
    <v-card-title class="mt-2" v-text="name"/>
    <v-card-subtitle v-if="description" class="mb-4" v-text="description"/>
    <v-divider thickness="3" />
    <template v-for="(c, i) in children" :key="i">
      <slot name="divider">
        <v-divider />
      </slot>
      <v-list-item
        class="align-content-start"
        lines="three"
        :to="getTo(c)">
        <template #title>
          <p v-text="c.name || c.username" />
        </template>
        <template #prepend>
          <v-icon icon="mdi-arrow-right" color="secondary" />
          <slot name="prepend" :c="c" />
        </template>
        <v-list-item-subtitle v-if="c.description" v-text="c.description" />
        <v-list-item-subtitle v-else v-text="c.content" />
      </v-list-item>
    </template>
  </v-card>
</template>

<script setup lang="ts">
type Converter = (c: object) => object
// eslint-disable-next-line no-undef
defineProps<{
  name: string,
  description?: string
  children: {
    name?: string,
    username?: string
    description?: string,
    content?: string,
  }[],
  getTo: Converter
}>()
</script>

<style scoped>

</style>
