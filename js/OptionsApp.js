
var OptionsApp = TemplateView.extend({
    className: 'options-app',
    templateId: 'options-app-template',

    initialize: function(args) {
        TemplateView.prototype.initialize.call(this, args);

        this.__grantCollection = new GrantCollection();
        this.__grantList = new GrantList({
            grantCollection: this.__grantCollection,
            $container: this.$('.grants')
        });

        this.__addBlankGrant();
        this.__grantCollection.on('change:persisted', this.__addBlankGrant.bind(this));

        this.__exitModel = new ExitModel();
        this.__exitView = new ExitView({
            grantCollection: this.__grantCollection,
            exitModel: this.__exitModel,
            $container: this.$('.exit')
        });
    },

    __addBlankGrant: function() {
        this.__grantCollection.add(new GrantModel());
    },
});