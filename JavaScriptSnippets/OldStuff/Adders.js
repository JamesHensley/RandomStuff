const updatePage = (divId, data) => {
	if (!document.querySelector(`#${divId}`)) {
		outDiv = document.createElement('div');
		outDiv.setAttribute('id', divId);
		document.body.append(outDiv);
	}
	else {
		document.querySelector(`#${divId}`)
	}
	outDiv.innerText = data;
}

const busWidth = 8;
const numToBin = (num) => num.toString(2).padStart(busWidth, '0').split('').map(d => parseInt(d,2));
fillBusBits = (busRef, value) => { busRef.bits.forEach((d, i) => d.value = numToBin(value)[i]); return busRef; }

const And2 = (aBit, bBit) => (aBit & bBit);
const And3 = (aBit, bBit, cBit) => And2(And2(aBit, bBit), cBit);
const And4 = (aBit, bBit, cBit, dBit) => And2(And2(aBit, bBit), And2(cBit, dBit));
const XOr2 = (aBit, bBit) => (aBit ^ bBit);
const Or2 = (aBit, bBit) => (aBit | bBit);
const INV = (bit) => XOr2(bit, 1);
const NOR = (srcBus) => () => srcBus.bits.every(d => d == 0) ? 1 : 0;

const Clock = () => {
	let [clockState, clockCount] = [ 0, 0 ];
	const clockEvent = new CustomEvent('clockTrigger', { detail: { clockState: 0 } });

	const listeners = [];
	let timeVal = 1000;
	let intervalRef = undefined;

	const startClock = () => {
		const fireEvents = () => {
			if (data.pins.ce.value == 1) {
				clockEvent.detail.clockState = clockState;
				data.clockEventTarget.dispatchEvent(clockEvent);
				clockCount++;
				clockState = clockCount % 2;
			}
		};
		intervalRef = setInterval(fireEvents, timeVal);
	};
	const stopClock = () => {
		clearInterval(intervalRef);
	}

	return { timeVal, startClock, stopClock, clockEvent }
}
const appClock = Clock();


const BitBus = (args) => {
	const bWidth = args && args.width ? args.width : busWidth;
	const bits = args && args.bits ? args.bits : Array.from(Array(bWidth)).map(d => Bit());

	return { bits,
		get length() { return bits.length; },
		get reverseBits() {
			return Array.from(Array(bits.length).keys()).reverse().map(d => bits[d])
		},
		slice(start, end) {
			return BitBus({ width: end-start, bits: bits.slice(start, end) });
		},
		get raw() { return bits.map(d => d.value); },
		setBits(newBits) {
			bits.forEach((d, i) => d.value = newBits[i]);
		}
	}
}

const Bit = (args) => {
	let bitVal = args && args.val ? args.val : (args && args.computedVal ? args.computedVal : 0);

	return {
		value: bitVal,
	}
}

const Mux = (aBit, bBit, sel, z) => {
	z.value = Or2(And2(aBit.value, INV(sel.value)), And2(bBit.value, sel.value));
}

const Mux21 = (aBus, bBus, sel, z) => {
	Array.from(Array(busWidth))
	.forEach((d, i) => {
		Mux(aBus.bits[i], bBus.bits[i], sel, z.bits[i])
	});
}

const Mux41 = (aBus, bBus, cBus, dBus, sel0, sel1, z) => {
	z1 = BitBus();
	Mux21(aBus, bBus, sel0, z1);

	z2 = BitBus();
	Mux21(cBus, dBus, sel0, z2);

	Mux21(z1, z2, sel1, z);
}

const Inverter = (src) => Bit({ val: INV(src.value) });

const BitwiseAnd = (aBus, bBus, zBus) => {
	zBus.bits.forEach((d, i) => d.value = And2(aBus.bits[i].value, bBus.bits[i].value));
}

const BitwiseInverter = (aBus, en, zBus) => {
	zBus.bits.forEach((d, i) => d.value = XOr2(aBus.bits[i].value, en.value))
}

