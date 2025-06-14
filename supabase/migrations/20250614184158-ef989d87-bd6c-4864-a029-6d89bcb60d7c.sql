
-- Membuat tabel notifikasi
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Hanya pemilik yang bisa melihat notifikasi mereka
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: User hanya bisa insert notifikasi untuk diri sendiri
CREATE POLICY "Users can create their own notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya boleh update notifikasi mereka sendiri
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: User hanya boleh hapus notifikasi mereka sendiri
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Aktifkan realtime pada tabel notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
-- Masukkan notifications ke publication supabase_realtime
-- (Akan otomatis jika sudah menggunakan Supabase default publication)
