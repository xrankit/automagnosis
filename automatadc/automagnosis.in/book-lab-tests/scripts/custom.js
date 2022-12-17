
$(window).load(function() { // makes sure the whole site is loaded

	"use strict";



//------------------------------------------------------------------------
//						PRELOADER SCRIPT
//------------------------------------------------------------------------   
    $('#preloader').delay(400).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('#preloader .inner').fadeOut(); // will first fade out the loading animation



//------------------------------------------------------------------------
//						NAVBAR SLIDE SCRIPT
//------------------------------------------------------------------------ 		
	$(window).scroll(function () {
        if ($(window).scrollTop() > $("nav").height()) {
            $("nav.navbar-slide").addClass("show-menu");
        } else {
            $("nav.navbar-slide").removeClass("show-menu");
			$(".navbar-slide .navMenuCollapse").collapse({toggle: false});
			$(".navbar-slide .navMenuCollapse").collapse("hide");
			$(".navbar-slide .navbar-toggle").addClass("collapsed");
        }
    });
	
})




$(document).ready(function(){
	
	"use strict";
//------------------------------------------------------------------------
//						FULL HEIGHT SECTION SCRIPT
//------------------------------------------------------------------------
	$("#minimal-intro").css("min-height",$( window ).height());
	$( window ).resize(function() {
		$("#minimal-intro").css("min-height",$( window ).height());
	});



	
//------------------------------------------------------------------------
//					SUBSCRIBE FORM VALIDATION'S SETTINGS
//------------------------------------------------------------------------          
    $('#subscribe_form').validate({
        onfocusout: false,
        onkeyup: false,
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo( element.closest("form"));
        },
        messages: {
            email: {
                required: "We need your email address to contact you",
                email: "Please, enter a valid email"
            }
        },
					
        highlight: function(element) {
            $(element)
        },                    
					
        success: function(element) {
            element
            .text('').addClass('valid')
        }
    }); 
	

		
				
//------------------------------------------------------------------------------------
//						SUBSCRIBE FORM MAILCHIMP INTEGRATIONS SCRIPT
//------------------------------------------------------------------------------------		
    $('#subscribe_form').submit(function() {
        $('.error').hide();
        $('.error').fadeIn();
        // submit the form
        if($(this).valid()){
            $('#subscribe_submit').button('loading'); 
            var action = $(this).attr('action');
            $.ajax({
                url: action,
                type: 'POST',
                data: {
                    newsletter_email: $('#subscribe_email').val()
                },
                success: function(data) {
                    $('#subscribe_submit').button('reset');
					//Use modal popups to display messages
					$('#modalMessage .modal-title').html('<i class="icon icon-envelope-open"></i>' + data);
					$('#modalMessage').modal('show');
					
                },
                error: function() {
                    $('#subscribe_submit').button('reset');
					
					//Use modal popups to display messages
					$('#modalMessage .modal-title').html('<i class="icon icon-ban"></i>Oops!<br>Something went wrong!');
					$('#modalMessage').modal('show');
					
                }
            });
        }
        return false; 
    });
	  
	  
	  
	  
//------------------------------------------------------------------------------------
//						CONTACT FORM VALIDATION'S SETTINGS
//------------------------------------------------------------------------------------		  
    var validator = $('#contact_form').validate({
        onfocusout: false,
        onkeyup: true,
        rules: {
            name: "required",
            message: "required",
            email: {
                required: true,
                email: true
            }
        },
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        },
        messages: {
            name: "What's your name?",
            message: "Type your message",
            email: {
                required: "What's your email?",
                email: "Please, enter a valid email"
            }
        },
					
        highlight: function(element) {
            $(element)
            .text('').addClass('error');
            
        },                    
					
        success: function(element) {
            element
            .text('').addClass('valid')
        }
    });   


$('input').keypress( function(dd){
    validator.resetForm();
    $('#contact_submit').attr('disabled',false);
    } )

//------------------------------------------------------------------------------------
//								CONTACT FORM SCRIPT
//------------------------------------------------------------------------------------	
	
    $('#contact_form').submit(function() {
        // submit the form
        if($(this).valid()){
            $('#contact_submit').button('loading'); 
            var action = $(this).attr('action');
            $.ajax({
                url: action,
                type: 'POST',
                data: {
                    name: $('#contact_name').val(),
                    phone: $('#contact_phone').val(),
                    email: $('#type_form').val(),
                    age: $('#contact_age').val(),
                    gender: $("input[name=gender]:checked").val(),
                    urlstring: $('#querystring').val()
                },
                success: function() {
                    $('#contact_submit').button('reset');
					$('#modalContact').modal('hide');
                    
                    conversionposter();
					//Use modal popups to display messages
					$('#modalMessage .modal-title').html('<i class="icon icon-envelope-open"></i>Well done!<br>Your message has been successfully sent!');
					$('#modalMessage').modal('show');
                },
                error: function() {
                    $('#contact_submit').button('reset');
					$('#modalContact').modal('hide');
					
					//Use modal popups to display messages
					$('#modalMessage .modal-title').html('<i class="icon icon-ban"></i>Oops!<br>Something went wrong!');
					$('#modalMessage').modal('show');
                }
            });
        } else {
            // $('#contact_submit').button('reset')
        }
        // return false; 
    });	    
	  
	  

});