<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5">
        Create
      </v-card-title>
      <v-tabs>
        <v-tab value="category">Category</v-tab>
        <v-tab value="forum">Forum</v-tab>
        <v-tab value="topic">Topic</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window>
          <v-text-field label="Name" v-model="name" />
          <v-window-item value="category">
            <v-text-field label="Description" v-model="description" />
          </v-window-item>
          <v-window-item value="forum">
            <v-text-field label="Description" v-model="description" />
          </v-window-item>
          <v-window-item value="topic">
            <v-text-field label="Description" v-model="description" />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const description = ref('')
</script>
