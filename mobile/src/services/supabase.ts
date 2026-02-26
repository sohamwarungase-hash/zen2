import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const supabaseUrl = "https://xcpoiszmxehtlitjnfue.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjcG9pc3pteGVodGxpdGpuZnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODUwODAsImV4cCI6MjA4NzI2MTA4MH0.ZmtGnzdzilRiiAi1tKx-9OU4FGljJ0FPD2-mU5KlCwU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: {
            getItem: (key) => SecureStore.getItemAsync(key),
            setItem: (key, value) => SecureStore.setItemAsync(key, value),
            removeItem: (key) => SecureStore.deleteItemAsync(key),
        },
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
