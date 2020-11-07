const Alexa = require('ask-sdk');

const {
  GetLinkedInfoInterceptor,
  LocalizationInterceptor,
  RequestLog,
  ResponseLog,
} = require('./interceptors');

// utils
const {
  getResolvedSlotIDValue,
  isAccountLinked,
  isAccountNotLinked,
  handleDisagreedHIPAAAuth,
} = require('./utils');

// custom constants
const {
  PRE_LOGIN_PRIVACY_POLICY,
  POST_LOGIN_HIPAA_AUTH,
} = require('./constants/policies');
const { detail_map, question_map } = require('./constants/maps');

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
    let repromptOutput = requestAttributes.t('FOLLOW_UP_MESSAGE');
    let say = '';
    if (sessionAttributes.agreedHipaaAuth) {
      if (sessionAttributes.deductibleAllowed) {
        say =
          'You’ve got our BLUE CARD plan, which has an individual deductible of $250 for In-Network. For additional information about your benefits you can visit the Coverage page. ';
      } else {
        say = 'Can we use your deductible data to offer the service? ';
        repromptOutput = 'Answer yes or no. ';
        sessionAttributes.isAskingDeductible = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      return handlerInput.responseBuilder
        .speak(say + repromptOutput)
        .reprompt(repromptOutput)
        .getResponse();
    } else {
      return handleDisagreedHIPAAAuth();
    }
  },
};

const PrimaryDoctorHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      !isAccountNotLinked(handlerInput) &&
      request.type === 'IntentRequest' &&
      request.intent.name === 'PrimaryDoctorIntent'
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let say = '';
    let repromptOutput = requestAttributes.t('FOLLOW_UP_MESSAGE');
    if (sessionAttributes.agreedHipaaAuth) {
      if (sessionAttributes.primaryDoctorAllowed) {
        say =
          'Your primary doctor is John Doe and his phone number is 111-111-1234. ';
      } else {
        say =
          'Can we access your primary doctor information to offer the service? ';
        repromptOutput = 'Answer yes or no. ';
        sessionAttributes.isAskingDoctor = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      return handlerInput.responseBuilder
        .speak(say + repromptOutput)
        .reprompt(repromptOutput)
        .getResponse();
    } else {
      // user needs to agree to hipaa auth to use post-password functionalities
      return handleDisagreedHIPAAAuth();
    }
  },
};

const HipaaAuthHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      !isAccountNotLinked(handlerInput) &&
      request.intent.name === 'HIPAAAuthIntent'
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const isLoggedIn = isAccountLinked(handlerInput);
    sessionAttributes.agreedPolicy = isLoggedIn;
    sessionAttributes.agreedHipaaAuth = false;
    sessionAttributes.deductibleAllowed = false;
    sessionAttributes.primaryDoctorAllowed = false;
    const policyName = isLoggedIn
      ? 'HIPAA Authorization'
      : 'Digital Privacy Policy';
    let repromptOutput = '';
    const ASK_WRITTEN_OR_LISTEN = `To do that, you can either say, written, and I will send the written version of the ${policyName} to your mobile app. Or you can say, listen, and agreeing to the ${policyName} through voice. Which one do you prefer?`;
    const card = [];
    if (isLoggedIn) {
      // push HIPAA auth
      repromptOutput =
        'You need to agree to our HIPAA Authorization in order to use post-password functionalities. This is required because some of the questions require me to access your personal health information. ' +
        ASK_WRITTEN_OR_LISTEN;
      card.push('Highmark Health HIPAA Authorization');
      card.push(POST_LOGIN_HIPAA_AUTH);
    } else {
      // push digital privacy policy
      repromptOutput =
        'You need to agree to our digital privacy policy in order to use pre-password functionalities. ' +
        ASK_WRITTEN_OR_LISTEN;
      card.push('Highmark Health Digital Privacy Policy');
      card.push(PRE_LOGIN_PRIVACY_POLICY);
    }
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

const DigitalPolicyHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.intent.name === 'DigitalPolicyIntent'
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const isLoggedIn = isAccountLinked(handlerInput);
    sessionAttributes.agreedPolicy = isLoggedIn;
    sessionAttributes.agreedHipaaAuth = false;
    sessionAttributes.deductibleAllowed = false;
    sessionAttributes.primaryDoctorAllowed = false;
    const policyName = isLoggedIn
      ? 'HIPAA Authorization'
      : 'Digital Privacy Policy';
    let repromptOutput = '';
    const ASK_WRITTEN_OR_LISTEN = `To do that, you can either say, written, and I will send the written version of the ${policyName} to your mobile app. Or you can say, listen, and agreeing to the ${policyName} through voice. Which one do you prefer?`;
    const card = [];
    if (isLoggedIn) {
      // push HIPAA auth
      repromptOutput =
        'You need to agree to our HIPAA Authorization in order to use post-password functionalities. This is required because some of the questions require me to access your personal health information. ' +
        ASK_WRITTEN_OR_LISTEN;
      card.push('Highmark Health HIPAA Authorization');
      card.push(POST_LOGIN_HIPAA_AUTH);
    } else {
      // push digital privacy policy
      repromptOutput =
        'You need to agree to our digital privacy policy in order to use pre-password functionalities. ' +
        ASK_WRITTEN_OR_LISTEN;
      card.push('Highmark Health Digital Privacy Policy');
      card.push(PRE_LOGIN_PRIVACY_POLICY);
    }
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


const revokePersonalSettingsHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      !isAccountNotLinked(handlerInput) &&
      request.intent.name === 'RevokeIntent'
    );
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    // attributes.agreedPolicy = false;
    attributes.deductibleAllowed = false;
    attributes.primaryDoctorAllowed = false;
    handlerInput.attributesManager.setSessionAttributes(attributes);
    const say = 'We have revoked all your personal settings. ';
    const repromptText = "What's your next request?";
    return handlerInput.responseBuilder
      .speak(say + repromptText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const OptionsHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    return (
      (attributes.isConfiguring ||
        attributes.isAskingDeductible ||
        attributes.isAskingDoctor) &&
      (request.intent.name === 'AMAZON.YesIntent' ||
        request.intent.name === 'AMAZON.NoIntent' ||
        request.intent.name === 'MoreDetailsIntent')
    );
  },
  handle(handlerInput) {
    const option = handlerInput.requestEnvelope.request.intent.name;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let repromptText = 'Answer yes, no, or more details. ';
    let say = '';
    if (attributes.isAskingDeductible) {
      repromptText = "What's your next request? ";
      if (option === 'AMAZON.YesIntent') {
        say =
          'You’ve got our BLUE CARD plan, which has an individual deductible of $250 for In-Network. For additional information about your benefits you can visit the Coverage page. ';
        attributes.isAskingDeductible = false;
        attributes.deductibleAllowed = true;
      } else if (option === 'AMAZON.NoIntent') {
        say =
          'We cannot answer your question if you do not give us the permission. ';
        attributes.isAskingDeductible = false;
      }
      handlerInput.attributesManager.setSessionAttributes(attributes);
      return handlerInput.responseBuilder
        .speak(say + repromptText)
        .reprompt(repromptText)
        .getResponse();
    }
    if (attributes.isAskingDoctor) {
      repromptText = "What's your next request? ";
      if (option === 'AMAZON.YesIntent') {
        say =
          'Your primary doctor is John Doe and his phone number is 111-111-1234. ';
        attributes.isAskingDoctor = false;
        attributes.primaryDoctorAllowed = true;
      } else if (option === 'AMAZON.NoIntent') {
        say =
          'We cannot answer your question if you do not give us the permission. ';
        attributes.isAskingDoctor = false;
      }
      handlerInput.attributesManager.setSessionAttributes(attributes);
      return handlerInput.responseBuilder
        .speak(say + repromptText)
        .reprompt(repromptText)
        .getResponse();
    }
    //let currentState = attributes.skillState;
    if (option === 'AMAZON.YesIntent' || option === 'AMAZON.NoIntent') {
      attributes.skillState = detail_map[attributes.skillState][0];
      if (option === 'AMAZON.NoIntent') {
        say =
          "I'm sorry, but you need to agree with our privacy policy to use our product. ";
        repromptText = "What's your next request? ";
        attributes.isConfiguring = false;
        handlerInput.attributesManager.setSessionAttributes(attributes);
        return handlerInput.responseBuilder
          .speak(say + repromptText)
          .reprompt(repromptText)
          .getResponse();
      }
    } else {
      attributes.skillState = detail_map[attributes.skillState][1];
    }
    if (
      detail_map[attributes.skillState] &&
      detail_map[attributes.skillState][0] !== 'allDone' &&
      detail_map[attributes.skillState][0] ===
        detail_map[attributes.skillState][1]
    ) {
      repromptText = 'Answer yes or no to listen to the next question. ';
    }
    handlerInput.attributesManager.setSessionAttributes(attributes);
    say = question_map[attributes.skillState];
    if (attributes.skillState === 'allDone') {
      attributes.isConfiguring = false;
      if (attributes.agreedPolicy) {
        attributes.agreedHipaaAuth = true;
      } else {
        attributes.agreedPolicy = true;
      }
      handlerInput.attributesManager.setSessionAttributes(attributes);
      repromptText = "What's your next request? ";
    }
    return handlerInput.responseBuilder
      .speak(say + repromptText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const AgreeHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const isLoggedIn = isAccountLinked(handlerInput);
    if (!isLoggedIn) {
      return (
        !attributes.agreedPolicy &&
        (request.intent.name === 'AgreeIntent' ||
          request.intent.name === 'DisagreeIntent')
      );
    } else {
      return (
        !attributes.agreedHipaaAuth &&
        (request.intent.name === 'AgreeIntent' ||
          request.intent.name === 'DisagreeIntent')
      );
    }
  },
  handle(handlerInput) {
    const option = handlerInput.requestEnvelope.request.intent.name;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const isLoggedIn = isAccountLinked(handlerInput);
    //let currentState = attributes.skillState;
    let repromptText = "What's your next request? ";
    let say = '';
    if (isLoggedIn) {
      // logged in, do hipaa auth
      if (option === 'AgreeIntent') {
        attributes.agreedHipaaAuth = true;
        handlerInput.attributesManager.setSessionAttributes(attributes);
        say =
          'You have agreed our HIPAA Authorization. Have fun using all of our features. ';
        return handlerInput.responseBuilder
          .speak(say + repromptText)
          .reprompt(repromptText)
          .getResponse();
      } else {
        say =
          'You did not agree to our HIPAA Authorization. For now, you can not use the post-password functionalities. ';
        return handlerInput.responseBuilder
          .speak(say + repromptText)
          .reprompt(repromptText)
          .getResponse();
      }
    } else {
      // not logged in, do the digital privacy policy
      if (option === 'AgreeIntent') {
        attributes.agreedPolicy = true;
        handlerInput.attributesManager.setSessionAttributes(attributes);
        say =
          'You have agreed our digital privacy policy. Have fun using the pre-password features. ';
        return handlerInput.responseBuilder
          .speak(say + repromptText)
          .reprompt(repromptText)
          .getResponse();
      } else {
        say =
          'You did not agree to our digital privacy policy. For now, you can not use the product. ';
        return handlerInput.responseBuilder.speak(say).getResponse();
      }
    }
  },
};

const FallBackHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    let repromptText = "What's your next request? ";
    let say =
      "Sorry, I'm not sure how to answer that, meanwhile you can call 1-800-701-2324 for more information. ";
    return handlerInput.responseBuilder
      .speak(say + repromptText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const CopayHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return request.intent.name === 'WhatIsCopayIntent';
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let say = '';
    const repromptText = "What's your next request? ";
    if (attributes.agreedPolicy) {
      say =
        'A copay is the set amount you pay for a covered healthcare service. You may be also responsible for additional charges, such as those for non-preventive services. ';
    } else {
      say =
        'You have not agreed our digital privacy policy, so we can not proceed your request. To do that, please say, digital privacy policy. ';
    }
    return handlerInput.responseBuilder
      .speak(say + repromptText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const MedicalcareHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return request.intent.name === 'WhatIsMedicareIntent';
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let say = '';
    const repromptText = "What's your next request? ";
    if (attributes.agreedPolicy) {
      say =
        "Medicare is a national health insurance program providing coverage for Americans aged 65 and older. It also covers younger people with a disability, as well as people with end stage renal disease and amyotrophic lateral sclerosis (ALS) or Lou Gehrig's disease. ";
    } else {
      say =
        'You have not agreed our digital privacy policy, so we can not proceed your request. To do that, please say, digital privacy policy. ';
    }
    return handlerInput.responseBuilder
      .speak(say + repromptText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const AccountNotLinkedHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      isAccountNotLinked(handlerInput) &&
      request.type === 'IntentRequest' &&
      (request.intent.name === 'GetDeductibleIntent' ||
        request.intent.name === 'PrivacyConsentIntent' ||
        request.intent.name === 'PrimaryDoctorIntent')
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = requestAttributes.t(
      'NEED_TO_LINK_MESSAGE',
      'highmark assistant'
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
    const isLoggedIn = isAccountLinked(handlerInput);
    sessionAttributes.agreedPolicy = isLoggedIn;
    sessionAttributes.agreedHipaaAuth = false;
    sessionAttributes.deductibleAllowed = false;
    sessionAttributes.primaryDoctorAllowed = false;
    const policyName = isLoggedIn
      ? 'HIPAA Authorization'
      : 'Digital Privacy Policy';
    let repromptOutput = '';
    const ASK_WRITTEN_OR_LISTEN = `To do that, you can either say, written, and I will send the written version of the ${policyName} to your mobile app. Or you can say, listen, and agreeing to the ${policyName} through voice. Which one do you prefer?`;
    const card = [];
    if (isLoggedIn) {
      // push HIPAA auth
      repromptOutput =
        'You need to agree to our HIPAA Authorization in order to use post-password functionalities. This is required because some of the questions require me to access your personal health information. ' +
        ASK_WRITTEN_OR_LISTEN;
      card.push('Highmark Health HIPAA Authorization');
      card.push(POST_LOGIN_HIPAA_AUTH);
    } else {
      // push digital privacy policy
      repromptOutput =
        'You need to agree to our digital privacy policy in order to use pre-password functionalities. ' +
        ASK_WRITTEN_OR_LISTEN;
      card.push('Highmark Health Digital Privacy Policy');
      card.push(PRE_LOGIN_PRIVACY_POLICY);
    }
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

const PolicyDeliverHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.intent.name === 'WrittenPolicyIntent' ||
      request.intent.name === 'ListenPolicyIntent'
    );
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const name = request.intent.name;
    const isLoggedIn = isAccountLinked(handlerInput);
    let say = '';
    let repromptText =
      'Please read it carefully and after finishing reading it, say I agree or I disagree to continue. ';
    if (name === 'WrittenPolicyIntent') {
      // push policy card and return
      say = 'I have pushed a card to your alexa app. ';
      const result = handlerInput.responseBuilder.speak(say + repromptText);
      if (name === 'WrittenPolicyIntent') {
        const card = [];
        if (isLoggedIn) {
          card.push('Highmark Health HIPAA Authorization');
          card.push(POST_LOGIN_HIPAA_AUTH);
        } else {
          card.push('Highmark Health Digital Privacy Policy');
          card.push(PRE_LOGIN_PRIVACY_POLICY);
        }
        result.withSimpleCard(...card);
      }
      return result.reprompt(repromptText).getResponse();
    } else {
      // name === ListenPolicyIntent
      if (isLoggedIn) {
        say = 'We will ask you several questions about our HIPAA Authrozation policy. So first, can we collect Highmark Health disclose you PHI, including but not limited to information maintained in my health plan’s member portal such as policy number, co-pay, co-insurance, and deductible information, dates of service, and claims information, and any information you freely share through the two-way chatbot interface? ';
        attributes.skillState = 'AuthPHI';
      } else {
        say = 'We will ask you several questions about our digital privacy policy. So first, can Highmark Health collect your basic information via online forms? ';
        attributes.skillState = 'BasicInfo';
      }
      repromptText = 'Answer yes, no, or more details. ';
      attributes.isConfiguring = true;
      handlerInput.attributesManager.setSessionAttributes(attributes);
      return handlerInput.responseBuilder
        .speak(say + repromptText)
        .reprompt(repromptText)
        .getResponse();
    }
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
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const name = sessionAttributes.firstName
      ? ' ' + sessionAttributes.firstName
      : '';
    const speakOutput = `Goodbye${name}! It was nice talking to you.`;
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
    console.log(`Error handled: ${error.stack}`);
    const speakOutput =
      "Sorry, I can't understand that request. Please try again. ";
    const repromptText = "What's your next request? ";
    return handlerInput.responseBuilder
      .speak(speakOutput + repromptText)
      .reprompt(repromptText)
      .getResponse();
  },
};

// Export handlers & Lambda setup ========================================================

const skillBuilder = Alexa.SkillBuilders.standard();
exports.handler = skillBuilder
  .addRequestHandlers(
    // CheckAccountLinkedHandler,
    AccountNotLinkedHandler,
    GetDeductibleLinkedHandler,
    SayHelloHandler,
    RequestInfoHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler,
    // MainUseDisclosure,
    OptionsHandler,
    // DescribeSettings,
    AgreeHandler,
    FallBackHandler,
    CopayHandler,
    MedicalcareHandler,
    revokePersonalSettingsHandler,
    PrimaryDoctorHandler,
    PolicyDeliverHandler,
    HipaaAuthHandler,
    DigitalPolicyHandler,
  )
  .addRequestInterceptors(
    GetLinkedInfoInterceptor,
    LocalizationInterceptor,
    RequestLog
  )
  .addResponseInterceptors(ResponseLog)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('linked-profile/v1')
  .lambda();
