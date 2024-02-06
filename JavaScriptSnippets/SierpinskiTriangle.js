const board = ({ width=700, height=600 } = {}) => {
	let dotColor = 0;
	
	const corner = ({x=0, y=0} = {}) => {
		return {
			getHalf: (curPos) => ({ x: (curPos.x + x) / 2, y: (curPos.y + y) / 2 }),
			get Coords() { return { x: x, y: y } }
		};
	};

	const fillStyles = [
		'rgba(255, 0, 0, 1)',
		'rgba(0, 255, 0, 1)',
		'rgba(255, 255, 0, 1)',
		'rgba(255, 255, 255, 1)'
	];

	const updateCanvasSize = (canv) => {
		canv.setAttribute('width', `${width}px`);
		canv.setAttribute('height', `${height}px`);
	}

	const init = () => {
		const canv = document.createElement('canvas');
		document.body.append(canv);
		updateCanvasSize(canv);
		const c = canv.getContext('2d');
		clear(c);
		return c;
	};

	const clear = (c) => {
		(c || ctx).fillStyle='rgba(0,0,0,1)';
		(c || ctx).fillRect(0,0,width,height);
	};

	const plotPoint = (xy) => {
		ctx.beginPath();
		ctx.arc(xy.x, xy.y, 1, 0, 2 * Math.PI, false);
		ctx.fillStyle = fillStyles[dotColor];
		ctx.fill();
	};

	const plot = (dotCount) => {
		// A million dots or more causes...problems
		const count = dotCount ? (dotCount > 200000 ? 200000 : dotCount) : 10000;

		// Create our corners based on the current height/width
		const corners = [
			corner({ x: 0, y: height }),
			corner({ x: width, y: height }),
			corner({ x: width/2, y: 0 })
		];
		// Initialize the current position to one of the corners
		const cPos = corners[1].Coords;

		// Now plot however many dots they want
		Array.from(Array(count)).forEach(() => {
			const newVals = corners[Math.round(Math.random() * (corners.length-1))].getHalf(cPos);
			plotPoint(newVals);
			Object.assign(cPos, newVals);
		});
	};

	const setDotColor = (col) => { dotColor = col % fillStyles.length; }

	const resizeBoard = () => { updateCanvasSize(ctx.canvas); }

	// Initialize the canvas context; creates & builds the canvas
	const ctx = init();
	return { clear, plot, setDotColor,
		get boardDimensions() { return `${width}x${height}`; },
		set boardDimensions(val) {
			[width, height] = val.split('x').map(m => parseInt(m));
			resizeBoard();
		}
	};
}

const xx = board();
xx.plot(1000);
