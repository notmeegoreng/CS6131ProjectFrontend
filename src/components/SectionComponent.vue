<template>
  <v-card class="mb-10 rounded-lg">
    <v-card-title class="mt-2">{{ name }}</v-card-title>
    <v-card-subtitle v-if="description" class="mb-4">{{ description }}</v-card-subtitle>
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
          <slot name="title" :c="c">
            <p v-text="c.name || c.username" />
          </slot>
        </template>
        <template #prepend>
          <v-icon icon="mdi-arrow-right" color="secondary" />
          <slot name="prepend" :c="c" />
        </template>
        <v-list-item-subtitle>
          <ContentComponent :content="c.description ? c.description : c.content" />
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/ContentComponent.vue'

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
    [key:string]: unknown
  }[],
  getTo: Converter
}>()
</script>

<style scoped>

</style>
