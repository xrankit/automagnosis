jQuery(function($){
  var swipers = [], winW, winH, winScr, $container, _isresponsive, smPoint = 768, mdPoint = 992, lgPoint = 1200, addPoint = 1600, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);

	function pageCalculations(){
		winW = $(window).width();
		winH = $(window).height();
		if($('.menu-button').is(':visible')) _isresponsive = true;
		else _isresponsive = false;
  }

  pageCalculations();

	function resizeCall(){
		pageCalculations();
	}
	if(!_ismobile){
		$(window).resize(function(){
			resizeCall();
		});
	} else{
		window.addEventListener("orientationchange", function() {
			resizeCall();
		}, false);
	}

	var tabFinish = 0;
	$('.tt-nav-tab-item').on('click', function(){
	    var $t = $(this);
	    if(tabFinish || $t.hasClass('active')) return false;
	    tabFinish = 1;
	    $t.closest('.tt-nav-tab').find('.tt-nav-tab-item').removeClass('active');
	    $t.addClass('active');
	    var index = $t.parent().parent().find('.tt-nav-tab-item').index(this);
	    $t.parents('.tt-tab-nav-wrapper').find('.tt-tab-select select option:eq('+index+')').prop('selected', true);
	    $t.closest('.tt-tab-wrapper').find('.tt-tab-info:visible').fadeOut(500, function(){
	    	var $tabActive  = $t.closest('.tt-tab-wrapper').find('.tt-tab-info').eq(index);
	    	$tabActive.css('display','block').css('opacity','0');
	    	tabReinit($tabActive.parents('.tt-tab-wrapper'));
	    	$tabActive.animate({opacity:1});
	    	 tabFinish = 0;
	    });
	});
	$('.tt-tab-select select').on('change', function(){
	    var $t = $(this);
	    if(tabFinish) return false;
	    tabFinish = 1;
	    var index = $t.find('option').index($(this).find('option:selected'));
	    $t.closest('.tt-tab-nav-wrapper').find('.tt-nav-tab-item').removeClass('active');
	    $t.closest('.tt-tab-nav-wrapper').find('.tt-nav-tab-item:eq('+index+')').addClass('active');
	    $t.closest('.tt-tab-wrapper').find('.tt-tab-info:visible').fadeOut(500, function(){
	    	var $tabActive  = $t.closest('.tt-tab-wrapper').find('.tt-tab-info').eq(index);
	    	$tabActive.css('display','block').css('opacity','0');
	    	tabReinit($tabActive.parents('.tt-tab-wrapper'));
	    	$tabActive.animate({opacity:1});
	    	 tabFinish = 0;
	    });
	});
	function tabReinit($tab){
		$tab.find('.swiper-container').each(function(){
			var thisSwiper = swipers['swiper-'+$(this).attr('id')];
			thisSwiper.update();
    });
	}

	//menu
	$('.cmn-toggle-switch').on('click', function(e){
		$(this).toggleClass('active');
		$(this).parents('header').find('.toggle-block').slideToggle();
		e.preventDefault();
	});
	$('.main-nav .menu-toggle').on('click', function(e){
		$(this).closest('li').addClass('select').siblings('.select').removeClass('select');
		$(this).closest('li').siblings('.parent').find('ul').slideUp();
		$(this).parent().siblings('ul').slideToggle();
		e.preventDefault();
	});
});
