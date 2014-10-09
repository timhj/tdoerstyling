// http://lions-mark.com/jquery/scrollTo/
$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}

// hide location find on map
function locationInputInit()
{

	setTimeout(function(){
		if($('input[name="thing[isEverywhere]"]:checked').val() == 'yes'){
			$('#place-wrappers').slideUp();
			$('#field-container-proximity').slideUp();
		} else {
			// was down to start with by default.
		}
	},3500);
		
	$('input[name="thing[isEverywhere]"]').click(function(){
		if($(this).val() == 'yes'){
			$('#place-wrappers').slideUp();
			$('#field-container-proximity').slideUp();
		} else {
			$('#place-wrappers').slideDown();
			$('#field-container-proximity').slideDown();
		}
	});
}

var collectionEdit = {
		type : 'distance',
		init : function() {
			$('#type').change(function(){
				$('form#collection div').show();
				collectionEdit.type = $('#type').val();
				if(collectionEdit.type == 'list') {
					$('#field-container-place_id,#field-container-searchParams,#field-container-thing_id,#field-container-featureThingBlurb,#field-container-distance').hide();
				} else if(collectionEdit.type == 'distance') {
					$('#firstTwenty,#field-container-searchParams,#field-container-thing_id,#field-container-featureThingBlurb').hide();
				} else {
					alert('This collection isn\'t ready yet');
				}				
			});
		}
}

var thingInput = {
		checkPriceInput : function() {
			var errorMessage = '';
			var intValue = parseFloat($('#field-container-price input#price').val());
	        if(isNaN(intValue)) {
	            errorMessage = 'Input needs to be a valid number';
	            $('#is_free').prop('checked', false);
	        } else if(intValue > 0) {
	        	$('#is_free').prop('checked', false);
	        }
	        var errorOn = errorMessage != '' ? true : false;
			$("#field-container-price .error-messages").text(errorMessage);
			$("#field-container-price").toggleClass('error',errorOn);
		},
		addFreeCheckbox : function() {
			$('div#field-container-price span.form-input-bits').prepend('<input type="radio" name="is_free" id="is_free" value="true"> <label for="is_free">It\'s Free!</label> <input type="radio" name="is_free" id="not_free" value="true"> ');
			$('div#field-container-price span.form-input-bits #price').wrap('<label for="not_free"></label>');
			$('#is_free').click(function(){
				if($(this).is(':checked')){
					$('#price').val('0.00');
					thingInput.checkPriceInput();
				} 
			})
			$('#not_free').click(function(){
				if($(this).is(':checked')){
					$('#price').focus();
				}
			});
			
		},
		labelBackgroundToggleInit : function()
		{
			$('.form-input-bits .checkbox').each(function(){
				if($(this).find('input[type="checkbox"]').prop('checked')){
					$(this).addClass('on');
				}
			});
			
			$('.form-input-bits .checkbox.opts label.checkbox').click(function(){
				if($(this).find('input[type="checkbox"]').prop('checked')){
					$(this).addClass('on');
				} else {
					$(this).removeClass('on');
				}
			});

		},
		init : function() {
			thingInput.addFreeCheckbox();
			thingInput.labelBackgroundToggleInit();
			$('#field-container-price input#price').keyup(function () {
				thingInput.checkPriceInput();
			});
			$('#field-container-price input#price').focus(function () {
				thingInput.checkPriceInput();
			});
			$('#field-container-price input#price').change(function () {
				var intVal = parseFloat($(this).val());
				if(isNaN(intVal)) {
					$(this).val('0.00');
				} else {
					$(this).val(intVal);
				}
				thingInput.checkPriceInput();
			});
//			$('#weblink-wrappers input#url').change(function () {
//				if($(this).val())
//			}			
		}
}

var advancedSearch = {
	weathers : 0,
	cost : null,
	showAllFilters : function() {
		$('#money-opts').slideDown();
		$('#weather-opts label.checkbox').slideDown();
		$('.advanced-search .module-content').slideDown();
		$('.advanced-search .module-footer').slideDown();
		$('#weather-opts').slideDown();
	},
	hideFilters : function() {
		$('.advanced-search .module-content,.advanced-search .module-footer').slideUp();
		$('.advanced-search .module-footer').hide();
	},
	filterToggle : function() {
		if($('#search-toggle').text() == '-'){
			$('#search-toggle').text('+');
			advancedSearch.hideFilters();
		} else {
			$('#search-toggle').text('-');
			advancedSearch.showAllFilters();
		}

	},
	init : function() {			
		// count number of active weathers and store it
		$('#weather-opts label.checkbox').has('input:checked').each(function(){
			advancedSearch.weathers++;
		});
		// no cost filters are set, slide the box up 
		if($('input#cost').val() == '' && !($('input#not_free').checked) && !($('input#cost_free').checked)) {
			$('#money-opts').slideUp();
		} else {
			advancedSearch.cost = $('input#cost').val(); 
		}
		// if no weathers then hide full box.
		if(advancedSearch.weathers == 0) {
			$('#weather-opts').slideUp();
		} 
		// no advanced anything set then hide it.
		if(advancedSearch.weathers == 0 && advancedSearch.cost == null){
			advancedSearch.hideFilters();
		} 
		
		// add the advanced search click event handlers
		$('.advanced-search .module-header').click(function(){
			advancedSearch.filterToggle();
		});
		$('input#cost_free').click(function(){
			$('input#cost').val('0');
		});
		$('input#not_free').click(function(){
			$('input#cost').focus();
		});
		
		$('input#cost').click(function(){
			$('input#not_free').click();
		});
		$('#refine-button').click(function(){
			$('.module.advanced-search form').submit();
		});
	}
}

