/*!
 * History API JavaScript Library v4.2.8
 *
 * Support: IE8+, FF3+, Opera 9+, Safari, Chrome and other
 *
 * Copyright 2011-2017, Dmitrii Pakhtinov ( spb.piksel@gmail.com )
 *
 * http://spb-piksel.ru/
 *
 * MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Update: 2017-03-01 12:07
 */
(function(factory) {
  if (typeof define === 'function' && define['amd']) {
    if (typeof requirejs !== 'undefined') {
      // https://github.com/devote/HTML5-History-API/issues/73
      var r = requirejs,
          rndKey = '[history' + (new Date()).getTime() + ']';
      var onError = r['onError'];
      factory.toString = function() {
        return rndKey;
      };
      r['onError'] = function(err) {
        if (err.message.indexOf(rndKey) === -1) {
          onError.call(r, err);
        }
      };
    }
    define([], factory);
  }
  // commonJS support
  if (typeof exports === "object" && typeof module !== "undefined") {
    module['exports'] = factory();
  } else {
    // execute anyway
    return factory();
  }
})(function() {
  // Define global variable
  var global = (typeof window === 'object' ? window : this) || {};
  // Prevent the code from running if there is no window.history object or library already loaded
  if (!global.history || "emulate" in global.history) return global.history;
  // symlink to document
  var document = global.document;
  // HTML element
  var documentElement = document.documentElement;
  // symlink to constructor of Object
  var Object = global['Object'];
  // symlink to JSON Object
  var JSON = global['JSON'];
  // symlink to instance object of 'Location'
  var windowLocation = global.location;
  // symlink to instance object of 'History'
  var windowHistory = global.history;
  // new instance of 'History'. The default is a reference to the original object instance
  var historyObject = windowHistory;
  // symlink to method 'history.pushState'
  var historyPushState = windowHistory.pushState;
  // symlink to method 'history.replaceState'
  var historyReplaceState = windowHistory.replaceState;
  // if the browser supports HTML5-History-API
  var isSupportHistoryAPI = isSupportHistoryAPIDetect();
  // verifies the presence of an object 'state' in interface 'History'
  var isSupportStateObjectInHistory = 'state' in windowHistory;
  // symlink to method 'Object.defineProperty'
  var defineProperty = Object.defineProperty;
  // new instance of 'Location', for IE8 will use the element HTMLAnchorElement, instead of pure object
  var locationObject = redefineProperty({}, 't') ? {} : document.createElement('a');
  // prefix for the names of events
  var eventNamePrefix = '';
  // String that will contain the name of the method
  var addEventListenerName = global.addEventListener ? 'addEventListener' : (eventNamePrefix = 'on') && 'attachEvent';
  // String that will contain the name of the method
  var removeEventListenerName = global.removeEventListener ? 'removeEventListener' : 'detachEvent';
  // String that will contain the name of the method
  var dispatchEventName = global.dispatchEvent ? 'dispatchEvent' : 'fireEvent';
  // reference native methods for the events
  var addEvent = global[addEventListenerName];
  var removeEvent = global[removeEventListenerName];
  var dispatch = global[dispatchEventName];
  // default settings
  var settings = {"basepath": '/', "redirect": 0, "type": '/', "init": 0};
  // key for the sessionStorage
  var sessionStorageKey = '__historyAPI__';
  // Anchor Element for parseURL function
  var anchorElement = document.createElement('a');
  // last URL before change to new URL
  var lastURL = windowLocation.href;
  // Control URL, need to fix the bug in Opera
  var checkUrlForPopState = '';
  // for fix on Safari 8
  var triggerEventsInWindowAttributes = 1;
  // trigger event 'onpopstate' on page load
  var isFireInitialState = false;
  // if used history.location of other code
  var isUsedHistoryLocationFlag = 0;
  // store a list of 'state' objects in the current session
  var stateStorage = {};
  // in this object will be stored custom handlers
  var eventsList = {};
  // stored last title
  var lastTitle = document.title;
  // store a custom origin
  var customOrigin;

  /**
   * Properties that will be replaced in the global
   * object 'window', to prevent conflicts
   *
   * @type {Object}
   */
  var eventsDescriptors = {
    "onhashchange": null,
    "onpopstate": null
  };

  /**
   * Fix for Chrome in iOS
   * See https://github.com/devote/HTML5-History-API/issues/29
   */
  var fastFixChrome = function(method, args) {
    var isNeedFix = global.history !== windowHistory;
    if (isNeedFix) {
      global.history = windowHistory;
    }
    method.apply(windowHistory, args);
    if (isNeedFix) {
      global.history = historyObject;
    }
  };

  /**
   * Properties that will be replaced/added to object
   * 'window.history', includes the object 'history.location',
   * for a complete the work with the URL address
   *
   * @type {Object}
   */
  var historyDescriptors = {
    /**
     * Setting library initialization
     *
     * @param {null|String} [basepath] The base path to the site; defaults to the root "/".
     * @param {null|String} [type] Substitute the string after the anchor; by default "/".
     * @param {null|Boolean} [redirect] Enable link translation.
     */
    "setup": function(basepath, type, redirect) {
      settings["basepath"] = ('' + (basepath == null ? settings["basepath"] : basepath))
        .replace(/(?:^|\/)[^\/]*$/, '/');
      settings["type"] = type == null ? settings["type"] : type;
      settings["redirect"] = redirect == null ? settings["redirect"] : !!redirect;
    },
    /**
     * @namespace history
     * @param {String} [type]
     * @param {String} [basepath]
     */
    "redirect": function(type, basepath) {
      historyObject['setup'](basepath, type);
      basepath = settings["basepath"];
      if (global.top == global.self) {
        var relative = parseURL(null, false, true)._relative;
        var path = windowLocation.pathname + windowLocation.search;
        if (isSupportHistoryAPI) {
          path = path.replace(/([^\/])$/, '$1/');
          if (relative != basepath && (new RegExp("^" + basepath + "$", "i")).test(path)) {
            windowLocation.replace(relative);
          }
        } else if (path != basepath) {
          path = path.replace(/([^\/])\?/, '$1/?');
          if ((new RegExp("^" + basepath, "i")).test(path)) {
            windowLocation.replace(basepath + '#' + path.
              replace(new RegExp("^" + basepath, "i"), settings["type"]) + windowLocation.hash);
          }
        }
      }
    },
    /**
     * The method adds a state object entry
     * to the history.
     *
     * @namespace history
     * @param {Object} state
     * @param {string} title
     * @param {string} [url]
     */
    pushState: function(state, title, url) {
      var t = document.title;
      if (lastTitle != null) {
        document.title = lastTitle;
      }
      historyPushState && fastFixChrome(historyPushState, arguments);
      changeState(state, url);
      document.title = t;
      lastTitle = title;
    },
    /**
     * The method updates the state object,
     * title, and optionally the URL of the
     * current entry in the history.
     *
     * @namespace history
     * @param {Object} state
     * @param {string} title
     * @param {string} [url]
     */
    replaceState: function(state, title, url) {
      var t = document.title;
      if (lastTitle != null) {
        document.title = lastTitle;
      }
      delete stateStorage[windowLocation.href];
      historyReplaceState && fastFixChrome(historyReplaceState, arguments);
      changeState(state, url, true);
      document.title = t;
      lastTitle = title;
    },
    /**
     * Object 'history.location' is similar to the
     * object 'window.location', except that in
     * HTML4 browsers it will behave a bit differently
     *
     * @namespace history
     */
    "location": {
      set: function(value) {
        if (isUsedHistoryLocationFlag === 0) isUsedHistoryLocationFlag = 1;
        global.location = value;
      },
      get: function() {
        if (isUsedHistoryLocationFlag === 0) isUsedHistoryLocationFlag = 1;
        return locationObject;
      }
    },
    /**
     * A state object is an object representing
     * a user interface state.
     *
     * @namespace history
     */
    "state": {
      get: function() {
        if (typeof stateStorage[windowLocation.href] === 'object') {
          return JSON.parse(JSON.stringify(stateStorage[windowLocation.href]));
        } else if(typeof stateStorage[windowLocation.href] !== 'undefined') {
          return stateStorage[windowLocation.href];
        } else {
          return null;
        }
      }
    }
  };

  /**
   * Properties for object 'history.location'.
   * Object 'history.location' is similar to the
   * object 'window.location', except that in
   * HTML4 browsers it will behave a bit differently
   *
   * @type {Object}
   */
  var locationDescriptors = {
    /**
     * Navigates to the given page.
     *
     * @namespace history.location
     */
    assign: function(url) {
      if (!isSupportHistoryAPI && ('' + url).indexOf('#') === 0) {
        changeState(null, url);
      } else {
        windowLocation.assign(url);
      }
    },
    /**
     * Reloads the current page.
     *
     * @namespace history.location
     */
    reload: function(flag) {
      windowLocation.reload(flag);
    },
    /**
     * Removes the current page from
     * the session history and navigates
     * to the given page.
     *
     * @namespace history.location
     */
    replace: function(url) {
      if (!isSupportHistoryAPI && ('' + url).indexOf('#') === 0) {
        changeState(null, url, true);
      } else {
        windowLocation.replace(url);
      }
    },
    /**
     * Returns the current page's location.
     *
     * @namespace history.location
     */
    toString: function() {
      return this.href;
    },
    /**
     * Returns the current origin.
     *
     * @namespace history.location
     */
    "origin": {
      get: function() {
        if (customOrigin !== void 0) {
          return customOrigin;
        }
        if (!windowLocation.origin) {
          return windowLocation.protocol + "//" + windowLocation.hostname + (windowLocation.port ? ':' + windowLocation.port: '');
        }
        return windowLocation.origin;
      },
      set: function(value) {
        customOrigin = value;
      }
    },
    /**
     * Returns the current page's location.
     * Can be set, to navigate to another page.
     *
     * @namespace history.location
     */
    "href": isSupportHistoryAPI ? null : {
      get: function() {
        return parseURL()._href;
      }
    },
    /**
     * Returns the current page's protocol.
     *
     * @namespace history.location
     */
    "protocol": null,
    /**
     * Returns the current page's host and port number.
     *
     * @namespace history.location
     */
    "host": null,
    /**
     * Returns the current page's host.
     *
     * @namespace history.location
     */
    "hostname": null,
    /**
     * Returns the current page's port number.
     *
     * @namespace history.location
     */
    "port": null,
    /**
     * Returns the current page's path only.
     *
     * @namespace history.location
     */
    "pathname": isSupportHistoryAPI ? null : {
      get: function() {
        return parseURL()._pathname;
      }
    },
    /**
     * Returns the current page's search
     * string, beginning with the character
     * '?' and to the symbol '#'
     *
     * @namespace history.location
     */
    "search": isSupportHistoryAPI ? null : {
      get: function() {
        return parseURL()._search;
      }
    },
    /**
     * Returns the current page's hash
     * string, beginning with the character
     * '#' and to the end line
     *
     * @namespace history.location
     */
    "hash": isSupportHistoryAPI ? null : {
      set: function(value) {
        changeState(null, ('' + value).replace(/^(#|)/, '#'), false, lastURL);
      },
      get: function() {
        return parseURL()._hash;
      }
    }
  };

  /**
   * Just empty function
   *
   * @return void
   */
  function emptyFunction() {
    // dummy
  }

  /**
   * Prepares a parts of the current or specified reference for later use in the library
   *
   * @param {string} [href]
   * @param {boolean} [isWindowLocation]
   * @param {boolean} [isNotAPI]
   * @return {Object}
   */
  function parseURL(href, isWindowLocation, isNotAPI) {
    var re = /(?:([a-zA-Z0-9\-]+\:))?(?:\/\/(?:[^@]*@)?([^\/:\?#]+)(?::([0-9]+))?)?([^\?#]*)(?:(\?[^#]+)|\?)?(?:(#.*))?/;
    if (href != null && href !== '' && !isWindowLocation) {
      var current = parseURL(),
          base = document.getElementsByTagName('base')[0];
      if (!isNotAPI && base && base.getAttribute('href')) {
        // Fix for IE ignoring relative base tags.
        // See http://stackoverflow.com/questions/3926197/html-base-tag-and-local-folder-path-with-internet-explorer
        base.href = base.href;
        current = parseURL(base.href, null, true);
      }
      var _pathname = current._pathname, _protocol = current._protocol;
      // convert to type of string
      href = '' + href;
      // convert relative link to the absolute
      href = /^(?:\w+\:)?\/\//.test(href) ? href.indexOf("/") === 0
        ? _protocol + href : href : _protocol + "//" + current._host + (
        href.indexOf("/") === 0 ? href : href.indexOf("?") === 0
          ? _pathname + href : href.indexOf("#") === 0
          ? _pathname + current._search + href : _pathname.replace(/[^\/]+$/g, '') + href
        );
    } else {
      href = isWindowLocation ? href : windowLocation.href;
      // if current browser not support History-API
      if (!isSupportHistoryAPI || isNotAPI) {
        // get hash fragment
        href = href.replace(/^[^#]*/, '') || "#";
        // form the absolute link from the hash
        // https://github.com/devote/HTML5-History-API/issues/50
        href = windowLocation.protocol.replace(/:.*$|$/, ':') + '//' + windowLocation.host + settings['basepath']
          + href.replace(new RegExp("^#[\/]?(?:" + settings["type"] + ")?"), "");
      }
    }
    // that would get rid of the links of the form: /../../
    anchorElement.href = href;
    // decompose the link in parts
    var result = re.exec(anchorElement.href);
    // host name with the port number
    var host = result[2] + (result[3] ? ':' + result[3] : '');
    // folder
    var pathname = result[4] || '/';
    // the query string
    var search = result[5] || '';
    // hash
    var hash = result[6] === '#' ? '' : (result[6] || '');
    // relative link, no protocol, no host
    var relative = pathname + search + hash;
    // special links for set to hash-link, if browser not support History API
    var nohash = pathname.replace(new RegExp("^" + settings["basepath"], "i"), settings["type"]) + search;
    // result
    return {
      _href: result[1] + '//' + host + relative,
      _protocol: result[1],
      _host: host,
      _hostname: result[2],
      _port: result[3] || '',
      _pathname: pathname,
      _search: search,
      _hash: hash,
      _relative: relative,
      _nohash: nohash,
      _special: nohash + hash
    }
  }

  /**
   * Detect HistoryAPI support while taking into account false positives.
   * Based on https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
   */
  function isSupportHistoryAPIDetect(){
    var ua = global.navigator.userAgent;
    // We only want Android 2 and 4.0, stock browser, and not Chrome which identifies
    // itself as 'Mobile Safari' as well, nor Windows Phone (issue #1471).
    if ((ua.indexOf('Android 2.') !== -1 ||
      (ua.indexOf('Android 4.0') !== -1)) &&
      ua.indexOf('Mobile Safari') !== -1 &&
      ua.indexOf('Chrome') === -1 &&
      ua.indexOf('Windows Phone') === -1)
    {
      return false;
    }
    // Return the regular check
    return !!historyPushState;
  }

  /**
   * Initializing storage for the custom state's object
   */
  function storageInitialize() {
    var sessionStorage;
    /**
     * sessionStorage throws error when cookies are disabled
     * Chrome content settings when running the site in a Facebook IFrame.
     * see: https://github.com/devote/HTML5-History-API/issues/34
     * and: http://stackoverflow.com/a/12976988/669360
     */
    try {
      sessionStorage = global['sessionStorage'];
      sessionStorage.setItem(sessionStorageKey + 't', '1');
      sessionStorage.removeItem(sessionStorageKey + 't');
    } catch(_e_) {
      sessionStorage = {
        getItem: function(key) {
          var cookie = document.cookie.split(key + "=");
          return cookie.length > 1 && cookie.pop().split(";").shift() || 'null';
        },
        setItem: function(key, value) {
          var state = {};
          // insert one current element to cookie
          if (state[windowLocation.href] = historyObject.state) {
            document.cookie = key + '=' + JSON.stringify(state);
          }
        }
      }
    }

    try {
      // get cache from the storage in browser
      stateStorage = JSON.parse(sessionStorage.getItem(sessionStorageKey)) || {};
    } catch(_e_) {
      stateStorage = {};
    }

    // hang up the event handler to event unload page
    addEvent(eventNamePrefix + 'unload', function() {
      // save current state's object
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(stateStorage));
    }, false);
  }

  /**
   * This method is implemented to override the built-in(native)
   * properties in the browser, unfortunately some browsers are
   * not allowed to override all the properties and even add.
   * For this reason, this was written by a method that tries to
   * do everything necessary to get the desired result.
   *
   * @param {Object} object The object in which will be overridden/added property
   * @param {String} prop The property name to be overridden/added
   * @param {Object} [descriptor] An object containing properties set/get
   * @param {Function} [onWrapped] The function to be called when the wrapper is created
   * @return {Object|Boolean} Returns an object on success, otherwise returns false
   */
  function redefineProperty(object, prop, descriptor, onWrapped) {
    var testOnly = 0;
    // test only if descriptor is undefined
    if (!descriptor) {
      descriptor = {set: emptyFunction};
      testOnly = 1;
    }
    // variable will have a value of true the success of attempts to set descriptors
    var isDefinedSetter = !descriptor.set;
    var isDefinedGetter = !descriptor.get;
    // for tests of attempts to set descriptors
    var test = {configurable: true, set: function() {
      isDefinedSetter = 1;
    }, get: function() {
      isDefinedGetter = 1;
    }};

    try {
      // testing for the possibility of overriding/adding properties
      defineProperty(object, prop, test);
      // running the test
      object[prop] = object[prop];
      // attempt to override property using the standard method
      defineProperty(object, prop, descriptor);
    } catch(_e_) {
    }

    // If the variable 'isDefined' has a false value, it means that need to try other methods
    if (!isDefinedSetter || !isDefinedGetter) {
      // try to override/add the property, using deprecated functions
      if (object.__defineGetter__) {
        // testing for the possibility of overriding/adding properties
        object.__defineGetter__(prop, test.get);
        object.__defineSetter__(prop, test.set);
        // running the test
        object[prop] = object[prop];
        // attempt to override property using the deprecated functions
        descriptor.get && object.__defineGetter__(prop, descriptor.get);
        descriptor.set && object.__defineSetter__(prop, descriptor.set);
      }

      // Browser refused to override the property, using the standard and deprecated methods
      if (!isDefinedSetter || !isDefinedGetter) {
        if (testOnly) {
          return false;
        } else if (object === global) {
          // try override global properties
          try {
            // save original value from this property
            var originalValue = object[prop];
            // set null to built-in(native) property
            object[prop] = null;
          } catch(_e_) {
          }
          // This rule for Internet Explorer 8
          if ('execScript' in global) {
            /**
             * to IE8 override the global properties using
             * VBScript, declaring it in global scope with
             * the same names.
             */
            global['execScript']('Public ' + prop, 'VBScript');
            global['execScript']('var ' + prop + ';', 'JavaScript');
          } else {
            try {
              /**
               * This hack allows to override a property
               * with the set 'configurable: false', working
               * in the hack 'Safari' to 'Mac'
               */
              defineProperty(object, prop, {value: emptyFunction});
            } catch(_e_) {
              if (prop === 'onpopstate') {
                /**
                 * window.onpopstate fires twice in Safari 8.0.
                 * Block initial event on window.onpopstate
                 * See: https://github.com/devote/HTML5-History-API/issues/69
                 */
                addEvent('popstate', descriptor = function() {
                  removeEvent('popstate', descriptor, false);
                  var onpopstate = object.onpopstate;
                  // cancel initial event on attribute handler
                  object.onpopstate = null;
                  setTimeout(function() {
                    // restore attribute value after short time
                    object.onpopstate = onpopstate;
                  }, 1);
                }, false);
                // cancel trigger events on attributes in object the window
                triggerEventsInWindowAttributes = 0;
              }
            }
          }
          // set old value to new variable
          object[prop] = originalValue;

        } else {
          // the last stage of trying to override the property
          try {
            try {
              // wrap the object in a new empty object
              var temp = Object.create(object);
              defineProperty(Object.getPrototypeOf(temp) === object ? temp : object, prop, descriptor);
              for(var key in object) {
                // need to bind a function to the original object
                if (typeof object[key] === 'function') {
                  temp[key] = object[key].bind(object);
                }
              }
              try {
                // to run a function that will inform about what the object was to wrapped
                onWrapped.call(temp, temp, object);
              } catch(_e_) {
              }
              object = temp;
            } catch(_e_) {
              // sometimes works override simply by assigning the prototype property of the constructor
              defineProperty(object.constructor.prototype, prop, descriptor);
            }
          } catch(_e_) {
            // all methods have failed
            return false;
          }
        }
      }
    }

    return object;
  }

  /**
   * Adds the missing property in descriptor
   *
   * @param {Object} object An object that stores values
   * @param {String} prop Name of the property in the object
   * @param {Object|null} descriptor Descriptor
   * @return {Object} Returns the generated descriptor
   */
  function prepareDescriptorsForObject(object, prop, descriptor) {
    descriptor = descriptor || {};
    // the default for the object 'location' is the standard object 'window.location'
    object = object === locationDescriptors ? windowLocation : object;
    // setter for object properties
    descriptor.set = (descriptor.set || function(value) {
      object[prop] = value;
    });
    // getter for object properties
    descriptor.get = (descriptor.get || function() {
      return object[prop];
    });
    return descriptor;
  }

  /**
   * Wrapper for the methods 'addEventListener/attachEvent' in the context of the 'window'
   *
   * @param {String} event The event type for which the user is registering
   * @param {Function} listener The method to be called when the event occurs.
   * @param {Boolean} capture If true, capture indicates that the user wishes to initiate capture.
   * @return void
   */
  function addEventListener(event, listener, capture) {
    if (event in eventsList) {
      // here stored the event listeners 'popstate/hashchange'
      eventsList[event].push(listener);
    } else {
      // FireFox support non-standart four argument aWantsUntrusted
      // https://github.com/devote/HTML5-History-API/issues/13
      if (arguments.length > 3) {
        addEvent(event, listener, capture, arguments[3]);
      } else {
        addEvent(event, listener, capture);
      }
    }
  }

  /**
   * Wrapper for the methods 'removeEventListener/detachEvent' in the context of the 'window'
   *
   * @param {String} event The event type for which the user is registered
   * @param {Function} listener The parameter indicates the Listener to be removed.
   * @param {Boolean} capture Was registered as a capturing listener or not.
   * @return void
   */
  function removeEventListener(event, listener, capture) {
    var list = eventsList[event];
    if (list) {
      for(var i = list.length; i--;) {
        if (list[i] === listener) {
          list.splice(i, 1);
          break;
        }
      }
    } else {
      removeEvent(event, listener, capture);
    }
  }

  /**
   * Wrapper for the methods 'dispatchEvent/fireEvent' in the context of the 'window'
   *
   * @param {Event|String} event Instance of Event or event type string if 'eventObject' used
   * @param {*} [eventObject] For Internet Explorer 8 required event object on this argument
   * @return {Boolean} If 'preventDefault' was called the value is false, else the value is true.
   */
  function dispatchEvent(event, eventObject) {
    var eventType = ('' + (typeof event === "string" ? event : event.type)).replace(/^on/, '');
    var list = eventsList[eventType];
    if (list) {
      // need to understand that there is one object of Event
      eventObject = typeof event === "string" ? eventObject : event;
      if (eventObject.target == null) {
        // need to override some of the properties of the Event object
        for(var props = ['target', 'currentTarget', 'srcElement', 'type']; event = props.pop();) {
          // use 'redefineProperty' to override the properties
          eventObject = redefineProperty(eventObject, event, {
            get: event === 'type' ? function() {
              return eventType;
            } : function() {
              return global;
            }
          });
        }
      }
      if (triggerEventsInWindowAttributes) {
        // run function defined in the attributes 'onpopstate/onhashchange' in the 'window' context
        ((eventType === 'popstate' ? global.onpopstate : global.onhashchange)
          || emptyFunction).call(global, eventObject);
      }
      // run other functions that are in the list of handlers
      for(var i = 0, len = list.length; i < len; i++) {
        list[i].call(global, eventObject);
      }
      return true;
    } else {
      return dispatch(event, eventObject);
    }
  }

  /**
   * dispatch current state event
   */
  function firePopState() {
    var o = document.createEvent ? document.createEvent('Event') : document.createEventObject();
    if (o.initEvent) {
      o.initEvent('popstate', false, false);
    } else {
      o.type = 'popstate';
    }
    o.state = historyObject.state;
    // send a newly created events to be processed
    dispatchEvent(o);
  }

  /**
   * fire initial state for non-HTML5 browsers
   */
  function fireInitialState() {
    if (isFireInitialState) {
      isFireInitialState = false;
      firePopState();
    }
  }

  /**
   * Change the data of the current history for HTML4 browsers
   *
   * @param {Object} state
   * @param {string} [url]
   * @param {Boolean} [replace]
   * @param {string} [lastURLValue]
   * @return void
   */
  function changeState(state, url, replace, lastURLValue) {
    if (!isSupportHistoryAPI) {
      // if not used implementation history.location
      if (isUsedHistoryLocationFlag === 0) isUsedHistoryLocationFlag = 2;
      // normalization url
      var urlObject = parseURL(url, isUsedHistoryLocationFlag === 2 && ('' + url).indexOf("#") !== -1);
      // if current url not equal new url
      if (urlObject._relative !== parseURL()._relative) {
        // if empty lastURLValue to skip hash change event
        lastURL = lastURLValue;
        if (replace) {
          // only replace hash, not store to history
          windowLocation.replace("#" + urlObject._special);
        } else {
          // change hash and add new record to history
          windowLocation.hash = urlObject._special;
        }
      }
    } else {
      lastURL = windowLocation.href;
    }
    if (!isSupportStateObjectInHistory && state) {
      stateStorage[windowLocation.href] = state;
    }
    isFireInitialState = false;
  }

  /**
   * Event handler function changes the hash in the address bar
   *
   * @param {Event} event
   * @return void
   */
  function onHashChange(event) {
    // https://github.com/devote/HTML5-History-API/issues/46
    var fireNow = lastURL;
    // new value to lastURL
    lastURL = windowLocation.href;
    // if not empty fireNow, otherwise skipped the current handler event
    if (fireNow) {
      // if checkUrlForPopState equal current url, this means that the event was raised popstate browser
      if (checkUrlForPopState !== windowLocation.href) {
        // otherwise,
        // the browser does not support popstate event or just does not run the event by changing the hash.
        firePopState();
      }
      // current event object
      event = event || global.event;

      var oldURLObject = parseURL(fireNow, true);
      var newURLObject = parseURL();
      // HTML4 browser not support properties oldURL/newURL
      if (!event.oldURL) {
        event.oldURL = oldURLObject._href;
        event.newURL = newURLObject._href;
      }
      if (oldURLObject._hash !== newURLObject._hash) {
        // if current hash not equal previous hash
        dispatchEvent(event);
      }
    }
  }

  /**
   * The event handler is fully loaded document
   *
   * @param {*} [noScroll]
   * @return void
   */
  function onLoad(noScroll) {
    // Get rid of the events popstate when the first loading a document in the webkit browsers
    setTimeout(function() {
      // hang up the event handler for the built-in popstate event in the browser
      addEvent('popstate', function(e) {
        // set the current url, that suppress the creation of the popstate event by changing the hash
        checkUrlForPopState = windowLocation.href;
        // for Safari browser in OS Windows not implemented 'state' object in 'History' interface
        // and not implemented in old HTML4 browsers
        if (!isSupportStateObjectInHistory) {
          e = redefineProperty(e, 'state', {get: function() {
            return historyObject.state;
          }});
        }
        // send events to be processed
        dispatchEvent(e);
      }, false);
    }, 0);
    // for non-HTML5 browsers
    if (!isSupportHistoryAPI && noScroll !== true && "location" in historyObject) {
      // scroll window to anchor element
      scrollToAnchorId(locationObject.hash);
      // fire initial state for non-HTML5 browser after load page
      fireInitialState();
    }
  }

  /**
   * Finds the closest ancestor anchor element (including the target itself).
   *
   * @param {HTMLElement} target The element to start scanning from.
   * @return {HTMLElement} An element which is the closest ancestor anchor.
   */
  function anchorTarget(target) {
    while (target) {
      if (target.nodeName === 'A') return target;
      target = target.parentNode;
    }
  }

  /**
   * Handles anchor elements with a hash fragment for non-HTML5 browsers
   *
   * @param {Event} e
   */
  function onAnchorClick(e) {
    var event = e || global.event;
    var target = anchorTarget(event.target || event.srcElement);
    var defaultPrevented = "defaultPrevented" in event ? event['defaultPrevented'] : event.returnValue === false;
    if (target && target.nodeName === "A" && !defaultPrevented) {
      var current = parseURL();
      var expect = parseURL(target.getAttribute("href", 2));
      var isEqualBaseURL = current._href.split('#').shift() === expect._href.split('#').shift();
      if (isEqualBaseURL && expect._hash) {
        if (current._hash !== expect._hash) {
          locationObject.hash = expect._hash;
        }
        scrollToAnchorId(expect._hash);
        if (event.preventDefault) {
          event.preventDefault();
        } else {
          event.returnValue = false;
        }
      }
    }
  }

  /**
   * Scroll page to current anchor in url-hash
   *
   * @param hash
   */
  function scrollToAnchorId(hash) {
    var target = document.getElementById(hash = (hash || '').replace(/^#/, ''));
    if (target && target.id === hash && target.nodeName === "A") {
      var rect = target.getBoundingClientRect();
      global.scrollTo((documentElement.scrollLeft || 0), rect.top + (documentElement.scrollTop || 0)
        - (documentElement.clientTop || 0));
    }
  }

  /**
   * Library initialization
   *
   * @return {Boolean} return true if all is well, otherwise return false value
   */
  function initialize() {
    /**
     * Get custom settings from the query string
     */
    var scripts = document.getElementsByTagName('script');
    var src = (scripts[scripts.length - 1] || {}).src || '';
    var arg = src.indexOf('?') !== -1 ? src.split('?').pop() : '';
    arg.replace(/(\w+)(?:=([^&]*))?/g, function(a, key, value) {
      settings[key] = (value || '').replace(/^(0|false)$/, '');
    });

    /**
     * hang up the event handler to listen to the events hashchange
     */
    addEvent(eventNamePrefix + 'hashchange', onHashChange, false);

    // a list of objects with pairs of descriptors/object
    var data = [locationDescriptors, locationObject, eventsDescriptors, global, historyDescriptors, historyObject];

    // if browser support object 'state' in interface 'History'
    if (isSupportStateObjectInHistory) {
      // remove state property from descriptor
      delete historyDescriptors['state'];
    }

    // initializing descriptors
    for(var i = 0; i < data.length; i += 2) {
      for(var prop in data[i]) {
        if (data[i].hasOwnProperty(prop)) {
          if (typeof data[i][prop] !== 'object') {
            // If the descriptor is a simple function, simply just assign it an object
            data[i + 1][prop] = data[i][prop];
          } else {
            // prepare the descriptor the required format
            var descriptor = prepareDescriptorsForObject(data[i], prop, data[i][prop]);
            // try to set the descriptor object
            if (!redefineProperty(data[i + 1], prop, descriptor, function(n, o) {
              // is satisfied if the failed override property
              if (o === historyObject) {
                // the problem occurs in Safari on the Mac
                global.history = historyObject = data[i + 1] = n;
              }
            })) {
              // if there is no possibility override.
              // This browser does not support descriptors, such as IE7

              // remove previously hung event handlers
              removeEvent(eventNamePrefix + 'hashchange', onHashChange, false);

              // fail to initialize :(
              return false;
            }

            // create a repository for custom handlers onpopstate/onhashchange
            if (data[i + 1] === global) {
              eventsList[prop] = eventsList[prop.substr(2)] = [];
            }
          }
        }
      }
    }

    // check settings
    historyObject['setup']();

    // redirect if necessary
    if (settings['redirect']) {
      historyObject['redirect']();
    }

    // initialize
    if (settings["init"]) {
      // You agree that you will use window.history.location instead window.location
      isUsedHistoryLocationFlag = 1;
    }

    // If browser does not support object 'state' in interface 'History'
    if (!isSupportStateObjectInHistory && JSON) {
      storageInitialize();
    }

    // track clicks on anchors
    if (!isSupportHistoryAPI) {
      document[addEventListenerName](eventNamePrefix + "click", onAnchorClick, false);
    }

    if (document.readyState === 'complete') {
      onLoad(true);
    } else {
      if (!isSupportHistoryAPI && parseURL()._relative !== settings["basepath"]) {
        isFireInitialState = true;
      }
      /**
       * Need to avoid triggering events popstate the initial page load.
       * Hang handler popstate as will be fully loaded document that
       * would prevent triggering event onpopstate
       */
      addEvent(eventNamePrefix + 'load', onLoad, false);
    }

    // everything went well
    return true;
  }

  /**
   * Starting the library
   */
  if (!initialize()) {
    // if unable to initialize descriptors
    // therefore quite old browser and there
    // is no sense to continue to perform
    return;
  }

  /**
   * If the property history.emulate will be true,
   * this will be talking about what's going on
   * emulation capabilities HTML5-History-API.
   * Otherwise there is no emulation, ie the
   * built-in browser capabilities.
   *
   * @type {boolean}
   * @const
   */
  historyObject['emulate'] = !isSupportHistoryAPI;

  /**
   * Replace the original methods on the wrapper
   */
  global[addEventListenerName] = addEventListener;
  global[removeEventListenerName] = removeEventListener;
  global[dispatchEventName] = dispatchEvent;

  return historyObject;
});

/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 * http://spin.js.org/
 *
 * Example:
    var opts = {
      lines: 12             // The number of lines to draw
    , length: 7             // The length of each line
    , width: 5              // The line thickness
    , radius: 10            // The radius of the inner circle
    , scale: 1.0            // Scales overall size of the spinner
    , corners: 1            // Roundness (0..1)
    , color: '#000'         // #rgb or #rrggbb
    , opacity: 1/4          // Opacity of the lines
    , rotate: 0             // Rotation offset
    , direction: 1          // 1: clockwise, -1: counterclockwise
    , speed: 1              // Rounds per second
    , trail: 100            // Afterglow percentage
    , fps: 20               // Frames per second when using setTimeout()
    , zIndex: 2e9           // Use a high z-index by default
    , className: 'spinner'  // CSS class to assign to the element
    , top: '50%'            // center vertically
    , left: '50%'           // center horizontally
    , shadow: false         // Whether to render a shadow
    , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
    , position: 'absolute'  // Element positioning
    }
    var target = document.getElementById('foo')
    var spinner = new Spinner(opts).spin(target)
 */
;(function (root, factory) {

  /* CommonJS */
  if (typeof module == 'object' && module.exports) module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory)

  /* Browser global */
  else root.Spinner = factory()
}(this, function () {
  "use strict"

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */
    , useCssAnimations /* Whether to use CSS animations or setTimeout */
    , sheet /* A stylesheet to hold the @keyframe or VML rules. */

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl (tag, prop) {
    var el = document.createElement(tag || 'div')
      , n

    for (n in prop) el[n] = prop[n]
    return el
  }

  /**
   * Appends children and returns the parent.
   */
  function ins (parent /* child1, child2, ...*/) {
    for (var i = 1, n = arguments.length; i < n; i++) {
      parent.appendChild(arguments[i])
    }

    return parent
  }

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation (alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-')
      , start = 0.01 + i/lines * 100
      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
      , pre = prefix && '-' + prefix + '-' || ''

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:' + z + '}' +
        start + '%{opacity:' + alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
        '100%{opacity:' + z + '}' +
        '}', sheet.cssRules.length)

      animations[name] = 1
    }

    return name
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   */
  function vendor (el, prop) {
    var s = el.style
      , pp
      , i

    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
    if (s[prop] !== undefined) return prop
    for (i = 0; i < prefixes.length; i++) {
      pp = prefixes[i]+prop
      if (s[pp] !== undefined) return pp
    }
  }

  /**
   * Sets multiple style properties at once.
   */
  function css (el, prop) {
    for (var n in prop) {
      el.style[vendor(el, n) || n] = prop[n]
    }

    return el
  }

  /**
   * Fills in default values.
   */
  function merge (obj) {
    for (var i = 1; i < arguments.length; i++) {
      var def = arguments[i]
      for (var n in def) {
        if (obj[n] === undefined) obj[n] = def[n]
      }
    }
    return obj
  }

  /**
   * Returns the line color from the given string or array.
   */
  function getColor (color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length]
  }

  // Built-in defaults

  var defaults = {
    lines: 12             // The number of lines to draw
  , length: 7             // The length of each line
  , width: 5              // The line thickness
  , radius: 10            // The radius of the inner circle
  , scale: 1.0            // Scales overall size of the spinner
  , corners: 1            // Roundness (0..1)
  , color: '#000'         // #rgb or #rrggbb
  , opacity: 1/4          // Opacity of the lines
  , rotate: 0             // Rotation offset
  , direction: 1          // 1: clockwise, -1: counterclockwise
  , speed: 1              // Rounds per second
  , trail: 100            // Afterglow percentage
  , fps: 20               // Frames per second when using setTimeout()
  , zIndex: 2e9           // Use a high z-index by default
  , className: 'spinner'  // CSS class to assign to the element
  , top: '50%'            // center vertically
  , left: '50%'           // center horizontally
  , shadow: false         // Whether to render a shadow
  , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
  , position: 'absolute'  // Element positioning
  }

  /** The constructor */
  function Spinner (o) {
    this.opts = merge(o || {}, Spinner.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  merge(Spinner.prototype, {
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
    spin: function (target) {
      this.stop()

      var self = this
        , o = self.opts
        , el = self.el = createEl(null, {className: o.className})

      css(el, {
        position: o.position
      , width: 0
      , zIndex: o.zIndex
      , left: o.left
      , top: o.top
      })

      if (target) {
        target.insertBefore(el, target.firstChild || null)
      }

      el.setAttribute('role', 'progressbar')
      self.lines(el, self.opts)

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps / o.speed
          , ostep = (1 - o.opacity) / (f * o.trail / 100)
          , astep = f / o.lines

        ;(function anim () {
          i++
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

            self.opacity(el, j * o.direction + start, alpha, o)
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000 / fps))
        })()
      }
      return self
    }

    /**
     * Stops and removes the Spinner.
     */
  , stop: function () {
      var el = this.el
      if (el) {
        clearTimeout(this.timeout)
        if (el.parentNode) el.parentNode.removeChild(el)
        this.el = undefined
      }
      return this
    }

    /**
     * Internal method that draws the individual lines. Will be overwritten
     * in VML fallback mode below.
     */
  , lines: function (el, o) {
      var i = 0
        , start = (o.lines - 1) * (1 - o.direction) / 2
        , seg

      function fill (color, shadow) {
        return css(createEl(), {
          position: 'absolute'
        , width: o.scale * (o.length + o.width) + 'px'
        , height: o.scale * o.width + 'px'
        , background: color
        , boxShadow: shadow
        , transformOrigin: 'left'
        , transform: 'rotate(' + ~~(360/o.lines*i + o.rotate) + 'deg) translate(' + o.scale*o.radius + 'px' + ',0)'
        , borderRadius: (o.corners * o.scale * o.width >> 1) + 'px'
        })
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute'
        , top: 1 + ~(o.scale * o.width / 2) + 'px'
        , transform: o.hwaccel ? 'translate3d(0,0,0)' : ''
        , opacity: o.opacity
        , animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
        })

        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px #000'), {top: '2px'}))
        ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
      }
      return el
    }

    /**
     * Internal method that adjusts the opacity of a single line.
     * Will be overwritten in VML fallback mode below.
     */
  , opacity: function (el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
    }

  })


  function initVML () {

    /* Utility function to create a VML tag */
    function vml (tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
    }

    // No CSS transforms but VML support, add a CSS rule for VML elements:
    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

    Spinner.prototype.lines = function (el, o) {
      var r = o.scale * (o.length + o.width)
        , s = o.scale * 2 * r

      function grp () {
        return css(
          vml('group', {
            coordsize: s + ' ' + s
          , coordorigin: -r + ' ' + -r
          })
        , { width: s, height: s }
        )
      }

      var margin = -(o.width + o.length) * o.scale * 2 + 'px'
        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
        , i

      function seg (i, dx, filter) {
        ins(
          g
        , ins(
            css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx})
          , ins(
              css(
                vml('roundrect', {arcsize: o.corners})
              , { width: r
                , height: o.scale * o.width
                , left: o.scale * o.radius
                , top: -o.scale * o.width >> 1
                , filter: filter
                }
              )
            , vml('fill', {color: getColor(o.color, i), opacity: o.opacity})
            , vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
            )
          )
        )
      }

      if (o.shadow)
        for (i = 1; i <= o.lines; i++) {
          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')
        }

      for (i = 1; i <= o.lines; i++) seg(i)
      return ins(el, g)
    }

    Spinner.prototype.opacity = function (el, i, val, o) {
      var c = el.firstChild
      o = o.shadow && o.lines || 0
      if (c && i + o < c.childNodes.length) {
        c = c.childNodes[i + o]; c = c && c.firstChild; c = c && c.firstChild
        if (c) c.opacity = val
      }
    }
  }

  if (typeof document !== 'undefined') {
    sheet = (function () {
      var el = createEl('style', {type : 'text/css'})
      ins(document.getElementsByTagName('head')[0], el)
      return el.sheet || el.styleSheet
    }())

    var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

    if (!vendor(probe, 'transform') && probe.adj) initVML()
    else useCssAnimations = vendor(probe, 'animation')
  }

  return Spinner

}));

