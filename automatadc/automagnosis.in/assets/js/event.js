
function sendEventLogs (eventName, extra = {}) {
  let patientId = null;
  let phonenumber = null;
  let user;
  try {
      user = JSON.parse(localStorage.getItem("user"));
      patientId = user.id;
  } catch(e) {

  }
  let source = localStorage.getItem("utm_source") || "mWeb";
  let payload = {
      event: eventName,
      source: source,
      patientId: patientId,
      screen: window.location.hash.substring(1) || "homePage"
  }
  payload = {...payload, ...extra};
  console.log("SENDING EVENT -> ", payload);

  // clevertap event
  if(window.location.hostname != "localhost" && window.location.hostname != "testweb.docsapp.in"){
    if(user){
      phonenumber = user.mobile || user.phonenumber
    }
    if(patientId && phonenumber){
      try{
        let clevertapProfile = {
          "Name": user.name ? user.name : "", // User's name
          "Phone": "+91"+ phonenumber,
          "Identity": patientId,
          "Gender": user.gender ? (user.gender == 'Male' || user.gender == 'M' ? 'M' : (user.gender == 'Female' || user.gender == 'F' ? 'F' : 'Others')) : null,
        }
        if(!clevertapProfile.Gender) {
          delete clevertapProfile.Gender;
        }
        clevertap.profile.push({
          "Site": clevertapProfile
        });
      }catch(err){
        console.log(err);
      }
    }
    clevertap.event.push("Mweb_"+ eventName, payload);
  }

  $.ajax({
    type: "POST",
    url: "/patientswebapp/v2/event/logs/capture",
    data: JSON.stringify(payload),
    dataType: "json",
    contentType: 'application/json',
    success: function (resp) {

    },
    error: function (err) {}
  });
}

// function sendEventLogsNew (eventName,extra = {}) {
//   console.log('isnide here',eventName)
//     let patientId = null;
//     let phonenumber = null;
//     let user;
//     try{

//       user = JSON.parse(localStorage.getItem("user"));
//       patientId = user && user.id;
//       phonenumber = user && user.mobile || user && user.phonenumber

//       let payload = {
//         event: eventName,
//         source: 'doctorInWeb',
//         patientId,
//         mbUserId : localStorage.getItem('mbUserId') || '',
//         pmEntityId : localStorage.getItem('corporateID') || '1018900',
//         uuid : localStorage.getItem('auth_uuid')
//       }

//       if(patientId && phonenumber){
//         try{
//           let clevertapProfile = {
//             "Name": user.name ? user.name : "", // User's name
//             "Phone": "+91"+ phonenumber,
//             "Identity": patientId,
//             "Gender": user.gender ? (user.gender == 'Male' || user.gender == 'M' ? 'M' : (user.gender == 'Female' || user.gender == 'F' ? 'F' : 'Others')) : null,
//           }
//           if(!clevertapProfile.Gender) {
//             delete clevertapProfile.Gender;
//           }
//           clevertap.profile.push({
//             "Site": clevertapProfile
//           });
//         }catch(err){
//           console.log(err);
//         }
//       }
//       clevertap.event.push(eventName, payload);
//     }catch(e){

//     }

//   $.ajax({
//     type: "POST",
//     url: "/patientswebapp/v2/event/logs/capture",
//     data: JSON.stringify(payload),
//     dataType: "json",
//     contentType: 'application/json',
//     success: function (resp) {

//     },
//     error: function (err) {}
//   });
// }

function sendEventLogsCorporate (eventName, extra = {}, callback) {
  let patientId = null;
  let source = localStorage.getItem("utm_source") || "mWeb";
  let infoObj = {
    "EntityID": extra.EntityID ? extra.EntityID : null,
    "EmployeeID": extra.EmployeeID ? extra.EmployeeID : null,
    "CorporateName": extra.corporateName ? extra.corporateName : null,
    "phonenumber": extra.phonenumber ? extra.phonenumber : null
  }
  let payload = {
    event: eventName,
    source: JSON.stringify(infoObj),
    patientId: extra.employeeId,
    screen: window.location.hash.substring(1) || "homePage"
  }
  payload = {...payload};
  console.log("SENDING EVENT -> ", payload);
  $.ajax({
    type: "POST",
    url: "/patientswebapp/v2/event/logs/capture",
    data: JSON.stringify(payload),
    dataType: "json",
    contentType: 'application/json',
    success: function (resp) {
      callback && callback();
    },
    error: function (err) {
      // console.log("error -evennt corp ->", err);
    }
  });
}

