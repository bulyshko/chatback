# chatback

Server is automatically deployed to [Heroku][heroku] on push to master, but it will accept API calls only from the [client][client] deployed to [Firebase Hosting][firebase] because of CORS policy.

Run locally:

    npm install
    cp .env.template .env
    npm run dev

## License

The source code is licensed under the [MIT License][license].

[license]:https://raw.github.com/bulyshko/chatback/master/LICENSE
[client]:https://github.com/bulyshko/chatfront
[heroku]:https://chatbackapp.herokuapp.com
[firebase]:https://chat.bulyshko.com
