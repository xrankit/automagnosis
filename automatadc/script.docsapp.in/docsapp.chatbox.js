class DocsApp {
    static loadUrl = "";
    static docsappdetectmob() { 
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

    static convertToQueryString(input) {
        let str = [];
        for (let p in input){
            if (input[p]) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(input[p]));
            }
        }
        return str.join("&");
    }

    static includeHTML(loadUrl, btnUrl, docsAppOptions = {}) {
        let z, i, elmnt, file, xhttp;
        /* Loop through a collection of all HTML elements: */
        z = document.getElementsByTagName("*");
        for (i = 0; i < z.length; i++) {
            elmnt = z[i];
            /*search for elements with a certain atrribute:*/
            file = elmnt.getAttribute("docsapp");
            if (file) {
                docsAppOptions.utm_source = file;
                docsAppOptions.utm_medium = elmnt.getAttribute("utm_medium") || docsAppOptions.utm_medium;
                docsAppOptions.utm_campaign = elmnt.getAttribute("utm_campaign") || docsAppOptions.utm_campaign;
                docsAppOptions.utm_content = elmnt.getAttribute("utm_content") || docsAppOptions.utm_content;
                docsAppOptions.params = elmnt.getAttribute("params") || docsAppOptions.params;
                let dimention = {
                    width: "390px",
                    height: "670px",
                    right: "35px"
                }
                if(DocsApp.docsappdetectmob()){
                    dimention = {
                        width: "100%",
                        height: "100%",
                        right: "0px"
                    }
                }else{
                    docsAppOptions.right = 0;
                    docsAppOptions.bottom = 0;
                }
                if(!docsAppOptions.bottom){
                    docsAppOptions.bottom = 0;
                }
                console.log("OPTIONS -> ", docsAppOptions, DocsApp.docsappdetectmob());
                loadUrl = loadUrl + "?" + DocsApp.convertToQueryString(docsAppOptions);
                DocsApp.loadUrl = loadUrl;
                console.log(loadUrl);
                elmnt.innerHTML = '<iframe id="main-docsapp-iframe" src="" height="'+dimention.height+'"'
                    +'width="'+dimention.width+'" style="border:none; position: fixed;bottom: 0px; right: '+dimention.right+'; display: none; z-index: 1001"></iframe>'
                    + '<iframe id="btn-docsapp-iframe" src="'+btnUrl+'" style="border:none; position: fixed;bottom: '+docsAppOptions.bottom+'px; right:'+dimention.right+'; height:206px; width: 290px; z-index: 1000" ></iframe>';
            }
        }
    }

    static initApplication(inputOptions) {
        let docsAppOptions = {
            utm_source: window.location.host,
            utm_medium: null,
            utm_campaign: null,
            utm_content: null,
            params: null,
            debug: 'prod'
        }

        let docsAppConfig = {
            local: {
                uiAddr: "../public/index.html"
            },
            test: {
                uiAddr: "https://s3.ap-south-1.amazonaws.com/test.stript/public"
            },
            prod: {
                uiAddr: "https://script.docsapp.in/public"
            }
        }
        if(!inputOptions){
            inputOptions = {};
        }
        docsAppOptions = {...docsAppOptions, ...inputOptions};
        let loadUrl = docsAppConfig[docsAppOptions.debug].uiAddr + '/index.html';
        let btnUrl = docsAppConfig[docsAppOptions.debug].uiAddr + '/button.html';

        DocsApp.includeHTML(loadUrl, btnUrl, docsAppOptions);
    }

    static init(inputOptions) {
        DocsApp.initApplication(inputOptions);

        window.addEventListener( "message", (e) => { 
            if(e.data == "docsappActiveTrigger"){
                let status = DocsApp.checkIfrane();
                let _iframe = document.getElementById('main-docsapp-iframe');
                if(status){
                    _iframe.src = "";
                }else{
                    _iframe.src = DocsApp.loadUrl
                }
                DocsApp.showIframe(!status);
            }
            if(e.data == "docsappBtnSmall"){
                let y = document.getElementById("btn-docsapp-iframe");
                y.style.height = "70px";
                y.style.width = "100px";
            }
        }, false);
        // DocsApp.bind(window, 'message', e => {
        //     DocsApp.showIframe(true);
        // })
        // DocsApp.bind(window, 'hideDocsappIframe', e => {
        //     DocsApp.showIframe(false);
        // })
    }

    static bindEvent(element, eventName, eventHandler) {
        
        element.addEventListener(eventName, eventHandler, false);
    }

    static showIframe(status) {
        let x = document.getElementById("main-docsapp-iframe");
        let y = document.getElementById("btn-docsapp-iframe");
        if (status) {
            x.style.display = "block";
            y.style.display = "none";
        } else {
            x.style.display = "none";
            y.style.display = "block";
            y.style.height = "70px";
            y.style.width = "100px";
        }
    }

    static checkIfrane() {
        let x = document.getElementById("main-docsapp-iframe");
        return x.style.display == "block";
    }

}