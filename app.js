const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');

const path = require('path')

const keepalive = require('./routes/keepalive');

const activities = require('./routes/users/activities');
const karma = require('./routes/users/karma');
const users_votes = require('./routes/users/votes');

const domain = require('./routes/domains/domain');
const domains_votes = require('./routes/domains/votes');
const domain_voters = require('./routes/domains/voters');

const post_votes = require('./routes/posts/votes');
const post_comments = require('./routes/posts/comments');

const bans = require('./routes/bans/bans');

const app = express();

app.use(cors());

app.use(logger());

app.use(require('compression')());

app.use(keepalive);

app.use(activities);
app.use(karma);
app.use(users_votes);

app.use(domains_votes);
app.use(domain_voters);
app.use(domain);

app.use(post_votes);
app.use(post_comments);

app.use(bans);

app.use(express.static(path.join(__dirname, 'public')))

app.route('/*').get((req, res) => {
    res.sendFile(path.resolve(__dirname + '/public/index.html'));
});

module.exports = app;