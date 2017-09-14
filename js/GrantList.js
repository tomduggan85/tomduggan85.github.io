
var GrantList = TemplateView.extend({
    className: 'grant-list',
    templateId: 'grant-list-template',

    initialize: function(args) {
        TemplateView.prototype.initialize.call(this, args);
        this.__grantCollection = args.grantCollection;

        this.__grantViews = {};
        this.__grantCollection.each(this.__addGrant.bind(this));
        this.__grantCollection.on('add', this.__addGrant.bind(this));
        this.__grantCollection.on('remove', this.__removeGrant.bind(this));
    },

    __addGrant: function(grantModel) {
        this.__grantViews[grantModel.cid] = new GrantView({
            grantModel: grantModel,
            $container: this.$('.list'),
            prepend: true
        });
    },

    __removeGrant: function(grantModel) {
        this.__grantViews[grantModel.cid].$el.remove();
        delete this.__grantViews[grantModel.cid];
    }
});