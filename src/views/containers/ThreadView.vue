<template>
  <v-container fluid class="pl-4">
    <TitledBreadcrumbs :parents="convertToCrumbs(data.parents)" :current="data.container.name"/>
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <Suspense @pending="scrollWaiter.inc()" @resolve="scrollWaiter.dec()">
          <component :is="Component" :last_pos="data.container.last_pos"/>
          <template #fallback>
            <LoadingComponent />
          </template>
        </Suspense>
      </template>
    </router-view>
  </v-container>
</template>

<script setup lang="ts">
import TitledBreadcrumbs from '@/components/TitledBreadcrumbs.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

import { onDeactivated, onMounted } from 'vue'
import { useStore } from '@/store'
import { getThreadInfo } from '@/api'
import { IDContainer, convertToCrumbs, scrollWaiter } from '@/utils'

const store = useStore()

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: string
}>()

type ThreadData = {
  parents: IDContainer[]
  container: {
    name: string;
    last_pos: number;
  }
}

const resp = await getThreadInfo(props.id)
const data: ThreadData = await resp.json()
console.log(data)

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
