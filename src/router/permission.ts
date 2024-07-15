import { router } from './index' // Make sure to import the router instance
import { supabase } from '@/utils/supabaseClient'

// This function sets up a global navigation guard
export function setupPageGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const user = supabase.auth.user()

    if (!user && (to.name !== 'SignIn' || to.path === '/')) {
      // If there is no user and the target route is not the SignIn page or the root URL, redirect to SignIn
      next({ name: 'SignIn' })
    } else if (user && to.name === 'SignIn') {
      // If there is a user and the target route is the SignIn page, redirect to the chat page
      next({ name: 'RootDraw' }) // Or any other default authenticated route
    } else {
      // Otherwise, proceed as normal
      next()
    }
  })
}