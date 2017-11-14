// modified version of https://raw.githubusercontent.com/howdyai/botkit/master/examples/slack/slackbutton_bot.js

/* Uses the slack button feature to offer a real time bot to multiple teams */

var Botkit = require('botkit');
require('dotenv').load();

var controller = Botkit.slackbot({
    json_file_store: './db_slackbutton_bot/'
}).configureSlackApp(
    {
        clientId: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        scopes: ['bot']
    }
    );

controller.setupWebserver(3000, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);
    controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});

var _bots = {};
function trackBot(bot) {
    _bots[bot.config.token] = bot;
}
controller.startTicking();

controller.hears('hello', 'direct_mention,direct_message,mention', function (bot, message) {
    bot.reply(message, 'Howdy!');
});

controller.hears('weather', 'direct_mention,direct_message,mention', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        convo.say('Oh, you want to know the weather.');
        convo.ask('In which city?', function (answer, convo) {
            var city = answer.text;
            // do something with this answer!            
            convo.say('Looking up weather information for ' + city);
            convo.next();
        });
    });
});

controller.on('create_bot', function (bot, config) {
    if (_bots[bot.config.token]) {
        // already online! do nothing.
    } else {
        bot.startRTM(function (err) {
            if (!err) {
                trackBot(bot);
            }
            bot.startPrivateConversation({ user: config.createdBy }, function (err, convo) {
                if (err) {
                    console.log(err);
                } else {
                    convo.say('I am a bot that has just joined your team');
                }
            });
        });
    }
});

controller.storage.teams.all(function (err, teams) {
    if (err) {
        throw new Error(err);
    }
    for (var t in teams) {
        if (teams[t].bot) {
            controller.spawn(teams[t]).startRTM(function (err, bot) {
                if (err) {
                    console.log('Error connecting bot to Slack:', err);
                } else {
                    trackBot(bot);
                }
            });
        }
    }
});

controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});