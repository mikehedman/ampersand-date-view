var test = require('tape');
var DateView = require('../ampersand-date-view');
if (!Function.prototype.bind) Function.prototype.bind = require('function-bind');

function isHidden(el) {
    return el.style.display === 'none';
}

function hasClass(el, klass) {
    return el.classList.contains(klass);
}

function getSelectText(parent) {
    var sel = parent.querySelector('[data-hook=month] select');
    return sel.options[sel.selectedIndex].innerHTML;
}

test('basic initialization', function (t) {
    var control = new DateView({ name: 'title' });
    control.render();
    t.equal(control.el.tagName, 'DIV');
    t.equal(control.el.querySelectorAll('input').length, 3);
    t.equal(control.el.querySelectorAll('select').length, 1);
    t.equal(control.el.querySelector('input[type=hidden]').getAttribute('name'), 'title');
    t.end();
});

test('initialize with value', function (t) {
    var control = new DateView({
        name: 'title',
        value: new Date('2000-10-12T08:00:00.000Z')
    });

    control.render();

    t.equal(getSelectText(control.el), 'October');
    t.equal(control.el.querySelector('[data-hook=day] input').value, '12');
    t.equal(control.el.querySelector('[data-hook=year] input').value, '2000');
    t.end();
});

test('initialize with invalid value', function (t) {
    var control = new DateView({
        name: 'title',
        value: new Date('hello')
    });

    control.render();

    t.equal(control.el.querySelector('[data-hook=month] select').value, '');
    t.equal(control.el.querySelector('[data-hook=day] input').value, '');
    t.equal(control.el.querySelector('[data-hook=year] input').value, '');
    t.end();
});

test('value change', function (t) {
    var original = new Date('2000-10-12T08:00:00.000Z');
    var control = new DateView({
        name: 'title',
        value: original
    });

    control.render();

    control.el.querySelector('[data-hook=day] input').value = 15;
    //force a recalculation
    control.handleInputChanged();

    t.equal(control.value.getDate(), 15);
    t.end();
});