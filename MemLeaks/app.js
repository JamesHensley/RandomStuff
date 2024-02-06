import componentOne from "./es6WebComponents/componentOne.js";

var collection = Array.from(Array(200).keys());

const elemClick = (data) => {

    return (e) => {
        console.log(data, e);
    }
}

const builder = (data) => {
    const someData = Math.random() * collection.length;

    const e = document.createElement('div');

    e.classList.add('listItem');
    e.innerText = someData;
    e.addEventListener('click', elemClick(someData));

    return e;
}

const c1 = new componentOne({
    collectionSource: collection,
    lineBuilder: builder,
});

const shitCanComponent = () => {
    document.querySelector('.appArea')?.parentElement.removeChild(document.querySelector('.appArea'));
}

document.querySelector(".shitCanBtn").onclick = shitCanComponent;
document.querySelector(".appArea")?.appendChild(c1);
