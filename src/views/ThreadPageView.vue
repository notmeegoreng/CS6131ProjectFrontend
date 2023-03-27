<template>
  <div class="mb-16" >
    <PostComponent v-for="(post, i) in data.posts" :key="i" :post="post" :user="data.users[post.user_id]"/>
  </div>
</template>

<script setup lang="ts">
import PostComponent from '@/components/PostComponent.vue'

import { ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { getThreadData } from '@/api'

// eslint-disable-next-line no-undef
const props = defineProps<{
  thread_id: string,
  page_num: string
}>()

type ThreadData = {
  posts: {
    post_id: number;
    user_id: number;
    content: string;
  }[];
  users: Record<string, {
    username: string
    is_avatar_set: boolean;
    is_admin: boolean;
  }>;
}

const resp = await getThreadData(props.thread_id, props.page_num)
const data = ref<ThreadData>(await resp.json())

onBeforeRouteUpdate(async (to, from) => {
  if (to !== from) {
    const resp = await getThreadData(to.params.thread_id as string, to.params.page_num as string)
    data.value = await resp.json()
  }
})
</script>
