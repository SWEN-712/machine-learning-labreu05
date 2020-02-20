from tweepy import OAuthHandler
from tweepy import API
from tweepy import Cursor

# Config
consumer_key = "W9n0PIa5V7be1vmcCj25DuGrX" #twitter app’s API Key
consumer_secret = "hJGPtdOCVa6nEavYhkoGupKPxtbfLzQlDrrlV9iBxhM9CzB7SL" #twitter app’s API secret Key
access_token = "585646403-xHKzSGv8eUsEOgyrKmMuMu5JM4MqFMuQd7dFRVaZ" #twitter app’s Access token
access_token_secret = "kAjL4D9Iao3COzFdcsncHxy7MZgT790741fFchfQcJEoH" #twitter app’s access token secret
tweets_file_path = "/dbfs/FileStore/tables/tweets.json"
twitter_account = 'googleaccess'
# Config

auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
auth_api = API(auth)

raw_tweets = auth_api.user_timeline(screen_name = twitter_account, count = 300, include_rts = False, tweet_mode = 'extended')
tweets = []

for item in raw_tweets:
  tweets.append({
    "id": item.id,
    "fullText": item.full_text.replace("'", "").replace('"', ""),
    "retweetCount": item.retweet_count,
  })  

# Replace ' with " to allow javascript parsing
cleanValue = str(tweets).replace("'", '"')

with open(tweets_file_path, "w") as f:
  f.write(cleanValue)

print("Generated Tweets:", len(raw_tweets))