/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 * http://spin.js.org/
 */

/*

Basic Usage:
============

$('#el').spin() // Creates a default Spinner using the text color of #el.
$('#el').spin({ ... }) // Creates a Spinner using the provided options.

$('#el').spin(false) // Stops and removes the spinner.

Using Presets:
==============

$('#el').spin('small') // Creates a 'small' Spinner using the text color of #el.
$('#el').spin('large', '#fff') // Creates a 'large' white Spinner.

Adding a custom preset:
=======================

$.fn.spin.presets.flower = {
  lines:   9
, length: 10
, width:  20
, radius:  0
}

$('#el').spin('flower', 'red')

*/

;(function(factory) {

  if (typeof exports == 'object') {
    // CommonJS
    factory(require('jquery'), require('spin.js'))
  } else if (typeof define == 'function' && define.amd) {
    // AMD, register as anonymous module
    define(['jquery', 'spin'], factory)
  } else {
    // Browser globals
    if (!window.Spinner) throw new Error('Spin.js not present')
    factory(window.jQuery, window.Spinner)
  }

}(function($, Spinner) {

  $.fn.spin = function(opts, color) {

    return this.each(function() {
      var $this = $(this)
        , data = $this.data()

      if (data.spinner) {
        data.spinner.stop()
        delete data.spinner
      }
      if (opts !== false) {
        opts = $.extend(
          { color: color || $this.css('color') }
        , $.fn.spin.presets[opts] || opts
        )
        data.spinner = new Spinner(opts).spin(this)
      }
    })
  }

  $.fn.spin.presets = {
    tiny:  { lines:  8, length: 2, width: 2, radius: 3 }
  , small: { lines:  8, length: 4, width: 3, radius: 5 }
  , large: { lines: 10, length: 8, width: 4, radius: 8 }
  }

}));

