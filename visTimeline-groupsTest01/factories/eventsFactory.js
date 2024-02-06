import dateObj from "../classes/dateObj.js";
import uuidService from "../services/uuidService.js";

const eventsFactory = () => {
    const build = (group) => {
        const startOffset = Math.floor(Math.random() * 20) - 10;
        const eventLength = Math.floor(Math.random() * 10);
        const startDate = new dateObj().startOfDay.addDays(startOffset);
        const endDate = startDate.endOfDay.addDays(eventLength);

        const title = Array.from(Array(5)).reduce((t, n) => {
            const c = Math.floor(Math.random() * 26) + 65;
            return `${t}${String.fromCharCode(c)}`;
        }, '');

        return {
            appType: 'TimeLineEvent',
            id: uuidService.uuid,
            start: startDate,
            end: endDate,
            group: group.id,
            subgroup: 0,
            content: `E-${title}`
        };
    }

    const buildEvents = (nestedGroups, quantity) => {
        return Array.from(Array(quantity).keys())
        .map(m => {
            const idx = Math.floor(Math.random() * nestedGroups.length);
            const grp = nestedGroups[idx];
            return build(grp);
        })
    }

    return {
        buildEvents
    }
}

export default eventsFactory;
