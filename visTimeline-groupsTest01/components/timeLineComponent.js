import groupsFactory from '../factories/groupsFactory.js';
import eventsFactory from '../factories/eventsFactory.js';

import uuidService from '../services/uuidService.js';
import dateObj, { oneDay } from '../classes/dateObj.js';

import baseObj from './baseObj.js';

const proxyBuilder = (tgt) => {
    const handler = {
        get(target, property) {
            if (target.appType != 'SwimlaneGrp') {
                // console.warn(`${tgt.appType} - Getting ${property}:`, target[property]);
            }
            return target[property];
        },
        set(target, property, value) {
            // console.warn(`${tgt.appType} - Setting ${property} to:`, value);
            target[property] = value;
            return true;
        }
    }

    return new Proxy(tgt, handler);
}

const deClutterEvents = (allGroups, allEvents) => {

    const declutterGroup = (grp) => {
        return new Promise(resolve => {
            const grpItems = (grp) => allEvents.filter(f => f.group == grp.id);
    
            const groupInfoFunc = (grp, events) => {
                const grpStart = Math.min(...grpItems(grp).filter(f => f.start).map(m => m.start.getTime()));
                const grpEnd = Math.max(...grpItems(grp).filter(f => f.end).map(m => m.end.getTime()));
    
                const subGrpTemplate = () => Array.from(Array(Math.round((grpEnd - grpStart) / oneDay)));
    
                const buildNewSubGrp = () => {
                    const o = subGrpTemplate();
                    subGroups.push(o);
                    return o;
                }
    
                const subGroups = [subGrpTemplate()];
    
                // Go through each event in the group and assign a subgroupId for wherever this fits
                events.forEach(event => {
                    if (event.end) {
                        const eventOffset = ((event.start.getTime() - grpStart) / oneDay);
                        const eventLength = Math.ceil((event.end.getTime() - event.start.getTime()) / oneDay);
    
                        const subGroupRef = subGroups.find(f => {
                            return f.slice(eventOffset, eventOffset + eventLength).reduce((t, n) => t && n == undefined, true)
                        }) ?? buildNewSubGrp();
    
                        // Assign something to the subgroup elements to mark them as "inUse" for processing in future iterations
                        //   Could be anything, we don't care as long as it's not undefined
                        subGroupRef.splice(eventOffset, eventLength, ...Array.from(Array(eventLength)).map(m => event.appId));
                        // Assign the subgroup for this event
                        event.subgroup = subGroups.findIndex(f => f == subGroupRef);
                    }
                    else {
                        event.subgroup = subGroups.findIndex(f => f.some(s => s == event.linkedEventId));
                    }
                });
    
                return events;
            }
    
            const updatedEvents = _groups.get()
            .filter(f => grpItems(f).length > 0)
            .reduce((t,n) => [].concat.apply(t, groupInfoFunc(n, grpItems(n))), []);

            _items.update(updatedEvents);
    
            resolve(true);
        });
    
    }

    return allGroups
        .map(m => declutterGroup(m))
        .reduce((t, n) => [].concat.apply(t,n), []);
};

class timeLineComponent extends baseObj {
    constructor() {
        super({
            templateUrl: './components/timeLineComponent.html',
            classNames: [],
            readyCallBack: () => this.buildTimeLine()
        });
        this.groupFactory = groupsFactory();
        this.eventsFactory = eventsFactory();

        this.groupFactory.buildSwimLanes(10)
        .then(() => {
            const swimLaneGroups = this.groupFactory.allGroups.swimlaneGroups.map(m => proxyBuilder(m));
            const nestedGroups = this.groupFactory.allGroups.nestedGroups.map(m => proxyBuilder(m));
            const items = this.eventsFactory.buildEvents(nestedGroups, 80).map(m => proxyBuilder(m));
console.log(items);
            // deClutterEvents(groups, items)
            // .then(newItems => {
                this.groups = new vis.DataSet([...swimLaneGroups, ...nestedGroups]);
                // this.groups = new vis.DataSet([...swimLaneGroups, ...nestedGroups]);
                this.items = new vis.DataSet(items);
            // })

            this.groups.on('*', function (event, properties, senderId) {
                console.log('event', event, properties);
            });
        })
    }

    buildTimeLine() {
        const options = {
            stack: false
        }

        this.timeLine = new vis.Timeline(this.wrapper.querySelector('.timeLineDiv'), this.items, this.groups, options);
window['tl'] = this.timeLine;
    }

    connectedCallback() {

        // mediatorService.subscribe
    }

    disconnectedCallback() {
        // console.log('disconnectedCallback');
    }

    adoptedCallback() {
        // console.log('adoptedCallback');
    }

    attributeChangedCallback() {
        // console.log('attributeChangedCallback');
    }
}

export default timeLineComponent;
