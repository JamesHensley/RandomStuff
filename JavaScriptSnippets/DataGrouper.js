// Call this function providing an array of field names and a dataset
// Returns an object with keys being the unique values of each level
//   of the datasets grouping
/*
    [
        { town: 'Brookville', family: 'smith', name: 'bob' },
        { town: 'Brookville', family: 'smith', name: 'carol' },
        { town: 'Brookville', family: 'johnson', name: 'rick' },
        { town: 'Lewisburg', family: 'black', name: 'jason' },
        { town: 'Lewisburg', family: 'black', name: 'jenny' },
        { town: 'Lewisburg', family: 'smith', name: 'eric' }
    ]

    Becomes:
    {
        Brookville: {
            smith: [
                { town: 'Brookville', family: 'smith', name: 'bob' },
                { town: 'Brookville', family: 'smith', name: 'carol' }
            ],
            johnson: [
                { town: 'Brookville', family: 'johnson', name: 'rick' }
            ]
        },
        Lewisburg: {
            black: [
                { town: 'Lewisburg', family: 'black', name: 'jason' },
                { town: 'Lewisburg', family: 'black', name: 'jenny' }
            ],
            smith: [
                { town: 'Lewisburg', family: 'smith', name: 'eric' }
            ]
        }
    }

    When called like:
        groupedRecords(['town', 'family'], ...dataRefGoesHere)
*/

const groupedRecords = (groupColumns, dataSet) => {
    if (groupColumns?.length) {
        const filterFunc = (fieldName, fieldVal, data) => data.filter(f => f[fieldName] === fieldVal);
        
        const en = (data, fields) => {
            if (fields.length) {
                // Get unique values for the current field in the record collection
                const uniqueVals = data.map(m => m[fields[0]]).filter((f,i,e) => e.indexOf(f) == i);
                // Enumerate through the unique values and create a Key/Value pair
                //  KEY is the current field value
                //  VALUE is te result of another 'en' execution on the next grouping field
                return uniqueVals.reduce((t, n) => Object.assign(t, { [n]: en(filterFunc(fields[0], n, data), fields.slice(1))}), {});
            }
            //  No more grouping fields... return the final dataset which should be 
            //    "well-filterd" by now
            return data;
        }
        return en(dataSet, groupColumns);
    }
    // Could/should we just return the original dataset here?
    // How should it look to the user if they're expecting an OBJECT?
    return {}
}

// Test it out
(() => {
    const testData = [
        { town: 'Brookville', family: 'smith', name: 'bob' },
        { town: 'Brookville', family: 'smith', name: 'carol' },
        { town: 'Brookville', family: 'johnson', name: 'rick' },
        { town: 'Lewisburg', family: 'black', name: 'jason' },
        { town: 'Lewisburg', family: 'black', name: 'jenny' },
        { town: 'Lewisburg', family: 'smith', name: 'eric' }
    ]
    const result = groupedRecords(['town', 'family'], testData);
    console.log(result);
})()