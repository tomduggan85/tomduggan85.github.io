
var OptionsApp = TemplateView.extend({
    className: 'options-app',
    templateId: 'options-app-template',

    initialize: function(args) {
        TemplateView.prototype.initialize.call(this, args);

        this.__grantCollection = new Backbone.Collection([new GrantModel()], {model: GrantModel});
        this.__exitModel = new ExitModel();

        this.__grantEntryView = new GrantEntryView({
            grantModel: this.__grantCollection.at(0),
            $container: this.$('.grants')
        });

        this.__exitView = new ExitView({
            grantCollection: this.__grantCollection,
            exitModel: this.__exitModel,
            $container: this.$('.exit')
        });
    },
});