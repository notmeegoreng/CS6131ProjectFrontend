<template>
  <v-container fluid>
    <v-row>
      <v-breadcrumbs class="" large :items="parents.concat([{ text: '', to: {} }])">
        <template #divider>
          <v-icon>mdi-menu-right</v-icon>
        </template>
        <template #title="{ item }">
          <v-breadcrumbs-item v-text="item.text" :to="item.to" />
        </template>
      </v-breadcrumbs>
    </v-row>

    <!--current page header-->
    <v-row>
      <p class="text-h4 px-4 mb-4" v-text="current" />
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
// eslint-disable-next-line no-undef
defineProps<{
  parents: {
    text: string,
    to: object
  }[]
  current: string
}>()
</script>
