export default class ManagedInterval {
    #id;
    #task;
    #delay;
    isOn;

    constructor(task, delay) {
        this.#id = null;
        this.#task = task;
        this.#delay = delay;
        this.isOn = false;
    }

    start() {
        if (this.isOn) return;
        this.isOn = true;
        this.#id = setInterval(this.#task, this.#delay);
    }

    stop() {
        if (!this.isOn) return;
        clearInterval(this.#id);
        this.isOn = false;
    }
}
