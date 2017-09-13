

var OptionsAppModel = Backbone.Model.extend({
    validate: function() {
        if (_.any(this.requiredNumericFields, function(field) { return !_.isNumber(this.get(field)) || _.isNaN(this.get(field)); }.bind(this))) {
            return 'invalid';
        }
    }
});

var GrantModel = OptionsAppModel.extend({
    requiredNumericFields: ['grant_shares', 'outstanding_shares', 'strike_price', 'month', 'year']
});

var ExitModel = OptionsAppModel.extend({
    requiredNumericFields: ['valuation', 'month', 'year']
});
