const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const io = require('socket.io');

const Routes = require('../utils/routes');
const config = require('../utils/config');

class Server {

    constructor(port, host) {
        this.port = port;
        this.host = host;

        this.app = express();
        this.http = http.createServer(this.app);
        this.socket = io(this.http);
    }

    appConfig() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, '/..')));
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

const app = new Server(config.port, config.host);
app.appExecute();
