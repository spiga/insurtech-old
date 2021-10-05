/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var INSURTECH = {
    // All pages
    'common': {
      init: function() {
        // JavaScript to be fired on all pages


        $('.i-feat__inner').slick({
          draggable: true,
          autoplay: false,
          arrows: false,
          dots: true,
          fade: true,
          speed: 300,
          infinite: true,
          cssEase: 'ease-in-out',
          touchThreshold: 100
        });

        $('.i-feat__inner').on('beforeChange', function(event, slick, currentSlide, nextSlide){
          var $current = slick.$slides.eq(currentSlide).find('img, .i-feat__item__text'),
              $next = slick.$slides.eq(nextSlide).find('img, .i-feat__item__text'),
              direction = nextSlide - currentSlide >= 0 ? -1 : 1;

          $current.css({left:0}).stop(true,true).animate({left:200 * direction},300,'easeInOutSine');
          $next.css({left:-200 * direction}).stop(true,true).animate({left:0},300,'easeInOutSine');
        });

        $('.i-section--gestion').slick({
          draggable: true,
          autoplay: false,
          arrows: true,
          dots: false,
          fade: true,
          speed: 300,
          infinite: false,
          cssEase: 'ease-in-out',
          touchThreshold: 100
        });        

        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.i-sections__assets--bg__area',
            scrub: true,
            start: "bottom-=600px bottom",
            end: "bottom bottom"
          },
          defaults: {ease: "none"}
        });
        tl.fromTo('.i-sections__assets--bg__ray > div', { height: 0}, {height: '100%', duration: 3})
          .to('body',{ duration: 2 }) 
          .fromTo('.i-sections__assets--bg__area', { opacity: 1}, {opacity: 0, duration: 3})
          .fromTo('.i-sections__assets--bg__ray > div', { height: '100%'}, {height: 0, duration: 2});



        /*gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        var tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".line-1",
              scrub: true,
              start: "top bottom",
              end: "top top"
            }
          });

        tl.from(".line-1", {scaleX: 0, transformOrigin: "left center", ease: "none"})
          .to(".panels", {backgroundColor: "#91a1b0"}, 1);*/

        // --- RED PANEL ---
        /*gsap.from(".line-1", {
          scrollTrigger: {
            trigger: ".line-1",
            scrub: true,
            start: "top bottom",
            end: "top top"
          },
          scaleX: 0,
          transformOrigin: "left center", 
          ease: "none"
        });*/


        /*tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".purple",
              scrub: true,
              pin: true,
              start: "top top",
              end: "+=100%"
            }
          });

        tl.from(".purple p", {scale: 0.3, rotation:45, autoAlpha: 0, ease: "power2"})
          .from(".line-3", {scaleX: 0, transformOrigin: "left center", ease: "none"}, 0)
          .to(".panels", {backgroundColor: "#91a1b0"}, 0);

        // --- ORANGE PANEL ---
        gsap.from(".line-2", {
          scrollTrigger: {
            trigger: ".orange",
            scrub: true,
            pin: true,
            start: "top top",
            end: "+=100%"
          },
          scaleX: 0, 
          transformOrigin: "left center", 
          ease: "none"
        });*/

        /*gsap.utils.toArray("nav a").forEach(function(a) {
          a.addEventListener("click", function(e) {
            e.preventDefault();
            gsap.to(window, {duration: 1, scrollTo: e.target.getAttribute("href")});
          });
        });*/

        gsap.registerPlugin(MotionPathPlugin);

        // The start and end positions in terms of the page scroll
        var offsetFromTop = innerHeight * 0.25;
        var pathBB = document.querySelector("#satellite-path").getBoundingClientRect();
        var startY = 0; //pathBB.top - innerHeight + offsetFromTop;
        var finishDistance = startY + pathBB.height - offsetFromTop;

        // the animation to use
        var tween = gsap.to("#satellite", {
          duration: 5, 
          paused: true,
          ease: "none",
          motionPath: {
            path: "#satellite-path",
            align: "#satellite-path",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
          }    
        }).pause(0.001);
        document.addEventListener("scroll", function() {
          if (!requestId) {
            requestId = requestAnimationFrame(update);
          }
        });
        update();
        function update() {
          tween.progress((scrollY - startY) / finishDistance);
          requestId = null;
        }
      },
      finalize: function() {
        setTimeout(function(){
          $(window).scrollTop(99999999);
        },10);
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    // About us page, note the change from about-us to about_us.
    'about_us': {
      init: function() {
        // JavaScript to be fired on the about us page
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = INSURTECH;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
