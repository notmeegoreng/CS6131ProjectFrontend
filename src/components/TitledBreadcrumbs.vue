<template>
  <v-container fluid>
    <v-row>
      <v-breadcrumbs class="" large :items="parents.concat([{ text: '', to: {} }])">
        <template #divider>
          <v-icon icon="mdi-menu-right" />
        </template>
        <template #title="{ item }">
          <v-breadcrumbs-item :to="item.to">item.text</v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-row>

    <!--current page header-->
    <v-row>
      <router-link :to="current_to" custom v-slot="{ navigate }">
        <p @click="navigate" role="link" class="text-h4 mb-4 current_title">{{ current }}</p>
      </router-link>
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
  current: string,
  current_to: object
}>()
</script>

<style>
.current_title {
  padding: 0 12px; /* 12px value taken from v-breadcrumbs style to align with them */
}

.current_title:hover {
  text-decoration-line: underline;
  cursor: pointer;
}
</style>
