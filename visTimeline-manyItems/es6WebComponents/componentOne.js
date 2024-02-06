import baseObj from "./baseObj.js";

class componentOne extends baseObj {
    constructor(props) {
        super({ templateUrl: 'webComponents/componentOne.html', classNames: [''] });

        this.contentReady = () => {
            const toggle = this.wrapper.querySelector('.toggleBtn');
            if (toggle) {
                toggle.onclick = () => {
                    const longDiv = this.wrapper.querySelector('.longDiv');
                    if (longDiv) {
                        longDiv.classList.contains('hidden') ? longDiv.classList.remove('hidden') : longDiv.classList.add('hidden');
                    }
                }
            }
        }
    }
}

export default componentOne;

customElements.define('component-one', componentOne);
