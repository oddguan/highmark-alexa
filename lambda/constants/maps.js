exports.detail_map = {
  AuthPHI: ['AuthBusiness', 'AuthPHIDetail1'],
  AuthPHIDetail1: ['AuthBusiness', 'AuthPHIDetail2'],
  AuthPHIDetail2: ['AuthBusiness', 'AuthBusiness'],
  AuthBusiness: ['AuthThirdParty', 'AuthBusinessDetail1'],
  AuthBusinessDetail1: ['AuthThirdParty', 'AuthBusinessDetail2'],
  AuthBusinessDetail2: ['AuthThirdParty', 'AuthThirdParty'],
  AuthThirdParty: ['allDone', 'AuthThirdPartyDetail1'],
  AuthThirdPartyDetail1: ['allDone', 'AuthThirdPartyDetail2'],
  AuthThirdPartyDetail2: ['allDone', 'allDone'],

  BasicInfo: ['SecurePortal', 'BasicInfoDetail1'],
  BasicInfoDetail1: ['SecurePortal', 'BasicInfoDetail2'],
  BasicInfoDetail2: ['SecurePortal', 'SecurePortal'],
  SecurePortal: ['InteractiveChat', 'SecurePortalDetail1'],
  SecurePortalDetail1: ['InteractiveChat', 'SecurePortalDetail2'],
  SecurePortalDetail2: ['InteractiveChat', 'SecurePortalDetail3'],
  SecurePortalDetail3: ['InteractiveChat', 'InteractiveChat'],
  InteractiveChat: ['allDone', 'InteractiveChatDetail1'],
  InteractiveChatDetail1: ['allDone', 'InteractiveChatDetail2'],
  InteractiveChatDetail2: ['allDone', 'allDone'],
};

