<template>
  <v-container fluid>
    <v-card class="mb-10 rounded-lg">
      <v-card-title class="my-2">Threads</v-card-title>
      <v-divider/><v-divider/><v-divider/>
      <template v-for="(thread, i) in data" :key="i">
        <v-divider/>
        <v-list-item
          lines="three"
          :to="{ name: 'threads', params: { thread_id: thread.id } }">
          <template #title>
            <p v-text="thread.name"/>
          </template>
          <v-list-item-subtitle v-text="thread.description"/>
        </v-list-item>
      </template>
    </v-card>
  </v-container>
</template>

<script setup>
import { getTopicData } from '@/api'

// eslint-disable-next-line no-undef
const props = defineProps({
  topic_id: String,
  page_num: String
})

const resp = await getTopicData(props.topic_id, props.page_num)
const data = await resp.json()

console.log(data)
</script>

<style scoped>

</style>
