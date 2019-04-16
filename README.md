# classical-music-crud-tool

a little tool to manage a classical music collection.

#### Guide

To start:

```
git clone https://github.com/iloveupal/classical-music-crud-tool.git
cd classical-music-crud-tool

yarn
```

You can start a dev environment by (you'll have to have mongo up and running on 27017)

```
yarn dev
```

Or you can build and it should start working automatically.

```
yarn prod
docker-compose up
```

By default, 8080 port is used.

To run tests:

```
yarn test:server
yarn test:app
```

#### Analyzing requirements

I suppose that the purpose of this test assignment is to emulate a work on
an internal tooling for Idagio. As for internal tooling, I thought
these features would be desired:

- **Search** — as an employee, I want to be able to search easily for all entities.
  That made me think of something like an ElasticSearch or MongoDB as a storage.
- **Router navigation and code splitting** - I would want to be able to drop a link to a colleague.
  That's why it would be nice to have a router inside of the react application.
  Why won't we use server-side routing?
  Because, although, it will work fast for an initial rendering and it is simple
  to implement, on every location change, we will have to do the same again.
  The opposite isn't the best option as well: having a heavy front-end application,
  although, will help us navigate faster, but will also take huge time for the initial load.
  A compromise is to use a dynamic module loading. We will only load
  the code that is required. Fortunately, it is easily done in webpack.
  Even though, this application isn't large enough yet,
  nobody knows for sure that a small internal tooling won't become a large
  admin dashboard eventually. It is always good to ensure scalability, in my opinion.
- **Identifying metadata from an uploaded file automatically** When I'm uploading a sound file,
  I would like to have the metadata be automatically parsed
  for me, with an ability to correct it, of course.

#### Design

**Adding/editing a composition**

The app will have a create/update screen. Fields are:

```
Composer — string
Title — string
Movements — array
    Title — string
    Key — string
    Recordings — array
        Performers - array
            Name - string
            Type - string
        Year - number
```

The flow as I see it is:

1. User goes to Create screen.
2. The composition entity is created.
3. We can enter the title and composer's name
4. We also can add a movement
5. A movement entity will be created.
6. We can enter movement's title and select the key
7. We can add recordings to the movement
8. To create a recording we should upload a file first.
9. Artists and year will be automatically parsed for us
10. We can repeat any of the steps before we call it done.

**Listing compositions**

The flow for the list screen as I see it:

1. User can search for entities
2. User can edit each of the compositions. it will redirect him to the Update screen.
   which is the same as the Create screen.
3. User can also delete the whole composition.

#### Choosing stack

1. For the frontend, **React** seems a perfect choice. Opposed
   to jQuery-driven development, it is much easier to maintain scalability and clean code. Also the community is huge.

2. For the backend, **node.js, express** seems a good match. Why? Because
   it will allows us to have a shared codebase. For example, we can write a validation schema
   and use it on the frontend while we validate our form and on the backend when we receive
   a new request.

3. For the database, I will use **MongoDB** because it operates with
   javascript objects opposed to tables and columns like SQL.
   It also supports full text search which we need.

4. **Docker** so that we can easily deploy this.

5. For tests, we'll use **jest**.
   It has a clean api and it has integrations with technologies that we are using.

#### Approach

**Backend**

I used a simple architecture for the node.js app.

`Routes -> Controllers -> Models.`

In my opinion, this model is very flexible: if we have more entities, the
framework is rather simple: create a new routes directory, a new controller,
a new model. If we need some heavy features, we can start adding
services. I've also tried (not sure if I managed to) to maintain freedom from the database by
encapsulating any database-related code.
To ensure quality, I tested the backend as a whole.

**Frontend**

For the frontend I decided not to pick redux this time: the app is small,
no data is being used in different parts of the app.

I used a simple architecture for this app: just a simple router with few pages.
Possibly, because I was trying to keep-it-simple-stupid. Of course, this can be
grouped by feature for better scalability.

I wrote a few tests for the root components of the pages because they do the
heavy-lifting logic-wise. In a real project, I would also add snapshot testing
as well.

**Database**

I used a normalized data structure for the app because I think that gives us
more freedom, easy inserts and updates. However, search and get turned out
a little bit complicated. I think, further optimization can be done with
\$lookup aggregation.

#### Summary

I spend about 3 working days to complete this assignment.

Things I would like to improve:

- a better search and get database query.
- a less crappy design.
- perform end-to-end api tests in a more elegant way.
- some higher api abstraction for the form handling.
- more keep-it-simple-stupid.

#### API

##### READ

Now that we've designed the requirements, we can proceed to api.

**`GET /compositions`**

List or filter compositions.

**Query parameters:**

```javascript
/**

@type {string} Filter A key to filter by.
@type {string} FilterValue A value to filter by.

@param search {Map<Filter, FilterValue>} Filters to apply.
    
    Composition filters:
        text — partial match
    Movement filters:
        movement - Movement title, partial match.
        key — Harmonic key, use {base_note}[{_s for sharp}][{_m for minor}]. exact match
    Recording filters:
        performer - exact match
        type - exact match
        year - exact match

@param limit {number} Number of entities to return, default 50.

@param offset {string} Number of entities to skip
**/
```

**Returns:**

Returns matching compositions with movements and recordings inside.
Will also return an object with filters.

**Examples:**

Let's say we filter only by title.

    text=moonlight

```javascript
    {
        success: true,
        errors: [],
        // total amount of results for this query.
        count: 1,
        result: [
             {
                 // the composition itself
                 _id: '<some random id>',
                 title: 'Sonata No. 14 — Moonlight Sonata',
                 composer: 'Ludwig van Beethoven',
                 movements: [{...}, {...}, {...}],
             },
        ]
    }
```

If we request for

text=moonlight;movement=allegretto

```javascript
    {
        success: true,
        errors: [],
        // total amount of results for this query.
        count: 1,
        result: [
             {
                 // the composition itself
                 id: '<some random id>',
                 title: 'Sonata No. 14 — Moonlight Sonata',
                 composer: 'Ludwig van Beethoven',
                 movements: [{
                     id: '<some random id>',
                     title: 'II. Allegretto',
                     key: 'c#',
                     // no recording filters - no data about recordings.
                     recordings: [{...}, {...}],
                 }],
             },
        ]
    }
```

If we request for

text=moonlight;movement=allegretto;performer=perahia

```javascript
    {
        success: true,
        errors: [],
        // total amount of results for this query.
        count: 1,
        result: [
             {
                 // the composition itself
                 id: '<some random id>',
                 type: 'composition',
                 title: 'Sonata No. 14 — Moonlight Sonata',
                 composer: 'Ludwig van Beethoven',
                 // because no filters for movements were used,
                 // they're going to be omitted.
                 movements: [{
                     id: '<some random id>',
                     title: 'II. Allegretto',
                     key: 'c#',
                     // no recording filters - no data about recordings.
                     recordings: [{
                         id: '<some random id>',
                         performers: [
                             {
                                 name: 'Murray Perahia',
                                 type: 'piano',
                             }
                         ],
                         year: 2018
                     }],
                 }],
             },
        ]
    }
```

**`GET /compositions/:id`**

Gets the whole composition with its movements and recordings.

**Returns:**

```javascript
{
     id: '<some random id>',
     title: 'Sonata No. 14 — Moonlight Sonata',
     composer: 'Ludwig van Beethoven',
     movements: [{...}, {...}, {...}],
}
```

##### DELETE

**`DELETE /compositions/:id`**

**`DELETE /movements/:id`**

**`DELETE /recordings/:id`**

**Returns**

All entity deletion requests return

```javascript
{
    "success": true,
    "result": {
        "ok": 1,
        "deleted": <count of deleted docs>
    }
}
```

##### UPDATE

**`PUT /compositions/:id`**

```javascript
{
  title, composer;
}
```

**`PUT /movements/:id`**

```javascript
{
  title, key;
}
```

**`PUT /recordings/:id`**

```javascript
{
  performers, year;
}
```

**Returns**

All entity update requests return

```javascript
{
    "success": true,
    "result": {
        "ok": 1,
        "updated": <count of updated docs>
    }
}
```

##### CREATE

**`POST /compositions`**

```javascript
{
  title, composer;
}
```

**`POST /movements`**

```javascript
{
    title,
    key,
    parent: <composition id>
}
```

**`POST /recordings`**

```javascript
{
    year,
    performers,
    parent: <movement id>
}
```

**Returns**

All entity creation requests return

```javascript
{
    "success": true,
    "result": <id of the entity inserted>,
}
```

**`POST /recordings/upload`**

File upload. Will return a unique id, under which this file will be stored, artists and year (if found in metadata).

**Request**

```
type: FormData
field: file
```

**Returns**

```
{
    "success": true,
    "errors": [],
    "result": {
        "_id": "5cb3c6bb7415d56645d65632",
        "metadata": {
            "artists": [
                "Svyatoslav Richter"
            ],
            "year": 1994
        }
    }
}
```
