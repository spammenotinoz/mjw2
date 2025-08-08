<template>
  <div class="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md" style="background-color: black;">
    <form @submit.prevent="handleSignIn" class="animate-in flex w-full flex-col justify-center gap-2">
      <div class="text-4xl font-bold mb-4 text-white">Ultimate AI Design Studio</div>
      <label for="Email" class="mb-1 text-left text-white">Email</label>
      <input v-model="email" class="mb-3 rounded-md border bg-inherit px-4 py-2 text-white" type="email" placeholder="email@example.com" required />
      <label for="Password" class="mb-1 text-left text-white">Password</label>
      <input v-model="password" class="mb-6 rounded-md border bg-inherit px-4 py-2 text-white" type="password" placeholder="**********" required />
      <button type="submit" class="mb-2 rounded-md bg-blue-700 !bg-blue-500 px-4 py-2 text-white" :disabled="loading">
        {{ loading ? 'Signing In...' : 'Sign In' }}
      </button>
      <!-- Display error message -->
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../utils/supabaseClient';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null); // Add a ref to hold error messages
const router = useRouter();

const handleSignIn = async () => {
  try {
    loading.value = true;
    error.value = null; // Reset error message
    const { user, error: signInError } = await supabase.auth.signIn({ email: email.value, password: password.value });
    if (signInError) throw signInError;
    if (user) {
      // If sign-in is successful, redirect to the root route
      router.push('/');
    }
  } catch (signInError) {
    // Display error message in the form
    error.value = signInError.error_description || signInError.message;
  } finally {
    loading.value = false;
  }
};
</script>