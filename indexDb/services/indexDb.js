
const indexDb = (() => {
    // const instance = indexedDB.open(settingsService?.dbName ?? 'testDb', 1);
    const instance = (() => {
        const r = indexedDB.open('testDb', 1);

        r.onupgradeneeded = function() {
            var db = instance.result;
            var store = db.createObjectStore("MyObjectStore", { keyPath: "overlayId" });
            var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
        };
        r.onsuccess = () => r.result;
        return r.result
    })()



    const getStore = (storeName = "MyObjectStore") => {
        var db = instance.result;
        var tx = db.transaction(storeName, "readwrite");
        return tx.objectStore(storeName);
    }

    const getIndex = (indexName) => getStore().index(indexName);

    const updateOverlay = (overlayId) => {
        return new Promise((resolve, reject) => {
            const idx = getIndex('NameIndex');
            idx.onsuccess = () => resolve(idx.result);
            idx.onerror = (e) => reject(e);
            
            idx.get(overlayId);
        })
        .then(d => Promise.resolve(d))
        .catch(e => Promise.reject(e));
    }

    const getOverlay = (overlayId) => {
        return new Promise((resolve, reject) => {
            const idx = getIndex('NameIndex');
            idx.onsuccess = () => resolve(idx.result);
            idx.onerror = (e) => reject(e);

            idx.get(overlayId);
        })
        .then(d => Promise.resolve(d))
        .catch(e => Promise.reject(e));
    }

    return {
        getOverlay,
        updateOverlay
    }
})();

export default indexDb;
