<template>
  <v-container fluid class="pl-4">
    <p v-if="welcome" class="text-h5 mb-6">Welcome, {{ userData.username }}</p>

    <v-card class="mx-4 pa-8 rounded-xl" v-if="userData !== null">
      <v-card-title>
        <v-row class="ma-1">
          <v-col cols="auto">
            <v-hover v-slot="{ isHovering, props }">
              <v-avatar v-if="userData.is_avatar_set" v-bind="props" size="80">
                <v-img :src="imageSrc" alt="Profile Picture">
                </v-img>
                <v-expand-transition>
                  <div
                    v-if="isHovering && !notEditing"
                    class="d-flex transition-fast-in-fast-out bg-orange-darken-2 v-card--reveal text-h2"
                    style="height: 100%;"/>
                </v-expand-transition>
              </v-avatar>
              <v-avatar
                v-else v-bind="props"
                :color="colour" size="80">
                {{ userData.is_avatar_set ? '' : initials }}
                <v-expand-transition>
                  <div
                    v-if="isHovering && !notEditing"
                    class="d-flex transition-fast-in-fast-out bg-orange-darken-2 v-card--reveal text-h2"
                    style="height: 100%;"/>
                </v-expand-transition>
              </v-avatar>
            </v-hover>
          </v-col>
          <v-col>
            <p class="ma-4 justify-center flex-fill">{{ userData.username }}</p>
          </v-col>
        </v-row>
      </v-card-title>
      <v-form ref="editForm" @submit.prevent="toggleEditing">
      <v-list-item>
        <v-list-item-title class="ms-2 mb-4">Profile Tag</v-list-item-title>
        <v-textarea
          variant="solo" rows=3 auto-grow
          :hint="notEditing ? '' : 'This is shown below your name and avatar when you post!'"
          :rules="[v => v.length <= maxTagLength || `Max ${maxTagLength} Characters`]"
          :readonly="notEditing" v-model="userData.profile_tag"
          :placeholder="notEditing ? '' : 'Type something here!'" :persistent-placeholder="!notEditing">
          <template #details>
            <v-counter :active="!notEditing" :value="userData.profile_tag.length" :max="maxTagLength"/>
          </template>
        </v-textarea>
      </v-list-item>
      <v-list-item>
        <v-list-item-title class="ms-2 mb-4">Description</v-list-item-title>
        <v-textarea
          variant="solo" auto-grow
          :hint="notEditing ? '' : 'Others can read this by going to your profile!'"
          :rules="[v => v.length <= maxDescriptionLength || `Max ${maxDescriptionLength} Characters`]"
          :readonly="notEditing" v-model="userData.description"
          :placeholder="notEditing ? '' : 'Type something here!'" :persistent-placeholder="!notEditing">
          <template #details>
            <v-counter :active="!notEditing" :value="userData.description.length" :max="maxDescriptionLength"/>
          </template>
        </v-textarea>
      </v-list-item>
      <v-card-actions class="align-center">
        <v-layout justify-end v-if="canEdit">
          <v-btn variant="outlined" class="align-center mt-4" width="100" type="submit">
            {{ notEditing ? 'Edit' : 'Editing' }}
          </v-btn>
        </v-layout>
      </v-card-actions>
      </v-form>
    </v-card>
    <p v-else class="text-h5">User not found</p>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from 'vue'
import { getUserData } from '@/api'
import { onBeforeRouteUpdate } from 'vue-router'
import { useStore } from '@/store'
import router from '@/router'
import { getColour } from '@/utils'

const maxTagLength = 64
const maxDescriptionLength = 1024

const store = useStore()

// eslint-disable-next-line no-undef
const props = defineProps({
  user_id: {
    type: String,
    required: false
  }
})

async function getData (userID: string | undefined) {
  if (userID === undefined) {
    if (store.userID === 0) {
      // not logged in
      await router.push({ name: 'login' })
      return
    }
    userID = store.userID.toString()
  }
  const result = await getUserData(userID)
  if (result.ok) {
    return await result.json()
  }
  return null
}

interface UserData {

  user_id: number,
  username: string,
  description: string,

  profile_tag: string,

  is_avatar_set: boolean,

  is_admin: boolean
}

const userData = ref<UserData>(await getData(props.user_id))
const colour = computed(() => userData.value.is_avatar_set ? undefined : getColour(userData.value.user_id))
const imageSrc = ref('')
const canEdit = computed(() => {
  return props.user_id === undefined || props.user_id === store.userID.toString()
})
const initials = computed(() => {
  return userData.value.is_avatar_set
    ? undefined
    : userData.value.username.split(' ', 2)
      .map(s => s.charAt(0).toUpperCase()).join('')
})
const editForm = ref<HTMLFormElement | null>(null)
const notEditing = ref(true)
const welcome = ref(false)

console.log(userData.value)
watch(userData, (o, n) => {
  console.log(n)
})

function toggleEditing () {
  if (!notEditing.value) {
    if (editForm.value?.validate()) {
      // todo: update database
      notEditing.value = !notEditing.value
    }
    return
  }
  notEditing.value = !notEditing.value
}

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.user_id !== from.params.user_id) {
    if (typeof from.params.user_id === 'string') {
      userData.value = await getData(from.params.user_id)
    }
  }
})

onBeforeMount(() => {
  welcome.value = window.history.state.welcome ?? false
})
</script>
