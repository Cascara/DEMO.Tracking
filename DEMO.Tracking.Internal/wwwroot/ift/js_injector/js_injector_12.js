jQuery(document).ready(function (){
    fontReset();
   jQuery("#fontSize").val(0);
	    jQuery('#btn_search_minus').click(function () {
                fontMinus();
            });
            jQuery("#btn_search_plus").click(function () {
                fontPlus();
            });
            jQuery("#btn_font").click(function () {
                fontReset();
            });
            jQuery("#btn_search_reset1").click(function () {
                fontReset();
            });

            jQuery('#btn_search_minus1').click(function () {
                fontMinus();
            });
            jQuery("#btn_search_plus1").click(function () {
                fontPlus();
            });

            function fontReset() {
                 jQuery("#fontSize").val(0);
                jQuery("span:not(#spanSearch,h1,h2,h3,.h1,.h2,.h3,.t1,.t2,.t3,.t4,.t5,.t6,.t7,.selected,.unselected,.fa)").css({ 'font-size': '14px' });
                jQuery("span.t1").css({ 'font-size': "12px" });
                jQuery("span.t2").css({ 'font-size':  "13px" });
                jQuery("span.t3").css({ 'font-size': "21px" });
                jQuery("span.t4").css({ 'font-size':  "16px" });
                jQuery("span.t5").css({ 'font-size':  "13px" });
                jQuery("span.t6").css({ 'font-size':  "13px" });
                jQuery("span.t7").css({ 'font-size':  "11px" });
                jQuery("h1,span.h1").css({ 'font-size':  "28px" });
                jQuery("h2,span.h2").css({ 'font-size': "21px" });
                jQuery("h3,span.h3").css({ 'font-size':  "17px" });
               
            }

            function fontMinus() {
				var fontSize=Number(jQuery("#fontSize").val());
               if(fontSize < -4)
                    return 0;
               fontSize--;
				jQuery("#fontSize").val(fontSize);
               
                fontSize = parseInt(jQuery("span.t1").css("font-size"));
                fontSize = fontSize - 1 + "px";
				jQuery("span.t1:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });

                fontSize = parseInt(jQuery("span.t2").css("font-size"));
				fontSize = fontSize - 1 + "px";
				jQuery("span.t2:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
				fontSize = parseInt(jQuery("span.t3").css("font-size"));
                fontSize = fontSize - 1 + "px";
				jQuery("span.t3:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span.t4").css("font-size"));
                fontSize = fontSize - 1 + "px";
				jQuery("span.t4:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
				fontSize = parseInt(jQuery("span.t5").css("font-size"));
                fontSize = fontSize - 1 + "px";
				jQuery("span.t6:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });

                fontSize = parseInt(jQuery("span.t6").css("font-size"));
                fontSize = fontSize - 1 + "px";
				jQuery("span.t6:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
				
                fontSize = parseInt(jQuery("span.t7").css("font-size"));
                fontSize = fontSize - 1 + "px";
                jQuery("span.t7:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span.h1, h1").css("font-size"));
                fontSize = fontSize - 1 + "px";
				jQuery("h1,span.h1:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span.h2, h2").css("font-size"));
                fontSize = fontSize - 1 + "px";
				jQuery("h2,span.h2:not(#spanSearch,.panelFloatSlideText>h2)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span.h3, h3").css("font-size"));
                fontSize = fontSize - 1 + "px";
                jQuery("h3,span.h3:not(#spanSearch)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span").css("font-size"));
                fontSize = fontSize - 1 + "px";
				jQuery("span:not(#spanSearch,h1,h2,h3,.h1,.h2,.h3,.t1,.t2,.t3,.t4,.t5,.t6,.t7,.selected,.unselected,.fa)").css({ 'font-size': fontSize });
                
            }

            function fontPlus() {

               var fontSize=Number(jQuery("#fontSize").val());
               if(fontSize > 4)
                    return 0;
               fontSize++;
				jQuery("#fontSize").val(fontSize);
				
               
                fontSize = parseInt(jQuery("span.t1").css("font-size"));
                fontSize = fontSize + 1 + "px";
                jQuery("span.t1:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });

                fontSize = parseInt(jQuery("span.t2").css("font-size"));
                fontSize = fontSize + 1 + "px";
                jQuery("span.t2:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });

                fontSize = parseInt(jQuery("span.t3").css("font-size"));
                fontSize = fontSize + 1 + "px";
                jQuery("span.t3:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });

                fontSize = parseInt(jQuery("span.t4").css("font-size"));
                fontSize = fontSize + 1 + "px";
				jQuery("span.t4:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span.t5").css("font-size"));
                fontSize = fontSize + 1 + "px";
				jQuery("span.t6:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span.t6").css("font-size"));
                fontSize = fontSize + 1 + "px";
				jQuery("span.t6:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span.t7").css("font-size"));
                fontSize = fontSize + 1 + "px";
				jQuery("span.t7:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span.h1, h1").css("font-size"));
				fontSize = fontSize + 1 + "px";
				jQuery("h1,span.h1:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span.h2, h2").css("font-size"));
                fontSize = fontSize + 1 + "px";
                jQuery("h2,span.h2:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });
                
                fontSize = parseInt(jQuery("span.h3, h3").css("font-size"));
                fontSize = fontSize + 1 + "px";
				jQuery("h3,span.h3:not(#spanSearch,.selected,.unselected)").css({ 'font-size': fontSize });

                fontSize = parseInt(jQuery("span").css("font-size"));
                fontSize = fontSize + 1 + "px";
				jQuery("span:not(#spanSearch,h1,h2,h3,.h1,.h2,.h3,.t1,.t2,.t3,.t4,.t5,.t6,.t7,.selected,.unselected,.fa)").css({ 'font-size': fontSize });
                
            }
});