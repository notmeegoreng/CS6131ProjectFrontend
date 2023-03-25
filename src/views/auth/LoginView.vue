<template>
  <v-container fluid class="pl-4">
    <v-form ref="form" @submit.prevent="onLogin">
      <v-row>
        <p class="text-h5 mb-6">Login</p>
      </v-row>
      <v-row>
        <v-text-field
          label="Username" v-model="username"
          :rules="[required]" :disabled="loading" filled required/>
      </v-row>
      <v-row>
        <v-text-field
          label="Password" v-model="password" :rules="[required]"
          :type="passwordShow ? 'text' : 'password'"
          :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
          :disabled="loading"
          @click:append="passwordShow = !passwordShow" aria-required="true" filled required/>
      </v-row>
      <v-row>
        <v-btn
          color="primary" type="submit"
          :loading="loading" :disabled="loading">
          Login
        </v-btn>
        <v-btn @click="onRegister" color="secondary" class="mx-8">
          Register
        </v-btn>
        <v-messages :messages="[errorMessage]"></v-messages>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { postLogin, postPreAuth } from '@/api'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()

const form = ref<HTMLFormElement | null>(null)
const username = ref('')
const password = ref('')
const passwordShow = ref(false)
const loading = ref(false)
const errorMessage = ref('')

let preAuthPromise: Promise<Response>
function required (v: string) {
  return !!v || 'Required'
}

let preAuthPromiseCleared = false
async function onLogin () {
  if ((await form.value?.validate()).valid) {
    loading.value = true
    if (!preAuthPromiseCleared) {
      await (await preAuthPromise).text()
      preAuthPromiseCleared = true
    }

    const result = await postLogin(username.value, password.value)
    if (result.ok) {
      store.userID = parseInt(await result.text())
      await router.push({ name: 'me', state: { welcome: true } })
    } else if (result.status === 403) {
      // todo: error message
      errorMessage.value = 'Incorrect username or password!'
      console.log(result)
    } else {
      console.log(result)
    }
    loading.value = false
  }
}

async function onRegister () {
  await router.push({ name: 'register', state: { initial_username: username.value, initial_password: password.value } })
}

onBeforeMount(() => {
  preAuthPromise = postPreAuth()
})
</script>
