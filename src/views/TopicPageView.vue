<template>
  <v-container fluid>
    <v-card class="mb-10 rounded-lg">
      <v-card-title class="my-2">Threads</v-card-title>
      <v-divider/><v-divider/><v-divider/>
      <template v-for="(thread, i) in data.threads" :key="i">
        <v-divider/>
        <v-list-item
          lines="three"
          :to="{ name: 'threads', params: { thread_id: thread.id } }">
          <template #title>
            <p v-text="thread.name" />
          </template>
          <template #prepend>
            <ProfilePictureComponent size="50" v-bind="data.users[thread.user_id]"/>
          </template>
          <v-list-item-subtitle v-text="thread.description"/>
        </v-list-item>
      </template>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import ProfilePictureComponent from '@/components/ProfilePictureComponent.vue'

import { ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { getTopicData } from '@/api'

// eslint-disable-next-line no-undef
const props = defineProps<{
  topic_id: string,
  page_num: string
}>()

type TopicData = {
  threads: {
    user_id: number;
    name: string;
    description: string;
  }[];
  users: Record<string, {
    username: string
    is_avatar_set: boolean;
    is_admin: boolean;
  }>;
}

const resp = await getTopicData(props.topic_id, props.page_num)
const data = ref<TopicData>(await resp.json())
console.log(data)

onBeforeRouteUpdate(async (to, from) => {
  if (to !== from) {
    const resp = await getTopicData(to.params.topic_id as string, to.params.page_num as string)
    data.value = await resp.json()
  }
})
</script>

<style scoped>

</style>
