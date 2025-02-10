-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    coins INTEGER DEFAULT 0,
    last_login TIMESTAMP WITH TIME ZONE,
    is_banned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all user data" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can update user data" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user record
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Add indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_is_admin_idx ON public.users(is_admin);
CREATE INDEX IF NOT EXISTS users_is_banned_idx ON public.users(is_banned);

-- Create the first admin user if not exists (replace with your admin email)
INSERT INTO public.users (id, email, is_admin)
SELECT id, email, true
FROM auth.users
WHERE email = 'admin@sweepcoins.com'
ON CONFLICT (id) DO UPDATE
SET is_admin = true; 