const Replicator = (a, zBus) => zBus.bits.forEach(d => d.value = a.value);

const ArithmeticLogicUnit = (aBus, bBus, sel0, sel1, sel2, sel3, sel4, zBus, cOut, zero) => {
	const [ z1, z2, z3, z4, z5 ] = [ BitBus(), BitBus(), BitBus(), BitBus(), BitBus() ]

	const RippleAdder = (aBus, bBus, cIn, cOut, zBus) => {
		cOut.value = cIn.value;

		const fullAdder = (aBit, bBit, cOut, sOut) => {
			const halfAdder = (aBit, bBit, cOut, sOut) => {
				cOut.value = And2(aBit.value, bBit.value);
				sOut.value = XOr2(aBit.value, bBit.value);
			};

			const [co1, so1] = [ Bit(), Bit() ];
			halfAdder(aBit, bBit, co1, so1);

			const [co2, so2] = [ Bit(), Bit() ];
			halfAdder(so1, cOut, co2, so2);

			cOut.value = Or2(co1.value, co2.value);
			sOut.value = so2.value;
		}

		// This is where the adding begins and the zBus mutates
		// We have to work from the end of the array to the beginning
		Array.from(Array(zBus.length).keys()).reverse()
		.forEach(i => fullAdder(aBus.bits[i], bBus.bits[i], cOut, zBus.bits[i]))
	}

	const execute = () => {
		Replicator(Inverter(sel4), z1);
		BitwiseInverter(bBus, sel3, z2);
		BitwiseAnd(z1, z2, z3);
		BitwiseAnd(aBus, bBus, z4);
		RippleAdder(aBus, z3, sel2, cOut, z5);
		Mux41(z5, z4, aBus, bBus, sel0, sel1, zBus);
		// Simulate a NOR-Gate
		zero.value = zBus.bits.every(d => d.value == 0) ? 1 : 0;
	}
	return { execute }
}


const FlipFlop = (clr, ce, clk, d, q) => {
	const pState = Bit();

	const flip = (e) => {
		if (ce.value == 0) { return; }
		switch (e.detail.clockState) {
			case 0:
				pState.value = d.value;
				break;
			case 1:
				q.value = clr.value==1 ? 0 : (clr.value == 0 && ce.value == 1 ? pState.value : q.value);
		}
		// q.value = clr.value==1 ? 0 : (clr.value == 0 && ce.value == 1 ? d.value : q.value)
	}
	data.clockEventTarget.addEventListener(clk.type, flip);
	return { flip }
}

const Register2 = (dBus, clr, ce, clk, oBus) => {
	if (!oBus) { oBus = BitBus({ width: 2 }) }
	const flipFlops = Array.from(Array(2)).map((d, i) => FlipFlop(clr, ce, clk, dBus.bits[i], oBus.bits[i]));
	return {
		get q() { return oBus; }
	}
}

const Register4 = (dBus, clr, ce, clk, oBus) => {
	if (!oBus) { oBus = BitBus({ width: 4 }) }
	const registers = [
		Register2(dBus.slice(0, 2), clr, ce, clk, oBus.slice(0, 2)),
		Register2(dBus.slice(2, 4), clr, ce, clk, oBus.slice(2, 4))
	];
	return {
		get q() { return oBus; }
	}
}

const Register8 = (dBus, clr, ce, clk, oBus) => {
	if (!oBus) { oBus = BitBus({ width: 8 }) }
	const registers = [
		Register4(dBus.slice(0, 4), clr, ce, clk, oBus.slice(0, 4)),
		Register4(dBus.slice(4, 8), clr, ce, clk, oBus.slice(4, 8))
	];
	return {
		get q() { return oBus; }
	}
}

const Register16 = (dBus, clr, ce, clk, oBus) => {
	oBus.bits.forEach((d, i) => d.value = dBus.bits[i].value);
	const registers = [
		Register8(dBus.slice(0, 8), clr, ce, clk, oBus.slice(0, 8)),
		Register8(dBus.slice(8, 16), clr, ce, clk, oBus.slice(8, 16))
	];

	return {
		get q() { return oBus; }
	}
}

