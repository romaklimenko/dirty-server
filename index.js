const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');

const keepalive = require('./routes/keepalive');

const activities = require('./routes/users/activities');
const karma = require('./routes/users/karma');
const users_votes = require('./routes/users/votes');

const domain = require('./routes/domains/domain');
const domains_votes = require('./routes/domains/votes');
const domain_voters = require('./routes/domains/voters');
const domain_readers = require('./routes/domains/readers');
const domains_readers_change = require('./routes/domains/readers-change');

const post = require('./routes/posts/post');
const posts = require('./routes/posts/posts');
const post_votes = require('./routes/posts/votes');
const post_comments = require('./routes/posts/comments');

const bans = require('./routes/bans/bans');

const app = express();

app.use(logger());

app.use(cors());

app.use(require('compression')());

app.use(keepalive);

app.use(activities);
app.use(karma);
app.use(users_votes);

app.use(domains_votes);
app.use(domain_voters);
app.use(domain_readers);
app.use(domains_readers_change);
app.use(domain);

app.use(post);
app.use(posts);;
app.use(post_votes);
app.use(post_comments);

app.use(bans);

exports.api = app;