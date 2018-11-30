function findOutputForSlider(e){var t=e.id;outputs=document.getElementsByTagName("output");for(var i=0;i<outputs.length;i++)if(outputs[i].htmlFor==t)return outputs[i]}function getSliderOutputPosition(e){var t,i,n=window.getComputedStyle(e,null);sliderWidth=parseInt(n.getPropertyValue("width"),10),i=e.getAttribute("min")?e.getAttribute("min"):0;var r=(e.value-i)/(e.getAttribute("max")-i);return t=r<0?0:r>1?sliderWidth:sliderWidth*r,{position:t+"px"}}!function(e){if("function"==typeof define&&define.amd){if("undefined"!=typeof requirejs){var t=requirejs,i="[history"+(new Date).getTime()+"]",n=t.onError;e.toString=function(){return i},t.onError=function(e){-1===e.message.indexOf(i)&&n.call(t,e)}}define([],e)}if("object"!=typeof exports||"undefined"==typeof module)return e();module.exports=e()}(function(){function e(){}function t(e,i,n){var r=/(?:([a-zA-Z0-9\-]+\:))?(?:\/\/(?:[^@]*@)?([^\/:\?#]+)(?::([0-9]+))?)?([^\?#]*)(?:(\?[^#]+)|\?)?(?:(#.*))?/;if(null==e||""===e||i)e=i?e:b.href,z&&!n||(e=e.replace(/^[^#]*/,"")||"#",e=b.protocol.replace(/:.*$|$/,":")+"//"+b.host+F.basepath+e.replace(new RegExp("^#[/]?(?:"+F.type+")?"),""));else{var a=t(),o=y.getElementsByTagName("base")[0];!n&&o&&o.getAttribute("href")&&(o.href=o.href,a=t(o.href,null,!0));var s=a._pathname,l=a._protocol;e=""+e,e=/^(?:\w+\:)?\/\//.test(e)?0===e.indexOf("/")?l+e:e:l+"//"+a._host+(0===e.indexOf("/")?e:0===e.indexOf("?")?s+e:0===e.indexOf("#")?s+a._search+e:s.replace(/[^\/]+$/g,"")+e)}q.href=e;var c=r.exec(q.href),u=c[2]+(c[3]?":"+c[3]:""),d=c[4]||"/",p=c[5]||"",h="#"===c[6]?"":c[6]||"",f=d+p+h,m=d.replace(new RegExp("^"+F.basepath,"i"),F.type)+p;return{_href:c[1]+"//"+u+f,_protocol:c[1],_host:u,_hostname:c[2],_port:c[3]||"",_pathname:d,_search:p,_hash:h,_relative:f,_nohash:m,_special:m+h}}function i(){var e;try{e=g.sessionStorage,e.setItem(M+"t","1"),e.removeItem(M+"t")}catch(t){e={getItem:function(e){var t=y.cookie.split(e+"=");return t.length>1&&t.pop().split(";").shift()||"null"},setItem:function(e,t){var i={};(i[b.href]=E.state)&&(y.cookie=e+"="+_.stringify(i))}}}try{H=_.parse(e.getItem(M))||{}}catch(e){H={}}A(O+"unload",function(){e.setItem(M,_.stringify(H))},!1)}function n(t,i,n,r){var a=0;n||(n={set:e},a=1);var o=!n.set,s=!n.get,l={configurable:!0,set:function(){o=1},get:function(){s=1}};try{P(t,i,l),t[i]=t[i],P(t,i,n)}catch(e){}if(!(o&&s||(t.__defineGetter__&&(t.__defineGetter__(i,l.get),t.__defineSetter__(i,l.set),t[i]=t[i],n.get&&t.__defineGetter__(i,n.get),n.set&&t.__defineSetter__(i,n.set)),o&&s))){if(a)return!1;if(t===g){try{var c=t[i];t[i]=null}catch(e){}if("execScript"in g)g.execScript("Public "+i,"VBScript"),g.execScript("var "+i+";","JavaScript");else try{P(t,i,{value:e})}catch(e){"onpopstate"===i&&(A("popstate",n=function(){N("popstate",n,!1);var e=t.onpopstate;t.onpopstate=null,setTimeout(function(){t.onpopstate=e},1)},!1),$=0)}t[i]=c}else try{try{var u=x.create(t);P(x.getPrototypeOf(u)===t?u:t,i,n);for(var d in t)"function"==typeof t[d]&&(u[d]=t[d].bind(t));try{r.call(u,u,t)}catch(e){}t=u}catch(e){P(t.constructor.prototype,i,n)}}catch(e){return!1}}return t}function r(e,t,i){return i=i||{},e=e===Y?b:e,i.set=i.set||function(i){e[t]=i},i.get=i.get||function(){return e[t]},i}function a(e,t,i){e in V?V[e].push(t):arguments.length>3?A(e,t,i,arguments[3]):A(e,t,i)}function o(e,t,i){var n=V[e];if(n){for(var r=n.length;r--;)if(n[r]===t){n.splice(r,1);break}}else N(e,t,i)}function s(t,i){var r=(""+("string"==typeof t?t:t.type)).replace(/^on/,""),a=V[r];if(a){if(i="string"==typeof t?i:t,null==i.target)for(var o=["target","currentTarget","srcElement","type"];t=o.pop();)i=n(i,t,{get:"type"===t?function(){return r}:function(){return g}});$&&(("popstate"===r?g.onpopstate:g.onhashchange)||e).call(g,i);for(var s=0,l=a.length;s<l;s++)a[s].call(g,i);return!0}return W(t,i)}function l(){var e=y.createEvent?y.createEvent("Event"):y.createEventObject();e.initEvent?e.initEvent("popstate",!1,!1):e.type="popstate",e.state=E.state,s(e)}function c(){U&&(U=!1,l())}function u(e,i,n,r){if(z)B=b.href;else{0===G&&(G=2);var a=t(i,2===G&&-1!==(""+i).indexOf("#"));a._relative!==t()._relative&&(B=r,n?b.replace("#"+a._special):b.hash=a._special)}!T&&e&&(H[b.href]=e),U=!1}function d(e){var i=B;if(B=b.href,i){R!==b.href&&l(),e=e||g.event;var n=t(i,!0),r=t();e.oldURL||(e.oldURL=n._href,e.newURL=r._href),n._hash!==r._hash&&s(e)}}function p(e){setTimeout(function(){A("popstate",function(e){R=b.href,T||(e=n(e,"state",{get:function(){return E.state}})),s(e)},!1)},0),!z&&!0!==e&&"location"in E&&(m(L.hash),c())}function h(e){for(;e;){if("A"===e.nodeName)return e;e=e.parentNode}}function f(e){var i=e||g.event,n=h(i.target||i.srcElement),r="defaultPrevented"in i?i.defaultPrevented:!1===i.returnValue;if(n&&"A"===n.nodeName&&!r){var a=t(),o=t(n.getAttribute("href",2));a._href.split("#").shift()===o._href.split("#").shift()&&o._hash&&(a._hash!==o._hash&&(L.hash=o._hash),m(o._hash),i.preventDefault?i.preventDefault():i.returnValue=!1)}}function m(e){var t=y.getElementById(e=(e||"").replace(/^#/,""));if(t&&t.id===e&&"A"===t.nodeName){var i=t.getBoundingClientRect();g.scrollTo(w.scrollLeft||0,i.top+(w.scrollTop||0)-(w.clientTop||0))}}var g=("object"==typeof window?window:this)||{};if(!g.history||"emulate"in g.history)return g.history;var v,y=g.document,w=y.documentElement,x=g.Object,_=g.JSON,b=g.location,k=g.history,E=k,S=k.pushState,C=k.replaceState,z=function(){var e=g.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&!!S}(),T="state"in k,P=x.defineProperty,L=n({},"t")?{}:y.createElement("a"),O="",D=g.addEventListener?"addEventListener":(O="on")&&"attachEvent",j=g.removeEventListener?"removeEventListener":"detachEvent",I=g.dispatchEvent?"dispatchEvent":"fireEvent",A=g[D],N=g[j],W=g[I],F={basepath:"/",redirect:0,type:"/",init:0},M="__historyAPI__",q=y.createElement("a"),B=b.href,R="",$=1,U=!1,G=0,H={},V={},Q=y.title,Z={onhashchange:null,onpopstate:null},J=function(e,t){var i=g.history!==k;i&&(g.history=k),e.apply(k,t),i&&(g.history=E)},X={setup:function(e,t,i){F.basepath=(""+(null==e?F.basepath:e)).replace(/(?:^|\/)[^\/]*$/,"/"),F.type=null==t?F.type:t,F.redirect=null==i?F.redirect:!!i},redirect:function(e,i){if(E.setup(i,e),i=F.basepath,g.top==g.self){var n=t(null,!1,!0)._relative,r=b.pathname+b.search;z?(r=r.replace(/([^\/])$/,"$1/"),n!=i&&new RegExp("^"+i+"$","i").test(r)&&b.replace(n)):r!=i&&(r=r.replace(/([^\/])\?/,"$1/?"),new RegExp("^"+i,"i").test(r)&&b.replace(i+"#"+r.replace(new RegExp("^"+i,"i"),F.type)+b.hash))}},pushState:function(e,t,i){var n=y.title;null!=Q&&(y.title=Q),S&&J(S,arguments),u(e,i),y.title=n,Q=t},replaceState:function(e,t,i){var n=y.title;null!=Q&&(y.title=Q),delete H[b.href],C&&J(C,arguments),u(e,i,!0),y.title=n,Q=t},location:{set:function(e){0===G&&(G=1),g.location=e},get:function(){return 0===G&&(G=1),L}},state:{get:function(){return"object"==typeof H[b.href]?_.parse(_.stringify(H[b.href])):void 0!==H[b.href]?H[b.href]:null}}},Y={assign:function(e){z||0!==(""+e).indexOf("#")?b.assign(e):u(null,e)},reload:function(e){b.reload(e)},replace:function(e){z||0!==(""+e).indexOf("#")?b.replace(e):u(null,e,!0)},toString:function(){return this.href},origin:{get:function(){return void 0!==v?v:b.origin?b.origin:b.protocol+"//"+b.hostname+(b.port?":"+b.port:"")},set:function(e){v=e}},href:z?null:{get:function(){return t()._href}},protocol:null,host:null,hostname:null,port:null,pathname:z?null:{get:function(){return t()._pathname}},search:z?null:{get:function(){return t()._search}},hash:z?null:{set:function(e){u(null,(""+e).replace(/^(#|)/,"#"),!1,B)},get:function(){return t()._hash}}};return function(){var e=y.getElementsByTagName("script"),a=(e[e.length-1]||{}).src||"";(-1!==a.indexOf("?")?a.split("?").pop():"").replace(/(\w+)(?:=([^&]*))?/g,function(e,t,i){F[t]=(i||"").replace(/^(0|false)$/,"")}),A(O+"hashchange",d,!1);var o=[Y,L,Z,g,X,E];T&&delete X.state;for(var s=0;s<o.length;s+=2)for(var l in o[s])if(o[s].hasOwnProperty(l))if("object"!=typeof o[s][l])o[s+1][l]=o[s][l];else{var c=r(o[s],l,o[s][l]);if(!n(o[s+1],l,c,function(e,t){t===E&&(g.history=E=o[s+1]=e)}))return N(O+"hashchange",d,!1),!1;o[s+1]===g&&(V[l]=V[l.substr(2)]=[])}return E.setup(),F.redirect&&E.redirect(),F.init&&(G=1),!T&&_&&i(),z||y[D](O+"click",f,!1),"complete"===y.readyState?p(!0):(z||t()._relative===F.basepath||(U=!0),A(O+"load",p,!1)),!0}()?(E.emulate=!z,g[D]=a,g[j]=o,g[I]=s,E):void 0}),function(e,t){"object"==typeof module&&module.exports?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Spinner=t()}(this,function(){"use strict";function e(e,t){var i,n=document.createElement(e||"div");for(i in t)n[i]=t[i];return n}function t(e){for(var t=1,i=arguments.length;t<i;t++)e.appendChild(arguments[t]);return e}function i(e,t,i,n){var r=["opacity",t,~~(100*e),i,n].join("-"),a=.01+i/n*100,o=Math.max(1-(1-e)/t*(100-a),e),s=l.substring(0,l.indexOf("Animation")).toLowerCase(),u=s&&"-"+s+"-"||"";return d[r]||(c.insertRule("@"+u+"keyframes "+r+"{0%{opacity:"+o+"}"+a+"%{opacity:"+e+"}"+(a+.01)+"%{opacity:1}"+(a+t)%100+"%{opacity:"+e+"}100%{opacity:"+o+"}}",c.cssRules.length),d[r]=1),r}function n(e,t){var i,n,r=e.style;if(t=t.charAt(0).toUpperCase()+t.slice(1),void 0!==r[t])return t;for(n=0;n<u.length;n++)if(i=u[n]+t,void 0!==r[i])return i}function r(e,t){for(var i in t)e.style[n(e,i)||i]=t[i];return e}function a(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)void 0===e[n]&&(e[n]=i[n])}return e}function o(e,t){return"string"==typeof e?e:e[t%e.length]}function s(e){this.opts=a(e||{},s.defaults,p)}var l,c,u=["webkit","Moz","ms","O"],d={},p={lines:12,length:7,width:5,radius:10,scale:1,corners:1,color:"#000",opacity:.25,rotate:0,direction:1,speed:1,trail:100,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",shadow:!1,hwaccel:!1,position:"absolute"};if(s.defaults={},a(s.prototype,{spin:function(t){this.stop();var i=this,n=i.opts,a=i.el=e(null,{className:n.className});if(r(a,{position:n.position,width:0,zIndex:n.zIndex,left:n.left,top:n.top}),t&&t.insertBefore(a,t.firstChild||null),a.setAttribute("role","progressbar"),i.lines(a,i.opts),!l){var o,s=0,c=(n.lines-1)*(1-n.direction)/2,u=n.fps,d=u/n.speed,p=(1-n.opacity)/(d*n.trail/100),h=d/n.lines;!function e(){s++;for(var t=0;t<n.lines;t++)o=Math.max(1-(s+(n.lines-t)*h)%d*p,n.opacity),i.opacity(a,t*n.direction+c,o,n);i.timeout=i.el&&setTimeout(e,~~(1e3/u))}()}return i},stop:function(){var e=this.el;return e&&(clearTimeout(this.timeout),e.parentNode&&e.parentNode.removeChild(e),this.el=void 0),this},lines:function(n,a){function s(t,i){return r(e(),{position:"absolute",width:a.scale*(a.length+a.width)+"px",height:a.scale*a.width+"px",background:t,boxShadow:i,transformOrigin:"left",transform:"rotate("+~~(360/a.lines*u+a.rotate)+"deg) translate("+a.scale*a.radius+"px,0)",borderRadius:(a.corners*a.scale*a.width>>1)+"px"})}for(var c,u=0,d=(a.lines-1)*(1-a.direction)/2;u<a.lines;u++)c=r(e(),{position:"absolute",top:1+~(a.scale*a.width/2)+"px",transform:a.hwaccel?"translate3d(0,0,0)":"",opacity:a.opacity,animation:l&&i(a.opacity,a.trail,d+u*a.direction,a.lines)+" "+1/a.speed+"s linear infinite"}),a.shadow&&t(c,r(s("#000","0 0 4px #000"),{top:"2px"})),t(n,t(c,s(o(a.color,u),"0 0 1px rgba(0,0,0,.1)")));return n},opacity:function(e,t,i){t<e.childNodes.length&&(e.childNodes[t].style.opacity=i)}}),"undefined"!=typeof document){c=function(){var i=e("style",{type:"text/css"});return t(document.getElementsByTagName("head")[0],i),i.sheet||i.styleSheet}();var h=r(e("group"),{behavior:"url(#default#VML)"});!n(h,"transform")&&h.adj?function(){function i(t,i){return e("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',i)}c.addRule(".spin-vml","behavior:url(#default#VML)"),s.prototype.lines=function(e,n){function a(){return r(i("group",{coordsize:u+" "+u,coordorigin:-c+" "+-c}),{width:u,height:u})}function s(e,s,l){t(p,t(r(a(),{rotation:360/n.lines*e+"deg",left:~~s}),t(r(i("roundrect",{arcsize:n.corners}),{width:c,height:n.scale*n.width,left:n.scale*n.radius,top:-n.scale*n.width>>1,filter:l}),i("fill",{color:o(n.color,e),opacity:n.opacity}),i("stroke",{opacity:0}))))}var l,c=n.scale*(n.length+n.width),u=2*n.scale*c,d=-(n.width+n.length)*n.scale*2+"px",p=r(a(),{position:"absolute",top:d,left:d});if(n.shadow)for(l=1;l<=n.lines;l++)s(l,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(l=1;l<=n.lines;l++)s(l);return t(e,p)},s.prototype.opacity=function(e,t,i,n){var r=e.firstChild;n=n.shadow&&n.lines||0,r&&t+n<r.childNodes.length&&(r=r.childNodes[t+n],r=r&&r.firstChild,(r=r&&r.firstChild)&&(r.opacity=i))}}():l=n(h,"animation")}return s}),function(e){if("object"==typeof exports)e(require("jquery"),require("spin.js"));else if("function"==typeof define&&define.amd)define(["jquery","spin"],e);else{if(!window.Spinner)throw new Error("Spin.js not present");e(window.jQuery,window.Spinner)}}(function(e,t){e.fn.spin=function(i,n){return this.each(function(){var r=e(this),a=r.data();a.spinner&&(a.spinner.stop(),delete a.spinner),!1!==i&&(i=e.extend({color:n||r.css("color")},e.fn.spin.presets[i]||i),a.spinner=new t(i).spin(this))})},e.fn.spin.presets={tiny:{lines:8,length:2,width:2,radius:3},small:{lines:8,length:4,width:3,radius:5},large:{lines:10,length:8,width:4,radius:8}}});var PG8={};(function(e,t,i,n){"use strict";if("undefined"!=typeof PG8Data){var r=i.history.location||i.location,a=this.PageLoader=function(t){this.thisLink=r.href,this.nextLink=PG8Data.nextLink,this.thisPage=parseInt(PG8Data.startPage,10),this.nextPage=this.thisPage+1,this.maxPages=parseInt(PG8Data.maxPages,10),this.maxedOut=0,this.opts=e.extend({},e.fn.ajaxPageLoader.defaults,t),this.content=e(this.opts.content),this.nextPage<=this.maxPages&&this.init()};a.prototype={init:function(){this.content.children().wrapAll('<div id="content-page-'+parseInt(this.thisPage,10)+'" class="clear" data-href="'+encodeURI(this.thisLink)+'"></div>'),this.holder(),this.handler(),this.spinner()},holder:function(){this.content.append('<div id="content-page-'+parseInt(this.nextPage,10)+'" class="clear" data-href="'+encodeURI(this.nextLink)+'"></div>')},handler:function(){var n=this,r=e(i);e("body").on("click",n.opts.next,function(t){n.nextPage<=n.maxPages&&(t.preventDefault(),e(this).parents("nav:first").before(e("#spinner").show()),n.loader(n.nextPage,n.nextLink))}),r.on("scroll",this.content,function(i){clearTimeout(e.data(this,"pushTimer")),clearTimeout(e.data(this,"infinTimer")),e.data(this,"pushTimer",setTimeout(function(){var t=n.content.children(":first"),i=t.offset().top,a=t.data("href"),o=r.scrollTop();o<=i?n.pusher(a):n.content.children().each(function(){var t=e(this),i=t.offset().top-n.opts.scrollOffset,r=t.outerHeight()+i;i<=o&&o<r&&n.pusher(t.data("href"))})},n.opts.pushDelay)),0===n.maxedOut&&!0===n.opts.infinScroll&&e.data(this,"infinTimer",setTimeout(function(){var i=e(t),a=i.height(),o=r.height()+r.scrollTop(),s=n.content.children(":last").offset().top,l=a-o;o>s+n.opts.scrollOffset&&o<=s+n.opts.scrollOffset+n.opts.infinOffset&&l>=n.opts.infinFooter&&e(n.opts.next).trigger("click")},n.opts.infinDelay))})},spinner:function(){e.isFunction(i.Spinner)&&(this.content.after('<div id="spinner" style="position: relative;"></div>'),e("#spinner").spin(this.opts.spinOpts).hide())},pusher:function(e){void 0!==e&&e!==r.href&&history.pushState(null,null,e)},loader:function(t,i){var n=this;e("#content-page-"+t).load(i+" "+n.opts.content+" > *",function(){var a=e(n.opts.next);n.thisPage=t,n.thisLink=i,n.nextPage=t+1,n.nextLink=i.replace(/\/page\/[0-9]*/,"/page/"+n.nextPage),n.pusher(n.thisLink),n.holder(),n.nextPage>n.maxPages?(a.remove(),n.maxedOut=1):a.is("[href]")?a.attr("href",n.nextLink):e("[href]",a).attr("href",n.nextLink),e("#spinner").hide(),e(n.opts.prev).hide(),n.loaded(),n.scroll(),n.analytics("/"+r.href.replace(n.root(),""))})},loaded:function(){var e=t.createEvent("Event");e.initEvent("DOMContentLoaded",!0,!0),i.document.dispatchEvent(e)},scroll:function(){var t=e("#content-page-"+this.thisPage).children(":first").offset().top-this.opts.scrollOffset;e("body, html").animate({scrollTop:t},this.opts.scrollDelay,"swing")},analytics:function(e){void 0!==i.ga?i.ga("send","pageview",e):void 0!==i._gaq&&i._gaq.push(["_trackPageview",e])},root:function(){var e=t.location.port?":"+t.location.port:"";return t.location.protocol+"//"+(t.location.hostname||t.location.host)+e+"/"}},e.fn.ajaxPageLoader=function(t){return this.each(function(){e.data(this,"ajaxPageLoader")||e.data(this,"ajaxPageLoader",new a(t))})},e.fn.ajaxPageLoader.defaults={content:"main",next:".next-page",prev:".prev-page",scrollDelay:300,scrollOffset:30,pushDelay:250,infinScroll:!0,infinDelay:600,infinOffset:300,infinFooter:1,spinOpts:{lines:25,length:0,width:4,radius:25,speed:1.5,trail:40,top:"15px"}}}}).apply(PG8,[jQuery,document,window]),function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof module&&"object"==typeof module.exports?require("jquery"):jQuery)}(function(e){function t(){var t=a.settings;if(t.autoDispose&&!e.contains(document.documentElement,this))return e(this).timeago("dispose"),this;var o=i(this);return isNaN(o.datetime)||(0===t.cutoff||Math.abs(r(o.datetime))<t.cutoff?e(this).text(n(o.datetime)):e(this).attr("title").length>0&&e(this).text(e(this).attr("title"))),this}function i(t){if(t=e(t),!t.data("timeago")){t.data("timeago",{datetime:a.datetime(t)});var i=e.trim(t.text());a.settings.localeTitle?t.attr("title",t.data("timeago").datetime.toLocaleString()):!(i.length>0)||a.isTime(t)&&t.attr("title")||t.attr("title",i)}return t.data("timeago")}function n(e){return a.inWords(r(e))}function r(e){return(new Date).getTime()-e.getTime()}e.timeago=function(t){return n(t instanceof Date?t:"string"==typeof t?e.timeago.parse(t):"number"==typeof t?new Date(t):e.timeago.datetime(t))};var a=e.timeago;e.extend(e.timeago,{settings:{refreshMillis:6e4,allowPast:!0,allowFuture:!1,localeTitle:!1,cutoff:0,autoDispose:!0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",inPast:"any moment now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(t){function i(i,r){var a=e.isFunction(i)?i(r,t):i,o=n.numbers&&n.numbers[r]||r;return a.replace(/%d/i,o)}if(!this.settings.allowPast&&!this.settings.allowFuture)throw"timeago allowPast and allowFuture settings can not both be set to false.";var n=this.settings.strings,r=n.prefixAgo,a=n.suffixAgo;if(this.settings.allowFuture&&t<0&&(r=n.prefixFromNow,a=n.suffixFromNow),!this.settings.allowPast&&t>=0)return this.settings.strings.inPast;var o=Math.abs(t)/1e3,s=o/60,l=s/60,c=l/24,u=c/365,d=o<45&&i(n.seconds,Math.round(o))||o<90&&i(n.minute,1)||s<45&&i(n.minutes,Math.round(s))||s<90&&i(n.hour,1)||l<24&&i(n.hours,Math.round(l))||l<42&&i(n.day,1)||c<30&&i(n.days,Math.round(c))||c<45&&i(n.month,1)||c<365&&i(n.months,Math.round(c/30))||u<1.5&&i(n.year,1)||i(n.years,Math.round(u)),p=n.wordSeparator||"";return void 0===n.wordSeparator&&(p=" "),e.trim([r,d,a].join(p))},parse:function(t){var i=e.trim(t);return i=i.replace(/\.\d+/,""),i=i.replace(/-/,"/").replace(/-/,"/"),i=i.replace(/T/," ").replace(/Z/," UTC"),i=i.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),i=i.replace(/([\+\-]\d\d)$/," $100"),new Date(i)},datetime:function(t){var i=a.isTime(t)?e(t).attr("datetime"):e(t).attr("title");return a.parse(i)},isTime:function(t){return"time"===e(t).get(0).tagName.toLowerCase()}});var o={init:function(){o.dispose.call(this);var i=e.proxy(t,this);i();var n=a.settings;n.refreshMillis>0&&(this._timeagoInterval=setInterval(i,n.refreshMillis))},update:function(i){var n=i instanceof Date?i:a.parse(i);e(this).data("timeago",{datetime:n}),a.settings.localeTitle&&e(this).attr("title",n.toLocaleString()),t.apply(this)},updateFromDOM:function(){e(this).data("timeago",{datetime:a.parse(a.isTime(this)?e(this).attr("datetime"):e(this).attr("title"))}),t.apply(this)},dispose:function(){this._timeagoInterval&&(window.clearInterval(this._timeagoInterval),this._timeagoInterval=null)}};e.fn.timeago=function(e,t){var i=e?o[e]:o.init;if(!i)throw new Error("Unknown function name '"+e+"' for timeago");return this.each(function(){i.call(this,t)}),this},document.createElement("abbr"),document.createElement("time")}),function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){var t=Array.prototype.slice,i=Array.prototype.splice,n={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:"",widthFromWrapper:!0,responsiveWidth:!1,zIndex:"auto"},r=e(window),a=e(document),o=[],s=r.height(),l=function(){for(var t=r.scrollTop(),i=a.height(),n=i-s,l=t>n?n-t:0,c=0,u=o.length;c<u;c++){var d=o[c],p=d.stickyWrapper.offset().top,h=p-d.topSpacing-l;if(d.stickyWrapper.css("height",d.stickyElement.outerHeight()),t<=h)null!==d.currentTop&&(d.stickyElement.css({width:"",position:"",top:"","z-index":""}),d.stickyElement.parent().removeClass(d.className),d.stickyElement.trigger("sticky-end",[d]),d.currentTop=null);else{var f=i-d.stickyElement.outerHeight()-d.topSpacing-d.bottomSpacing-t-l;if(f<0?f+=d.topSpacing:f=d.topSpacing,d.currentTop!==f){var m;d.getWidthFrom?m=e(d.getWidthFrom).width()||null:d.widthFromWrapper&&(m=d.stickyWrapper.width()),null==m&&(m=d.stickyElement.width()),d.stickyElement.css("width",m).css("position","fixed").css("top",f).css("z-index",d.zIndex),d.stickyElement.parent().addClass(d.className),null===d.currentTop?d.stickyElement.trigger("sticky-start",[d]):d.stickyElement.trigger("sticky-update",[d]),d.currentTop===d.topSpacing&&d.currentTop>f||null===d.currentTop&&f<d.topSpacing?d.stickyElement.trigger("sticky-bottom-reached",[d]):null!==d.currentTop&&f===d.topSpacing&&d.currentTop<f&&d.stickyElement.trigger("sticky-bottom-unreached",[d]),d.currentTop=f}var g=d.stickyWrapper.parent();d.stickyElement.offset().top+d.stickyElement.outerHeight()>=g.offset().top+g.outerHeight()&&d.stickyElement.offset().top<=d.topSpacing?d.stickyElement.css("position","absolute").css("top","").css("bottom",0).css("z-index",""):d.stickyElement.css("position","fixed").css("top",f).css("bottom","").css("z-index",d.zIndex)}}},c=function(){s=r.height();for(var t=0,i=o.length;t<i;t++){var n=o[t],a=null;n.getWidthFrom?n.responsiveWidth&&(a=e(n.getWidthFrom).width()):n.widthFromWrapper&&(a=n.stickyWrapper.width()),null!=a&&n.stickyElement.css("width",a)}},u={init:function(t){var i=e.extend({},n,t);return this.each(function(){var t=e(this),r=t.attr("id"),a=r?r+"-"+n.wrapperClassName:n.wrapperClassName,s=e("<div></div>").attr("id",a).addClass(i.wrapperClassName);t.wrapAll(s);var l=t.parent();i.center&&l.css({width:t.outerWidth(),marginLeft:"auto",marginRight:"auto"}),"right"===t.css("float")&&t.css({float:"none"}).parent().css({float:"right"}),i.stickyElement=t,i.stickyWrapper=l,i.currentTop=null,o.push(i),u.setWrapperHeight(this),u.setupChangeListeners(this)})},setWrapperHeight:function(t){var i=e(t),n=i.parent();n&&n.css("height",i.outerHeight())},setupChangeListeners:function(e){if(window.MutationObserver){new window.MutationObserver(function(t){(t[0].addedNodes.length||t[0].removedNodes.length)&&u.setWrapperHeight(e)}).observe(e,{subtree:!0,childList:!0})}else e.addEventListener("DOMNodeInserted",function(){u.setWrapperHeight(e)},!1),e.addEventListener("DOMNodeRemoved",function(){u.setWrapperHeight(e)},!1)},update:l,unstick:function(t){return this.each(function(){for(var t=this,n=e(t),r=-1,a=o.length;a-- >0;)o[a].stickyElement.get(0)===t&&(i.call(o,a,1),r=a);-1!==r&&(n.unwrap(),n.css({width:"",position:"",top:"",float:"","z-index":""}))})}};window.addEventListener?(window.addEventListener("scroll",l,!1),window.addEventListener("resize",c,!1)):window.attachEvent&&(window.attachEvent("onscroll",l),window.attachEvent("onresize",c)),e.fn.sticky=function(i){return u[i]?u[i].apply(this,t.call(arguments,1)):"object"!=typeof i&&i?void e.error("Method "+i+" does not exist on jQuery.sticky"):u.init.apply(this,arguments)},e.fn.unstick=function(i){return u[i]?u[i].apply(this,t.call(arguments,1)):"object"!=typeof i&&i?void e.error("Method "+i+" does not exist on jQuery.sticky"):u.unstick.apply(this,arguments)},e(function(){setTimeout(l,0)})}),document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll('input[type="range"].slider');[].forEach.call(e,function(e){var t=findOutputForSlider(e);if(t){if(e.classList.contains("has-output-tooltip")){var i=getSliderOutputPosition(e);t.style.left=i.position}e.addEventListener("input",function(e){if(e.target.classList.contains("has-output-tooltip")){var i=getSliderOutputPosition(e.target);t.style.left=i.position}t.value=e.target.value})}})}),function(e){e(function(){function t(e){var t=e.id;outputs=document.getElementsByTagName("output");for(var i=0;i<outputs.length;i++)if(outputs[i].htmlFor==t)return outputs[i]}function i(e){var t,i,n=window.getComputedStyle(e,null);sliderWidth=parseInt(n.getPropertyValue("width"),10),i=e.getAttribute("min")?e.getAttribute("min"):0;var r=(e.value-i)/(e.getAttribute("max")-i);return t=r<0?0:r>1?sliderWidth:sliderWidth*r,{position:t+"px"}}!function(){e("header").sticky({topSpacing:0}),e(".navbar-burger").on("click",function(){e(this).addClass("is-active"),e("#menu").addClass("is-active")}),e("#menu .close").on("click",function(){e(".navbar-burger").removeClass("is-active"),e("#menu").removeClass("is-active")})}(),function(){e(".owl-carousel.autoplay").owlCarousel({autoplay:!0,autoplayTimeout:8e3,smartSpeed:1e3,autoWidth:!1,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e(".owl-carousel").not("#prizes-gallery .gallery, .owl-carousel.autoplay, .jury-preview").owlCarousel({autoWidth:!1,smartSpeed:1e3,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e("#prizes-gallery .gallery").owlCarousel({autoplay:!0,autoplayTimeout:8e3,smartSpeed:2e3,autoWidth:!0,center:!0,loop:!0,nav:!0,items:2,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]}),e(".jury-preview").owlCarousel({autoWidth:!1,smartSpeed:1e3,loop:!0,nav:!0,items:1,responsiveClass:!0,responsive:{0:{nav:!1},400:{nav:!0}},navText:[" "," "]})}(),function(){function t(e,t){var i=new Image;i.src=e,i.onload=function(){t(this.width,this.height)}}function i(){var t=e(".kategorie .wpuf-fields").find("input:checked"),i=t.val();console.log(i);var n=e(".datei, .post_title, .datum, .standort, .part-2, .part-3, .wpuf-submit"),o=e(".serienname, .series_counter");if(n.show(),e(".max").hide(),"foto"==i)o.hide();else if("serie"==i){o.show();var l=r.totalseriescount,c=50-l;if(r.total.serie>=1&&(console.log("honk1"),(r.serienname||s)&&(console.log("honk2"),e('input[name="serienname"]').val(r.serienname),e("li.serienname").css({overflow:"hidden",height:0,opacity:0,display:"none !important",padding:0,margin:0}))),c>0||r.total.serie>0){var u="Es wurden bereits "+l+" von 50 möglichen Serien eingereicht.",d='<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">'+u+"</p>";e(".series_counter").length<1&&0==r.total.serie&&e(".part-2").prepend(d),o.show()}else{n.hide();var u="Das Limit von 50 möglichen Serien-Einsendungen ist bereits erreicht.",d='<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">'+u+"</p>";e(".wpuf-form .wpuf-el:first").after(d)}e('label[for="serienname"]').html('Serientitel <span class="required">*</span>')}else"karikatur"==i&&(o.hide(),e('label[for="datum"]').html('Erscheinungsdatum <span class="required">*</span>'),e('label[for="standort"]').html('Veröffentlicht in folgender Zeitung <span class="required">*</span>'));r.total[i]<a[i].max&&r.total[i]<a.val.min&&console.log("too few "+i),r.total[i]<a[i].max&&r.total[i]>a.val.min&&console.log("not too few, not too many "+i),r.total[i]>=a[i].max&&(console.log("max "+i),n.hide(),o.hide(),e(".error.max").length?e(".max").show():e(".kategorie").after('<li class="error max"><p><b>Sollten Sie ihre Bildauswahl ändern wollen, löschen Sie bitte zuerst unter &bdquo;Bildaktualisierung&ldquo; die Datei/Dateien, die Sie nicht zum Wettbewerb einreichen möchten und laden dann die neuen Bilddateien hoch.</b></p></li>'))}if(e("body").hasClass("page-id-19949")||e("body").hasClass("page-id-19936")){console.log("uploadFormStuff()"),e(".wpuf-submit-button").on("click",function(){setTimeout(function(){console.log("fix english form errors"),e(".wpuf-error-msg").each(function(){var t=e(this).text();console.log(t),"Bildbeschriftung is required"==t&&e(this).text("Bitte Bildunterschrift hinzufügen"),"Aufnahmeort is required"==t&&e(this).text("Bitte Aufnahmeort hinzufügen"),"Aufnahmedatum is required"==t&&e(this).text("Bitte Aufnahmedatum hinzufügen"),"Datei is required"==t&&e(this).text("Bitte Datei hinzufügen"),"Please fix the errors to proceed"==t&&e(this).text(""),""==t&&e(this).text("Bitte die fehlenden Felder ausfüllen um fortzufahren")})},100)});var n=!1;e(document).on("DOMSubtreeModified",function(){if(!n){var i=e(".wpuf-attachment-list .attachment-name img");if(i.length){var r=i.attr("src");r&&(foundImg=!0);var a=i.attr("alt"),o=r.substring(0,r.lastIndexOf("/")),s=r.split(".").pop();n=o+"/"+a+"."+s,console.log(n),t(n,function(t,i){t<1200&&(alert("Dieses Bild ist zu klein. Bitte lade in höherer Auflösung hoch."),e("a.attachment-delete").trigger("click"),n=!1)})}}});var r=e("#state").data("state");console.log("---- state -----"),console.log(r),console.log("----------------");var a={foto:{min:2,max:4},serie:{min:4,max:6},karikatur:{min:2,max:6}};"fotograf"===r.usertype&&e('input[value="karikatur"]').parent().hide(),"karikaturist"===r.usertype&&(e('input[value="foto"]').parent().hide(),e('input[value="serie"]').parent().hide(),e('input[value="karikatur"]').prop("checked",!0),i()),e(".wpuf-el.kategorie").on("change",function(){i()});var o=window.location.pathname,s=!1;o.indexOf("edit")>=0&&(s=!0,console.log("isEdit"),i())}}(),function(){e("body").hasClass("um-page-register")&&e("#confirm_user_password-20047").attr("placeholder","Passwort wiederholen")}(),function(){function t(t){var i=e(".series-image.current"),n=null;if("prev"==t&&i.prev().length?(n=i.prev().find("a.zoom").data("zoom"),e(".series-image.current").removeClass("current"),i.prev().addClass("current")):"next"==t&&i.next().length&&(n=i.next().find("a.zoom").data("zoom"),e(".series-image.current").removeClass("current"),i.next().addClass("current")),null!==n){const r='<img src="'+n+'">';e("#zoom .image").html(r)}}e("a.zoom").on("click",function(t){e(this).parent().addClass("current");const i=e(this).data("zoom"),n='<img src="'+i+'">';e("#zoom .image").html(n),e("#zoom").show(),t.preventDefault()}),e("#zoom .close").on("click",function(t){e("#zoom").hide(),e("#zoom .image img").remove(),e(".current").removeClass("current"),t.preventDefault()}),e(document).keydown(function(e){switch(e.which){case 37:t("prev");break;case 39:t("next");break;default:return}e.preventDefault()})}();var n,r,a,o,s=new Date;n=e("body").hasClass("page-id-78")?"teilnehmer":e("body").hasClass("page-id-82")?"archiv":e("body").hasClass("page-id-199")?"shortlist":"other",console.log("WP API > "+n),function(){function t(){l({target:u.target,w:u.winners,y:u.year,c:u.category,s:u.search,pg:u.paged,pp:u.per_page,filter_series:u.filter_series,shortlist:u.shortlist})}function i(){var t=u.section,i=e("#archiv");console.log("setSection(): "+t),
"winners"==t&&(u.winners="INCLUDE,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1,photo_prize_first,photo_prize_2,photo_prize_3,photo_public,cartoon_public",u.target=".section.winners .columns",u.filter_series=!0,u.search="",u.paged=1,u.category="",i.find('*[data-section="winners"]').show(),i.find('*[data-section="archive"]').hide()),"archive"==t&&(u.winners=null,u.target="#results",u.filter_series=!1,u.search="",u.paged=1,u.category="Foto",i.find('*[data-section="winners"]').hide(),i.find('*[data-section="archive"]').show())}function l(t){console.log("doAjax"),console.log(t);var i=t.target;if(t.series_name)var n=!0;else var n=!1;"winners"==u.section?(e(i+" .column .inner").remove(),e(i+" .column").removeClass("loaded")):e(i+" .column").remove(),e(i).addClass("is-loading"),e.ajax({method:"GET",data:t,url:"/wp-json/relevanssi/v2/fetch",success:function(t){if(console.log(t),e(i).removeClass("is-loading"),"nada"!==t[0]){for(var r=0;r<t.length;r++){var a=t[r],o="",s="";if(a.series_name&&"Serie"===a.category){o='<div class="series">'+a.series_name+"</div>";var l=" series-icon"}else var l="";if(a.winner)var c=" badge-"+a.winner;else var c="";if(s='<div class="caption">'+a.caption+'</div><div class="shade"></div>',a.series_name&&"Serie"===a.category)var d='<a href="'+a.link+'"><div class="'+c+'"><div class="image'+l+'" style="background-image: url('+a.thumb+')">&nbsp;</div></div><div class="name">'+a.fullname+' <span class="year">('+a.year+")</span></div></a>"+o+s;else var d='<a href="'+a.link+'"><div class="image'+l+c+'" style="background-image: url('+a.thumb+')">&nbsp;</div><div class="name">'+a.fullname+' <span class="year">('+a.year+")</span></div></a>"+o+s;if("winners"==u.section){d='<div class="inner">'+d+"</div>";var p=e('[data-prize="'+a.winner+'"]');p.hasClass("loaded")||p.addClass("loaded").html(d)}else if(n){var h='<img src="'+a.large+'">';e(i).append('<div class="slide"><span  class="watermark photo">'+h+"</span></div>")}else e(i).append('<div class="column is-3" data-year="'+a.year+'">'+d+"</div>")}setTimeout(function(){var t=0,n=e(i).data("current");e(i+" .column").each(function(){var i=e(this);i.data("year")!==n||"winners"==u.section&&!i.is(":empty")?(t+=40,setTimeout(function(){i.is(":hidden")&&i.show(),i.addClass("loaded")},t)):i.hide()}),e(".pagination.is-hidden").removeClass("is-hidden"),e(".loadmore.is-hidden").removeClass("is-hidden")},10)}else e(i).append('<div class="column is-6 is-offset-3 error"><h1>Keine Treffer</h1></div>'),setTimeout(function(){e(i+" .error").addClass("loaded")},10)},cache:!0})}var c="#results";"teilnehmer"==n?r="EXCLUDE,photo_prize_first,das_scharfe_sehen_1,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3":"archiv"==n?(r="INCLUDE,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1,photo_prize_first,photo_prize_2,photo_prize_3,photo_public,cartoon_public",a=e("#archiv").data("section"),c=".section.winners .columns"):"shortlist"==n?(r=null,o=!0):r=null,e(".tabs li:first").addClass("is-active");var u={target:c,category:e(".tabs li:first").data("category"),year:s.getFullYear()-1,search:null,page:n,section:a,winners:r,paged:1,per_page:20,filter_series:!0,shortlist:o};console.log("filters:"),console.log(u),"empty"===e("#results").data("state")&&(i(),t()),e("#searchform").on("submit",function(){var i=e(this).serializeArray();return i=i[0],i=i.value,i||(i=null),u.search=i,u.paged=1,u.target="#results",t(),!1}),e(".fetch").each(function(){var t=e(this),i="#"+t.attr("id"),n=t.data("pp");n||(n=20),t.on("fetchit",function(){console.log("fetchit: "+e(this).attr("id")),l({target:i,y:t.data("y"),c:t.data("c"),s:t.data("s"),uid:t.data("uid"),series_name:t.data("series"),pg:1,pp:n,filter_series:!0}),t.removeClass("fetchit")}),t.hasClass("wait")||t.trigger("fetchit")}),e(".slider-section .slider").on("change",function(){var i=e("#filterYear").contents().text();console.log(i),"winners"!==u.section&&(u.target="#results"),u.year=i,e(".more").remove(),t()}),e("#load-more").on("click",function(){e("#results").append('<div class="more columns is-multiline"/>'),u.paged=u.paged+1,u.target="#results .more:last",t()}),e(".pagination .arrow").on("click",function(){var i=e(this),n=i.data("dir"),r=u.paged;return"next"==n?(u.paged=r+1,t()):r-1>0&&(u.paged=r-1,t()),e(".pagination .page span").text(u.paged),console.log("page: "+u.paged),!1}),e(".tabs li").on("click",function(){e(this).closest(".tabs").find(".is-active").removeClass("is-active"),e(this).addClass("is-active");var n=e(this).data("category"),r=e(this).data("tab");return n?(u.category=n,u.target="#results",u.paged=1):r&&(u.section=r,i()),t(),!1})}(),e(".past-years.notice").on("click",function(){var t=e(this).closest("section");t.hasClass("is-active")?t.removeClass("is-active"):(t.addClass("is-active"),e(this).parent().find(".fetch.wait").trigger("fetchit"))}),e(".single-info .back").on("click",function(){window.history.back()});var l=e(window).height()-e("#footer").height()-e("#pre-header").height()-e("#header").height();e("#main, .column.side-menu").css("min-height",l),e(".wpuf-dashboard-content.posts tbody tr").each(function(){e(this).find("td:first a").contents().unwrap()}),document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll('input[type="range"].slider');[].forEach.call(e,function(e){var n=t(e);if(n){if(e.classList.contains("has-output-tooltip")){var r=i(e);n.style.left=r.position}e.addEventListener("input",function(e){if(e.target.classList.contains("has-output-tooltip")){var t=i(e.target);n.style.left=t.position}n.value=e.target.value})}})}),console.log("remove pw txt"),e(".um-field-password_reset_text div div").text("Um Ihr Passwort zurückzusetzen, geben Sie bitte Ihre E-Mail-Adresse oder Benutzernamen unten ein."),e(".um-field-username_b input").attr("placeholder","Geben Sie Ihren Benutzernamen und Ihre E-Mail-Adresse ein.")})}(jQuery);
//# sourceMappingURL=x-pageloader.js.map
