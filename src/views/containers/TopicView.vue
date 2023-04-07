<template>
  <v-container fluid class="px-8">
    <TitledBreadcrumbs v-once :parents="convertToCrumbs(data.parents)" :current="data.container.name"/>
    <router-view></router-view>
    <v-pagination v-model="page"/>
  </v-container>
</template>

<script setup lang="ts">
import TitledBreadcrumbs from '@/components/TitledBreadcrumbs.vue'

import { ref } from 'vue'
import { getTopicInfo } from '@/api'
import { convertToCrumbs } from '@/utils'

// eslint-disable-next-line no-undef
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const page = ref(1)

const resp = await getTopicInfo(props.id)
const data = await resp.json()
console.log(data)
</script>
