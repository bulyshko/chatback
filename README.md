# chatback

Server is automagically deployed to [Heroku][heroku] on push to master, but it accepts API calls only from the [client][client] deployed to [Netlify][netlify] due to CORS.

Run locally:

    npm install
    cp .env.template .env
    npm run dev

## License

The source code is licensed under the [MIT License][license].

[license]:https://raw.github.com/bulyshko/chatback/master/LICENSE
[client]:https://github.com/bulyshko/chatfront
[heroku]:https://bulyshko-chat.herokuapp.com
[netlify]:https://bulyshko-chat.netlify.com
