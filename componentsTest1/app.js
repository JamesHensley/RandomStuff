import componentOne from "./webComponents/componentOne.js";

const appReady = () => {
    const comp1 = new componentOne();
    document.querySelector('.myComponent')?.appendChild(comp1);
}

// document.onloadeddata = () => appReady();
appReady();
