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

const PRE_LOGIN_PRIVACY_POLICY = `
Highmark Health is partnering with industry-leading technology companies and other service
providers to create a remarkable digital member experience. Our goal is to enhance your health-related
journey and make your experience on our digital tools and channels more customized and applicable to
your specific needs. This collaborative effort (the “Program”) involves Highmark Health gathering,
utilizing, and sharing appropriate customer information with our business partners to help design,
implement, and manage innovative capabilities that enable our members to quickly access up to date
plan information and other details through a cloud-hosted digital member website, mobile app, and an
integrated conversational chatbot tool.
To offer this personalized experience, Highmark Health must collect, use, and disclose personal
information across our digital tools and channels. This information can include, among other things,
demographics such as your name and date of birth, contact information such as phone number,
address, and email address, details about receipt of healthcare services such as dates of service and
medical conditions and procedures, details about your insurance benefits such as policy number and
claims, and information about your activities on our digital tools and channels such as internet protocol
(IP) address, device identifier, and cookie ID (collectively, “Personal Information”). By studying the
ways in which you navigate through our digital tools and channels, we can continuously improve and
optimize the information and programs that match your needs and interests to deliver the right
information at the right time throughout your health care experience.
Highmark Health is collaborating with companies including Google on digital improvement
projects supporting the Program. Our collaborations allow us to offer capabilities such as real-time chat
sessions where users can ask questions on our member portal like “have I met my deductible this year”
and similar inquiries. These projects require that Highmark Health share your Personal Information with
its business partners (like Google) for product and solution development, testing, and refinement
purposes.
Highmark Health recognizes that its business partners may not be subject to the same range of
federal and/or state laws governing the collection, use, and disclosure of Personal Information.
Nevertheless, we have taken a number of steps to ensure that your information is handled responsibly,
such as by maintaining a rigorous internal privacy and data ethics program, negotiating restrictive
contract terms with third party service providers, and seeking to obtain your affirmative authorization,
as applicable.
As an entity subject to the Health Insurance Portability and Accountability Act (HIPAA), Highmark
Health must meet standards set by federal regulations regarding the collection, use, and disclosure of
Personal Information relating to your healthcare and payment for your care (“Protected Health
Information” or “PHI”). We are asking you to sign the below HIPAA Authorization to ensure we comply
with relevant legal requirements when collecting, using, and disclosing your PHI in connection with the
Program.
HIPAA Authorization
2
I understand the nature of the digital member experience and the work Highmark Health is
conducting. I realize the value of Highmark Health partnering with technology and service providers to
create pioneering products and solutions, such as a chatbot tool, that will benefit consumers like me. I
further understand that Highmark Health must collect, use, and disclose my Personal Information and
PHI in order to deliver this Program, and must also share this information with certain parties who are
not subject to the same laws as Highmark Health.
Accordingly, I authorize Highmark Health as follows:
I authorize Highmark Health to disclose my PHI, including but not limited to information
maintained in my health plan’s member portal such as policy number, co-pay, co-insurance, and
deductible information, dates of service, and claims information, and any information I freely share
through the two-way chatbot interface.
I authorize Highmark Health to disclose my PHI to its business partners, including but not limited
to Google, for purposes of supporting the Program. This Authorization will remain in effect until I
revoke it by notifying Highmark Health in writing as specified herein.
I acknowledge that when information is shared with these third parties that they are not subject
to certain federal and/or state privacy and security laws and regulations in the same manner, or to the
same degree, as Highmark Health.
I understand that my information, when disclosed to these third parties, may no longer be
protected by federal privacy laws.
I further acknowledge that these third parties may be able to use my information for their own
commercial purposes.
I am aware that my PHI might include certain sensitive medical information regarding HIV,
behavioral health, or drug and alcohol conditions, if such information is contained in my member portal
or if I volunteer such information, and I authorize disclosure of this information for Program-related
purposes.
I understand the risks to my information by participating in this Program and I hereby authorize
the collection, use, and disclosure of my PHI.
I acknowledge that under certain laws or regulations, Highmark Health’s disclosure of my
information could be deemed a “sale” of information. I authorize Highmark Health’s disclosure of my
information in connection with Program activities even if such disclosure constitutes a “sale” under
applicable law.
This Authorization will remain in effect until I revoke it by notifying Highmark Health in writing. I
understand that I may revoke this Authorization at any time by sending an email to
highmarkplanITsupport@highmark.com indicating my intent to revoke, whereafter my account
credentials will be removed from the digital tool. I understand that my revocation will not apply to any
information collected, used, or disclosed by Highmark Health in reliance upon my prior authorization.
I understand that I am not required to provide my authorization in order to receive healthcare
services or insurance benefits. I also acknowledge that I am entitled to a copy of this Authorization
upon request.
 If I choose to revoke this Authorization, I understand that my interactions and experience with
Highmark Health may no longer be customized to my unique preferences as when I was participating in
the Program. 
`;

