var urlParams = {},
  jioHealthParams ={},
  useragent = {},
  userId,
  version = "v2.0.0",
  ip,
  config,
  phonePe,
  appendUrl = '',
  node_url = window.location.origin,
  fkPlatform;

// let PP_ID = 'DOCSAPPTEST';
/*
    Page re-direct functions: url will be the relative path to navigate
*/

/* function getQueryParams() {
  var params = (new URL(document.location)).searchParams;
  var name = params.get("utm_source");
  return name;
}

function checkPhonepe(data) {
  if(data == 'phonePe'){
    newQuery = location.search;
    newHash = location.hash;
    appendUrl = newQuery + newHash;
  } else {
    appendUrl = '';
  }
} */

function redirect(url) {
  window.location.href = url;
  window.open(url, "_self");
}

// modal functions
let closeModal = (modal) => {
  $('#'+modal).modal('close');
}

/*
*
*
*/
function sanitize(data) {
  data.consults = data.consults.filter(function(c) {
    return c.archive != true && c.reassign != 1;
  });
  let buff = [];
  data.consults.forEach(c => {
    buff.push(c.id);
  });

  data.questions.forEach(q => {
    if (buff.indexOf(parseInt(q.consultationId)) >= 0) {
      q.isActive = true;
    } else {
      q.isActive = false;
    }
  });
  data.questions = data.questions.filter(function(q) {
    return q.isActive == true;
  });
  setSyncData(data);
}

function DeltaSync (id) {
  var payload = {};
  payload = {
    id: id+'',
    lastSyncTime: 0,
    domain: "Patient",
    zip: true,
    req_source: "home"
  }
  $.ajax({
    type: "POST",
    url: `${node_url}/patientswebapp/content/lastSyncTimeForWeb?s=${payload['req_source']}`,
    data: JSON.stringify(payload),
    crossDomain: true,
    success: function (response) {
      sanitize(response);
      appendUrl = localStorage.getItem('phoneQuery');
      appendUrl ? (window.location.href = `${window.location.origin}/main.html${appendUrl}`) : (window.location.href = window.location.origin + "/main.html#askDoctor");
    },
    error: function (error) {
      console.error(error);
    },
    contentType: "application/json",
  });
};

function setSyncData(dump) {
  localStorage.setItem("syncData", JSON.stringify(dump));
}

function getRule(callback) {
  $.get("/patientswebapp/vendor/rule/"+localStorage.getItem("utm_source"), data => {
    if(data){
        localStorage.setItem("rule", JSON.stringify(data));
    }
    callback && callback();
  })
}

/*
*
*
 */
// Saving geolocation data
var geolocation = JSON.stringify(navigator.geolocation);

/*
    Transform query params into JSON format data
 */
function getJsonFromUrl() {
  var query = location.search.substr(1);
  query.split("&").forEach(function (part) {
    var item = part.split("=");
    urlParams[item[0]] = decodeURIComponent(item[1]);
  });
}

/*
    Transforming query params data into Form Encoded data to be sent to api end-point.
*/
function getformurlencoded3(meta) {
  var jsonData = "";
  var delimiter = "";
  for (var key in meta) {
    if (meta.hasOwnProperty(key)) {
      jsonData += delimiter + encodeURIComponent(key) + "=" + encodeURIComponent(meta[key]);
      delimiter = "&";
    }
  };
  return jsonData;
}

/*
    It is never invoked
 */
function redirectToLogin() {
  if(window.location.pathname == "/newdesign.html"){

  } else {
    if (window.location.pathname != '/') {
      redirect('/');
    }
  }
}

/*
    Main page re-direction
*/
function redirectToDashboard() {
  if (window.location.pathname == '/') {
    var params = getformurlencoded3(urlParams);
    params = (params.length > 0) ? '?' + params : params;
    redirect('/main.html#askDoctor');
  }
}

/*
    getting device info
 */
function parseUserAgent() {
  ua = navigator.userAgent;
  var parser = new UAParser();
  useragent.ua = ua;
  useragent.browser = parser.getBrowser().name;
  useragent.device = parser.getDevice();
  useragent.os = parser.getOS();
}

/*
    Success notification to SASTA_SUNDAR guys
*/
function postToSasta(eventname, mobileno) {
  return new Promise((resolve, reject) => {
    $.post("https://wellnessapi.sastasundar.com:89/healthservice/updatedocsappstatus", {
      mobileno,
      eventname
    }, function (response) {
      console.log(response);
      resolve(response);
    });
  });
}

/*
  new mWEB code
*/
window.version = localStorage.lpv
localStorage.removeItem("src")


var ButtonExpand = function (domNode) {

  this.domNode = domNode;

  this.keyCode = Object.freeze({
    'RETURN': 13
  });
};

ButtonExpand.prototype.init = function () {

  this.controlledNode = false;

  var id = this.domNode.getAttribute('aria-controls');

  if (id) {
    this.controlledNode = document.getElementById(id);
  }

  this.domNode.setAttribute('aria-expanded', 'false');
  this.hideContent();

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));

};

ButtonExpand.prototype.showContent = function () {

  if (this.controlledNode) {
    this.controlledNode.style.display = 'block';
  }

};

ButtonExpand.prototype.hideContent = function () {

  if (this.controlledNode) {
    this.controlledNode.style.display = 'none';
  }

};

ButtonExpand.prototype.toggleExpand = function () {
  if (this.domNode.getAttribute('aria-expanded') === 'true') {
    this.domNode.setAttribute('aria-expanded', 'false');
    this.hideContent();
  } else {
    this.domNode.setAttribute('aria-expanded', 'true');
    this.showContent();
  }

};

ButtonExpand.prototype.handleKeydown = function (event) {

  console.log('[keydown]');

  switch (event.keyCode) {

    case this.keyCode.RETURN:

      this.toggleExpand();

      event.stopPropagation();
      event.preventDefault();
      break;

    default:
      break;
  }

};


