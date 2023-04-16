<template>
  <v-avatar v-if="is_avatar_set" :size="size">
    <v-img :src="getAvatarLink(user_id_number)" alt="Profile Picture"/>
    <slot />
  </v-avatar>
  <v-avatar v-else :color="getColour(user_id_number)" :size="size" class="text-uppercase">
    {{ is_avatar_set ? '' : username.split(' ', 2).map(s => s.charAt(0)).join('') }}
    <slot />
  </v-avatar>
</template>

<script setup lang="ts">
import { getAvatarLink, getColour } from '@/utils'
import { computed } from 'vue'

// eslint-disable-next-line no-undef, @typescript-eslint/no-unused-vars
const props = defineProps<{
  size: string,
  user_id: number | string,
  username: string,
  is_avatar_set: boolean
}>()

const user_id_number = computed(() => typeof props.user_id === 'number' ? props.user_id : parseInt(props.user_id))
</script>

<style scoped>

</style>
