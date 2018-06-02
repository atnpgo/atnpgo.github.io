define(['handlebars.runtime'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['root.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <li class=\"nav-item\">\n            <a class=\"nav-link\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.external : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data}) : helper)))
    + "\" >"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n        </li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "target=\"_blank\" href=\"";
},"4":function(container,depth0,helpers,partials,data) {
    return "href=\"#";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"card\">\n        <div class=\"card-header\">\n            Recent Posts\n        </div>\n        <ul class=\"list-group list-group-flush\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.posts : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n    </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <li class=\"list-group-item\" style=\"padding: 0\">\n                <a class=\"d-block\" style=\"padding: .75rem 1.25rem;\" href=\"#"
    + alias4(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + " - <em class=\"text-small text-muted\">"
    + alias4(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"date","hash":{},"data":data}) : helper)))
    + "</em></a>\n            </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<nav class=\"navbar navigation\">\n    <ul class=\"navbar-nav mr-auto\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.navbar : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</nav>\n<main role=\"main\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.posts : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div>\n        "
    + ((stack1 = ((helper = (helper = helpers.main || (depth0 != null ? depth0.main : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"main","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n</main>\n\n<footer class=\"container\">\n    <p>© "
    + alias4(((helper = (helper = helpers.currentYear || (depth0 != null ? depth0.currentYear : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"currentYear","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.operator || (depth0 != null ? depth0.operator : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"operator","hash":{},"data":data}) : helper)))
    + "</p>\n</footer>";
},"useData":true});
});