function sendEventLogsRedshift(eventName, extra={}){
  try{
    const user = JSON.parse(localStorage.getItem("user" || "{}"));
    const session = JSON.parse(localStorage.getItem("branch_session_first"));
    const accessToken = localStorage.getItem("accesstoken");
    var obj = {
      eventtype: eventName,
      consultationId: extra.consultationId || '',
      screen: extra.screen,
      element: '',
      info: accessToken ? 'Corporate Flow': '',
      domain: 'Patient',
      appversion: '',
      id: user ? user.id: '',
      meta: extra.details,
      sessionId: session ? session.session_id: '',
      doctorId: '',
      event: eventName
  }
  }catch(e){
    console.log(e);
    return;
  }
  if(window.location.hostname != "localhost" && window.location.hostname != "doctortestv1.medibuddy.in"){
    console.log('SENDING EVENT');
    return new Promise(function(resolve, reject) {
          $.ajax({
            dataType: "json",
            type: 'POST',
            data: obj,
            url: 'https://eventlogs.docsapp.in/event',
            success: function (result) {
              if(eventName === "DocMBWebDAU")
                  localStorage.setItem("DAULogged", new Date().toJSON().slice(0,10).replace(/-/g,'/'));
              resolve('EventLogs Write Successful');
            },
            error: function (result) {
                reject('EventLogs Write Failed')
            }
        });
    });
}else
  return;
}
// var HOC = (function(eventName, extra) {
//   var executed = false;
//   console.log('insde hoc',executed);
//   return async function(eventName, extra) {
//       if (!executed) {
//         console.log('insde hoc if',executed);
//           executed = true;
//           let data = await sendCustomLoginEvent(eventName, extra);
//           console.log('data',data);
//       }
//   };
// })();

// function func(eventName, extra){
//   console.log('in func',eventName, extra);
// }

function sendCustomLoginEvent(eventName, extra={}){
  try{
    const user = JSON.parse(localStorage.getItem("user" || "{}"));
    const session = JSON.parse(localStorage.getItem("branch_session_first"));
    let source = extra.isOrganic ? 'DAMBWeb': localStorage.getItem("utm_source");
    if(source == 'medibuddyapp'){
      source = 'DAMBWeb';
    }
    const pmEntityId = JSON.parse(localStorage.getItem("corporateID" || "{}"));
    let browserfingerprintId = '';
    var userAgent = window.navigator.userAgent.toLowerCase()
    var operatingSystem = "web"
    if(userAgent.indexOf("android") > -1)
      operatingSystem = "Android"
    else if (/iphone|ipod|ipad/.test(userAgent))
      operatingSystem = "iOS"
    // browserfingerprintId = window.sessionStorage && window.sessionStorage.branch_session && JSON.parse(window.sessionStorage.branch_session).browser_fingerprint_id;
    // browserfingerprintId = browserfingerprintId ? browserfingerprintId : session.browser_fingerprint_id
    if(window.location.hostname === "doctor.medibuddy.in"){
      return new Promise(async function(resolve, reject) {
      if(user && user.id){
        try {
          branch.getBrowserFingerprintId(function(err, data) {
            if(err)
              console.log("error: ", err);
            else
              browserfingerprintId = data;
            let custom_data = {
              appVersion: "",
              patientId: user.id,
              medibuddyUserId: extra.mediBuddyUserId ? extra.mediBuddyUserId: '',
              browser_fingerprint_id: browserfingerprintId ? browserfingerprintId: "",
              pmEntityId: pmEntityId? pmEntityId: "1018900",
              source: source ? source: "DAMBWeb",
              meta: extra.details ? extra.details: "" ,
              sessionId: session ? session.session_id: '',
              type: extra.type? extra.type : "",
              platform: "DAMBWeb",
              os: operatingSystem
          };
            console.log("SENDING PROD Branch EVENT -> ", custom_data);
            branch.logEvent(
              eventName,
              custom_data,
              function(err, data) {
                if(err){
                  reject(err)
                }else{
                  resolve(data);
                }
              }
            );

          })
        } catch(err) {
          console.log("Error fetching browser_fingerprint_id: ", err)
          reject(e);
        }
      }else{
        reject('Patient ID not present');
      }
    })
  }}catch(e){
    return e;
  }
}