const detail_map = {
  MainUseSummary: ['SharePHI', 'MainUseSummaryDetail1'],
  MainUseSummaryDetail1: ['SharePHI', 'MainUseSummaryDetail2'],
  MainUseSummaryDetail2: ['SharePHI', 'MainUseSummaryDetail3'],
  MainUseSummaryDetail3: ['SharePHI', 'SharePHI'],
  SharePHI: ['PlanSponsor', 'SharePHIDetail1'],
  SharePHIDetail1: ['PlanSponsor', 'SharePHIDetail2'],
  SharePHIDetail2: ['PlanSponsor', 'PlanSponsor'],
  PlanSponsor: ['PublicHealth', 'PlanSponsorDetail1'],
  PlanSponsorDetail1: ['PublicHealth', 'PublicHealth'],
  PublicHealth: ['Oversight', 'PublicHealthDetail1'],
  PublicHealthDetail1: ['Oversight', 'Oversight'],
  Oversight: ['PrivacyRightsSummary', 'OversightDetail1'],
  OversightDetail1: ['PrivacyRightsSummary', 'PrivacyRightsSummary'],
  // LegalProceedings: ['LawEnforcementOfficials', 'LegalProceedingsDetail1'],
  // LegalProceedingsDetail1: [
  //   'LawEnforcementOfficials',
  //   'LawEnforcementOfficials',
  // ],
  // LawEnforcementOfficials: ['Agencies', 'LawEnforcementOfficialsDetail1'],
  // LawEnforcementOfficialsDetail1: ['Agencies', 'Agencies'],
  // Agencies: ['Research', 'AgenciesDetail1'],
  // AgenciesDetail1: ['Research', 'Research'],
  // Research: ['PreventThreat', 'ResearchDetail1'],
  // ResearchDetail1: ['PreventThreat', 'PreventThreat'],
  // PreventThreat: ['NationSecurity', 'PreventThreatDetail1'],
  // PreventThreatDetail1: ['NationSecurity', 'NationSecurity'],
  // NationSecurity: ['Inmates', 'NationSecurityDetail1'],
  // NationSecurityDetail1: ['Inmates', 'Inmates'],
  // Inmates: ['WorkersCompensation', 'InmatesDetail1'],
  // InmatesDetail1: ['WorkersCompensation', 'WorkersCompensation'],
  // WorkersCompensation: ['Others', 'WorkersCompensationDetail1'],
  // WorkersCompensationDetail1: ['Others', 'Others'],
  // Others: ['Underwriting', 'OthersDetail1'],
  // OthersDetail1: ['Underwriting', 'Underwriting'],
  // Underwriting: ['PrivacyRightsSummary', 'UnderwritingDetail1'],
  // UnderwritingDetail1: ['PrivacyRightsSummary', 'PrivacyRightsSummary'],
  PrivacyRightsSummary: ['allDone', 'PrivacyRightsQuestion1Summary'],
  PrivacyRightsQuestion1Summary: [
    'PrivacyRightsQuestion2Summary',
    'PrivacyRightsQuestion1Detail1',
  ],
  PrivacyRightsQuestion1Detail1: [
    'PrivacyRightsQuestion2Summary',
    'PrivacyRightsQuestion1Detail2',
  ],
  PrivacyRightsQuestion1Detail2: [
    'PrivacyRightsQuestion2Summary',
    'PrivacyRightsQuestion1Detail3',
  ],
  PrivacyRightsQuestion1Detail3: [
    'PrivacyRightsQuestion2Summary',
    'PrivacyRightsQuestion2Summary',
  ],
  PrivacyRightsQuestion2Summary: [
    'PrivacyRightsQuestion3Summary',
    'PrivacyRightsQuestion2Detail1',
  ],
  PrivacyRightsQuestion2Detail1: [
    'PrivacyRightsQuestion3Summary',
    'PrivacyRightsQuestion2Detail2',
  ],
  PrivacyRightsQuestion2Detail2: [
    'PrivacyRightsQuestion3Summary',
    'PrivacyRightsQuestion2Detail3',
  ],
  PrivacyRightsQuestion2Detail3: [
    'PrivacyRightsQuestion3Summary',
    'PrivacyRightsQuestion2Detail4',
  ],
  PrivacyRightsQuestion2Detail4: [
    'PrivacyRightsQuestion3Summary',
    'PrivacyRightsQuestion3Summary',
  ],
  PrivacyRightsQuestion3Summary: [
    'PrivacyRightsQuestion4Summary',
    'PrivacyRightsQuestion3Detail1',
  ],
  PrivacyRightsQuestion3Detail1: [
    'PrivacyRightsQuestion4Summary',
    'PrivacyRightsQuestion3Detail2',
  ],
  PrivacyRightsQuestion3Detail2: [
    'PrivacyRightsQuestion4Summary',
    'PrivacyRightsQuestion3Detail3',
  ],
  PrivacyRightsQuestion3Detail3: [
    'PrivacyRightsQuestion4Summary',
    'PrivacyRightsQuestion4Summary',
  ],
  PrivacyRightsQuestion4Summary: [
    'PrivacyRightsQuestion5Summary',
    'PrivacyRightsQuestion4Detail1',
  ],
  PrivacyRightsQuestion4Detail1: [
    'PrivacyRightsQuestion5Summary',
    'PrivacyRightsQuestion4Detail2',
  ],
  PrivacyRightsQuestion4Detail2: [
    'PrivacyRightsQuestion5Summary',
    'PrivacyRightsQuestion5Summary',
  ],
  PrivacyRightsQuestion5Summary: ['allDone', 'PrivacyRightsQuestion5Detail1'],
  PrivacyRightsQuestion5Detail1: ['allDone', 'PrivacyRightsQuestion5Detail2'],
  PrivacyRightsQuestion5Detail2: ['allDone', 'PrivacyRightsQuestion5Detail3'],
  PrivacyRightsQuestion5Detail3: ['allDone', 'PrivacyRightsQuestion5Detail4'],
  PrivacyRightsQuestion5Detail4: ['allDone', 'allDone'],
};

