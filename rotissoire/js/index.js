/*
 * _____/\\\\\\\\\_____/\\\\\\\\\\\\\\\__/\\\\\_____/\\\__/\\\\\\\\\\\\\_______/\\\\\\\\\\\\_______/\\\\\______        
 *  ___/\\\\\\\\\\\\\__\///////\\\/////__\/\\\\\\___\/\\\_\/\\\/////////\\\___/\\\//////////______/\\\///\\\____       
 *   __/\\\/////////\\\_______\/\\\_______\/\\\/\\\__\/\\\_\/\\\_______\/\\\__/\\\_______________/\\\/__\///\\\__      
 *    _\/\\\_______\/\\\_______\/\\\_______\/\\\//\\\_\/\\\_\/\\\\\\\\\\\\\/__\/\\\____/\\\\\\\__/\\\______\//\\\_     
 *     _\/\\\\\\\\\\\\\\\_______\/\\\_______\/\\\\//\\\\/\\\_\/\\\/////////____\/\\\___\/////\\\_\/\\\_______\/\\\_    
 *      _\/\\\/////////\\\_______\/\\\_______\/\\\_\//\\\/\\\_\/\\\_____________\/\\\_______\/\\\_\//\\\______/\\\__   
 *       _\/\\\_______\/\\\_______\/\\\_______\/\\\__\//\\\\\\_\/\\\_____________\/\\\_______\/\\\__\///\\\__/\\\____  
 *        _\/\\\_______\/\\\_______\/\\\_______\/\\\___\//\\\\\_\/\\\_____________\//\\\\\\\\\\\\/_____\///\\\\\/_____ 
 *         _\///________\///________\///________\///_____\/////__\///_______________\////////////_________\/////_______
 */
