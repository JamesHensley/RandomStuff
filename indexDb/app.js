import indexDb from "./services/indexDb.js";

indexDb.getOverlay('jimmy1')
.then(d => console.log('success', d))
.catch(e => console.log('error', e));
