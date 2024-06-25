const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    'es': {
        translation: {
            WELCOME_MSG: '¡Hola Arlette! Puedo convertir temperaturas entre grados centígrados a Fahrenheit. ¿Cómo puedo ayudarte?',
            GET_FACT_MSG: 'Convirtiendo... ',
            CONVERT_MSG: 'Arlette, %s grados centígrados son %s grados Fahrenheit.',
            CONVERT_MSG_F: 'Arlette, %s grados Fahrenheit son %s grados centígrados.',
            HELP_MSG: 'Arlette, puedes decir: convierte 36 grados centígrados a Fahrenheit. ¿Cómo te puedo ayudar?',
            GOODBYE_MSG: '¡Adiós Arlette!',
            FALLBACK_MSG: 'Lo siento Arlette, no sé sobre eso. Por favor, inténtalo de nuevo.',
            ERROR_MSG: 'Lo siento Arlette, tuve problemas para hacer lo que pediste. Por favor, inténtalo de nuevo.',
            NOT_SUPPORTED_MSG: 'Lo siento Arlette, sólo puedo convertir entre grados centígrados y Fahrenheit.',
            INVALID_TEMP_MSG: 'Lo siento Arlette, no pude entender la temperatura que proporcionaste. Por favor, inténtalo de nuevo.'
        }
    },
    'en': {
        translation: {
            WELCOME_MSG: 'Hello Arlette! I can convert temperatures between Celsius and Fahrenheit. How can I help you?',
            GET_FACT_MSG: 'Converting... ',
            CONVERT_MSG: 'Arlette, %s degrees Celsius is %s degrees Fahrenheit.',
            CONVERT_MSG_F: 'Arlette, %s degrees Fahrenheit is %s degrees Celsius.',
            HELP_MSG: 'Arlette, you can say: convert 36 degrees Fahrenheit to Celsius. How can I help?',
            GOODBYE_MSG: 'Goodbye Arlette!',
            FALLBACK_MSG: 'Sorry Arlette, I don\'t know about that. Please try again.',
            ERROR_MSG: 'Sorry Arlette, I had trouble doing what you asked. Please try again.',
            NOT_SUPPORTED_MSG: 'Sorry Arlette, I can only convert between Celsius and Fahrenheit.',
            INVALID_TEMP_MSG: 'Sorry Arlette, I couldn\'t understand the temperature you provided. Please try again.'
        }
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('WELCOME_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const TemperaturaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TemperaturaIntent';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const locale = handlerInput.requestEnvelope.request.locale;
        const temperatureSlot = handlerInput.requestEnvelope.request.intent.slots.temperatura;
        let temperature = parseFloat(temperatureSlot.value);
        let convertedTemperature;
        let speakOutput;

        if (isNaN(temperature)) {
            speakOutput = t('INVALID_TEMP_MSG');
        } else {
            if (locale.startsWith('es')) {
                // Conversión de centígrados a Fahrenheit para español
                convertedTemperature = (temperature * 9/5) + 32;
                speakOutput = t('CONVERT_MSG', temperature, convertedTemperature.toFixed(2));
            } else if (locale.startsWith('en')) {
                // Conversión de Fahrenheit a centígrados para inglés
                convertedTemperature = (temperature - 32) * 5/9;
                speakOutput = t('CONVERT_MSG_F', temperature, convertedTemperature.toFixed(2));
            } else {
                speakOutput = t('NOT_SUPPORTED_MSG');
            }
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        }
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        TemperaturaIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();