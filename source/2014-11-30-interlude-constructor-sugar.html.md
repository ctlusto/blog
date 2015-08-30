---
title: Interlude - Constructor Sugar
date: 2014-11-30 17:26 UTC
tags:
category: desmos
summary: If you're interested in some nuances of constructors in Javascript, this is for you.
---

# ~ Interlude - Constructor Sugar ~
If you were paying attention in the last post, you may have noticed something slightly weird and interesting about the way we called the Desmos contructor:

~~~ javascript
var calc = Desmos.Calculator(document.getElementById('calc'));
~~~

Normally when we create an instance of a custom object type, we have to use the `new` keyword. We didn't do that here, and yet the constructor still returned a fully-baked `Desmos.Calculator` object, which is exactly what we expect from well-behaved constructors. What gives?

###### &sect; A brief refresher on the `new` operator
Even though Javascript doesn't have a notion of classes like other object-oriented languages, it still allows you to define your own object types and then create instances of those types which inherit properties and behavior from a prototype. The way you tell the interpreter that you'd like to create such an instance is by using the `new` keyword.  For example, let's say you've defined a `Person` object that stores `name` and `age` properties, and you want to create a `Person` instance that represents me.  That might look something like this:

~~~ javascript
// Person constructor
function Person(name, age) {
    this.name = name;
    this.age = age;
}
// instance
var chris = new Person('Chris Lusto', 32);
console.log(chris); // Person {name: "Chris Lusto", age: 32}
~~~

That's your pretty standard `hello, world!` use case for object-oriented programming in Javascript.

###### &sect; Why do we need `new` at all?

The reason that the `new` operator exists in the first place is that Javascript doesn't mark constructors in any special way when they're defined.[^cons] As far as the interpreter is concerned, a constructor is exactly the same as any other function. A constructor doesn't become a constructor until it's _called_. If that sounds a little abstract, then take a look at what would happen if we were to call our `Person()` function from earlier _without_ the `new` keyword in front of it:

~~~ javascript
var chris = Person('Chris Lusto', 32);
console.log(chris); // undefined
~~~

If you think about it for a minute, it makes perfect sense that `chris` is `undefined`.  After all, the `Person()` function doesn't even have a return value! And that's exactly what `new` gets us: it tells the interpreter it has to do some object creation and bookkeeping behind the scenes for a function that would otherwise be pretty uninteresting.[^ret]

Under the hood, the `new` operator is actually [doing three things](http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new): (1) Creating a new object that inherits from `Person.prototype`; (2) calling the `Person()` constructor (with any arguments) and binding the `this` value to the newly created object; and (3) assigning the object returned by the constructor to the result of the whole `new` expression.


But if constructors are just ordinary functions, then ordinary functions are also constructors, and there's nothing stopping us from calling a "normal" function as a constructor by applying the `new` operator.  For instance, let's say we have the super-exciting `triple()` function, which takes a number and returns its triple:

~~~ javascript
function triple(x) {
    return 3 * x;
}
~~~

Normally we'd expect to do something like this with it:

~~~ javascript
var result = triple(4);
console.log(result); // 12
~~~

But this is also perfectly valid:

~~~ javascript
var result = new triple(4);
console.log(result); // triple {}
~~~

Valid, but useless.  Because `triple()` doesn't add any properties to `this`, and because we haven't done anything special to `triple.prototype`, we just get back an empty object.

Okay, so basically `new` lets us call any function whatsoever and get back an object, though typically we'd like to use it in situations where the function we call is _intended_ to return an object instance, i.e., a constructor.  But that doesn't tell us why we can call `Desmos.Calculator()` _without_ the `new` operator and still get back a `Desmos.Calculator` object! Well, actually it does, but in a really sneaky and cool way.

###### &sect; Using `new` like a ninja
To refresh your memory, here's our `Person()` constructor from before:

~~~ javascript
// Person constructor
function Person(name, age) {
    this.name = name;
    this.age = age;
}
~~~

If this were part of a Javascript library or API that we anticipate lots of other people using, then we have a small but nontrivial problem on our hands. We've obviously written the `Person()` function in such a way that it _only_ makes sense to be called as a constructor (i.e., with the `new` keyword), but if it's called _without_ the `new` operator (a really easy mistake to make), then it returns `undefined`. That's not great news, because people will expect the result to be a `Person` object, and if the result is instead `undefined`, then our users' code will be breaking all over the place. If only there were a way to protect them from themselves (and save them a few keystrokes in the process).

What we'd like to do is something like this:

~~~
if (Person() wasn't called with the new keyword) {
    call Person() with the new keyword and return the result;
} else {
    carry on as normal;
}
~~~

Luckily, there's a simple way to check the `if` condition above. We're going to use the `instanceof` operator, which tells us whether an object was created with a given constructor.  Like so:

~~~ javascript
var chris = new Person('Chris Lusto', 32);
console.log(chris instanceof Person); // true
~~~

Our upgraded constructor might now look something like this:

~~~ javascript
// Person constructor
function Person(name, age) {
    if (!(this instanceof Person)) {
        return new Person(name, age);
    }
    this.name = name;
    this.age = age;
}
~~~

Now when `Person()` is called as a "normal" function, the `instanceof` check fails, and we call `new Person()` for the user automatically!  That means the following two lines of code are now equivalent:

~~~ javascript
var chris = new Person('Chris Lusto', 32);
var chris = Person('Chris Lusto', 32);
~~~

As a mere mortal, I don't have access to the Desmos codebase, so I can't say for sure that this is how they've set up their constructor, but the spirit of their solution is the same.  In fact, you can check that the following both work perfectly with the Desmos API:

~~~ javascript
var calc = Desmos.Calculator(document.getElementById('calc'));
var calc = new Desmos.Calculator(document.getElementById('calc'));
~~~

The first one just has a little bit of syntactic sugar sprinkled on top. And it also prevents people from breaking their programs when they forget to use the `new` operator, which is considerate.  And now you can be just as considerate by incoroporating a pattern like this one the next time you code up a constructor.

---

[^cons]: By convention, constructors are typically capitalized, but that's strictly a polite marker for human beings. It lets other programmers (or a temporally posterior you) know they're looking at a function that's intended to be called as a constructor, but the Javascript interpreter doesn't care or notice.

[^ret]: Constructors don't normally return a value. They _can_, but it'd be weird.