function findOutputForSlider(e){var t=e.id;outputs=document.getElementsByTagName("output");for(var i=0;i<outputs.length;i++)if(outputs[i].htmlFor==t)return outputs[i]}function getSliderOutputPosition(e){var t,i,a=window.getComputedStyle(e,null);sliderWidth=parseInt(a.getPropertyValue("width"),10),i=e.getAttribute("min")?e.getAttribute("min"):0;var s=(e.value-i)/(e.getAttribute("max")-i);return t=s<0?0:s>1?sliderWidth:sliderWidth*s,{position:t+"px"}}!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof module&&"object"==typeof module.exports?require("jquery"):jQuery)}(function(e){function t(){var t=n.settings;if(t.autoDispose&&!e.contains(document.documentElement,this))return e(this).timeago("dispose"),this;var r=i(this);return isNaN(r.datetime)||(0===t.cutoff||Math.abs(s(r.datetime))<t.cutoff?e(this).text(a(r.datetime)):e(this).attr("title").length>0&&e(this).text(e(this).attr("title"))),this}function i(t){if(t=e(t),!t.data("timeago")){t.data("timeago",{datetime:n.datetime(t)});var i=e.trim(t.text());n.settings.localeTitle?t.attr("title",t.data("timeago").datetime.toLocaleString()):!(i.length>0)||n.isTime(t)&&t.attr("title")||t.attr("title",i)}return t.data("timeago")}function a(e){return n.inWords(s(e))}function s(e){return(new Date).getTime()-e.getTime()}e.timeago=function(t){return a(t instanceof Date?t:"string"==typeof t?e.timeago.parse(t):"number"==typeof t?new Date(t):e.timeago.datetime(t))};var n=e.timeago;e.extend(e.timeago,{settings:{refreshMillis:6e4,allowPast:!0,allowFuture:!1,localeTitle:!1,cutoff:0,autoDispose:!0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",inPast:"any moment now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(t){function i(i,s){var n=e.isFunction(i)?i(s,t):i,r=a.numbers&&a.numbers[s]||s;return n.replace(/%d/i,r)}if(!this.settings.allowPast&&!this.settings.allowFuture)throw"timeago allowPast and allowFuture settings can not both be set to false.";var a=this.settings.strings,s=a.prefixAgo,n=a.suffixAgo;if(this.settings.allowFuture&&t<0&&(s=a.prefixFromNow,n=a.suffixFromNow),!this.settings.allowPast&&t>=0)return this.settings.strings.inPast;var r=Math.abs(t)/1e3,o=r/60,l=o/60,c=l/24,d=c/365,u=r<45&&i(a.seconds,Math.round(r))||r<90&&i(a.minute,1)||o<45&&i(a.minutes,Math.round(o))||o<90&&i(a.hour,1)||l<24&&i(a.hours,Math.round(l))||l<42&&i(a.day,1)||c<30&&i(a.days,Math.round(c))||c<45&&i(a.month,1)||c<365&&i(a.months,Math.round(c/30))||d<1.5&&i(a.year,1)||i(a.years,Math.round(d)),p=a.wordSeparator||"";return void 0===a.wordSeparator&&(p=" "),e.trim([s,u,n].join(p))},parse:function(t){var i=e.trim(t);return i=i.replace(/\.\d+/,""),i=i.replace(/-/,"/").replace(/-/,"/"),i=i.replace(/T/," ").replace(/Z/," UTC"),i=i.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),i=i.replace(/([\+\-]\d\d)$/," $100"),new Date(i)},datetime:function(t){var i=n.isTime(t)?e(t).attr("datetime"):e(t).attr("title");return n.parse(i)},isTime:function(t){return"time"===e(t).get(0).tagName.toLowerCase()}});var r={init:function(){r.dispose.call(this);var i=e.proxy(t,this);i();var a=n.settings;a.refreshMillis>0&&(this._timeagoInterval=setInterval(i,a.refreshMillis))},update:function(i){var a=i instanceof Date?i:n.parse(i);e(this).data("timeago",{datetime:a}),n.settings.localeTitle&&e(this).attr("title",a.toLocaleString()),t.apply(this)},updateFromDOM:function(){e(this).data("timeago",{datetime:n.parse(n.isTime(this)?e(this).attr("datetime"):e(this).attr("title"))}),t.apply(this)},dispose:function(){this._timeagoInterval&&(window.clearInterval(this._timeagoInterval),this._timeagoInterval=null)}};e.fn.timeago=function(e,t){var i=e?r[e]:r.init;if(!i)throw new Error("Unknown function name '"+e+"' for timeago");return this.each(function(){i.call(this,t)}),this},document.createElement("abbr"),document.createElement("time")}),function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){var t=Array.prototype.slice,i=Array.prototype.splice,a={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:"",widthFromWrapper:!0,responsiveWidth:!1,zIndex:"auto"},s=e(window),n=e(document),r=[],o=s.height(),l=function(){for(var t=s.scrollTop(),i=n.height(),a=i-o,l=t>a?a-t:0,c=0,d=r.length;c<d;c++){var u=r[c],p=u.stickyWrapper.offset().top,h=p-u.topSpacing-l;if(u.stickyWrapper.css("height",u.stickyElement.outerHeight()),t<=h)null!==u.currentTop&&(u.stickyElement.css({width:"",position:"",top:"","z-index":""}),u.stickyElement.parent().removeClass(u.className),u.stickyElement.trigger("sticky-end",[u]),u.currentTop=null);else{var f=i-u.stickyElement.outerHeight()-u.topSpacing-u.bottomSpacing-t-l;if(f<0?f+=u.topSpacing:f=u.topSpacing,u.currentTop!==f){var m;u.getWidthFrom?m=e(u.getWidthFrom).width()||null:u.widthFromWrapper&&(m=u.stickyWrapper.width()),null==m&&(m=u.stickyElement.width()),u.stickyElement.css("width",m).css("position","fixed").css("top",f).css("z-index",u.zIndex),u.stickyElement.parent().addClass(u.className),null===u.currentTop?u.stickyElement.trigger("sticky-start",[u]):u.stickyElement.trigger("sticky-update",[u]),u.currentTop===u.topSpacing&&u.currentTop>f||null===u.currentTop&&f<u.topSpacing?u.stickyElement.trigger("sticky-bottom-reached",[u]):null!==u.currentTop&&f===u.topSpacing&&u.currentTop<f&&u.stickyElement.trigger("sticky-bottom-unreached",[u]),u.currentTop=f}var g=u.stickyWrapper.parent();u.stickyElement.offset().top+u.stickyElement.outerHeight()>=g.offset().top+g.outerHeight()&&u.stickyElement.offset().top<=u.topSpacing?u.stickyElement.css("position","absolute").css("top","").css("bottom",0).css("z-index",""):u.stickyElement.css("position","fixed").css("top",f).css("bottom","").css("z-index",u.zIndex)}}},c=function(){o=s.height();for(var t=0,i=r.length;t<i;t++){var a=r[t],n=null;a.getWidthFrom?a.responsiveWidth&&(n=e(a.getWidthFrom).width()):a.widthFromWrapper&&(n=a.stickyWrapper.width()),null!=n&&a.stickyElement.css("width",n)}},d={init:function(t){var i=e.extend({},a,t);return this.each(function(){var t=e(this),s=t.attr("id"),n=s?s+"-"+a.wrapperClassName:a.wrapperClassName,o=e("<div></div>").attr("id",n).addClass(i.wrapperClassName);t.wrapAll(o);var l=t.parent();i.center&&l.css({width:t.outerWidth(),marginLeft:"auto",marginRight:"auto"}),"right"===t.css("float")&&t.css({float:"none"}).parent().css({float:"right"}),i.stickyElement=t,i.stickyWrapper=l,i.currentTop=null,r.push(i),d.setWrapperHeight(this),d.setupChangeListeners(this)})},setWrapperHeight:function(t){var i=e(t),a=i.parent();a&&a.css("height",i.outerHeight())},setupChangeListeners:function(e){if(window.MutationObserver){new window.MutationObserver(function(t){(t[0].addedNodes.length||t[0].removedNodes.length)&&d.setWrapperHeight(e)}).observe(e,{subtree:!0,childList:!0})}else e.addEventListener("DOMNodeInserted",function(){d.setWrapperHeight(e)},!1),e.addEventListener("DOMNodeRemoved",function(){d.setWrapperHeight(e)},!1)},update:l,unstick:function(t){return this.each(function(){for(var t=this,a=e(t),s=-1,n=r.length;n-- >0;)r[n].stickyElement.get(0)===t&&(i.call(r,n,1),s=n);-1!==s&&(a.unwrap(),a.css({width:"",position:"",top:"",float:"","z-index":""}))})}};window.addEventListener?(window.addEventListener("scroll",l,!1),window.addEventListener("resize",c,!1)):window.attachEvent&&(window.attachEvent("onscroll",l),window.attachEvent("onresize",c)),e.fn.sticky=function(i){return d[i]?d[i].apply(this,t.call(arguments,1)):"object"!=typeof i&&i?void e.error("Method "+i+" does not exist on jQuery.sticky"):d.init.apply(this,arguments)},e.fn.unstick=function(i){return d[i]?d[i].apply(this,t.call(arguments,1)):"object"!=typeof i&&i?void e.error("Method "+i+" does not exist on jQuery.sticky"):d.unstick.apply(this,arguments)},e(function(){setTimeout(l,0)})}),document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll('input[type="range"].slider');[].forEach.call(e,function(e){var t=findOutputForSlider(e);if(t){if(e.classList.contains("has-output-tooltip")){var i=getSliderOutputPosition(e);t.style.left=i.position}e.addEventListener("input",function(e){if(e.target.classList.contains("has-output-tooltip")){var i=getSliderOutputPosition(e.target);t.style.left=i.position}t.value=e.target.value})}})}),function(e){e(function(){function t(e){var t=e.id;outputs=document.getElementsByTagName("output");for(var i=0;i<outputs.length;i++)if(outputs[i].htmlFor==t)return outputs[i]}function i(e){var t,i,a=window.getComputedStyle(e,null);sliderWidth=parseInt(a.getPropertyValue("width"),10),i=e.getAttribute("min")?e.getAttribute("min"):0;var s=(e.value-i)/(e.getAttribute("max")-i);return t=s<0?0:s>1?sliderWidth:sliderWidth*s,{position:t+"px"}}!function(){e("header").sticky({topSpacing:0}),e(".navbar-burger").on("click",function(){e(this).addClass("is-active"),e("#menu").addClass("is-active")}),e("#menu .close").on("click",function(){e(".navbar-burger").removeClass("is-active"),e("#menu").removeClass("is-active")})}(),function(){e(".owl-carousel.autoplay").owlCarousel({autoplay:!0,autoplayTimeout:8e3,smartSpeed:1e3,autoWidth:!1,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e(".owl-carousel").not("#prizes-gallery .gallery, .owl-carousel.autoplay, .jury-preview").owlCarousel({autoWidth:!1,smartSpeed:1e3,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e("#prizes-gallery .gallery").owlCarousel({autoplay:!0,autoplayTimeout:8e3,smartSpeed:2e3,autoWidth:!0,center:!0,loop:!0,nav:!0,items:2,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e(".jury-preview").owlCarousel({autoWidth:!1,smartSpeed:1e3,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]})}(),function(){function t(){e("#datum_19951").css("background","#FFF5F5"),e(".wpuf_submit_19951").prop("disabled",!0).css("cursor","default")}function i(){e("#datum_19951").css("background","#FFF"),e(".wpuf_submit_19951").prop("disabled",!1).css("cursor","pointer")}function a(e,t){var i=new Image;i.src=e,i.onload=function(){t(this.width,this.height)}}function s(){var t=e(".kategorie .wpuf-fields").find("input:checked"),i=t.val();console.log(i);var a=e(".datei, .post_title, .datum, .standort, .part-2, .part-3, .wpuf-submit"),s=e(".serienname, .series_counter");if(a.show(),e(".max").hide(),"foto"==i)s.hide();else if("serie"==i){s.show();var n=r.totalseriescount,l=50-n;if(r.total.serie>=1&&(r.serienname||c)){var d=e('input[name="serienname"]');d.val(r.serienname),d.attr("disabled","disabled").css("cursor","no-drop"),d.closest(".wpuf-fields").find(".wpuf-help").not(".wpuf-wordlimit-message").text("")}if(l>0||r.total.serie>0||c){var u="Es wurden bereits "+n+" von 50 möglichen Serien eingereicht.",p='<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">'+u+"</p>";e(".series_counter").length<1&&0==r.total.serie&&!c&&e(".part-2").prepend(p),s.show()}else{a.hide();var u="Das Limit von 50 möglichen Serien-Einsendungen ist bereits erreicht.",p='<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">'+u+"</p>";e(".wpuf-form .wpuf-el:first").after(p),e(".wpuf-el.serienname").hide()}e(".wpuf-el.serienname label").html('Serientitel <span class="required">*</span>')}else"karikatur"==i&&(s.hide(),e('label[for="datum"]').html('Erscheinungsdatum <span class="required">*</span>'),e('label[for="standort"]').html('Veröffentlicht in folgender Zeitung <span class="required">*</span>'),e('label[for="datum_19951"]').html('Erscheinungsdatum <span class="required">*</span>'),e('label[for="standort_19951"]').html('Veröffentlicht in folgender Zeitung <span class="required">*</span>'));r.total[i]<o[i].max&&r.total[i]<o[i].min&&console.log("too few "+i),r.total[i]<o[i].max&&r.total[i]>o[i].min&&console.log("not too few, not too many "+i);var h=window.location.search,f=new URLSearchParams(h),m=f.getAll("function");if(m&&"bearbeiten"==m[0])var g=!0;else var g=!1;r.total[i]>=o[i].max&&!g&&(console.log("max "+i),a.hide(),s.hide(),e(".error.max").length?e(".max").show():e(".kategorie").after('<li class="error max"><p><b>Sollten Sie ihre Bildauswahl ändern wollen, löschen Sie bitte zuerst unter &bdquo;Bildaktualisierung&ldquo; die Datei/Dateien, die Sie nicht zum Wettbewerb einreichen möchten und laden dann die neuen Bilddateien hoch.</b></p></li>'))}if(e("body").hasClass("page-id-19949")||e("body").hasClass("page-id-19936")){console.log("uploadFormStuff()"),e("#datum_19951").on("input",function(a){var s=e(this).val();console.log(s);var n=s.split("."),r=parseInt(n[0]),o=parseInt(n[1]),l=parseInt(n[2]),c=parseInt(1e4*l+100*o+r),d=new Date,u=d.getDate(),p=d.getMonth()+1,h=d.getFullYear();c<=parseInt(1e4*h+100*p+u)&&c>=20181130?(console.log("entered date smaller than todays date & entered date is larger than start date"),i()):(console.log("date out of range"),t())}),e(".wpuf-submit-button").on("click",function(){setTimeout(function(){console.log("fix english form errors"),e(".wpuf-error-msg").each(function(){var t=e(this).text();console.log(t),"Bildbeschriftung is required"==t&&e(this).text("Bitte Bildunterschrift hinzufügen"),"Aufnahmeort is required"==t&&e(this).text("Bitte Aufnahmeort hinzufügen"),"Aufnahmedatum is required"==t&&e(this).text("Bitte Aufnahmedatum hinzufügen"),"Datei is required"==t&&e(this).text("Bitte Datei hinzufügen"),"Please fix the errors to proceed"==t&&e(this).text(""),""==t&&e(this).text("Bitte die fehlenden Felder ausfüllen um fortzufahren")})},100)});var n=!1;e(document).on("DOMSubtreeModified",function(){if(!n){var s=e(".wpuf-attachment-list .attachment-name img");if(s.length){var r=s.attr("src");r&&(foundImg=!0);var o=s.attr("alt"),l=r.substring(0,r.lastIndexOf("/")),c=r.split(".").pop();n=l+"/"+o+"."+c,console.log(n),a(n,function(a,s){if(a<1200&&a>1){console.log("too small"),t();var r=e('<div class="file-warning" style="color: red; font-weight: bold;">Dieses Bild ist zu klein. Bitte lade in höherer Auflösung hoch.</div>');e(".file-warning").length<1&&e("#wpuf-datei-19951-upload-container").after(r),n=!1}else e(".file-warning").remove(),i()})}}});var r=e("#state").data("state");console.log("---- state -----"),console.log(r),console.log("----------------");var o={foto:{min:2,max:4},serie:{min:4,max:6},karikatur:{min:2,max:6}};"fotograf"===r.usertype&&e('input[value="karikatur"]').parent().hide(),"karikaturist"===r.usertype&&(e('input[value="foto"]').parent().hide(),e('input[value="serie"]').parent().hide(),e('input[value="karikatur"]').prop("checked",!0),s()),e(".wpuf-el.kategorie").on("change",function(){s()});var l=window.location.pathname,c=!1;l.indexOf("edit")>=0&&(c=!0,console.log("isEdit"),s()),"P2J5cGFzc1Nlcmllc0NvdW50ZXI9UFlwN2Z3RWVneEJEU005ZA=="==btoa(window.location.search)&&(c=!0,e(".part-1").prepend("<p>[Bypassed series counter]</p>"))}}(),function(){e("body").hasClass("um-page-register")&&e("#confirm_user_password-20047").attr("placeholder","Passwort wiederholen")}(),function(){function t(t){var i=e(".series-image.current"),a=null;if("prev"==t&&i.prev().length?(a=i.prev().find("a.zoom").data("zoom"),e(".series-image.current").removeClass("current"),i.prev().addClass("current")):"next"==t&&i.next().length&&(a=i.next().find("a.zoom").data("zoom"),e(".series-image.current").removeClass("current"),i.next().addClass("current")),null!==a){const s='<img src="'+a+'">';e("#zoom .image").html(s)}}e("a.change-tag").on("click",function(t){t.preventDefault();var i=(e(this),e(this).data("new_tag")),a=e('.tagcount[data-tag="'+i+'"]:first'),s=e('.tagcount[data-tag="'+i+'"]'),n=parseInt(a.text());e(".loading").show();var r=e(this).attr("href"),o=e('a[href="'+r+'"');o.find(".tagcount"),e.ajax({url:r}).done(function(t){if(e(".loading").hide(),"true"==t){if(o.hasClass("is-light")){o.removeClass("is-light"),o.find(".icon").addClass("is-hidden");var i=o.attr("href");o.attr("href",i.replace("false","true")),n-=1}else{o.addClass("is-light"),o.find(".icon").removeClass("is-hidden");var i=o.attr("href");o.attr("href",i.replace("true","false")),n+=1}s.text(n)}else alert("error saving tag")})}),e("a.zoom").on("click",function(t){e(this).parent().addClass("current");const i=e(this).data("zoom"),a='<img src="'+i+'">';e("#zoom .image").html(a),e("#zoom").show(),t.preventDefault()}),e("#zoom .close").on("click",function(t){e("#zoom").hide(),e("#zoom .image img").remove(),e(".current").removeClass("current"),t.preventDefault()}),e(document).keydown(function(e){switch(e.which){case 37:t("prev");break;case 39:t("next");break;default:return}e.preventDefault()})}(),function(){function t(e){var t="[\\?&]"+e+"=([^&#]*)",i=new RegExp(t),a=window.location.href,s=i.exec(a);return null==s?"":s[1]}function i(){var i=t("tag");if(i)i&&(e(".user").addClass("show"),e("h2.title").hide(),e(".hideOnTag").hide());else{e(".user.show").removeClass("show");var a=r()-1;e(".user").eq(a).addClass("show"),e(".counter .count").html(r())}1==r()?e("button.prev").prop("disabled",!0):e("button.prev").prop("disabled",!1),r()==o?e("button.next").prop("disabled",!0):e("button.next").prop("disabled",!1)}function a(t){var i=e(".modal.is-active");if(i.removeClass("is-active"),"prev"==t){var a=i.closest(".box").parent().prev().find(".modal");a.addClass("is-active");var s=a.find("img").data("src");a.find("img").attr("src",s)}if("next"==t){var a=i.closest(".box").parent().next().find(".modal");a.addClass("is-active");var s=a.find("img").data("src");a.find("img").attr("src",s)}}function s(){return r()>1?r()-1:1}function n(){return r()<o?r()+1:o}function r(){return parseInt(window.location.hash.substring(1))}if(e("body").hasClass("page-template-jury_system")){e(".loading").hide();var o=e("div.user").length;console.log("total = "+o),r()?i():window.location.hash="#1",e(window).on("hashchange",function(e){i()}),e(".counter .total").html(o),e("a.zoom").on("click",function(){var t=e(this).closest(".wrapper").find(".modal");t.addClass("is-active");var i=t.find("img").data("src");t.find("img").attr("src",i)}),e(".showname").change(function(t){e(this).is(":checked")?(e(".name-off").hide(),e(".name-on").show()):(e(".name-off").show(),e(".name-on").hide())}),e(".showinfo").change(function(t){e(this).is(":checked")?e(".box .text.hide").removeClass("hide"):e(".box .text").addClass("hide")}),e(".showfile").change(function(t){e(this).is(":checked")?e(".box .file.hide").removeClass("hide"):e(".box .file").addClass("hide")}),e("button.pager").on("click",function(t){console.log(e(this)),e(this).hasClass("next")?window.location.hash="#"+n():window.location.hash="#"+s()}),e(document).keydown(function(e){switch(e.which){case 37:a("prev");break;case 39:a("next");break;default:return}e.preventDefault()})}}();var a,s,n,r;new Date;a=e("body").hasClass("page-id-78")?"teilnehmer":e("body").hasClass("page-id-82")?"archiv":e("body").hasClass("page-id-199")?"shortlist":"other",e(".dropdown-trigger").on("click",function(){e(this).parent().toggleClass("is-active")}),e(".dropdown-item").on("click",function(){e(".dropdown").removeClass("is-active")}),e(".modal-close").on("click",function(){e(this).closest(".modal").removeClass("is-active")}),e(document).keyup(function(t){27===t.keyCode&&e(".modal").removeClass("is-active")}),console.log("WP API > "+a),function(){function t(){o({target:d.target,w:d.winners,y:d.year,c:d.category,s:d.search,pg:d.paged,pp:d.per_page,filter_series:d.filter_series,shortlist:d.shortlist})}function i(){var t=d.section,i=e("#archiv");console.log("setSection(): "+t),"winners"==t&&(d.winners="INCLUDE,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1,photo_prize_first,photo_prize_2,photo_prize_3,photo_public,cartoon_public",d.target=".section.winners .columns",d.filter_series=!0,d.search="",d.paged=1,d.category="",i.find('*[data-section="winners"]').show(),i.find('*[data-section="archive"]').hide()),"archive"==t&&(d.winners=null,d.target="#results",d.filter_series=!1,d.search="",d.paged=1,d.category="foto",i.find('*[data-section="winners"]').hide(),i.find('*[data-section="archive"]').show())}function o(t){console.log("doAjax"),console.log(t);var i=t.target;if(t.series_name)var a=!0;else var a=!1;"winners"==d.section?(e(i+" .column .inner").remove(),e(i+" .column").removeClass("loaded")):e(i+" .column").remove(),e(i).addClass("is-loading"),e.ajax({method:"GET",data:t,url:"/wp-json/relevanssi/v2/fetch",success:function(t){if(console.log(t),e(i).removeClass("is-loading"),"nada"!==t[0]){for(var s=0;s<t.length;s++){var n=t[s],r="",o="",l=n.category;if(l&&(l=l.toLowerCase()),n.series_name&&"serie"===l){r='<div class="series">'+n.series_name+"</div>";var c=" series-icon"}else var c="";if(n.winner)var u=" badge-"+n.winner;else var u="";if(o='<div class="caption">'+n.caption+'</div><div class="shade"></div>',n.series_name&&"serie"===l)var p='<a href="'+n.link+'" target="_blank"><div class="'+u+'"><div class="image'+c+'" style="background-image: url('+n.thumb+')">&nbsp;</div></div><div class="name">'+n.fullname+' <span class="year">('+n.year+")</span></div></a>"+r+o;else var p='<a href="'+n.link+'" target="_blank"><div class="image'+c+u+'" style="background-image: url('+n.thumb+')">&nbsp;</div><div class="name">'+n.fullname+' <span class="year">('+n.year+")</span></div></a>"+r+o;if("winners"==d.section){p='<div class="inner">'+p+"</div>";var h=e('[data-prize="'+n.winner+'"]');h.hasClass("loaded")||h.addClass("loaded").html(p)}else if(a){var f='<img src="'+n.large+'">';e(i).append('<div class="slide"><span  class="watermark photo">'+f+"</span></div>")}else e(i).append('<div class="column is-3" data-year="'+n.year+'">'+p+"</div>")}setTimeout(function(){var t=0,a=e(i).data("current");e(i+" .column").each(function(){var i=e(this);i.data("year")!==a||"winners"==d.section&&!i.is(":empty")?(t+=40,setTimeout(function(){i.is(":hidden")&&i.show(),i.addClass("loaded")},t)):i.hide()}),e(".pagination.is-hidden").removeClass("is-hidden"),e(".loadmore.is-hidden").removeClass("is-hidden")},10)}else e(i).append('<div class="column is-6 is-offset-3 error"><h1>Keine Treffer</h1></div>'),setTimeout(function(){e(i+" .error").addClass("loaded")},10)},cache:!0})}var l="#results";"teilnehmer"==a?s="EXCLUDE,photo_prize_first,das_scharfe_sehen_1,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3":"archiv"==a?(s="INCLUDE,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1,photo_prize_first,photo_prize_2,photo_prize_3,photo_public,cartoon_public",n=e("#archiv").data("section"),l=".section.winners .columns"):"shortlist"==a?(s=null,r=!0):s=null,e(".tabs li:first").addClass("is-active");var c=e(".tabs li:first").data("category");c&&(c=c.toLowerCase());var d={target:l,category:c,year:2019,search:null,page:a,section:n,winners:s,paged:1,per_page:20,filter_series:!0,shortlist:r};console.log("filters:"),console.log(d),"empty"===e("#results").data("state")&&(i(),t()),e("#searchform").on("submit",function(){var i=e(this).serializeArray();return i=i[0],i=i.value,i||(i=null),d.search=i,d.paged=1,d.target="#results",t(),!1}),e(".fetch").each(function(){var t=e(this),i="#"+t.attr("id"),a=t.data("pp");a||(a=20),t.on("fetchit",function(){console.log("fetchit: "+e(this).attr("id")),o({target:i,y:t.data("y"),c:t.data("c"),s:t.data("s"),uid:t.data("uid"),series_name:t.data("series"),pg:1,pp:a,filter_series:!0}),t.removeClass("fetchit")}),t.hasClass("wait")||t.trigger("fetchit")}),e(".slider-section .slider").on("change",function(){var i=e("#filterYear").contents().text();console.log(i),"winners"!==d.section&&(d.target="#results"),d.year=i,e(".more").remove(),i<2017?e(".series_archive_wrapper").hide():e(".series_archive_wrapper").show(),t()}),e("#load-more").on("click",function(){e("#results").append('<div class="more columns is-multiline"/>'),d.paged=d.paged+1,d.target="#results .more:last",t()}),e(".pagination .arrow").on("click",function(){var i=e(this),a=i.data("dir"),s=d.paged;return"next"==a?(d.paged=s+1,t()):s-1>0&&(d.paged=s-1,t()),e(".pagination .page span").text(d.paged),console.log("page: "+d.paged),!1}),e(".tabs li").on("click",function(){e(this).closest(".tabs").find(".is-active").removeClass("is-active"),e(this).addClass("is-active");var a=e(this).data("category");a&&(a=a.toLowerCase());var s=e(this).data("tab");return a?(d.category=a,d.target="#results",d.paged=1):s&&(d.section=s,i()),"serie"==a?(console.log("shortlist hack"),e(".page-template-page-shortlist .loadmore.opacity0").removeClass("opacity0")):e(".page-template-page-shortlist .loadmore").addClass("opacity0"),e(".more.columns").each(function(){e(this).html()||e(this).remove()}),t(),!1})}(),e(".past-years.notice").on("click",function(){var t=e(this).closest("section");t.hasClass("is-active")?t.removeClass("is-active"):(t.addClass("is-active"),e(this).parent().find(".fetch.wait").trigger("fetchit"))}),e(".single-info .back").on("click",function(){window.history.back()});var o=e(window).height()-e("#footer").height()-e("#pre-header").height()-e("#header").height();e("#main, .column.side-menu").css("min-height",o),e(".wpuf-dashboard-content.posts tbody tr").each(function(){e(this).find("td:first a").contents().unwrap()}),document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll('input[type="range"].slider');[].forEach.call(e,function(e){var a=t(e);if(a){if(e.classList.contains("has-output-tooltip")){var s=i(e);a.style.left=s.position}e.addEventListener("input",function(e){if(e.target.classList.contains("has-output-tooltip")){var t=i(e.target);a.style.left=t.position}a.value=e.target.value})}})}),console.log("remove pw txt"),e(".um-field-password_reset_text div div").text("Um Ihr Passwort zurückzusetzen, geben Sie bitte Ihre E-Mail-Adresse oder Benutzernamen unten ein."),e(".um-field-username_b input").attr("placeholder","Geben Sie Ihren Benutzernamen und Ihre E-Mail-Adresse ein.")})}(jQuery);
//# sourceMappingURL=x-footer.js.map
