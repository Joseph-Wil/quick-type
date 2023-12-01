'use strict';

// Add event listener
function onEvent(event, selector, callback) {
    return selector.addEventListener(event, callback);
}
  
  // Get HTML element by id
function getElement(selector, parent = document) {
    return parent.getElementById(selector);
}
  
  // Select HTML element
function select(selector, parent = document) {
    return parent.querySelector(selector);
}

  // Create an HTML element
function create(element, parent = document) {
    return parent.createElement(element);
}

export { onEvent, getElement, select, create };