# JavaScriptSnippets
A collection of lame javascripts I use to test and experiment with...gotta have a hobby

## Adders
What started out as a simple exercise of creating the RippleAdder found in this execellent document by a guy named Mike (http://simplecpudesign.com) has balloned into me trying to create his entire CPU... in Javascript.  He did a great job of explaining how the simple gates build bigger parts which combine to build even bigger parts. I've tried to implement all of the components (FlipFlops, Multiplexors, Adders, etc) in software without using any application cheats but there are still quite a few "IF" statements.  I do plan on refactoring once it's all working correctly to remove all that.  The biggest difficulty has been trying to mimic logic gates in software to behave the same way as their electrical counterparts.  Software executes one operation at a time while the electrical components all execute at once.  So my approach was to pass references of bit-objects around to the gates and let the gate set a timeout to execute the operation periodically.  That can have unfortunate effects on the flip-flops used in the ring-counter, so I had to introduce a state variable.

Right now, all the code is surrounded by HTML ONLY so that I can test it.  This will go away and I'm not at all concerned how it looks...well, I know its garbage, but I dont care right now.


I'm making it up as I go and learn more about the low-level hardware.

## Flight Aware
Choose an airport, airline, etc from the website.  Take note of the URL in the XHR section of the debugger in the browser and replace the "fetchUrl" value with this.

## Amusement Park
Just a fun little exercise in higher-order functions.  Not exactly PURE functions, but still fun to write

## RSA Simulation
After playing around and learning more about prime numbers and tricks, I started playing with a simple little exercise to encrypt and decrypt phrases using RSA and very small prime numbers...this is javascript afterall

## Sierpinski Triangle
Playing with the canvas

## DataGrouper
I had a need to take a bunch of tabular data and group it...several layers deep

## Others
Mostly just a scratchpad...probably random junk
