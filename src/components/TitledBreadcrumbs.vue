<template>
  <v-container fluid>
    <v-row>
      <v-breadcrumbs class="" large :items="parents.concat([{ to: {}, text: '' }])">
        <template #divider>
          <v-icon>mdi-menu-right</v-icon>
        </template>
        <template #title="{ item }">
          <v-breadcrumbs-item :to="item.to">item.text</v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-row>

    <!--current page header-->
    <v-row>
      <p class="text-h4 px-4 mb-8">{{ current }}</p>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
// eslint-disable-next-line no-undef, @typescript-eslint/no-unused-vars
const props = defineProps({
  parents: {
    type: Array,
    required: true
  },
  current: {
    type: String,
    required: true
  }
})
</script>
