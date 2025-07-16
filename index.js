const fs = require('fs');

// Read and parse quotes
const quotesData = fs.readFileSync('gita_quotes_clean.txt', 'utf8');
const quotes = quotesData.split('\n')
    .filter(line => line.startsWith('QUOTE:'))
    .map(line => line.replace('QUOTE:', '').trim());

// Read and parse facts
const factsData = fs.readFileSync('gita_facts_clean.txt', 'utf8');
const facts = factsData.split('\n')
    .filter(line => line.startsWith('FACT:'))
    .map(line => line.replace('FACT:', '').trim());

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
      const hour = new Date().getUTCHours() + 5.5; // Adjust for IST or shift based on location
      const greeting = (hour < 12) ? "Good morning" :
                       (hour < 18) ? "Good afternoon" : "Good evening";
  
      const tips = [
        "Ask for a Gita quote to get inspired.",
        "You can say: give me a Gita fact.",
        "Ready for wisdom? Just ask me for a quote.",
        "Let’s start with something from the Gita."
      ];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      const speakOutput = `<speak>${greeting}, and welcome to Bhagavad Gita Guide. ${randomTip}</speak>`;
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt("You can ask for a Gita quote or a fact.")
        .getResponse();
    }
  };

const GetQuoteIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetQuoteIntent';
    },
    handle(handlerInput) {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        return handlerInput.responseBuilder
            .speak(quote)
            .getResponse();
    }
};

const GetFactIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetFactIntent';
    },
    handle(handlerInput) {
        const fact = facts[Math.floor(Math.random() * facts.length)];
        return handlerInput.responseBuilder
            .speak(fact)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('You can say give me a Gita quote, or tell me a Gita fact. What would you like?')
            .reprompt('You can say, give me a Gita quote.')
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent'
            );
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Goodbye!')
            .getResponse();
    }
};


const FallbackIntentHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
      const speakOutput = "I'm sorry, I didn't quite get that. You can say something like: give me a Gita quote, or tell me a Gita fact. What would you like?";
  
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt("Try saying: give me a Gita quote.")
        .getResponse();
    }
  };
  

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetQuoteIntentHandler,
        GetFactIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler
    )
    .lambda();
