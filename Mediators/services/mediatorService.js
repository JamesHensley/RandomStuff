class mediator {
    #subscriptions = [];

    constructor(props) {
        this.name = props.name;

        this.subscribe = (callBack) => {
            this.#subscriptions.push(callBack);

            return () => {
                const idx = this.#subscriptions.findIndex(f => f == callBack);
                idx >= 0 ? this.#subscriptions.splice(idx, 1) : undefined;
            }
        }

        this.messageAll = (sender, msg) => {
            this.#subscriptions.forEach(f => f(sender, msg))
        };
    }
    get subCount() { return this.#subscriptions.length; }
}

const mediatorService = (() => {
    const mediators = {};

    const serviceHandler = {
        get(target, prop) {
            if (!mediators[prop]) {
                mediators[prop] = new mediator({ name: prop });
            }
            return mediators[prop];
        }
    }

    return new Proxy(mediators, serviceHandler);
})();

export default mediatorService;
