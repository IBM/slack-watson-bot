//------------------------------------------------------------------------------
// Copyright IBM Corp. 2017
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

var Botkit = require('botkit');
require('dotenv').load();
var sharedCode = require('./handleWatsonResponse.js')();

var middleware = require('botkit-middleware-watson')({
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    workspace_id: process.env.WORKSPACE_ID,
    version_date: '2016-09-20'
});

var controller = Botkit.slackbot({
        json_file_store: './db_slackbutton_bot/',
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

controller.on('direct_message,direct_mention,mention,interactive_message_callback', function (bot, message) {
    middleware.interpret(bot, message, function (err) {
        if (!err) {
            sharedCode.handleWatsonResponse(bot, message, 'slack');
        }
        else {            
            bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
        }
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

controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});

controller.storage.teams.all(function (err, teams) {
    if (err) {
        throw new Error(err);
    }
    // connect all teams with bots up to slack!
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