// ==== WP AJAX PAGE LOADER 0.3.0 ==== //

// WP AJAX Page Loader documentation: https://github.com/synapticism/wp-ajax-page-loader
// Global namespace object; inspiration for the design of this via Ryan Florence: http://ryanflorence.com/authoring-jquery-plugins-with-object-oriented-javascript/
var PG8 = {};

(function($, document, window, undefined){
  'use strict';

  // Exit early if WordPress script variables aren't available
  if (typeof PG8Data === 'undefined') {
    return;
  }

  // Initialize HTML5-History-API polyfill with this single line
  var location = window.history.location || window.location;

  // Constructor function
  var PageLoader = this.PageLoader = function(opts){
    this.thisLink = location.href;
    this.nextLink = PG8Data.nextLink;
    this.thisPage = parseInt(PG8Data.startPage, 10);
    this.nextPage = this.thisPage + 1;
    this.maxPages = parseInt(PG8Data.maxPages, 10);
    this.maxedOut = 0; // A flag to determine whether all pages have been loaded
    this.opts     = $.extend({}, $.fn.ajaxPageLoader.defaults, opts);
    this.content  = $(this.opts.content);

    // Initialize page loader only if there are pages to load
    if (this.nextPage <= this.maxPages) {
      this.init();
    }
  };



  // Prototype functionality
  PageLoader.prototype = {
    init: function(){

      // Wrap all the children of the main element in a way that is consistent with how content is loaded
      this.content.children().wrapAll('<div id="content-page-'+parseInt(this.thisPage, 10)+'" class="clear" data-href="'+encodeURI(this.thisLink)+'"></div>');

      // Create the first (place)holder div that content will be loaded into
      this.holder();

      // Bind event handlers
      this.handler();

      // Initialize spinner
      this.spinner();
    },



    // Create a placeholder; abstracted into a function for DRYness
    holder: function(){
      this.content.append('<div id="content-page-'+parseInt(this.nextPage, 10)+'" class="clear" data-href="'+encodeURI(this.nextLink)+'"></div>');
    },



    // Event handlers
    handler: function(){
      var
        self    = this,
        $window = $(window);

      // Bind to click events on the body element to ensure compatibility with other forms of DOM manipulation we may be doing
      $('body').on('click', self.opts.next, function(event){

        // Are there more posts to load? This has to be checked again as nextPage increments
        if (self.nextPage <= self.maxPages) {

          // Cancel page request
          event.preventDefault();

          // Invoke spinner
          $(this).parents('nav:first').before($('#spinner').show());

          // Load content
          self.loader(self.nextPage, self.nextLink);
        }
      }); // end .on('click')



      // Watch scroll position and change URL accordingly
      $window.on('scroll', this.content, function(event){

        // Clear previously set timer
        clearTimeout($.data(this, 'pushTimer'));
        clearTimeout($.data(this, 'infinTimer'));

        // Manage push state based on scroll position; keeps the URL updated wherever the window position is
        $.data(this, 'pushTimer', setTimeout(function(){

          // Setup some useful variables including info about the top-most page
          var
            firstPage = self.content.children(':first'),
            firstTop  = firstPage.offset().top,
            firstLink = firstPage.data('href'),
            winTop    = $window.scrollTop();

          // Push state if the top of the window is above the first page
          if ( winTop <= firstTop ) {
            self.pusher(firstLink);
          } else {

            // Monitor the children of the main content selector; should be a bunch of divs representing each page of content
            self.content.children().each(function(){
              var
                $this   = $(this),
                top     = $this.offset().top - self.opts.scrollOffset,
                bottom  = $this.outerHeight()+top;

              // Push state if the top of the window falls into the range of a given page
              if ( top <= winTop && winTop < bottom ) {
                self.pusher($this.data('href'));
              }
            }); // end each()
          } // end if
        }, self.opts.pushDelay)); // end $.data()

        // Infinite scroll, a lazy (yet smart) implementation
        if ( self.maxedOut === 0 && self.opts.infinScroll === true ) { // Only bother with this if there are more pages to load AND infinite scroll is on
          $.data(this, 'infinTimer', setTimeout(function() {
            var
              $document       = $(document),
              scrollHeight    = $document.height(),
              scrollPosition  = $window.height() + $window.scrollTop(), // Position of the bottom of the window
              scrollLastPage  = self.content.children(':last').offset().top, // Bottom of the content area
              scrollDiff      = scrollHeight - scrollPosition; // How close to the absolute bottom of the document

            // Trigger a click when the bottom of the window is just below the contents of the last page
            // But not the absolute bottom; we'd like to be able to reach the footer if we can!
            if ( scrollPosition > scrollLastPage + self.opts.scrollOffset && scrollPosition <= scrollLastPage + self.opts.scrollOffset + self.opts.infinOffset && scrollDiff >= self.opts.infinFooter ) {
              $(self.opts.next).trigger('click');
            }
          }, self.opts.infinDelay)); // end $.data()
        } // end infinite scroll
      }); // end $window.on('scroll')
    }, // end handler()



    // Conditionally initialize spinner div; degrades gracefully if spin.js not found
    spinner: function(){
      if ( $.isFunction(window.Spinner) ) {
        this.content.after('<div id="spinner" style="position: relative;"></div>');
        $('#spinner').spin(this.opts.spinOpts).hide();
      }
    },



    pusher: function(url){
      if (typeof url !== 'undefined' && url !== location.href) {
        history.pushState(null,null,url);
      }
    },



    // Page loader
    loader: function(page, link){
      var self = this;

      // Load content into the appropriate container
      $('#content-page-'+page).load(link+' '+self.opts.content+' > *', function(){

        // Cache the next selector
        var $navLink = $(self.opts.next);

        // Update page number and nextLink
        self.thisPage = page;
        self.thisLink = link;
        self.nextPage = page + 1;
        self.nextLink = link.replace(/\/page\/[0-9]*/, '/page/'+self.nextPage);

        // Change the URL
        self.pusher(self.thisLink);

        // Create another placeholder
        self.holder();

        // Navigation link handling: 1) have we reached the last page? 2) if not, update the link
        if (self.nextPage > self.maxPages) {
          $navLink.remove(); // No more content can be loaded; hide the next button or link
          self.maxedOut = 1; // Set a flag to avoid further processing
        } else {
          if ( $navLink.is('[href]') ) {
            $navLink.attr('href', self.nextLink); // Next selector has href; update it for right-clicking etc.
          } else {
            $('[href]', $navLink).attr('href', self.nextLink); // Next selector contains href
          }
        }

        // Hide spinner
        $('#spinner').hide();

        // Hide previous link (if one exists)
        $(self.opts.prev).hide();

        // Emit loaded event
        self.loaded();

        // Scroll to the appropriate location
        self.scroll();

        // Update analytics with relative URL on load (not on scroll)
        self.analytics('/'+location.href.replace(self.root(), ''));
      });
    }, // end loader()



    // Emit the DOMContentLoaded event (for compatibility with Prism.js and other scripts)
    loaded: function(){
      var loaded = document.createEvent("Event");
      loaded.initEvent("DOMContentLoaded", true, true);
      window.document.dispatchEvent(loaded);
    },



    // Scroll to the top of the new content container
    scroll: function(){
      var top = $('#content-page-'+this.thisPage).children(':first').offset().top - this.opts.scrollOffset;
      $('body, html').animate({ scrollTop: top }, this.opts.scrollDelay, "swing");
    },



    // Update Google Analytics on content load, not on scroll
    analytics: function(url){
      // Inform Google Analytics of the change; compatible with the new Universal Analytics script
      if ( typeof window.ga !== 'undefined' ) {
        window.ga('send', 'pageview', url);
      } else if ( typeof window._gaq !== 'undefined' ) {
        window._gaq.push(['_trackPageview', url]); // Legacy analytics; ref: https://github.com/browserstate/ajaxify/pull/25
      }
    },



    // Utility function to get the root URL with trailing slash e.g. http(s)://yourdomain.com/
    root: function(){
      var
        port = document.location.port ? ':' + document.location.port : '',
        url = document.location.protocol + '//' + (document.location.hostname || document.location.host) + port + '/';
      return url;
    }
  };



  $.fn.ajaxPageLoader = function (opts){
    return this.each(function(){
      if (!$.data(this, 'ajaxPageLoader')) {
        $.data(this, 'ajaxPageLoader', new PageLoader(opts));
      }
    });
  };



  // Extensible default settings
  $.fn.ajaxPageLoader.defaults = {
    content:      'main',       // The content selector; this varies from theme to theme
    next:         '.next-page', // Selector for the "next" navigation link; this is also theme-dependent
    prev:         '.prev-page', // Selector for the "next" navigation link; this is also theme-dependent
    scrollDelay:  300,          // Smooth scrolling delay; use a larger value for a smoother scroll (s)
    scrollOffset: 30,           // Scroll offset from the top of the new page to account for margins (px)
    pushDelay:    250,          // How long to wait before attempting to update history state (s)
    infinScroll:  true,         // Switch for infinite scrolling functionality (true/false)
    infinDelay:   600,          // How long to wait before requesting new content automatically (s)
    infinOffset:  300,          // Height of the area below the last page in which infinite scrolling will be triggered (px)
    infinFooter:  1,            // Height from the bottom of the page from which infinite scrolling *won't* be triggered (px)
    spinOpts: {                // spin.js options; reference: https://fgnass.github.io/spin.js/
      lines:  25,
      length: 0,
      width:  4,
      radius: 25,
      speed:  1.5,
      trail:  40,
      top:    '15px'
    }
  };
}).apply(PG8, [jQuery, document, window]);

