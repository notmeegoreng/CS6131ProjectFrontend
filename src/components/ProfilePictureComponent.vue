<template>
  <v-avatar v-if="is_avatar_set" :size="size">
    <v-img :src="getAvatarLink(parseInt(user_id))" alt="Profile Picture"/>
  </v-avatar>
  <v-avatar v-else :color="getColour(parseInt(user_id))" :size="size">
    {{ is_avatar_set ? '' : username.split(' ', 2).map(s => s.charAt(0).toUpperCase()).join('') }}
  </v-avatar>
</template>

<script setup lang="ts">
import { getAvatarLink, getColour } from '@/utils'

// eslint-disable-next-line no-undef, @typescript-eslint/no-unused-vars
const props = defineProps<{
  size: string,
  user_id: string,
  username: string,
  is_avatar_set: boolean
}>()
</script>

<style scoped>

</style>
