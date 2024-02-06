const isPrime = (x, srcArray) => x > 1 && srcArray.slice(0, x)
	.filter(f => f > 1 && f < x && (f === 2 || f % 2))
	.reduce((t, n) => Number.isInteger(x/n) ? false : t, true);
const getPrimes = (num) => Array.from(Array(num).keys()).filter((f, i, e) => isPrime(f, e))
const getGCD = (m, n) => n == 0 ? m : getGCD(n, m % n);
const getFactors = (val) => Array.from(Array(val).keys())
	.filter(f => f > 1 && f < Math.ceil(val))
	.filter(f => Math.floor(val/f) == val/f)
const getCoPrime = (factors, ceil) => Array.from(Array(ceil).keys())
	.map((d, i) => getFactors(d))
	.reduce((t, n) => [].concat.apply(t, [n.reduce((tf,nf) => tf && factors.indexOf(nf) < 0, true)]), [])
	.reduce((t, n, i) => n ? [].concat.apply(t, [i]) : t, [])
const getPrimeFactors = (num) => Array.from(Array(num).keys())
	.filter(f => f > 1)
	.filter(f => num % f === 0)
	.filter(f => getPrimeFactors(f).length == 0)

//Generate a Fibonacci Sequence
const fib = (numCycles) => Array.from(Array(numCycles))
	.reduce((t, n, i) => i > 0 ? [].concat.apply(t, [t[i-1] + t[i]]) : t, [0, 1]);
