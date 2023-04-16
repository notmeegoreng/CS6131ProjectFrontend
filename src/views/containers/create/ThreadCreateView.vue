<template>
  <v-container fluid class="pl-4">
    <p class="text-h4 mb-4">New Thread</p>
    <p class="text-h6 mb-4">Thread Title</p>
    <v-text-field v-model="title" :rules="[v => !!v || 'Required']" />
    <p class="text-h6 mb-4">Original Post Content</p>
    <QuillEditor class="editor" v-model:content="content" content-type="html" />
    <v-btn class="mt-4" @click="create" :loading="loading">Create</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postThreadData } from '@/api'

import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'

const router = useRouter()

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: string
}>()

const title = ref('')
const content = ref('')
const loading = ref(false)

async function create () {
  loading.value = true
  const resp = await postThreadData(parseInt(props.id), title.value, content.value)
  const thread_id = await resp.json()
  loading.value = false
  await router.push({ name: 'thread_page', params: { id: thread_id, page_num: 1 } })
}
</script>

<style>
.editor {
  min-height: 100px; /* approximately 4 lines */
}
</style>
