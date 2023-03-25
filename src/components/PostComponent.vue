<template>
    <v-card class="d-flex rounded-xl ma-4" elevation="4" >
        <v-col class="mx-4 px-2 my-7 py-8 rounded-0" cols="2"  style="border-right: solid 2px gray">
            text text profile text <br> {{ post.poster.name }}
        </v-col>
        <v-col class="my-4 flex-grow-1">
            <div v-html="processedText"/>
        </v-col>
    </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import Post from '@/models/post'

// eslint-disable-next-line no-undef
const props = defineProps({
  post: {
    type: Post,
    required: true
  }
})

const notDone = ref(true)

const processedText = computed(() => {
  // todo: process markdown and spoilers here

  return props.post.content || ''
})

onMounted(() => {
  if (notDone.value) {
    notDone.value = false

    Array.from(document.querySelectorAll('.spoiler')).forEach(spoiler => {
      spoiler.addEventListener('click', () => {
        spoiler.classList.add('opened-spoiler')
      })
    }, false)
  }
})
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
</style>
