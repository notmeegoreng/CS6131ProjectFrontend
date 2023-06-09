<template>
  <div>
    <span id="start" />
    <template v-for="(post, i) in data.posts" :key="i">
      <v-card class="d-flex rounded-xl my-4" elevation="4" :id="'P' + post.post_id">
        <v-card-text class="max-width-100 post-wrapper">
          <div class="post_profile">
            <v-col>
              <v-row justify="center" class="my-4">
                <ProfilePictureComponent v-bind="data.users[post.user_id]" :user_id="post.user_id" size="60"/>
              </v-row>
              <v-row justify="center" class="my-2 text-center">
                {{ data.users[post.user_id].username }}
              </v-row>
              <v-row justify="center" class="mb-4 text-center">
                {{ data.users[post.user_id].profile_tag }}
              </v-row>
            </v-col>
          </div>
          <div class="post_content my-2">
            <!-- .ql-editor enables the styles that make the post look like in the editor-->
            <div v-html="post.content" class="ql-editor text-wrap flex-wrap" />
          </div>
          <div class="post_gutter">
            <v-row style="margin: 0">
              <v-col class="pb-0">
                <v-chip-group class="mb-2">
                  <v-chip v-for="(n, r) in post.reactions" :key="r"
                          v-on="store.userID !== 0 ? {
                                'click': () => n.reacted ? reactDec(post.post_id, r) : reactInc(post.post_id, r)
                              } : {}"
                          :class="{ 'reacted': n.reacted }" color="primary-darken-1">
                    {{ r }} {{ n.count }}
                  </v-chip>
                  <v-menu content-class="pb-2" attach location="top center" origin="bottom center">
                    <template #activator="{ props }">
                      <v-chip v-if="store.userID !== 0" v-bind="props">
                        +
                      </v-chip>
                    </template>
                    <v-card class="react_menu pa-2">
                      <v-chip v-for="r in getAvailableReactions(Object.keys(post.reactions))" :key="r"
                              @click="() => reactMake(post.post_id, r)" class="ma-0">
                        {{ r }}
                      </v-chip>
                    </v-card>
                  </v-menu>
                </v-chip-group>
              </v-col>
              <v-col v-if="(store.userID === post.user_id && post.post_id !== firstPostID) || store.isAdmin"
                     align-self="center" cols="auto" class="pa-0">
                <v-dialog :model-value="deleteDialogPostID === post.post_id"
                          @update:modelValue="v => deleteDialogPostID = v ? post.post_id : -1"
                          width="400" scrim="grey-darken-1">
                  <template v-slot:activator="{ props }">
                    <v-btn icon variant="flat" v-bind="props">
                      <v-icon icon="mdi-delete" size="30" />
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>Delete</v-card-title>
                    <v-card-text>
                      Are you sure you wish to delete this post?
                    </v-card-text>
                    <v-card-text v-if="post.post_id === firstPostID">
                      As this is the original post, deleting this will delete the thread as well!
                    </v-card-text>
                    <v-card-actions>
                      <v-btn @click="delPost(post.post_id)">Delete</v-btn>
                      <v-btn @click="deleteDialogPostID = -1">Cancel</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col align-self="center" cols="auto">
                <v-btn icon variant="flat" @click="copyLink(post.post_id)">
                  <v-icon icon="mdi-link-variant" size="30" />
                </v-btn>

              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </template>
    <v-pagination
      v-model="page" :length="length" :disabled="length <= 1" @update:model-value="pageChange"
      show-first-last-page variant="tonal" />
    <v-btn
      color="secondary-darken-1" icon="mdi-plus"
      class="mb-8 me-8" position="fixed" location="bottom end"
      :to="{ name: 'post_create', params: { id: id } }" />
    <v-snackbar v-model="linkSnackbar" timeout="1000">
      Link Copied!
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="linkSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

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

.post-wrapper {
  padding: 0;
  display: grid;
  grid-template-rows: auto minmax(70px, auto);
  grid-template-columns: 2fr 8fr;
  grid-template-areas:
    "pf cont"
    "pf gut";
}

.reacted {
  border: dashed 1px white;
}

.react_menu {
  display: grid !important;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-flow: row;
  gap: 4px
}

.post_profile {
  border-right: solid 1px gray;
  grid-area: pf;
}

