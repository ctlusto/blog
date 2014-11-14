---
title: The Desmos API for Absolute Beginners
date: 2014-11-09 18:59 UTC
tags:
category: desmos
summary: If can't even set the clock on your microwave, here's where to start.
---

# The Desmos API for Absolute Beginners

I mean it. Absolute beginners welcome. This is a judgment-free zone.[^jfz]

As is legally required in the genre of programming tutorials, we're going to do the Desmos version of [`Hello, world!`](http://en.wikipedia.org/wiki/%22Hello,_world!%22_program). That's doubly-great news for us because (1) like any respectable HW program, it's incredibly simple to run, and (2) *unlike* most HW programs, this one's going to do something much more interesting than print `Hello, world!` to your screen.

###### &sect; Ploughing the Field

People are going to be viewing and interacting with our Desmos calculator in a browser, so we need to run the code in a place where a browser can access and interpret it. The simplest way to make that happen is to create an html file, so that's what we'll do.

Open any program that can create a plaintext file[^editor] so that we can write a very simple web page (which will quickly become awesome). Paste/type in the following lines and save the file as `desmos.html` or something similarly clever:

~~~ html
<!-- desmos.html -->
<!DOCTYPE html>
<html>
    <head>
        <title>Hello, Desmos!</title>
    </head>
    <body>
        <div id="calculator" style="width: 300px; height: 300px;"></div>
    </body>
</html>
~~~

Maybe it's not very impressive, but that's a complete web page ready for viewing. In fact, go ahead and open `desmos.html` in your favorite browser and take a look. You should see...

...nothing. That's okay, we haven't put anything visible into the page yet, but we've laid the foundation.[^meta]

###### &sect; Sowing the Seeds

We're going to write a little bit of Javascript in a minute, but it's going to rely on a whole *lot* of Javascript that Desmos has already written. In order to set that relationship up, we need to give our web page a way to latch onto the Desmos API.[^api] Luckily that's pretty easy to do: we'll just insert a `<script>` tag and point it to the API's Internet address.  Here's what your `desmos.html` file will look like now:

~~~ html
<!-- desmos.html -->
<!DOCTYPE html>
<html>
    <head>
        <title>Hello, Desmos!</title>
        <script src="https://www.desmos.com/api/v0.4/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>
    </head>
    <body>
        <div id="calculator" style="width: 300px; height: 300px;"></div>
    </body>
</html>
~~~

###### &sect; Reaping the Sweet Rewards

Okay, now it's time for `Hello, world!` We're going to use another set of `<script>` tags, except this time &mdash; instead of linking to an external Javascript file &mdash; we're going to write our very own code inside. Don't worry if you don't understand exactly what the code is actually doing right now. There's plenty of time for that. Our goal is just to get up and running. But here we go, one little line of Javascript magic:

~~~ html
<!-- desmos.html -->
<!DOCTYPE html>
<html>
    <head>
        <title>Hello, Desmos!</title>
        <script src="https://www.desmos.com/api/v0.4/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>
    </head>
    <body>
        <div id="calculator" style="width: 300px; height: 300px;"></div>
        <script>
            var myCalculator = Desmos.Calculator(document.getElementById('calculator'));
        </script>
    </body>
</html>
~~~

Save your file, refresh your browser, and boom: you've got your very own Desmos calculator. You can input expressions, make lists, play with sliders &mdash; all the cool stuff you can normally do on the Desmos app &mdash; on your own personal web page.

Once you've got a calculator instance set up on a page, there are all kinds of interesting things you can do with it. Over the course of this tutorial series we'll take a look at a bunch of them. But for now, go grab a drink and pat yourself on the back.

---

[^jfz]: That goes both ways. I can and do make mistakes, so let's both agree to be just as gentle as possible through this whole thing.

[^editor]: These programs are called, appropriately "text editors." If you're on a Mac, then you have TextEdit installed by default. If you're on a Windows machine, then you have Notepad. If you have a Linux box, then you know what a text editor is. You want to stay away from programs like Word, which add all sorts of metadata to files. If think you're going try your hand at this coding thing on a regular basis, the first thing you should do is find a good text editor that you're comfortable with. If you're hurting for a recommendation, I've found [Sublime Text](http://www.sublimetext.com/) to be pretty great. And then, when you're ready for the big leagues, go [learn about VIM](http://www.openvim.com/tutorial.html).

[^api]: API stands for [Application Programming Interface](http://en.wikipedia.org/wiki/Application_programming_interface). Basically it's a set of rules that governs how two programs should talk to one another. In this case it lets our little program talk to the software that powers the Desmos application on the web.

[^meta]: ...to mix my metaphors a bit.