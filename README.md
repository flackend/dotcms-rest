# DotcmsRest

A wrapper around the dotCMS REST API. **Requires jQuery** (ajax).

## Usage

You'll first want to create a new instance:

```js
var REST = new DotcmsRest();
```

Pass a config object with debug set to `true` to see debugging information in the console:

```js
var REST = new DotcmsRest({debug: true});
```

### Create a new contentlet

Publishing a new contentlet:

```js
REST.publishContentlet('Blog', {
    'title': 'How to Build a Boat',
    'body': '...'
}, <callback>);
```

Or simply save (without publishing):

```js
REST.saveContentlet('Blog', {
    'title': 'How to Build a Boat',
    'body': '...'
}, <callback>);
```

Both methods take an optional callback as the third paramater.

### Get a contentlet

Grab a contentlet:

```js
REST.getContentlet('9b4bda68-31b5-4997-1f78-b5a2e933dff9', function(contentlet) {
  if (contentlet) {
    ...
  }
});
```

### Query contentlets

Use a Lucene query to fetch contentlets:

```js
REST.query('+structureName:Blog +Blog.title:How to *', {limit: 10}, <callback>)
```

Available options are `limit`, `offset`, `orderBy`, and `render`.

### Update a contentlet

You can update a single contentlet:

```js
REST.updateContentlet('9b4bda68-31b5-4997-1f78-b5a2e933dff9', 'Blog', {
  title: 'How to Build a Row Boat'
}, <callback>);
```

**DotcmsRest** will put a lock on the identifier and won't try to update the contentlet if an update is still in progress.

`REST.updateContentlet()` will return `false` if the update is aborted.

You can also update multiple contentlets:

```js
REST.updateContentlets(['9b4bda68-31b5-4997-1f78-b5a2e933dff9', ...], 'Blog', {
  title: 'How to Build a Row Boat'
}, <callback>);
```

Each will be updated one at a time.

## To Do

- Make query function easier to work with (e.g.`REST.query('Blog', {author: 'John Smith'}, <callback>)`).
- Update library to use promises in addition to callbacks.
- Set up library so that you don't have to instantiate it (no more `var REST = new DotcmsRest();`)
- Move **dotcms-rest.es6** to **src/dotcms-rest.js**.
- May need to make it configurable to a specific DotCMS version if `structureName` support is removed for `contentType` (etc).
- Maybe publish to Bower and NPM?