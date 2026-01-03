import { supabase } from './supabase'

// Sign up with email and password
export async function signUp(email: string, password: string, firstName: string, lastName: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
            },
        },
    })

    if (error) {
        throw error
    }

    return data
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        throw error
    }

    return data
}

// Sign in with Google
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    })

    if (error) {
        throw error
    }

    return data
}

// Sign out
export async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
        throw error
    }
}

// Get current user
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        throw error
    }

    return user
}

// Check if user is authenticated
export async function isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
}
