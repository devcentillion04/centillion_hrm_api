const CONSTANTS = {
  ROLE: {
    SUPER_USER: "SUPER_USER",
    DEVELOPER: "DEVELOPER",
    ADMIN: "ADMIN",
  },
  STATUS_CODE: {
    SUCCESS: 200,
    FAILED: 400,
    UNAUTHORIZED: 401,
  },
  RESPONSE_MESSAGE: {
    INVALIDOBJECTID: "ID IS INVALID",
    FAILEDRESPONSE: "failed",
    HEADER: {
      CREATESUCCESS: "Header created successfully",
      CREATEFAILED: "Header createing failed",
      UPDATESUCCESS: "Header update successfully",
      UPDATEFAILED: "Header updateing failed",
      GETSUCCESS: "Header get successfully",
      GETFAILED: "Header is not avalible",
      DELETESUCCESS: "Header delete successfully",
      DELETEFAILED: "Header deletion failed",
    },

    FEATURE: {
      CREATESUCCESS: "features created successfully",
      CREATEFAILED: "features createing failed",
      UPDATESUCCESS: "features update successfully",
      UPDATEFAILED: "features updating failed",
      GETSUCCESS: "features get successfully",
      GETFAILED: "features is not avalible",
      DELETESUCCESS: "features delete successfully",
      DELETEFAILED: "features deletion failed",
      NOTFEATURES: "Some fearures not avalible",
    },
    PRICING: {
      CREATESUCCESS: "Website Pricing created successfully",
      CREATEFAILED: "Website Pricing createing failed",
      UPDATESUCCESS: "Website Pricing update successfully",
      UPDATEFailed: "Website Pricing updating failed",
      GETSUCCESS: "Website Pricing get successfully",
      GETFAILED: "Website Pricing is not avalible",
      DELETESUCCESS: "Website Pricing delete successfully",
      DELETEFAILED: "Website Pricing deletion failed",
      NOTPRICING: "website pricing is not avalible",
    },
    TESTIMONIAL: {
      CREATESUCCESS: "Testimonial created successfully",
      CREATEFAILED: "Testimonial createing failed",
      UPDATESUCCESS: "Testimonial update successfully",
      UPDATEFAILED: "Testimonial updating failed",
      GETSUCCESS: "Testimonial get successfully",
      GETFAILED: "Testimonial is not avalible",
      DELETESUCCESS: "Testimonial delete successfully",
      DELETEFAILED: "Testimonial deletion failed",
      NOTTESTIMONIAL: "Testimonial is not avalible",
    },
    FAQ: {
      CREATESUCCESS: "faqs created successfully",
      CREATEFAILED: "faqs createing failed",
      UPDATESUCCESS: "faqs update successfully",
      UPDATEFAILED: "faqs updating failed",
      GETSUCCESS: "faqs get successfully",
      GETFAILED: "faqs is not avalible",
      DELETESUCCESS: "faqs delete successfully",
      DELETEFAILED: "faqs deletion failed",
      NOTFAQ: "faqs is not avalible",
    },
    CALLBACK: {
      CREATESUCCESS: "callbacks created successfully",
      CREATEFAILED: "callbacks createing failed",
      UPDATESUCCESS: "callbacks update successfully",
      UPDATEFAILED: "callbacks updating failed",
      GETSUCCESS: "callbacks get successfully",
      GETFAILED: "callbacks is not avalible",
      DELETESUCCESS: "callbacks delete successfully",
      DELETEFAILED: "callbacks deletion failed",
      NOTFAQ: "callbacks is not avalible",
    },
    FOOTER: {
      CREATESUCCESS: "Footer created successfully",
      CREATEFAILED: "Footer createing failed",
      UPDATESUCCESS: "Footer update successfully",
      UPDATEFAILED: "Footer updateing failed",
      GETSUCCESS: "Footer get successfully",
      GETFAILED: "Footer is not avalible",
      DELETESUCCESS: "Footer delete successfully",
      DELETEFAILED: "Footer deletion failed",
    },
    ABOUT: {
      CREATESUCCESS: "About created successfully",
      CREATEFAILED: "About createing failed",
      UPDATESUCCESS: "About update successfully",
      UPDATEFAILED: "About updateing failed",
      GETSUCCESS: "About get successfully",
      GETFAILED: "About is not avalible",
      DELETESUCCESS: "About delete successfully",
      DELETEFAILED: "About deletion failed",
      NOTABOUT: "About us content is not avalible",
    },
    PERMISSIONS: {
      CREATESUCCESS: "Permissions created successfully",
      CREATEFAILED: "Permissions createing failed",
      UPDATESUCCESS: "Permissions update successfully",
      UPDATEFAILED: "Permissions updateing failed",
      GETSUCCESS: "Permissions get successfully",
      GETFAILED: "Permissions is not avalible",
      DELETESUCCESS: "Permissions delete successfully",
      DELETEFAILED: "Permissions deletion failed",
      NOTPERMISSIONS: "Permissions is not avalible",
      ALREADYAVALIABLE: "Permissions is already available",
    },
    ROLE: {
      CREATESUCCESS: "Role created successfully",
      CREATEFAILED: "Role createing failed",
      UPDATESUCCESS: "Role update successfully",
      UPDATEFAILED: "Role updateing failed",
      GETSUCCESS: "Role get successfully",
      GETFAILED: "Role is not avalible",
      DELETESUCCESS: "Role delete successfully",
      DELETEFAILED: "Role deletion failed",
      NOTROLE: "Role is not avalible",
      USERAVAILABLE:
        "Many user has avalible with this role. please remove user from the role and then after deletion",
    },
    ADMINUSER: {
      CREATESUCCESS: "Admin user created successfully",
      CREATEFAILED: "Admin user createing failed",
      UPDATESUCCESS: "Admin user update successfully",
      UPDATEFAILED: "Admin user updateing failed",
      GETSUCCESS: "Admin user get successfully",
      GETFAILED: "Admin user is not avalible",
      DELETESUCCESS: "Admin user delete successfully",
      DELETEFAILED: "Admin user deletion failed",
      NOTADMINUSER: "Admin user is not avalible",
      USERAVAILABLE: "Admin user is already registered",
      USERNOTAVAILABLE: "Admin user is not avalible",
      LOGINSUSSPEND: "user is susspending",
      PASSWORDCHANGED: "Password is changed successfully",
      PASSWORDNOTCHANGED: "Password is not changed",
    },
    AUTHMIDDLEWARE: {
      UNAUTHORIZED: "You can not access this resource",
      TOKENNOTFOUND: "Access denied. No token provided",
      TOKENINVALID: "Invalid Token",
      USERDISABLE: "User disabled",
      USERNOTFOUND: "No User Found With That Token",
      SESSIONEXPIRY: "Session ended",
    },
    MAILLOGS: {
      GETSUCCESS: "Mail Logs get successfully",
      GETFAILED: "Mail Logs is not avalible",
      DELETESUCCESS: "Mail Logs delete successfully",
      DELETEFAILED: "Mail Logs deletion failed",
    },
    TERMSCONDITION: {
      CREATESUCCESS: "Terms &amp; Conditions created successfully",
      CREATEFAILED: "Terms &amp; Conditions createing failed",
      UPDATESUCCESS: "Terms &amp; Conditions update successfully",
      UPDATEFAILED: "Terms &amp; Conditions updateing failed",
      GETSUCCESS: "Terms &amp; Conditions get successfully",
      GETFAILED: "Terms &amp; Conditions is not avalible",
      DELETESUCCESS: "Terms &amp; Conditions delete successfully",
      DELETEFAILED: "Terms &amp; Conditions deletion failed",
    },
    PRIVACYPOLICY: {
      CREATESUCCESS: "Privacy Policy created successfully",
      CREATEFAILED: "Privacy Policy createing failed",
      UPDATESUCCESS: "Privacy Policy update successfully",
      UPDATEFAILED: "Privacy Policy updateing failed",
      GETSUCCESS: "Privacy Policy get successfully",
      GETFAILED: "Privacy Policy is not avalible",
      DELETESUCCESS: "Privacy Policy delete successfully",
      DELETEFAILED: "Privacy Policy deletion failed",
    },
    SUPPORTTICKET: {
      CREATESUCCESS: "Support ticket created successfully",
      CREATEFAILED: "Support ticket createing failed",
      UPDATESUCCESS: "Support ticket update successfully",
      UPDATEFAILED: "Support ticket updateing failed",
      GETSUCCESS: "Support ticket get successfully",
      GETFAILED: "Support ticket is not avalible",
      DELETESUCCESS: "Support ticket delete successfully",
      DELETEFAILED: "Support ticket deletion failed",
    },
    NOTIFICATIONTYPE: {
      CREATESUCCESS: "NotificationType created successfully",
      CREATEFAILED: "NotificationType createing failed",
      UPDATESUCCESS: "NotificationType update successfully",
      UPDATEFAILED: "NotificationType updateing failed",
      GETSUCCESS: "NotificationType get successfully",
      GETFAILED: "NotificationType is not avalible",
      DELETESUCCESS: "NotificationType delete successfully",
      DELETEFAILED: "NotificationType deletion failed",
      ALREADYAVALIABLE: "NotificationType already available",
    },
    NOTIFICATION: {
      UPDATESUCCESS: "Notification Read successfully",
      UPDATEFAILED: "Notification Read failed",
      GETSUCCESS: "Notification  get successfully",
      GETFAILED: "Notification is not avalible",
    },
    APP: {
      CREATESUCCESS: "App created successfully",
      CREATEFAILED: "App createing failed",
      UPDATESUCCESS: "App update successfully",
      UPDATEFAILED: "App updateing failed",
      GETSUCCESS: "App get successfully",
      GETFAILED: "App is not avalible",
      DELETESUCCESS: "App delete successfully",
      DELETEFAILED: "App deletion failed",
      ALREADYAVALIABLE: "App already available",
      NOTAVALIABLE: "App is not available",
      RESTORESUCCESS: "App is restore successfully",
      RESTOREFAILED: "App is  not restored",
    },
    MAINSERVICE: {
      CREATESUCCESS: "Main Service created successfully",
      CREATEFAILED: "Main Service createing failed",
      UPDATESUCCESS: "Main Service update successfully",
      UPDATEFAILED: "Main Service updateing failed",
      GETSUCCESS: "Main Service get successfully",
      GETFAILED: "Main Service is not avalible",
      DELETESUCCESS: "Main Service delete successfully",
      DELETEFAILED: "Main Service deletion failed",
      ALREADYAVALIABLE: "Main Service already available",
      NOTAVALIABLE: "Main Service is not available",
      RESTORESUCCESS: "Main Service is restore successfully",
      RESTOREFAILED: "Main Service is  not restored",
    },
    SUBSERVICE: {
      CREATESUCCESS: "Sub Service created successfully",
      CREATEFAILED: "Sub Service createing failed",
      UPDATESUCCESS: "Sub Service update successfully",
      UPDATEFAILED: "Sub Service updateing failed",
      GETSUCCESS: "Sub Service get successfully",
      GETFAILED: "Sub Service is not avalible",
      DELETESUCCESS: "Sub Service delete successfully",
      DELETEFAILED: "Sub Service deletion failed",
      ALREADYAVALIABLE: "Sub Service already available",
      NOTAVALIABLE: "Sub Service is not available",
      RESTORESUCCESS: "Sub Service is restore successfully",
      RESTOREFAILED: "Sub Service is  not restored",
    },
    PRODUCTBACK: {
      CREATESUCCESS: "Product created successfully",
      CREATEFAILED: "Product createing failed",
      UPDATESUCCESS: "Product update successfully",
      UPDATEFAILED: "Product updateing failed",
      GETSUCCESS: "Product get successfully",
      GETFAILED: "Product is not avalible",
      DELETESUCCESS: "Product delete successfully",
      DELETEFAILED: "Product deletion failed",
      ALREADYAVALIABLE: "Product already available",
      NOTAVALIABLE: "Product is not available",
      RESTORESUCCESS: "Product is restore successfully",
      RESTOREFAILED: "Product is  not restored",
    },
    ORDER: {
      CREATESUCCESS: "Order created successfully",
      CREATEFAILED: "Order createing failed",
      UPDATESUCCESS: "Order update successfully",
      UPDATEFAILED: "Order updateing failed",
      GETSUCCESS: "Order get successfully",
      GETFAILED: "Order is not avalible",
      DELETESUCCESS: "Order delete successfully",
      DELETEFAILED: "Order deletion failed",
      ALREADYAVALIABLE: "Order already available",
      NOTAVALIABLE: "Order is not available",
      RESTORESUCCESS: "Order is restore successfully",
      RESTOREFAILED: "Order is  not restored",
    },
    PAYMENT: {
      UPDATESUCCESS: "Payment update successfully",
      UPDATEFAILED: "Payment updateing failed",
      GETSUCCESS: "Payment get successfully",
      GETFAILED: "Payment is not avalible",
      ALREADYAVALIABLE: "Payment already available with order",
      NOTAVALIABLE: "Payment is not available",
    },
    DASHBOARD: {
      GETSUCCESS: "Dashbord details get successfully",
      GETFAILED: "Dashbord details is not avalible",
    },
    SALLONEOWNER: {
      CREATESUCCESS: "Sallone Owner created successfully",
      CREATEFAILED: "Sallone Owner createing failed",
      UPDATESUCCESS: "Sallone Owner update successfully",
      UPDATEFAILED: "Sallone Owner updateing failed",
      GETSUCCESS: "Sallone Owner get successfully",
      GETFAILED: "Sallone Owner is not avalible",
      DELETESUCCESS: "Sallone Owner delete successfully",
      DELETEFAILED: "Sallone Owner deletion failed",
      ALREADYAVALIABLE: "Sallone Owner already available",
      NOTAVALIABLE: "Sallone Owner is not available",
      RESTORESUCCESS: "Sallone Owner is restore successfully",
      RESTOREFAILED: "Sallone Owner is  not restored",
    },
    SALLONEEMPLOYEE: {
      CREATESUCCESS: "Sallone Employee created successfully",
      CREATEFAILED: "Sallone Employee createing failed",
      UPDATESUCCESS: "Sallone Employee update successfully",
      UPDATEFAILED: "Sallone Employee updateing failed",
      GETSUCCESS: "Sallone Employee get successfully",
      GETFAILED: "Sallone Employee is not avalible",
      DELETESUCCESS: "Sallone Employee delete successfully",
      DELETEFAILED: "Sallone Employee deletion failed",
      ALREADYAVALIABLE: "Sallone Employee already available",
      NOTAVALIABLE: "Sallone Employee is not available",
      RESTORESUCCESS: "Sallone Employee is restore successfully",
      RESTOREFAILED: "Sallone Employee is  not restored",
    },
    EMPLOYEESERVICE: {
      CREATESUCCESS: "Sallone Employee Service created successfully",
      CREATEFAILED: "Sallone Employee Service createing failed",
      UPDATESUCCESS: "Sallone Employee Service update successfully",
      UPDATEFAILED: "Sallone Employee Service updateing failed",
      GETSUCCESS: "Sallone Employee Service get successfully",
      GETFAILED: "Sallone Employee Service is not avalible",
      DELETESUCCESS: "Sallone Employee Service delete successfully",
      DELETEFAILED: "Sallone Employee Service deletion failed",
      ALREADYAVALIABLE: "Sallone Employee Service already available",
      NOTAVALIABLE: "Sallone Employee Service is not available",
      RESTORESUCCESS: "Sallone Employee Service is restore successfully",
      RESTOREFAILED: "Sallone Employee Service is  not restored",
    },
  },
  MAILSUBJECT: {
    REGISTERMAIL: "Sallon Application Registration",
    FORGETPASSWORDEMAIL: "Sallon Application Forget Password",
  },
};

module.exports = {
  CONSTANTS,
};