const Split16 = (data) => {
	return {
		get Low() { return data.slice(8, 16); },
		get High() { return data.slice(0, 8); }
	}
}

const Join16 = (High, Low) => {
	return {
		get Z() { return BitBus({ width: 16, bits: [].concat.apply(High.bits, Low.bits)}); }
	}
}

const Decoder = (clk, ce, clr, enIr, enPc, enDa, s0, s1, s2, s3, s4, muxAPin, muxBPin, muxCPin, aluZero, aluCarry, ir) => {
	// Sequence generator
	const SeqGenerator = (clr, ce, clk, oBus) => {
		flipFlops = [
			FlipFlop(clr, ce, clk, oBus.bits[0], oBus.bits[1]),
			FlipFlop(clr, ce, clk, oBus.bits[1], oBus.bits[2]),
			FlipFlop(clr, ce, clk, oBus.bits[2], oBus.bits[3]),
			FlipFlop(clr, ce, clk, oBus.bits[3], oBus.bits[0])
		];
		// data.clockEventTarget.addEventListener(clk.type, (e) => { console.log('SeqGen: ', e.detail, oBus.raw); });

		return {
			get f() { return oBus[0]; },
			get d() { return oBus[1]; },
			get e() { return oBus[2]; },
			get i() { return oBus[3]; }
		}
	}
	const seqBus = BitBus({
		width: 4,
		bits: [ Bit({val: 1}), Bit({val: 0}), Bit({val: 0}), Bit({val: 0}) ]
	});
	const sGen = SeqGenerator(clr, ce, clk, seqBus);

	const InstructionDecoder = (ir) => {
		return {
			ir,
			set instructionRegister(val) { ir = val; },
			get instructionRegister() { return ir; },
			get INPUT() { return And4(ir[7], INV(ir[6]), ir[5], INV(ir[4])); },
			get OUTPUT() { return And4(ir[7], ir[6], ir[5], INV(ir[4])); },
			get LOAD() { return And4(INV(ir[7]), INV(ir[6]), INV(ir[5]), INV(ir[4])); },
			get ADD() { return And4(INV(ir[7]), ir[6], INV(ir[5]), INV(ir[4])); },
			get JUMP() { return And4(ir[7], INV(ir[6]), INV(ir[5]), INV(ir[4])); },
			get JUMPCONDITION() { return And4(ir[7], INV(ir[6]), INV(ir[5]), ir[4]); },
			get SUB() { return And4(INV(ir[7]), ir[6], ir[5], INV(ir[4])); },
			get BITAND() { return And4(INV(ir[7]), INV(ir[6]), INV(ir[5]), ir[4]); },
			get JUMPZ() { return And3(And4(ir[7], INV(ir[6]), INV(ir[5]), ir[4]), INV(ir[3]), INV(ir[2])); },
			get JUMPNZ() { return And3(And4(ir[7], INV(ir[6]), INV(ir[5]), ir[4]), INV(ir[3]), ir[2]); },
			get JUMPC() { return And3(And4(ir[7], INV(ir[6]), INV(ir[5]), ir[4]), ir[3], INV(ir[2])); },
			get JUMPNC() { return And3(And4(ir[7], INV(ir[6]), INV(ir[5]), ir[4]), ir[3], ir[2]); }
		}
	}
	const instructionDecoder = InstructionDecoder(ir);

	// Status register
	const [carryRegister, zeroRegister] = [ Bit(), Bit() ];
	srIn = BitBus({ width: 2, bits: [aluCarry, aluZero] });
	srOut = BitBus({ width: 2, bits: [carryRegister, zeroRegister] });
	const srCe = Bit({ computedVal: () => { return instructionDecoder.ADD | instructionDecoder.SUB | instructionDecoder.BITAND } });
	srCe.value = instructionDecoder.ADD | instructionDecoder.SUB | instructionDecoder.BITAND;
	const StatusRegister = Register2(srIn, clr, srCe, clk, srOut);

	return {
		ramWE: 0,
		aluS0: s0, aluS1: s1, aluS2: s2,
		aluS3: s3, aluS4: s4,
instructionDecoder
	}
}

