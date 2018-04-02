import InitialInput from './InitialInput.js'

/**
 * Creates, manages and listens to a series of InitialInput instances
 * @uses InitialInput
 */
export default class InitialsFactory {
    constructor() {
        this.inputs = [];
        this.submitButton = this.submitHandler = null;
    }

    /**
     * Create the inputs in a given container element
     * @param {Number} count
     * @param {HTMLElement} parent
     * @return {InitialsFactory}
     */
    create(count, parent) {
        while (count) {
            this.inputs.push(new InitialInput({
                parent: parent,
                onActiveChange: this._onActiveChange.bind(this)
            }));
            count--;
        }
        return this;
    }

    /**
     * Listen to state changes of the inputs
     * @param {InitialInput} instance
     * @private
     */
    _onActiveChange(instance) {
        if (instance.active) {
            this.inputs.forEach(inst => {
                if (inst.uid !== instance.uid) {
                    inst.setActive(false);
                }
            })
        }
    }

    /**
     * Set one of the inputs to active by its index
     * @param {Number} int
     * @return {InitialsFactory}
     */
    setActive(int) {
        this.inputs[int].setActive();
        return this;
    }

    /**
     * Get the values from each input
     * @return {string}
     */
    getInput() {
        let str = '';
        this.inputs.forEach(inst => str += inst.getValue());
        return str;
    }

    /**
     * Bind an element to interact with inputs
     * @param {HTMLElement} button
     * @param {function} fn
     * @return {InitialsFactory}
     */
    bindSubmit(button, fn) {
        this.submitButton = button;
        this.submitHandler = fn.bind(this);
        button.addEventListener('click', this.submitHandler, false);
        return this;
    }

    /**
     * Unbind & remove each input
     * @return {InitialsFactory}
     */
    destroy() {
        this.submitButton.removeEventListener('click', this.submitHandler, false);
        this.inputs.forEach(inst => inst.destroy());
        this.inputs = this.submitButton = this.submitHandler = null;
        return this;
    }
}