function sendEventToBranch(eventName, extra = {}) {
  try{
    const user = JSON.parse(localStorage.getItem("user" || "{}")) || '';
    const session = JSON.parse(localStorage.getItem("branch_session_first"));
    let source = extra.isOrganic ? 'DAMBWeb': localStorage.getItem("utm_source");
    if(source == 'medibuddyapp'){
      source = 'DAMBWeb';
    }
    const pmEntityId = JSON.parse(localStorage.getItem("corporateID" || "{}")) || '';
    let browserfingerprintId = '';
    // if(window.location.hostname === "doctor.medibuddy.in"){
      return new Promise(async function(resolve, reject) {
        try {
          branch.getBrowserFingerprintId(function(err, data) {
            if(err)
              console.log("error: ", err);
            else
              browserfingerprintId = data;
            let custom_data = {
              appVersion: "",
              patientId: user.id ? user.id : '',
              medibuddyUserId: extra.mediBuddyUserId ? extra.mediBuddyUserId: '',
              browser_fingerprint_id: browserfingerprintId ? browserfingerprintId: "",
              pmEntityId: pmEntityId? pmEntityId: "1018900",
              source: source ? source: "DAMBWeb",
              meta: extra.details ? extra.details: "" ,
              sessionId: session ? session.session_id: '',
              type: extra.type? extra.type : "",
              platform: "DAMBWeb"
            };
            console.log("SENDING PROD Branch EVENT -> ", custom_data);
            branch.logEvent(
              eventName,
              custom_data,
              function(err, data) {
                if(err){
                  reject(err)
                }else{
                  resolve(data);
                }
              }
            );
          })
        } catch(err) {
          console.log("Error fetching browser_fingerprint_id: ", err)
          reject(err);
        }
    })
  // }
  }catch(e){
    console.log(e)
    return e;
  }
}

function sendCustomLandingData(eventName, extra={}){
  try{
    const session = JSON.parse(localStorage.getItem("branch_session_first"));
    let source = extra.isOrganic ? 'DAMBWeb': localStorage.getItem("utm_source");
    console.log('sourceeee',source);
    if(source == 'medibuddyapp'){
      source = 'DAMBWeb'
    }
    if(window.location.hostname === "doctor.medibuddy.in"){
      return new Promise(async function(resolve, reject) {
        let custom_data = {
          appVersion: "",
          patientId: '',
          medibuddyUserId: '',
          pmEntityId: '',
          meta: extra.details ? extra.details : "",
          source: source ? source : "DAMBWeb",
          sessionId: session ? session.session_id: '',
          platform: "DAMBWeb"
      };
      console.log("SENDING PROD Branch EVENT -> ", custom_data);
      try{
        branch.logEvent(
          eventName,
          custom_data,
          function(err, data) {
            if(err){
              reject(err)
            }else{
              console.log('data',data);
              resolve(data);
            }
          }
        );
      }catch(e){
        console.log('Branch error');
        reject(e);
      }
    })
  }}catch(e){
    return e;
  }
}

function fetchUUID(){
  try{
    const user = JSON.parse(localStorage.getItem("user" || "{}"));
    if(window.location.hostname === "doctor.medibuddy.in"){
      return new Promise(function(resolve, reject) {
      if(user && user.id){
        let obj = {
          patientId: user ? user.id: ''
        }
        $.ajax({
          dataType: "json",
          type: 'POST',
          data: JSON.stringify(obj),
          contentType: 'application/json',
          url: '/patientswebapp/webhook/getIdentity',
          success: function (result) {
            console.log(result);
            resolve(result)
          },
          error: function (result) {
              console.log(result);
              reject(result);
          }
        });
      }else{
        reject("Patient ID not present")
      }
    })
  }}
  catch(e){
    console.log(e);
    return e;
  }
}

function fetchUUIDCorporate(medibuddyUserId){
  try{
    const user = JSON.parse(localStorage.getItem("user" || "{}"));
    const token = localStorage.getItem('accesstoken')
    if(window.location.hostname === "doctor.medibuddy.in"){
      return new Promise(function(resolve, reject) {
        if(user && user.id && token && medibuddyUserId){
          $.ajax({
            type: 'POST',
            url: '/patientswebapp/webhook/getIdentity',
            headers: {
              "mbservertoken": token,
            },
            data: {
              medibuddyUserId: medibuddyUserId,
              patientId: user.id
            },
            withCredentials: true,
            success: function (result) {
              console.log(result);
              resolve(result)
            },
            error: function (result) {
                console.log(result);
                reject(result);
            }
          });
        }else{
          reject("Patient Details not present")
        }})
  }}catch(e){
    console.log(e);
    return e;
  }
}

function setIdentity(identityObj){
    if(window.location.hostname === "doctor.medibuddy.in"){
      try{
        return new Promise(function(resolve, reject) {
        if(identityObj && identityObj.identity)
        {
            const identity_id = identityObj.identity;
              branch.setIdentity(
                identity_id,
                function(err, data) {
                  if(err){
                    resolve(err);
                  }else{
                    resolve(data);
                  }
                }
              );
        }
        else{
          reject("UUID not present!")
        }
        setTimeout(resolve, 2000);
      })
    }catch(e){
      return e
    }
}}