ButtonExpand.prototype.handleClick = function (event) {
  if ($(event.target).closest('button').find('.material-icons').html() == 'add') {
    $(event.target).closest('button').find('.material-icons').html('remove');
    $('html, body').animate({
      scrollTop: $(event.target).closest('dt').next("dd").offset().top - 80
    }, 500);
  } else {
    $(event.target).closest('button').find('.material-icons').html('add')
  }
  this.toggleExpand();

};

ButtonExpand.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
};

ButtonExpand.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
};

/* Initialize Hide/Show Buttons */

window.addEventListener('load', function (event) {

  var buttons = document.querySelectorAll('button[aria-expanded][aria-controls]');

  for (var i = 0; i < buttons.length; i++) {
    var be = new ButtonExpand(buttons[i]);
    be.init();
  }

}, false);

function removeSlideUp() {
  $(".slideUp").animate({
    bottom: '-100vh'
  })
  $(".slideDown").animate({
    top: '-100vh'
  })
  $('.overlay').fadeOut();
  // $('#mobNum').focus()
}

function removeInputSlideUp() {
  $(".inputSlideUp").animate({
    bottom: '-100vh',
    'min-height': '460px'
  })
  $(".slideDown").animate({
    top: '-100vh'
  })
  $('.overlay').fadeOut();
  $("#cntnr1").find(".greenTxt").removeClass('hasText');
  $("#cntnr1").find(".greenTxt").html("")
  $("#cntnr1").find("p").html("")

}

var parseQueryString = function () {
  var urlParams = {};
  var url = window.location.href;
  url.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function ($0, $1, $2, $3) {
    urlParams[$1] = $3;
  });

  return urlParams;
}

var parseQueryStringUrl = function (url) {
  var urlParams = {};
  url.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function ($0, $1, $2, $3) {
    urlParams[$1] = $3;
  });

  return urlParams;
}

var deptStr = ""
var deptObj = {}

var pageSource = "docsappMWeb";

if (parseQueryString()['utm_source']) {
  pageSource = parseQueryString()['utm_source']
}

/*
  PhonePe platform functions
*/

function showSplashLoader() {
  $('.splashLoader').removeClass('hide');
  $('.container').addClass('hide');
}

function hideSplashLoader() {
  $('.splashLoader').addClass('hide');
  $('.container').removeClass('hide');
}

function showGpayLoader() {
  $('.splashLoader').removeClass('hide');
  $('.container').addClass('hide');
  $('.header-top').css('background-image', 'none');
}

function hideGpayLoader() {
  $('.splashLoader').addClass('hide');
  $('.container').removeClass('hide');
  $('.container').show();
  $('.header-top').css('background-image', 'linear-gradient(179deg, #0099EF 27%, white 96%)');
  $('.footer-mob').removeClass('hide');
  $('.footer-mob').show();
}

function getPhoneAccessToken() {
    setPhonePeLocalStorage();
    PhonePe.PhonePe.build(PhonePe.Constants.Species.web)
    .then(function(sdk) {
      window.sdk = sdk;
      fetchToken(sdk);
    });
}

function setPhonePeLocalStorage() {
  localStorage.setItem('utm_source', 'phonePe');
}

function fetchToken(sdk) {
  sdk.fetchGrantToken()
  .then((res) => {
    if(res){
      console.log(`grant token data received =`  + res);
      fetchPhonePeUserDetails(res);
    }else {
      hideSplashLoader();
      showLoginScreen();
    }
  })
  .catch((e) => {
    console.log(`Error occured while fetching the grant token`, e)
    hideSplashLoader();
    phonePeLogin();
  })
}
function phonePeLogin() {
  var query = localStorage.getItem('phoneQuery'),
    utm_source = localStorage.getItem('utm_source');
  if(query) {
    window.location.href = `/${query}`;
  }

  if(utm_source) {
    window.location.href = '/';
  }

}


function fetchPhonePeUserDetails(token){
  $.ajax({
    type: "POST",
    url: node_url + "/patientswebapp/patientweb/phonePeAccess",
    data: JSON.stringify(token),
    contentType: "application/json",
    success: function (response) {
      if(response['success']){
        fakeOtpforPhonePe(response);
      }
    },
    error: function (error) {
      console.error(error);
      hideSplashLoader();
      showLoginScreen();
    }
  });
}

function createPhonePeSession(data) {
  $.ajax({
    type: "POST",
    url: node_url + "/patientswebapp/patientweb/phonePeSession",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (resp) {
      if (resp.success == 1) {
        if(resp['data']){
          localStorage.setItem("user", JSON.stringify(resp['data']));
        }
        postEvent({
          eventName: "phonePeSessionCreated",
          details: {
            advertiserId: resp['data']['id'],
            tempId: resp['data']['id'],
            patientId: resp['data']['id']
          }
        });

        localStorage.setItem('entryPoint', window.btoa(window.location.href));

        if(localStorage.getItem('phoneQuery')){
          DeltaSync(JSON.parse(localStorage.getItem("user"))['id']);
        }else {
          getRule(() => {
            let redirectUrl = localStorage.getItem("location");
            localStorage.removeItem('location');
            if(redirectUrl){
              window.location.href = window.location.origin + "/main.html#"+redirectUrl
            }else {
              window.location.href = window.location.origin + "/main.html#home";
            }
            // (window.location.href = window.location.origin + "/main.html#home");
          })
        }
      }
    },
    error: function (error) {
      alert(error);
      hideSplashLoader();
      showLoginScreen();
    }
  });
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
    return this;
}

let showLoader = () => {
    $("#center").center();
    $("#loader-init").show();
}

let hideLoader = () => {
    $("#loader-init").hide();
}

