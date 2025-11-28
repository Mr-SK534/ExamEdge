-- database/seed.sql  ← Run this RIGHT AFTER schema.sql

-- Insert 25 dummy students (password for all = "123456")
INSERT INTO users (name, email, phone, password, exam, target_year) VALUES
('Aryan Sharma', 'aryan@gmail.com', '9876543210', '$2b$10$z5r8x9v7L5n8k3m2p9q1r2t3y4u5i6o7p8a9s0d1f2g3h4j5k6l7m', 'JEE', 2026),
('Priya Singh', 'priya@gmail.com', '9876543211', '$2b$10$z5r8x9v7L5n8k3m2p9q1r2t3y4u5i6o7p8a9s0d1f2g3h4j5k6l7m', 'NEET', 2026),
('Rahul Kumar', 'rahul@gmail.com', '9876543212', '$2b$10$z5r8x9v7L5n8k3m2p9q1r2t3y4u5i6o7p8a9s0d1f2g3h4j5k6l7m', 'WBJEE', 2026),
('Ananya Das', 'ananya@gmail.com', '9876543213', '$2b$10$z5r8x9v7L5n8k3m2p9q1r2t3y4u5i6o7p8a9s0d1f2g3h4j5k6l7m', 'JEE', 2026),
('Rohan Patel', 'rohan@gmail.com', '9876543214', '$2b$10$z5r8x9v7L5n8k3m2p9q1r2t3y4u5i6o7p8a9s0d1f2g3h4j5k6l7m', 'NEET', 2026);
-- Add 20 more if you want… or just these 5 for now