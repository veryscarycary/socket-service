const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const io = require('socket.io');

const Routes = require('./utils/routes');

class Server {

    constructor() {
        this.port =  process.env.PORT || 3000;
        this.host = `localhost`;

        this.app = express();
        this.http = http.createServer(this.app);
        this.socket = io(this.http);
    }

    appConfig() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(__dirname ));
    }

    /* Including app Routes starts*/
    includeRoutes() {
        new Routes(this.app,this.socket).routesConfig();
    }
    /* Including app Routes ends*/

    appExecute() {

        this.appConfig();
        this.includeRoutes();

        this.http.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
    }

}

const app = new Server();
app.appExecute();
