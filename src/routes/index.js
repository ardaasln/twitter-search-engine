import express from 'express';
import * as twitter from '../lib/twitter.js';
import async from 'async';

let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* Invoked when client POSTS search data */
router.post('/search', function(req, res, next) {
  let params = {q: req.body.inputValue, resultType: 'popular', count: '100'};
  async.series([
    (callback) => {
      twitter.fetchTweetsWithParams(params, callback);
    },
  ],
  (err, results) => {
    if (!err) {
      let tweets = results[0];
      let hashtagMap = twitter.populateHashtagMap(tweets);
      let textArray = twitter.fetchTextsOfTweets(tweets);
      let topTenArr = [];
      for (let hashtag in hashtagMap) {
        topTenArr.push([hashtag, hashtagMap[hashtag]]);
      }
      topTenArr.sort((a, b) => {
        return b[1] - a[1];
      });
      let response = {'tweets': textArray, 'hashtags': topTenArr.splice(0, 10)};
      res.send(response);
    } else {
      console.error('Error in Twitter Search API');
    }
  });
});

module.exports = router;
