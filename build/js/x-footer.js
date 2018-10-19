function findOutputForSlider(e){var t=e.id;outputs=document.getElementsByTagName("output");for(var i=0;i<outputs.length;i++)if(outputs[i].htmlFor==t)return outputs[i]}function getSliderOutputPosition(e){var t,i,a=window.getComputedStyle(e,null);sliderWidth=parseInt(a.getPropertyValue("width"),10),i=e.getAttribute("min")?e.getAttribute("min"):0;var s=(e.value-i)/(e.getAttribute("max")-i);return t=s<0?0:s>1?sliderWidth:sliderWidth*s,{position:t+"px"}}!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof module&&"object"==typeof module.exports?require("jquery"):jQuery)}(function(e){function t(){var t=r.settings;if(t.autoDispose&&!e.contains(document.documentElement,this))return e(this).timeago("dispose"),this;var n=i(this);return isNaN(n.datetime)||(0===t.cutoff||Math.abs(s(n.datetime))<t.cutoff?e(this).text(a(n.datetime)):e(this).attr("title").length>0&&e(this).text(e(this).attr("title"))),this}function i(t){if(t=e(t),!t.data("timeago")){t.data("timeago",{datetime:r.datetime(t)});var i=e.trim(t.text());r.settings.localeTitle?t.attr("title",t.data("timeago").datetime.toLocaleString()):!(i.length>0)||r.isTime(t)&&t.attr("title")||t.attr("title",i)}return t.data("timeago")}function a(e){return r.inWords(s(e))}function s(e){return(new Date).getTime()-e.getTime()}e.timeago=function(t){return a(t instanceof Date?t:"string"==typeof t?e.timeago.parse(t):"number"==typeof t?new Date(t):e.timeago.datetime(t))};var r=e.timeago;e.extend(e.timeago,{settings:{refreshMillis:6e4,allowPast:!0,allowFuture:!1,localeTitle:!1,cutoff:0,autoDispose:!0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",inPast:"any moment now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(t){function i(i,s){var r=e.isFunction(i)?i(s,t):i,n=a.numbers&&a.numbers[s]||s;return r.replace(/%d/i,n)}if(!this.settings.allowPast&&!this.settings.allowFuture)throw"timeago allowPast and allowFuture settings can not both be set to false.";var a=this.settings.strings,s=a.prefixAgo,r=a.suffixAgo;if(this.settings.allowFuture&&t<0&&(s=a.prefixFromNow,r=a.suffixFromNow),!this.settings.allowPast&&t>=0)return this.settings.strings.inPast;var n=Math.abs(t)/1e3,o=n/60,l=o/60,c=l/24,d=c/365,u=n<45&&i(a.seconds,Math.round(n))||n<90&&i(a.minute,1)||o<45&&i(a.minutes,Math.round(o))||o<90&&i(a.hour,1)||l<24&&i(a.hours,Math.round(l))||l<42&&i(a.day,1)||c<30&&i(a.days,Math.round(c))||c<45&&i(a.month,1)||c<365&&i(a.months,Math.round(c/30))||d<1.5&&i(a.year,1)||i(a.years,Math.round(d)),p=a.wordSeparator||"";return void 0===a.wordSeparator&&(p=" "),e.trim([s,u,r].join(p))},parse:function(t){var i=e.trim(t);return i=i.replace(/\.\d+/,""),i=i.replace(/-/,"/").replace(/-/,"/"),i=i.replace(/T/," ").replace(/Z/," UTC"),i=i.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),i=i.replace(/([\+\-]\d\d)$/," $100"),new Date(i)},datetime:function(t){var i=r.isTime(t)?e(t).attr("datetime"):e(t).attr("title");return r.parse(i)},isTime:function(t){return"time"===e(t).get(0).tagName.toLowerCase()}});var n={init:function(){n.dispose.call(this);var i=e.proxy(t,this);i();var a=r.settings;a.refreshMillis>0&&(this._timeagoInterval=setInterval(i,a.refreshMillis))},update:function(i){var a=i instanceof Date?i:r.parse(i);e(this).data("timeago",{datetime:a}),r.settings.localeTitle&&e(this).attr("title",a.toLocaleString()),t.apply(this)},updateFromDOM:function(){e(this).data("timeago",{datetime:r.parse(r.isTime(this)?e(this).attr("datetime"):e(this).attr("title"))}),t.apply(this)},dispose:function(){this._timeagoInterval&&(window.clearInterval(this._timeagoInterval),this._timeagoInterval=null)}};e.fn.timeago=function(e,t){var i=e?n[e]:n.init;if(!i)throw new Error("Unknown function name '"+e+"' for timeago");return this.each(function(){i.call(this,t)}),this},document.createElement("abbr"),document.createElement("time")}),function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){var t=Array.prototype.slice,i=Array.prototype.splice,a={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:"",widthFromWrapper:!0,responsiveWidth:!1,zIndex:"auto"},s=e(window),r=e(document),n=[],o=s.height(),l=function(){for(var t=s.scrollTop(),i=r.height(),a=i-o,l=t>a?a-t:0,c=0,d=n.length;c<d;c++){var u=n[c],p=u.stickyWrapper.offset().top,h=p-u.topSpacing-l;if(u.stickyWrapper.css("height",u.stickyElement.outerHeight()),t<=h)null!==u.currentTop&&(u.stickyElement.css({width:"",position:"",top:"","z-index":""}),u.stickyElement.parent().removeClass(u.className),u.stickyElement.trigger("sticky-end",[u]),u.currentTop=null);else{var m=i-u.stickyElement.outerHeight()-u.topSpacing-u.bottomSpacing-t-l;if(m<0?m+=u.topSpacing:m=u.topSpacing,u.currentTop!==m){var f;u.getWidthFrom?f=e(u.getWidthFrom).width()||null:u.widthFromWrapper&&(f=u.stickyWrapper.width()),null==f&&(f=u.stickyElement.width()),u.stickyElement.css("width",f).css("position","fixed").css("top",m).css("z-index",u.zIndex),u.stickyElement.parent().addClass(u.className),null===u.currentTop?u.stickyElement.trigger("sticky-start",[u]):u.stickyElement.trigger("sticky-update",[u]),u.currentTop===u.topSpacing&&u.currentTop>m||null===u.currentTop&&m<u.topSpacing?u.stickyElement.trigger("sticky-bottom-reached",[u]):null!==u.currentTop&&m===u.topSpacing&&u.currentTop<m&&u.stickyElement.trigger("sticky-bottom-unreached",[u]),u.currentTop=m}var g=u.stickyWrapper.parent();u.stickyElement.offset().top+u.stickyElement.outerHeight()>=g.offset().top+g.outerHeight()&&u.stickyElement.offset().top<=u.topSpacing?u.stickyElement.css("position","absolute").css("top","").css("bottom",0).css("z-index",""):u.stickyElement.css("position","fixed").css("top",m).css("bottom","").css("z-index",u.zIndex)}}},c=function(){o=s.height();for(var t=0,i=n.length;t<i;t++){var a=n[t],r=null;a.getWidthFrom?a.responsiveWidth&&(r=e(a.getWidthFrom).width()):a.widthFromWrapper&&(r=a.stickyWrapper.width()),null!=r&&a.stickyElement.css("width",r)}},d={init:function(t){var i=e.extend({},a,t);return this.each(function(){var t=e(this),s=t.attr("id"),r=s?s+"-"+a.wrapperClassName:a.wrapperClassName,o=e("<div></div>").attr("id",r).addClass(i.wrapperClassName);t.wrapAll(o);var l=t.parent();i.center&&l.css({width:t.outerWidth(),marginLeft:"auto",marginRight:"auto"}),"right"===t.css("float")&&t.css({float:"none"}).parent().css({float:"right"}),i.stickyElement=t,i.stickyWrapper=l,i.currentTop=null,n.push(i),d.setWrapperHeight(this),d.setupChangeListeners(this)})},setWrapperHeight:function(t){var i=e(t),a=i.parent();a&&a.css("height",i.outerHeight())},setupChangeListeners:function(e){if(window.MutationObserver){new window.MutationObserver(function(t){(t[0].addedNodes.length||t[0].removedNodes.length)&&d.setWrapperHeight(e)}).observe(e,{subtree:!0,childList:!0})}else e.addEventListener("DOMNodeInserted",function(){d.setWrapperHeight(e)},!1),e.addEventListener("DOMNodeRemoved",function(){d.setWrapperHeight(e)},!1)},update:l,unstick:function(t){return this.each(function(){for(var t=this,a=e(t),s=-1,r=n.length;r-- >0;)n[r].stickyElement.get(0)===t&&(i.call(n,r,1),s=r);-1!==s&&(a.unwrap(),a.css({width:"",position:"",top:"",float:"","z-index":""}))})}};window.addEventListener?(window.addEventListener("scroll",l,!1),window.addEventListener("resize",c,!1)):window.attachEvent&&(window.attachEvent("onscroll",l),window.attachEvent("onresize",c)),e.fn.sticky=function(i){return d[i]?d[i].apply(this,t.call(arguments,1)):"object"!=typeof i&&i?void e.error("Method "+i+" does not exist on jQuery.sticky"):d.init.apply(this,arguments)},e.fn.unstick=function(i){return d[i]?d[i].apply(this,t.call(arguments,1)):"object"!=typeof i&&i?void e.error("Method "+i+" does not exist on jQuery.sticky"):d.unstick.apply(this,arguments)},e(function(){setTimeout(l,0)})}),document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll('input[type="range"].slider');[].forEach.call(e,function(e){var t=findOutputForSlider(e);if(t){if(e.classList.contains("has-output-tooltip")){var i=getSliderOutputPosition(e);t.style.left=i.position}e.addEventListener("input",function(e){if(e.target.classList.contains("has-output-tooltip")){var i=getSliderOutputPosition(e.target);t.style.left=i.position}t.value=e.target.value})}})}),function(e){e(function(){function t(e){var t=e.id;outputs=document.getElementsByTagName("output");for(var i=0;i<outputs.length;i++)if(outputs[i].htmlFor==t)return outputs[i]}function i(e){var t,i,a=window.getComputedStyle(e,null);sliderWidth=parseInt(a.getPropertyValue("width"),10),i=e.getAttribute("min")?e.getAttribute("min"):0;var s=(e.value-i)/(e.getAttribute("max")-i);return t=s<0?0:s>1?sliderWidth:sliderWidth*s,{position:t+"px"}}!function(){e("header").sticky({topSpacing:0}),e(".navbar-burger").on("click",function(){e(this).addClass("is-active"),e("#menu").addClass("is-active")}),e("#menu .close").on("click",function(){e(".navbar-burger").removeClass("is-active"),e("#menu").removeClass("is-active")})}(),function(){e(".owl-carousel.autoplay").owlCarousel({autoplay:!0,autoplayTimeout:8e3,smartSpeed:1e3,autoWidth:!1,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e(".owl-carousel").not("#prizes-gallery .gallery, .owl-carousel.autoplay").owlCarousel({autoWidth:!1,smartSpeed:1e3,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e("#prizes-gallery .gallery").owlCarousel({autoplay:!0,autoplayTimeout:8e3,smartSpeed:2e3,autoWidth:!0,center:!0,loop:!0,nav:!0,items:2,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]})}(),function(){if(e("body").hasClass("page-id-19949")){console.log("uploadFormStuff()");var t=e("#state").data("state"),i={foto:{min:2,max:4},serie:{min:4,max:6},karikatur:{min:2,max:4}};e(".wpuf-el.kategorie").on("change",function(){var a=e(this).find("input:checked"),s=a.val();console.log(s);var r=e(".datei, .post_title, .datum, .standort, .part-2, .part-3, .wpuf-submit"),n=e(".serienname, .series_counter");if(r.show(),e(".max").hide(),"foto"==s)n.hide();else if("serie"==s){var o=t.totalseriescount,l=50-o;if(t.serienname&&e('input[name="serienname"]').val(t.serienname),l>0){var c="There are currently "+o+" series submitted of a total 50 accepted submissions.",d='<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">'+c+"</p>";e(".part-2").prepend(d),n.show()}else{r.hide();var c="There are currently "+o+" series submitted of a total 50 accepted submissions.",d='<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">'+c+"</p>";e(".wpuf-form .wpuf-el:first").after(d)}e('label[for="serienname"]').html('Serientitel <span class="required">*</span>')}else"karikatur"==s&&(n.hide(),e('label[for="datum"]').html('Erscheinungsdatum <span class="required">*</span>'),e('label[for="standort"]').html('Veröffentlicht in folgender Zeitung <span class="required">*</span>'));t.total[s]<i[s].max&&t.total[s]<i.val.min&&console.log("too few "+s),t.total[s]<i[s].max&&t.total[s]>i.val.min&&console.log("not too few, not too many "+s),t.total[s]>=i[s].max&&(console.log("max "+s),r.hide(),n.hide(),e(".error.max").length?e(".max").show():e(".kategorie").after('<li class="error max"><p><b>Sollten Sie ihre Bildauswahl ändern wollen, löschen Sie bitte zuerst unter &bdquo;Bildaktualisierung&ldquo; die Datei/Dateien, die Sie nicht zum Wettbewerb einreichen möchten und laden dann die neuen Bilddateien hoch.</b></p></li>'))})}}();var a,s,r,n,o=new Date;a=e("body").hasClass("page-id-78")?"teilnehmer":e("body").hasClass("page-id-82")?"archiv":e("body").hasClass("page-id-199")?"shortlist":"other",console.log("WP API > "+a),function(){function t(){l({target:d.target,w:d.winners,y:d.year,c:d.category,s:d.search,pg:d.paged,pp:d.per_page,filter_series:d.filter_series,shortlist:d.shortlist})}function i(){var t=d.section,i=e("#archiv");console.log("setSection(): "+t),"winners"==t&&(d.winners="INCLUDE,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1,photo_prize_first,photo_prize_2,photo_prize_3,photo_public,cartoon_public",d.target=".section.winners .columns",d.filter_series=!0,d.search="",d.paged=1,d.category="",i.find('*[data-section="winners"]').show(),i.find('*[data-section="archive"]').hide()),"archive"==t&&(d.winners=null,d.target="#results",d.filter_series=!1,d.search="",d.paged=1,d.category="Foto",i.find('*[data-section="winners"]').hide(),i.find('*[data-section="archive"]').show())}function l(t){console.log("doAjax"),console.log(t);var i=t.target;if(t.series_name)var a=!0;else var a=!1;"winners"==d.section?(e(i+" .column .inner").remove(),e(i+" .column").removeClass("loaded")):e(i+" .column").remove(),e(i).addClass("is-loading"),e.ajax({method:"GET",data:t,url:"/wp-json/relevanssi/v2/fetch",success:function(t){if(console.log(t),e(i).removeClass("is-loading"),"nada"!==t[0]){for(var s=0;s<t.length;s++){var r=t[s],n="",o="";if(r.series_name&&"Serie"===r.category){n='<div class="series">'+r.series_name+"</div>";var l=" series-icon"}else var l="";if(r.winner)var c=" badge-"+r.winner;else var c="";if(o='<div class="caption">'+r.caption+'</div><div class="shade"></div>',r.series_name&&"Serie"===r.category)var u='<a href="'+r.link+'"><div class="'+c+'"><div class="image'+l+'" style="background-image: url('+r.thumb+')">&nbsp;</div></div><div class="name">'+r.fullname+' <span class="year">('+r.year+")</span></div></a>"+n+o;else var u='<a href="'+r.link+'"><div class="image'+l+c+'" style="background-image: url('+r.thumb+')">&nbsp;</div><div class="name">'+r.fullname+' <span class="year">('+r.year+")</span></div></a>"+n+o;if("winners"==d.section){u='<div class="inner">'+u+"</div>";var p=e('[data-prize="'+r.winner+'"]');p.hasClass("loaded")||p.addClass("loaded").html(u)}else if(a){var h='<img src="'+r.large+'">';e(i).append('<div class="slide"><span  class="watermark photo">'+h+"</span></div>")}else e(i).append('<div class="column is-3" data-year="'+r.year+'">'+u+"</div>")}setTimeout(function(){var t=0,a=e(i).data("current");e(i+" .column").each(function(){var i=e(this);i.data("year")!==a||"winners"==d.section&&!i.is(":empty")?(t+=40,setTimeout(function(){i.is(":hidden")&&i.show(),i.addClass("loaded")},t)):i.hide()}),e(".pagination.is-hidden").removeClass("is-hidden"),e(".loadmore.is-hidden").removeClass("is-hidden")},10)}else e(i).append('<div class="column is-6 is-offset-3 error"><h1>Keine Treffer</h1></div>'),setTimeout(function(){e(i+" .error").addClass("loaded")},10)},cache:!0})}var c="#results";"teilnehmer"==a?s="EXCLUDE,photo_prize_first,das_scharfe_sehen_1,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3":"archiv"==a?(s="INCLUDE,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1,photo_prize_first,photo_prize_2,photo_prize_3,photo_public,cartoon_public",r=e("#archiv").data("section"),c=".section.winners .columns"):"shortlist"==a?(s=null,n=!0):s=null,e(".tabs li:first").addClass("is-active");var d={target:c,category:e(".tabs li:first").data("category"),year:o.getFullYear()-1,search:null,page:a,section:r,winners:s,paged:1,per_page:20,filter_series:!0,shortlist:n};console.log("filters:"),console.log(d),"empty"===e("#results").data("state")&&(i(),t()),e("#searchform").on("submit",function(){var i=e(this).serializeArray();return i=i[0],i=i.value,i||(i=null),d.search=i,d.paged=1,d.target="#results",t(),!1}),e(".fetch").each(function(){var t=e(this),i="#"+t.attr("id"),a=t.data("pp");a||(a=20),t.on("fetchit",function(){console.log("fetchit: "+e(this).attr("id")),l({target:i,y:t.data("y"),c:t.data("c"),s:t.data("s"),uid:t.data("uid"),series_name:t.data("series"),pg:1,pp:a,filter_series:!0}),t.removeClass("fetchit")}),t.hasClass("wait")||t.trigger("fetchit")}),e(".slider-section .slider").on("change",function(){var i=e("#filterYear").contents().text();console.log(i),"winners"!==d.section&&(d.target="#results"),d.year=i,e(".more").remove(),t()}),e("#load-more").on("click",function(){e("#results").append('<div class="more columns is-multiline"/>'),d.paged=d.paged+1,d.target="#results .more:last",t()}),e(".pagination .arrow").on("click",function(){var i=e(this),a=i.data("dir"),s=d.paged;return"next"==a?(d.paged=s+1,t()):s-1>0&&(d.paged=s-1,t()),e(".pagination .page span").text(d.paged),console.log("page: "+d.paged),!1}),e(".tabs li").on("click",function(){e(this).closest(".tabs").find(".is-active").removeClass("is-active"),e(this).addClass("is-active");var a=e(this).data("category"),s=e(this).data("tab");return a?(d.category=a,d.target="#results",d.paged=1):s&&(d.section=s,i()),t(),!1})}(),e(".past-years.notice").on("click",function(){var t=e(this).closest("section");t.hasClass("is-active")?t.removeClass("is-active"):(t.addClass("is-active"),e(this).parent().find(".fetch.wait").trigger("fetchit"))}),e(".single-info .back").on("click",function(){window.history.back()});var l=e(window).height()-e("#footer").height()-e("#pre-header").height()-e("#header").height();e("#main, .column.side-menu").css("min-height",l),e(".wpuf-dashboard-content.posts tbody tr").each(function(){e(this).find("td:first a").contents().unwrap()}),document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll('input[type="range"].slider');[].forEach.call(e,function(e){var a=t(e);if(a){if(e.classList.contains("has-output-tooltip")){var s=i(e);a.style.left=s.position}e.addEventListener("input",function(e){if(e.target.classList.contains("has-output-tooltip")){var t=i(e.target);a.style.left=t.position}a.value=e.target.value})}})}),console.log("remove pw txt"),e(".um-field-password_reset_text div div").text("Um Ihr Passwort zurückzusetzen, geben Sie bitte Ihre E-Mail-Adresse oder Benutzernamen unten ein."),e(".um-field-username_b input").attr("placeholder","Geben Sie Ihren Benutzernamen und Ihre E-Mail-Adresse ein.")})}(jQuery);
//# sourceMappingURL=x-footer.js.map