const question_map = {
  PrivacyRightsSummary:
    'You have rights with respect to your protected health information. If you want more details, please say more details, or say yes to skip. ',
  MainUseSummaryDetail1:
    'PHI is your individually identifiable health information, including demographic information, collected from you or created or received by a health care provider, a health plan, your employer, or a healthcare clearinghouse. ',
  MainUseSummaryDetail2:
    'We may use or disclose your protected health information to pay claims from doctors, hospitals, pharmacies and others for services delivered to you that are covered by your health plan, to determine your eligibility for benefits, to coordinate benefits, to examine medical necessity, to obtain premiums, or to issue explanations of benefits or payments to the person who subscribes to the health plan in which you participate. ',
  MainUseSummaryDetail3:
    'We may use or disclose your protected health information to rate our risk and determine the premium for your health plan, to conduct quality assessment and improvement activities, to credential health care providers, to engage in care coordination or case management, or to manage our business. ',
  SharePHI:
    'We may use and disclose protected health information to other covered entities, business associates, or other individuals who assist us in administering our programs and delivering services to our members. ',
  SharePHIDetail1:
    'In connection with our payment and health care operations activities, we contract with business associates to perform various functions on our behalf or to provide certain types of services (such as member service support, utilization management, subrogation, or pharmacy benefit management). To perform these functions or to provide the services, business associates will receive, create, maintain, use, or disclose protected health information, but only after we require the business associates to agree in writing to contract terms designed to appropriately safeguard your information. If you need to know more about what other covered entities, please answer more details. ',
  SharePHIDetail2:
    'we may use or disclose your protected health information to assist health care providers in connection with their treatment or payment activities, or to assist other covered entities in connection with certain of their health care operations. For example, we may disclose your protected health information to a health care provider when needed by the provider to render treatment to you, and we may disclose protected health information to another covered entity to conduct health care operations in the areas of quality assurance and improvement activities, or accreditation, certification, licensing or credentialing. ',
  PlanSponsor:
    'We may use and disclose protected health information to Plan Sponsors. ',
  PlanSponsorDetail1:
    'A plan sponsor may contact us regarding a member’s question, concern, issue regarding claim, benefits, service, coverage, etc. We may also disclose summary health information about the enrollees in your group health plan to the plan sponsor to obtain premium bids for the health insurance coverage offered through your group health plan or to decide whether to modify, amend or terminate your group health plan. ',
  PublicHealth:
    'We may use and disclose protected health information for public health activities that are permitted or required by law. ',
  PublicHealthDetail1:
    'For example, we may use or disclose information for the purpose of preventing or controlling disease, injury, or disability. ',
  Oversight:
    'We may use and disclose protected health information to a health oversight agency for activities authorized by law. ',
  OversightDetail1:
    'A health oversight agency for activities authorized by law includes  audits; investigations; inspections; licensure or disciplinary actions; or civil, administrative, or criminal proceedings or actions. Oversight agencies seeking this information include government agencies that oversee: (i) the health care system; (ii) government benefit programs; (iii)other government regulatory programs; and (iv) compliance with civil rights laws. ',
  LegalProceedings:
    'Can we use and disclose protected health information for legal proceedings? ',
  LegalProceedingsDetail1:
    'We may disclose your protected health information: (1) in the course of any judicial or administrative proceeding; (2) in response to an order of a court or administrative tribunal (to the extent such disclosure is expressly authorized); and (3) in response to a subpoena, a discovery request, or other lawful process, once we have met all administrative requirements of the HIPAA Privacy Rule. For example, we may disclose your protected health information in response to a subpoena for such information. ',
  LawEnforcementOfficials:
    'Can we use and disclose protected health information to law enforcement officials?',
  LawEnforcementOfficialsDetail1:
    'For example, some of the reasons for such a disclosure may include, but not be limited to: (1) it is required by law or some other legal process; or (2) it is necessary to locate or identify a suspect, fugitive, material witness, or missing person. ',
  Agencies:
    'Can we use and disclose protected health information to Coroners, Medical Examiners, Funeral Directors, and Organ Donation?',
  AgenciesDetail1:
    'We may disclose protected health information to a coroner or medical examiner for purposes of identifying a deceased person, determining a cause of death, or for the coroner or medical examiner to perform other duties authorized by law. We also may disclose, as authorized by law, information to funeral directors so that they may carry out their duties. Further, we may disclose protected health information to organizations that handle organ, eye, or tissue donation and transplantation. ',
  Research:
    'Can we use and disclose protected health information for research?',
  ResearchDetail1:
    'We may disclose your protected health information to researchers when an institutional review board or privacy board has: (1) reviewed the research proposal and established protocols to ensure the privacy of the information; and (2) approved the research. ',
  PreventThreat:
    'Can we use and disclose protected health information to Prevent a Serious Threat to Health or Safety?',
  PreventThreatDetail1:
    'Consistent with applicable federal and state laws, we may disclose your protected health information if we believe that the disclosure is necessary to prevent or lessen a serious and imminent threat to the health or safety of a person or the public. ',
  NationSecurity:
    'Can we use and disclose protected health information to Military Activity and National Security, Protective Services?',
  NationSecurityDetail1:
    'Under certain conditions, we may disclose your protected health information if you are, or were, Armed Forces personnel for activities deemed necessary by appropriate military command authorities. If you are a member of foreign military service, we may disclose, in certain circumstances, your information to the foreign military authority. We also may disclose your protected health information to authorized federal officials for conducting national security and intelligence activities, and for the protection of the President, other authorized persons, or heads of state. ',
  Inmates:
    'Can we use and disclose protected health information from  Inmates?',
  InmatesDetail1:
    'If you are an inmate of a correctional institution, we may disclose your protected health information to the correctional institution or to a law enforcement official for: (1) the institution to provide health care to you; (2) your health and safety and the health and safety of others; or (3) the safety and security of the correctional institution. ',
  WorkersCompensation:
    'Can we use and disclose protected health information to Workers’ Compensation?',
  WorkersCompensationDetail1:
    'We may disclose your protected health information to comply with workers’ compensation laws and other similar programs that provide benefits for work-related injuries or illnesses. ',
  Others:
    'Can we use and disclose protected health information to Others Involved in Your Health Care?',
  OthersDetail1:
    'Unless you object, we may disclose your protected health information to a friend or family member that you have identified as being involved in your health care. We also may disclose your information to an entity assisting in a disaster relief effort so that your family can be notified about your condition, status, and location. If you are not present or able to agree to these disclosures of your protected health information, then we may, using our professional judgment, determine whether the disclosure is in your best interest. ',
  Underwriting:
    'Can we use and disclose protected health information for Underwriting?',
  UnderwritingDetail1:
    'We may disclose your protected health information for underwriting purposes; however, we are prohibited from using or disclosing your genetic information for these purposes. ',

  PrivacyRightsQuestion1Summary: 'You have the right to access your PHI. ',

  PrivacyRightsQuestion1Detail1:
    'You have the right to look at or get copies of your protected health information.  we will provide the information in a readable electronic format as mutually agreed upon. You have two ways to get the copy. ',

  PrivacyRightsQuestion1Detail2:
    'To get the copy, you may obtain a form to request access by using the contact information. You may also request access by sending us a letter to the address. The contact information and address are listed on our website. It may cost to make a request. ',

  PrivacyRightsQuestion1Detail3:
    'The first request within a 12-month period will be free. If you request access to your designated record set more than once in a 12-month period, we may charge you a reasonable, cost-based fee for responding to these additional requests. ',

  PrivacyRightsQuestion2Summary:
    'You have the right to an accounting of certain disclosures to your protected health information. ',

  PrivacyRightsQuestion2Detail1:
    'You have a right to an accounting of certain disclosures of your protected health information that are for reasons other than treatment, payment or health care operations. ',

  PrivacyRightsQuestion2Detail2:
    'An accounting will include the date(s) of the disclosure, to whom we made the disclosure, a brief description of the information disclosed, and the purpose for the disclosure. You have two ways to make a request. ',

  PrivacyRightsQuestion2Detail3:
    'You may request an accounting by contacting us at the Customer Service phone number on the back of your identification card, or submitting your request in writing to the Highmark Privacy Department. The address is listed on our website. It may cost to make a request. ',

  PrivacyRightsQuestion2Detail4:
    'The first request within a 12-month period will be free. If you request access to your designated record set more than once in a 12-month period, we may charge you a reasonable, cost-based fee for responding to these additional requests. ',

  PrivacyRightsQuestion3Summary:
    'You have the right to request a restriction. ',

  PrivacyRightsQuestion3Detail1:
    'You have the right to request a restriction on the protected health information we use or disclose about you for treatment, payment or health care operations. There are some requirements in the request. ',

  PrivacyRightsQuestion3Detail2:
    'In your request tell us: the information whose disclosure you want to limit; and how you want to limit our use and/ or disclosure of the information. We may not agree with the request. ',

  PrivacyRightsQuestion3Detail3:
    'We are not required to agree to these additional restrictions, but if we do, we will abide by our agreement unless the information is needed to provide emergency treatment to you. ',

  PrivacyRightsQuestion4Summary:
    'You have the right to request confidential communications. ',

  PrivacyRightsQuestion4Detail1:
    'If you believe that a disclosure of all or part of your protected health information may endanger you, you have the right to request that we communicate with you in confidence about your protected health information by alternative means or to an alternative location. There are some requirements in the request. ',

  PrivacyRightsQuestion4Detail2:
    'You must make your request in writing, and you must state that the information could endanger you if it is not communicated in confidence by the alternative means or to the alternative location you want. ',

  PrivacyRightsQuestion5Summary: 'You have the right to request an amendment. ',

  PrivacyRightsQuestion5Detail1:
    'If you believe that your protected health information is incorrect or incomplete, you have the right to request that we amend your protected health information. There are some requirements in the request. ',

  PrivacyRightsQuestion5Detail2:
    'Your request must be in writing, and it must explain why the information should be amended. And we may deny your request. ',

  PrivacyRightsQuestion5Detail3:
    'We may deny your request if we did not create the information you want amended or for certain other reasons. If we deny your request, we will provide you a written explanation. ',

  PrivacyRightsQuestion5Detail4:
    'If we accept your request to amend the information, we will make reasonable efforts to inform others, including people you name, of the amendment and to include the changes in any future disclosures of that information. ',

  allDone: 'All Done! Have fun using our products. ',
};

