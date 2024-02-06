export const oneMinute = 60 * 1000;
export const oneHour = 60 * oneMinute;
export const oneDay = 24 * oneHour;

class dateObj extends Date {
    constructor(props = new Date().getTime()) {
        super(props);
    }

    addDays(days = 0) {
        return new dateObj(this.getTime() + (days * oneDay))
    }

    get startOfDay() {
        return new dateObj(new Date(this).setHours(0, 0, 0, 0));
    }

    get endOfDay() {
        return new dateObj(new Date(this).setHours(23, 59, 59, 999));
    }
}

export default dateObj;
