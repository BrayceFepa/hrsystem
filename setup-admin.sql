-- Complete setup script for HRMS
-- Run this in phpMyAdmin SQL tab

-- Activate all users and set them as admins
UPDATE users 
SET active = 1, role = 'ROLE_ADMIN';

-- Verify the changes
SELECT id, username, full_name, role, active FROM users;

