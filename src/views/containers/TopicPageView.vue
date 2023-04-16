<template>
  <v-container fluid>
    <SectionComponent
      name="Threads" :children="data.children"
      :get-to="o => { return { name: 'threads', params: { id: o.id } } }">
      <template #prepend="{ c }">
        <!--suppress JSUnresolvedVariable -->
        <ProfilePictureComponent size="50" v-bind="data.users[c.user_id]" :user_id="c.user_id" />
      </template>
    </SectionComponent>
    <v-btn
      color="secondary-darken-1" icon="mdi-plus"
      class="mb-8 me-8" position="fixed" location="bottom end"
      :to="{ name: 'thread_create', params: { id: id } }" />
    <v-pagination v-model="page"/>
  </v-container>
</template>

<script setup lang="ts">
import ProfilePictureComponent from '@/components/ProfilePictureComponent.vue'
import SectionComponent from '@/components/SectionComponent.vue'

import { ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { getTopicData } from '@/api'

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: string,
  page_num: string
}>()

type TopicData = {
  children: {
    user_xid: number;
    name: string;
    description: string;
  }[];
  users: Record<string, {
    username: string
    is_avatar_set: boolean;
    is_admin: boolean;
  }>;
}

const resp = await getTopicData(props.id, props.page_num)
const data = ref<TopicData>(await resp.json())
const page = ref(1)
console.log(data)

onBeforeRouteUpdate(async (to, from) => {
  if (to !== from) {
    const resp = await getTopicData(to.params.id as string, to.params.page_num as string)
    data.value = await resp.json()
  }
})
</script>

<style scoped>

</style>
