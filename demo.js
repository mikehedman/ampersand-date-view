/*global console, window*/
// can be run with `npm run demo`
var DateView = require('./ampersand-date-view');
var FormView = require('ampersand-form-view');


var input = new DateView({
    label: 'Birth date',
    name: 'birthDate',
    yearMax: 2000
});

var form = document.createElement('form');
form.innerHTML = '<div data-hook="field-container"></div><input type="submit">';

var formView = new FormView({
    el: form,
    fields: [input],
    submitCallback: function (vals) {
        console.log(vals);
    }
});

window.formView = formView;

document.body.appendChild(formView.el);
