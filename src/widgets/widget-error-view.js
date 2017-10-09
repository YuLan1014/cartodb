var cdb = require('cartodb.js');
var _ = require('underscore');
var errorButtonTemplate = require('./widget-error-button-template.tpl');
var errorTextTemplate = require('./widget-error-text-template.tpl');

/**
 * Default widget error view:
 *
 * It will listen or not to dataviewModel changes when first load is done.
 */
module.exports = cdb.core.View.extend({
  className: 'CDB-Widget-body',

  events: {
    'click .js-refresh': '_onRefreshClick'
  },

  initialize: function (opts) {
    this._title = opts.title;
    this._error = opts.error;
    this._model = opts.model;
    this._placeholder = opts.placeholder;
  },

  render: function () {
    this._reset();

    var placeholder = _.isFunction(this._placeholder)
      ? this._placeholder()
      : '';

    var body = this._error.type
      ? errorTextTemplate({
        placeholder: placeholder,
        error: this._error.error,
        title: this._title,
        message: this._error.message,
        refresh: this._error.refresh
      })
      : errorButtonTemplate({ placeholder: placeholder });

    this.$el.addClass('CDB-Widget--' + this._error.level);
    this.$el.html(body);
    return this;
  },

  _onRefreshClick: function () {
    this._model.refresh();
  },

  _reset: function () {
    this.$el.removeClass('CDB-Widget--error');
    this.$el.removeClass('CDB-Widget--warning');
    this.$el.html('');
  }
});
