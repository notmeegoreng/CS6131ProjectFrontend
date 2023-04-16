<template>
  <v-app>
    <v-app-bar app>
      <div class="mx-10 text-h5">Fount</div>
      <v-divider vertical/>
      <v-btn class="ml-10 mr-2" :to="{ name: 'home' }"><span>Home</span></v-btn>
      <v-btn class="mx-2" :to="{ name: 'latest' }">Latest</v-btn>
      <v-btn v-if="store.isAdmin" class="ml-2" :to="{ name: 'admin_panel' }">Admin Panel</v-btn>
      <v-spacer/>
      <template v-if="store.userID">
        <v-btn class="mx-2" :to="{name: 'users', params: {id: store.userID}}">Profile</v-btn>
        <v-dialog v-model="logoutDialog" width="400">
          <template v-slot:activator="{ props }">
            <v-btn class="ml-2 mr-4" v-bind="props">Logout</v-btn>
          </template>
          <v-card>
            <v-card-title>Logout</v-card-title>
            <v-card-text>Are you sure you wish to log out?</v-card-text>
            <v-card-actions>
              <v-btn @click="logout">Logout</v-btn>
              <v-btn @click="logoutDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <v-btn v-else class="mx-4 ma-0" to="/login">Login</v-btn>
      <v-menu class="" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn class="mx-4" icon v-bind="props">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>Theme</v-list-item-title>
            <v-list-item-action>
              <v-switch :label="(dark ? 'Dark' : 'Light') + ' Mode'" @click="toggleTheme" inset color="black"/>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn class="mx-4" icon :to="{ name: 'search' }">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <Suspense @pending="scrollWaiter.inc()" @resolve="scrollWaiter.dec()">
            <component :is="Component"/>
            <template #fallback>
              <LoadingComponent />
            </template>
          </Suspense>
        </template>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'

import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { scrollWaiter } from '@/utils'

const theme = useTheme()
const router = useRouter()
const store = useStore()

const logoutDialog = ref(false)
const dark = ref(true)

async function toggleTheme () {
  dark.value = !dark.value
  theme.global.name.value = dark.value ? 'dark' : 'light'
}
async function logout () {
  logoutDialog.value = false
  store.userID = 0
  await router.push({ name: 'home' })
}
</script>
