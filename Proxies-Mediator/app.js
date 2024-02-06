import compFactory from "./factories/compFactory.js";

const pizzaBuilder = compFactory('pizza');
const pastaBuilder = compFactory('pasta');

const pizzaComponents = [
    pizzaBuilder.build({ id: 'pepperoni' }),
    pizzaBuilder.build({ id: 'cheese' }),
    pizzaBuilder.build({ id: 'deluxe' })
];

const pastaComponents = [
    pastaBuilder.build({ id: 'spaghetti' }),
    pastaBuilder.build({ id: 'ravioli' })
];

pizzaComponents[0].test('Hi, everybody');
pizzaComponents.forEach(f => f.destroy());

pastaComponents[0].test('Hi, everybody');
pastaComponents.forEach(f => f.destroy());