// ==== WP AJAX PAGE LOADER ==== //

// Invoke the AJAX page loader; this is in its own file as the script is conditionally loaded by the theme
// ;(function($){
//   $(function(){
//     $(document.body).ajaxPageLoader();
//
//     // If jQuery.timeago exists also update timestamps on AJAX page load; if you remove the timeago script this can be deleted
//     if ($.timeago) {
//       document.addEventListener("DOMContentLoaded", function (event) {
//         $('time').timeago();
//       });
//     }
//   });
// }(jQuery));

/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.6.1
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2017, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowPast: true,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      autoDispose: true,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        inPast: 'any moment now',
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },

    inWords: function(distanceMillis) {
      if (!this.settings.allowPast && ! this.settings.allowFuture) {
          throw 'timeago allowPast and allowFuture settings can not both be set to false.';
      }

      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      if (!this.settings.allowPast && distanceMillis >= 0) {
        return this.settings.strings.inPast;
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) { separator = " "; }
      return $.trim([prefix, words, suffix].join(separator));
    },

    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      s = s.replace(/([\+\-]\d\d)$/," $100"); // +09 -> +0900
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function() {
      functions.dispose.call(this);
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function(timestamp) {
      var date = (timestamp instanceof Date) ? timestamp : $t.parse(timestamp);
      $(this).data('timeago', { datetime: date });
      if ($t.settings.localeTitle) {
        $(this).attr("title", date.toLocaleString());
      }
      refresh.apply(this);
    },
    updateFromDOM: function() {
      $(this).data('timeago', { datetime: $t.parse( $t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title") ) });
      refresh.apply(this);
    },
    dispose: function () {
      if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
      }
    }
  };

  $.fn.timeago = function(action, options) {
    var fn = action ? functions[action] : functions.init;
    if (!fn) {
      throw new Error("Unknown function name '"+ action +"' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function() {
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    var $s = $t.settings;

    //check if it's still visible
    if ($s.autoDispose && !$.contains(document.documentElement,this)) {
      //stop if it has been removed
      $(this).timeago("dispose");
      return this;
    }

    var data = prepareData(this);

    if (!isNaN(data.datetime)) {
      if ( $s.cutoff === 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      } else {
        if ($(this).attr('title').length > 0) {
            $(this).text($(this).attr('title'));
        }
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr("title", element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}));

// Sticky Plugin v1.0.4 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var slice = Array.prototype.slice; // save ref to original slice()
    var splice = Array.prototype.splice; // save ref to original slice()

  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: '',
      widthFromWrapper: true, // works only when .getWidthFrom is empty
      responsiveWidth: false,
      zIndex: 'auto'
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

      for (var i = 0, l = sticked.length; i < l; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra;

        //update height in case of dynamic content
        s.stickyWrapper.css('height', s.stickyElement.outerHeight());

        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement
              .css({
                'width': '',
                'position': '',
                'top': '',
                'z-index': ''
              });
            s.stickyElement.parent().removeClass(s.className);
            s.stickyElement.trigger('sticky-end', [s]);
            s.currentTop = null;
          }
        }
        else {
          var newTop = documentHeight - s.stickyElement.outerHeight()
            - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (s.currentTop !== newTop) {
            var newWidth;
            if (s.getWidthFrom) {
                newWidth = $(s.getWidthFrom).width() || null;
            } else if (s.widthFromWrapper) {
                newWidth = s.stickyWrapper.width();
            }
            if (newWidth == null) {
                newWidth = s.stickyElement.width();
            }
            s.stickyElement
              .css('width', newWidth)
              .css('position', 'fixed')
              .css('top', newTop)
              .css('z-index', s.zIndex);

            s.stickyElement.parent().addClass(s.className);

            if (s.currentTop === null) {
              s.stickyElement.trigger('sticky-start', [s]);
            } else {
              // sticky is started but it have to be repositioned
              s.stickyElement.trigger('sticky-update', [s]);
            }

            if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) {
              // just reached bottom || just started to stick but bottom is already reached
              s.stickyElement.trigger('sticky-bottom-reached', [s]);
            } else if(s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {
              // sticky is started && sticked at topSpacing && overflowing from top just finished
              s.stickyElement.trigger('sticky-bottom-unreached', [s]);
            }

            s.currentTop = newTop;
          }

          // Check if sticky has reached end of container and stop sticking
          var stickyWrapperContainer = s.stickyWrapper.parent();
          var unstick = (s.stickyElement.offset().top + s.stickyElement.outerHeight() >= stickyWrapperContainer.offset().top + stickyWrapperContainer.outerHeight()) && (s.stickyElement.offset().top <= s.topSpacing);

          if( unstick ) {
            s.stickyElement
              .css('position', 'absolute')
              .css('top', '')
              .css('bottom', 0)
              .css('z-index', '');
          } else {
            s.stickyElement
              .css('position', 'fixed')
              .css('top', newTop)
              .css('bottom', '')
              .css('z-index', s.zIndex);
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height();

      for (var i = 0, l = sticked.length; i < l; i++) {
        var s = sticked[i];
        var newWidth = null;
        if (s.getWidthFrom) {
            if (s.responsiveWidth) {
                newWidth = $(s.getWidthFrom).width();
            }
        } else if(s.widthFromWrapper) {
            newWidth = s.stickyWrapper.width();
        }
        if (newWidth != null) {
            s.stickyElement.css('width', newWidth);
        }
      }
    },
    methods = {
      init: function(options) {
        var o = $.extend({}, defaults, options);
        return this.each(function() {
          var stickyElement = $(this);

          var stickyId = stickyElement.attr('id');
          var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName;
          var wrapper = $('<div></div>')
            .attr('id', wrapperId)
            .addClass(o.wrapperClassName);

          stickyElement.wrapAll(wrapper);

          var stickyWrapper = stickyElement.parent();

          if (o.center) {
            stickyWrapper.css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
          }

          if (stickyElement.css("float") === "right") {
            stickyElement.css({"float":"none"}).parent().css({"float":"right"});
          }

          o.stickyElement = stickyElement;
          o.stickyWrapper = stickyWrapper;
          o.currentTop    = null;

          sticked.push(o);

          methods.setWrapperHeight(this);
          methods.setupChangeListeners(this);
        });
      },

      setWrapperHeight: function(stickyElement) {
        var element = $(stickyElement);
        var stickyWrapper = element.parent();
        if (stickyWrapper) {
          stickyWrapper.css('height', element.outerHeight());
        }
      },

      setupChangeListeners: function(stickyElement) {
        if (window.MutationObserver) {
          var mutationObserver = new window.MutationObserver(function(mutations) {
            if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
              methods.setWrapperHeight(stickyElement);
            }
          });
          mutationObserver.observe(stickyElement, {subtree: true, childList: true});
        } else {
          stickyElement.addEventListener('DOMNodeInserted', function() {
            methods.setWrapperHeight(stickyElement);
          }, false);
          stickyElement.addEventListener('DOMNodeRemoved', function() {
            methods.setWrapperHeight(stickyElement);
          }, false);
        }
      },
      update: scroller,
      unstick: function(options) {
        return this.each(function() {
          var that = this;
          var unstickyElement = $(that);

          var removeIdx = -1;
          var i = sticked.length;
          while (i-- > 0) {
            if (sticked[i].stickyElement.get(0) === that) {
                splice.call(sticked,i,1);
                removeIdx = i;
            }
          }
          if(removeIdx !== -1) {
            unstickyElement.unwrap();
            unstickyElement
              .css({
                'width': '',
                'position': '',
                'top': '',
                'float': '',
                'z-index': ''
              })
            ;
          }
        });
      }
    };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };

  $.fn.unstick = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.unstick.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };
  $(function() {
    setTimeout(scroller, 0);
  });
}));

