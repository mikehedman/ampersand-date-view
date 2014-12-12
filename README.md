# ampersand-date-view
An extension of [ampersand-input-view](https://github.com/AmpersandJS/ampersand-input-view) to create a three part date control.

## install
won't work until I get this into npm!
```
npm install ampersand-date-view
```
until then, you can add the following line directly into the dependencies section of your package.json:
"ampersand-date-view": "git://github.com/mikehedman/ampersand-date-view",

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


## credits

Thanks to the Ampersand group!

## license

MIT

