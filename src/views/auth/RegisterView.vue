<template>
  <v-container fluid class="pl-4">
    <v-form ref="form" class="ma-18" @submit.prevent="onRegister">
      <v-row>
        <p class="text-h5 mb-6">Register</p>
      </v-row>
      <v-row>
        <v-text-field
          label="Username" v-model="username"
          :rules="[required, v => v.length <= 32 || 'Too long! Maximum 32 characters']" :error-messages="errors"
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
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { postPreAuth, postRegister, postUsernameAvailable } from '@/api'
import { debouncedRef } from '@/utils'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()

const form = ref<HTMLFormElement | null>(null)
const errors = ref<string[]>([])
const username = debouncedRef('')
const password = ref('')
const confirmPassword = ref('')
const passwordShow = ref(false)
const confirmPasswordShow = ref(false)
const checked = ref(false) // needed for the validation to work
const loading = ref(false)

let preAuthPromise: Promise<Response> | null = null

// username availability checking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch(username, async (n, _) => {
  if (!n) return
  switch ((await postUsernameAvailable(n)).status) {
    case 200:
      errors.value = []
      break
    case 409:
      errors.value = ['This username has been taken!']
      break
    default:
      errors.value = ['An unexpected error occurred when checking username availability']
  }
})

function required (v: string) {
  return !!v || 'Required'
}

function match (v: string) {
  return (v === password.value) || 'The passwords do not match!'
}

async function onRegister () {
  if ((await form.value?.validate()).valid) {
    loading.value = true
    await preAuthPromise
    const result = await postRegister(username.value, password.value)
    loading.value = false
    if (result.ok) {
      store.userID = parseInt(await result.text())
      await router.push({ name: 'me', state: { welcome: true } })
    } else {
      // todo: error message
      console.log(result)
    }
  }
}

onBeforeMount(() => {
  username.value = window.history.state.initial_username ?? ''
  password.value = window.history.state.initial_password ?? ''
  preAuthPromise = postPreAuth()
})
</script>
