// query string
var query_string = {};
var query = window.location.search.substring(1);
var vars = query.split("&");
for (var i=0;i<vars.length;i++) {
  var pair = vars[i].split("=");
      // If first entry with this name
  if (typeof query_string[pair[0]] === "undefined") {
    query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
  } else if (typeof query_string[pair[0]] === "string") {
    var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
    query_string[pair[0]] = arr;
      // If third or later entry with this name
  } else {
    query_string[pair[0]].push(decodeURIComponent(pair[1]));
  }
} 
query_string['ActualUrl'] = window.document.URL.split('?')[0];
var querystingified = JSON.stringify(query_string);

//track utmsource / refferer
  $( document ).ready(function() {
      checkCookie();
  });
  
  function checkCookie() {
      var curr = localStorage.getItem('channel');    
      var sourceVal = (window.query_string && window.query_string.utm_source) ? window.query_string.utm_source : (document.referrer.split('/')[2]);    
        sourceVal = (sourceVal)? sourceVal : "direct";
        if (curr!= "" && sourceVal != "direct" && curr != sourceVal){
            localStorage.setItem('channel', sourceVal);
        }
        else if ( !curr ) {
            localStorage.setItem('channel', sourceVal);
        }

        var next = localStorage.getItem('channel');
        var arr = ["#chanTrack1", "#chanTrack2", "#chanTrack3", "#chanTrack4", "#chanTrack5", "#chanTrack6", "#chanTrack7", "#chanTrack8","#chanTrack9","#chanTrack10"];
        for(var i in arr) {
            var curUrl = $(arr[i]).attr("href");
            var index = curUrl ? curUrl.indexOf("af_channel") : -1;
            if( index != -1 ){
                var str = curUrl.substring(0, index + 11);
                var str2 = curUrl.substring(index + 11);
                var res = str + next + str2;
                $(arr[i]).attr("href", res);
            }
        }
    }