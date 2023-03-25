<template>
  <v-container fluid class="px-md-8">
    <!-- add home info here -->
    <v-container fluid>
      <template v-for="(cat, id) in data" :key="id" >
        <span v-once :id="'C' + id" />
        <v-card class="mb-10 rounded-lg">
          <v-card-title class="mt-2" v-text="cat.container.name"/>
          <v-card-subtitle class="mb-4" v-text="cat.container.description"/>
          <v-divider/><v-divider/><v-divider/>
          <template v-for="(forum, i) in cat.children" :key="i">
            <v-divider/>
            <v-list-item
              lines="three"
              :to="{ name: 'forums', params: { forum_id: forum.id } }">
              <template #title>
                <p v-text="forum.name"/>
              </template>
              <v-list-item-subtitle v-text="forum.description"/>
            </v-list-item>
          </template>
        </v-card>
      </template>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { getHomeData } from '@/api'

const resp = await getHomeData()
const data = await resp.json()
</script>
