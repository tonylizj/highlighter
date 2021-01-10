<p align="left">
    <img src="https://github.com/tonylizj/highlighter-ui/blob/master/public/ic_launcher.png" height="128">
</p>

# highlighter - An API written in Node.js that syntax highlights code, a simple React frontend, as well as a Discord bot that uses this API to syntax highlight code in chat.

## To use highlighter, you can:

Visit https://tonylizj.github.io/highlighter-ui/ for a user interface.

Use https://discord.com/api/oauth2/authorize?client_id=791903902874206258&permissions=10240&scope=bot to add the Discord bot to your server.

Send a POST request to https://highlighter-api.herokuapp.com/ with three parameters: "text" containing a code block, "lang" containing the name of the language of your code, and "quality" containing one of "medium", "high", or "extreme". Visit the link above (or GET request) to see the list of supported languages.

Example: 
```
{ "text": "const a = 5;", "lang": "typescript", "quality": "high" }
```


# Building from source:

Run both at the same time!
```
npm install
npm start
```

Or one at a time:

## Discord Bot

Written in Node.js with Discord.js

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
