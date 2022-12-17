var docsapp_utm_source = "unknown";
var docsapp_utm_medium = "na";
var docsapp_utm_campaign = "na";
var docsapp_utm_content = "na";
var params = "";
  function docsappdetectmob() { 
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    ){
        return true;
      }
    else {
        return false;
      }
  }

  function docsappStartDisplay(noInit) {
    if(docsappdetectmob()){
      $('.chatbox-docsapp').hide();
      $("#docsapp-mobile-view").show();
    }else{
      $('.chatbox-docsapp').show();
      $("#docsapp-mobile-view").hide();
    }
    if(!noInit)
      docsappInit();
  }

  $(document).ready(function(){
    docsapp();

    showBubble();

  })

  function hideBubble(){
    $("#docsapp-buble-display").hide();
  }

  function showBubble(){
    setTimeout(() => {
      $("#docsapp-buble-display").fadeIn(800);
      $(".docsapp-clear-bubble").click(() => {
        hideBubble();
      })
    }, 1000);
    
  }

  function docsappInit() {
    $(window).resize(function() {

      docsappStartDisplay(true);

    });
      $(document).ready(function() {
          var iframe = '<iframe src="https://m.docsapp.in/chat.html?utm_source='+docsapp_utm_source+'&utm_medium='+docsapp_utm_medium+'&utm_campaign='+docsapp_utm_campaign+'&utm_content='+docsapp_utm_content+'&params='+params+'" height="100%" width="100%" style="border:none;"></iframe>';
          var $chatbox = $('.chatbox-docsapp'),
              $chatboxTitle = $('.chatbox__title'),
              $chatboxTitleClose = $('.chatbox__title__close'),
              $chatboxCredentials = $('.chatbox__credentials');
          $chatboxTitle.on('click', function() {
              if ($chatbox.hasClass('chatbox--tray')){
                  $(".chatbox__body").html(iframe)
                  hideBubble();
              }else{
                  $(".chatbox__body").html('')
              }
              $chatbox.toggleClass('chatbox--tray');
          });
          $chatboxTitleClose.on('click', function(e) {
              e.stopPropagation();
              $chatbox.addClass('chatbox--closed');
          });
          $chatbox.on('transitionend', function() {
              if ($chatbox.hasClass('chatbox--closed')) $chatbox.remove();
          });
          // $chatboxCredentials.on('submit', function(e) {
          //     e.preventDefault();
          //     $chatbox.removeClass('chatbox--empty');
          // });
          $chatbox.removeClass('chatbox--empty');

          var activeMobile = $("#docsapp-mobile-view");
          var mWebMobile = $("#docsapp-mob");
          var mWebClose = $("#docsapp-mobile-view-close");
          activeMobile.click(function(){
            $("#docsapp-mob-body").html(iframe)
            mWebMobile.fadeIn(600);
            activeMobile.hide();
            hideBubble();
          })

          mWebClose.click(function(){
            activeMobile.fadeIn(600);
            mWebMobile.hide();
            $("#docsapp-mob-body").html("")
          })
      });
  };
  function docsapp() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("docsapp");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        docsapp_utm_source = file;
        docsapp_utm_medium = elmnt.getAttribute("utm_medium");
        docsapp_utm_campaign = elmnt.getAttribute("utm_campaign");
        docsapp_utm_content = elmnt.getAttribute("utm_content");
        params = elmnt.getAttribute("params");
        $.ajax({
          url: "https://script.docsapp.in/popup.mini.html",
          type: "GET",
          crossDomain: true,
          success: function (response) {
            elmnt.innerHTML = response;
            elmnt.removeAttribute("docsapp");
            docsappStartDisplay();
          },
          error: function (xhr, status) {
              console.log(xhr);
          }
        });
        return;
      }
    }
  }