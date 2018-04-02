const w = window, d = w.document,
    values = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let uid = 0;

/**
 * Renders a fake single letter input with two bound buttons,
 * which allow to cycle up and down the allowed characters.
 * Change can be triggered by touching a button once,
 * holding it or holding and moving up or down
 *
 */
export default class InitialInput {
    constructor(options) {
        this.uid = `aii_${++uid}`;

        this.total = values.length;
        this.current = options.current || 0;

        this.parent = options.parent;
        this.el = this._render();
        this.input = this.el.getElementsByTagName('div')[0];
        this.buttons = Array.prototype.slice.call(this.el.getElementsByTagName('button'));

        this.active = false;
        this.onActiveChange = options.onActiveChange;

        // event related state vars
        this.startY = this.touchLastY = 0;
        this.startThrottleTimer = this.throttleTimer = 0;
        // will prevent input to change on touchend after
        // having changed input by moving or holding touch
        this.preventOnTouchEnd = false;

        // event handling
        this.boundEvents = [];
        this._bind('touchstart', this._startHandler);
        this._bind('touchmove', this._moveHandler);
        this._bind('touchend', this._endHandler);

        if (options.active) this.setActive();
    }

    getValue() {
        return values[this.current]
    }

    /**
     * Set this instance as active
     * @param bool
     * @return {InitialInput}
     */
    setActive(bool = true) {
        this.active = bool;
        this.el.classList[bool ? 'add' : 'remove']('aii-active');
        this._toggleButtons(bool);
        if (typeof this.onActiveChange === 'function') this.onActiveChange(this);
        return this;
    }

    /**
     * Go up the values list and render
     * @return {InitialInput}
     */
    increment() {
        this.current = ++this.current > this.total - 1 ? 0 : this.current;
        return this.setCurrent();
    }

    /**
     * Go down the values list and render
     * @return {InitialInput}
     */
    decrement() {
        this.current = --this.current < 0 ? this.total - 1 : this.current;
        return this.setCurrent();
    }

    /**
     * Display the current character
     * @return {InitialInput}
     */
    setCurrent() {
        this.input.textContent = values[this.current];
        return this;
    }

    /**
     * Render the template for the input
     * @return {Node}
     * @private
     */
    _render() {
        let box = d.createElement('div'),
            hide = 'style="display:none;"';
        box.classList.add('aii-box');
        box.innerHTML = `<button data-dir="+" ${hide}></button><div>${values[0]}</div><button data-dir="-" ${hide}></button>`;
        return this.parent.appendChild(box);
    }

    /**
     * Show/hide the buttons
     * @param bool
     * @return void
     * @private
     */
    _toggleButtons(bool = true) {
        this.buttons.forEach(btn => {
            btn.style.display = bool ? 'block' : 'none';
        });
    }

    /**
     * Reset values for 'touch move' and 'touch hold' events, start 'touch hold' timers
     * @param {TouchEvent} e
     * @return {*}
     * @private
     */
    _startHandler(e) {
        e.preventDefault();

        if (!this.active) return this.setActive();

        // reset
        this.preventOnTouchEnd = false;
        this.startY = Math.round(e.touches[0].pageY);

        // start interval based increment within one second (if touchend or touchmove,
        // has not been triggered by then).
        if (this.active) this.startThrottleTimer = w.setTimeout(() => this._holdHandler(), 1000);
    }

    /**
     * Increment/decrement current value and clear 'holding down' timers
     * @param {TouchEvent} e
     * @return {*}
     * @private
     */
    _endHandler(e) {
        let el = e.target;

        this._clearHoldTimers();

        if (el.tagName.toLowerCase() !== 'button') return;

        e.preventDefault();

        // do not increment/decrement one last time if touchend
        // is called after having held or moved to changed the input.
        if (this.preventOnTouchEnd) return;

        if (el.getAttribute('data-dir') === '+') return this.increment();

        this.decrement();
    }

    /**
     * Increment/decrement upon touch-moving up or down
     * @param {TouchEvent} e
     * @return void
     * @private
     */
    _moveHandler(e) {
        e.preventDefault();

        this._clearHoldTimers();

        if (e.target.tagName.toLowerCase() !== 'button') return;

        this.preventOnTouchEnd = true;

        let y = Math.round(e.touches[0].pageY),
            dist = this.startY - y;

        if (dist % 10 === 0 && y !== this.touchLastY) {
            if (dist < 0) {
                this.increment()
            } else {
                this.decrement()
            }
        }

        this.touchLastY = y;
    }

    /**
     * 'Touch hold' handler, starts throttling de-/incrementation
     * @return void
     * @private
     */
    _holdHandler() {
        this.preventOnTouchEnd = true;
        this.throttleTimer = w.setInterval(() => this.increment(), 200)
    }

    /**
     * Stop all timers
     * @return void
     * @private
     */
    _clearHoldTimers() {
        w.clearInterval(this.throttleTimer);
        w.clearTimeout(this.startThrottleTimer);
        this.startThrottleTimer = this.throttleTimer = 0;
    }

    /**
     * Attach to DOM event, store to remove easily later
     * @param {string} type
     * @param {function} fn
     * @private
     */
    _bind(type, fn) {
        this.el.addEventListener(type, fn = fn.bind(this), false);
        this.boundEvents.push({
            type: type,
            fn: fn
        });
    }

    /**
     * Remove all bound DOM events
     * @return void
     * @private
     */
    _unbind() {
        this.boundEvents.forEach(e => this.el.removeEventListener(e.type, e.fn, false));
    }

    /**
     * Remove and cleanup
     * return void
     */
    destroy() {
        this._clearHoldTimers();
        this._unbind();
        this.parent.removeChild(this.el);
        this.el = this.parent = this.input = this.buttons = null;
    }
}