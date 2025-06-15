
-- Tambahkan role admin (ganti <ADMIN_ID> & <ADMIN_EMAIL> sesuai user id dan email admin)
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = '<ADMIN_EMAIL>' limit 1;