$(document).ready(function () {
  getJsonFromUrl();
  if( urlParams['utm_source'] && urlParams['utm_source'] == 'gpay'){
    showSplashLoader();
  } else {
    hideGpayLoader();
  }
  parseUserAgent();
  if(getRedirectRule().btnText){
    $("#mainbtn").text(getRedirectRule().btnText)
  }

  if( urlParams && urlParams['utm_term'] ){
    localStorage.setItem('aff_clickId', urlParams['utm_term']);
  } else {
    if(localStorage.getItem('aff_clickId')){
      localStorage.removeItem('aff_clickId');
    }
  }

  // gpay modal initialization
  $('.gpay-modal').modal({
    inDuration: 300, // Transition in duration
    dismissible: false,
    startingTop: '16%',
    outDuration: 200,
    height: '44%'
  });
  // $('#modal1').modal('open');

  if(getRedirectRule().location){
    setTimeout(() => {
      if(localStorage.getItem('utm_source') == 'paytm') {
        console.log("hi");
      } else {
        openInputSlider();
      }
    }, 1000);

  }

  if(urlParams['utm_source']) {
    hideSocialIcons();
  }else{
    showSocialIcons();
  }
  let source = urlParams['utm_source'];
  if(source){
    localStorage.setItem("utm_source", source);
  }
  getRule();
  // if(localStorage.getItem('utm_source') == 'medibuddyapp'){
  //   window.location.href = "/medibuddy.html?utm_source=medibuddyapp"
  // }

  if(urlParams["location"]){
    localStorage.setItem("location", urlParams["location"]);
  }

  if(!urlParams['params'] && source !== "phonePe" && source !== 'paytm' && source !== 'flipkart' && source != 'gpay'){
    source = null;
  }
  switch (source) {
    case 'sastaSundar':
      config = sastaSundar;
      break;

    case 'jioHealth':
      config = jioHealth;
      break;

    case 'jioChat':
      config = jioChat;
      break;

    case 'phonePe':
      config = phonePeConfig;
      getRule(() => {
        showSplashLoader();
        hideSocialIcons();
      })
      break;

    case 'paytm':
      config = paytm;
      getRule(() => {
        console.log("hurray");
        hideSocialIcons();
      });
      break;

    case 'flipkart':
      config = flipkart;
      // fkPlatform = FKExtension.newPlatformInstance("docsapp.test");
      getRule(() => {
        console.log("hurray");
        hideSocialIcons();
      });
      break;

    case 'gpay':
      config = gpay;
      getRule(() => {
        console.log("hurray");
        hideSocialIcons();
      });
      break;

    default:
      let params = urlParams['params'];

      if(source && params)
          config = sso;
      else {
        config = mWeb;
        if(!urlParams['utm_source']){
          localStorage.setItem("utm_source", "docsapp");
        }
        getRule(() => {
          console.log("docsapp utm source fetched...");
        });
      }
  }

  console.log("CONFIG -> ", config);

  if ($(window).width() > 1024) {
    window.isMobile = false;
    $(".mobile").remove();
  } else {
    $(".desktop").remove();
    window.isMobile = true;
  }

  if (window.isMobile) {
    $('#header-img').attr('src', 'assets/images/newDesign/mob-head-img.png');
    $('#mob-download-img').html(null);
  } else {
    $('#header-img').attr('src', 'assets/images/newDesign/talk-to-doc.png');
    $('#mob-download-img-1').attr("src", "assets/images/newDesign/moblie-img.png");
  }
  let ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') != -1) {
    if (ua.indexOf('chrome') > -1) {
      if(window.isMobile){
        // $('.header-top').css('height', '1000px') // Chrome
      } else {
        // $('.header-top').css('height', '530px') // Chrome
      }
    } else {
      console.log("Safari") // Safari
    }
  }

  // $('footer').html(localStorage.lpv);

  var temp = Math.floor(Math.random() * (2100 - 2000 + 1)) + 2000;
  $('counter').html(temp)
  setInterval(function () {
    var temp = Math.floor(Math.random() * (2100 - 2000 + 1)) + 2000;
    $('counter').html(temp)
  }, 1886);

  postEvent({
    eventName: "LandingPage",
    details: {
      device: navigator.userAgent,
      browser: navigator.userAgent,
    }
  });

  if (parseQueryString()) {
    deptStr = parseQueryString()
  }

  var department_object = {}

  $.get('assets/js/content.json', function (resp) {
    department_object = (resp)
    if (deptStr.id) {
      deptObj = department_object[deptStr.id.toLowerCase()]
    } else {
      deptObj = department_object['generic']
    }
    $("dept").html(deptStr.id ? deptStr.id : "specialist")
    if(deptObj){
      for (var i in deptObj.questions) {
        var template = "";
        template += "<li class='qstItem' data-index=" + parseInt(i) + " data-dept='" + deptStr.id + "'>"
        template += "<img src='assets/images/question.png'>"
        template += "<span>" + deptObj.questions[i].question + "</span>"
        template += "</li>"
        $("#qstCntnr").append(template);
      }
    }
    $('.qstItem').click(function () {
      $(".slideUp").animate({
        bottom: 0
      })
      $('.overlay').fadeIn();
      var dept = $(this).closest(".qstItem").attr("data-dept");
      if (dept == "undefined") {
        dept = 'generic'
      }
      var index = parseInt($(this).closest(".qstItem").attr("data-index"));
      $(".slideUp").find(".greenTxt").html(department_object[dept]['questions'][index]['question'])
      $(".slideUp").find("p").html(department_object[dept]['questions'][index]['answer']);
      postEvent({
        eventName: 'questionViewed'
      })
    });

    $(".whySpan").click(function () {
      postEvent({
        eventName: 'why_give_mobile'
      })
      if (localStorage.lpv == 'L3.0') {
        $(".slideUp").animate({
          bottom: 0
        })
        $('.overlay').fadeIn();
        $(".slideUp").find(".greenTxt").html("Why do you need my mobile number?")
        $(".slideUp").find("p").html("Your phone number is needed to verify and register you on DocsApp. The doctor will call you on this number and talk to you about your medical issue. The doctor will then give you a prescription with required medications.")
      } else {
        if (!$("#cntnr1").find(".greenTxt").hasClass('hasText')) {
          $("#cntnr1").find(".greenTxt").html("Why do you need my mobile number?")
          $("#cntnr1").find("p").html("Your phone number is needed to verify and register you on DocsApp, so that the doctor can call for the consultation.")
          $('.inputSlideUp').animate({
            'min-height': '320px'
          })
        } else {
          $("#cntnr1").find(".greenTxt").html("")
          $("#cntnr1").find("p").html("")
          $('.inputSlideUp').animate({
            'min-height': '200px'
          })
        }
        $(".inputSlideUp").find(".greenTxt").toggleClass('hasText');
      }
    })
  })

  if (localStorage.user) {
    if(localStorage.getItem('utm_source') != 'gpay'){
      $.ajax({
        type: "POST",
        url: "/patientswebapp/patientweb/checkStatus",
        data: JSON.stringify({
          "source": pageSource
        }),
        contentType: "application/json",

        success: function (resp) {
          if (resp.success == 1) {
              localStorage.setItem('user', JSON.stringify(resp));
              postEvent({
                  eventName: "pre_authenticated_user",
                  details: {
                      device: navigator.userAgent,
                      browser: navigator.userAgent,
                      'userId': resp.userId
                  }
              })
              getRule(() => {
                let redirectUrl = localStorage.getItem("location");
                localStorage.removeItem('location');
                if(redirectUrl){
                  window.location.href = window.location.origin + "/main.html#"+redirectUrl
                }else {
                  window.location.href = window.location.origin + "/main.html#home";
                }
                // window.location.href = "/main.html#home"
              })

          }
        },
        error: function (err) {
          console.log(err);
          localStorage.removeItem('user')
        }
      });
    } else {
      let hashRedirects = ['#home', '#askDoctor', '#gold'];
      if( hashRedirects.includes(window.location.hash) ){
        window.location.assign('/main.html' + window.location.search + window.location.hash);
      }
    }
  }

  function localStorageCheckCallback(resp) {
    if (resp.success) {
      localStorage.setItem('user', JSON.stringify(resp));
      postEvent({
        eventName: "pre_authenticated_user",
        details: {
          device: navigator.userAgent,
          browser: navigator.userAgent,
          'userId': resp.userId
        }
      })
      let redirectUrl = localStorage.getItem("location");
      localStorage.removeItem('location');
      if(redirectUrl){
        window.location.href = window.location.origin + "/main.html#"+redirectUrl
      }else {
        window.location.href = window.location.origin + "/main.html#home";
      }
      // window.location.href = "/main.html#home"
    }
  }

  $('.loginBtn').click(loginCallback);

  $('.submitOtp').click(function () {
    validateOtp();
  });

  $('.resendOtp').click(function () {
    stopTimer();
    postEvent({
      eventName: "resendOTP"
    })
    requestOtp();
  });

  var login_el = $("#mainbtn");

  // $(window).scroll(function () {
  //   if ($(window).width() < 1024) {
  //     isElementVisible(login_el);
  //   }
  // });
  getRule(() => {
    if (config['loginScreen']) {
      showLoginScreen();
    } else if (config['otpScreen']) {
      showOtpScreen();
    } else if (config['directLanding']) {
      landToQuestion();
    } else if (config['sso']) {
      if (localStorage.getItem('utm_source') == 'paytm' && !parseQueryString().params) {
        paytmSSO();
      } else if (localStorage.getItem('utm_source') == 'paytm' && parseQueryString().params) {
        verifySSO();
      } else {
        getPhoneAccessToken();
      }
    } else if (config['direct']) {
      verifySSO();
    } else if (config['pwaScreen']) {
      redirectToLogin();
    } else if (config['flipkart']) {
      if (parseQueryString().params) {
        showSplashLoader();
        verifySSO();
      } else {
        showSplashLoader();
        flipkartLogin();
      }
    } else if (config['gpay']) {
      if (parseQueryString().params) {
        showSplashLoader();
        verifySSO();
      } else {
        hideGpayLoader();
      }
    }
    hideLoader();
  });

  if (urlParams["popup"] == 'show') {
    stickyBtnClick("3.1", "gold");
  }

});

