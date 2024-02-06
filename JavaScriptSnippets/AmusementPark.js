const mockData = {
	kiRides: [
		{ name: 'boo blasters on boo hill', minimumHeight: 40 },
		{ name: 'diamondback', minimumHeight: 54 },
		{ name: 'character carousel', minimumHeight: 24 },
		{ name: 'banshee', minimumHeight: 52 },
		{ name: 'invertigo', minimumHeight: 54 },
		{ name: 'snoopys junction', minimumHeight: 24 },
		{ name: 'the great pumpkin coaster', minimumHeight: 36 },
		{ name: 'the beast', minimumHeight: 48 },
		{ name: 'the racer', minimumHeight: 48 },
		{ name: 'viking fury', minimumHeight: 48 }
	]
}

const parkBuilder = ({ parkName = 'None' } = {}) => {
	const rideData = [];
	const tallEnough = (rideRequirement) => (personHeight) => rideRequirement <= personHeight;

	return {
		addRide: (rideInfo) => {
			rideData.push(Object.assign(rideInfo, { canRide: tallEnough(rideInfo.minimumHeight) }));
		},
		getRide: (rideName) => {
			return rideData.reduce((t,n) => n.name == rideName ? n : t, null);
		},
		getSuitableRides: (personHeight) => {
			return rideData.filter(f => f.canRide(personHeight));
		},
		get parkData() { return { name: parkName, rideData }}
	}
}

let ki = parkBuilder({ parkName: "Kings Island" });
mockData.kiRides.forEach(d => ki.addRide(d));

console.log('Test whether a person 40-inches tall can ride "THE BEAST": ', ki.getRide('the beast').canRide(40));
console.log('Rides suitable for shorties 40 inches tall and under: ', ki.getSuitableRides(40));
