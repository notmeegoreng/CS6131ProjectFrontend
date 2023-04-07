<template>
  <v-container fluid class="pl-4">
    <p v-if="welcome" class="text-h5 mb-6 mx-4">Welcome, {{ userData.username }}</p>

    <v-card class="mx-4 pa-8 rounded-xl" v-if="userData !== null">
      <v-card-title>
        <v-row class="ma-1">
          <v-col cols="auto">
            <v-avatar v-if="userData.is_avatar_set" v-bind="props" size="80">
              <v-img :src="imageSrc" alt="Profile Picture" />
            </v-avatar>
            <v-avatar
              v-else v-bind="props" :color="colour" size="80" class="text-uppercase">
              {{ userData.is_avatar_set ? '' : initials }}
            </v-avatar>
          </v-col>
          <v-col>
            <p class="ma-4 justify-center flex-fill" v-text="userData.username" />
          </v-col>
        </v-row>
      </v-card-title>
      <v-form ref="editForm" @submit.prevent="toggleEditing">
      <v-list-item>
        <v-list-item-title class="ms-2 mb-4">Profile Tag</v-list-item-title>
        <v-textarea
          variant="outlined" rows=3 auto-grow
          :hint="editing ? 'This is shown below your name and avatar when you post!' : ''"
          :rules="[v => v.length <= maxTagLength || `Max ${maxTagLength} Characters`]"
          :readonly="!editing" v-model="userData.profile_tag"
          :placeholder="editing ? 'Type something here!' : ''" :persistent-placeholder="editing">
          <template #details>
            <v-counter :active="editing" :value="userData.profile_tag.length" :max="maxTagLength"/>
          </template>
        </v-textarea>
      </v-list-item>
      <v-list-item>
        <v-list-item-title class="ms-2 mb-4">Description</v-list-item-title>
        <v-textarea
          variant="outlined" auto-grow
          :hint="editing ? 'Others can read this by going to your profile!' : ''"
          :rules="[v => v.length <= maxDescriptionLength || `Max ${maxDescriptionLength} Characters`]"
          :readonly="!editing" v-model="userData.description"
          :placeholder="editing ? 'Type something here!' : ''" :persistent-placeholder="editing">
          <template #details>
            <v-counter :active="editing" :value="userData.description.length" :max="maxDescriptionLength"/>
          </template>
        </v-textarea>
      </v-list-item>
      <v-card-actions class="align-center">
        <v-layout justify-end v-if="canEdit">
          <v-btn
            variant="outlined" class="align-center mt-4" width="100" type="submit"
            :loading="loading">
            {{ loading ? '' : editing ? 'Editing' : 'Edit' }}
            <template v-if="!editing" #append>
              <v-icon icon="mdi-pencil" />
            </template>
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
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { getUserData, patchUser } from '@/api'
import { getColour } from '@/utils'

const maxTagLength = 64
const maxDescriptionLength = 1024

const router = useRouter()
const store = useStore()

// eslint-disable-next-line no-undef
const props = defineProps({
  id: {
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

const userData = ref<UserData>(await getData(props.id))
const colour = computed(() => userData.value.is_avatar_set ? undefined : getColour(userData.value.user_id))
const imageSrc = ref('')
const canEdit = computed(() => {
  return props.id === undefined || props.id === store.userID.toString()
})
const initials = computed(() => {
  return userData.value.is_avatar_set
    ? undefined
    : userData.value.username.split(' ', 2)
      .map(s => s.charAt(0)).join('')
})
const editForm = ref<HTMLFormElement | null>(null)
const editing = ref(false)
const loading = ref(false)
const welcome = ref(false)

console.log(userData.value)
watch(userData, (o, n) => {
  console.log(n)
})

function toggleEditing () {
  if (editing.value) {
    if (editForm.value?.validate()) {
      loading.value = true
      patchUser(userData.value.profile_tag, userData.value.description).then(() => {
        loading.value = false
        editing.value = false
      })
    }
  } else {
    editing.value = true
  }
}

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.id !== from.params.id) {
    if (typeof from.params.id === 'string') {
      userData.value = await getData(from.params.id)
    }
  }
})

onBeforeMount(() => {
  welcome.value = window.history.state.welcome ?? false
})
</script>
