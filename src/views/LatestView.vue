<template>
  <v-container fluid>
    <p class="text-h4">Latest Active Threads</p>
    <p class="text-h6 mb-4">Find the latest posts from the latest threads!</p>
    <SectionComponent v-for="t in data.threads" :key="t.container.id"
                      :name="t.container.name" :description="t.container.description" :children="t.children"
                      :get-to="o => { return { name: 'thread_page', params: {
                        id: t.container.id, page_num: Math.ceil(o.post_pos / PAGE_SIZE)
                      } } }">
      <template #title="{ c }">
        <p v-text="data.users[c.user_id].username" />
      </template>
      <template #prepend="{ c }">
        <!--suppress JSValidateTypes -->
        <ProfilePictureComponent size="50" v-bind="data.users[c.user_id]" :user_id="c.user_id" />
      </template>
    </SectionComponent>
  </v-container>
</template>

<script setup lang="ts">
import ProfilePictureComponent from '@/components/ProfilePictureComponent.vue'
import SectionComponent from '@/components/SectionComponent.vue'
import { getLatestData } from '@/api'

const PAGE_SIZE = 10

type LatestData = {
  threads: {
    container: { id: number, name: string, description: string },
    children: { post_id: number, user_id: number, username: string, post_pos: number, content: string }[]
  }[],
  users: Record<number, { username: string, is_avatar_set: boolean }>
}

const data: LatestData = await getLatestData().then(r => r.json())
console.log(data)
</script>*

<style scoped>

</style>
