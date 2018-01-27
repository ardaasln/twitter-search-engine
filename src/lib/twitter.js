import Twitter from 'twitter';
import _ from 'lodash';

let client = new Twitter({
  // Will set these as environment variables later, it is a dummy account so no problem in revealing the details
  consumer_key: 'HcsgBfYNZSnlNfgsbUnNHAGsi',
  consumer_secret: '22HO1U79YNChhmNz8Fbz6wUgQp5AiDCdhwodwehwSOJOXhWiu7',
  access_token_key: '957180756543107072-stTjIPqiz0DCmciAdOYuzyY1u01i30p',
  access_token_secret: 'pesRuhPcehTfUieyW88TECwXyeus7pkZbpZ2s7lC9utZi',
});

function populateHashtagMap(tweets) {
  let completeHashtagMap = {};
  for (let tweet of tweets) {
    if (!_.isUndefined(tweet.entities)) {
      if (!_.isEmpty(tweet.entities.hashtags)) {
        for (let hashtag of tweet.entities.hashtags) {
          if (hashtag.text in completeHashtagMap) {
            completeHashtagMap[hashtag.text] = completeHashtagMap[hashtag.text] + 1;
          } else {
            completeHashtagMap[hashtag.text] = 1;
          }
        }
      }
    }
  }
  return completeHashtagMap;
}

function fetchTextsOfTweets(tweets) {
  let textArray = [];
  for (let tweet of tweets) {
    if (!_.isUndefined(tweet.text)) {
      textArray.push(tweet.text);
    }
  }
  return textArray;
}

function fetchTweetsWithParams(params = {q: 'arda', resultType: 'popular', count: '100'}, callback) {
  client.get('https://api.twitter.com/1.1/search/tweets.json', params, (error, tweets, response) => {
    if (!error) {
      console.log(tweets.statuses);
      return callback(null, tweets.statuses);
    } else {
      console.log('Error while querying Twitter search API');
      return callback(error, null);
    }
  });
}

export {fetchTweetsWithParams, fetchTextsOfTweets, populateHashtagMap};
