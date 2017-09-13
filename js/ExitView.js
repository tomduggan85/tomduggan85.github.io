
var ExitView = TemplateView.extend({
    className: 'exit-view',
    templateId: 'exit-view-template',

    initialize: function(args) {
        TemplateView.prototype.initialize.call(this, args);
        this.__grantCollection = args.grantCollection;
        this.__exitModel = args.exitModel;

        this.__addSelectRange({
            selector: 'select.exit-date-month',
            min: 1,
            max: 12
        });

        this.__addSelectRange({
            selector: 'select.exit-date-year',
            min: 1950,
            max: 2030,
            reverse: true
        });

        this.__wireModelToInputs(this.__exitModel, [
            {selector: 'input.exit-valuation', modelAttr: 'valuation'},
            {selector: 'select.exit-date-month', modelAttr: 'month'},
            {selector: 'select.exit-date-year', modelAttr: 'year'},
        ]);

        this.__recalculateResults();
        this.__grantCollection.on('add remove reset change', this.__recalculateResults.bind(this));
        this.__exitModel.on('change', this.__recalculateResults.bind(this));
    },

    __recalculateResults: function() {
        var hasValidGrant = this.__grantCollection.any(function(grantModel) {
            return grantModel.isValid();
        });
        var hasValidExit = hasValidGrant && this.__exitModel.isValid();
        this.$el.toggleClass('has-valid-grant', hasValidGrant);
        this.$el.toggleClass('has-valid-exit', hasValidExit);

        if (hasValidExit) {
            var outstandingShares = this.__grantCollection.at(0).get('outstanding_shares'); //assume fixed number of oustanding shares
            var ownedShares = this.__grantCollection.reduce(function(memo, grant) { return memo + grant.get('grant_shares'); }, 0);
            var totalStrikeCost = this.__grantCollection.reduce(function(memo, grant) { return memo + grant.get('grant_shares') * grant.get('strike_price'); }, 0);
            var percentOwnership = ownedShares / outstandingShares;
            var netIncome = percentOwnership * this.__exitModel.get('valuation') - totalStrikeCost;

            var earliestGrant = this.__grantCollection.min(function(grant) {
                return grant.get('month') + 12 * grant.get('year');
            });

            var monthsOfService = (this.__exitModel.get('month') + 12 * this.__exitModel.get('year')) - (earliestGrant.get('month') + 12 * earliestGrant.get('year'));
            var annualizedIncome = netIncome / monthsOfService * 12;

            this.$('.net-gain-amount').text('$' + netIncome.toFixed(2));
            this.$('.annualized-gain-amount').text('$' + annualizedIncome.toFixed(2) + ' / yr');
        }
    },

});