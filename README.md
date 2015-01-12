# ampersand-date-view    ![Build Status](https://api.travis-ci.org/mikehedman/ampersand-date-view.svg?branch=master)

An extension of [ampersand-input-view](https://github.com/AmpersandJS/ampersand-input-view) to create a three part date control.

## install
```
npm install ampersand-date-view
```

## example

```javascript
var FormView = require('ampersand-form-view');
var DateView = require('ampersand-date-view');

module.exports = FormView.extend({
    fields: function () {
        return [
            new DateView({
              label: 'Birth date',
              value: this.model.birthDate || '',
              name: 'birthDate'
            }),
            ...
        ];
    }
});

```

#### opts

Same as ampersand-input-view

## changelog
0.0.7 - removing hardcoded limitation on year

## credits

Thanks to the Ampersand group!

## license

MIT

