import uuidService from './uuidService.js';

const groupBuilder = (data) => {
    const group = (m) => {
        return {
            id: m?.id ?? uuidService.uuid,
            display: m?.display ?? 'New Group'
        }
    };

    const _groups = data.map(m => group(m));

    return {
        groups: _groups,
        add: (data) => { _groups.push(group(data)); },
        rem: (data) => {
            const idx = _groups.findIndex(f => f.id == data.id);
            idx >= 0 ? _groups.splice(idx, 1) : undefined;
        }
    };
};

const domainBuilder = (data) => {
    const domain = (m) => {
        return {
            id: m?.id ?? uuidService.uuid,
            display: m?.display ?? 'New Domain',
        }
    };

    const _domains = data.map(m => domain(m));

    return {
        domains: _domains,
        add: (data) => { _domains.push(domain(data)); },
        rem: (data) => {
            const idx = _domains.findIndex(f => f.id == data.id);
            idx >= 0 ? _domains.splice(idx, 1) : undefined;
        }
    };
};

const seriesBuilder = (data) => {
    const series = (m) => {
        return {
            id: m?.id ?? uuidService.uuid,
            display: m?.display ?? 'New Series'
        }
    };

    const _series = data.map(m => series(m));

    return {
        series: _series,
        add: (data) => { _series.push(series(data)); },
        rem: (data) => {
            const idx = _series.findIndex(f => f.id == data.id);
            idx >= 0 ? _series.splice(idx, 1) : undefined;
        }
    };
};

const seriesData = (data) => {
    const o = {
        id: data?.id ?? uuidService.uuid,
        groupId: data?.groupId,
        seriesId: data?.seriesId,
        domainId: data?.domainId,
        style: { },
        textVal: data?.textVal
    }
    return o;
};

const templateFactory = (data) => {
    const config = {
        type: data?.config?.type ?? 'simple',
        seriesData: seriesBuilder(data?.config?.seriesData ?? []),
        domainData: domainBuilder(data?.config?.domainData ?? []),
        groupData: groupBuilder(data?.config?.groupData ?? []),
    };

    const cellData = {
        seriesData: (data?.cellData?.seriesData ?? []).map(m => seriesData(m)),
    }

    const buildTable = () => {
        const t = document.createElement('table');
        const g = config.groupData.groups.map(m => buildGroup(m)).reduce((t, n) => [].concat.apply(t,n), []);
        t.append(...g);
        return t;
    }

    const buildGroup = (grp) => {
        const x = config.domainData.domains.map(domain => {
            const tr = document.createElement('tr');

            const g = document.createElement('td');
            g.innerText = grp.display;
            tr.appendChild(g)

            const xxx = buildDomain(domain, grp.id);
            tr.append(...xxx);

            return tr;
        })

        return x;
    }

    const buildDomain = (domain, grpId) => {
        const d = document.createElement('td');
        d.innerText = domain.display;

        const s = config.seriesData.series.map(series => buildSeries(series.id, domain.id, grpId));
        return [].concat.apply([d],s);
    }

    const buildSeries = (seriesId, domainId, grpId) => {
        const x = cellData.seriesData.find(f => f.seriesId == seriesId && f.domainId == domainId && f.groupId == grpId);

        const td = document.createElement('td');
        td.innerText = x.textVal;
        return td;
    }

    const getHtmlData = () => document.body.appendChild(buildTable());

    const testIt = () => {
        config.groupData.add({ display: 'g1' });
        config.groupData.add({ display: 'g2' });
        config.groupData.add({ display: 'g3' });
        config.groupData.add({ display: 'g4' });
        config.groupData.add({ display: 'g5' });
        config.groupData.add({ display: 'g6' });

        config.domainData.add({ display: 'd1' });
        config.domainData.add({ display: 'd2' });
        config.domainData.add({ display: 'd3' });

        config.seriesData.add({ display: 's1' });
        config.seriesData.add({ display: 's2' });
        config.seriesData.add({ display: 's3' });
        config.seriesData.add({ display: 's4' });
        config.seriesData.add({ display: 's5' });

        config.groupData.groups.forEach(g => {
            config.domainData.domains.forEach(d => {
                config.seriesData.series.forEach(s => {
                    const cd = Array.from(Array(8).keys()).map(m => String.fromCharCode(Math.round(Math.random() * 93) + 32)).join('');
                    const sd = seriesData({
                        groupId: g.id,
                        domainId: d.id,
                        seriesId: s.id,
                        textVal: cd
                    });
                    cellData.seriesData.push(sd);
                })
            })
        })

        return getHtmlData();
    }

    return {
        config,
        cellData,
        get htmlData() { return getHtmlData() },
        testIt
    };
};

export default templateFactory;
