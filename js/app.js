'use strict';requirejs(['../siteMapUrl','jquery-3.2.1.min','promise.min','fetch'],function(a){app.toggleSpinner(!0),window.siteMapUrl=a,requirejs(['moment.min','handlebars-v4.0.5','showdown.min','bootstrap','underscore-1.8.3.min'],function(a,b,c){window.moment=a,window.Handlebars=b,app.mdConverter=new c.Converter({strikethrough:!0,tables:!0}),$(document).ready(app.Initialize)})});var app={container:null,site:null,plugins:[],toggleSpinner:function toggleSpinner(a){var b=$('.spinner-overlay');'undefined'==typeof a?b.is(':visible')?b.fadeOut('fast'):(0===b.length&&$('body').prepend($('#SpinnerTemplate').html()),$('.spinner-overlay').fadeIn('fast')):a?(0===b.length&&$('body').prepend($('#SpinnerTemplate').html()),$('.spinner-overlay').fadeIn('fast')):b.fadeOut('fast')},loadExtTemplate:function loadExtTemplate(a){return new Promise(function(b){return requirejs(['templates/'+a],b)})},buildCurrentPage:function buildCurrentPage(a){app.container.empty(),requirejs(['buildPage'],function(b){b(_.findWhere(app.site.pages,{href:decodeURI(window.location.hash.substring(1))}),a)})},Initialize:function Initialize(){window.onpopstate=function(){app.buildCurrentPage(!1)},Handlebars.registerHelper('currentYear',function(){return new Date().getFullYear()}),Handlebars.registerHelper('all_posts',function(){var a=[!0];return _.sortBy(_.filter(app.site.pages,function(a){return'post'===a.type}),function(a){return moment(a.date).toDate().getTime()}).reverse().forEach(function(b){a.push(new Promise(function(a){var c=$('<a>',{class:'card mb-2',href:'#'+b.href});c.append($('<h3>',{class:'card-header',html:b.title})),c.append($('<div>',{class:'m-2',html:b.href})),a(c[0].outerHTML)}))}),Promise.all(a).then(function(a){var b=function(){var c=$('#all_posts');c.length?c.html(a.splice(1).join('')).find('a').click(function(a){a.preventDefault(),app.toggleSpinner(!0),requirejs(['buildPage'],function(b){b(_.findWhere(app.site.pages,{href:$(a.currentTarget).attr('href').substring(1)}),!0)})}):setTimeout(b,10)};b()}),'<div id="all_posts"></div>'}),app.container=$('#app-container'),Promise.all([fetch(siteMapUrl).then(function(a){return a.json()}),app.loadExtTemplate('root')]).then(function(a){app.site=a[0],app.rootTemplate=a[1],document.title=app.site.title;var b=[!0];_.isUndefined(app.site.plugins)||_.keys(app.site.plugins).forEach(function(a){b.push(new Promise(function(b){requirejs(['modules/'+a],function(c){app.plugins.push(c),c.setup(app.site.plugins[a],b)},b)}))}),Promise.all(b).then(function(){app.buildCurrentPage(!0)})})}};