# yaff-core
common things pack for yaff packages

## Named exports
- configuration, getConfigurationValue
- extend
- knownCtors, isKnownCtor
- invokeValue
- uniqueId
- takeFirst
- isClass
- debounce
- domApi

## configuration
Its an object with default values for features used by yaff packages you will find them in certain library docs.  
Feel free to add values to configuration:

```js
import { configuration } from 'yaff-core';

configuration['foo.bar'] = 'baz';

```

## getConfigurationValue(key, myValue, lastChanceValue)
*signatures:*  
**`getConfigurationValue(key)`**  
returns exact value of configuration object by given key
```js
import { configuration, getConfigurationValue } from 'yaff-core';
configuration['foo.bar'] = 'baz';

getConfigurationValue('foo.bar'); // 'baz'

```

**`getConfigurationValue(key, myValue)`**  
returns provided user value if its defined (not equal undefined) otherwise value from configuration:  
```js
import { configuration, getConfigurationValue } from 'yaff-core';
configuration['foo.bar'] = 'baz';

getConfigurationValue('foo.bar', 'bazooka'); // 'bazooka'
getConfigurationValue('foo.bar', null); // null
getConfigurationValue('foo.bar', undefined); // 'baz'

```

**`getConfigurationValue(key, myValue, lastChanceValue)`**  
in case when user value is undefined will try to use the last chance value as return value:
```js

import { configuration, getConfigurationValue } from 'yaff-core';
configuration['foo.bar'] = 'baz';

getConfigurationValue('foo.bar', null, 'bazooka'); // null
getConfigurationValue('foo.bar', undefined, 'bazooka'); // 'bazooka'
getConfigurationValue('foo.bar', undefined, null); // null
getConfigurationValue('foo.bar', undefined, undefined); // 'baz'

```

## extend(proto, static)
Returns new class definition with provided prototype and static method derived from `this`.  
For those who familiar with backbone framework this should be clear.  
how to use:  
```js
import { extend } from 'yaff-core';

const MyClass = function() { }
MyClass.extend = extend;

const MyDerived = MyClass.extend({ 
	propertyA: 'foo',
	propertyB: 'bar',
	methodA() { },
	methodB() { },
}, {
	someStaticMethod(arg) {
		return arg;
	}
});

MyDerived.someStaticMethod('foo'); // 'foo';

const obj = new MyDerived();
// obj instanceof MyDerived is true
// obj instanceof MyClass is true

```
In case you want to modify constructor:
```js
import { extend } from 'yaff-core';

const MyClass = function() { }
MyClass.extend = extend;

MyClass.extend({
	constructor: function() {
		// while in old js you are able to insert code before applying constructor
		// this is not recommended.
		MyClass.apply(this, arguments);
		// insert your code here
	}
});

```

differences with backbone:
1. you are able to access parent's prototype through `super` property:
```js
import { extend } from 'yaff-core';
const Base = function() { };
Base.extend = extend;

const Main = Base.extend({
	getValue(x) {
		return x*2;
	}
});

const Specific = Main.extend({
	getValue(x) {
		x = this.super.getValue.apply(this, arguments);
		return x*2;
	}
});

const main = new Main();
main.getValue(2); // 4

const specific = new Specific();
specific.getValue(2); // 8

```
2. You can use it with ES6 classes if you wish.  
```js
// assume we have Main defined as in previous example

// this will works
class Es6Main extends Main {

} 

// this will works too
const DerivedEs6 = Es6Main.extend({
	constructor: function() {
		// notice there is no need to call Es6Main.apply(this, arguments)
		// `extend` do it for you.
		this.somethind = 'foo';
	}
});

```

## knownCtors[] & isKnownCtor(arg)
this array used for determine if a function may be invoked. In other words you can put here all your class definitions:
```js
import { knownCtors, isKnownCtor } from 'yaff-core';

class MyClass {};
class Derived extends MyClass {};

isKnownCtor(Derived); //false

knownCtors.push(MyClass);

isKnownCtor(MyClass); //true
isKnownCtor(Derived); //true

```

## invokeValue(value, context, invokeArguments)
Tryies to invoke given value with context and arguments.  
*signatures:*  
**`invokeValue(value)`**  
**`invokeValue(value, context)`**  
**`invokeValue(value, context, invokeArgs)`**  

```js

import { invokeValue, knownCtors } from 'yaff-core';

class MyClass {}
knownCtors.push(MyClass);

invokeValue('foo'); // 'foo'
invokeValue(() => 'foo'); // 'foo'

const context = {
	foo: 'bar',
	test() {
		return this.foo;
	},
	sum(a,b) {
		return this.foo + (a + b);
	}
}

invokeValue(context.test, context); // 'bar'

invokeValue(context.sum, context, [1,2]); // 'bar3'

```
> NOTE:  
> There is a difference how internally invoked a method with/without invokeArguments:  
> If invokeArguments is an array:  
>  `method.apply(context, invokeArguments)`  
> If invokeArguments is not provided:  
> `method.call(context)`  
> If invokeArguments is any value except an array:  
> `method.call(context, invokeArguments)`  
> And in Case when you want to pass exactly array as a single argument you have to wrap it with array:  
> `invokeValue(method, context, [ yourArray ])`  

