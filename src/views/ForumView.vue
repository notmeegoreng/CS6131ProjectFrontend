<template>
  <v-container fluid class="px-8">
    <TitledBreadcrumbs v-once :parents="convertToCrumbs(data.parents)" :current="data.container.name"/>
    <v-container fluid>
      <v-card class="mb-10 rounded-lg">
        <v-card-title class="my-2">Topics</v-card-title>
        <v-divider/><v-divider/><v-divider/>
        <template v-for="(topic, i) in data.children" :key="i">
          <v-divider/>
          <v-list-item
            lines="three"
            :to="{ name: 'topics', params: { topic_id: topic.id } }">
            <template #title>
              <p v-text="topic.name"/>
            </template>
            <v-list-item-subtitle v-text="topic.description"/>
          </v-list-item>
        </template>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import TitledBreadcrumbs from '@/components/TitledBreadcrumbs.vue'

import { getForumData } from '@/api'
import { convertToCrumbs } from '@/utils'

// eslint-disable-next-line no-undef
const props = defineProps({
  forum_id: {
    type: String,
    required: true
  }
})

const resp = await getForumData(props.forum_id)
const data = await resp.json()

console.log(data)
</script>
