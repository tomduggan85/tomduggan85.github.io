
var GrantView = TemplateView.extend({
    className: 'grant-view',
    templateId: 'grant-view-template',

    initialize: function(args) {
        TemplateView.prototype.initialize.call(this, args);
        this.__grantModel = args.grantModel;

        this.$el.attr('data-cid', this.__grantModel.cid).toggleClass('editing', !this.__grantModel.get('persisted'));
        this.$('.save-for-later').click(this.__persist.bind(this));
        this.$('.delete-grant').click(this.__deleteGrant.bind(this));

        var now = new Date();
        this.__addSelectRange({
            selector: 'select.grant-date-month',
            min: 1,
            max: 12,
            initialValue: this.__grantModel.get('persisted') ? this.__grantModel.get('month') : now.getMonth() + 1
        });

        this.__addSelectRange({
            selector: 'select.grant-date-year',
            min: 2000,
            max: 2030,
            initialValue: this.__grantModel.get('persisted') ? this.__grantModel.get('year') : now.getFullYear(),
            reverse: true
        });

        this.__wireModelToInputs(this.__grantModel, [
            {selector: 'input.grant-shares', modelAttr: 'grant_shares'},
            {selector: 'input.outstanding-shares', modelAttr: 'outstanding_shares'},
            {selector: 'input.strike-price', modelAttr: 'strike_price'},
            {selector: 'select.grant-date-month', modelAttr: 'month'},
            {selector: 'select.grant-date-year', modelAttr: 'year'},
        ]);

        this.__showSavedAttrs();
        this.__updateValidity();
        this.__grantModel.on('change', this.__showSavedAttrs.bind(this));
        this.__grantModel.on('change', this.__updateValidity.bind(this));
    },

    __updateValidity: function() {
        this.$el.toggleClass('valid', this.__grantModel.isValid());
    },

    __persist: function() {
        this.__grantModel.set({persisted: true});
        this.$el.removeClass('editing');
    },

    __showSavedAttrs: function() {
        var attrsNeedingCommas = ['grant_shares', 'outstanding_shares', 'strike_price'];
        _.each(this.__grantModel.attributes, function(value, attr) {
            var text
            this.$('.saved-data .' + attr).text(_.contains(attrsNeedingCommas, attr) ? value.toLocaleString() : value);
        }.bind(this));
    },

    __deleteGrant: function() {
        if (confirm("Delete grant?")) {
            this.__grantModel.collection.remove(this.__grantModel);
        }
    },
});