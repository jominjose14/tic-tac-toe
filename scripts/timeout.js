export default class ManagedTimeout {
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
        this.#id = setTimeout(() => {
            this.#task();
            this.isOn = false;
        }, this.#delay);
    }

    stop() {
        if (!this.isOn) return;
        clearTimeout(this.#id);
        this.isOn = false;
    }
}
