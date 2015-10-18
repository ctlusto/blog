---
title: Working with Expressions
date: 2015-10-18 01:54 UTC
category: desmos
summary: The basics of working with expressions through the Desmos API.
disqus_identifier: /desmos/working-with-expressions/
disqus_title: The Desmos API for Absolute Beginners
disqus_url: http://chrislusto.com/desmos/working-with-expressions/
---

# ~ Working with Expressions ~
In this post we'll start programmatically manipulating the calculator a bit. Basically, we'll take what you already know about using the calculator and translate that into code.

Before we go any further, I should say that the fine folks at Desmos have written some excellent [API documentation](https://www.desmos.com/api/v0.5/docs/index.html) &mdash; complete with examples &mdash; which you should consult liberally. Turns out they know a lot about programming and stuff.

This post assumes that you already know how to get up and running with the Desmos API. If that's not the case, I've got you covered [over here](http://chrislusto.com/desmos/desmos-for-absolute-beginners/).

If you want to see a live example of just one (mostly useless) thing that's possible, here's a [color-shifting timer](http://bl.ocks.org/ctlusto/ee07fe718230cd4f71f4) based on updating Desmos expressions.

###### &sect; The Basic Unit of Desmosing
When you work with the calculator, most of what you do is interact with the expressions list. This thing:

<img src="/images/expressions.png">

The expression is really the atom of the Desmos universe. It might be a paramter,[^slider] a function definition, a table, or what a mathematician might properly call an "expression." For reference, here's a [list of expression types](https://www.desmos.com/api/v0.5/docs/index.html#document-expressions), but the best way to see what expressions do/are is to play around with the calculator.

In the web app, you manipulate expressions directly by typing or dragging them around. We can do the same sorts of things via the API as well.

###### &sect; Creating Expressions
Desmos exposes a single method to both create new expressions and update existing ones: `.setExpression()`, which takes an object that describes the expression's target state.

(*Note*: For all of the following code snippets, assume we've already created a reference to a calculator instance called `calc`. Because I am both unimaginative and lazy, that's what I usually use.)

Every expression needs a unique identifier in order for the calculator to keep track of it, so every expression state must contain an `id` property:

~~~ javascript
calc.setExpression({
    id: 'slope'
    // other stuff will go here
});
~~~

That's not very useful on its own; it just creates a blank expression. We probably want it to contain some information, so let's make that happen. Desmos uses [LaTeX](https://en.wikipedia.org/wiki/LaTeX) for expressions, so the object you pass into `.setExpression()` should have a `latex` property[^latex] that describes the mathy situation you'd like to exist.[^gotcha]  For instance, if you want to create a paramater called `m` and set its value to 4, you can do this:

~~~ javascript
calc.setExpression({
    id: 'slope',
    latex: 'm = 4'
});
~~~

If you run that little snippet of code, you'll see a new slider that controls a parameter called `m` with a value of 4. Nice, right?

Of course you can reference expressions from within other expressions. For example, if you want to create a line whose slope is determined by the value of our `m` parameter, you can do something like this:

~~~ javascript
calc.setExpression({
    id: 'line',
    latex: 'y = mx'
});
~~~

###### &sect; A Brief Aside
If you know from the outset that you want to create a line with a variable slope, then you know right away that you'll need two expressions. It's a little annoying to have to call `.setExpression()` twice in a row, so Desmos has helpfully exposed a convenience method called `.setExpressions()` (note the plural) that accepts an *array* of expression states. These two bits of code are equivalent:

~~~ javascript
// This is kind of an annoying thing to have to do
calc.setExpression({
    id: 'slope',
    latex: 'm = 4'
});
calc.setExpression({
    id: 'line',
    latex: 'y = mx'
});

// This is much less annoying
// Not really annoying at all, actually
calc.setExpressions([
    {
        id: 'slope',
        latex: 'm = 4'
    },
    {
        id: 'line',
        latex: 'y = mx'
    }
]);
~~~

In fact, Desmos is so helpful and convenient that you don't even need to set expressions in the right order. As in the web app, every expression is available to every other expression, so you can ignore dependency order within `.setExpressions()`:


~~~ javascript
// This will also work just fine, even though 'line' depends on 'slope'
calc.setExpressions([
    {
        id: 'line',
        latex: 'y = mx'
    },
    {
        id: 'slope',
        latex: 'm = 4'
    }
]);
~~~

###### &sect; Let there be Color and Stuff
There are a few other expression properties you can control. They're discussed in detail in the documentation and some are demonstrated in the [live example](http://bl.ocks.org/ctlusto/ee07fe718230cd4f71f4) mentioned at the end of this post. Just be aware that you can also set[^relevance] an expression's color, slider bounds, visibility, parametric domain, and type.[^type]

But, for funsies, this will graph a hidden line that's a horrible shade of yellowish when shown:

~~~ javascript
// A line that is somehow both invisible and hideous
calc.setExpression({
    id: 'ugly_line',
    latex: 'y = 2x + 4',
    hidden: true,
    color: '#dedda9'
});
~~~

###### &sect; Updating Expressions
I mentioned earlier that `.setExpression()` both creates and updates expressions. Which task it performs depends on the `id` property of the argument. If an expression with that `id` already exists, any other listed properties get set to their new values; otherwise a new expression is created.

~~~ javascript
// Here's a much nicer blue line...still hidden though
calc.setExpression({
    id: 'blue_line',
    latex: 'y = 3x - 4',
    color: Desmos.Colors.BLUE,
    hidden: true
});

// This will only update our blue line's visibility
// The color and latex properties remain the same
calc.setExpression({
    id: 'blue_line',
    hidden: false
});
~~~

###### &sect; Removing Expressions
Once an expression has outlived its usefulness, you can simply remove it. At least on the web app you have to look your expression in the face while you click the little gray X and send it into oblivion, but not here. Here you just need to tell `.removeExpression()` which `id` you'd like to nix:

~~~ javascript
calc.removeExpression({id: 'ugly_line'});
~~~

And if you want to go on an expression killing spree, `.removeExpressions()` lets you knock off a bunch at once.

~~~ javascript
calc.removeExpressions([{id: 'line'}, {id: 'blue_line'}]);
~~~

###### &sect; LaTex Gotchas
Using LaTeX within JavaScript is actually kind of a pain.[^opinion] The good news is you can get away without a lot of LaTeX knowledge with Desmos because (a) they only support a subset of commands/symbols,[^mathquill] and (b) they provide a thin layer of abstraction over raw LaTeX that often lets you type something pretty close to regular mathematical notation. The bad news is the abstraction is [a little leaky](http://www.joelonsoftware.com/articles/LeakyAbstractions.html), which requires you to understand just a bit about the way LaTeX is handled by the API.

Dealing with "less than or equal to" is a good example. If you type the sequence `r<=4` into an expression in the web app, the calculator recognizes the `<=` and autocorrects it for you so it looks pretty:

<img src="/images/leq1.png">

But if you do this:

~~~ javascript
// This works but is ugly
calc.setExpression({
    id: 'circle',
    latex: 'r<=4'
});
~~~

...you end up with this:

<img src="/images/leq2.png">

The API is still smart enough to parse that string into the thing that you want, so your polar circle gets graphed with no problem, but now the expressions list looks gross. In more complicated cases, you might even end up with an error &mdash; like when you want to introduce domain restrictions. If you type the sequence `y=x{x<4}` into the expressions list, you end up with this:

<img src="/images/domain1.png">

But if you try this:

~~~ javascript
// This doesn't work at all
calc.setExpression({
    id: 'restricted_line',
    latex: 'y=x{x<4}'
});
~~~

...you break the internet.

<img src="/images/domain2.png">

That's because curly braces have semantic meaning as grouping symbols within the LaTeX grammar, so they don't get parsed as literal characters by the API. If you want them to show up, you need to tell the API that you're opening up a delimiter using the `\left` command, and then introduce the delimiter with the `\{` symbol. Then you need to do the same thing at the end of your domain restriction with `\right` and `\}`.

Except things are a little worse than that. The backslash character has semantic meaning in LaTeX (it says, "Hey, here comes a command or symbol!"), but it *also* has semantic meaning in JavaScript (it says, "Hey, here comes a special character inside this string!"). So here's our situation: JavaScript sees the backslash and ignores it as a literal character, but we *need* that literal character so that the LaTeX parser can see and subsequently ignore the literal backslash and insert the correct symbol. To reiterate: using LaTeX within JavaScript is actually kind of a pain.

The solution in this case is to *double*-escape `left`, `{`, `right`, and `}` in the string value assigned to the `latex` property of the expression state:

~~~javascript
// Finally works the way we want
calc.setExpression({
    id: 'restricted_line',
    latex: 'y=x\\left\\{x<4\\right\\}'
});
~~~

So, the correct way to set the expressions for the two examples in this section would look like this (with a little space for the poor humans who have to read these sorts of things):

~~~ javascript
// If you like piña coladas...
/// ...come with me and escape
calc.setExpressions([
    {
        id: 'circle',
        latex: 'r \\leq 4'
    },
    {
        id: 'restricted_line',
        latex: 'y = x \\left \\{ x < 4 \\right \\}'
    }
]);
~~~

And we'll end up with exactly what we wanted in the first place:

<img src="/images/correct_latex.png">

If you want to know what those (unescaped) curly braces *are* good for, one common use case in Desmos would be to create variables with complicated subscripts:

~~~ javascript
calc.setExpressions([
    {
        id: 'awesome_parameter',
        latex: 'p_{awesome} = 1'
    },
    {
        id: 'cool_parameter',
        latex: 'p_{cool} = 2'
    }
]);
~~~

...which results in:

<img src="/images/parameters.png">

I said before that Desmos provides a little bit of abstraction over raw LaTeX. For instance, the LaTeX command for the sine function is `\sin`, but Desmos doesn't actually require you to use it; it simply recognizes that three-character combination and takes care of the LaTeXifying for you:

~~~ javascript
// This works, even though you'd expect to have to use \sin or '\\sin'
calc.setExpression({
    id: 'sine',
    latex: 'y = sin x'
});
~~~

Figuring out when you do or don't have to use LaTeX commands by double-escaping characters is a nontrivial exercise.[^reader] It'll involve a lot of trial and (mostly) error and broken expressions. But there *is* a way to peek at the answer key when you're working on something particularly complicated that makes you want to punch your laptop in its retina display.

On the web app, Desmos exposes a global reference to the main calculator object, called `Calc`, that you can poke at from the console. And there's a method called `.getState()` &mdash; the subject of some future writing &mdash; that allows you to inspect the properties of expression objects. So just head over to the web app and type whatever hideous thing you want into the the first spot in the expressions list of a brand new calculator:

<img src="/images/complicated_expression.png">

Then type `Calc.getState();` in the console (note the capitalization). You'll see the returned object, which you can click to expand and view its properties. Keep clicking into `expressions[list][0]`, where you'll see the `latex` property as a big ugly string:

<img src="/images/state.png">

Now just replace all those single backslashes with double-backslashes and you're good to go:

~~~ javascript
// This works beautifully
// ...well, it works
calc.setExpression({
    id: 'binomial_sum',
    latex: '\\sum_{n=0}^5\\operatorname{nCr}\\left(5,\\ n\\right)'
});
~~~

This is a little bit of overkill. You don't, for instance, strictly need that `operatorname` stuff since `nCr` is one of those special combinations &mdash; like `sin` &mdash; that Desmos supports in its bare form, but at least this method removes some of the guesswork when you're having trouble.

###### &sect; Live Example
I coded up [a little example](http://bl.ocks.org/ctlusto/ee07fe718230cd4f71f4) that demonstrates creating and updating expressions to make a color-shifting timer. It uses an external library to handle the colors and animation timing, but the point is just to show that you can set up expressions to respond to all kinds of external input. We'll explore a lot more ways to work with expressions as this series continues to grow.

<hr>

[^slider]: ( = slider )
[^latex]: At least when you *create* the expression. You may not necessarily want to change the LaTeX on a future update (e.g. if you're just changing a color or something), in which case you can omit it.
[^gotcha]: There are some important gotchas, especially if you're not particularly familiar with LaTeX, but in many simple cases you're just replicating exactly what you'd type into the expressions list manually. More on this in a bit.
[^relevance]: Though not all properties are relevant to every expression. It would be meaningless to, e.g., set the `color` of a slider or the `sliderBounds` of a line.
[^type]: Meaning, roughly, table or non-table (default). More on tables in a future post.
[^opinion]: Apologies for the editorial content, but things [like this](http://web.ift.uib.no/Teori/KURS/WRK/TeX/symALL.html) give me a case of [the howling fantods](https://www.brainpickings.org/2012/09/04/words-david-foster-wallace-mom-invented/).
[^mathquill]: Via a very cool library called [Mathquill](https://github.com/mathquill/mathquill), about which more in a future post.
[^reader]: If this were a math textbook, "an exercise left to the reader."