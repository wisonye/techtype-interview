# Techtype Interview

To build a `NodeJS + Typescript` HTTP server which matches the following requirements.

## Requirement


### Tech stacks
- Typescript
- Node TLS
- Any relational database

</br>


### Data structure

Create a data structure that matches the following needs:

- Each `node` has a `name`. 
- Each `node` can have any number of properties. A property is a key value pair, where the key is a `string` and the value is a decimal `number`.
- The `path` of a node can be inferred from the `name` hierarchy (e.g. `/root/parent/child`). 
- The `node` instance is able to save into databse and query by the the `path`.

For example, A PC (root node) is built from a tree of nodes (entries with values (key value pair) are properties, others are `node` instance with `name`):

```markdown
- AlphaPC
  - Height: 450.00
  - Width: 180.00
  - Processing
    - CPU
      - Cores: 4
      - Power: 2.41
    - Graphics
      - RAM: 4000.00
      - Ports: 8.00
    - RAM: 32000.00
  - Storage
    - SSD
      - Capacity: 1024.00
      - WriteSpeed: 250.00
    - HDD
      - Capacity: 5120.00
      - WriteSpeed: 1.724752
```


</br>


### Backend functionalities

The entire backend includes the following http route and related functionalities:

- `/api/node` (post): Create a `node`(from the HTTP JSON body) with a specified `parent`(string), save to database.
- `/api/node` (patch): Add a new property(JSON key value pair) on a specific existing `node`, update to database.
- `/api/node` (get): Return the subtree of nodes with their properties in JSON format for a provided node path, query from database.

Create unit tests for endpoint above.

</br>


## My Solutions

### Data structure

So, my first thought with this should be look like below:

```typescript
export interface Property {
    //
    // The unique ID, which serves as the primary key, can be either a UUID
    // string or an auto-incrementing integer.
    //
    id?: number;
    //
    // To indicate that the owner of this property, which serves as a foreign
    // key in database
    //
    node_id: number;
    //
    // key, value pair
    //
    key: string;
    value: number;
}

export interface Node {
    //
    // The unique ID, which serves as the primary key, can be either a UUID
    // string or an auto-incrementing integer.
    //
    id?: number;
    //
    // The name that is displayed in UI
    //
    name: string;
    //
    // The unique query path, e.g. `/root/parent/child`, this will be
    // manipulated automatically when be saving or updating.
    //
    path: string;
    //
    // The parent node id
    //
    parent_id?: number;
    //
    // Optional create time (not sure I will use it or not, just put it there)
    //
    created_at?: string;
    //
    // Associated properties
    //
    props?: Property[]
    //
    // Sub nodes
    children?: Node[]
}
```

It might change when I work on it later, but so far, it looks good to me, and I believe it should work:)

</br>


### About the database

To keep it simple, I will choose SQLite for the following reasons:

- I never had a chance to try it, even though I heard about it for a very long time: super simple, fast and easy to deal with.

- It's good to keep the database setup as simple as possible, and I like to try things, so why not?:)

- Also, I heard that Node has an official built-in `sqlite` module, so I don't need the extra third-party dependencies and ORM, good for interview task.

</br>


### Project folder structure

```fish
docs/           # The project docs like this one
db/             # SQLite database files and init SQL to reset the database
src/            # Typescript source code
src/utils       # To hold some reuse functions
src/server.ts   # The HTTP server
src/temp.ts     # For the temporary isolated function test purposes by running `npm run temp`
```


</br>


## Tasks

I'll set up a few GitHub issues as tasks to help both you and me track my progress, so you can interact with me when needed, e.g., clone the repo and run it to see what I've got so far, or correct me if I'm going in the wrong direction, etc.


### 1. Latest Node + Typescript project setup

In this case, I use `tsx` (https://tsx.is/getting-started) to run typescript, it doesn't matter for me if you use different:)

I will write some test code for the data structure POC.


</br>



### 2. Learn SQLite and setup database init SQL

Based on my experience, I believe that I should be able to play around with SQLite after fishing watching this 22mins tutorial: `SQLite Introduction - Beginners Guide to SQL and Databases` [https://www.youtube.com/watch?v=8Xyn8R9eKB8]. At least, it's enough to deal with this task:)

After that, I'll create a `reset-db` script in the `package.json` as part of the `How to run` step, which should be included in the `README.md` eventually.

Also, I have a habit of writing a quick tutorial doc when I try a new thing. No worry, it won't take up my extra time, as I do that very quickly, this task should be done in 2 hours, I believe.

For further needs, here are the online references I can read through when I need help:

https://sqlite.org/lang.html
https://sqlite.org/cli.html


</br>



### 3. Learn how to deal with `sqlite` in `Node` and implement the core functionalities

Here is the online tutorial after a quick google search:
https://www.javascripttutorial.net/nodejs-tutorial/nodejs-sqlite/

And here is the official API doc when I need help:
https://nodejs.org/docs/latest-v22.x/api/sqlite.html

After reading the docs, I believe I can start coding the core part to handle the following functionalities:

- Create a `node` by the given the JSON ( with `Node` interface I guess) with a specified `parent`(string), save to database.
- Add a new property(JSON key value pair) on a specific existing `node`, update to database.
- Return the subtree of nodes with their properties in JSON format for a provided node path, query from database.


A few hours maybe....


</br>



### 4. Write unit test for the core Services/APIs

Finally, write unit test for the service API, here are the API docs (with examples) I need:

https://nodejs.org/docs/latest-v22.x/api/test.html
https://nodejs.org/docs/latest-v22.x/api/assert.html


</br>


### 5. Finally, wrap the Services/APIs and export to the `Express` routes



</br>


### 6. Update `README.md`

I will add `How to setup` and `How to run` sections.


</br>


### 7. Optionally, if I finish earlier and still have time, I can deploy to `Google Cloud Run`, then you can test the HTTP API online:)