function blockEnter()
{
	$(window).keydown(function(event){
		if(event.keyCode == 13 && !$('textarea#description').is(':focus')) {
			event.preventDefault();
			return false;
		}
	});	
}

//srcwidth/srcheight are the dimensions of the orignal image
//targetwidth and targetheight are the dimensions of the rendering area
//fLetterBox implies "add black bars" if true.  If false, the image is "zoomed" (cropped on one dimension) such that it fills the entire target space
//The result object returned has the following properties:
//  width: width to scale the image to
//  height: height to scale the image to
//  targetleft: position relative to the left edge of the target to center the image (can be negative when fLetterBox is false)
//  targettop: position relative to the top edge of the target to center the image (can be negative when fLetterBox is false)
function ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {

 var result = { width: 0, height: 0, fScaleToTargetWidth: true };

 if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
     return result;
 }

 // scale to the target width
 var scaleX1 = targetwidth;
 var scaleY1 = (srcheight * targetwidth) / srcwidth;

 // scale to the target height
 var scaleX2 = (srcwidth * targetheight) / srcheight;
 var scaleY2 = targetheight;

 // now figure out which one we should use
 var fScaleOnWidth = (scaleX2 > targetwidth);
 if (fScaleOnWidth) {
     fScaleOnWidth = fLetterBox;
 }
 else {
     fScaleOnWidth = !fLetterBox;
 }

 if (fScaleOnWidth) {
     result.width = Math.floor(scaleX1);
     result.height = Math.floor(scaleY1);
     result.fScaleToTargetWidth = true;
 }
 else {
     result.width = Math.floor(scaleX2);
     result.height = Math.floor(scaleY2);
     result.fScaleToTargetWidth = false;
 }
 result.targetleft = Math.floor((targetwidth - result.width) / 2);
 result.targettop = Math.floor((targetheight - result.height) / 2);

 return result;
}

function RememberOriginalSize(img) {

    if (!img.originalsize) {
        img.originalsize = {width : img.width, height : img.height};
    }

}


function FixImage(fLetterBox, div, img) {

    RememberOriginalSize(img);

    var targetwidth = $(div).width();
    var targetheight = $(div).height();
    var srcwidth = img.originalsize.width;
    var srcheight = img.originalsize.height;
    var result = ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox);

    img.width = result.width;
    img.height = result.height;
    $(img).css("left", result.targetleft);
    $(img).css("top", result.targettop);
}

function StretchImage(div, img) {

    RememberOriginalSize(img);

    var targetwidth = $(div).width();
    var targetheight = $(div).height();

    img.width = targetwidth;
    img.height = targetheight;
    $(img).css("left", 0);
    $(img).css("top", 0);
}


function FixImages(fLetterBox) {
    $("div.image-promo-wrapper").each(function (index, div) {
        var img = $(div).find("img").get(0);
        FixImage(fLetterBox, div, img);
    });
}

function StretchImages() {
    $("div.image-promo-wrapper").each(function (index, div) {
        var img = $(div).find("img").get(0);
        StretchImage(div, img);
    });
}

//var browserLocation {
//	getLocation: function(callback) {
//		if (navigator.geolocation) {
//			navigator.geolocation.getCurrentPosition(callback);
//		} else {
//			console.log('Geolocation not supported by this browser');
//		}
//	},
//	showError: function(error) {
//	    switch(error.code) {
//	        case error.PERMISSION_DENIED:
//	            return "User denied the request for Geolocation."
//	            break;
//	        case error.POSITION_UNAVAILABLE:
//	            return "Location information is unavailable."
//	            break;
//	        case error.TIMEOUT:
//	            return "The request to get user location timed out."
//	            break;
//	        case error.UNKNOWN_ERROR:
//	            return "An unknown error occurred."
//	            break;
//	    }
//	}
//}