// Find output DOM associated to the DOM element passed as parameter
function findOutputForSlider( element ) {
   var idVal = element.id;
   outputs = document.getElementsByTagName( 'output' );
   for( var i = 0; i < outputs.length; i++ ) {
     if ( outputs[ i ].htmlFor == idVal )
       return outputs[ i ];
   }
}

function getSliderOutputPosition( slider ) {
  // Update output position
  var newPlace,
      minValue;

  var style = window.getComputedStyle( slider, null );
  // Measure width of range input
  sliderWidth = parseInt( style.getPropertyValue( 'width' ), 10 );

  // Figure out placement percentage between left and right of input
  if ( !slider.getAttribute( 'min' ) ) {
    minValue = 0;
  } else {
    minValue = slider.getAttribute( 'min' );
  }
  var newPoint = ( slider.value - minValue ) / ( slider.getAttribute( 'max' ) - minValue );

  // Prevent bubble from going beyond left or right (unsupported browsers)
  if ( newPoint < 0 ) {
    newPlace = 0;
  } else if ( newPoint > 1 ) {
    newPlace = sliderWidth;
  } else {
    newPlace = sliderWidth * newPoint;
  }

  return {
    'position': newPlace + 'px'
  }
}

document.addEventListener( 'DOMContentLoaded', function () {
  // Get all document sliders
  var sliders = document.querySelectorAll( 'input[type="range"].slider' );
  [].forEach.call( sliders, function ( slider ) {
    var output = findOutputForSlider( slider );
    if ( output ) {
      if ( slider.classList.contains( 'has-output-tooltip' ) ) {
        // Get new output position
        var newPosition = getSliderOutputPosition( slider );

        // Set output position
        output.style[ 'left' ] = newPosition.position;
      }

      // Add event listener to update output when slider value change
      slider.addEventListener( 'input', function( event ) {
        if ( event.target.classList.contains( 'has-output-tooltip' ) ) {
          // Get new output position
          var newPosition = getSliderOutputPosition( event.target );

          // Set output position
          output.style[ 'left' ] = newPosition.position;
        }

        // Update output with slider value
        output.value = event.target.value;
      } );
    }
  } );
} );

