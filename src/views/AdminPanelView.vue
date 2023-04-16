<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="text-h5 mt-2">
        Edit Containers
      </v-card-title>
      <v-tabs v-model="actionType" :disabled="loading" @update:model-value="updateData">
        <v-tab value="create">Create</v-tab>
        <v-tab value="update">Update</v-tab>
        <v-tab value="delete">Delete</v-tab>
      </v-tabs>
      <v-tabs v-model="targetType" :disabled="loading" @update:model-value="updateData">
        <v-tab value="categories">Category</v-tab>
        <v-tab value="forums">Forum</v-tab>
        <v-tab value="topics">Topic</v-tab>
      </v-tabs>
      <v-card-text>
        <LoadingComponent v-if="loading" />
        <v-window v-else v-model="actionType" class="mx-4">
          <v-window-item value="create">
            <v-window v-model="targetType">
              <v-window-item value="categories">
                <v-form ref="form">
                  <v-text-field label="Name" v-model="name" :rules="[required, v => v.length <= 48]"
                                :disabled="loading" counter="48" class="mt-1" />
                  <v-text-field label="Description" v-model="description" :rules="[required, v => v.length <= 63]"
                                :disabled="loading" counter="63" class="mt-1" />
                </v-form>
              </v-window-item>
              <v-window-item value="forums">
                <v-form ref="form">
                  <v-select label="Parent Category" v-model="selectedC" :items="dataC"
                            :rules="[required]" :disabled="loading" item-title="name" item-value="id" />
                  <v-text-field label="Name" v-model="name" :rules="[required, v => v.length <= 48]"
                                :disabled="loading" counter="48" class="mt-1" />
                  <v-text-field label="Description" v-model="description" :rules="[required, v => v.length <= 63]"
                                :disabled="loading" counter="63" class="mt-1" />
                </v-form>
              </v-window-item>
              <v-window-item value="topics">
                <v-form ref="form">
                  <v-select label="Parent Forum" v-model="selectedF" :items="dataF"
                            :rules="[required]" :disabled="loading" item-title="name" item-value="id" />
                  <v-text-field label="Name" v-model="name" :rules="[required, v => v.length <= 48]"
                                :disabled="loading" counter="48" class="mt-1" />
                  <v-text-field label="Description" v-model="description" :rules="[required, v => v.length <= 63]"
                                :disabled="loading" counter="63" class="mt-1" />
                </v-form>
              </v-window-item>
            </v-window>
            <v-btn @click="onCreate" class="mb-4 mx-4" variant="elevated" elevation="5"
                   :loading="loading" :disabled="loading">
              Create
            </v-btn>
          </v-window-item>
          <v-window-item value="update">
            <v-window v-model="targetType">
              <v-window-item value="categories">
                <v-form ref="form">
                  <v-select label="Category" v-model="selectedC" :items="dataC"
                            :rules="[required]" :disabled="loading" item-title="name" item-value="id" />
                  <v-text-field label="Name" v-model="name" :rules="[required, v => v.length <= 48]"
                                :disabled="loading" counter="48" class="mt-1" />
                  <v-text-field label="Description" v-model="description" :rules="[required, v => v.length <= 63]"
                                :disabled="loading" counter="63" class="mt-1" />
                </v-form>
              </v-window-item>
              <v-window-item value="forums">
                <v-form ref="form">
                  <v-select label="Forum" v-model="selectedF" :items="dataF"
                            :rules="[required]" :disabled="loading" item-title="name" item-value="id" />
                  <v-text-field label="Name" v-model="name" :rules="[required, v => v.length <= 48]"
                                :disabled="loading" counter="48" class="mt-1" />
                  <v-text-field label="Description" v-model="description" :rules="[required, v => v.length <= 63]"
                                :disabled="loading" counter="63" class="mt-1" />
                </v-form>
              </v-window-item>
              <v-window-item value="topics">
                <v-form ref="form">
                  <v-select label="Topic" v-model="selectedT" :items="dataT"
                            :rules="[required]" :disabled="loading" item-title="name" item-value="id" />
                  <v-text-field label="Name" v-model="name" :rules="[required, v => v.length <= 48]"
                                :disabled="loading" counter="48" class="mt-1" />
                  <v-text-field label="Description" v-model="description" :rules="[required, v => v.length <= 63]"
                                :disabled="loading" counter="63" class="mt-1" />
                </v-form>
              </v-window-item>
            </v-window>
            <v-btn @click="onUpdate" class="mb-4 mx-4" variant="elevated" elevation="5"
                   :loading="loading" :disabled="loading">
              Update
            </v-btn>
          </v-window-item>
          <v-window-item value="delete">
            <v-window v-model="targetType">
              <v-window-item value="categories">
                <v-form ref="form">
                  <v-select label="Category" v-model="selectedC" :items="dataC"
                            :rules="[required]" :disabled="loading" item-title="name" item-value="id" />
                </v-form>
              </v-window-item>
              <v-window-item value="forums">
                <v-form ref="form">
                  <v-select label="Forum" v-model="selectedF" :items="dataF"
                            :rules="[required]" :disabled="loading" item-title="name" item-value="id" />
                </v-form>
              </v-window-item>
              <v-window-item value="topics">
                <v-form ref="form">
                  <v-select label="Topic" v-model="selectedT" :items="dataT"
                            :rules="[required]" :disabled="loading" item-title="name" item-value="id" />
                </v-form>
              </v-window-item>
            </v-window>
            <v-dialog v-model="deleteDialog">
              <template #activator="{ props }">
                <v-btn v-bind="props" class="mb-4 mx-4" variant="elevated" elevation="5">
                  Delete
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  Delete {{ targetSingular.charAt(0).toUpperCase() + targetSingular.substring(1) }}
                </v-card-title>
                <v-card-text>
                  Are you sure you wish to delete this {{ targetSingular }}? All children will also be deleted!
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="onDelete" :loading="loading" :disabled="loading">Delete</v-btn>
                  <v-btn @click="deleteDialog = false">Cancel</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbarOpen" timeout="6000">
      {{ snackbarText }}
      <template #actions>
        <v-btn v-if="toTarget" :to="toTarget">Open</v-btn>
        <v-btn @click="snackbarOpen = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'