function gpayExit() {
  $('.gpay-exit').css('background', '#fff');
  $('#modal1').modal('close');
  // hideGpayLoader();
}

function gpayAllow() {
  $('.gpay-allow').css('background', '#3B8134');
  $('#modal1').modal('close');
  // showSplashLoader();
  showGpayLoader();
  gpayLogin();
}

function gpayPopUp() {
  hideGpayLoader();
  $('#modal1').modal('open');
}

function gpayReady(callback){
  try {
    if(microapps){
      callback && callback();
    }
  } catch (err) {
    alert("microapps not available");
    window.location.reload();
  }
}

function gpayLogin() {
  gpayReady(function() {
    let request = {
      skipPrompt: false
    }
    microapps.getPhoneNumber(request).then(response => {
      console.log("phone response ->", response);
      if(response) {
        $.ajax({
          type: "POST",
          url: "/patientswebapp/vendor/gpay/accessToken",
          data: JSON.stringify({
            token: response
          }),
          contentType: "application/json",
          success: function (resp) {
              console.log("gpay token response ->", resp);
              alert("response url -> "+ JSON.stringify(resp));
              // hideSplashLoader();
              getRule(() => {
                if( parseQueryStringUrl(resp.sso).params ){
                  // alert("reload happening");
                  window.location.href = resp.sso;
                } else {
                  // window.location.href = response.sso;
                  // hideSplashLoader();
                  hideGpayLoader();
                }
              })
            // }
          },
          error: function (err) {
            // hideSplashLoader();
            hideGpayLoader();
            console.log("gpay token response ->", err);
            // alert("errror "+JSON.stringify(err));
          }
        });
      } else {
        // hideSplashLoader();
        hideGpayLoader();
        gpayPopUp();
      }
    }).catch(err => {
      console.log("gpay error -> ", err);
      // hideSplashLoader();
      hideGpayLoader();
      gpayPopUp();
    })
  })
}

