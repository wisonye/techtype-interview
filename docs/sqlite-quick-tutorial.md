# SQLite CLI quick tutorial

Detailed doc is here: https://sqlite.org/cli.html

## Installation

```bash
#
# FreeBSD
#
doas pkg install sqlite3

#
# MacOS
#
brew install sqlite
```

</br>


## Open a database and quit

You can run `sqlite3` without given a databse files:

```sqlite
sqlite3

--
-- Use ".open FILENAME" to reopen on a persistent database, it saves automatically
--
open test.db

--
-- Create a table
--
create table contacts (id integer primary key,first_name text, last_name text, age integer);

--
-- Show all tables
--
sqlite> .tables
contacts

--
-- Show the table schema
--
sqlite> .schema people
CREATE TABLE contacts (id integer primary key,first_name text, last_name text, age integer);

--
-- Quit
--
.quit
```


Or you can open the given database files

```bash
.sqlite3 test.db
```

</br>


## List/query info

```sqlite
--
-- List all database
--
sqlite> .databases
main: /home/wison/node-ts/techtype-interview/db/demo.db r/w

--
-- List all tables in current database
--
sqlite> .tables
contacts

--
-- Show the table schema
--
sqlite> .schema contacts
CREATE TABLE contacts (
    id integer primary key,
    firstName text not null,
    lastName text not null,
    email text not null
);

--
-- Show current `mode`
--
sqlite> .mode
current output mode: list

--
-- Show the current settings
--
sqlite> .show
        echo: off
        eqp: off
    explain: auto
    headers: off
        mode: list
    nullvalue: ""
    output: stdout
colseparator: "|"
rowseparator: "\n"
        stats: off
        width:
    filename: db/demo.db
```

</br>


## Run shell command (e.g. `clear` scrueen)

You can run `.shell XXXX` to run any shell commands: 

``` sqlite
--
-- Clear the terminal screen
--
sqlite> .shell clear 

--
-- Normal `ls`
--
sqlite> .shell ls -lht
```

</br>


## Format output

### Change `separator`

By default, the column separator is `|`, so when you run a select statement, it looks like this:

```sqlite
sqlite> select * from contacts;
1|Jane|Doe|jane.doe@example.com
2|Jane|Doe|jane.doe@example.com
```


But you can change the separator to whatever you want, for example:

```sqlite
--
-- Set it to "\t|\t"
--
sqlite> .separator "\t|\t"

sqlite> select * from contacts;
1       |       Jane    |       Doe     |       jane.doe@example.com
2       |       Jane    |       Doe     |       jane.doe@example.com
```


### Change `mode`

The default `mode` is `list`

```sqlite
sqlite> select * from contacts;

1|Jane|Doe|jane.doe@example.com
2|Jane|Doe|jane.doe@example.com
```

But you can change it, the supported options are:

- `quote`: Numbers are displayed as ASCII text and NULL values are shown as "NULL". All columns are separated from each other by a comma (or whatever alternative character is selected using ".separator").

```sqlite
sqlite> .mode quote

sqlite> select * from contacts;
1,'Jane','Doe','jane.doe@example.com'
2,'Jane','Doe','jane.doe@example.com'
```


- `line`: Each column in a row of the database is shown on a line by itself. Each line consists of the column name, an equal sign and the column data. Successive records are separated by a blank line.

```sqlite
sqlite> .mode line

sqlite> select * from contacts;
        id = 1
firstName = Jane
    lastName = Doe
    email = jane.doe@example.com

        id = 2
firstName = Jane
    lastName = Doe
    email = jane.doe@example.com
```


- `column`: Each record is shown on a separate line with the data aligned in columns.

```sqlite
sqlite> .mode column

sqlite> select * from contacts;
id  firstName  lastName  email
--  ---------  --------  --------------------
1   Jane       Doe       jane.doe@example.com
2   Jane       Doe       jane.doe@example.com
```


- `box`:

``` sqlite
sqlite> .mode box

sqlite> select * from contacts;
┌────┬───────────┬──────────┬──────────────────────┐
│ id │ firstName │ lastName │        email         │
├────┼───────────┼──────────┼──────────────────────┤
│ 1  │ Jane      │ Doe      │ jane.doe@example.com │
│ 2  │ Jane      │ Doe      │ jane.doe@example.com │
└────┴───────────┴──────────┴──────────────────────┘
```


- `markdown`: 

