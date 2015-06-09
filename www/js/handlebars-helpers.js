// chek for below and use if any required
// / https://github.com/danharper/Handlebars-Helpers


/* Own helpers */
Handlebars.registerHelper('firstChar', function(str) {
    return str.substr(0, 1).toUpperCase();
});

// http://axiacore.com/blog/check-if-item-array-handlebars/
//usage :
// {{#ifIn id ../favourites }}color: red{{/ifIn}}
Handlebars.registerHelper('ifIn', function(elem, list, options) {
    if(list.indexOf(elem) > -1) {
        return options.fn(this);
    }
    return options.inverse(this);
});
