<template>
  <v-container fluid class="pl-4">
    <TitledBreadcrumbs :parents="convertToCrumbs(data.parents)" :current="data.container.name"/>
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component :is="Component"/>
          <template #fallback>
            <v-progress-circular indeterminate class="d-flex justify-center mx-auto mt-4"/>
          </template>
        </Suspense>
      </template>
    </router-view>
    <v-pagination
      v-model="page" :length="length" :disabled="length <= 1"
      show-first-last-page variant="tonal" />
  </v-container>
</template>

<script setup lang="ts">
import TitledBreadcrumbs from '@/components/TitledBreadcrumbs.vue'

import { ref, onDeactivated, onMounted, computed } from 'vue'
import { useStore } from '@/store'
import { getThreadInfo } from '@/api'
import { IDContainer, convertToCrumbs } from '@/utils'

const PAGE_SIZE = 10

const store = useStore()

// eslint-disable-next-line no-undef
const props = defineProps({
  thread_id: {
    type: String,
    required: true
  }
})

const page = ref(0)
const length = computed(() => Math.ceil(data.container.last_pos / PAGE_SIZE))

type ThreadData = {
  parents: IDContainer[]
  container: {
    name: string;
    // eslint-disable-next-line camelcase
    last_pos: number;
  }
}

const resp = await getThreadInfo(props.thread_id)
const data: ThreadData = await resp.json()
console.log(data)

// eslint-disable-next-line camelcase
function hide_spoilers () {
  Array.from(document.querySelectorAll('.spoiler')).forEach(spoiler => {
    spoiler.classList.remove('opened-spoiler')
  }, false)
}
onMounted(() => {
  store.spoilerHide = true
})

onDeactivated(() => {
  store.spoilerHide = false
})
</script>
