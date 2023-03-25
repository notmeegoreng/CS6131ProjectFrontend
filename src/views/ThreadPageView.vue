<template>
  <div class="mb-16" >
    <PostComponent v-for="(post, i) in posts" :key="i" :post="post"/>
  </div>
</template>

<script setup>
import PostComponent from '@/components/PostComponent.vue'

import { ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import Post from '@/models/post'
import Profile from '@/models/profile'
import { getThreadData } from '@/api'

// eslint-disable-next-line no-undef
const props = defineProps({
  thread_id: String,
  page_num: String
})

const posts = ref([
  new Post(new Profile('green!', 4), '1 text test <b> <i> green </i>  a </b>'),
  new Post(new Profile('weewoo', 4), '2 <span class=spoiler @click="spoil"> test </span>'),
  new Post(new Profile('green!', 4), '1 text test <b> <i> green </i>  a </b>'),
  new Post(new Profile('green!', 4), '1 text test <b> <i> green </i>  a </b>'),
  new Post(new Profile('weewoo', 4), '2 <span class=spoiler @click="spoil"> test </span>')
])

onBeforeRouteUpdate(async (to, from) => {
  const resp = await getThreadData(from.params.thread_id, from.params.page_num)
  posts.value = await resp.json()
})
</script>
