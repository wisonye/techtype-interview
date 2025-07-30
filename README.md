# Techtype Interview

To build a `NodeJS + Typescript` HTTP server to manipulate the nodes with properties.

## Tech stacks
- Typescript
- Node TLS (v22)
- Express
- SQLite

</br>


## Folder structure

```fish
tree --gitignore
.
├── db                                 # SQLite dabase files and reset-db SQL
│   ├── demo.db
│   └── reset-db.sql
├── docs
│   ├── solution.md                    # Interview analysis and solution with plan
│   └── sqlite-quick-tutorial.md       # Quick CLI SQLite tutorial during my learning process for this interview task
├── package-lock.json
├── package.json
├── README.md
├── src
│   ├── db
│   │   ├── add_props_to_node_test.ts # Unit test
│   │   ├── create_node_test.ts       # Unit test
│   │   ├── query_node_test.ts        # Unit test
│   │   ├── error_messages.ts         # Error message constants
│   │   ├── schema.ts                 # Database schema and interfaces
│   │   └── sqlite_db.ts              # SQLite databse logic implementation
│   ├── server.ts                     # Express HTTP server
│   ├── services
│   │   └── nodes.ts                  # `/api/nodes` route service
│   └── utils
│       ├── logger.ts                 # Simlpe logger for this task
│       ├── validation_test.ts        # Unit test
│       └── validation.ts
└── tsconfig.json
```

</br>


## Tests on the following OSs

- MacOS Sonoma 14.4.1 x86_64
- FreeBSD 14.3-RELEASE
- Alpine Linux edge x86_64

</br>


## How to setup


### Installation SQLite

```fish
#
# FreeBSD
#
doas pkg install sqlite3

#
# MacOS
#
brew install sqlite

#
# Alpine linux
apk --no-cache add sqlite
```

</br>

### Install dependencies and reset the database with the prefill records

```fish
npm install

npm run reset-db

# > demo@1.0.0 reset-db
# > cat db/reset-db.sql | sqlite3 db/demo.db
# 
# ┌────┬────────────┬───────────┬──────────────────────────────┐
# │ id │    name    │ parent_id │             path             │
# ├────┼────────────┼───────────┼──────────────────────────────┤
# │ 1  │ AlphaPC    │           │ /alphapc                     │
# │ 2  │ Processing │ 1         │ /alphapc/processing          │
# │ 3  │ CPU        │ 2         │ /alphapc/processing/cpu      │
# │ 4  │ Graphics   │ 2         │ /alphapc/processing/graphics │
# │ 5  │ Storage    │ 1         │ /alphapc/storage             │
# │ 6  │ SSD        │ 5         │ /alphapc/storage/ssd         │
# │ 7  │ HDD        │ 5         │ /alphapc/storage/hdd         │
# └────┴────────────┴───────────┴──────────────────────────────┘
# ┌────┬─────────┬────────────┬──────────┐
# │ id │ node_id │    key     │  value   │
# ├────┼─────────┼────────────┼──────────┤
# │ 1  │ 1       │ Height     │ 450.0    │
# │ 2  │ 1       │ Width      │ 180.0    │
# │ 3  │ 2       │ RAM        │ 3200.0   │
# │ 4  │ 3       │ Cores      │ 4.0      │
# │ 5  │ 3       │ Power      │ 2.41     │
# │ 6  │ 4       │ RAM        │ 4000.0   │
# │ 7  │ 4       │ Ports      │ 8.0      │
# │ 8  │ 6       │ Capacity   │ 1024.0   │
# │ 9  │ 6       │ WriteSpeed │ 250.0    │
# │ 10 │ 7       │ Capacity   │ 5120.0   │
# │ 11 │ 7       │ WriteSpeed │ 1.724752 │
# └────┴─────────┴────────────┴──────────┘
```

</br>

### Create `.env` file with the following settings

```conf
HOST="127.0.0.1"
PORT="8080"
# ENABLE_DEBUG_LOG="true"
```

Uncomment `ENABLE_DEBUG_LOG="true"` if you want to see debug log.

</br>

## How to run unit test

```fish
#
# Run unit test
#
npm run test

> demo@1.0.0 test
> tsx  --test-concurrency=1 --test

# (node:61729) ExperimentalWarning: SQLite is an experimental feature and might change at any time
# (Use `node --trace-warnings ...` to show where the warning was created)
# ✔ add_props_to_node should fail with: 'path' is invalid. (0.709597ms)
# ✔ add_props_to_node should fail with: Properties are empty. (0.114807ms)
# ✔ add_props_to_node should fail with: Node doesn't exists (0.418892ms)
# ✔ add_props_to_node should work (17.226873ms)
# (node:61736) ExperimentalWarning: SQLite is an experimental feature and might change at any time
# (Use `node --trace-warnings ...` to show where the warning was created)
# ✔ create_node_with_parent_path should fail with: 'name' is invalid. (0.693213ms)
# ✔ create_node_with_parent_path should fail with: 'parent_path' is invalid. (0.13401ms)
# ✔ create_node_with_parent_path should fail with: Parent node doesn't exists. (0.451829ms)
# ✔ create_node_with_parent_path should fail with: Node exists. (0.569762ms)
# ✔ create_node_with_parent_path should work (9.124546ms)
# (node:62965) ExperimentalWarning: SQLite is an experimental feature and might change at any time
# (Use `node --trace-warnings ...` to show where the warning was created)
# ✔ query_node_by_path should fail with: 'path' is invalid. (0.675106ms)
# ✔ query_node_by_path should fail with: Query node not found. (0.42399ms)
# ✔ query_node_by_path should work with path: /alphapc/storage (0.450068ms)
# ✔ query_node_by_path should work with path: /alphapc/processing (0.323417ms)
# ✔ is_valid_path should work (0.553981ms)
# ✔ is_valid_path should fail (0.108829ms)
# ✔ is_valid_name should work (0.09434ms)
# ✔ is_valid_name should fail (0.080437ms)
# ℹ tests 17
# ℹ suites 0
# ℹ pass 17
# ℹ fail 0
# ℹ cancelled 0
# ℹ skipped 0
# ℹ todo 0
# ℹ duration_ms 573.406411
```

