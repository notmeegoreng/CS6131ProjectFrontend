<template>
  <v-container fluid class="px-4">
    <p class="text-h4 mb-4">New Post</p>
    <QuillEditor class="editor" v-model:content="content" content-type="html" />
    <v-btn class="mt-4" @click="create" :loading="loading" variant="outlined">Post</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'

import { postPostData } from '@/api'

const router = useRouter()

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: string
}>()

const content = ref('')
const loading = ref(false)

async function create () {
  loading.value = true
  const resp = await postPostData(parseInt(props.id), content.value)
  const data = await resp.json()
  loading.value = false
  await router.push({ name: 'thread_page', params: { id: props.id, page_num: data.page_num }, hash: `#P${data.post_id}` })
}
</script>

<style>
.editor {
  min-height: 100px; /* approximately 4 lines */
}
</style>