function checkForFlipkart(callback) {
  try{
    if( window.FKExtension ) {
      // alert("fk ready");
      fkPlatform = FKExtension.newPlatformInstance("docsapp.healthcare");
      callback && callback();
    } else {
      alert("extention not ready");
      try{
        fkPlatform = FKExtension.newPlatformInstance("docsapp.healthcare");
        alert("flatform worked");
        callback && callback();
      } catch(err){
        alert("errro -> "+JSON.stringify(err));
      }
      alert("extention not ready -2");
      hideSplashLoader();
      callback && callback();
      // document.addEventListener('FKExtension', callback, false);
    }
  } catch(err){
    hideSplashLoader();
  }
}

function flipkartLogin() {
  checkForFlipkart(function() {
    // showSplashLoader();
    var scopeReq = [{"scope":"user.email","isMandatory":false,"shouldVerify":false},{"scope":"user.mobile","isMandatory":true,"shouldVerify":false},{"scope":"user.name","isMandatory":false,"shouldVerify":false}];
    fkPlatform.getModuleHelper().getPermissionsModule().getToken(scopeReq).then(
    function (resp) {
      // alert("result -> "+JSON.stringify(resp));
      // alert("token -> "+resp.grantToken);
      if(resp.grantToken){
        $.ajax({
          type: "POST",
          url: "/patientswebapp/vendor/flipkart/accessToken",
          data: JSON.stringify({
            token: resp.grantToken
          }),
          contentType: "application/json",
          success: function (response) {
              // alert("response url -> "+ JSON.stringify(response));
              // hideSplashLoader();
              getRule(() => {
                if( parseQueryStringUrl(response.sso).params ){
                  // alert("reload happening");
                  window.location.href = response.sso;
                } else {
                  // window.location.href = response.sso;
                  hideSplashLoader();
                }
              })
            // }
          },
          error: function (err) {
            hideSplashLoader();
            // alert("errror "+JSON.stringify(err));
          }
        });
      } else {
        hideSplashLoader();
        alert("Oops something went wrong, please try again");
      }

    }).catch(
    function (e) {
      console.log(e.message);
      // alert("error -> "+JSON.stringify(e.message));
    })
  });
}

// JSBRIDGE
function bridgeReady(callback) {
  if (window.JSBridge) {
    callback && callback();
  } else {
    document.addEventListener('JSBridgeReady', callback, false);
  }
}

function paytmSSO(){
  showLoader();
  bridgeReady(function () {
      window.JSBridge.call('paytmFetchOpenId', {
        clientId: 'merchant-docsapp-prod'
      },
      function(result){
        window.JSBridge.call('paytmFetchAuthCode', {
          clientId: 'merchant-docsapp-prod'
        },
        function(response){
          if(response.data && response.data.openId && response.data.authId){
            $.ajax({
              type: "POST",
              url: "/patientswebapp/vendor/paytm/accessToken/get",
              data: JSON.stringify({
                openId: response.data.openId,
                authId: response.data.authId
              }),
              contentType: "application/json",
              success: function (resp) {
                  hideLoader();
                  getRule(() => {
                    if( parseQueryStringUrl(window.location.origin+''+resp.url).params ){
                      window.location.href = resp.url;
                    } else {
                      // alert("failed to get data");
                      hideLoader();
                      // window.location.href = resp.url;
                    }
                  })
                // }
              },
              error: function (err) {
                // alert("errror "+JSON.stringify(err));
              }
            });
          } else {
            alert("Oops something went wrong, please try again");
            // window.location.reload();
          }
        })
      });
    // });
  });
}

function verifySSO() {
    if(!urlParams["params"] && !urlParams['utm_source']){
      return;
    }
    let redirectRule = getRedirectRule();
    if(!redirectRule.location){
      redirectRule = getRedirectForMb();
    }
    showLoader();
    $.ajax({
      type: 'POST',
      url: "patientswebapp/vendor/verify",
      data: {
        param: urlParams["params"],
        vendor: urlParams['utm_source']
      },
      success: function (resp) {
        if(resp.error){
          // alert(resp.error);
          return;
        }
        if(resp.jwt){
          localStorage.setItem('gpay_jwt', resp.jwt);
        }
        console.log("login resp -> ", resp);
        localStorage.setItem("rule", JSON.stringify(resp.rule));
        localStorage.setItem("user", JSON.stringify(resp));
        postEvent({
          eventName: "otpVerified",
          details: {
            advertiserId: resp.userId,
            tempId: resp.userId,
            patientId: resp.userId
          }
        });
        if(localStorage.getItem('utm_source') == 'paytm'){
          localStorage.setItem('entryPoint', window.btoa(window.location.origin + '/?utm_source=paytm'));
        } else if(localStorage.getItem('utm_source') == 'gpay'){
          localStorage.setItem('entryPoint', window.btoa(window.location.origin + '/?utm_source=gpay'));
        } else {
          localStorage.setItem('entryPoint', window.btoa(window.location.href))
        }
        let redirectUrl = localStorage.getItem("location");
        localStorage.removeItem('location');
        if(redirectUrl){
          localStorage.removeItem("location")
          window.location.href = window.location.origin + "/main.html#"+redirectUrl
        }else {
          if(redirectRule.location){
            localStorage.removeItem("redirect");
            window.location.href = window.location.origin + "/main.html#"+redirectRule.location;
            return;
          }
          window.location.href = window.location.origin + "/main.html#home";
        }
      },
      error: function (err, error_text, statusText) {
        // alert("sso failed "+err.responseJSON);
        console.log(err.responseJSON);
        hideSplashLoader();
        hideLoader();
        if (err.responseJSON && err.responseJSON.success == 2) {
          alert('error coming from jio healthhub. please fix the issue');
          $('#wesentHeader').text('We Sent');
          $('#wesent').text(JSON.stringify(err.responseJSON.options));
          $('#errorMessageHeader').text('Your Error Message');
          $('#errorMessage').text(JSON.stringify(err.responseJSON.response));
        } else {
          // alert('error coming from server');
        }
        redirectToLogin('/index.html');
      },
      contentType: 'application/x-www-form-urlencoded'
    });
    return true;
  }

