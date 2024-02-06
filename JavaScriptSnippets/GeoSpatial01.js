// Simple geospatial stuff
let PointGeo = (x, y) => ({ x, y })
let CircleGeo = (point, radius) => {
	const doMath = (p) => Math.sqrt(Math.pow(Math.abs(point.x - p.x), 2) + Math.pow(Math.abs(point.y - p.y), 2));
	const containsPoint = (p) => doMath(p) < radius;
	return { containsPoint }
}

let c = CircleGeo(PointGeo(2,5), 10)
Array.from(Array(400))
	.map(d => PointGeo(Math.random() * 50, Math.random() * 50))
	.filter(f => c.containsPoint(f));






// Modified someone else's code to calulate distance between points
// Gets us within 200 meters at the equator, so I'm going to call
//   it good enough for simple stuff
const distance = (Coordinates) => {
	const toRadians = (x) => x * Math.PI / 180;
	const haversine = (coords) => {
		const rCoords = keys(coords).reduce((t,n) => Object.assign(t, { [n]: toRadians(coords[n]) }), {});
		const dlon = rCoords.lon2 - rCoords.lon1;
		const dlat = rCoords.lat2 - rCoords.lat1;
		return Math.pow(Math.sin(dlat / 2), 2)
			+ Math.cos(rCoords.lat1) * Math.cos(rCoords.lat2)
			* Math.pow(Math.sin(dlon / 2), 2);
	}

	let h = haversine(Coordinates);
	let c = 2 * Math.asin(Math.sqrt(h));

	// Radius of earth in kilometers. Use 3956 for miles
	let r = 6371;

	// calculate the result
	return(c * r);
}
distance({ lon1: 10, lon2: 10, lat1: 36, lat2: 35 });

// Array of distances for one degree longitude (along prime meridian)
//   moving north from equator to the pole at a rate of one degree
//   per cycle
Array.from(Array(91).keys())
	.map(d => distance({ lon1: 0, lon2: 1, lat1: d, lat2: d }))
	.forEach(f => console.log(`${f} km`))
