// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

// Setup ================================================================================

const Alexa = require('ask-sdk');
const AWS = require('aws-sdk');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// Constants ============================================================================

// TODO: clean up debugging code
// const DEBUG = getEnvVar('DEBUG', false); // true = log to CloudWatch Logs ; false = no logging
const COGNITO_REGION = getEnvVar('COGNITO_REGION', 'us-east-1');
const languageStrings = {
  en: {
    translation: {
      SKILL_NAME: 'Account Linking Demo',
      NEED_TO_LINK_MESSAGE:
        'Before we can continue, you will need to link your account to the %s skill using the card that I have sent to the Alexa app.',
      HELP_MESSAGE:
        "You can say: 'alexa, hello', 'alexa, tell me my info' or 'alexa, who am I'.",
      FOLLOW_UP_MESSAGE: "What's your request?",
      ERR_MESSAGE: "Sorry, I can't understand that request. Please try again.",
      GREETING_MESSAGE:
        "Hello %s. Welcome to use the Highmark Assistant. ",
      GOODBYE_MESSAGE: 'Good bye %s. It was nice talking to you. ',
      REPORT_NAME: 'Your full name is %s. ',
      REPORT_PHONE_NUMBER:
        'Your phone number is <say-as interpret-as="telephone">%s</say-as>. ',
      REPORT_EMAIL_ADDRESS:
        'Your email address is <say-as interpret-as="spell-out">%s</say-as>. ',
      REPORT_STREET_ADDRESS: 'Your street address is %s. ',
      FULL_NAME: '%s %s',
      NOT_SURE_OF_TYPE_MESSAGE:
        "I didn't catch what you were interested in, so here's everything I know about you. ",
      DEDUCTIBLE_MESSAGE: 'Your deductible is %s',
    },
  },
};

const detail_map = {
  'MainUseSummary': [],
  'SharePHI': [],    //  TODO
  'PlanSponsor': [],
  'PublicHealth': [],
  'Oversight': [],
  'PrivacyRightsSummary': ['allDone', 'PrivacyRightsQuestion1Summary'],
  'PrivacyRightsQuestion1Summary': ['allDone', 'PrivacyRightsQuestion1Detail1'],
  'PrivacyRightsQuestion1Detail1': ['allDone', 'allDone']
};

const question_map = {
  'PrivacyRightsQuestion1Summary':
    'You have the right to access your PHI.',

  'PrivacyRightsQuestion1Detail1':
    'To get the copy, you may obtain a form to request access by using the contact information.'
    + ' You may also request access by sending us a letter to the address. The contact information'
    + ' and address are listed on our website. It may cost to make a request.',

  'allDone':
    'All Done! Have fun using our products.'
};

const GetDeductibleLinkedHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      !isAccountNotLinked(handlerInput) &&
      request.type === 'IntentRequest' &&
      request.intent.name === 'GetDeductibleIntent'
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const repromptOutput = requestAttributes.t('FOLLOW_UP_MESSAGE');
    const deductibleAmount =
      (sessionAttributes.firstName.toLowerCase() === 'chenxiao'
        ? '600 dollars'
        : '1000 dollars') + '. ';
    const say =
      requestAttributes.t('DEDUCTIBLE_MESSAGE', deductibleAmount) +
      repromptOutput;
    return handlerInput.responseBuilder
      .speak(say)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

const MainUseDisclosure = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      !isAccountNotLinked(handlerInput) &&
      request.intent.name === 'PrivacyConsentIntent'    //  TODO
    );
  },
  handle(handlerInput) {
    const say = 'We will ask you servel privacy-related questions and setting options. ' +
                  'So, first, can we collect, use and disclose protected health information for certain of our activities, including payment and health care operations to administer our health benefit program effectively?';   //  TODO
    const repromptText = 'Answer Yes, No for the question or More Details to get more information.';
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.skillState = 'MainUseSummary';
    handlerInput.attributesManager.setSessionAttributes(attributes);
    return handlerInput.responseBuilder
      .speak(say + repromptText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const OptionsHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      !isAccountNotLinked(handlerInput) &&
      (request.intent.name === 'AMAZON.YesIntent' ||
        request.intent.name === 'AMAZON.NoIntent' ||
        request.intent.name === 'MoreDetailsIntent')
    );
  },
  handle(handlerInput) {
    const option = handlerInput.requestEnvelope.request.intent.name;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let repromptText = 'Answer Yes, No for the question or More Details to get more information.';
    if (attributes.skillState.includes('rights')) {
      repromptText = 'Answer Yes to skip or more details to get more information';
    }
    let say = '';
    if (option === 'AMAZON.YesIntent') {
      attributes.skillState = detail_map[attributes.skillState][0];
    } else if (option === 'AMAZON.NoIntent') {

    } else {
      attributes.skillState = detail_map[attributes.skillState][1];
    }
    handlerInput.attributesManager.setSessionAttributes(attributes);
    say = question_map[attributes.skillState];
    return handlerInput.responseBuilder
      .speak(say + repromptText)
      .reprompt(repromptText)
      .getResponse();
  }
}

const GetDeductibleNotLinkedHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      isAccountNotLinked(handlerInput) &&
      request.type === 'IntentRequest' &&
      request.intent.name === 'GetDeductibleIntent'
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = requestAttributes.t(
      'NEED_TO_LINK_MESSAGE',
      'SKILL_NAME'
    );
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withLinkAccountCard()
      .getResponse();
  },
};
//
// SayHelloHandler: Greet the user by first name when SayHelloIntent is triggered.
//
const SayHelloHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'LaunchRequest' ||
      (request.type === 'IntentRequest' &&
        request.intent.name === 'SayHelloIntent')
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const repromptOutput = requestAttributes.t('FOLLOW_UP_MESSAGE');
    const speakOutput =
      requestAttributes.t(
        'GREETING_MESSAGE',
        sessionAttributes.firstName ? sessionAttributes.firstName : 'there'
      ) + repromptOutput;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};
//
// RequestInfoHandler: Handle the various information related intents.
//
const RequestInfoHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'RequestInfoIntent'
    );
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const repromptOutput = requestAttributes.t('FOLLOW_UP_MESSAGE');
    let speakOutput = '';

    // fetch id for slot value
    let inquiryTypeId = getResolvedSlotIDValue(request, 'infoTypeRequested');
    if (!inquiryTypeId) {
      inquiryTypeId = 'fullProfile';
      speakOutput += requestAttributes.t('NOT_SURE_OF_TYPE_MESSAGE');
    }
    // add full name to the response, if requested
    if (inquiryTypeId === 'fullName' || inquiryTypeId === 'fullProfile') {
      const fullName = requestAttributes.t(
        'FULL_NAME',
        sessionAttributes.firstName,
        sessionAttributes.surname
      );
      speakOutput += requestAttributes.t('REPORT_NAME', fullName);
    }
    // add phone number to the response, if requested
    if (inquiryTypeId === 'phoneNumber' || inquiryTypeId === 'fullProfile') {
      speakOutput += requestAttributes.t(
        'REPORT_PHONE_NUMBER',
        sessionAttributes.phoneNumber
      );
    }
    // add email address to the response, if requested
    if (inquiryTypeId === 'emailAddress' || inquiryTypeId === 'fullProfile') {
      speakOutput += requestAttributes.t(
        'REPORT_EMAIL_ADDRESS',
        sessionAttributes.emailAddress
      );
    }
    // add street address to the response, if requested
    if (inquiryTypeId === 'streetAddress' || inquiryTypeId === 'fullProfile') {
      speakOutput += requestAttributes.t(
        'REPORT_STREET_ADDRESS',
        sessionAttributes.streetAddress
      );
    }

    speakOutput += repromptOutput;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};
