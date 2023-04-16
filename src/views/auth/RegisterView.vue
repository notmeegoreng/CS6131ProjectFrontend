<template>
  <v-container fluid>
    <v-form ref="form" class="ma-18 mx-4 mx-md-8" @submit.prevent="onRegister">
      <v-row>
        <p class="text-h5 mb-6 mt-8">Register</p>
      </v-row>
      <v-row>
        <v-text-field
          label="Username" v-model="username"
          :rules="[required, v => v.length <= 32 || 'Too long! Maximum 32 characters']" :error-messages="usernameErrors"
          :disabled="loading"
          filled class="mb-3" required/>
      </v-row>
      <v-row>
        <v-text-field
          label="Password" v-model="password" :rules="[required]"
          :type="passwordShow ? 'text' : 'password'"
          :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
          :disabled="loading"
          @click:append="passwordShow = !passwordShow" aria-required="true" filled class="mb-3" required/>
      </v-row>
      <v-row>
        <v-text-field
          label="Confirm Password" v-model="confirmPassword" :rules="[required, match]"
          :type="confirmPasswordShow ? 'text' : 'password'"
          :append-icon="confirmPasswordShow ? 'mdi-eye' : 'mdi-eye-off'"
          :disabled="loading"
          @click:append="confirmPasswordShow = !confirmPasswordShow" filled class="mb-3" required/>
      </v-row>
      <v-row>
        <v-checkbox
          v-model="checked" label="Do you agree?" class="mb-8"
          :rules="[v => v || 'Please agree to continue']" :disabled="loading" required/>
      </v-row>
      <v-row>
        <v-btn
          type="submit"
          :loading="loading"
          :disabled="loading">Register</v-btn>
      </v-row>
      <v-row>
        <v-messages class="text-body-2 mt-4" :messages="errorMessage" :active="true" color="red-lighten-1" />
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { postPreAuth, postRegister, getUsernameAvailable } from '@/api'
import { debouncedRef } from '@/utils'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()

const form = ref<HTMLFormElement | null>(null)
const usernameErrors = ref<string[]>([])
const username = debouncedRef('')
const password = ref('')
const confirmPassword = ref('')
const passwordShow = ref(false)
const confirmPasswordShow = ref(false)
const checked = ref(false) // needed for the validation to work
const loading = ref(false)
const errorMessage = ref('')

let preAuthPromise: Promise<Response> | null = null

// username availability checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(username, async (n, _) => {
  if (!n) return
  switch ((await getUsernameAvailable(n)).status) {
    case 200:
      usernameErrors.value = []
      break
    case 409:
      usernameErrors.value = ['This username has been taken!']
      break
    default:
      usernameErrors.value = ['An unexpected error occurred when checking username availability']
  }
})

function required (v: string) {
  return !!v || 'Required'
}

function match (v: string) {
  return (v === password.value) || 'The passwords do not match!'
}

async function onRegister () {
  errorMessage.value = ''
  if ((await form.value?.validate()).valid) {
    loading.value = true
    await preAuthPromise
    const result = await postRegister(username.value, password.value)
    loading.value = false
    if (result.ok) {
      store.userID = parseInt(await result.text())
      await router.push({ name: 'me', state: { welcome: true } })
    } else {
      errorMessage.value = 'An unexpected error occurred.'
    }
  }
}

onBeforeMount(() => {
  username.value = window.history.state.initial_username ?? ''
  password.value = window.history.state.initial_password ?? ''
  preAuthPromise = postPreAuth()
})
</script>
