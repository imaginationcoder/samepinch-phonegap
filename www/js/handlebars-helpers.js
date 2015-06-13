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
    if(list) {
        if (list.indexOf(elem) > -1) {
            return options.fn(this);
        }
        return options.inverse(this);
    }
});


//line break
// usage  {{breaklines description}}
Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');  // replace new lines with <br>
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('parsePostContent', function(text,large_images) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>'); // replace new lines with <br>
    var img_keys = [];
    var img_contents = [];
    text.replace(/::(.*?)::/g, function () {
        img_keys.push(arguments[1]);
        img_contents.push(arguments[0]);
    });
    $.each( img_contents, function( i, val ) {
        text =  text.replace(val, "<img width='295' src="+ large_images[img_keys[i]]+"></img>");
    });
    return new Handlebars.SafeString(text);
});

