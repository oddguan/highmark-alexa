exports.detail_map = {
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

exports.question_map = {
  PrivacyRightsSummary:
    'You have rights with respect to your protected health information. If you want more details, please say more details, or say okay to skip. ',
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
