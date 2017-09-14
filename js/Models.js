

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

var GrantCollection = Backbone.Collection.extend({

    initialize: function(models, options) {
        Backbone.Collection.prototype.initialize(models, options);
        this.__loadFromLocalstore();
        this.on('remove change:persisted', this.__persistToLocalstore.bind(this));
    },

    __loadFromLocalstore: function() {
        var localstoreValue = window.localStorage.getItem('OptionsApp.persistedGrants');
        if (localstoreValue) {
            _.each(JSON.parse(localstoreValue), function(grantAttrs) {

                this.add(new GrantModel(grantAttrs));
            }.bind(this));
        }
    },

    __persistToLocalstore: function() {
        var collectionJSON = _.where(this.toJSON(), {persisted: true});
        window.localStorage.setItem('OptionsApp.persistedGrants', JSON.stringify(collectionJSON));
    }
});
