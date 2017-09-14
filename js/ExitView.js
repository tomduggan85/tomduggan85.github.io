
var ExitView = TemplateView.extend({
    className: 'exit-view',
    templateId: 'exit-view-template',

    initialize: function(args) {
        TemplateView.prototype.initialize.call(this, args);
        this.__grantCollection = args.grantCollection;
        this.__exitModel = args.exitModel;

        var now = new Date();
        this.__addSelectRange({
            selector: 'select.exit-date-month',
            min: 1,
            max: 12,
            initialValue: now.getMonth() + 1
        });

        this.__addSelectRange({
            selector: 'select.exit-date-year',
            min: 2000,
            max: 2030,
            initialValue: now.getFullYear() + 1,
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

    __getRecentOutstandingShares: function() {
        // For now, pluck the most recent valid grant's outstanding shares value
        var validGrants = this.__grantCollection.filter(function(grant) { return grant.isValid(); });
        return _.last(_.sortBy(validGrants, this.__monthCount.bind(this))).get('outstanding_shares');
    },

    __recalculateResults: function() {
        var hasValidGrant = this.__grantCollection.any(function(grantModel) {
            return grantModel.isValid();
        });
        var hasValidExit = hasValidGrant && this.__exitModel.isValid();
        this.$el.toggleClass('has-valid-grant', hasValidGrant);
        this.$el.toggleClass('has-valid-exit', hasValidExit);

        if (hasValidExit) {
            var outstandingShares = this.__getRecentOutstandingShares();
            var ownedShares = this.__grantCollection.reduce(function(memo, grant) { return memo + (grant.get('grant_shares') || 0); }, 0);
            var totalStrikeCost = this.__grantCollection.reduce(function(memo, grant) { return memo + ((grant.get('grant_shares') * grant.get('strike_price')) || 0); }, 0);
            var percentOwnership = ownedShares / outstandingShares;
            var netIncome = Math.max(0, percentOwnership * this.__exitModel.get('valuation') - totalStrikeCost);

            var earliestGrant = this.__grantCollection.min(this.__monthCount.bind(this));

            var monthsOfService = Math.max(0, this.__monthCount(this.__exitModel) - this.__monthCount(earliestGrant));
            var annualizedIncome = netIncome / monthsOfService * 12;

            this.$('.net-gain-amount').text('$' + netIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
            this.$('.annualized-gain-amount').text('$' + annualizedIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' / yr');

            this.$('.time-period').text(this.__formattedTimePeriod(monthsOfService));
            this.$('.outstanding-shares').text(outstandingShares.toLocaleString());
        }
    },

    __monthCount: function(model) {
        return model.get('month') + 12 * model.get('year');
    },

    __formattedTimePeriod: function(monthsOfService) {
        var years = Math.floor(monthsOfService/12);
        var months = monthsOfService % 12;
        var timePeriod = [];
        if (years > 0) {
            timePeriod.push(years + (years === 1 ? ' year' : ' years'));
        } if (months > 0) {
            timePeriod.push(months + (months === 1 ? ' month' : ' months'));
        }
        return timePeriod.join(', ');
    }

});