</br>

## How to serve
```fish
#
# Serve http server
#
npm run dev


# > demo@1.0.0 dev
# > tsc --noEmit && tsx --env-file=.env src/server.ts
# 
# (node:83714) ExperimentalWarning: SQLite is an experimental feature and might change at any time
# (Use `node --trace-warnings ...` to show where the warning was created)
# Techtype interview server running at http://127.0.0.1:8080
# Nodes API: http://127.0.0.1:8080/api/nodes
```

</br>


## Http endpoint test

### Query node subtree

```fish
#
# path=/AlphaPC
#
curl "http://localhost:8080/api/nodes?path=/AlphaPC" | prettyjson
#   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                  Dload  Upload   Total   Spent    Left  Speed
# 100   252  100   252    0     0   119k      0 --:--:-- --:--:-- --:--:--  123k
# success: true
# data:
#   AlphaPC:
#     Height:     450
#     Width:      180
#     Processing:
#       RAM:      3200
#       CPU:
#         Cores: 4
#         Power: 2.41
#       Graphics:
#         Ports: 8
#         RAM:   4000
#     Storage:
#       SSD:
#         Capacity:   1024
#         WriteSpeed: 250
#       HDD:
#         Capacity:   5120
#         WriteSpeed: 1.724752

#
# path=/AlphaPC/processing
#
curl "http://localhost:8080/api/nodes?path=/AlphaPC/processing" | prettyjson
#   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                  Dload  Upload   Total   Spent    Left  Speed
# 100   116  100   116    0     0  69295      0 --:--:-- --:--:-- --:--:--  113k
# success: true
# data:
#   Processing:
#     RAM:      3200
#     CPU:
#       Cores: 4
#       Power: 2.41
#     Graphics:
#       Ports: 8
#       RAM:   4000

#
# path=/AlphaPC/storage
#
curl "http://localhost:8080/api/nodes?path=/AlphaPC/storage" | prettyjson
#   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                  Dload  Upload   Total   Spent    Left  Speed
# 100   124  100   124    0     0  80992      0 --:--:-- --:--:-- --:--:--  121k
# success: true
# data:
#   Storage:
#     SSD:
#       Capacity:   1024
#       WriteSpeed: 250
#     HDD:
#       Capacity:   5120
#       WriteSpeed: 1.724752
```

</br>

### Create new node and add properties

```fish
#
# Create `/laptop`
#
curl --request POST \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data '{ "name": "Laptop" }' \
    "http://localhost:8080/api/nodes" | prettyjson
#   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                  Dload  Upload   Total   Spent    Left  Speed
# 100    85  100    65  100    20   3179    978 --:--:-- --:--:-- --:--:--  4250
# success: true
# data:
#   id:   8
#   name: Laptop
#   path: /laptop

#
# Add properties to `/laptop`
#
curl --request PATCH \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data '{ "path": "/Laptop", "props": [{ "key": "BIOS Version", "value": 1.01 }, { "key": "RAM slots", "value": 2 }]}' \
    "http://localhost:8080/api/nodes" | prettyjson
#   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                  Dload  Upload   Total   Spent    Left  Speed
# 100   125  100    16  100   109   1254   8547 --:--:-- --:--:-- --:--:-- 10416
# success: true

#
# Create `/laptop/gpu`
#
curl --request POST \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data '{ "name": "GPU", "parent_path": "/laptop" }' \
    "http://localhost:8080/api/nodes" | prettyjson
#   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                  Dload  Upload   Total   Spent    Left  Speed
# 100   123  100    80  100    43  13155   7071 --:--:-- --:--:-- --:--:-- 20500
# success: true
# data:
#   id:        9
#   name:      GPU
#   path:      /laptop/gpu
#   parent_id: 8

#
# Add properties to `/laptop/gpu`
#
curl --request PATCH \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data '{ "path": "/Laptop/GPU", "props": [{ "key": "RAM", "value": 2400 }, { "key": "Model", "value": 4090 }]}' \
    "http://localhost:8080/api/nodes" | prettyjson
#   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                  Dload  Upload   Total   Spent    Left  Speed
# 100   119  100    16  100   103   1382   8896 --:--:-- --:--:-- --:--:-- 10818
# success: true

#
# Finally, query the `/laptop` node to see the result
#
curl "http://localhost:8080/api/nodes?path=/Laptop" | prettyjson
#   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                  Dload  Upload   Total   Spent    Left  Speed
# 100   102  100   102    0     0  30393      0 --:--:-- --:--:-- --:--:-- 34000
# success: true
# data:
#   Laptop:
#     BIOS Version: 1.01
#     RAM slots:    2
#     GPU:
#       Model: 4090
#       RAM:   2400
```

</br>