function hideSocialIcons() {
  $('.socialLinks').hide();
  $('.seolinks').attr('href', '#');
  if(urlParams['utm_source']){
    $('#corona-banner').hide();
    $('#gold-card-margin').css('margin-top', '-26px');
  }
  // hideElem('socialLinks');
}

function showSocialIcons() {
  $('.socialLinks').show();
  // hideElem('socialLinks');
}


function hideElem(elemId) {
  var elemClass = document.getElementById(elemId).classList;
  elemClass.add('hide');
}

function showOtpScreen() {
  if (urlParams['phonenumber']) {
    openInputSlider();
    $('#mobNum').val(urlParams['phonenumber']);
    loginCallback();
  }

  /*
    var urlObj = Object.assign({}, urlParams);
    urlObj.url = "";
    urlObj.source = urlObj.utm_source; */

}

function landToQuestion() {
  console.log('I am evolving');

  if (URL) {
    var url = new URL(window.location.href);
    for (var key of url.searchParams.keys()) {
      jioHealthParams[key] = url.searchParams.get(key);
    }
  } else {
    jioHealthParams = parse_query_string(location.search);
  }

  verify(jioHealthParams);
}

function showLoginScreen() {
  if (urlParams['userId']) {
    userId = urlParams['userId'];
  }
  openInputSlider();
}

function openInputSlider() {
  if (window.isMobile) {
    $(".inputSlideUp").animate({
      bottom: 0,
      'min-height': '460px'
    })
    $('.overlay').fadeIn();
    $('#mobNum').val('');
    $('.loginBtn').prop('disabled', true);
    $('.loginBtn').css('background-color', '#CBCBCB');
    $('input[type="number"]').keyup(function() {
      if($(this).val() != '' && $("#mobNum").val().length == 10) {
        $('.loginBtn').css('background-color', '#00A62C');
        $('.loginBtn').prop('disabled', false);
      } else {
        $('.loginBtn').prop('disabled', true);
        $('.loginBtn').css('background-color', '#CBCBCB');
      }
    });
    showMobCntnr();
  } else {
    openLoginModal();
  }
}

function loginCallback() {
  if (localStorage.lpv != 'L3.0') {
    $("#cntnr1").find(".greenTxt").html("")
    $("#cntnr1").find("p").html("")
    $('.inputSlideUp').animate({
      'min-height': '460px'
    })
  }
  if ($("#mobNum").val().length != 10) {
    Materialize.toast(
      'Please enter a valid mobile number!', 4000,
      "red"
    );
    $("#mobNum").focus()
  } else {
    $(this).find('.loader').removeClass('hide')
    stopTimer();
    postEvent({
      eventName: "requestOtpBtnClicked"
    });
    getRule(requestOtp);
    //requestOtp();
  }
}

function requestOtp() {
  var payload = {
    phonenumber: $('#mobNum').val(),
    source: pageSource,
    platform: 'web',
    params: parseQueryString()
  }
  $.ajax({
    type: "POST",
    url: "/patientswebapp/patientweb/infiniteSMS",
    data: JSON.stringify(payload),
    contentType: "application/json",
    success: function (resp) {
      if (resp.success == 1) {
        sendEventLogs("otp_sent", {
          phoneNumber: payload.phonenumber
        });
        $('.loginBtn').find('.loader').addClass('hide')
        if (localStorage.lpv == 'L3.0') {
          $('.overlay').fadeIn();
          $(".slideDown").animate({
            top: "10%"
          });
          $('.slideDown').find('mob').html($("#mobNum").val());
        } else {
          showOtpCntnr()
        }
        postEvent({
          eventName: "otpDetailsScreen",
          details: {
            device: navigator.userAgent,
            browser: navigator.userAgent,
          }
        })
        $('.resendOtp').attr('disabled', true);
        startTimer();
        $('#otp').trigger('click');
        if (resp.data && resp.data.otp) {
          setTimeout(function () {
            $('#otp').val(parseInt(resp.data.otp));
          }, 200)
        }
      } else {
        postEvent({
          eventName: "otpRequestFailed",
        })
        Materialize.toast(
          "Invalid Mobile Number", 4000,
          "red"
        )
      }
    },
    error: function (err) {
      $('.loginBtn').find('.loader').addClass('hide')
      if (err.status == '502' || err.status == '504' || err.status == '503' || err.status == '500') {
        Materialize.toast(
          "Something went wrong", 4000,
          "red"
        )
      } else if (err.status == 401) {
        M.toast({
          html: "Please Reload the page.",
          classes: "red"
        })
      } else {
        Materialize.toast(
          "Invalid Mobile Number", 4000,
          "red"
        )
      }
    }
  });
}


function fakeOtpforPhonePe(data) {
  var payload = {
    phonenumber: data['data']['userDetails']['phoneNumber'],
    source: 'PhonePe',
    platform: 'web',
    params: {}
  }

  $.ajax({
    type: "POST",
    url: node_url + "/patientswebapp/patientweb/infiniteSMS",
    data: JSON.stringify(payload),
    contentType: "application/json",
    success: function (resp) {
      if (resp.success == 1) {
        createPhonePeSession(data);
      } else {
        console.error('Session for phonePe failed');
      }
    },
    error: function (err) {
      console.info(err);
      console.error('Something breaks down while session creation');
      hideSplashLoader();
      showLoginScreen();
    }
  });
}
/*
    POSTING events in our records
 */
