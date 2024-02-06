class JDate extends Date {
	constructor(c) {
		super(c);
	}

	get Midnight() {
		return new Date(this.setHours(0, 0, 0, 0));
	}
}

Array.from(Array(10).keys()).map(d => new JDate((d * 1000 * 60 * 60 * 24) + new Date().getTime()).Midnight.toJSON())
