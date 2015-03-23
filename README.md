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
});
```

Or simply save (without publishing):

```js
REST.saveContentlet('Blog', {
    'title': 'How to Build a Boat',
    'body': '...'
});
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