function eventLog(eventName, eventDetail) {
  var eventObj = {};
  eventObj.source = urlParams.utm_source ? urlParams.utm_source : "unidentified";
  eventObj.url = urlParams.url ? urlParams.url : window.location.href;
  eventObj.screen = urlParams.screenType ? urlParams.screenType : "webapp";
  eventObj.eventName = eventName;
  eventObj.eventDetail = eventDetail;
  eventObj.ua = navigator.userAgent;
  eventObj.ip = ip;
  eventObj.version = version;
  return new Promise(function(resolve, reject) {
    $.post("/patientswebapp/patientweb/event", eventObj, function (response) {
      console.log(response);
      resolve(response);
    });
  });
}

let getRedirectRule = () => {
  let redirectUrl = window.localStorage.getItem("redirect");
  if(redirectUrl){
    try{
      redirectUrl = redirectUrl.replace("#", "");
      let json = decodeURIComponent(redirectUrl);
      let jsonObj = JSON.parse(json);
      for(let key in jsonObj){
        localStorage.setItem(key, jsonObj[key]);
      }
      return jsonObj;
    }catch(e) {
      console.log(e);
      return {};
    }
  }
  return {};
}

let getRedirectForMb = () => {
  let redirectJson = {
    location: localStorage.getItem('redirect')
  }
  return redirectJson;
}

function validateOtp() {
  let redirectRule = getRedirectRule();
  if(!redirectRule.location){
    redirectRule = getRedirectForMb();
  }
  $('.submitOtp').find('.loader').removeClass('hide')
  $('.submitOtp').attr('disabled', true);
  if ($('#otp').val().length == 4) {
    postEvent({
      eventName: "otpEntered",
    })
    var payload = {
      phonenumber: $('#mobNum').val(),
      otp: parseInt($('#otp').val()),
      source: pageSource,
      platform: "web",
      version: "v3.0.0",
    }
    $.ajax({
      type: "POST",
      url: "/patientswebapp/patientweb/validateOtp",
      data: JSON.stringify(payload),
      contentType: "application/json",
      success: function (resp) {
        $(self).removeAttr('disabled')
        // $('#otp')
        if (resp.success == 1) {
          localStorage.setItem("user", JSON.stringify(resp));
          sendEventLogs("otp_verified", {
            phoneNumber: resp.phonenumber || resp.mobile
          });
          // ga('set', 'userId', resp.phonenumber);
          // ga('send', 'event', 'authentication', 'user-id available');
          $('.submitOtp').find('.loader').addClass('hide')
          postEvent({
            eventName: "otpVerified",
            details: {
              advertiserId: resp.userId,
              tempId: resp.userId,
              patientId: resp.userId
            }
          });

          if (urlParams.utm_source === 'sastaSundar') {
            let parr = [];
            parr.push(eventLog('otpVerified'));
            parr.push(postToSasta('OtpVerified', urlParams.phonenumber));
            Promise.all(parr).then(function(data) {
              redirectToDashboard();
            });
          }

          var params = '';

          if (parseQueryString()['utm_source']) {
            localStorage.setItem("src", parseQueryString()['utm_source']);
          }

          localStorage.setItem('entryPoint', window.btoa(window.location.href))

          if(localStorage.getItem('phoneQuery')){
            DeltaSync(JSON.parse(localStorage.getItem("user"))['id']);
          } else {
            let redirectUrl = localStorage.getItem("location");
            localStorage.removeItem('location');
            if(redirectUrl){
              localStorage.removeItem("location")
              window.location.href = window.location.origin + "/main.html#"+redirectUrl
            }else {
              if(redirectRule.location){
                localStorage.removeItem("redirect");
                window.location.href = window.location.origin + "/main.html#"+redirectRule.location;
                return;
              }
              window.location.href = window.location.origin + "/main.html#home";
            }
          }
        } else {
          $('.submitOtp').find('.loader').addClass('hide');

          Materialize.toast(
            resp.err, 4000,
            'red'
          );
        }
      },
      error: function (err) {
        console.log("ERROR -> ", err);
        $('.submitOtp').find('.loader').addClass('hide')
        if (err.status !== '502' && err.status !== '504' && err.status !== '503' && err.status !== '500') {
          Materialize.toast(
            err.responseJSON.err, 4000,
            'red'
          )
        } else {
          Materialize.toast(
            'Something Went Wrong!', 4000,
            'red'
          )
        }
        $('.submitOtp').removeAttr('disabled');
      }
    });
  } else {
    $('.submitOtp').find('.loader').addClass('hide')
    Materialize.toast(
      'Invalid OTP', 4000,
      "red"
    )
    $(self).removeAttr('disabled')
  }
}

function watchInput(e) {
  if (e.value.length == 0) {
    startTimer();
  } else {
    stopTimer();
  }
  if (e.value.length == 4) {
    $('.submitOtp').css("background-color", "#00a62c");
    $('.continue-btn').css("background-color", "#00a62c !important");
    validateOtp();
  }
}

var timer;
var counter = 30;

function startTimer() {
  timer = setInterval(function () {
    $('timer').html(counter + 's');
    counter--;
    if (counter == -1) {
      stopTimer();
      $('.resendOtp').removeAttr('disabled');
    }
  }, 1000)
}

function stopTimer() {
  clearInterval(timer);
  $('timer').html("")
  counter = 30;
}

function isElementVisible(el) {
  if (el.offset()) {
    var top_of_element = el.offset().top;
    var bottom_of_element = el.offset().top + el.outerHeight();
    var bottom_of_screen = $(window).scrollTop() + window.innerHeight;
    var top_of_screen = $(window).scrollTop();

    if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)) {
      document.querySelector(".stickyCTA").style.display = "none";
    } else {
      document.querySelector(".stickyCTA").style.display = "block";
    }
  }
}

