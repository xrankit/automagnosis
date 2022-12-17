/**
 * Created by ananda on 10/01/17.
 */


function onScroll(event){
    var posArray ={
        "#":{
            "min":0,
            "max":$("#how-it-works").position().top-50
        },
        "#how-it-works":{
            "min":$("#how-it-works").position().top-50,
            "max":$("#what-we-treat").position().top-50
        },
        "#what-we-treat":{
            "min":$("#what-we-treat").position().top-50,
            "max":$("#why-us").position().top
        },
        "#why-us":{
            "min":$("#why-us").position().top,
            "max":$("#reviews").position().top-100
        },
        "#reviews":{
            "min":$("#reviews").position().top-100,
            "max":$("#the-team").position().top
        },
        "#the-team":{
            "min":$("#the-team").position().top,
            "max":$("#contact-us").position().top-100
        },
        "#contact-us":{
            "min":$("#contact-us").position().top-100,
            "max":$("#contact-us").position().top+500
        }
    };

    var scrollPos = $(document).scrollTop();
    for(key in posArray) {
        if(scrollPos>=posArray[key].min && scrollPos<posArray[key].max) {
            $('.main-nav ul li.active').removeClass("active");

            $('.main-nav ul li').each(function () {
                var currLink = $(this);
                if(currLink.children().eq(0).attr("href")==key) {
                    currLink.addClass("active");
                }
            });
        }
    }
}
$(document).ready(function () {
    $(document).on("scroll", onScroll);
});