.post_content {
  grid-area: cont;
}

.post_gutter {
  flex-basis: 0;
  border-top: solid 1px gray;
  font-size: .5rem;
  grid-area: gut;
}

.ql-editor p {
  word-break: break-all;
}

.max-width-100 {
  max-width: 100%;
}
</style>

<script setup lang="ts">
import ProfilePictureComponent from '@/components/ProfilePictureComponent.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css' // for the post content

import { computed, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { addReaction, deletePost, getAllReactions, getThreadData, remReaction } from '@/api'

const router = useRouter()
const store = useStore()

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: string,
  page_num: string,
  last_pos?: number,
  topic_id?: number
}>()

type ThreadData = {
  posts: {
    post_id: number,
    user_id: number,
    content: string,
    reactions: Record<string, { count: number, reacted: boolean }>
  }[];
  users: Record<string, {
    username: string,
    profile_tag: string
    is_avatar_set: boolean,
    is_admin: boolean
  }>;
}

const PAGE_SIZE = 10

const start_span = ref<HTMLElement | null>(null)
// js sets are ordered (fsr), so this is fine
const allReactions = new Set(await getAllReactions().then(r => r.json()))
const data = ref<ThreadData>(await fetchData(props.id, props.page_num))
const deleteDialogPostID = ref(-1)
const linkSnackbar = ref(false)
const page = ref(parseInt(props.page_num))
const length = computed(() => Math.ceil((props.last_pos ?? 0) / PAGE_SIZE))
const firstPostID = computed(() => data.value.posts[0].post_id)
console.log(data.value)
const test = ref(null)
watch(test, n => {
  console.log('test:', n)
})

async function fetchData (id: string, page_num: string) {
  const resp = await getThreadData(id, page_num)
  return await resp.json()
}

onBeforeRouteUpdate(async (to, from) => {
  if (to !== from) {
    data.value = await fetchData(to.params.id as string, to.params.page_num as string)
    start_span.value?.scrollIntoView()
  }
})

function getAvailableReactions (used: Iterable<string>) {
  const rs = new Set(allReactions)
  for (const r of used) {
    rs.delete(r)
  }
  return rs
}

function copyLink (postID: number) {
  const route = router.resolve({
    name: 'thread_page',
    params: { id: props.id, page_num: props.page_num },
    hash: '#P' + postID
  })
  console.log(route.path, route.fullPath)
  navigator.clipboard.writeText(new URL(route.href, window.location.origin).href)
    .then(() => { linkSnackbar.value = true })
}

function reactDec (post_id: number, r: string) {
  console.log('reacting')
  const p = data.value.posts.find(v => v.post_id === post_id)
  remReaction(post_id, r).then(resp => {
    console.log(p)
    if (resp.ok) {
      if (p) {
        if (p.reactions[r].count === 1) {
          delete p.reactions[r]
        } else {
          p.reactions[r].count -= 1
          p.reactions[r].reacted = false
        }
      } else {
        console.log('post not found!')
      }
    }
  })
}

function reactInc (post_id: number, r: string) {
  console.log('reacting')
  const p = data.value.posts.find(v => v.post_id === post_id)
  addReaction(post_id, r).then(resp => {
    console.log(p)
    if (resp.ok) {
      if (p) {
        p.reactions[r].count += 1
        p.reactions[r].reacted = true
      } else {
        console.log('post not found!')
      }
    }
  })
}

function reactMake (post_id: number, r: string) {
  console.log('make react')
  const p = data.value.posts.find(v => v.post_id === post_id)
  addReaction(post_id, r).then(resp => {
    if (resp.ok) {
      if (p) {
        p.reactions[r] = {
          count: 1,
          reacted: true
        }
      } else {
        console.log('post not found!')
      }
    }
  })
}

function delPost (postID: number) {
  deletePost(postID).then(() => {
    if (postID === firstPostID.value) {
      router.push({ name: 'topics', params: { id: props.topic_id } })
    }
    fetchData(props.id, props.page_num).then(d => {
      data.value = d
      deleteDialogPostID.value = -1
    })
  })
}

function pageChange (n: number, o: number) {
  console.log(n, o)
  if (n !== o) {
    router.push({ name: 'thread_page', params: { id: props.id, page_num: n + '' } })
  }
}
</script>
