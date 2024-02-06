import mediatorService from "../services/mediatorService.js";

const compFactory = (foodType) => (() => {
    const mediator = mediatorService[foodType];

    const build = (data) => {
        const name = data.id;

        const myId = Math.floor(Math.random() * 2048);   // Replace this with a UUID

        const callBack = (sender, msg) => {
            if (sender.id != myId) {
                console.log(`CallBack ${foodType} ${name} - ${sender.name} sent a message:`, msg);
            }
        };
        
        const unSubFunc = mediator.subscribe(callBack);

        const retVal = {
            get name() { return name },
            get id() { return myId },   // Replace this with a UUID
        };

        return {
            retVal,
            destroy: () => unSubFunc(),
            test: (msgData) => mediator.messageAll(retVal, msgData),
        }
    }

    return {
        build
    }
})();

export default compFactory;
