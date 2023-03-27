<template>
  <v-card class="d-flex rounded-xl ma-4" elevation="4" >
    <v-col class="post_profile me-4 my-7 py-8 rounded-0" cols="auto">
      <v-row justify="center" class="mb-4">
        <ProfilePictureComponent v-bind="user" size="60"/>
      </v-row>
      <v-row justify="center" class="my-2">
        {{ user.username }}
      </v-row>
      <v-row justify="center">
        {{ user.profile_tag }}
      </v-row>
    </v-col>
    <v-col class="my-4 flex-grow-1">
      <div v-html="processedText"/>
    </v-col>
  </v-card>
</template>

<script setup lang="ts">
import ProfilePictureComponent from '@/components/ProfilePictureComponent.vue'

import { computed, onMounted, ref } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
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

.post_profile {
  border-right: solid 2px gray;
  width: 24%;
  min-width: 10rem
}
</style>
