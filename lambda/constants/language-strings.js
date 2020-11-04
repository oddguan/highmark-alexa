const languageStrings = {
  en: {
    translation: {
      SKILL_NAME: 'Account Linking Demo',
      NEED_TO_LINK_MESSAGE:
        'Before we can continue, you will need to link your account to the %s skill using the card that I have sent to the Alexa app. ',
      HELP_MESSAGE:
        "You can say: 'alexa, hello', 'alexa, tell me my info' or 'alexa, who am I'.",
      FOLLOW_UP_MESSAGE: "What's your next request?",
      ERR_MESSAGE: "Sorry, I can't understand that request. Please try again.",
      GREETING_MESSAGE: 'Hello %s. Welcome to use the Highmark Assistant. ',
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

module.exports = languageStrings;
