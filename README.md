Simple Slack Bot example using IBM Watson and Botkit
================================================================================

This [project](https://github.com/nheidloff/slack-watson-bot) contains sample code that shows how to build a chatbot for Slack that leverages [IBM Watson Conversation](https://www.ibm.com/watson/developercloud/conversation.html) and [Botkit](https://github.com/howdyai/botkit).

In order to provide the best possible user experience [Slack buttons](https://api.slack.com/docs/message-buttons) are used that can be defined via the [Slack Message Builder](https://api.slack.com/docs/messages/builder). The definitions of the Slack messages are stored in the [dialog definition](https://raw.githubusercontent.com/nheidloff/slack-watson-bot/master/screenshots/workspace1.png).

The project also demostrates how to invoke REST APIs, for example to find current weather conditions via [Weather Company Data](https://console.bluemix.net/catalog/services/weather-company-data). In order to do this, nodes in the dialog are marked as 'action nodes' via [context information](https://raw.githubusercontent.com/nheidloff/slack-watson-bot/master/screenshots/workspace2.png). The implementation of the actions is done in the [Node.js application](https://github.com/nheidloff/slack-watson-bot/blob/master/watson-slack.js#L55-L92).

Check out the [presentation](https://www.slideshare.net/niklasheidloff/writing-slack-bots-in-javascript-80694351) for more details.

[![Serverless Web Apps](https://github.com/nheidloff/slack-watson-bot/raw/master/screenshots/slides.png)](https://www.slideshare.net/niklasheidloff/writing-slack-bots-in-javascript-80694351)

The screenshot shows a simple sample conversation.

![alt text](https://raw.githubusercontent.com/nheidloff/slack-watson-bot/master/screenshots/slack.png "Slack Bot")


Prerequisites and Setup
================================================================================

You need three different sets of credentials.

* [Watson Conversation](https://console.bluemix.net/catalog/services/conversation): To get the credentials follow these [instructions](https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials)
* [Weather Company Data](https://console.bluemix.net/catalog/services/weather-company-data): To get the credentials follow these [instructions](https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials)
* [Slack App](http://api.slack.com/apps): Create a new app and copy the client id and client secret from this [page](https://raw.githubusercontent.com/nheidloff/slack-watson-bot/master/screenshots/slack-config1.png)

Put all of these credentials in a file '.env'. See [.env-template](https://github.com/nheidloff/slack-watson-bot/blob/master/.env-template) for an example.

In addition to the Slack client id and secret additional configuration needs to be done for the Slack app. See the screenshots 'slack-config1-5.png' in the [screenshots](https://github.com/nheidloff/slack-watson-bot/tree/master/screenshots) folder for details.
* [oauth](https://github.com/howdyai/botkit/blob/master/docs/slack-events-api.md#3-configure-oauth)
* [bot user](https://github.com/howdyai/botkit/blob/master/docs/slack-events-api.md#4-add-a-bot-user)
* [interactive messages](https://github.com/howdyai/botkit/blob/master/docs/slack-events-api.md#5-set-up-interactive-messages)
* [event subscriptions](https://github.com/howdyai/botkit/blob/master/docs/slack-events-api.md#6-set-up-event-subscriptions)

The Watson [workspace](https://github.com/nheidloff/slack-watson-bot/blob/master/workspace.json) needs to be [imported](https://www.ibm.com/watson/developercloud/doc/conversation/configure-workspace.html#creating-workspaces) into the Conversation service.

In order to run the application locally, you can use tools like [localtunnel](https://localtunnel.github.io/www/).

If you want to deploy the application to Bluemix, you need a Bluemix account. [Sign up](https://console.ng.bluemix.net/registration/) if you don't have an account yet.


Run the Sample
================================================================================

From the root directory run these commands.

```sh
$ npm install
$ node watson-slack.js
```

Open up the login page http://localhost:3000/login to [add the bot to the team](https://github.com/howdyai/botkit/blob/master/docs/slack-events-api.md#7-add-your-bot-to-your-slack-team). After this you can send direct messages to the bot 'watson-bot' in your Slack team.