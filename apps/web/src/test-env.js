// Test environment variables
console.log('Testing environment variables...');
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Check if they're the placeholder values
const isPlaceholder = import.meta.env.VITE_SUPABASE_URL === 'your_project_url_here' || 
                     import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co';

if (isPlaceholder) {
    console.error('❌ Environment variables are still placeholder values!');
} else if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('❌ Environment variables are missing!');
} else {
    console.log('✅ Environment variables look good!');
}