function showOtpCntnr() {
  $("#otp").val("")
  $('mob').html($("#mobNum").val());
  if (window.isMobile) {
    $("#cntnr1").animate({
      left: '-100vw'
    });
    $('.inputSlideUp').animate({
      'min-height': '460px'
    })
    $("#cntnr2").animate({
      left: "68px"
    });
  } else {
    $(".input_cntnr1").fadeOut();
    setTimeout(function () {
      $(".input_cntnr2").fadeIn("");
    }, 500)
  }
}

function showMobCntnr() {
  if (window.isMobile) {
    $("#cntnr2").animate({
      left: '120vw'
    });
    $('.inputSlideUp').animate({
      'min-height': '460px'
    })
    $("#cntnr1").animate({
      left: "68px"
    });
    $('#mobNum').focus();
  } else {
    $('.input_cntnr2').hide();
    setTimeout(function () {
      $('.input_cntnr1').fadeIn()
    }, 500);
  }
}

function stickyBtnClick(v, redirect) {
  postEvent({
    eventName: 'Talk_to_doc_button2'
  });
  if(redirect){
    if(redirect == 'consult'){
      localStorage.setItem('redirect', 'askDoctor');
    } else if(redirect == 'gold'){
      localStorage.setItem('redirect', 'gold');
    }
  } else {
    localStorage.setItem('redirect', 'home');
  }

  // gpay sso trigger check
  if(localStorage.getItem('utm_source') == 'gpay'){
    // showSplashLoader();
    showGpayLoader();
    gpayLogin();
  } else {
    if (v == '3.0') {
      window.scrollTo(0, 0);
      document.querySelector('#mobNum').focus();
    } else {
      openInputSlider()
    }
  }
}

function postEvent(params) {
  if ($(window).width() > 1024) {
    params.eventName = "Desk_" + params.eventName
  }
  var event = {
    platform: "web",
    source: pageSource,
    url: window.location.href,
    eventLabel: params.eventName,
    eventName: params.eventName,
    eventCategory: params.eventName,
    eventDetail: JSON.stringify({
      ua: navigator.userAgent
    }),
    ua: navigator.userAgent,
    version: window.version,
  };
  if (['webpatient.docsapp.in', 'm.docsapp.in'].includes(window.location.hostname)) {
    ga("send", {
      hitType: "event",
      eventCategory: event.eventCategory,
      eventName: event.eventName,
      eventAction: event.eventDetail || "event fired",
      eventLabel: event.eventLabel,
      eventSource: pageSource,
    });
    ga("send", {
      hitType: "event",
      eventCategory: event.eventCategory + '_' + localStorage.lpv,
      eventName: event.eventName,
      eventAction: event.eventDetail || "event fired",
      eventLabel: event.eventLabel,
      eventSource: pageSource,
    });
    dataLayer.push({
      "event" : event.eventName,
      eventCategory: event.eventCategory,
      eventName: event.eventName,
      eventAction: event.eventDetail || "event fired",
      eventLabel: event.eventLabel,
      eventSource: pageSource,
    })
    if (fbq != undefined) {
      fbq('track', event.eventName, JSON.stringify(event));
    }
    $.ajax({
      type: "POST",
      url: "/patientswebapp/patientweb/event",
      data: JSON.stringify({
        source: pageSource,
        url: window.location.href,
        screen: window.location.hash ? window.location.hash : "landing",
        eventName: event.eventName,
        ua: navigator.userAgent,
        version: window.version
      }),
      contentType: "application/json",

      success: function (resp) {

      },
      error: function (err) {}
    });
    let utmSource = localStorage.getItem("utm_source");
    if(utmSource){
      $.ajax({
        type: "POST",
        url: "/patientswebapp/patientweb/event",
        data: JSON.stringify({
          source: pageSource,
          url: window.location.href,
          screen: window.location.hash ? window.location.hash : "landing",
          eventName: utmSource+"_"+event.eventName,
          ua: navigator.userAgent,
          version: window.version
        }),
        contentType: "application/json",

        success: function (resp) {
          console.log("EVENT SENT -> ", resp);
        },
        error: function (err) {}
      });
    }
  } else {
    console.log(event)
  }
}

function openLoginModal(eventLabel) {
  // var elems = document.querySelector('#loginModal');
  // var instances = M.Modal.init(elems).open();
  $('#loginModal').modal('open');
  $('.loginBtn').prop('disabled', true);
  $('.loginBtn').css('background-color', '#CBCBCB');
  $('input[type="number"]').keyup(function() {
    if($(this).val() != '' && $("#mobNum").val().length == 10) {
      $('.loginBtn').css('background-color', '#00A62C');
      $('.loginBtn').prop('disabled', false);
    } else {
      $('.loginBtn').prop('disabled', true);
      $('.loginBtn').css('background-color', '#CBCBCB');
    }
  });
  postEvent({
    eventName: eventLabel
  })
}

/*
  JIO health direct landing to askQuestions
*/

 function verify(body) {
  $.ajax({
    type: 'POST',
    url: "/patientswebapp/lpl/verify",
    data: getformurlencoded3(body),
    success: function (resp) {
      localStorage.setItem("user", JSON.stringify(resp));
      postEvent({
        eventName: "otpVerified",
        details: {
          advertiserId: resp.userId,
          tempId: resp.userId,
          patientId: resp.userId
        }
      });
      localStorage.setItem('entryPoint', window.btoa(window.location.href))
      window.location.href = window.location.origin + "/main.html#askDoctor";
    },
    error: function (err, error_text, statusText) {
      console.log(err.responseJSON);
      if (err.responseJSON && err.responseJSON.success == 2) {
        alert('error coming from jio healthhub. please fix the issue');
        $('#wesentHeader').text('We Sent');
        $('#wesent').text(JSON.stringify(err.responseJSON.options));
        $('#errorMessageHeader').text('Your Error Message');
        $('#errorMessage').text(JSON.stringify(err.responseJSON.response));
      } else {
        alert('error coming from server');
      }
      redirectToLogin('/index.html');
    },
    contentType: 'application/x-www-form-urlencoded'
  });
}

function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}
