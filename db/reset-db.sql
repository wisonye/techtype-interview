--
-- Drop all tables
--
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS nodes;

--
-- Create all tables from scratch
--
CREATE TABLE IF NOT EXISTS nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER NULL,
    -- Lowercase
    path TEXT NOT NULL UNIQUE,
    -- created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES nodes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value REAL NOT NULL,
    -- created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (node_id) REFERENCES nodes (id) ON DELETE CASCADE,
    --
    -- Avoid duplicated keys for the same node
    --
    UNIQUE(node_id, key)
);

--
-- Insert sample records
--

-- id: 1
INSERT INTO nodes(name, path) VALUES ('AlphaPC', '/alphapc');
INSERT INTO properties(node_id, key, value) VALUES (1, 'Height', 450.00);
INSERT INTO properties(node_id, key, value) VALUES (1, 'Width', 180.00);

-- id: 2
INSERT INTO nodes(name, path, parent_id) VALUES ('Processing', '/alphapc/processing', 1);
INSERT INTO properties(node_id, key, value) VALUES (2, 'RAM', 3200.00);

-- id: 3
INSERT INTO nodes(name, path, parent_id) VALUES ('CPU', '/alphapc/processing/cpu', 2);
INSERT INTO properties(node_id, key, value) VALUES (3, 'Cores', 4);
INSERT INTO properties(node_id, key, value) VALUES (3, 'Power', 2.41);

-- id: 4
INSERT INTO nodes(name, path, parent_id) VALUES ('Graphics', '/alphapc/processing/graphics', 2);
INSERT INTO properties(node_id, key, value) VALUES (4, 'RAM', 4000.00);
INSERT INTO properties(node_id, key, value) VALUES (4, 'Ports', 8.00);

-- id: 5
INSERT INTO nodes(name, path, parent_id) VALUES ('Storage', '/alphapc/storage', 1);

-- id: 6
INSERT INTO nodes(name, path, parent_id) VALUES ('SSD', '/alphapc/storage/ssd', 5);
INSERT INTO properties(node_id, key, value) VALUES (6, 'Capacity', 1024.00);
INSERT INTO properties(node_id, key, value) VALUES (6, 'WriteSpeed', 250.00);

-- id: 7
INSERT INTO nodes(name, path, parent_id) VALUES ('HDD', '/alphapc/storage/hdd', 5);
INSERT INTO properties(node_id, key, value) VALUES (7, 'Capacity', 5120.00);
INSERT INTO properties(node_id, key, value) VALUES (7, 'WriteSpeed', 1.724752);


--
-- Change mode
--
.mode box

--
-- Query sample records
--
SELECT * FROM nodes;
SELECT * FROM properties;
