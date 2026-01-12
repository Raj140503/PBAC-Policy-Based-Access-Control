-- Sample seed data for development

-- Sample Users
INSERT INTO users (id, email, password_hash, first_name, last_name, is_active, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@example.com', '$2a$10$QFaVF9Gzq2Lfr8F5cWnEquGFUqV3vJn5FWJ9.1K/QVuv.qTJXjbLm', 'Admin', 'User', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('550e8400-e29b-41d4-a716-446655440002', 'user@example.com', '$2a$10$QFaVF9Gzq2Lfr8F5cWnEquGFUqV3vJn5FWJ9.1K/QVuv.qTJXjbLm', 'Regular', 'User', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('550e8400-e29b-41d4-a716-446655440003', 'manager@example.com', '$2a$10$QFaVF9Gzq2Lfr8F5cWnEquGFUqV3vJn5FWJ9.1K/QVuv.qTJXjbLm', 'Team', 'Manager', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Sample User Attributes
INSERT INTO user_attributes (user_id, attribute_key, attribute_value)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'role', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440001', 'department', 'IT'),
  ('550e8400-e29b-41d4-a716-446655440002', 'role', 'user'),
  ('550e8400-e29b-41d4-a716-446655440002', 'department', 'Engineering'),
  ('550e8400-e29b-41d4-a716-446655440003', 'role', 'manager'),
  ('550e8400-e29b-41d4-a716-446655440003', 'department', 'Engineering')
ON CONFLICT DO NOTHING;

-- Sample Policies
INSERT INTO policies (id, name, effect, priority, subject_json, resource, action, is_active, created_at, updated_at, created_by)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', 'Admin Full Access', 'ALLOW', 100, 
   '{"role": "admin", "department": "*"}'::jsonb, 
   'database', 'READ', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 
   '550e8400-e29b-41d4-a716-446655440001'),
  
  ('650e8400-e29b-41d4-a716-446655440002', 'Engineering Read Access', 'ALLOW', 50, 
   '{"role": "user", "department": "Engineering"}'::jsonb, 
   'database', 'READ', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 
   '550e8400-e29b-41d4-a716-446655440001'),
  
  ('650e8400-e29b-41d4-a716-446655440003', 'Deny Production Write', 'DENY', 200, 
   '{"department": "*"}'::jsonb, 
   'database', 'WRITE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 
   '550e8400-e29b-41d4-a716-446655440001'),
  
  ('650e8400-e29b-41d4-a716-446655440004', 'Manager API Access', 'ALLOW', 75, 
   '{"role": "manager"}'::jsonb, 
   'api', 'READ', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 
   '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;
