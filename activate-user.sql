-- Activate the admin user and set role to ADMIN
-- Run this in phpMyAdmin after creating a user

UPDATE users 
SET active = 1, role = 'ROLE_ADMIN' 
WHERE username = 'admin';

