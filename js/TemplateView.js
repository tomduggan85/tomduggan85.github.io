
var TemplateView = Backbone.View.extend({

    initialize: function(args) {
        this.$el.html(_.template($('#' + this.templateId).html()));
        this.$el.appendTo(args.$container);
    },

    __wireModelToInputs: function(model, fields) {
        _.each(fields, function(field) {
            $input = this.$(field.selector);

            var setModelAttr = function($input) {
                var update = {};
                update[field.modelAttr] = parseFloat($input.val());
                model.set(update);
            }.bind(this, $input);

            setModelAttr();
            this.$(field.selector).on('input', setModelAttr);
        }.bind(this));
    },

    __addSelectRange: function(args) {
        var $select = this.$(args.selector);
        for (var i = args.min; i < args.max; i++) {
            var value = args.reverse ? (args.max- i + args.min) : i;
            $select.append("<option value=" + value + ">" + value + "</option>");
        }

        if (args.initialValue) {
            $select.val(args.initialValue);
        } else {
            $select[0].selectedIndex = -1;
        }

    },

});