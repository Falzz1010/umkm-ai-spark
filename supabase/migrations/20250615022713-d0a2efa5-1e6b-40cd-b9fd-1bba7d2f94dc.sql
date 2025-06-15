
-- Table to store businesses/organizations
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table for users joining businesses with roles and status
CREATE TABLE public.business_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'staff')),
  status TEXT NOT NULL DEFAULT 'active', -- (active, invited, removed)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, user_id)
);

-- RLS for businesses (allow only owner to select/update/delete)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner can manage their businesses" ON public.businesses
  FOR ALL USING (owner_id = auth.uid());

-- RLS for business_members (allow self and any admin/owner on the business to read/manage)
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Member can view own business memberships" ON public.business_members
  FOR SELECT USING (user_id = auth.uid());

-- Allow owner/admin to manage members of their own businesses
CREATE POLICY "Owner/Admin can manage members of owned businesses" ON public.business_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE id = business_id
        AND (owner_id = auth.uid()
             OR EXISTS (
               SELECT 1 FROM public.business_members
               WHERE user_id = auth.uid()
                 AND business_id = public.business_members.business_id
                 AND role IN ('owner', 'admin')
                 AND status = 'active'
             )
           )
    )
  );