const RAM = (dIn, dOut, addr, we, clk) => {

}

data = {
	busses: {
		muxAABus: BitBus(), muxABBus: BitBus(), muxAZBus: BitBus(),
		muxIABus: BitBus(), muxIBBus: BitBus(), muxIZBus: BitBus(),
		muxDABus: BitBus(), muxDBBus: BitBus(), muxDZBus: BitBus(),
		irDBus: BitBus({ width: 16 }), irQBus: BitBus({ width: 16 }),
		pcQBus: BitBus(), pcDBus: BitBus(),
		acQBus: BitBus(), acDBus: BitBus(),
		ramBus: BitBus({ width: 16 })
	},
	pins: {
		ce: Bit(), clr: Bit(),
		enIR: Bit(), enPC: Bit(), enDA: Bit(),
		MUXA: Bit(), MUXB: Bit(), MUXC: Bit(),
		aluCOut: Bit(), aluZero: Bit(),
		s0: Bit(), s1: Bit(), s2: Bit(), s3: Bit(), s4: Bit(),
		/* We are going to simulate clock pulses with a cutom event components can subscribe to */
		clk: appClock.clockEvent
	},
	clockEventTarget: new EventTarget()
}

// Splitters & joiners
const s16_1 = Split16(data.busses.irQBus);
const s16_2 = Split16(data.busses.irDBus);
const j16_1 = Join16(fillBusBits(BitBus({ width: 8 }), 160), data.busses.muxAABus);

// Build RAM
ram = Ram(j16_1.Z, irDBus, data.busses.muxAZBus, rw, clk);

// Instruction Register
irReg = Register16(data.busses.irDBus, data.pins.clr, data.pins.enIR, data.pins.clk, data.busses.irQBus)

// Program Control
pcReg = Register8(data.busses.pcDBus, data.pins.clr, data.pins.enPC, data.pins.clk, data.busses.pcQBus);

// Accumulator
acReg = Register8(data.busses.acDBus, data.pins.clr, data.pins.enDA, data.pins.clk, data.busses.acQBus);

// MultiplexorA - Memory Addressing
const muxA = Mux21(data.busses.muxAABus, data.busses.muxABBus, data.pins.MUXC, data.busses.muxAZBus);

// MultiplexorI - ALU A-Bus
const muxI = Mux21(data.busses.acQBus, data.busses.pcQBus, data.pins.MUXA, data.busses.muxIZBus);

// MultiplexorD - ALU B-Bus
const muxD = Mux21(s16_1.Low, s16_2.Low, data.pins.MUXB, data.busses.muxDZBus);

// Build the ALU
const alu = ArithmeticLogicUnit(
	data.busses.muxIZBus, data.busses.muxDZBus,
	data.pins.s0, data.pins.s1, data.pins.s2, data.pins.s3, data.pins.s4,
	data.busses.pcDBus, data.pins.aluCOut, data.pins.aluZero
);

// Build the Decoder
const decoder = Decoder(data.pins.clk, data.pins.ce, data.pins.clr,
	data.pins.enIR, data.pins.enPC, data.pins.enDA,
	data.pins.s0, data.pins.s1, data.pins.s2, data.pins.s3, data.pins.s4,
	data.pins.MUXA, data.pins.MUXB, data.pins.MUXC,
	data.pins.aluZero, data.pins.aluCOut, s16_1.High
);

appClock.startClock()
data.pins.ce.value = 1;

data.busses.muxIZBus.setBits(numToBin(15))
data.busses.muxDZBus.setBits(numToBin(42))
console.log(data.busses.pcDBus.raw)
alu.execute()
console.log(data.busses.pcDBus.raw)

