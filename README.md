# highlighter - An API written in Node.js that syntax highlights code as well as a Discord bot that uses this API to syntax highlight code in chat.

Run both at the same time!
```
npm start
```

Or one at a time:

## Discord Bot

Written in Node.js with Discord.js

Use https://discord.com/api/oauth2/authorize?client_id=791903902874206258&permissions=10240&scope=bot to add to your server.

To build: 
```
npm install
npm start-bot
```
For security reasons, you need to input your own bot token into a .env file. This is not provided.


## API

Written in Node.js and Express

To build: 
```
npm install
npm start-api
```
