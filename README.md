# Description
This application is able to bring and anylize the sentiment of a group of tweets. This experiment was based on the tutorial that can be found in this link:
`https://towardsdatascience.com/using-azure-cognitive-services-for-sentiment-analysis-of-trumps-tweets-part-1-f42d68c7e40a`

# Development notes

- The function to extract the tweets was changed from the original one to be able to capture more specific elements form the tweets. Also, some characters(' and ") where removed from tweets to avoid errors while parsing.
- The javascript code used in this tool is based on:
`https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/quickstarts/nodejs#analyze-sentiment`
 
# Running the Source Code
To be able to run this project you may need to take the following steps:

## 1 - Generate the tweets.
  - Copy the `generate-tweets` script in your databrick environment.
  - Add your twitter API keys to the file
  - Change the twitter account that you want to analyze.
  - Run the script and you should see `Generated Tweets: {Number of tweets}` as an output.
  - Target this URL: `https://community.cloud.databricks.com/files/tables/tweets.json` and the file will be downloaded to your PC.
  - Place the file with the name `tweets.json` in the root directory of this project.
  Notes:
  - The twitter API just return a max of 200 tweets.
  - A functional `tweets.json` file is provided for testing purposes.

## 2 - Analyze the tweets
  - Enter to the `index.js` file and change the azure config to use yours.
  - Open a terminal in the folder and run `npm run analyze`.
  - A file called `results.txt` will be generated in the root folder with the results of the operation.
# machine-learning-labreu05
