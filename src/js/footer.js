// ==== FOOTER ==== //

// A simple wrapper for all your custom jQuery that belongs in the footer
;(function($){
  $(function(){

    headerStuff();
    carouselInit();
    uploadFormStuff();
    regFormHacks();

    // set default filters
    var today = new Date();
    var page, winners, query, section, shortlist;

    if( $('body').hasClass('page-id-78') ) { page = 'teilnehmer'; }
    else if( $('body').hasClass('page-id-82') ) { page = 'archiv'; }
    else if( $('body').hasClass('page-id-199') ) { page = 'shortlist'; }
    else { page = 'other'; }

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

      var filters = {
        target: target,
        category: $('.tabs li:first').data('category'),
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
          filters.category = 'Foto';
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

                if(post.series_name && post.category === 'Serie') {
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

                if(post.series_name && post.category === 'Serie') {
                  var img = '<a href="' + post.link + '"><div class="'+winnerBadge+'"><div class="image' + seriesClass + '" style="background-image: url(' + post.thumb + ')">&nbsp;</div></div><div class="name">' + post.fullname + ' <span class="year">(' + post.year + ')</span></div></a>' + seriesName + postCaption;
                } else {
                  var img = '<a href="' + post.link + '"><div class="image' + seriesClass + winnerBadge + '" style="background-image: url(' + post.thumb + ')">&nbsp;</div><div class="name">' + post.fullname + ' <span class="year">(' + post.year + ')</span></div></a>' + seriesName + postCaption;
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

      $('.owl-carousel').not('#prizes-gallery .gallery, .owl-carousel.autoplay').owlCarousel({
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
          karikatur: { min: 2, max: 4 }
        };

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
              console.log('honk1');
              if (state.serienname || isEdit) {
                console.log('honk2');
                $('input[name="serienname"]').val(state.serienname);
                $('li.serienname').css({ 'overflow': 'hidden', 'height': 0, 'opacity': 0, 'display': 'none !important', 'padding': 0, 'margin': 0 });
                // $('li.serienname').css({ 'display': 'none !important'});
              }
            }

            if (seriesLeft > 0) {
              var seriesCounterText = 'Es wurden bereits ' + seriesCount + ' von 50 möglichen Serien eingereicht.';
              var seriesCounterTag = '<p class="series_counter" style="border: 1px #aaa solid; background: #FFD; padding: 0.5em 1em; margin: 0 0 2em 0; font-size: 0.9em; border-radius: 4px;">' + seriesCounterText + '</p>';

              if ($('.series_counter').length < 1) {
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
