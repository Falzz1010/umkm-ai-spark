
-- Aktifkan Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: izinkan user membaca baris role dirinya sendiri
CREATE POLICY "Users can read their role" ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: izinkan admin membaca role siapa saja (opsional)
CREATE POLICY "Admins can read any role" ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

