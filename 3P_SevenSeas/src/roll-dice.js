/*
 *   Copyright (c) 2023 
 *   All rights reserved.
 */

import {shuffle} from './helpers.js'
class RollDice extends HTMLElement {

    #dice;

    constructor () {

        super();

        // Creates a shadow root
        this.root = this.attachShadow({ mode: 'closed' });

        // Define properties
        this.#dice = [ 1, 2, 3, 4, 5, 6 ];

        // Render HTML
        this.root.innerHTML =
            `<style>
				button {
					background-color: var(--bg-color, #0088cc);
					border: 1px solid var(--bg-color, #0088cc);
					border-radius: var(--radius, 0.25em);
					color: var(--color, #ffffff);
					font-size: var(--size, 1.5em);
					padding: 0.5em 1em;
				}

				[aria-live] {
					font-size: var(--msg-size, 1.3125em);
					font-weight: var(--msg-weight, normal);
					font-style: var(--msg-style, normal);
					color: var(--msg-color, inherit);
				}
			</style>
			<p>
				<button><slot>Roll Dice</slot></button>
			</p>
			<div aria-live="polite"></div>`;

    }

    
    #roll() {
       shuffle(this.#dice);
        return this.#dice[ 0 ];
    }

    // Handle click events
    #clickHandler(event) {

        // Get the host component
        let host = event.target.getRootNode().host;

        // Get the message element
        let target = host.root.querySelector('[aria-live="polite"]');
        if (!target) return;

        // Roll the dice
        let roll = host.#roll();

        // Inject the message into the UI
        target.textContent = `You rolled a ${roll}`;

    }

    // run on append or move
    connectedCallback() {

        // Attach a click event listener to the button
        let btn = this.root.querySelector('button');
        if (!btn) return;
        btn.addEventListener('click', this.#clickHandler);

    }

    // run on remove
    disconnectedCallback() {

        // Remove the click event listener from the button
        let btn = this.root.querySelector('button');
        if (!btn) return;
        btn.removeEventListener('click', this.#clickHandler);

    }

}

if ('customElements' in window) {
    customElements.define('roll-dice', RollDice);
}