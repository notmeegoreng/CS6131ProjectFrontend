<template>
  <v-container fluid>
    <template v-for="(id, section) in sections.entries()" :key="id" >
      <span :id="normalise(section.name)" />
      <v-card class="mb-10 rounded-lg">
        <v-card-title class="my-3" v-text="section.name"/>
        <span :id="section.id"/>
        <div v-for="(i, cover) in section[coverPropName]" :key="i">
          <v-divider/>
          <v-list-item lines="three" :to="{ name: route_name, params: { toParam: cover[toParam] }, state: { sect } }">
            <template #prepend v-if="cover.avatar" >
              <v-avatar v-text="cover.avatar.name" :color="cover.avatar.color" size="52" class="ms-1"/>
            </template>
            <template #title>
              <p v-text="title"/>
            </template>
            <v-list-item-subtitle v-text="cover.description"/>
          </v-list-item>
        </div>
      </v-card>
    </template>
  </v-container>
</template>

<script setup>
import { normalise } from '@/utils'

// eslint-disable-next-line no-undef
const props = defineProps({
  route_name: String,
  coverPropName: String,
  toParam: String,
  sections: Object[{
    header: String,
    covers: Array[{
      avatar: { name: String, color: String },
      title: String,
      description: String,
      params: Object,
      state: Object
    }]
  }]
})
</script>

<style scoped>

</style>
