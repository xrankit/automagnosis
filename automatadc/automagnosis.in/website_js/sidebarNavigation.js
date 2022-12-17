function sidebarNavFun(){
    $(".sidebarNavigation .navbar-collapse")
        .hide()
        .clone()
        .appendTo("body")
        .removeAttr("class")
        .addClass("sideMenu")
        .show(); 
    $("body").append("<div class='overlay'></div>");
    $(".navbar-toggle").on("click", function() {
        $(".sideMenu")
            .addClass(
                $(".sidebarNavigation").attr("data-sidebarClass")), 
                $(".sideMenu, .overlay").toggleClass("open"), 
                $(".overlay").on("click", function() {
                    $(this).removeClass("open"), $(".sideMenu").removeClass("open")
        })
    });
}

window.onload = function() {
    window.jQuery ? $(document).ready(function() {
        sidebarNavFun();
    }) : console.log("sidebarNavigation Requires jQuery")
};
