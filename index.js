'use strict';

const https = require ('https'),
  fs = require('fs'),
  // Azure Config
  subscription_key = "c89df2835c1b42ddb239795dc2603810",
  endpoint = "https://eastus.api.cognitive.microsoft.com/",
  path = '/text/analytics/v2.1/sentiment',
  // Azure Config
  myFile = fs.readFileSync('tweets.json', function (err, data) {
    if (err) throw err;
  }),
  rawDocuments = JSON.parse(myFile.toString()),
  formattedDocuments = rawDocuments.map(tweet => {
    return {
      language: "en",
      id: tweet.id,
      text: tweet.fullText
    };
  });

const response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        const body_ = JSON.parse(body),
          totalTweets = body_.documents.length;

        let totalSentiment = 0,
          totalReTweets = 0,
          morePositive = {
            value: -1,
            index: -1
          },
          lessPositive = {
            value: 2,
            index: -1
          },
          moreRetweets = {
            value: -1,
            index: -1
          },
          lessRetweets = {
            value: 999999999999999999999999999999999999999,
            index: -1
          };

        body_.documents.forEach((document, index) => {
          totalSentiment += document.score;

          if (document.score > morePositive.value) {
            morePositive.index = index;
            morePositive.value = document.score;
          }

          if (document.score < lessPositive.value) {
            lessPositive.index = index;
            lessPositive.value = document.score;
          }
        });

        rawDocuments.forEach((document, index) => {
          totalReTweets += document.retweetCount;

          if (document.retweetCount > moreRetweets.value) {
            moreRetweets.index = index;
            moreRetweets.value = document.retweetCount;
          }

          if (document.retweetCount < lessRetweets.value) {
            lessRetweets.index = index;
            lessRetweets.value = document.retweetCount;
          }
        })

        const averageSentiment = (totalSentiment/totalTweets),
          averageRetweets = (totalReTweets/totalTweets);

        console.log("----------------- Summary ----------------");
        console.log("Analyzed Tweets:", totalTweets);
        console.log("Average Sentiment:", averageSentiment);
        console.log("Average Retweets:", averageRetweets);
        console.log("---------------------------------------------");
        console.log("Most Positive Tweet:", formattedDocuments[morePositive.index].text);
        console.log("Retweets: ", rawDocuments[morePositive.index].retweetCount);
        console.log("Value: ", morePositive.value);
        console.log("---------------------------------------------");
        console.log("Less Positive Tweet:", formattedDocuments[lessPositive.index].text);
        console.log("Retweets: ", rawDocuments[lessPositive.index].retweetCount);
        console.log("Value: ", lessPositive.value);
        console.log("---------------------------------------------");
        console.log("Most Retweeted Tweet:", rawDocuments[moreRetweets.index].fullText);
        console.log("Retweets: ", moreRetweets.value);
        console.log("Sentiment: ", body_.documents[moreRetweets.index].score);
        console.log("---------------------------------------------");
        console.log("Less Retweeted Tweet:", rawDocuments[lessRetweets.index].fullText);
        console.log("Retweets: ", lessRetweets.value);
        console.log("Sentiment: ", body_.documents[lessRetweets.index].score);
        
        console.log("----------------- Details ----------------");
        body_.documents.forEach((document, index) => {
          console.log("#", index + 1);
          console.log("Tweet:", rawDocuments[index].fullText);
          console.log("Sentiment:", document.score);
          console.log("---------------------------------------------");
        });
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

const get_sentiments = function(documents) {
    let body = JSON.stringify(documents);

    let request_params = {
        method: 'POST',
        hostname: (new URL(endpoint)).hostname,
        path: path,
        headers: {
            'Ocp-Apim-Subscription-Key': subscription_key,
        }
    };

    let req = https.request(request_params, response_handler);
    req.write(body);
    req.end();
}

get_sentiments({'documents': formattedDocuments});