//
// HelpHandler: Handle a user request for help.
//
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_MESSAGE'))
      .getResponse();
  },
};
//
// ExitHandler: Handle the cancel and stop intents.
//
const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.StopIntent')
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const speakOutput = requestAttributes.t(
      'GOODBYE_MESSAGE',
      sessionAttributes.firstName
    );
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};
//
// SessionEndedRequestHandler: Handle the session ended event.
//
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(
      `SESSION-ENDED: ${handlerInput.requestEnvelope.request.reason}`
    );
    return handlerInput.responseBuilder.getResponse();
  },
};
//
// ErrorHandler: Handle any errors caught by the SDK.
//
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    console.log(`Error handled: ${error.stack}`);
    const speakOutput = requestAttributes.t('ERR_MESSAGE');
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};
//
// GetLinkedInfoInterceptor: Interceptor function that is executed on every
// request sent to the skill
//
const GetLinkedInfoInterceptor = {
  async process(handlerInput) {
    if (
      handlerInput.requestEnvelope.session.new &&
      handlerInput.requestEnvelope.session.user.accessToken
    ) {
      // This is a new session and we have an access token,
      // so get the user details from Cognito and persist in session attributes
      const userData = await getUserData(
        handlerInput.requestEnvelope.session.user.accessToken
      );
      // console.log('GetLinkedInfoInterceptor: getUserData: ', userData);
      if (userData.Username !== undefined) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const fullName = getAttribute(userData.UserAttributes, 'name');
        const [firstName, lastName] = fullName.split(' ');
        sessionAttributes.firstName = firstName;
        sessionAttributes.lastName = lastName;
        sessionAttributes.emailAddress = getAttribute(
          userData.UserAttributes,
          'email'
        );
        sessionAttributes.phoneNumber = getAttribute(
          userData.UserAttributes,
          'phone_number'
        );
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      } else {
        console.log('GetLinkedInfoInterceptor: No user data was found.');
      }
    }
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
    });
    localizationClient.localize = function localize() {
      const args = arguments; // eslint-disable-line prefer-rest-params
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: 'sprintf',
        sprintf: values,
      });
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  },
};

// Helper functions ========================================================

// getAttribute: Pass in array of name/value pairs and attribute name,
// return the attribute value corresponding to the provided attribute name.
//
function getAttribute(attrArray, attrName) {
  let value = 'NOTFOUND';
  for (let i = 0; i < attrArray.length; i += 1) {
    if (attrArray[i].Name === attrName) {
      value = attrArray[i].Value;
      break;
    }
  }
  return value;
}

// getUserData: Retrieve user details from Cognito IdSP
//
function getUserData(accToken) {
  return new Promise((resolve, reject) => {
    const cognitoISP = new AWS.CognitoIdentityServiceProvider({
      region: COGNITO_REGION,
    });
    const cognitoParams = {
      AccessToken: accToken,
    };
    cognitoISP.getUser(cognitoParams, (error, data) => {
      if (error) {
        console.log('getUserData error : ', error);
        reject(error);
      } else {
        console.log('getUserData success : ', data);
        resolve(data);
      }
    });
  });
}

function getResolvedSlotIDValue(request, slotName) {
  // assumes the first resolved value's id is the desired one
  const slot = request.intent.slots[slotName];

  if (
    slot &&
    slot.value &&
    slot.resolutions &&
    slot.resolutions.resolutionsPerAuthority &&
    slot.resolutions.resolutionsPerAuthority[0] &&
    slot.resolutions.resolutionsPerAuthority[0].values &&
    slot.resolutions.resolutionsPerAuthority[0].values[0] &&
    slot.resolutions.resolutionsPerAuthority[0].values[0].value &&
    slot.resolutions.resolutionsPerAuthority[0].values[0].value.name
  ) {
    return slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
  }
  return null;
}

function isAccountLinked(handlerInput) {
  // if there is an access token, then assumed linked
  return handlerInput.requestEnvelope.session.user.accessToken === undefined;
}

function isAccountNotLinked(handlerInput) {
  const accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
  return !accessToken;
}

const RequestLog = {
  process(handlerInput) {
    console.log(
      `REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
  },
};

const ResponseLog = {
  process(handlerInput) {
    console.log(`RESPONSE BUILDER = ${JSON.stringify(handlerInput)}`);
    console.log(
      `RESPONSE = ${JSON.stringify(handlerInput.responseBuilder.getResponse())}`
    );
  },
};

function getEnvVar(envVarName, defaultValue) {
  if (process.env[envVarName]) {
    return process.env[envVarName];
  }
  return defaultValue;
}

// Export handlers & Lambda setup ========================================================

const skillBuilder = Alexa.SkillBuilders.standard();
exports.handler = skillBuilder
  .addRequestHandlers(
    // CheckAccountLinkedHandler,
    GetDeductibleNotLinkedHandler,
    GetDeductibleLinkedHandler,
    SayHelloHandler,
    RequestInfoHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler,
    MainUseDisclosure,
    OptionsHandler,
  )
  .addRequestInterceptors(
    RequestLog,
    LocalizationInterceptor,
    GetLinkedInfoInterceptor
  )
  .addResponseInterceptors(ResponseLog)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('linked-profile/v1')
  .lambda();