``` sqlite
sqlite> .mode markdown

sqlite> select * from contacts;
| id | firstName | lastName |        email         |
|----|-----------|----------|----------------------|
| 1  | Jane      | Doe      | jane.doe@example.com |
| 2  | Jane      | Doe      | jane.doe@example.com |
```


- `table`:

``` sqlite
sqlite> .mode table

sqlite> select * from contacts;
+----+-----------+----------+----------------------+
| id | firstName | lastName |        email         |
+----+-----------+----------+----------------------+
| 1  | Jane      | Doe      | jane.doe@example.com |
| 2  | Jane      | Doe      | jane.doe@example.com |
+----+-----------+----------+----------------------+
```


- `insert`: Output data with `insert` SQL, useful for doing data migration

``` sqlite
--
-- Output `insert` sql with table name `my-contacts`
--
sqlite> .mode insert my-contacts

sqlite> select * from contacts;
INSERT INTO "my-contacts"(id,firstName,lastName,email) VALUES(1,'Jane','Doe','jane.doe@example.com');
INSERT INTO "my-contacts"(id,firstName,lastName,email) VALUES(2,'Jane','Doe','jane.doe@example.com');
```


### Fixed width and alignment

``` sqlite
--
-- `-xx` negative value means right-justify. `0` means auto width
--
sqlite> .width 10 -20 -20 0

sqlite> select * from contacts;
+------------+----------------------+----------------------+----------------------+
|     id     |      firstName       |       lastName       |        email         |
+------------+----------------------+----------------------+----------------------+
| 1          |                 Jane |                  Doe | jane.doe@example.com |
| 2          |                 Jane |                  Doe | jane.doe@example.com |
+------------+----------------------+----------------------+----------------------+


sqlite> .width 10 20 20 0

sqlite> select * from contacts;
+------------+----------------------+----------------------+----------------------+
|     id     |      firstName       |       lastName       |        email         |
+------------+----------------------+----------------------+----------------------+
| 1          | Jane                 | Doe                  | jane.doe@example.com |
| 2          | Jane                 | Doe                  | jane.doe@example.com |
+------------+----------------------+----------------------+----------------------+
```


### Wrap long text

``` sqlite
--
-- Wrap if test longer than 10 chars
--
sqlite> .mode markdown --wrap 10
sqlite> select * from contacts;
|     id     |      firstName       |       lastName       |   email    |
|------------|----------------------|----------------------|------------|
| 1          | Jane                 | Doe                  | jane.doe@e |
|            |                      |                      | xample.com |
| 2          | Jane                 | Doe                  | jane.doe@e |
|            |                      |                      | xample.com |

--
-- Wrap if test longer than 10 chars but to wrap at a word boundary
--
sqlite> .mode markdown --wrap 10 --wordwrap on
sqlite> select * from contacts;
|     id     |      firstName       |       lastName       |   email   |
|------------|----------------------|----------------------|-----------|
| 1          | Jane                 | Doe                  | jane.doe@ |
|            |                      |                      | example.  |
|            |                      |                      | com       |
| 2          | Jane                 | Doe                  | jane.doe@ |
|            |                      |                      | example.  |
|            |                      |                      | com       |
```

</br>

## SQL syntaxs and examples

Detailed doc is here: https://sqlite.org/lang.html

``` sqlite
--
-- Drop all tables
--
DROP TABLE IF EXISTS contacts;

--
-- Create all tables from scratch
--
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    user_name TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--
-- Insert sample recores
--
INSERT INTO contacts (first_name, last_name, user_name, age) VALUES (
    'Wison',
    'Ye',
    'wisonye',
    88
);
INSERT INTO contacts (first_name, last_name, user_name, age) VALUES (
    'John',
    'B',
    'johnb',
    99
);

--
-- Change mode
--
.mode box

--
-- Query sample recores
--
SELECT * FROM contacts;
```

</br>


## Execute SQL from a given file

For example, if you have a `reset-database.sql`, then you can do that in 2 ways:

### Redirect the file content (SQLs) to `sqlite` command

``` fish
cat db/reset-db.sql | sqlite3 db/demo.db

┌────┬────────────┬───────────┬───────────┬─────┬─────────────────────┐
│ id │ first_name │ last_name │ user_name │ age │     created_at      │
├────┼────────────┼───────────┼───────────┼─────┼─────────────────────┤
│ 1  │ Wison      │ Ye        │ wisonye   │ 88  │ 2025-07-28 13:12:51 │
│ 2  │ John       │ B         │ johnb     │ 99  │ 2025-07-28 13:12:51 │
└────┴────────────┴───────────┴───────────┴─────┴─────────────────────┘
```


