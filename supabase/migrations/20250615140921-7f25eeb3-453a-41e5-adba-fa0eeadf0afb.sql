
-- Ganti <ADMIN_EMAIL> dengan email admin baru,
-- misal: 'admin@email.com'
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = '<ADMIN_EMAIL>' limit 1;