import { ref } from 'vue'
import { RouteLocationNamedRaw } from 'vue-router'
import {
  deleteContainer,
  getAll,
  patchContainerData,
  postCategoryData,
  postForumData,
  postTopicData
} from '@/api'

const actionType = ref('create')
const targetType = ref('categories')
const selectedC = ref<number | null>(null)
const selectedF = ref<number | null>(null)
const selectedT = ref<number | null>(null)
const dataC = ref<{id: number, name: string}[]>([])
const dataF = ref<{id: number, name: string}[]>([])
const dataT = ref<{id: number, name: string}[]>([])
const name = ref('')
const description = ref('')
const loading = ref(false)
const form = ref<HTMLFormElement | null>(null)
const deleteDialog = ref(false)
const toTarget = ref<RouteLocationNamedRaw | null>(null)
const snackbarOpen = ref(false)
const snackbarText = ref('')
let targetSingular = 'Category'

function required (v: string) {
  return !!v || 'Please provide a value!'
}

async function updateData () {
  loading.value = true
  if (actionType.value === 'create') {
    switch (targetType.value) {
      case 'forums':
        dataC.value = await getAll('categories', !dataC.value).then(r => r.json())
        break
      case 'topics':
        dataF.value = await getAll('forums', !dataF.value).then(r => r.json())
    }
    console.log('data', dataC.value, dataF.value, dataT.value)
  } else {
    switch (targetType.value) {
      case 'categories':
        dataC.value = await getAll('categories', !dataC.value).then(r => r.json())
        targetSingular = 'category'
        break
      case 'forums':
        dataF.value = await getAll('forums', !dataF.value).then(r => r.json())
        targetSingular = 'forum'
        break
      case 'topics':
        dataT.value = await getAll('topics', !dataT.value).then(r => r.json())
        targetSingular = 'topic'
    }
  }
  console.log(selectedC.value, selectedF.value, selectedT.value)
  loading.value = false
}

async function onCreate () {
  if ((await form.value?.validate()).valid) {
    loading.value = true
    let resp
    switch (targetType.value) {
      case 'categories':
        resp = await postCategoryData(name.value, description.value)
        dataC.value = [] // invalidate
        toTarget.value = { name: 'home', hash: `#C${await resp.json()}` }
        snackbarText.value = `Category '${name.value}' created!`
        break
      case 'forums':
        resp = await postForumData(selectedC.value as number, name.value, description.value)
        dataF.value = [] // invalidate
        toTarget.value = { name: 'forums', params: { id: await resp.json() } }
        snackbarText.value = `Forum '${name.value}' created!`
        break
      case 'topics':
        resp = await postTopicData(selectedF.value as number, name.value, description.value)
        dataT.value = [] // invalidate
        toTarget.value = { name: 'topics', params: { id: await resp.json() } }
        snackbarText.value = `Topic '${name.value}' created!`
        break
      default:
        throw Error('targetType has impossible value!')
    }
    name.value = description.value = ''
    snackbarOpen.value = true
    loading.value = false
  }
}

async function onUpdate () {
  if ((await form.value?.validate()).valid) {
    loading.value = true
    switch (targetType.value) {
      case 'categories':
        await patchContainerData('categories', selectedC.value as number, name.value, description.value)
        dataC.value = [] // invalidate
        toTarget.value = { name: 'home', hash: `#C${selectedC.value}` }
        snackbarText.value = `Category '${name.value}' updated!`
        break
      case 'forums':
        await patchContainerData('forums', selectedF.value as number, name.value, description.value)
        dataF.value = [] // invalidate
        toTarget.value = { name: 'forums', params: { id: selectedF.value } }
        snackbarText.value = `Forum '${name.value}' updated!`
        break
      case 'topics':
        await patchContainerData('topics', selectedT.value as number, name.value, description.value)
        dataT.value = [] // invalidate
        toTarget.value = { name: 'topics', params: { id: selectedT.value } }
        snackbarText.value = `Topic '${name.value}' updated!`
        break
      default:
        throw Error('targetType has impossible value!')
    }
    name.value = description.value = ''
    snackbarOpen.value = true
    await updateData()
    loading.value = false
  }
}

async function onDelete () {
  if ((await form.value?.validate()).valid) {
    loading.value = true
    switch (targetType.value) {
      case 'categories':
        await deleteContainer('categories', selectedC.value as number)
        dataC.value = [] // invalidate
        selectedC.value = null
        snackbarText.value = `Category '${name.value}' deleted!`
        break
      case 'forums':
        await deleteContainer('forums', selectedF.value as number)
        dataF.value = [] // invalidate
        selectedF.value = null
        snackbarText.value = `Forum '${name.value}' deleted!`
        break
      case 'topics':
        await deleteContainer('topics', selectedT.value as number)
        dataT.value = [] // invalidate
        selectedT.value = null
        snackbarText.value = `Topic '${name.value}' deleted!`
        break
      default:
        throw Error('targetType has impossible value!')
    }
    await updateData()
    toTarget.value = null
    snackbarOpen.value = true
    loading.value = deleteDialog.value = false
  }
}
</script>
