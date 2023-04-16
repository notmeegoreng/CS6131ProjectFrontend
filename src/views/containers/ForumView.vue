<template>
  <v-container fluid class="px-8">
    <TitledBreadcrumbs v-once :parents="convertToCrumbs(data.parents)" :current="data.container.name"
                       :current_to="{ name: 'forums', params: { id } }" />
    <SectionComponent
      name="Topics" :children="data.children"
      :get-to="(o) => { return { name: 'topics', params: { id: o.id } } }" />
  </v-container>
</template>

<script setup lang="ts">
import TitledBreadcrumbs from '@/components/TitledBreadcrumbs.vue'
import SectionComponent from '@/components/SectionComponent.vue'

import { getForumData } from '@/api'
import { convertToCrumbs } from '@/utils'

// eslint-disable-next-line no-undef
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const resp = await getForumData(props.id)
const data = await resp.json()
</script>