exports.question_map = {
  AuthPHI:
    'Can we collect Highmark Health disclose you PHI, including but not limited to information maintained in my health plan’s member portal such as policy number, co-pay, co-insurance, and deductible information, dates of service, and claims information, and any information you freely share through the two-way chatbot interface? ',
  AuthPHIDetail1:
    'To offer this personalized experience, Highmark Health must collect, use, and disclose personal information across our digital tools and channels. This information can include, among other things, demographics such as your name and date of birth, contact information such as phone number, address, and email address, details about receipt of healthcare services such as dates of service and medical conditions and procedures, details about your insurance benefits such as policy number and claims, and information about your activities on our digital tools and channels such as internet protocol address, device identifier, and cookie ID. By studying the ways in which you navigate through our digital tools and channels, we can continuously improve and optimize the information and programs that match your needs and interests to deliver the right information at the right time throughout your healthcare experience. ',
  AuthPHIDetail2:
    'If you have any more questions, please call our customer service at 1-800-241-5704 with your member ID handy. ',
  AuthBusiness:
    'Can Highmark Health disclose your PHI to its business partners, including but not limited to Google, for purposes of supporting the Program? This Authorization will remain in effect until you revoke it by notifying Highmark Health in writing as specified herein. ',
  AuthBusinessDetail1:
    'Highmark Health is collaborating with companies including Google on digital improvement projects supporting the Program. Our collaborations allow us to offer capabilities such as real-time chat sessions where users can ask questions on our member portal like “have I met my deductible this year” and similar inquiries. These projects require that Highmark Health share your Personal Information with its business partners (like Google) for product and solution development, testing, and refinement purposes. ',
  AuthBusinessDetail2:
    'If you have any more questions, please call our customer service at 1-800-241-5704 with your member ID handy. ',
  AuthThirdParty:
    'Can Highmark Health share your information with these third parties when they may not subject to certain federal and/or state privacy and security laws and regulations in the same manner, or to the same degree, as Highmark Health? ',
  AuthThirdPartyDetail1:
    'Highmark Health recognizes that its business partners may not be subject to the same range of federal and/or state laws governing the collection, use, and disclosure of Personal Information. Nevertheless, we have taken a number of steps to ensure that your information is handled responsibly, such as by maintaining a rigorous internal privacy and data ethics program, negotiating restrictive contract terms with third party service providers, and seeking to obtain your affirmative authorization, as applicable. ',
  AuthThirdPartyDetail2:
    'If you have any more questions, please call our customer service at 1-800-241-5704 with your member ID handy. ',
  BasicInfo:
    'Can Highmark Health collect your basic information via online forms? ',
  BasicInfoDetail1:
    'Highmark Health invites users to contact us using inquiry forms available on our corporate-owned platforms for account questions or to learn more about our products and services. The personal information we request on inquiry forms generally includes your name, address, phone number, email address, and the details of your inquiry. We may use such information to review and respond to your request or communication, or use contracted service providers to do that for us. ',
  BasicInfoDetail2:
    'If you have more questions about this Online Privacy Policy, or concerns regarding your personal information, please contact us by emailing privacy@highmarkhealth.org or calling 1-866-228-9424. ',
  SecurePortal:
    'Can Highmark Health collect your secure portals? ',
  SecurePortalDetail:
    'Highmark Health has established secure portals for use by members and patients. When you access them to review your health and benefit-related information or to contact your health plan or physician’s office regarding certain inquiries, such as reviewing claims or requesting prescription refills, we collect certain personal information, such as your user ID and password, IP address, click streams, and cookie ID. ',
  SecurePortalDetail2:
    'Communications sent by or to members or patients who choose to use these secure portals may also be recorded in transaction logs to monitor content, compliance with applicable law and regulations, or functionality of the services. If the information collected is deemed to be PHI as noted above, its use and disclosure will be subject to HIPAA and an applicable NPP. ',
  SecurePortalDetail3:
    'If you have more questions about this Online Privacy Policy, or concerns regarding your personal information, please contact us by emailing privacy@highmarkhealth.org or calling 1-866-228-9424. ',
  InteractiveChat:
    'Can Highmark Health collect your information via interactive chat? ',
  InteractiveChatDetail1:
    'Our consumer platforms may offer interactive chat technology to assist users. That interactive technology may collect personal information such as name, date of birth, address, and account number for authentication purposes or to provide specific plan benefit details in a personalized response. It may also capture session-related information such as web logs to document the interaction. If the information collected is deemed to be PHI as noted above, its use and disclosure will be subject to HIPAA and an applicable NPP. ',
  InteractiveChatDetail2:
    'If you have more questions about this Online Privacy Policy, or concerns regarding your personal information, please contact us by emailing privacy@highmarkhealth.org or calling 1-866-228-9424. ',

  // PrivacyRightsSummary:
  //   'You have rights with respect to your protected health information. If you want more details, please say more details, or say okay to skip. ',
  // MainUseSummaryDetail1:
  //   'PHI is your individually identifiable health information, including demographic information, collected from you or created or received by a health care provider, a health plan, your employer, or a healthcare clearinghouse. ',
  // MainUseSummaryDetail2:
  //   'We may use or disclose your protected health information to pay claims from doctors, hospitals, pharmacies and others for services delivered to you that are covered by your health plan, to determine your eligibility for benefits, to coordinate benefits, to examine medical necessity, to obtain premiums, or to issue explanations of benefits or payments to the person who subscribes to the health plan in which you participate. ',
  // MainUseSummaryDetail3:
  //   'We may use or disclose your protected health information to rate our risk and determine the premium for your health plan, to conduct quality assessment and improvement activities, to credential health care providers, to engage in care coordination or case management, or to manage our business. ',
  // SharePHI:
  //   'We may use and disclose protected health information to other covered entities, business associates, or other individuals who assist us in administering our programs and delivering services to our members. ',
  // SharePHIDetail1:
  //   'In connection with our payment and health care operations activities, we contract with business associates to perform various functions on our behalf or to provide certain types of services (such as member service support, utilization management, subrogation, or pharmacy benefit management). To perform these functions or to provide the services, business associates will receive, create, maintain, use, or disclose protected health information, but only after we require the business associates to agree in writing to contract terms designed to appropriately safeguard your information. If you need to know more about what other covered entities, please answer more details. ',
  // SharePHIDetail2:
  //   'we may use or disclose your protected health information to assist health care providers in connection with their treatment or payment activities, or to assist other covered entities in connection with certain of their health care operations. For example, we may disclose your protected health information to a health care provider when needed by the provider to render treatment to you, and we may disclose protected health information to another covered entity to conduct health care operations in the areas of quality assurance and improvement activities, or accreditation, certification, licensing or credentialing. ',
  // PlanSponsor:
  //   'We may use and disclose protected health information to Plan Sponsors. ',
  // PlanSponsorDetail1:
  //   'A plan sponsor may contact us regarding a member’s question, concern, issue regarding claim, benefits, service, coverage, etc. We may also disclose summary health information about the enrollees in your group health plan to the plan sponsor to obtain premium bids for the health insurance coverage offered through your group health plan or to decide whether to modify, amend or terminate your group health plan. ',
  // PublicHealth:
  //   'We may use and disclose protected health information for public health activities that are permitted or required by law. ',
  // PublicHealthDetail1:
  //   'For example, we may use or disclose information for the purpose of preventing or controlling disease, injury, or disability. ',
  // Oversight:
  //   'We may use and disclose protected health information to a health oversight agency for activities authorized by law. ',
  // OversightDetail1:
  //   'A health oversight agency for activities authorized by law includes  audits; investigations; inspections; licensure or disciplinary actions; or civil, administrative, or criminal proceedings or actions. Oversight agencies seeking this information include government agencies that oversee: (i) the health care system; (ii) government benefit programs; (iii)other government regulatory programs; and (iv) compliance with civil rights laws. ',
  // LegalProceedings:
  //   'Can we use and disclose protected health information for legal proceedings? ',
  // LegalProceedingsDetail1:
  //   'We may disclose your protected health information: (1) in the course of any judicial or administrative proceeding; (2) in response to an order of a court or administrative tribunal (to the extent such disclosure is expressly authorized); and (3) in response to a subpoena, a discovery request, or other lawful process, once we have met all administrative requirements of the HIPAA Privacy Rule. For example, we may disclose your protected health information in response to a subpoena for such information. ',
  // LawEnforcementOfficials:
  //   'Can we use and disclose protected health information to law enforcement officials?',
  // LawEnforcementOfficialsDetail1:
  //   'For example, some of the reasons for such a disclosure may include, but not be limited to: (1) it is required by law or some other legal process; or (2) it is necessary to locate or identify a suspect, fugitive, material witness, or missing person. ',
  // Agencies:
  //   'Can we use and disclose protected health information to Coroners, Medical Examiners, Funeral Directors, and Organ Donation?',
  // AgenciesDetail1:
  //   'We may disclose protected health information to a coroner or medical examiner for purposes of identifying a deceased person, determining a cause of death, or for the coroner or medical examiner to perform other duties authorized by law. We also may disclose, as authorized by law, information to funeral directors so that they may carry out their duties. Further, we may disclose protected health information to organizations that handle organ, eye, or tissue donation and transplantation. ',
  // Research:
  //   'Can we use and disclose protected health information for research?',
  // ResearchDetail1:
  //   'We may disclose your protected health information to researchers when an institutional review board or privacy board has: (1) reviewed the research proposal and established protocols to ensure the privacy of the information; and (2) approved the research. ',
  // PreventThreat:
  //   'Can we use and disclose protected health information to Prevent a Serious Threat to Health or Safety?',
  // PreventThreatDetail1:
  //   'Consistent with applicable federal and state laws, we may disclose your protected health information if we believe that the disclosure is necessary to prevent or lessen a serious and imminent threat to the health or safety of a person or the public. ',
  // NationSecurity:
  //   'Can we use and disclose protected health information to Military Activity and National Security, Protective Services?',
  // NationSecurityDetail1:
  //   'Under certain conditions, we may disclose your protected health information if you are, or were, Armed Forces personnel for activities deemed necessary by appropriate military command authorities. If you are a member of foreign military service, we may disclose, in certain circumstances, your information to the foreign military authority. We also may disclose your protected health information to authorized federal officials for conducting national security and intelligence activities, and for the protection of the President, other authorized persons, or heads of state. ',
  // Inmates:
  //   'Can we use and disclose protected health information from  Inmates?',
  // InmatesDetail1:
  //   'If you are an inmate of a correctional institution, we may disclose your protected health information to the correctional institution or to a law enforcement official for: (1) the institution to provide health care to you; (2) your health and safety and the health and safety of others; or (3) the safety and security of the correctional institution. ',
  // WorkersCompensation:
  //   'Can we use and disclose protected health information to Workers’ Compensation?',
  // WorkersCompensationDetail1:
  //   'We may disclose your protected health information to comply with workers’ compensation laws and other similar programs that provide benefits for work-related injuries or illnesses. ',
  // Others:
  //   'Can we use and disclose protected health information to Others Involved in Your Health Care?',
  // OthersDetail1:
  //   'Unless you object, we may disclose your protected health information to a friend or family member that you have identified as being involved in your health care. We also may disclose your information to an entity assisting in a disaster relief effort so that your family can be notified about your condition, status, and location. If you are not present or able to agree to these disclosures of your protected health information, then we may, using our professional judgment, determine whether the disclosure is in your best interest. ',
  // Underwriting:
  //   'Can we use and disclose protected health information for Underwriting?',
  // UnderwritingDetail1:
  //   'We may disclose your protected health information for underwriting purposes; however, we are prohibited from using or disclosing your genetic information for these purposes. ',

  // PrivacyRightsQuestion1Summary: 'You have the right to access your PHI. ',

  // PrivacyRightsQuestion1Detail1:
  //   'You have the right to look at or get copies of your protected health information.  we will provide the information in a readable electronic format as mutually agreed upon. You have two ways to get the copy. ',

  // PrivacyRightsQuestion1Detail2:
  //   'To get the copy, you may obtain a form to request access by using the contact information. You may also request access by sending us a letter to the address. The contact information and address are listed on our website. It may cost to make a request. ',

  // PrivacyRightsQuestion1Detail3:
  //   'The first request within a 12-month period will be free. If you request access to your designated record set more than once in a 12-month period, we may charge you a reasonable, cost-based fee for responding to these additional requests. ',

  // PrivacyRightsQuestion2Summary:
  //   'You have the right to an accounting of certain disclosures to your protected health information. ',

  // PrivacyRightsQuestion2Detail1:
  //   'You have a right to an accounting of certain disclosures of your protected health information that are for reasons other than treatment, payment or health care operations. ',

  // PrivacyRightsQuestion2Detail2:
  //   'An accounting will include the date(s) of the disclosure, to whom we made the disclosure, a brief description of the information disclosed, and the purpose for the disclosure. You have two ways to make a request. ',

  // PrivacyRightsQuestion2Detail3:
  //   'You may request an accounting by contacting us at the Customer Service phone number on the back of your identification card, or submitting your request in writing to the Highmark Privacy Department. The address is listed on our website. It may cost to make a request. ',

  // PrivacyRightsQuestion2Detail4:
  //   'The first request within a 12-month period will be free. If you request access to your designated record set more than once in a 12-month period, we may charge you a reasonable, cost-based fee for responding to these additional requests. ',

  // PrivacyRightsQuestion3Summary:
  //   'You have the right to request a restriction. ',

  // PrivacyRightsQuestion3Detail1:
  //   'You have the right to request a restriction on the protected health information we use or disclose about you for treatment, payment or health care operations. There are some requirements in the request. ',

  // PrivacyRightsQuestion3Detail2:
  //   'In your request tell us: the information whose disclosure you want to limit; and how you want to limit our use and/ or disclosure of the information. We may not agree with the request. ',

  // PrivacyRightsQuestion3Detail3:
  //   'We are not required to agree to these additional restrictions, but if we do, we will abide by our agreement unless the information is needed to provide emergency treatment to you. ',

  // PrivacyRightsQuestion4Summary:
  //   'You have the right to request confidential communications. ',

  // PrivacyRightsQuestion4Detail1:
  //   'If you believe that a disclosure of all or part of your protected health information may endanger you, you have the right to request that we communicate with you in confidence about your protected health information by alternative means or to an alternative location. There are some requirements in the request. ',

  // PrivacyRightsQuestion4Detail2:
  //   'You must make your request in writing, and you must state that the information could endanger you if it is not communicated in confidence by the alternative means or to the alternative location you want. ',

  // PrivacyRightsQuestion5Summary: 'You have the right to request an amendment. ',

  // PrivacyRightsQuestion5Detail1:
  //   'If you believe that your protected health information is incorrect or incomplete, you have the right to request that we amend your protected health information. There are some requirements in the request. ',

  // PrivacyRightsQuestion5Detail2:
  //   'Your request must be in writing, and it must explain why the information should be amended. And we may deny your request. ',

  // PrivacyRightsQuestion5Detail3:
  //   'We may deny your request if we did not create the information you want amended or for certain other reasons. If we deny your request, we will provide you a written explanation. ',

  // PrivacyRightsQuestion5Detail4:
  //   'If we accept your request to amend the information, we will make reasonable efforts to inform others, including people you name, of the amendment and to include the changes in any future disclosures of that information. ',

  allDone: 'All Done! Have fun using our products. ',
};
