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
    1. Composer `string, required`
    2. Title `string, required`
    3. Movements `array`
        1. Name `string` — can be omitted.
        2. Performers (name, type) `Map required`
        3. Year recorded `number required`
        4. Key (would be useful for filtering) `string required`
        
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
    `Title:Sonata,Key:fm,Composer:Beethoven`
    
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

5. For tests, we'll use **jest**