### Run the `.read` command 

``` sqlite
sqlite3 db/demo.db

SQLite version 3.46.1 2024-08-13 09:16:08
Enter ".help" for usage hints.

sqlite> .read db/reset-db.sql
┌────┬────────────┬───────────┬───────────┬─────┬─────────────────────┐
│ id │ first_name │ last_name │ user_name │ age │     created_at      │
├────┼────────────┼───────────┼───────────┼─────┼─────────────────────┤
│ 1  │ Wison      │ Ye        │ wisonye   │ 88  │ 2025-07-28 13:16:43 │
│ 2  │ John       │ B         │ johnb     │ 99  │ 2025-07-28 13:16:43 │
└────┴────────────┴───────────┴───────────┴─────┴─────────────────────┘
```

</br>

## How to enable cascade deletion

### 1. You need to add `FOREIGN KEY (column) REFERENCES table (column) ON DELETE CASCADE`

For example:

```sqlite
CREATE TABLE IF NOT EXISTS nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER NULL,
    path TEXT NOT NULL UNIQUE,
    --
    -- `parent_id` referenct to the same table `id` column with cascade deletion!!!
    --
    FOREIGN KEY (parent_id) REFERENCES nodes (id) ON DELETE CASCADE
);
```


### 2. You MUST enable `foreign_keys` everytime after opening a database

`foreign_keys` is disabled after opening a database by default!!!

You MUST enable it everytime when opening a database:

```sqlite
--
-- Make sure to enable it if you want cascade deletion!!!
--
PRAGMA foreign_keys = ON;

--
-- Now, the cascade deletion should work as expected:)
--
DELETE FROM nodes where id=7;
```


</br>

## `node:sqlite` module


### Open and close database

```typescript
const DB_FILE = process.env.DB_FILE || './db/demo.db'
const db = new DatabaseSync(DB_FILE)

//
// Enable cascade deletion.
//
db.exec(`PRAGMA foreign_keys = ON;`)

db.close()
```

</br>

### Execute or query SQL


#### 1. you need to compiles a SQL statement into a prepared statement

```typescript
const sql = db.prepare('SELECT * FROM NODES;')
```

</br>

#### 2. Execute a prepared statement and handle the result

##### 2-1) Return all records

```typescript

const result = sql.all()
console.log(`>>> [ query_nodes ] - result: ${JSON.stringify(result, null, 4)}`)
```

Output:

```fish
>>> [ query_nodes ] - result: [
    {
        "id": 1,
        "name": "AlphaPC",
        "parent_id": null,
        "path": "/alphapc"
    },
    {
        "id": 2,
        "name": "Processing",
        "parent_id": 1,
        "path": "/alphapc/processing"
    },
    {
        "id": 3,
        "name": "CPU",
        "parent_id": 2,
        "path": "/alphapc/processing/cpu"
    },
    {
        "id": 4,
        "name": "Graphics",
        "parent_id": 2,
        "path": "/alphapc/processing/graphics"
    },
    {
        "id": 5,
        "name": "Storage",
        "parent_id": 1,
        "path": "/alphapc/storage"
    },
    {
        "id": 6,
        "name": "SSD",
        "parent_id": 5,
        "path": "/alphapc/storage/ssd"
    },
    {
        "id": 7,
        "name": "HDD",
        "parent_id": 5,
        "path": "/alphapc/storage/hdd"
    }
]
```

</br>


##### 2-2) Only get the first record

```typescript

const result = sql.get()
console.log(`>>> [ query_nodes ] - result: ${JSON.stringify(result, null, 4)}`)
```

Output:

```fish
>>> [ query_nodes ] - result: {
    "id": 1,
    "name": "AlphaPC",
    "parent_id": null,
    "path": "/alphapc"
}
```

</br>


##### 2-3) Return an object summarizing the resulting changes

```typescript

const result = sql.run()
console.log(`>>> [ query_nodes ] - result: ${JSON.stringify(result, null, 4)}`)
```

Output:

```fish
>>> [ query_nodes ] - result: {
    "lastInsertRowid": 0,
    "changes": 0
}
```




