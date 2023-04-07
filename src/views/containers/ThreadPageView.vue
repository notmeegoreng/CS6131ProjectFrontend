<template>
  <div>
    <template v-for="(post, i) in data.posts" :key="i">
      <v-card class="d-flex rounded-xl my-4" elevation="4" :id="'P' + post.post_id">
        <v-container fluid class="pa-0 ma-0">
          <v-row class="flex-nowrap">
            <v-col class="post_profile me-4 my-7 py-8 rounded-0" cols="auto">
              <v-row justify="center" class="mb-4">
                <ProfilePictureComponent v-bind="data.users[post.user_id]" :user_id="post.user_id" size="60"/>
              </v-row>
              <v-row justify="center" class="my-2">
                {{ data.users[post.user_id].username }}
              </v-row>
              <v-row justify="center">
                {{ data.users[post.user_id].profile_tag }}
              </v-row>
            </v-col>
            <v-col class="mb-2 mt-6 flex-grow-2 flex-wrap text-wrap" cols="auto">
              <v-card-text>
                <div v-html="processContent(post.content)" class="text-wrap" />
              </v-card-text>
            </v-col>
          </v-row>
          <v-divider />
          <v-row class="mx-4 my-1">
            <v-spacer />
            <v-col cols="auto">
              <router-link :to="{ name: 'thread_page', params: { id, page_num }, hash: '#P' + post.post_id }">
                Permalink
              </router-link>
              <v-dialog v-if="store.userID === post.user_id" v-model="deleteDialog" width="400">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props">Delete</v-btn>
                </template>
                <v-card>
                  <v-card-title>Logout</v-card-title>
                  <v-card-text>Are you sure you wish to log out?</v-card-text>
                  <v-card-actions>
                    <v-btn @click="delPost(post.post_id)">Delete</v-btn>
                    <v-btn @click="deleteDialog = false">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </template>
    <v-pagination
      v-model="page" :length="length" :disabled="length <= 1" @update:model-value="pageChange"
      show-first-last-page variant="tonal" />
    <v-btn
      color="secondary-darken-1" icon="mdi-plus"
      class="mb-8 me-8" position="fixed" location="bottom end"
      :to="{ name: 'post_create', params: { id:id } }"/>
  </div>
</template>

<script setup lang="ts">
import ProfilePictureComponent from '@/components/ProfilePictureComponent.vue'

import { computed, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { deletePost, getThreadData } from '@/api'

const router = useRouter()
const store = useStore()

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: string,
  page_num: string,
  last_pos: number
}>()

type ThreadData = {
  posts: {
    post_id: number,
    user_id: number,
    content: string,
  }[];
  users: Record<string, {
    username: string,
    profile_tag: string
    is_avatar_set: boolean,
    is_admin: boolean
  }>;
}

const PAGE_SIZE = 10

const data = ref<ThreadData>(await fetchData(props.id, props.page_num))
const deleteDialog = ref(false)
const page = ref(0)
const length = computed(() => Math.ceil(props.last_pos / PAGE_SIZE))

async function fetchData (id: string, page_num: string) {
  const resp = await getThreadData(id, page_num, history.state.invalidate_data)
  return await resp.json()
}

onBeforeRouteUpdate(async (to, from) => {
  if (to !== from) {
    data.value = await fetchData(to.params.id as string, to.params.page_num as string)
    window.scrollTo(0, 0)
  }
})

function processContent (content: string) {
  return content || ''
}

function delPost (postID: number) {
  deletePost(postID).then(() => fetchData(props.id, props.page_num)).then(() => { deleteDialog.value = false })
}

function pageChange (n: number, o: number) {
  console.log(n, o)
  if (n !== o) {
    router.push({ name: 'thread_page', params: { id: props.id, page_num: n + '' } })
  }
}
</script>

<style>
.spoiler {
  background-color: black;
  color: transparent;
  user-select: none;
}

.opened-spoiler, .spoiler:active, .spoiler:hover {
  background-color: #333333;
  color: inherit;
}

.post_profile {
  border-right: solid 2px gray;
  width: 24%;
  min-width: 10rem;
}
</style>
