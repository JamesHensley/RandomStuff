import baseObj from "./baseObj.js";

const defaultProps = {
    lineBuilder: () => {},
    clickCallBack: () => {},
    collectionSource: [],
    templateUrl: 'es6WebComponents/componentOne.html',
    classNames: ['']
};

class componentOne extends baseObj {
    constructor(props) {
        const iProps = Object.assign({}, defaultProps, props);
        super(iProps);

        this.contentReady = () => {
            const elems = iProps.collectionSource.map(m => iProps.lineBuilder(m));
            const container = this.shadow.querySelector('.listItems');

            container?.append(...elems);
        }
    }
}

export default componentOne;

customElements.define('component-one', componentOne);