$('document').ready(function (e) {
    app.init();
});
window.app = {
    state: {
        name: null,
        room: null,
        drafters: {},
        cards: [],
        creator: false,
        draftStarted: false,
        currentTurn: false
    },
    firebase: {
        database: null,
        messagesRef: null,
        cardPicksRef: null,
        onChatMessage: function (data) {
            var val = data.val();
            $('#messages').append(Handlebars.compile('<li><b>{{name}}:</b> {{text}} <i class="timestamp" data-time="{{rawtime}}">{{time}}</i></li>')({
                name: val.name,
                text: val.text,
                time: new moment(new Date(parseInt(val.time))).fromNow(),
                rawtime: parseInt(val.time)
            }));
        },
        onCardPick: function (data) {
            $('[data-multiverseid="' + data.val().text + '"] i').show();
            app.getSpecificCard(data.val().text, function (c) {
                var val = data.val();
                var $template = $(Handlebars.compile('<li><b>{{name}} picked:</b> <a class="card-link" href=#>{{card}}</a> <i class="timestamp" data-time="{{rawtime}}">{{time}}</i></li>')({
                    card: c.name,
                    name: val.name,
                    multiverseid: val.text,
                    time: new moment(new Date(parseInt(val.time))).fromNow(),
                    rawtime: parseInt(val.time)
                }));
                app.state.creator[val.name].picks.push(val.text);
                $template.find('a').click(function (e) {
                    if (_.isString(c.text))
                        c.text = app.fixRulesText(c.text);
                    if (_.isString(c.flavor))
                        c.flavor = c.flavor.replace(/\—/g, '</p><p>—');
                    if (_.isArray(c.rulings))
                        c.rulings.forEach(function (r) {
                            if (_.isString(r.text))
                                r.text = app.fixRulesText(r.text);
                        });
                    app.showModal(c, true);
                });
                $('#messages').append($template);
            });
        },
        onCardAdded: function onCardAdded(data) {
            var name = data.val().name.trim(), set;
            var template = Handlebars.compile($('#card-template').html());
            var $white = $('#collapse-w > .card-block');
            var $blue = $('#collapse-u > .card-block');
            var $black = $('#collapse-b > .card-block');
            var $red = $('#collapse-r > .card-block');
            var $green = $('#collapse-g > .card-block');
            var $azorius = $('#collapse-uw > .card-block');
            var $dimir = $('#collapse-ub > .card-block');
            var $rakdos = $('#collapse-br > .card-block');
            var $gruul = $('#collapse-rg > .card-block');
            var $selesnya = $('#collapse-gw > .card-block');
            var $orzhov = $('#collapse-bw > .card-block');
            var $izzet = $('#collapse-ur > .card-block');
            var $golgari = $('#collapse-bg > .card-block');
            var $boros = $('#collapse-rw > .card-block');
            var $simic = $('#collapse-ug > .card-block');
            var $tri = $('#collapse-tri > .card-block');
            var $artifacts = $('#collapse-artifacts > .card-block');
            var $automatons = $('#collapse-automatons > .card-block');
            var $other = $('#collapse-other > .card-block');
            var $lands = $('#collapse-lands > .card-block');
            if (name.indexOf('[') > -1) {
                name = name.substring(0, name.indexOf('['));
                set = data.val().name.trim().match(/\[(.*?)\]/)[1];
            }
            app.getCard(name, function (card) {
                if (_.isUndefined(card)) {
                    alert('Error: card not found "' + name + '" in set "' + set + '"');
                }
                var $template = $(template(card));
                $template.click(app.cardViewClick);
                if (_.isUndefined(card.colors)) {
                    if (_.contains(card.types, 'Artifact') && !_.contains(card.types, 'Creature')) {
                        $artifacts.append($template);
                    } else if (_.contains(card.types, 'Artifact') && _.contains(card.types, 'Creature')) {
                        $automatons.append($template);
                    } else if (_.contains(card.types, 'Land')) {
                        $lands.append($template);
                    } else {
                        $other.append($template);
                    }
                } else {
                    switch (card.colors.length) {
                        case 1:
                            switch (card.colors[0]) {
                                case 'White':
                                    $white.append($template);
                                    break;
                                case 'Blue':
                                    $blue.append($template);
                                    break;
                                case 'Black':
                                    $black.append($template);
                                    break;
                                case 'Red':
                                    $red.append($template);
                                    break;
                                case 'Green':
                                    $green.append($template);
                                    break;
                            }
                            break;
                        case 2:
                            if (_.contains(card.colors, 'White')) {
                                if (_.contains(card.colors, 'Blue')) {
                                    $azorius.append($template);
                                } else if (_.contains(card.colors, 'Black')) {
                                    $orzhov.append($template);
                                } else if (_.contains(card.colors, 'Red')) {
                                    $boros.append($template);
                                } else if (_.contains(card.colors, 'Green')) {
                                    $selesnya.append($template);
                                }
                            } else if (_.contains(card.colors, 'Blue')) {
                                if (_.contains(card.colors, 'Black')) {
                                    $dimir.append($template);
                                } else if (_.contains(card.colors, 'Red')) {
                                    $izzet.append($template);
                                } else if (_.contains(card.colors, 'Green')) {
                                    $simic.append($template);
                                }
                            } else if (_.contains(card.colors, 'Black')) {
                                if (_.contains(card.colors, 'Red')) {
                                    $rakdos.append($template);
                                } else if (_.contains(card.colors, 'Green')) {
                                    $golgari.append($template);
                                }
                            } else {
                                $gruul.append($template);
                            }
                            break;
                        case 3:
                            $tri.append($template);
                            break;
                    }
                }
            }, set);
            $('#spinner').hide();
        },
        onDrafterJoin: function (data) {
            var val = data.val();
            if (_.isUndefined(val.order)) {
                if (app.state.creator) {
                    var order = _.keys(app.state.drafters).length + 1;
                    app.firebase.draftersRef.push({
                        name: val.name,
                        order: order,
                        time: val.time
                    }).then(function () {}).catch(function (error) {
                        console.error('Error writing new message to Firebase Database', error);
                    });
                } else {
                    // ignore it, wait until the creator asigns an order.
                }
            } else {
                // just add it.
                app.state.drafters[val.name] = {
                    name: val.name,
                    order: val.order,
                    picks: []
                };
                $('#drafters').append(Handlebars.compile('<li><b>{{name}}</b> ({{order}})</li>')(val));
                $('#messages').append(Handlebars.compile('<li><b>{{name}} joined the room.</b> <i class="timestamp" data-time="{{rawtime}}">{{time}}</i></li>')({
                    name: val.name,
                    time: (new moment(parseInt(val.time))).fromNow(),
                    rawtime: parseInt(data.val().time)
                }));
            }
        },
        loadMessages: function () {
            app.firebase.messagesRef = app.firebase.database.ref('rooms/' + app.state.room + '/messages');
            app.firebase.cardsRef = app.firebase.database.ref('rooms/' + app.state.room + '/cards');
            app.firebase.cardPicksRef = app.firebase.database.ref('rooms/' + app.state.room + '/picks');
            app.firebase.draftersRef = app.firebase.database.ref('rooms/' + app.state.room + '/drafters');

            app.firebase.messagesRef.off();
            app.firebase.messagesRef.on('child_added', app.firebase.onChatMessage);
            app.firebase.messagesRef.on('child_changed', app.firebase.onChatMessage);

            app.firebase.cardPicksRef.off();
            app.firebase.cardPicksRef.on('child_added', app.firebase.onCardPick);
            app.firebase.cardPicksRef.on('child_changed', app.firebase.onCardPick);

            app.firebase.cardsRef.off();
            app.firebase.cardsRef.on('child_added', app.firebase.onCardAdded);
            app.firebase.cardsRef.on('child_changed', app.firebase.onCardAdded);

            app.firebase.draftersRef.off();
            app.firebase.draftersRef.on('child_added', app.firebase.onDrafterJoin);
            app.firebase.draftersRef.on('child_changed', app.firebase.onDrafterJoin);
            app.firebase.draftersRef.push({
                name: app.state.name,
                time: (new Date()).getTime()
            }).then(function () {}).catch(function (error) {
                console.error('Error writing new message to Firebase Database', error);
            });
        },
        saveMessage: function (e) {
            if (e.which === 13) {
                e.preventDefault();
                // Add a new message entry to the Firebase Database.
                app.firebase.messagesRef.push({
                    name: app.state.name,
                    text: $('#message-input').val(),
                    time: (new Date()).getTime()
                }).then(function () {
                    $('#message-input').val('');
                }).catch(function (error) {
                    console.error('Error writing new message to Firebase Database', error);
                });
            }
        }
    },
    fixRulesText: function (text) {
        var ret = text.replace(/{([^}]+)}/g, function (m, value) {
            return '<img class="mana" src="http://gatherer.wizards.com/Handlers/Image.ashx?size=large&type=symbol&name=' + (value === 'T' ? 'tap' : value.replace(/\//g, '')) + '">';
        }).replace(/\(/g, '<i>(').replace(/\)/g, ')</i>').replace(/\n/g, '</p><p>');
        return ret;
    },
    generateUUID: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    },
    getCard: function (name, callback, set) {
        $.ajax({
            dataType: "json",
            url: "https://api.magicthegathering.io/v1/cards",
            data: {
                name: '"' + name + '"',
                set: set
            },
            success: function success(c) {
                callback(_.filter(c.cards, function (card) {
                    return _.isString(card.imageUrl);
                })[0]);
            }
        });
    },
    getSpecificCard: function (multiverseid, callback) {
        $.ajax({
            dataType: "json",
            url: "https://api.magicthegathering.io/v1/cards/" + multiverseid,
            success: function success(c) {
                callback(c.card);
            }
        });
    },
    selectCard: function (multiverseid) {
        app.firebase.cardPicksRef.push({
            name: app.state.name,
            text: multiverseid,
            time: (new Date()).getTime()
        }).then(function () {}).catch(function (error) {
            console.error('Error writing new message to Firebase Database', error);
        });
    },
    showModal: function (card, hideSelect) {
        var $template = $(Handlebars.compile($('#modal-template').html())(card));
        $template.on('hidden.bs.modal', function () {
            $template.remove();
        });
        $template.find('.btn-primary').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $template.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                $template.remove();
                app.selectCard(card.multiverseid);
            });
            $template.modal('hide');
        });
        if (hideSelect) {
            $template.find('.btn-primary').hide();
        }
        $('body').append($template);
        $template.modal('show');
    },
    cardViewClick: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        var multiverseid = $this.data('multiverseid');
        app.getSpecificCard(multiverseid, function (card) {
            if (_.isString(card.text))
                card.text = app.fixRulesText(card.text);
            if (_.isString(card.flavor))
                card.flavor = card.flavor.replace(/\—/g, '</p><p>—');
            if (_.isArray(card.rulings))
                card.rulings.forEach(function (r) {
                    if (_.isString(r.text))
                        r.text = app.fixRulesText(r.text);
                });
            app.showModal(card);
        });
    },
    createRoom: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $createRoomtemplate = $($('#create-room-modal-template').html());
        $createRoomtemplate.on('hidden.bs.modal', function () {
            $createRoomtemplate.remove();
        });
        $createRoomtemplate.find('.btn-primary').click(function (e) {
            $('#generator').hide();
            $('#status').show();
            $('#controls').show();
            $('#change-order').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $template = $($('#change-order-modal-template').html());
                $template.on('hidden.bs.modal', function () {
                    $template.remove();
                });
                var $modalBody = $template.find('.modal-body');
                $template.find('.btn-primary').click(function (e) {
                    var newOrder = [];
                    _.each($modalBody.find('select option:selected'), function (elem) {
                        newOrder.push($(elem).text());
                    });
                    if (_.uniq(newOrder).length === newOrder.length) {
                        _.each(newOrder, function (elem, idx) {
                            
                        });
                    } else {
                        alert('Invalid Order');
                    }
                });


                var rowTemplate = $('<div class="row"><select class="form-control"></select></div>');
                var sortedDrafters = _.sortBy(app.state.drafters, function (d) {
                    return d.order;
                });

                _.each(sortedDrafters, function (value, key) {
                    rowTemplate.find('select').append('<option>' + value.name + '</option>');
                });

                for (var i = 0; i < _.keys(app.state.drafters).length; i++) {
                    var clone = rowTemplate.clone();
                    clone.find('select option')[i].selected = true;
                    $modalBody.append(clone);
                }

                $('body').append($template);
                $template.modal('show');
            });

            app.state.creator = true;
            var cards = $('#card-list').val().split('\n');
            app.state.room = btoa(app.generateUUID());
            app.firebase.loadMessages();
            cards.forEach(function (c) {
                app.firebase.cardsRef.push({
                    name: c
                }).then(function () {}).catch(function (error) {
                    console.error('Error writing new message to Firebase Database', error);
                });
            });
            var $template = $(Handlebars.compile($('#join-code-modal-template').html())(app.state));
            $template.on('hidden.bs.modal', function () {
                $template.remove();
            });
            $('body').append($template);
            new Clipboard('#copy-room');
            $template.modal('show');
            $createRoomtemplate.modal('hide');
        });
        $('body').append($createRoomtemplate);
        $createRoomtemplate.modal('show');
    },
    joinRoom: function createRoom(e) {
        e.preventDefault();
        var $template = $(Handlebars.compile($('#join-code-modal-template').html())(app.state));
        $template.on('hidden.bs.modal', function () {
            $template.remove();
        });
        $template.find('.btn-primary').show().click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('#generator').hide();
            $('#status').show();
            $template.off('hidden.bs.modal').on('hidden.bs.modal', function () {
                app.state.room = $template.find('input').val();
                app.firebase.loadMessages();
                $template.remove();
            });
            $template.modal('hide');
        });
        $('body').append($template);
        $('#copy-room').parent().hide();
        $template.modal('show');
    },
    updateTimestamps: function () {
        $('.timestamp').each(function () {
            var $this = $(this);
            $this.text(new moment(new Date(parseInt($this.data('time')))).fromNow());
        });
        setTimeout(app.updateTimestamps, 2500);
    },
    init: function init() {
        $('#message-input').keypress(app.firebase.saveMessage);
        $('#btn-build-draft').click(app.createRoom);
        $('#btn-join-draft').click(app.joinRoom);
        setTimeout(app.updateTimestamps, 2500);

        app.firebase.database = firebase.database();
        if (app.state.name === null) {
            app.state.name = prompt('Enter your name:');
        }
    }
};