<template>
  <v-container fluid>
    <v-text-field v-model="q" placeholder="Search" prepend-icon="mdi-magnify"
                  :clearable="true" @keyup.enter="onQueryUpdate" @focusout="onQueryUpdate"/>
    <v-tabs class="mt-3" v-model="selected" :mandatory="false" @update:model-value="onQueryUpdate">
      <v-tab value="forums">Forums</v-tab>
      <v-tab value="topics">Topics</v-tab>
      <v-tab value="threads">Threads</v-tab>
      <v-tab value="posts">Posts</v-tab>
      <v-tab value="users">Users</v-tab>
    </v-tabs>
    <v-divider class="my-8" />
    <LoadingComponent v-if="loading" />
    <p v-else-if="data === undefined || selected === undefined || q === ''" class="text-center">
      Nothing here... <br/><br/>
      Try searching for something?
    </p>
    <p v-else-if="data === null" class="text-center">
      Sorry, an unexpected error occurred.
    </p>
    <p v-else-if="Object.values(data).length === 0"  class="text-center">
      Nothing was found!
    </p>
    <template v-else-if="selected === 'users'">
      <template v-for="(i) in data" :key="i">
      </template>
    </template>
    <template v-else-if="selected === 'posts'">
      <template v-for="(s, id) in data" :key="id">
        <SectionComponent
          :name="s.container.name" :description="s.container.description"
          :children="s.children" :getTo="c => { return {
            name: 'thread_page', params: { id, page_num: c.page_num }, hash: `#${c.post_id}`
          } }">
          <template #prepend="{ c }">
            <!--suppress RequiredAttributes -->
            <ProfilePictureComponent size="50" v-bind="c" />
          </template>
          <template #divider>
            <v-divider v-for="i in 8" :key="i"/>
          </template>
        </SectionComponent>
      </template>
    </template>
    <template v-else>
      <template v-for="(s, id) in data" :key="id" >
        <SectionComponent
          :name="s.container.name" :description="s.container.description"
          :children="s.children" :getTo="c => { return { name: selected, params: { id: 'P' + c.id } } }">
          <template #prepend="{ c }">
            <!--suppress RequiredAttributes, JSUnresolvedVariable -->
            <ProfilePictureComponent v-if="c.user_id" size="50" v-bind="c" />
          </template>
        </SectionComponent>
      </template>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import SectionComponent from '@/components/SectionComponent.vue'
import ProfilePictureComponent from '@/components/ProfilePictureComponent.vue'

import { ref } from 'vue'
import { getSearch } from '@/api/search'

const q = ref('')
const selected = ref<string | undefined>(undefined)
const data = ref<object | null | undefined>(undefined)
const loading = ref(false)

async function fetchSearch (s: string) {
  loading.value = true
  const resp = await getSearch(s, q.value)
  if (resp.ok) {
    data.value = await resp.json()
  } else {
    data.value = null
  }
  loading.value = false
  console.log(data.value)
}

function onQueryUpdate () {
  if (selected.value !== undefined && q.value !== '') {
    fetchSearch(selected.value)
  }
}
</script>

<style scoped>

</style>
