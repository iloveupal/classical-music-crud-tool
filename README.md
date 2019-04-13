# classical-music-crud-tool

a little tool to manage a classical music collection.

### Requirements

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

### Design

* **Adding/editing a composition**
The app will have a create/update screen. Fields are:
    * Composer `string, required`
    * Title `string, required`
    * Movements `array`
        1. Title `string`
        2. Key `string`
        3. Recordings `array`
            * Performers (name, type) `array`
            * Year recorded `number`
        
    We should be able to upload music files in a batch.
    Also we should check if the files are music files.

* **Listing compositions**
As someone who will be using this tool,
I would like to view all of my created compositions.
    
    Also, I would like to be able to:
    1. Sort compositions by title, composer's name, added date. 
    2. Filter them by multiple criteria. As it is an internal tooling,
    probably it would be good to be able to filter entities directly in the search field
    with some smart query parsing. For example,
    `Title=Sonata;Key=fm;Composer=Beethoven`
    
### Choosing fighters

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

### API

#### READ

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
        title — partial match
        composer — partial match
    Movement filters:
        m_title - partial match.
        key — just a regular key like: a#, b, c#m, dm. exact match
    Recording filters:
        performer - partial match
        instrument - partial match
        year - exact match

@param limit {number} Number of entities to return, default 50.

@param prev_page_marker {string} Used for pagination.

@param sort {string} Sorting key
    Possible values:
        most_recent
        title
        composer
**/
```

**Returns:**

Returns matching compositions with movements and recordings inside.
Will also return an object with filters.

**Examples:** 

Let's say we filter only by title.

    title=moonlight

```javascript
    {
        success: true,
        errors: [],
        filters: {
            title: 'moonlight'
        },
        // total amount of results for this query.
        total: 1,
        results: [
             {
                 // the composition itself
                 id: '<some random id>',
                 type: 'composition',
                 title: 'Sonata No. 14 — Moonlight Sonata',
                 composer: 'Ludwig van Beethoven',
                 movements_count: 3,
                 // because no filters for movements were used,
                 // they're going to be omitted.
                 movements: [{...}, {...}, {...}],
             },
        ]
    }
```

If we request for
    
    title=moonlight;m_title=allegretto

```javascript
    {
        success: true,
        errors: [],
        filters: {
            title: 'moonlight',
            m_title: 'allegretto',
        },
        // total amount of results for this query.
        total: 1,
        results: [
             {
                 // the composition itself
                 id: '<some random id>',
                 type: 'composition',
                 title: 'Sonata No. 14 — Moonlight Sonata',
                 composer: 'Ludwig van Beethoven',
                 movements_count: 3,
                 // because no filters for movements were used,
                 // they're going to be omitted.
                 movements: [{
                     id: '<some random id>',
                     title: 'II. Allegretto',
                     key: 'c#',
                     recordings_count: 2,
                     // no recording filters - no data about recordings.
                     recordings: [{...}, {...}],
                 }],
             },
        ]
    }
```

If we request for
    
    title=moonlight;m_title=allegretto;performer=perahia
    
```javascript
    {
        success: true,
        errors: [],
        filters: {
            title: 'moonlight',
            m_title: 'allegretto',
        },
        // total amount of results for this query.
        total: 1,
        results: [
             {
                 // the composition itself
                 id: '<some random id>',
                 type: 'composition',
                 title: 'Sonata No. 14 — Moonlight Sonata',
                 composer: 'Ludwig van Beethoven',
                 movements_count: 3,
                 // because no filters for movements were used,
                 // they're going to be omitted.
                 movements: [{
                     id: '<some random id>',
                     title: 'II. Allegretto',
                     key: 'c#',
                     recordings_count: 2,
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
     type: 'composition',
     title: 'Sonata No. 14 — Moonlight Sonata',
     composer: 'Ludwig van Beethoven',
     movements_count: 3,
     // because no filters for movements were used,
     // they're going to be omitted.
     movements: [{...}, {...}, {...}],
}
```

#### DELETE

**`DELETE /compositions/:id`**

**`DELETE /movements/:id`**

**`DELETE /recordings/:id`**

#### UPDATE

**`PUT /compositions/:id`**

```javascript
{
    title,
    composer 
}
```

**`PUT /movements/:id`**

```javascript
{
    title,
    key
}
```

**`PUT /recordings/:id`**

```javascript
{
    performers,
    year
}
```

#### CREATE

**`POST /compositions`**

```javascript
{
    title,
    composer 
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