const REPROMPT_PRIVACY_CONFIGURE_MESSAGE =
  'Before you use our assistant, you need to agree to our privacy policies and configure your privacy preference. To do that, please say: privacy consent. ';

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
    let repromptOutput = requestAttributes.t('FOLLOW_UP_MESSAGE');
    let say = '';
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
  },
};

const MainUseDisclosure = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      !isAccountNotLinked(handlerInput) &&
      request.intent.name === 'PrivacyConsentIntent' //  TODO
    );
  },
  handle(handlerInput) {
    const say =
      'We will show you servel privacy-related statements. ' +
      'First, we may collect, use and disclose protected health information for certain of our activities, including payment and health care operations to administer our health benefit program effectively. '; //  TODO
    const repromptText = 'Answer yes or more details. ';
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.skillState = 'MainUseSummary';
    attributes.isConfiguring = true;
    handlerInput.attributesManager.setSessionAttributes(attributes);
    return handlerInput.responseBuilder
      .speak(say + repromptText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const DescribeSettings = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    return (
      !isAccountNotLinked(handlerInput) &&
      request.intent.name === 'PrivacySettingsIntent' //  TODO
    );
  },
  handle(handlerInput) {
    const say =
      'According to your privacy settings, we will use and disclose your PHI for payment and health care operations, to other covered entities, plan sponsors, public health activities and health oversight agencies. ';
    const repromptText = "What's your next request?";
    return handlerInput.responseBuilder
      .speak(say)
      .reprompt(repromptText)
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
      !isAccountNotLinked(handlerInput) &&
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
    let repromptText = 'Answer yes, or more details. ';
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
          "I'm sorry, but you need to answer yes for the policy to use our product. ";
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
      repromptText = 'Answer yes to listen to the next question. ';
    }
    handlerInput.attributesManager.setSessionAttributes(attributes);
    say = question_map[attributes.skillState];
    if (attributes.skillState === 'allDone') {
      attributes.isConfiguring = false;
      handlerInput.attributesManager.setSessionAttributes(attributes);
      repromptText = "What's your next request? ";
    } else if (attributes.skillState === 'PrivacyRightsSummary') {
      repromptText = '';
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
    return (
      !attributes.agreedPolicy &&
      (request.intent.name === 'AgreeIntent' ||
        request.intent.name === 'DisagreeIntent')
    );
  },
  handle(handlerInput) {
    const option = handlerInput.requestEnvelope.request.intent.name;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    //let currentState = attributes.skillState;
    let repromptText = "What's your next request? ";
    let say = '';
    if (option === 'AgreeIntent') {
      attributes.agreedPolicy = true;
      handlerInput.attributesManager.setSessionAttributes(attributes);
      say =
        'You have agreed our digital privacy policy. Have fun using the product. ';
      return handlerInput.responseBuilder
        .speak(say + repromptText)
        .reprompt(repromptText)
        .getResponse();
    } else {
      say =
        'You did not agree to our digital privacy policy. For now, you can not use the product. ';
      return handlerInput.responseBuilder.speak(say).getResponse();
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
        'You have not agreed our digital privacy policy, so we can not proceed your request. ';
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
        'You have not agreed our digital privacy policy, so we can not proceed your request. ';
    }
    return handlerInput.responseBuilder
      .speak(say + repromptText)
      .reprompt(repromptText)
      .getResponse();
  },
};

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
    sessionAttributes.agreedPolicy = false;
    sessionAttributes.deductibleAllowed = false;
    sessionAttributes.primaryDoctorAllowed = false;
    let repromptOutput =
      'Please read the policy I send to your mobile app. After reading it, answer I agree or I disagree to continue. ';
    // const { isConfiguring } = sessionAttributes;
    // if (typeof isConfiguring === 'undefined') {
    //   repromptOutput = REPROMPT_PRIVACY_CONFIGURE_MESSAGE;
    // }
    const speakOutput =
      requestAttributes.t(
        'GREETING_MESSAGE',
        sessionAttributes.firstName ? sessionAttributes.firstName : 'there'
      ) + repromptOutput;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .withSimpleCard(
        'Highmark Health Digital Privacy Policy',
        PRE_LOGIN_PRIVACY_POLICY
      )
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
  const accessToken =
    handlerInput.requestEnvelope.context.System.user.accessToken;
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
    DescribeSettings,
    AgreeHandler,
    FallBackHandler,
    CopayHandler,
    MedicalcareHandler,
    revokePersonalSettingsHandler,
    PrimaryDoctorHandler
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
