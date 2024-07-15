<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NModal, useMessage } from 'naive-ui'
import { createClient } from '@supabase/supabase-js'
import { useAuthStore } from '@/store'
import Icon403 from '@/icons/403.vue'

const authStore = useAuthStore()
const ms = useMessage()
const loading = ref(false)
const email = ref('')
const password = ref('')
const disabled = computed(() => !email.value.trim() || !password.value.trim() || loading.value)
const supabaseUrl = import.meta.env.NEXT_SUPABASE_URL
const supabaseAnonKey = import.meta.env.NEXT_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function handleSupabaseAuth(email, password) {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      ms.error(error.message)
      return
    }
    const { session } = data
    authStore.setToken(session.access_token)
    ms.success('Authentication successful')
  } catch (error) {
    ms.error('An error occurred during authentication')
    console.error(error)
  } finally {
    loading.value = false
  }
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSupabaseAuth(email.value, password.value)
  }
}
</script>

<template>
  <NModal :show="authStore.isAuthRequired" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            403
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon403 class="w-[200px] m-auto" />
        </header>
        <div class="space-y-4">
          <NInput v-model:value="email" type="email" placeholder="Email" />
          <NInput v-model:value="password" type="password" placeholder="Password" @keypress="handlePress" />
          <NButton
            block
            type="primary"
            :disabled="disabled"
            :loading="loading"
            @click="handleSupabaseAuth(email, password)"
          >
            {{ $t('common.login') }}
          </NButton>
        </div>
      </div>
    </div>
  </NModal>
</template>
