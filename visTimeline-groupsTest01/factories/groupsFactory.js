import uuidService from "../services/uuidService.js";

const groupsFactory = () => {
    const groups = {
        swimlaneGroups: [],
        nestedGroups: []
    };

    const build = (type) => (quantity) => {
        const builder = (grpIdx, grpType = type) => {
            const groupId = uuidService.uuid;
let _order = grpType == 'SwimlaneGroup' ? 0 : Math.floor(Math.random() * 10);

            const o = {
                appType: grpType,
                id: groupId,
                content: grpType == 'SwimlaneGroup' ? `SW ${grpIdx}` : `NG ${grpIdx}`,
                nestedGroups: [],
                nestedInGroup: undefined,
                visible: true,
                subgroupStack: false,
                order: _order,
//                 get subgroupStack() {
// console.log('subgroupStack');
//                     return true;
//                 },
//                 get order() {
// console.log('Get - Order', _order);
//                     return _order;
//                 },
//                 set order(val) {
// console.log('Set - Order', val);
//                     _order = val;
//                 }
            }

            if (grpType == 'SwimlaneGroup') {
                const myNested = Array.from(Array(Math.floor(Math.random() * 5) + 1).keys())
                    .map(m => builder(m, 'NestedGroup'))
                    .map(m => { m.nestedInGroup = o.id; return m; });

                o.nestedGroups = myNested.map(m => m.id);

                groups.nestedGroups.push(...myNested);
                groups.swimlaneGroups.push(o);
            }

            return o;
        }

        return new Promise(resolve => {
            const o = Array.from(Array(quantity).keys()).map(m => builder(m));
            resolve(o);
        })
    }

    return {
        allGroups: groups,
        buildSwimLanes: build('SwimlaneGroup'),
    }
}

export default groupsFactory;
