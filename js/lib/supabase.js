import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = "https://xesznfurlcatrkkifbtz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlc3puZnVybGNhdHJra2lmYnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM0NjAzODYsImV4cCI6MjAyOTAzNjM4Nn0.kuHhvM_0Nz8plxXlCYXrncLBeJ8jH5CngKcqoPsgWxY";
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