## uniqueId(prefix)
returns unique id for runtime. 

*signatures*:
**`uniqueId()`**
**`uniqueId(prefix)`**

```js
import { uniqueId } from 'yaff-core';

const id1 = uniqueId(); // 1
const id2 = uniqueId(); // 2
const id3 = uniqueId('component'); // 'component3'

```

## takeFirst(key, ...objects)
returns first non undefined value from given objects.
```js
import { takeFirst } from 'yaff-core';

const obj1 = {}
const obj2 = { foo: undefined }
const obj3 = { foo: null }
const obj4 = { foo: 'bar' }

takeFirst('bar', obj1, obj2, obj3, obj4); // null
takeFirst('bar', obj1, obj2, obj4); // 'bar'

```

## isClass(arg, SomeClass)
compares two given arguments and return true if `arg` is `SomeClass` or Class derived from `SomeClass`
```js
import { isClass } from 'yaff-core';

class MyClass {};
class Derived extends MyClass {};

isClass(null, MyClass); // false
isClass(() => {}, MyClass); // false
isClass(Derived, MyClass); // true
isClass(MyClass, MyClass); // true

```

## debounce(method, milliseconds, immediate)
Debounces provided method for given amount of milliseconds (protects the method to being multiple called during runtime).  
*signatures:*  
**`debounce(method)`** - equals to `debounce(method, 0)`  
**`debounce(method, milliseconds)`**  
**`debounce(method, milliseconds, immediate)`**  
```js
import { debounce } from 'yaff-core';

const method = (arg) => console.log(arg);
const debounced = debounce(method, 100);
const immediated = debounce(method, 100, true);

debounced(1); // will setup timeout to log `1` after 100ms
debounced(2); // will resetup timeout to log `2` after 100ms
debounced(3); // will resetup timeout to log `3` after 100ms

immediated(1); // immediately logs `1`
immediated(2); // will swallow
immediated(3); // will swallow

// at this point method will be called only once by first `immediated`
// and the seccond and the last call will hapens later after 100ms

```

## domApi
This object contains methods for DOM manipulating.  
Feel free to override those methods or/and add own.  

### domApi.createElement(tagName) 
Creates an element with given tagName

### domApi.setAttributes(el, attrs)
Sets element attributes by attributes hash

### domApi.setAttribute(el, key, value)
Sets or removes element attribute by given key

### domApi.render(el, templateFunc, templateContext)
internally does exactly this:  
`el.innerHTML = templateFunc(templateContext)`
Some abstraction layer for implementing template based rendering.

### domApi.findChildElement(el, selector)
Looks for childNode by given selector

### domApi.attachElement(elementToAttach, anchorElement, attachType, attachIndex) 
Attaches element to anchorElement with given attachType.  
attachTypes are: `"append"`, `"prepend"`, `"before"`, `"after"`, `"replaceContent"` and `"replace"`  

common attachType explanation:  
**`"append"`:**
```html
<div id="anchor-element">	
	<p>exist context</p>
	<!-- will be insert here -->
</div>
```
**`"prepend"`:**
```html
<div id="anchor-element">	
	<!-- will be insert here -->
	<p>exist context</p>
</div>
```
**`"before"`:**
```html
<!-- will be insert here -->
<div id="anchor-element">	
	<p>exist context</p>
</div>
```
**`"after"`:**
```html
<div id="anchor-element">	
	<p>exist context</p>
</div>
<!-- will be insert here -->
```
**`"replaceContent"`:**
```html
<div id="anchor-element">	
	<!-- will remove all childNodes and be insert here -->
</div>
```
**`"replace"`:**  
Will replace anchorElement with elementToAttach.  
*before*
```html
<div>
	<div id="anchor-element">	
		<p>exist context</p>
	</div>
</div>
```
*after*
```html
<div>
	<div id="element-to-attach"></div>
</div>
```

There is also `attachIndex` parameter which works with `"before"` and `"after"` attach types.  
It will try to attach before/after anchor element's child by given index.
Suppose we have this html:
```html
<section id='anchor-element'>
	<p index=0></p>
	<p index=1></p>
	<p index=2></p>
	<p index=3></p>
	<p index=4></p>
	<p index=5></p>
	<p index=6></p>
</section>
```
And now we are agoing to attach child element `before` child with index 2 (3rd child):  
`domApi.attachElement(myEl, attachElement, 'before', 2)`
```html
<section id='anchor-element'>
	<p index=0></p>
	<p index=1></p>
	<!-- will insert here -->
	<p index=2></p>

```
or insert after child with index 4  
`domApi.attachElement(myEl, attachElement, 'after', 4)`
```html
<section id='anchor-element'>
	<p index=0></p>
	<p index=1></p>
	<p index=2></p>
	<p index=3></p>
	<p index=4></p>
	<!-- will insert here -->
```


### domApi.detachElement(el)
Removes element from the DOM

----------
[yaff repo link](https://github.com/taburetkin/yaff)
