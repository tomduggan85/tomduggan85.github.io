
var GrantEntryView = TemplateView.extend({
    className: 'grant-entry-view',
    templateId: 'grant-entry-view-template',

    initialize: function(args) {
        TemplateView.prototype.initialize.call(this, args);
        this.__grantModel = args.grantModel;

        var now = new Date();
        this.__addSelectRange({
            selector: 'select.grant-date-month',
            min: 1,
            max: 12,
            initialValue: now.getMonth() + 1
        });

        this.__addSelectRange({
            selector: 'select.grant-date-year',
            min: 1950,
            max: 2030,
            initialValue: now.getFullYear(),
            reverse: true
        });

        this.__wireModelToInputs(this.__grantModel, [
            {selector: 'input.grant-shares', modelAttr: 'grant_shares'},
            {selector: 'input.outstanding-shares', modelAttr: 'outstanding_shares'},
            {selector: 'input.strike-price', modelAttr: 'strike_price'},
            {selector: 'select.grant-date-month', modelAttr: 'month'},
            {selector: 'select.grant-date-year', modelAttr: 'year'},
        ]);
    },
});