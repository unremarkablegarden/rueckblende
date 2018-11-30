function findOutputForSlider(e){var t=e.id;outputs=document.getElementsByTagName("output");for(var i=0;i<outputs.length;i++)if(outputs[i].htmlFor==t)return outputs[i]}function getSliderOutputPosition(e){var t,i,a=window.getComputedStyle(e,null);sliderWidth=parseInt(a.getPropertyValue("width"),10),i=e.getAttribute("min")?e.getAttribute("min"):0;var n=(e.value-i)/(e.getAttribute("max")-i);return t=n<0?0:n>1?sliderWidth:sliderWidth*n,{position:t+"px"}}!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof module&&"object"==typeof module.exports?require("jquery"):jQuery)}(function(e){function t(){var t=s.settings;if(t.autoDispose&&!e.contains(document.documentElement,this))return e(this).timeago("dispose"),this;var r=i(this);return isNaN(r.datetime)||(0===t.cutoff||Math.abs(n(r.datetime))<t.cutoff?e(this).text(a(r.datetime)):e(this).attr("title").length>0&&e(this).text(e(this).attr("title"))),this}function i(t){if(t=e(t),!t.data("timeago")){t.data("timeago",{datetime:s.datetime(t)});var i=e.trim(t.text());s.settings.localeTitle?t.attr("title",t.data("timeago").datetime.toLocaleString()):!(i.length>0)||s.isTime(t)&&t.attr("title")||t.attr("title",i)}return t.data("timeago")}function a(e){return s.inWords(n(e))}function n(e){return(new Date).getTime()-e.getTime()}e.timeago=function(t){return a(t instanceof Date?t:"string"==typeof t?e.timeago.parse(t):"number"==typeof t?new Date(t):e.timeago.datetime(t))};var s=e.timeago;e.extend(e.timeago,{settings:{refreshMillis:6e4,allowPast:!0,allowFuture:!1,localeTitle:!1,cutoff:0,autoDispose:!0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",inPast:"any moment now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(t){function i(i,n){var s=e.isFunction(i)?i(n,t):i,r=a.numbers&&a.numbers[n]||n;return s.replace(/%d/i,r)}if(!this.settings.allowPast&&!this.settings.allowFuture)throw"timeago allowPast and allowFuture settings can not both be set to false.";var a=this.settings.strings,n=a.prefixAgo,s=a.suffixAgo;if(this.settings.allowFuture&&t<0&&(n=a.prefixFromNow,s=a.suffixFromNow),!this.settings.allowPast&&t>=0)return this.settings.strings.inPast;var r=Math.abs(t)/1e3,o=r/60,l=o/60,c=l/24,u=c/365,d=r<45&&i(a.seconds,Math.round(r))||r<90&&i(a.minute,1)||o<45&&i(a.minutes,Math.round(o))||o<90&&i(a.hour,1)||l<24&&i(a.hours,Math.round(l))||l<42&&i(a.day,1)||c<30&&i(a.days,Math.round(c))||c<45&&i(a.month,1)||c<365&&i(a.months,Math.round(c/30))||u<1.5&&i(a.year,1)||i(a.years,Math.round(u)),p=a.wordSeparator||"";return void 0===a.wordSeparator&&(p=" "),e.trim([n,d,s].join(p))},parse:function(t){var i=e.trim(t);return i=i.replace(/\.\d+/,""),i=i.replace(/-/,"/").replace(/-/,"/"),i=i.replace(/T/," ").replace(/Z/," UTC"),i=i.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),i=i.replace(/([\+\-]\d\d)$/," $100"),new Date(i)},datetime:function(t){var i=s.isTime(t)?e(t).attr("datetime"):e(t).attr("title");return s.parse(i)},isTime:function(t){return"time"===e(t).get(0).tagName.toLowerCase()}});var r={init:function(){r.dispose.call(this);var i=e.proxy(t,this);i();var a=s.settings;a.refreshMillis>0&&(this._timeagoInterval=setInterval(i,a.refreshMillis))},update:function(i){var a=i instanceof Date?i:s.parse(i);e(this).data("timeago",{datetime:a}),s.settings.localeTitle&&e(this).attr("title",a.toLocaleString()),t.apply(this)},updateFromDOM:function(){e(this).data("timeago",{datetime:s.parse(s.isTime(this)?e(this).attr("datetime"):e(this).attr("title"))}),t.apply(this)},dispose:function(){this._timeagoInterval&&(window.clearInterval(this._timeagoInterval),this._timeagoInterval=null)}};e.fn.timeago=function(e,t){var i=e?r[e]:r.init;if(!i)throw new Error("Unknown function name '"+e+"' for timeago");return this.each(function(){i.call(this,t)}),this},document.createElement("abbr"),document.createElement("time")}),function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){var t=Array.prototype.slice,i=Array.prototype.splice,a={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:"",widthFromWrapper:!0,responsiveWidth:!1,zIndex:"auto"},n=e(window),s=e(document),r=[],o=n.height(),l=function(){for(var t=n.scrollTop(),i=s.height(),a=i-o,l=t>a?a-t:0,c=0,u=r.length;c<u;c++){var d=r[c],p=d.stickyWrapper.offset().top,h=p-d.topSpacing-l;if(d.stickyWrapper.css("height",d.stickyElement.outerHeight()),t<=h)null!==d.currentTop&&(d.stickyElement.css({width:"",position:"",top:"","z-index":""}),d.stickyElement.parent().removeClass(d.className),d.stickyElement.trigger("sticky-end",[d]),d.currentTop=null);else{var m=i-d.stickyElement.outerHeight()-d.topSpacing-d.bottomSpacing-t-l;if(m<0?m+=d.topSpacing:m=d.topSpacing,d.currentTop!==m){var f;d.getWidthFrom?f=e(d.getWidthFrom).width()||null:d.widthFromWrapper&&(f=d.stickyWrapper.width()),null==f&&(f=d.stickyElement.width()),d.stickyElement.css("width",f).css("position","fixed").css("top",m).css("z-index",d.zIndex),d.stickyElement.parent().addClass(d.className),null===d.currentTop?d.stickyElement.trigger("sticky-start",[d]):d.stickyElement.trigger("sticky-update",[d]),d.currentTop===d.topSpacing&&d.currentTop>m||null===d.currentTop&&m<d.topSpacing?d.stickyElement.trigger("sticky-bottom-reached",[d]):null!==d.currentTop&&m===d.topSpacing&&d.currentTop<m&&d.stickyElement.trigger("sticky-bottom-unreached",[d]),d.currentTop=m}var g=d.stickyWrapper.parent();d.stickyElement.offset().top+d.stickyElement.outerHeight()>=g.offset().top+g.outerHeight()&&d.stickyElement.offset().top<=d.topSpacing?d.stickyElement.css("position","absolute").css("top","").css("bottom",0).css("z-index",""):d.stickyElement.css("position","fixed").css("top",m).css("bottom","").css("z-index",d.zIndex)}}},c=function(){o=n.height();for(var t=0,i=r.length;t<i;t++){var a=r[t],s=null;a.getWidthFrom?a.responsiveWidth&&(s=e(a.getWidthFrom).width()):a.widthFromWrapper&&(s=a.stickyWrapper.width()),null!=s&&a.stickyElement.css("width",s)}},u={init:function(t){var i=e.extend({},a,t);return this.each(function(){var t=e(this),n=t.attr("id"),s=n?n+"-"+a.wrapperClassName:a.wrapperClassName,o=e("<div></div>").attr("id",s).addClass(i.wrapperClassName);t.wrapAll(o);var l=t.parent();i.center&&l.css({width:t.outerWidth(),marginLeft:"auto",marginRight:"auto"}),"right"===t.css("float")&&t.css({float:"none"}).parent().css({float:"right"}),i.stickyElement=t,i.stickyWrapper=l,i.currentTop=null,r.push(i),u.setWrapperHeight(this),u.setupChangeListeners(this)})},setWrapperHeight:function(t){var i=e(t),a=i.parent();a&&a.css("height",i.outerHeight())},setupChangeListeners:function(e){if(window.MutationObserver){new window.MutationObserver(function(t){(t[0].addedNodes.length||t[0].removedNodes.length)&&u.setWrapperHeight(e)}).observe(e,{subtree:!0,childList:!0})}else e.addEventListener("DOMNodeInserted",function(){u.setWrapperHeight(e)},!1),e.addEventListener("DOMNodeRemoved",function(){u.setWrapperHeight(e)},!1)},update:l,unstick:function(t){return this.each(function(){for(var t=this,a=e(t),n=-1,s=r.length;s-- >0;)r[s].stickyElement.get(0)===t&&(i.call(r,s,1),n=s);-1!==n&&(a.unwrap(),a.css({width:"",position:"",top:"",float:"","z-index":""}))})}};window.addEventListener?(window.addEventListener("scroll",l,!1),window.addEventListener("resize",c,!1)):window.attachEvent&&(window.attachEvent("onscroll",l),window.attachEvent("onresize",c)),e.fn.sticky=function(i){return u[i]?u[i].apply(this,t.call(arguments,1)):"object"!=typeof i&&i?void e.error("Method "+i+" does not exist on jQuery.sticky"):u.init.apply(this,arguments)},e.fn.unstick=function(i){return u[i]?u[i].apply(this,t.call(arguments,1)):"object"!=typeof i&&i?void e.error("Method "+i+" does not exist on jQuery.sticky"):u.unstick.apply(this,arguments)},e(function(){setTimeout(l,0)})}),document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll('input[type="range"].slider');[].forEach.call(e,function(e){var t=findOutputForSlider(e);if(t){if(e.classList.contains("has-output-tooltip")){var i=getSliderOutputPosition(e);t.style.left=i.position}e.addEventListener("input",function(e){if(e.target.classList.contains("has-output-tooltip")){var i=getSliderOutputPosition(e.target);t.style.left=i.position}t.value=e.target.value})}})}),function(e){e(function(){function t(e){var t=e.id;outputs=document.getElementsByTagName("output");for(var i=0;i<outputs.length;i++)if(outputs[i].htmlFor==t)return outputs[i]}function i(e){var t,i,a=window.getComputedStyle(e,null);sliderWidth=parseInt(a.getPropertyValue("width"),10),i=e.getAttribute("min")?e.getAttribute("min"):0;var n=(e.value-i)/(e.getAttribute("max")-i);return t=n<0?0:n>1?sliderWidth:sliderWidth*n,{position:t+"px"}}!function(){e("header").sticky({topSpacing:0}),e(".navbar-burger").on("click",function(){e(this).addClass("is-active"),e("#menu").addClass("is-active")}),e("#menu .close").on("click",function(){e(".navbar-burger").removeClass("is-active"),e("#menu").removeClass("is-active")})}(),function(){e(".owl-carousel.autoplay").owlCarousel({autoplay:!0,autoplayTimeout:8e3,smartSpeed:1e3,autoWidth:!1,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e(".owl-carousel").not("#prizes-gallery .gallery, .owl-carousel.autoplay, .jury-preview").owlCarousel({autoWidth:!1,smartSpeed:1e3,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e("#prizes-gallery .gallery").owlCarousel({autoplay:!0,autoplayTimeout:8e3,smartSpeed:2e3,autoWidth:!0,center:!0,loop:!0,nav:!0,items:2,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e(".jury-preview").owlCarousel({autoWidth:!1,smartSpeed:1e3,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]})}(),function(){function t(e,t){var i=new Image;i.src=e,i.onload=function(){t(this.width,this.height)}}function i(){var t=e(".kategorie .wpuf-fields").find("input:checked"),i=t.val();console.log(i);var a=e(".datei, .post_title, .datum, .standort, .part-2, .part-3, .wpuf-submit"),r=e(".serienname, .series_counter");if(a.show(),e(".max").hide(),"foto"==i)r.hide();else if("serie"==i){r.show();var l=n.totalseriescount,c=50-l;if(n.total.serie>=1&&(console.log("honk1"),(n.serienname||o)&&(console.log("honk2"),e('input[name="serienname"]').val(n.serienname),e("li.serienname").css({overflow:"hidden",height:0,opacity:0,display:"none !important",padding:0,margin:0}))),c>0||n.total.serie>0){var u="Es wurden bereits "+l+" von 50 möglichen Serien eingereicht.",d='<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">'+u+"</p>";e(".series_counter").length<1&&0==n.total.serie&&e(".part-2").prepend(d),r.show()}else{a.hide();var u="Das Limit von 50 möglichen Serien-Einsendungen ist bereits erreicht.",d='<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">'+u+"</p>";e(".wpuf-form .wpuf-el:first").after(d)}e('label[for="serienname"]').html('Serientitel <span class="required">*</span>')}else"karikatur"==i&&(r.hide(),e('label[for="datum"]').html('Erscheinungsdatum <span class="required">*</span>'),e('label[for="standort"]').html('Veröffentlicht in folgender Zeitung <span class="required">*</span>'));n.total[i]<s[i].max&&n.total[i]<s.val.min&&console.log("too few "+i),n.total[i]<s[i].max&&n.total[i]>s.val.min&&console.log("not too few, not too many "+i),n.total[i]>=s[i].max&&(console.log("max "+i),a.hide(),r.hide(),e(".error.max").length?e(".max").show():e(".kategorie").after('<li class="error max"><p><b>Sollten Sie ihre Bildauswahl ändern wollen, löschen Sie bitte zuerst unter &bdquo;Bildaktualisierung&ldquo; die Datei/Dateien, die Sie nicht zum Wettbewerb einreichen möchten und laden dann die neuen Bilddateien hoch.</b></p></li>'))}if(e("body").hasClass("page-id-19949")||e("body").hasClass("page-id-19936")){console.log("uploadFormStuff()"),e(".wpuf-submit-button").on("click",function(){setTimeout(function(){console.log("fix english form errors"),e(".wpuf-error-msg").each(function(){var t=e(this).text();console.log(t),"Bildbeschriftung is required"==t&&e(this).text("Bitte Bildunterschrift hinzufügen"),"Aufnahmeort is required"==t&&e(this).text("Bitte Aufnahmeort hinzufügen"),"Aufnahmedatum is required"==t&&e(this).text("Bitte Aufnahmedatum hinzufügen"),"Datei is required"==t&&e(this).text("Bitte Datei hinzufügen"),"Please fix the errors to proceed"==t&&e(this).text(""),""==t&&e(this).text("Bitte die fehlenden Felder ausfüllen um fortzufahren")})},100)});var a=!1;e(document).on("DOMSubtreeModified",function(){if(!a){var i=e(".wpuf-attachment-list .attachment-name img");if(i.length){var n=i.attr("src");n&&(foundImg=!0);var s=i.attr("alt"),r=n.substring(0,n.lastIndexOf("/")),o=n.split(".").pop();a=r+"/"+s+"."+o,console.log(a),t(a,function(t,i){t<1200&&(alert("Dieses Bild ist zu klein. Bitte lade in höherer Auflösung hoch."),e("a.attachment-delete").trigger("click"),a=!1)})}}});var n=e("#state").data("state");console.log("---- state -----"),console.log(n),console.log("----------------");var s={foto:{min:2,max:4},serie:{min:4,max:6},karikatur:{min:2,max:6}};"fotograf"===n.usertype&&e('input[value="karikatur"]').parent().hide(),"karikaturist"===n.usertype&&(e('input[value="foto"]').parent().hide(),e('input[value="serie"]').parent().hide(),e('input[value="karikatur"]').prop("checked",!0),i()),e(".wpuf-el.kategorie").on("change",function(){i()});var r=window.location.pathname,o=!1;r.indexOf("edit")>=0&&(o=!0,console.log("isEdit"),i())}}(),function(){e("body").hasClass("um-page-register")&&e("#confirm_user_password-20047").attr("placeholder","Passwort wiederholen")}(),function(){function t(t){var i=e(".series-image.current"),a=null;if("prev"==t&&i.prev().length?(a=i.prev().find("a.zoom").data("zoom"),e(".series-image.current").removeClass("current"),i.prev().addClass("current")):"next"==t&&i.next().length&&(a=i.next().find("a.zoom").data("zoom"),e(".series-image.current").removeClass("current"),i.next().addClass("current")),null!==a){const n='<img src="'+a+'">';e("#zoom .image").html(n)}}e("a.zoom").on("click",function(t){e(this).parent().addClass("current");const i=e(this).data("zoom"),a='<img src="'+i+'">';e("#zoom .image").html(a),e("#zoom").show(),t.preventDefault()}),e("#zoom .close").on("click",function(t){e("#zoom").hide(),e("#zoom .image img").remove(),e(".current").removeClass("current"),t.preventDefault()}),e(document).keydown(function(e){switch(e.which){case 37:t("prev");break;case 39:t("next");break;default:return}e.preventDefault()})}();var a,n,s,r,o=new Date;a=e("body").hasClass("page-id-78")?"teilnehmer":e("body").hasClass("page-id-82")?"archiv":e("body").hasClass("page-id-199")?"shortlist":"other",console.log("WP API > "+a),function(){function t(){l({target:u.target,w:u.winners,y:u.year,c:u.category,s:u.search,pg:u.paged,pp:u.per_page,filter_series:u.filter_series,shortlist:u.shortlist})}function i(){var t=u.section,i=e("#archiv");console.log("setSection(): "+t),"winners"==t&&(u.winners="INCLUDE,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1,photo_prize_first,photo_prize_2,photo_prize_3,photo_public,cartoon_public",u.target=".section.winners .columns",u.filter_series=!0,u.search="",u.paged=1,u.category="",i.find('*[data-section="winners"]').show(),i.find('*[data-section="archive"]').hide()),"archive"==t&&(u.winners=null,u.target="#results",u.filter_series=!1,u.search="",u.paged=1,u.category="Foto",i.find('*[data-section="winners"]').hide(),i.find('*[data-section="archive"]').show())}function l(t){console.log("doAjax"),console.log(t);var i=t.target;if(t.series_name)var a=!0;else var a=!1;"winners"==u.section?(e(i+" .column .inner").remove(),e(i+" .column").removeClass("loaded")):e(i+" .column").remove(),e(i).addClass("is-loading"),e.ajax({method:"GET",data:t,url:"/wp-json/relevanssi/v2/fetch",success:function(t){if(console.log(t),e(i).removeClass("is-loading"),"nada"!==t[0]){for(var n=0;n<t.length;n++){var s=t[n],r="",o="";if(s.series_name&&"Serie"===s.category){r='<div class="series">'+s.series_name+"</div>";var l=" series-icon"}else var l="";if(s.winner)var c=" badge-"+s.winner;else var c="";if(o='<div class="caption">'+s.caption+'</div><div class="shade"></div>',s.series_name&&"Serie"===s.category)var d='<a href="'+s.link+'"><div class="'+c+'"><div class="image'+l+'" style="background-image: url('+s.thumb+')">&nbsp;</div></div><div class="name">'+s.fullname+' <span class="year">('+s.year+")</span></div></a>"+r+o;else var d='<a href="'+s.link+'"><div class="image'+l+c+'" style="background-image: url('+s.thumb+')">&nbsp;</div><div class="name">'+s.fullname+' <span class="year">('+s.year+")</span></div></a>"+r+o;if("winners"==u.section){d='<div class="inner">'+d+"</div>";var p=e('[data-prize="'+s.winner+'"]');p.hasClass("loaded")||p.addClass("loaded").html(d)}else if(a){var h='<img src="'+s.large+'">';e(i).append('<div class="slide"><span  class="watermark photo">'+h+"</span></div>")}else e(i).append('<div class="column is-3" data-year="'+s.year+'">'+d+"</div>")}setTimeout(function(){var t=0,a=e(i).data("current");e(i+" .column").each(function(){var i=e(this);i.data("year")!==a||"winners"==u.section&&!i.is(":empty")?(t+=40,setTimeout(function(){i.is(":hidden")&&i.show(),i.addClass("loaded")},t)):i.hide()}),e(".pagination.is-hidden").removeClass("is-hidden"),e(".loadmore.is-hidden").removeClass("is-hidden")},10)}else e(i).append('<div class="column is-6 is-offset-3 error"><h1>Keine Treffer</h1></div>'),setTimeout(function(){e(i+" .error").addClass("loaded")},10)},cache:!0})}var c="#results";"teilnehmer"==a?n="EXCLUDE,photo_prize_first,das_scharfe_sehen_1,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3":"archiv"==a?(n="INCLUDE,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1,photo_prize_first,photo_prize_2,photo_prize_3,photo_public,cartoon_public",s=e("#archiv").data("section"),c=".section.winners .columns"):"shortlist"==a?(n=null,r=!0):n=null,e(".tabs li:first").addClass("is-active");var u={target:c,category:e(".tabs li:first").data("category"),year:o.getFullYear()-1,search:null,page:a,section:s,winners:n,paged:1,per_page:20,filter_series:!0,shortlist:r};console.log("filters:"),console.log(u),"empty"===e("#results").data("state")&&(i(),t()),e("#searchform").on("submit",function(){var i=e(this).serializeArray();return i=i[0],i=i.value,i||(i=null),u.search=i,u.paged=1,u.target="#results",t(),!1}),e(".fetch").each(function(){var t=e(this),i="#"+t.attr("id"),a=t.data("pp");a||(a=20),t.on("fetchit",function(){console.log("fetchit: "+e(this).attr("id")),l({target:i,y:t.data("y"),c:t.data("c"),s:t.data("s"),uid:t.data("uid"),series_name:t.data("series"),pg:1,pp:a,filter_series:!0}),t.removeClass("fetchit")}),t.hasClass("wait")||t.trigger("fetchit")}),e(".slider-section .slider").on("change",function(){var i=e("#filterYear").contents().text();console.log(i),"winners"!==u.section&&(u.target="#results"),u.year=i,e(".more").remove(),t()}),e("#load-more").on("click",function(){e("#results").append('<div class="more columns is-multiline"/>'),u.paged=u.paged+1,u.target="#results .more:last",t()}),e(".pagination .arrow").on("click",function(){var i=e(this),a=i.data("dir"),n=u.paged;return"next"==a?(u.paged=n+1,t()):n-1>0&&(u.paged=n-1,t()),e(".pagination .page span").text(u.paged),console.log("page: "+u.paged),!1}),e(".tabs li").on("click",function(){e(this).closest(".tabs").find(".is-active").removeClass("is-active"),e(this).addClass("is-active");var a=e(this).data("category"),n=e(this).data("tab");return a?(u.category=a,u.target="#results",u.paged=1):n&&(u.section=n,i()),t(),!1})}(),e(".past-years.notice").on("click",function(){var t=e(this).closest("section");t.hasClass("is-active")?t.removeClass("is-active"):(t.addClass("is-active"),e(this).parent().find(".fetch.wait").trigger("fetchit"))}),e(".single-info .back").on("click",function(){window.history.back()});var l=e(window).height()-e("#footer").height()-e("#pre-header").height()-e("#header").height();e("#main, .column.side-menu").css("min-height",l),e(".wpuf-dashboard-content.posts tbody tr").each(function(){e(this).find("td:first a").contents().unwrap()}),document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll('input[type="range"].slider');[].forEach.call(e,function(e){var a=t(e);if(a){if(e.classList.contains("has-output-tooltip")){var n=i(e);a.style.left=n.position}e.addEventListener("input",function(e){if(e.target.classList.contains("has-output-tooltip")){var t=i(e.target);a.style.left=t.position}a.value=e.target.value})}})}),console.log("remove pw txt"),e(".um-field-password_reset_text div div").text("Um Ihr Passwort zurückzusetzen, geben Sie bitte Ihre E-Mail-Adresse oder Benutzernamen unten ein."),e(".um-field-username_b input").attr("placeholder","Geben Sie Ihren Benutzernamen und Ihre E-Mail-Adresse ein.")})}(jQuery);
//# sourceMappingURL=x-footer.js.map
