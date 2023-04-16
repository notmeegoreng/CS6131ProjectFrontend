<template>
  <v-container fluid class="pl-4">
    <p v-if="welcome" class="text-h5 mb-6 mx-4">Welcome, {{ userData.username }}</p>

    <v-card class="mx-4 pa-8 rounded-xl" v-if="userData !== null">
      <v-card-title>
        <v-row class="ma-1">
          <v-dialog v-model="uploadDialog">
            <template #activator="{ props }">
              <v-col cols="auto" v-bind="editing ? props : {}" :class="{ 'cursor-pointer': editing }">
                <ProfilePictureComponent v-bind="userData" size="80" />
                <v-icon :class="{ hidden: !editing }" icon="mdi-pencil" size="15" class="edit-icon" />
              </v-col>
            </template>
            <v-card style="width: 40%">
              <v-card-title>Upload Avatar</v-card-title>
              <v-card-text>
                <v-file-input accept="image/*" v-model="file" label="Avatar" :rules="[validateAvatar]" />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="updateAvatar" :loading="uploadLoading" :disabled="uploadLoading">Upload</v-btn>
                <v-btn @click="uploadDialog = false" :disabled="uploadLoading">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-col class="pl-0 align-center">
            <p class="my-4 justify-center align-center flex-fill" v-text="userData.username" />
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
import ProfilePictureComponent from '@/components/ProfilePictureComponent.vue'

import { ref, computed, onBeforeMount } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { getUserData, patchUser, postAvatar } from '@/api'
import { VFileInput } from 'vuetify/components'

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

type UserData = {
  user_id: number,
  username: string,
  description: string,
  profile_tag: string,
  is_avatar_set: boolean,
  is_admin: boolean
}

const userData = ref<UserData>(await getData(props.id))
const canEdit = computed(() => {
  return props.id === undefined || props.id === store.userID.toString()
})
const editForm = ref<HTMLFormElement | null>(null)
const editing = ref(false)
const loading = ref(false)
const welcome = ref(false)
const file = ref<File[]>([])
const uploadDialog = ref(false)
const uploadLoading = ref(false)

async function toggleEditing () {
  if (editing.value) {
    if ((await editForm.value?.validate()).valid) {
      loading.value = true
      await patchUser(userData.value.profile_tag, userData.value.description)
      loading.value = false
      editing.value = false
    }
  } else {
    editing.value = true
  }
}

function updateAvatar () {
  uploadLoading.value = true
  postAvatar(file.value[0]).then(() => getData(props.id)).then((d) => {
    userData.value = d
    uploadDialog.value = uploadLoading.value = false
  })
}

function validateAvatar (v: File[]) {
  if (!v) return 'Please provide an image!'
  if (v[0].size > 2000000) return 'Avatar should be less than 2 MB!'
  return true
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

<style>
.hidden {
  visibility: hidden;
}

.cursor-pointer {
  cursor: pointer;
}

.edit-icon {
  margin-top: 65%;
  margin-left: -15%;
}
</style>
