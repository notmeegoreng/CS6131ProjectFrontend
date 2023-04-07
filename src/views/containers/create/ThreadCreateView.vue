<template>
  <v-container fluid class="pl-4">
    <v-form>
      <v-select label="Forum" v-model="selected" :items="forums">

      </v-select>
      <v-text-field label="Thread Title" v-model="title" :rules="[v => !!v || 'Required']"/>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const forums = ref(['test', 'test2'])
const selected = ref(null)
const title = ref('')
</script>
