// You "could" toss out the charCodeAt and fromCharCode stuff if you wanted to
//   work with numbers or unicode characters
const rsa = ({ p = 0, q = 0, e = 0 } = {}) => {
	const n = p * q;
	const d = (((p-1) * (q-1)) + 1) / e;

	// Private Key is 'p', 'q', and 'd'
	return {
		get publicKey() { return { n: n, e: e }; },
		decrypt(vals) {
			return vals
				.map(m => (BigInt(m) ** BigInt(d)) % BigInt(n))
				.map(m => String.fromCharCode(parseInt(m)))
				.join('');
		},
		encrypt(val, targetUserPublicKey) {
			return val
				.split('')
				.map(m => m.charCodeAt(0))
				.map(m => (BigInt(m) ** BigInt(targetUserPublicKey.e)) % BigInt(targetUserPublicKey.n));
		}
	}
}

r1 = rsa({ p: 11, q: 17, e: 7 });
r2 = rsa({ p: 13, q: 19, e: 7 });
r3 = rsa({ p: 11, q: 31, e: 7 });
r4 = rsa({ p: 11, q: 23, e: 17 });
r5 = rsa({ p: 11, q: 13, e: 11 });

msg = 'is it time for chow?'
console.log('R2: ', r2.decrypt(r1.encrypt(msg, r2.publicKey)));
console.log('R3: ', r3.decrypt(r1.encrypt(msg, r3.publicKey)));
console.log('R4: ', r4.decrypt(r1.encrypt(msg, r4.publicKey)));
console.log('R5: ', r5.decrypt(r1.encrypt(msg, r5.publicKey)));
