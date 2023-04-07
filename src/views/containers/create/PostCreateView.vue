<template>
  <v-container fluid class="px-4">
    <p class="text-h4 mb-4">New Post</p>
    <v-textarea auto-grow label="Content" variant="solo" v-model="content"/>
    <v-btn @click="onPost" :loading="loading">Post</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postPostData } from '@/api'

const router = useRouter()

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: string
}>()

const content = ref('')
const loading = ref(false)

async function onPost () {
  loading.value = true
  const resp = await postPostData(parseInt(props.id), content.value)
  const data = await resp.json()
  loading.value = false
  await router.push({ name: 'thread_page', params: { id: props.id, page_num: data.page_num }, hash: `#P${data.post_id}` })
}
</script>

<style scoped>

</style>
