const AWS = require('aws-sdk');

const COGNITO_REGION = getEnvVar('COGNITO_REGION', 'us-east-1');

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
  return handlerInput.requestEnvelope.session.user.accessToken !== undefined;
}

function isAccountNotLinked(handlerInput) {
  const accessToken =
    handlerInput.requestEnvelope.context.System.user.accessToken;
  return !accessToken;
}

function getEnvVar(envVarName, defaultValue) {
  if (process.env[envVarName]) {
    return process.env[envVarName];
  }
  return defaultValue;
}

function handleDisagreedHIPAAAuth(handlerInput) {
  const say =
    'I cannot access your personal health information if you do not agree to our HIPAA Authorization. To do that, please say, HIPAA Authorization. ';
  const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  const repromptOutput = requestAttributes.t('FOLLOW_UP_MESSAGE');
  return handlerInput.responseBuilder
    .speak(say + repromptOutput)
    .reprompt(repromptOutput)
    .getResponse();
}

module.exports = {
  getAttribute,
  getUserData,
  getResolvedSlotIDValue,
  isAccountLinked,
  isAccountNotLinked,
  getEnvVar,
  handleDisagreedHIPAAAuth,
};
