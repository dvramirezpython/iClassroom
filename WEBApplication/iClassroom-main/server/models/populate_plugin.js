// This plugin is to retrieve all the associated values of a model, is practical for some models but
// can be deprecated if only desire to populate some fields
function autoPopulateAllFields(schema) {
    var paths = '';
    schema.eachPath(function process(pathname, schemaType) {
        if (pathname=='_id') return;
        if (schemaType.options.ref)
            paths += ' ' + pathname;
    });

    schema.pre('find', handler);
    schema.pre('findOne', handler);

    function handler(next) {
        this.populate(paths);
        next();
    }
};
module.exports = autoPopulateAllFields;