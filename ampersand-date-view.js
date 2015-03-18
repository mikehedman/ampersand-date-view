var View = require('ampersand-view');
var SelectView = require('ampersand-select-view');
var InputView = require('ampersand-input-view');
var _ = require('underscore');

module.exports = View.extend({
    template: [
        '<div class="form-group"><label data-hook="label"></label>',
        '<div class="date-controls">',
        '<span data-hook="month"></span>',
        '<span data-hook="day"></span>',
        '<span data-hook="year"></span>',
        '<input type="hidden" data-hook="main">',
        '</div>',
        '<div data-hook="message-container">',
        '<div data-hook="message-text" class="alert alert-danger"></div>',
        '</div>',
        '</div>'
    ].join(''),

    bindings: {
        'name': {
            hook: 'main',
            type: 'attribute',
            name: 'name'
        },
        'label': [
            {
                hook: 'label'
            },
            {
                type: 'toggle',
                hook: 'label'
            }
        ],
        'message': {
            type: 'text',
            hook: 'message-text'
        },
        'showMessage': {
            type: 'toggle',
            hook: 'message-container'
        },
        'dayPlaceholder': {
            type: 'attribute',
            selector: '[data-hook=day] input',
            name: 'placeholder'
        },
        'yearPlaceholder': {
            type: 'attribute',
            selector: '[data-hook=year] input',
            name: 'placeholder'
        },
        'validityClass': {
            type: 'class',
            selector: 'input, textarea'
        },
        'rootElementClass': {
            type: 'class',
            selector: ''
        }
    },

    initialize: function (spec) {
        spec || (spec = {});
        this.tests = this.tests || spec.tests || [];
        this.startingValue = spec.value;
        this.inputValue = spec.value;
        this.on('change:valid change:value', this.update, this);
        if (spec.template) this.template = spec.template;
        //will probably want this more selective, but for now, always validate
        this.shouldValidate = true;
    },

    render: function () {
        var self = this;

        //call the parent first
        View.prototype.render.apply(this);
        this.input = this.query('input');

        this.monthView = this.renderSubview(new SelectView({
            template: '<select class="form-control"></select>',
            name: 'month_do_not_use_directly',
            options: [['0','January'],['1','February'],['2','March'],['3','April'],['4','May'],['5','June'],['6','July'],['7','August'],['8','September'],['9','October'],['10','November'],['11','December']],
            unselectedText: 'Month',
            value: this.dateValid ? this.value.getMonth().toString() : undefined,
            required: true
        }), '[data-hook=month]');
        this.monthSelect = this.monthView.select;

        this.dayView = this.renderSubview(new InputView({
            template: '<input class="form-control" maxlength="2">',
            name: 'day_do_not_use_directly',
            required: true,
            placeholder: 'DD',
            value: this.dateValid ? this.value.getDate().toString() : '',
            requiredMessage: 'Day is required.',
            tests: [
                function (val) {
                    if (val < 1 || val > 31) return 'Invalid day.';
                },
                function (val) {
                    if (!/^[0-9]+$/.test(val)) return 'Day must be a number.';
                }
            ]
        }), '[data-hook=day]');
        this.dayInput = this.dayView.query('input');

        this.yearView = this.renderSubview(new InputView({
            template: '<input class="form-control" maxlength="4">',
            name: 'year_do_not_use_directly',
            required: true,
            placeholder: 'YYYY',
            value: this.dateValid ? this.value.getFullYear().toString() : '',
            requiredMessage: 'Year is required.',
            tests: [
                function (val) {
                    if (val < self.yearMin || val > self.yearMax) return 'Year must be between '+self.yearMin+' and '+self.yearMax+'.';
                },
                function (val) {
                    if (!/^[0-9]+$/.test(val)) return 'Year must be a number.';
                }
            ]
        }), '[data-hook=year]');
        this.yearInput = this.yearView.query('input');

        this.handleInputChanged = this.handleInputChanged.bind(this);
        this.initInputBindings();
    },

    props: {
        inputValue: 'any',
        startingValue: 'any',
        name: 'string',
        dayPlaceholder: ['string', true, ''],
        yearPlaceholder: ['string', true, ''],
        yearMax: ['number', true, 2100],
        yearMin: ['number', true, 1900],
        label: ['string', true, ''],
        required: ['boolean', true, true],
        shouldValidate: ['boolean', true, true],
        validClass: ['string', true, 'input-valid'],
        invalidClass: ['string', true, 'input-invalid'],
        rootElementClass: ['string', true, ''],
        date: 'date'
    },

    derived: {
        value: {
            deps: ['inputValue'],
            fn: function () {
                return this.inputValue;
            }
        },
        valid: {
            deps: ['inputValue'],
            fn: function () {
                //first time through, we won't have the subviews yet
                if (!this.yearView) {
                    return true;
                }
                this.monthView.validate();
                return this.monthView.valid && !(this.dayView.runTests() || this.yearView.runTests());
            }
        },
        dateValid: {
            deps: ['inputValue'],
            fn: function() {
                return _.isDate(this.inputValue) && _.isFinite(this.inputValue.getTime());
            }
        },
        showMessage: {
            deps: ['message', 'shouldValidate'],
            fn: function () {
                return this.shouldValidate && this.message;
            }
        },
        changed: {
            deps: ['inputValue', 'startingValue'],
            fn: function () {
                return this.inputValue !== this.startingValue;
            }
        },
        validityClass: {
            deps: ['valid', 'validClass', 'invalidClass', 'shouldValidate'],
            fn: function () {
                if (!this.shouldValidate) {
                    return '';
                } else {
                    return this.valid ? this.validClass : this.invalidClass;
                }
            }
        }
    },

    session: {
        monthView: 'object',
        dayView: 'object',
        yearView: 'object',
        message: 'string'
    },

    setValue: function (value, skipValidation) {
        //if we have a valid date, use it.  Otherwise, empty everything
        if (this.dateValid) {
            this.monthView.setValue(value.getMonth().toString(), skipValidation);
            this.dayView.setValue(value.getDate().toString(), skipValidation);
            this.yearView.setValue(value.getFullYear().toString(), skipValidation);
            this.inputValue = value;
        } else {
            this.monthView.setValue(undefined, skipValidation);
            this.dayView.setValue('', skipValidation);
            this.yearView.setValue('', skipValidation);
            this.inputValue = null;
        }
    },

    handleInputChanged: function () {
        if (this.monthSelect.value === '' || this.dayInput.value === '' || this.yearInput.value === '') {
            this.inputValue = null;
        } else {
            this.inputValue = new Date(parseInt(this.yearInput.value), parseInt(this.monthSelect.value), parseInt(this.dayInput.value));
        }
        this.updateMessage();
    },

    clean: function () {
        return this.inputValue;
    },

    handleBlur: function (event) {
        if (event.target === this.monthSelect) {
            this.monthView.validate();
        }
        this.updateMessage();
    },

    updateMessage: function() {
        var message = '';
        if (event.target === this.monthSelect) {
            this.monthView.validate();
        }
        if (!this.monthView.valid) {
            message = 'Month must be set.   ';
        }
        if (this.dayView.inputValue && this.dayView.changed) {
            message += this.dayView.getErrorMessage() + '   ';
        }
        if (this.yearView.inputValue && this.yearView.changed) {
            message += this.yearView.getErrorMessage();
        }
        this.message = message.trim();
    },

    beforeSubmit: function () {
        this.monthView.validate();
        if (!this.monthView.valid) {
            this.message = 'Month must be set.';
            return;
        }
        this.dayView.runTests();
        this.yearView.runTests();
        this.message = this.dayView.getErrorMessage() || this.yearView.getErrorMessage();
    },

    initInputBindings: function () {
        this.monthSelect.addEventListener('blur', this.handleBlur.bind(this), false);
        this.dayInput.addEventListener('blur', this.handleBlur.bind(this), false);
        this.yearInput.addEventListener('blur', this.handleBlur.bind(this), false);
        //listening to change instead of input due to timing issue
        this.monthSelect.addEventListener('change',this.handleInputChanged, false);
        this.dayInput.addEventListener('input', this.handleInputChanged, false);
        this.yearInput.addEventListener('input', this.handleInputChanged, false);
    },

    remove: function () {
        this.monthSelect.removeEventListener('blur', this.handleBlur, false);
        this.dayInput.removeEventListener('blur', this.handleBlur, false);
        this.yearInput.removeEventListener('blur', this.handleBlur, false);
        this.monthSelect.removeEventListener('change', this.handleInputChanged, false);
        this.dayInput.removeEventListener('input', this.handleInputChanged, false);
        this.yearInput.removeEventListener('input', this.handleInputChanged, false);
        View.prototype.remove.apply(this, arguments);
    },

    reset: function () {
        this.setValue(this.startingValue);
    },

    clear: function () {
        this.setValue('');
    },

    /**
     * forward updates from child controls
     */
    update: function () {
        if (this.parent) {
            this.parent.update(this);
        }
    }
});
