<template>
  <v-app>
    <v-app-bar app>
      <div class="mx-10 text-h5">Name</div>
      <v-divider vertical/>
      <v-btn class="ml-10 mr-2" :to="{name: 'home'}"><span>Home</span></v-btn>
      <v-btn class="mx-2" :to="{name: 'latest'}">Latest</v-btn>
      <v-btn class="mx-2" :to="{name: 'all_users'}">Users</v-btn>
      <v-spacer/>
      <template v-if="store.userID">
        <v-btn class="mx-2" :to="{name: 'users', params: {user_id: store.userID}}">Profile</v-btn>
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
          <v-list-subheader>Theme</v-list-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-switch @click="toggleTheme" inset color="black"/>
            </v-list-item-action>
            {{ (dark ? 'Dark' : 'Light') + ' Mode' }}
          </v-list-item>
          <v-list-item v-if="store.spoilerHide">
            <v-btn>
              Hide Spoilers
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu class="" v-model="searchDialog" :close-on-content-click="false" offset-y style="opacity: 1">
        <template v-slot:activator="{ props }">
          <v-btn class="mx-4" icon v-bind="props">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-text-field v-model="searchText" placeholder="Search"
                            @keydown.enter="onEnter"/>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <Suspense @pending="() => scrollWaiter.add()"
                    @resolve="() => scrollWaiter.flush()"
                    @fallback="() => scrollWaiter.flush()">
            <component :is="Component"/>
            <template #fallback>
              <v-progress-circular indeterminate class="d-flex justify-center mx-auto mt-4"/>
            </template>
          </Suspense>
        </template>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { scrollWaiter } from '@/utils'

const theme = useTheme()
const router = useRouter()
const store = useStore()

const logoutDialog = ref(false)
const searchDialog = ref(false)
const dark = ref(true)
const searchText = ref('')

async function toggleTheme () {
  dark.value = !dark.value
  theme.global.name.value = dark.value ? 'dark' : 'light'
}
async function logout () {
  logoutDialog.value = false
  store.userID = 0
  await router.push({ name: 'home' })
}

async function onEnter () {
  searchDialog.value = false
  console.log(searchText.value)
  await router.push({
    name: 'search',
    params: { query: searchText.value }
  })
}
</script>
