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
  SecurePortalDetail1:
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
  allDone: 'All Done! Have fun using our products. ',
};