// ==== FOOTER ==== //


// A simple wrapper for all your custom jQuery that belongs in the footer
;(function($){
  $(function(){

    headerStuff();
    carouselInit();
    uploadFormStuff();
    regFormHacks();
    juryZoom();
    jury_system();

    // set default filters
    var today = new Date();
    var page, winners, query, section, shortlist;

    if( $('body').hasClass('page-id-78') ) { page = 'teilnehmer'; }
    else if( $('body').hasClass('page-id-82') ) { page = 'archiv'; }
    else if( $('body').hasClass('page-id-199') ) { page = 'shortlist'; }
    else { page = 'other'; }


    // if ($('body').hasClass('page-template-template_upload') || $('body').hasClass('page-template-template_bildwervaltung') || $('body').hasClass('page-template-template_login-register')) {
    //   // user upload pages
    //   console.log('user upload page');
    //   var $buoop = {required:{e:-4,f:-3,o:-3,s:-1,c:-3},insecure:true,unsupported:true,mobile:false,api:2018.10,test:true };
    //   function $buo_f(){
    //   var e = document.createElement("script");
    //   e.src = "//browser-update.org/update.min.js";
    //   document.body.appendChild(e);
    //   };
    //   try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
    //   catch(e){window.attachEvent("onload", $buo_f)}
    //
    // }

    $('.dropdown-trigger').on('click', function(){
      $(this).parent().toggleClass('is-active');
    });$
    $('.dropdown-item').on('click', function(){
      $('.dropdown').removeClass('is-active');
    });

    $('.modal-close').on('click', function(){
      $(this).closest('.modal').removeClass('is-active');
    })
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        $('.modal').removeClass('is-active');
      }
    });

    function jury_system() {
      if ($('body').hasClass('page-template-jury_system')) {

        $(window).bind( 'load', function() {
          var load = $('.loading')
          load.fadeOut(500);
          setTimeout(function(){
            load.remove();
          }, 550);
        });

        // bootstrap
        var total = $('div.user').length;
        console.log('total = ' + total);
        if(hash()) { doJuryPager(); }
        else { window.location.hash = '#1'; }
        $(window).on('hashchange', function(e) { doJuryPager(); });
        $('.counter .total').html(total);

        $('a.zoom').on('click', function(){
          var m = $(this).closest('.wrapper').find('.modal');
          m.addClass('is-active');
          var src = m.find('img').data('src');
          m.find('img').attr('src', src);
        });

        function pget(name) {
          var regexS = "[\\?&]"+name+"=([^&#]*)";
          var regex = new RegExp ( regexS );
          var tmpURL = window.location.href;
          var results = regex.exec( tmpURL );
          if( results == null )
            return "";
          else
            return results[1];
        }


        function doJuryPager() {
          var tag = pget('tag');
          // console.log('tag: ' + tag);
          // console.log('show page ' + hash());

          if (!tag) {
            $('.user.show').removeClass('show');
            var n = hash() - 1;
            $('.user').eq(n).addClass('show');
            $('.counter .count').html(hash());
          } else if(tag) {
            $('.user').addClass('show');
            $('h2.title').hide();
            $('.hideOnTag').hide();
          }


          if(hash() == 1) {
            $('button.prev').prop('disabled', true);
          } else {
            $('button.prev').prop('disabled', false);
          }
          if(hash() == total) {
            $('button.next').prop('disabled', true);
          } else {
            $('button.next').prop('disabled', false);
          }
        }

        $('.showname').change(function(e){
          if($(this).is(":checked")) {
            $('.name-off').hide();
            $('.name-on').show();
          } else {
            $('.name-off').show()
            $('.name-on').hide();
          }
        });

        $('.showinfo').change(function(e){
          if($(this).is(":checked")) {
            $('.box .text.hide').removeClass('hide');
          } else {
            $('.box .text').addClass('hide');
          }
        });

        $('button.pager').on('click', function(e) {
          console.log($(this));
          if ($(this).hasClass('next')) {
            window.location.hash = '#' + next();
          } else {
            window.location.hash = '#' + prev();
          }
        });

        $(document).keydown(function(e) {
          switch(e.which) {
            case 37: // left
              modalPager('prev');
            break;
            case 39: // right
              modalPager('next');
            break;
            default: return; // exit this handler for other keys
          }
          e.preventDefault();
        });
        function modalPager(dir) {
          var m = $('.modal.is-active');
          m.removeClass('is-active');
          if (dir == 'prev') {
            var l = m.closest('.box').parent().prev().find('.modal');
            l.addClass('is-active');
            var src = l.find('img').data('src');
            l.find('img').attr('src', src);
          }
          if (dir == 'next') {
            var l = m.closest('.box').parent().next().find('.modal');
            l.addClass('is-active');
            var src = l.find('img').data('src');
            l.find('img').attr('src', src);
          }

        }

        function prev() {
          if (hash() > 1) {
            return hash() - 1;
          } else {
            return 1;
          }
        }

        function next() {
          if (hash() < total) {
            return hash() + 1;
          } else {
            return total;
          }
        }

        function hash() {
          return parseInt(window.location.hash.substring(1));
        }

      } // end if page jury_system
    } // end jury_system()

    function juryZoom() {
      $('a.zoom').on('click', function(e) {
        $(this).parent().addClass('current');
        const zoom = $(this).data('zoom');
        const img = '<img src="' + zoom + '">';
        $('#zoom .image').html(img);
        $('#zoom').show();
        e.preventDefault();
      });

      $('#zoom .close').on('click', function(e) {
        $('#zoom').hide();
        $('#zoom .image img').remove();
        $('.current').removeClass('current');
        e.preventDefault();
      });

      $(document).keydown(function(e) {
        switch(e.which) {
          case 37: // left
            seriesMove('prev');
          break;
          case 39: // right
            seriesMove('next');
          break;
          default: return; // exit this handler for other keys
        }
        e.preventDefault();
      });

      function seriesMove(dir) {
        var c = $('.series-image.current');
        var newImage = null;

        if (dir == 'prev' && c.prev().length) {
          newImage = c.prev().find('a.zoom').data('zoom');
          $('.series-image.current').removeClass('current');
          c.prev().addClass('current');
        } else if (dir == 'next' && c.next().length) {
          newImage = c.next().find('a.zoom').data('zoom');
          $('.series-image.current').removeClass('current');
          c.next().addClass('current');
        }

        // console.log(newImage);

        if (newImage !== null) {
          const img = '<img src="' + newImage + '">';
          $('#zoom .image').html(img);
        }
      }
    }

    console.log('WP API > '+page);

    wpAPIstuff2();

    $('.past-years.notice').on('click', function(){
      var t = $(this).closest('section');
      if( ! t.hasClass('is-active') ) {
        // open
        t.addClass('is-active')
        $(this).parent().find('.fetch.wait').trigger('fetchit');
      } else {
        // close
        t.removeClass('is-active');
      }
    });

    $('.single-info .back').on('click', function(){
      window.history.back();
    });




    function wpAPIstuff2() {

      var target = '#results'; // default

      // set winners bool depending on page
      if(page == 'teilnehmer') {
        winners = 'EXCLUDE,photo_prize_first,das_scharfe_sehen_1,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3'; // ,photo_public,cartoon_public
      }
      else if(page == 'archiv') {
        // winners = 'INCLUDE,photo_prize_first,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1';
        winners = 'INCLUDE,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1,photo_prize_first,photo_prize_2,photo_prize_3,photo_public,cartoon_public';
        section = $('#archiv').data('section');
        target = '.section.winners .columns';
      }
      else if(page == 'shortlist') {
        winners = null;
        shortlist = true;
      }
      else { winners = null; }
      // console.log('winners');

      $('.tabs li:first').addClass('is-active');
      
      var catt = $('.tabs li:first').data('category');
      if(catt) catt = catt.toLowerCase();

      var filters = {
        target: target,
        category: catt,
        year: today.getFullYear() - 1,
        search: null,
        page: page,
        section: section,
        winners: winners,
        paged: 1,
        per_page: 20,
        filter_series: true,
        shortlist: shortlist
      };
      console.log('filters:');
      console.log(filters);


      // read current filters {} object and update results without text search
      function ajaxState() {
        doAjax({
          target: filters.target,
          w: filters.winners,
          y: filters.year,
          c: filters.category,
          s: filters.search,
          pg: filters.paged,
          pp: filters.per_page,
          filter_series: filters.filter_series,
          shortlist: filters.shortlist
        });
      }

      function setSection() {
        var s = filters.section;
        var w = $('#archiv');
        console.log('setSection(): ' + s);

        if(s == 'winners') {
          filters.winners = 'INCLUDE,das_scharfe_sehen_1,das_scharfe_sehen_2,cartoon_prize_1,cartoon_prize_2,cartoon_prize_3,series_prize_1,photo_prize_first,photo_prize_2,photo_prize_3,photo_public,cartoon_public';
          filters.target = '.section.winners .columns';
          filters.filter_series = true;
          filters.search = '';
          filters.paged = 1;
          filters.category = '';
          w.find('*[data-section="winners"]').show();
          w.find('*[data-section="archive"]').hide();
        }
        if(s == 'archive') {
          filters.winners = null;
          filters.target = '#results';
          filters.filter_series = false;
          filters.search = '';
          filters.paged = 1;
          filters.category = 'foto';
          w.find('*[data-section="winners"]').hide();
          w.find('*[data-section="archive"]').show();
        }
      }


      // populate archive with default Ajax category if empty
      var resultsState = $('#results').data('state');
      if(resultsState === 'empty') {
        setSection();
        ajaxState();
      }
      // else if(resultsState == 'winners') {
      //   ajaxState();
      //   setSection();
      // }


      $('#searchform').on('submit', function(){
        var s = $(this).serializeArray();
        s = s[0];
        s = s.value;
        if(!s) { s = null; }
        filters.search = s;
        filters.paged = 1;
        filters.target = '#results';
        ajaxState();
        return false;
      });

      $('.fetch').each(function(){
        var t = $(this);
        var target = '#' + t.attr('id');
        var pp = t.data('pp');
        if(!pp) { pp = 20; }

        t.on('fetchit', function(){
          console.log('fetchit: ' + $(this).attr('id'));
          doAjax({
            target: target,
            y: t.data('y'),
            c: t.data('c'),
            s: t.data('s'),
            uid: t.data('uid'),
            series_name: t.data('series'),
            pg: 1,
            pp: pp,
            filter_series: true
          });
          t.removeClass('fetchit');
        });

        if( ! t.hasClass('wait') ) {
          t.trigger('fetchit')
        }
      });

      $('.slider-section .slider').on('change', function(){
        var v = $('#filterYear').contents().text();
        console.log(v);
        if(filters.section !== 'winners') {
          filters.target = '#results';
        }
        filters.year = v;
        $('.more').remove();

        if(v < 2017) {
          $('.series_archive_wrapper').hide();
        } else {
          $('.series_archive_wrapper').show();
        }

        ajaxState();
      });

      $('#load-more').on('click', function(){
        $('#results').append('<div class="more columns is-multiline"/>');
        filters.paged = filters.paged + 1;
        filters.target = '#results .more:last';
        ajaxState();
      });

      function doAjax(q) {
        console.log('doAjax');
        console.log(q);

        var target = q.target;

        if(q.series_name) {
          var series = true;
        } else {
          var series = false;
        }

        if(filters.section == 'winners') {
          $(target+' .column .inner').remove();
          $(target+' .column').removeClass('loaded');
        } else {
          $(target+' .column').remove();
        }

        $(target).addClass('is-loading');

        $.ajax( {
          method: 'GET',
          data: q,
          url: '/wp-json/relevanssi/v2/fetch',
          /*    /wp-json/entries/v2/search?winners=true&year=2013&category=foto
          */
          success: function(data) {
                                      console.log(data);
            $(target).removeClass('is-loading');

            if(data[0] !== 'nada') {

              for(var i=0; i<data.length; i++) {
                var post = data[i];

                var seriesName = '';
                var postCaption = '';

                var catt = post.category;
                if(catt) catt = catt.toLowerCase();

                if(post.series_name && catt === 'serie') {
                  seriesName = '<div class="series">' + post.series_name + '</div>';
                  var seriesClass = ' series-icon';
                } else {
                  var seriesClass = '';
                }

                if(post.winner) {
                  var winnerBadge = ' badge-' + post.winner;
                } else {
                  var winnerBadge = '';
                }

                postCaption = '<div class="caption">' + post.caption + '</div><div class="shade"></div>';

                if(post.series_name && catt === 'serie') {
                  var img = '<a href="' + post.link + '" target="_blank"><div class="'+winnerBadge+'"><div class="image' + seriesClass + '" style="background-image: url(' + post.thumb + ')">&nbsp;</div></div><div class="name">' + post.fullname + ' <span class="year">(' + post.year + ')</span></div></a>' + seriesName + postCaption;
                } else {
                  var img = '<a href="' + post.link + '" target="_blank"><div class="image' + seriesClass + winnerBadge + '" style="background-image: url(' + post.thumb + ')">&nbsp;</div><div class="name">' + post.fullname + ' <span class="year">(' + post.year + ')</span></div></a>' + seriesName + postCaption;
                }


                if (filters.section == 'winners') {
                  img = '<div class="inner">' + img + '</div>';
                  // $('[data-prize="' + post.winner + '"]').append(img);
                  var wt = $('[data-prize="' + post.winner + '"]');
                  if( ! wt.hasClass('loaded') ) {
                    wt.addClass('loaded').html(img);
                  }
                } else if (series) {
                  var largeImg = '<img src="'+ post.large +'">';
                  $(target).append('<div class="slide"><span  class="watermark photo">'+ largeImg +'</span></div>');
                } else {
                  $(target).append('<div class="column is-3" data-year="' + post.year + '">' + img + '</div>');
                }
              }

              setTimeout(function () {
                var stagger = 0;
                var cYear = $(target).data('current');

                // console.log('not just winners');
                $(target + ' .column').each(function(){
                  var t = $(this);
                  var tYear = t.data('year');
                  if( tYear !== cYear || filters.section == 'winners' && !t.is(':empty') ) {
                    stagger = stagger + 40;
                    setTimeout(function () {
                      if( t.is(':hidden') ) t.show();
                      t.addClass('loaded');
                    }, stagger);
                  }
                  else {
                    // remove images from the year of the main image on the page
                    t.hide();
                  }
                });
                $('.pagination.is-hidden').removeClass('is-hidden');
                $('.loadmore.is-hidden').removeClass('is-hidden');
              }, 10);


            } else {
              $(target).append('<div class="column is-6 is-offset-3 error"><h1>Keine Treffer</h1></div>');
              setTimeout(function () {
                $(target + ' .error').addClass('loaded');
              }, 10);
            }
          },
          cache: true,
        } );

      } // end doAjax()


      // PAGINATION
      $('.pagination .arrow').on('click', function(){
        var t = $(this);
        var dir = t.data('dir');
        var p = filters.paged;
        if(dir == 'next') {
          // next
          // dunno how many pages...
          filters.paged = p + 1;
          ajaxState();
        } else {
          // prev
          if(p - 1 > 0) {
            filters.paged = p - 1;
            ajaxState();
          }
        }
        $('.pagination .page span').text(filters.paged); // ????
        console.log('page: ' + filters.paged);
        return false;
      });

      // change filter object on tab click
      $('.tabs li').on('click', function(){
        var tabs = $(this).closest('.tabs');
        tabs.find('.is-active').removeClass('is-active');
        $(this).addClass('is-active');
        var category = $(this).data('category');
        if(category) category = category.toLowerCase();

        var tab = $(this).data('tab');
        if(category) {
          filters.category = category;
          filters.target = '#results';
          filters.paged = 1;
        }
        else if(tab) {
          filters.section = tab;
          setSection();
        }

        // shortlist hack
        if(category == 'serie') {
          console.log('shortlist hack');
          $('.page-template-page-shortlist .loadmore.opacity0').removeClass('opacity0');
        } else {
          $('.page-template-page-shortlist .loadmore').addClass('opacity0');
        }
        // shortlist hack remove empties
        $('.more.columns.is-multiline').each(function(){
          var tl = $(this).contents().length;
          if(tl == 0) $(this).remove();
        })

        ajaxState();
        return false;
      });

    } // end wpAPIstuff()




    function headerStuff() {
      // sticky header
      $("header").sticky({ topSpacing: 0 });

      // burger menu open
      $('.navbar-burger').on('click', function() {
        $(this).addClass('is-active');
        $('#menu').addClass('is-active');
      });

      // nav close
      $('#menu .close').on('click', function() {
        $('.navbar-burger').removeClass('is-active');
        $('#menu').removeClass('is-active');
      });
    }

    var mainH = $(window).height() - $('#footer').height() - $('#pre-header').height() - $('#header').height();
    $('#main, .column.side-menu').css('min-height', mainH);

    // remove link to blank post in cms
    $('.wpuf-dashboard-content.posts tbody tr').each(function(){
      $(this).find('td:first a').contents().unwrap();
    });


    function carouselInit() {
      $('.owl-carousel.autoplay').owlCarousel({
        autoplay: true,
        autoplayTimeout: 8000,
        smartSpeed: 1000,
        autoWidth: false,
        loop: true,
        nav: true,
        items: 1,
        responsiveClass: true,
        responsive: { 0: { nav:false }, 400: { nav: true } },
        navText: [' ', ' ']
      });

      $('.owl-carousel').not('#prizes-gallery .gallery, .owl-carousel.autoplay, .jury-preview').owlCarousel({
        autoWidth: false,
        smartSpeed: 1000,
        loop: true,
        nav: true,
        items: 1,
        responsiveClass: true,
        responsive: { 0: { nav:false }, 400: { nav: true } },
        navText: [' ', ' ']
      });

      $('#prizes-gallery .gallery').owlCarousel({
        autoplay: true,
        autoplayTimeout: 8000,
        smartSpeed: 2000,
        autoWidth: true,
        center: true,
        loop: true,
        nav: true,
        items: 2,
        responsiveClass: true,
        responsive: { 0: { nav:false }, 400: { nav: true } },
        navText: [' ', ' ']
      });

      $('.jury-preview').owlCarousel({
        autoWidth: false,
        smartSpeed: 1000,
        loop: true,
        nav: true,
        items: 1,
        responsiveClass: true,
        responsive: { 0: { nav:false }, 400: { nav: true } },
        navText: [' ', ' ']
      });

    }




    // Find output DOM associated to the DOM element passed as parameter
    function findOutputForSlider( element ) {
       var idVal = element.id;
       outputs = document.getElementsByTagName( 'output' );
       for( var i = 0; i < outputs.length; i++ ) {
         if ( outputs[ i ].htmlFor == idVal )
           return outputs[ i ];
       }
    }

    function getSliderOutputPosition( slider ) {
      // Update output position
      var newPlace,
          minValue;

      var style = window.getComputedStyle( slider, null );
      // Measure width of range input
      sliderWidth = parseInt( style.getPropertyValue( 'width' ), 10 );

      // Figure out placement percentage between left and right of input
      if ( !slider.getAttribute( 'min' ) ) {
        minValue = 0;
      } else {
        minValue = slider.getAttribute( 'min' );
      }
      var newPoint = ( slider.value - minValue ) / ( slider.getAttribute( 'max' ) - minValue );

      // Prevent bubble from going beyond left or right (unsupported browsers)
      if ( newPoint < 0 ) {
        newPlace = 0;
      } else if ( newPoint > 1 ) {
        newPlace = sliderWidth;
      } else {
        newPlace = sliderWidth * newPoint;
      }

      return {
        'position': newPlace + 'px'
      }
    }

    document.addEventListener( 'DOMContentLoaded', function () {
      // Get all document sliders
      var sliders = document.querySelectorAll( 'input[type="range"].slider' );
      [].forEach.call( sliders, function ( slider ) {
        var output = findOutputForSlider( slider );
        if ( output ) {
          if ( slider.classList.contains( 'has-output-tooltip' ) ) {
            // Get new output position
            var newPosition = getSliderOutputPosition( slider );

            // Set output position
            output.style[ 'left' ] = newPosition.position;
          }

          // Add event listener to update output when slider value change
          slider.addEventListener( 'input', function( event ) {
            if ( event.target.classList.contains( 'has-output-tooltip' ) ) {
              // Get new output position
              var newPosition = getSliderOutputPosition( event.target );

              // Set output position
              output.style[ 'left' ] = newPosition.position;
            }

            // Update output with slider value
            output.value = event.target.value;
          } );
        }
      } );
    } );


    function uploadFormStuff() {
      if ( $('body').hasClass('page-id-19949') || $('body').hasClass('page-id-19936') ) {
        console.log('uploadFormStuff()');

        // $('.wpuf-el').not('.kategorie').hide();

        $('.wpuf-submit-button').on('click', function(){
          setTimeout(function(){
            console.log('fix english form errors');
            $('.wpuf-error-msg').each(function(){
              var text = $(this).text();
              console.log(text);
              if (text == 'Bildbeschriftung is required') $(this).text('Bitte Bildunterschrift hinzufügen')
              if (text == 'Aufnahmeort is required') $(this).text('Bitte Aufnahmeort hinzufügen')
              if (text == 'Aufnahmedatum is required') $(this).text('Bitte Aufnahmedatum hinzufügen')
              if (text == 'Datei is required') $(this).text('Bitte Datei hinzufügen')
              if (text == 'Please fix the errors to proceed') $(this).text('')
              if (text == '') $(this).text('Bitte die fehlenden Felder ausfüllen um fortzufahren')
              // if (text == '') $(this).text('')

              // $(this).text(text.replace('', ''))
            })
          }, 100);
        });

        function getMeta(url, callback) {
            var img = new Image();
            img.src = url;
            img.onload = function() { callback(this.width, this.height); }
        }
        var largeImg = false;
        $(document).on('DOMSubtreeModified',function(){
          if (!largeImg) {
            var img = $('.wpuf-attachment-list .attachment-name img')

            if (img.length) {
              var src = img.attr('src');
              if (src) foundImg = true;
              var large = img.attr('alt');
              var dir = src.substring(0, src.lastIndexOf("/"));
              var ext = src.split('.').pop();
              largeImg = dir + '/' + large + '.' + ext;
              console.log(largeImg);

              getMeta(largeImg, function(width, height) {
                // console.log(width + 'px ' + height + 'px');
                if (width < 1200) {
                  alert('Dieses Bild ist zu klein. Bitte lade in höherer Auflösung hoch.');
                  $('a.attachment-delete').trigger('click');
                  largeImg = false;
                }
              });
            }
          }
        });

        var state = $('#state').data('state');
        console.log('---- state -----');
        console.log(state);
        console.log('----------------');

        var rules = {
          foto: { min: 2, max: 4 },
          serie: { min: 4, max: 6 },
          karikatur: { min: 2, max: 6 }
        };
        // console.log('rules');
        // console.log(rules);

        if (state.usertype === 'fotograf') {
          $('input[value="karikatur"]').parent().hide();
        }
        if (state.usertype === 'karikaturist') {
          $('input[value="foto"]').parent().hide();
          $('input[value="serie"]').parent().hide();
          $('input[value="karikatur"]').prop('checked', true);
          catChange();
        }

        $('.wpuf-el.kategorie').on('change', function(){
          catChange();
        });

        var url = window.location.pathname;
        var isEdit = false
        if (url.indexOf("edit") >= 0) {
          isEdit = true;
          console.log('isEdit');
          catChange();
        }

        function catChange() {
          var checked = $('.kategorie .wpuf-fields').find('input:checked');
          var val = checked.val();
          console.log(val);

          var all = $('.datei, .post_title, .datum, .standort, .part-2, .part-3, .wpuf-submit');
          // var foto = $('.standort');
          var serie = $('.serienname, .series_counter');
          // var karikatur = $('.verleger');

          all.show();
          $('.max').hide();

          if (val == 'foto') {
            serie.hide(); // karikatur.hide(); foto.show();
          }

          else if (val == 'serie') {
            serie.show();
            var seriesMax = 50;
            var seriesCount = state.totalseriescount;
            var seriesLeft = seriesMax - seriesCount;

            // set series name if it exists, disable editing it
            // also hide if editing
            // don't hide if there's only one series
            if (state.total.serie >= 1) {
              // console.log('honk1');
              if (state.serienname || isEdit) {
                // console.log('honk2');
                $('input[name="serienname"]').val(state.serienname);
                $('li.serienname').css({ 'overflow': 'hidden', 'height': 0, 'opacity': 0, 'display': 'none !important', 'padding': 0, 'margin': 0 });
                // $('li.serienname').css({ 'display': 'none !important'});
              }
            }

            if (seriesLeft > 0 || state.total.serie > 0 || isEdit) {
              var seriesCounterText = 'Es wurden bereits ' + seriesCount + ' von 50 möglichen Serien eingereicht.';
              var seriesCounterTag = '<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">' + seriesCounterText + '</p>';

              if ($('.series_counter').length < 1 && state.total.serie == 0 && !isEdit) {
                $('.part-2').prepend(seriesCounterTag);
              }

              serie.show();
            }

            else {
              all.hide();
              var seriesCounterText = 'Das Limit von 50 möglichen Serien-Einsendungen ist bereits erreicht.';
              var seriesCounterTag = '<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">' + seriesCounterText + '</p>';
              $('.wpuf-form .wpuf-el:first').after(seriesCounterTag);
            }

            // foto.hide(); karikatur.hide();
            $('label[for="serienname"]').html('Serientitel <span class="required">*</span>');
          }

          else if (val == 'karikatur') {
            serie.hide(); // foto.hide(); karikatur.show();
            $('label[for="datum"]').html('Erscheinungsdatum <span class="required">*</span>');
            $('label[for="standort"]').html('Veröffentlicht in folgender Zeitung <span class="required">*</span>');
          }

          if (state.total[val] < rules[val].max && state.total[val] < rules.val.min) {
            // too few
            console.log('too few '+val);
          }
          if (state.total[val] < rules[val].max && state.total[val] > rules.val.min) {
            // not too few, not too many
            console.log('not too few, not too many '+val);
          }
          if (state.total[val] >= rules[val].max) {
            // max
            console.log('max '+val);
            all.hide();
            serie.hide();

            if (!$('.error.max').length) {
              var text = "Sollten Sie ihre Bildauswahl ändern wollen, löschen Sie bitte zuerst unter &bdquo;Bildaktualisierung&ldquo; die Datei/Dateien, die Sie nicht zum Wettbewerb einreichen möchten und laden dann die neuen Bilddateien hoch.";
              $('.kategorie').after('<li class="error max"><p><b>'+text+'</b></p></li>');
            } else {
              $('.max').show();
            }

          }

        }

      }
    }


    function regFormHacks() {
      if ($('body').hasClass('um-page-register')) {
        $('#confirm_user_password-20047').attr('placeholder', 'Passwort wiederholen')
      }
    }


    // .page-id-20012
    // window.setTimeout(function(){
      console.log('remove pw txt');
      $('.um-field-password_reset_text div div').text('Um Ihr Passwort zurückzusetzen, geben Sie bitte Ihre E-Mail-Adresse oder Benutzernamen unten ein.');
      $('.um-field-username_b input').attr('placeholder', 'Geben Sie Ihren Benutzernamen und Ihre E-Mail-Adresse ein.')
    // }, 3000)

    // .um-field-block div')
    // .html('xxx Um Ihr Passwort zurückzusetzen, geben Sie bitte Ihre E-Mail-Adresse oder Benutzernamen unten ein.');

  });

}(jQuery));
