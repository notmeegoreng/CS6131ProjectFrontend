<template>
  <v-container fluid class="px-md-8">
    <p class="text-h1">Fount</p>
    <p class="mb-4 mx-2 text-h6">The premier forum for...</p>
    <template v-if="done">
      <template v-for="(cat, id) in data" :key="id" >
        <span :id="'C' + id" />
        <SectionComponent
          :name="cat.container.name" :description="cat.container.description"
          :children="cat.children" :getTo="(f) => { return { name: 'forums', params: { id: f.id } } }" />
      </template>
    </template>
    <LoadingComponent v-else />
  </v-container>
</template>

<script setup lang="ts">
import SectionComponent from '@/components/SectionComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

import { ref } from 'vue'
import { scrollWaiter } from '@/utils'
import { getHomeData } from '@/api'

scrollWaiter.inc()
const done = ref(false)

const resp = await getHomeData()
const data = await resp.json()

done.value = true
scrollWaiter.dec()
</script>
