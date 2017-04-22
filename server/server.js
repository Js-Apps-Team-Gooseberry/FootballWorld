/* globals require */

const config = require('./config/env-variables'),
    app = require('./config/express'),
    data = require('./data');

require('./config/mongoose')(config);
require('./config/passport')(app, data);
require('./api')(app, data);

app.listen(config.port, () => console.log(`Server now up and running at http://localhost:${config.port}`));