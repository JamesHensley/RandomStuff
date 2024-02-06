// Calculate prime numbers

// Slow; 2.999 Seconds
const isPrime = (x) => x > 1 && Array.from(Array(x).keys())
	.filter(f => f > 1 && f < x)
	.reduce((t, n) => (Math.floor(x/n) == x/n) ? false : t, true);
let s = new Date().getTime();
console.log(Array.from(Array(10000).keys()).filter(f => isPrime(f)));
console.log(`${(new Date().getTime() - s) / 1000} Seconds`)



// A little faster; 2.722 Seconds
const isPrime = (x) => x > 1 && Array.from(Array(x).keys())
	.filter(f => f > 1 && f < x && (f === 2 || f % 2))
	.reduce((t, n) => (Math.floor(x/n) == x/n) ? false : t, true);
let s = new Date().getTime();
console.log(Array.from(Array(10000).keys()).filter(f => isPrime(f)));
console.log(`${(new Date().getTime() - s) / 1000} Seconds`)



// A LOT faster; 0.349 Seconds
const isPrime = (x, srcArray) => x > 1 && srcArray.slice(0, x)
	.filter(f => f > 1 && f < x && (f === 2 || f % 2))
	.reduce((t, n) => Number.isInteger(x/n) ? false : t, true);
let s = new Date().getTime();
console.log(Array.from(Array(10000).keys()).filter((f, i, e) => isPrime(f, e)));
console.log(`${(new Date().getTime() - s) / 1000} Seconds`)


