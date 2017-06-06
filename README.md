# nti-lib-decorators

Provides a set of frequently used decorators such as `@readonly`.

-------------
Available decorators are:

### `@configurable(Boolean)`
***Note:*** Only applicable to properties.
Use this decorator to make a property configurable or not. (default is true, so the only real use is setting it false)
ex:
```js
//on object literals:
const o = {
	@configurable(false)
	something: 'foo'
}

//on class properties
class Foo {
	@configurable(false)
	something = 'bar'
}
```
### `@nonconfigurable`
***Note:*** Only applicable to properties.
Use this decorator to make a property non-configurable
ex:
```js
//on object literals:
const o = {
	@nonconfigurable
	something: 'foo'
}

//on class properties
class Foo {
	@nonconfigurable
	something = 'bar'
}
```

### `@enumerable(Boolean)`
***Note:*** Only applicable to properties.
Use this decorator to make a property enumerable or not. (default is true, so the only real use is setting it false)
ex:
```js
//on object literals:
const o = {
	@enumerable(false)
	something: 'foo'
}

//on class properties
class Foo {
	@enumerable(false)
	something = 'bar'
}
```

### `@nonenumerable`
***Note:*** Only applicable to properties.
Use this decorator to make a property non-enumerable
ex:
```js
//on object literals:
const o = {
	@nonenumerable
	something: 'foo'
}

//on class properties
class Foo {
	@nonenumerable
	something = 'bar'
}
```
### `@readonly`
***Note:*** Only applicable to properties.
Use this decorator to make a property configurable or not. (default is true, so the only real use is setting it false)
ex:
```js
//on object literals:
const o = {
	@configurable(false)
	something: 'foo'
}

//on class properties
class Foo {
	@configurable(false)
	something = 'bar'
}
```

### `@deprecated`
### `@mixin(...partials)`
Mix-in one or more partials into a class.

```js
const LikeBehavior = {
	like () {
		//post api
	}
}

const JSONValue = {
	toJSON () {
		return 'nah';
	}
}

@mixin(LikeBehavior, JSONValue)
class Note extends Component {
	//...
	onClick () {
		this.like();
	}
}
```
