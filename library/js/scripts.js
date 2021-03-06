var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isFirefox = typeof InstallTrigger !== 'undefined';
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
var isIE = /*@cc_on!@*/false || !!document.documentMode;
var isEdge = !isIE && !!window.StyleMedia;
var isChrome = !!window.chrome && !!window.chrome.webstore;
var isBlink = (isChrome || isOpera) && !!window.CSS;

// This is Javascript and requires JQuery to be loaded
(function($) {
    var breakpointIndex = -1;

    $(document).ready(function() {
        import_svg($('.rocket-man img'));

        if(isIE) {
            $('body').addClass('ie');
        } else if(isEdge) {
            $('body').addClass('edge');
        }

        var jobs = $('#jobs');
        if(jobs.length) {
            $.getJSON('https://careers.pageuppeople.com/616/flux/en/jobs.json', function(data) {
                $('#jobs').html('');

                // data = ''; // uncomment this for testing "no jobs found"
                if(data.length) {
                    var fluxiesCount = 16;
                    var result = '';

                    for(var i = 0; i < data.length; ++i) {
                        var job = data[i];

                        var fluxieIndex = Math.floor(Math.random() * fluxiesCount) + 1;

                        result += '<section class="job job-'+(job.Id)+'">';
                        result += '<div class="fluxy">';
                        result += '<div class="image">';
                        result += '<img src="../../library/img/fluxies/fluxy-'+(fluxieIndex)+'.svg" />';
                        result += '</div>';
                        result += '</div>';
                        result += '<div class="description">';
                        result += '<h4>'+(job.Title)+'</h4>';
                        result += '<p class="large">'+(job.Locations)+'</p>';
                        result += '<p>'+(job.Summary)+'</p>';
                        result += '<div class="flux-button">';
                        result += '<a class="read-more" href="#" data-job="'+(job.Id)+'">Read more</a>';
                        result += '</div>';
                        result += '<div class="overview">'+(job.Overview);

                        result += '<div class="flux-button">';
                        result += '<a href="'+(job.ApplyUrl)+'" target="_blank">Apply</a>';
                        result += '</div>';

                        result += '</div>';
                        result += '</div>';
                        result += '</section>';
                    }

                    $('#jobs').html(result);

                    $('.job .description .flux-button a.read-more').on('click', function(event) {
                        event.preventDefault();

                        // var button = $(this).parent();
                        // var link = $(this);
                        // if(button.length) {
                        //     var overview = button.next('.overview');
                        //     if(overview.length) {
                        //         if(button.hasClass('open')) {
                        //             link.html('Read more');
                        //             button.removeClass('open');
                        //             overview.slideUp(750);
                        //         } else {
                        //             link.html('Read less');
                        //             button.addClass('open');
                        //             overview.slideDown(750);
                        //         }                                
                        //     }
                        // }

                        var jobID = $(this).data('job');
                        window.location = "/careers/opportunities/single-job/?"+jobID;
                    });

                    $('main').removeClass('no-jobs');
                } else {
                    $('main').addClass('no-jobs');
                    $.get('/careers/opportunities/no-job-openings.html', function(data) {
                        $('#jobs').html(data);
                    });
                }
            });
        }

        var singleJob = $('#single-job');
        if(singleJob.length) {
            var code = get_first_url_param('');
            if(code !== undefined) {
                $.getJSON('https://careers.pageuppeople.com/616/flux/en/jobs.json', function(data) {
                    if(data.length) {
                        var fluxiesCount = 16;
                        var result = '';
                        var found = false;

                        for(var i = 0; i < data.length; ++i) {
                            var job = data[i];

                            if(job.Id == code) {
                                var fluxieIndex = Math.floor(Math.random() * fluxiesCount) + 1;

                                result += '<section class="job job-'+(job.Id)+'">';
                                result += '<div class="fluxy">';
                                result += '<div class="image">';
                                result += '<img src="../../../library/img/fluxies/fluxy-'+(fluxieIndex)+'.svg" />';
                                result += '</div>';
                                result += '</div>';
                                result += '<div class="description">';
                                result += '<h4>'+(job.Title)+'</h4>';
                                result += '<p class="large">'+(job.Locations)+'</p>';
                                result += '<p>'+(job.Summary)+'</p>';
                                result += '<div class="overview">'+(job.Overview);

                                result += '<div class="flux-button">';
                                result += '<a href="'+(job.ApplyUrl)+'" target="_blank">Apply</a>';
                                result += '</div>';

                                result += '</div>';
                                result += '</div>';
                                result += '</section>';

                                singleJob.html(result);
                                found = true;
                                break;
                            }
                        }

                        if(found !== true) {
                            $('main').addClass('expired-job');
                            $.get('/careers/opportunities/single-job/expired-job.html', function(data) {
                                singleJob.html(data);
                            });
                        }
                    } else {
                        $('main').addClass('no-jobs');
                        $.get('/careers/opportunities/no-job-openings.html', function(data) {
                            $('#jobs').html(data);
                        });
                    }
                });
            }
        }

        $('.video-wrapper .thumbnail-wrapper .thumbnail a').on('click', function(event) {
            event.preventDefault();

            var videoID = $(this).data('video-id');
            if(videoID > 0) {
                var iframe = $(this).closest('.video-wrapper').find('iframe');
                if(iframe.length) {
                    $(iframe).attr('src', 'https://player.vimeo.com/video/'+videoID+'?autoplay=1&title=0&byline=0&portrait=0');
                }
            }
        });

        $('.location-page .location-wrapper a').on('click', function(event) {
            event.preventDefault();

            var location = $(this).attr('href');
            $('html, body').animate({
                scrollTop: $(location).offset().top
            }, 1500);
        });



        var getInTouchSubmitted = false;
        $('#2').validate({
            rules: {
                '1': {
                    required: true,             // your name
                    minlength: 3,
                    maxlength: 30,
                    noNumbers: true,
                },
                '2': {                          // your email
                    required: true,
                    email: true,
                    emailBetterDomain: true,
                    minlength: 5,
                    maxlength: 30,
                },
                '3': {
                    required: true,             // how can we help
                    minlength: 3,
                },
            },
            errorPlacement: function(error, element) {
            },
            submitHandler: function(form) {
                form.submit();
                getInTouchSubmitted = true;

                setTimeout(function() {
                    window.location = '/thank-you/?thank=get-in-touch';
                }, 1000);
            },
        });

        $('#get-in-touch-response').on('load', function(event) {
            return(!getInTouchSubmitted);
        });



        var talkToUsSubmitted = false;
        $('#talk-to-us-form').validate({
            rules: {
                'entry.514709734': {
                    required: true,             // your name
                    maxlength: 30,
                    minlength: 3,
                    noNumbers: true,
                },
                'entry.365974255': {
                    required: true,             // company name
                    maxlength: 30,
                    minlength: 3,
                },
                'entry.979571740': {
                    required: true,             // your role
                    maxlength: 30,
                    minlength: 3,
                },
                'entry.1009693116': {           // your email
                    required: true,
                    email: true,
                    emailBetterDomain: true,
                    maxlength: 30,
                    minlength: 5,
                },
                'entry.1675168538': {
                    required: true,             // difficult question
                    minlength: 3,
                },
                'entry.1152685397': {
                    required: true,             // radio buttons - type of request
                },
            },
            errorPlacement: function(error, element) {
            },
            submitHandler: function(form) {
                form.submit();
                talkToUsSubmitted = true;

                setTimeout(function() {
                    window.location = '/thank-you/?thank=talk-to-us';
                }, 1000);
            },
        });

        $('#talk-to-us-response').on('load', function(event) {
            return(!talkToUsSubmitted);
        });



        var brochureDownloadSubmitted = false;
        $('#brochure-download-form').validate({
            rules: {
                'entry.514709734': {
                    required: true,             // your name
                    maxlength: 30,
                    minlength: 3,
                    noNumbers: true,
                },
                
                'entry.365974255': {
                    required: true,             // company name
                    maxlength: 30,
                    minlength: 3,
                },
                'entry.979571740': {
                    required: true,             // your role
                    maxlength: 30,
                    minlength: 3,
                },
                'entry.1009693116': {           // your email
                    required: true,
                    email: true,
                    emailBetterDomain: true,
                    maxlength: 30,
                    minlength: 5,
                },
                
            },
            errorPlacement: function(error, element) {
            },
            submitHandler: function(form) {
                form.submit();
                brochureDownloadSubmitted = true;

                setTimeout(function() {
                    window.location = '/library/download/Flux-Sales-Booklet-Global-Market-KL19-AU.pdf';
                }, 1000);
            },
        });

        $('#brochure-download-response').on('load', function(event) {
            return(!brochureDownloadSubmitted);
        });


        $('a.down-arrow').on('click', function(event) {
            event.preventDefault();

            var location = $(this).attr('href');
            $('html, body').animate({
                scrollTop: $(location).offset().top
            }, 500);
        });

        var arrows = $('.what-is-flux-diagram .arrows');
        if(arrows.length) {
            animate_arrows('.what-is-flux-diagram', 1);
        }

        var arrowsMobile = $('.what-is-flux-diagram-mobile .arrows');
        if(arrowsMobile.length) {
            animate_arrows('.what-is-flux-diagram-mobile', 1);
        }

        var clouds = $('.clouds');
        if(clouds.length) {
            var images = $(clouds).children('img');
            if(images.length) {
                var windowWidth = $(window).width();
                $.each(images, function(index, element) {
                    var left = parseInt(Math.random() * windowWidth);
                    var top = parseInt(Math.random() * $(element).height() * 3.5);
                    $(element).css({
                        left: left+'px',
                        top: top+'px',
                        display: 'block',
                    });
                });

                setInterval(function() {
                    $.each(images, function(index, element) {
                        var left = $(element).position().left;
                        var top = $(element).position().top;
                        var width = $(element).width();

                        left += 0.2 + (index * 0.1);
                        if(left >= $(window).width()) {
                            left = -width;
                            top = parseInt(Math.random() * $(element).height() * 3.5);
                        }
                        $(element).css({
                            left: left+'px',
                            top: top+'px',
                        });
                    });
                }, 10);
            }
        }

        var thank = get_url_param('thank');
        if(thank !== undefined) {
            $('#'+thank+'-thank-you').show();
        }

        var scroll = get_url_param('scroll');
        if(scroll !== undefined) {
            var offset = $('#'+scroll).offset().top;
            $('html, body').animate({
                scrollTop: offset+'px'
            }, 1000);
        }

        $('.hamburger').on('click', function(event) {
            event.preventDefault();

            if($(this).hasClass('open')) {
                hamburger_close();
            } else {
                hamburger_open();
            }
        });

        $('a.scroll-to-footer').on('click', function(event) {
            event.preventDefault();

            hamburger_close();

            var offset = $('#footer').offset().top;
            offset -= $('#header').height();

            var inPageNav = $('#in-page-nav').height();
            if(inPageNav !== undefined) {
                offset -= inPageNav;
            }

            $('html, body').animate({
                scrollTop: offset+'px'
            }, 1000);
        });

        $('a.drop-us-a-line').on('click', function(event) {
            event.preventDefault();

            var hasreveal = $(this).closest('.hasreveal');
            if(hasreveal.length) {
                var slider = $(hasreveal[0]).find('.slider');
                if(slider.length) {
                    if(slider.hasClass('open')) {
                        slider.removeClass('open');
                        slider.slideUp(500);
                    } else {
                        slider.addClass('open');
                        slider.slideDown(500);
                    }
                }
            }
        });

        $('a.gform').on('click', function(event) {
            event.preventDefault();
            var id = $(this).attr('href');
            $('#'+id).submit();
        });

        $('.markets .country').on('click', function(event) {
            event.preventDefault();

            if(breakpointIndex < 2) {
                var country = $(this);
                var retailers = country.next('.retailers');
                var inner = retailers.find('.inner');
                if(retailers.length) {
                    if(retailers.hasClass('open')) {
                        retailers.stop().slideUp(250, function() {
                            country.removeClass('open').removeAttr('style');
                            retailers.removeClass('open').removeAttr('style');
                            inner.removeAttr('style');
                        });
                    } else {
                        country.addClass('open');
                        retailers.stop().addClass('open').slideDown(250);
                        inner.removeAttr('style');
                    }
                }
            }
        });

        $('.markets .country').on('mouseenter', function(event) {
           markets_close_desktop();

            if(breakpointIndex >= 2) {
                var country = $(this);
                var retailers = country.next('.retailers');
                var inner = retailers.find('.inner');
                if(!country.hasClass('open')) {
                    country.addClass('open');
                    inner.fadeTo(250, 1);
                    retailers.slideDown(250, function() {
                        retailers.addClass('open');
                        retailers.removeAttr('style');
                        inner.removeAttr('style');
                    });
                }
            }
        });

        $('.markets').on('mouseleave', function(event) {
            markets_close_desktop();
        });

        function markets_close_desktop() {
            if(breakpointIndex >= 2) {
                $.each($('.markets .country.open'), function(index, country) {
                    var retailers = $(country).next('.retailers');
                    var inner = retailers.find('.inner');
                    inner.fadeTo(250, 0);
                    retailers.slideUp(250, function() {
                        $(country).removeClass('open');
                        retailers.removeClass('open');
                        retailers.removeAttr('style');
                        inner.removeAttr('style');
                    });
                });
            }
        }

        $('.leadership-member-container .flux-button a').on('click', function(event) {
            event.preventDefault();

            var description = $(this).parent().parent().parent().next('.leadership-member-decription');
            if(description.length) {
                description.fadeIn(500);
            }
        });

        $('.leadership-member-decription .flux-button a').on('click', function(event) {
            event.preventDefault();
            $(this).parent().parent().parent().fadeOut(500);
        });

        $('#roles .profile').on('mouseenter', function(event) {
            profiles_close_desktop();

            if(breakpointIndex >= 2) {
                var profile = $(this);
                var bio = profile.next('.bio');
                var inner = bio.find('.inner');
                if(!profile.hasClass('open')) {
                    profile.addClass('open');
                    inner.fadeTo(250, 1);
                    bio.slideDown(250, function() {
                        bio.addClass('open').removeAttr('style');
                        inner.removeAttr('style');
                    });

                }
            }
        });

        $('#roles article').on('mouseleave', function(event) {
            profiles_close_desktop();
        });

        function profiles_close_desktop() {
            if(breakpointIndex >= 2) {
                $.each($('#roles .profile.open'), function(index, profile) {
                    $(profile).removeClass('open');
                    var bio = $(profile).next('.bio');
                    var inner = bio.find('.inner');
                    inner.fadeTo(250, 0);
                    bio.slideUp(250, function() {
                        bio.removeClass('open').removeAttr('style');
                        inner.removeAttr('style');
                    });
                });
            }
        }
    });
    
    var globeAnimating = 0;
    $(window).on('resize orientationchange load scroll', function() {
        var bodyAfter = window.getComputedStyle(document.body, ':after');
        if(bodyAfter !== undefined) {
            var content = bodyAfter.getPropertyValue('content');
            if(content.charAt(0) === '"') {
                content = content.substr(1, content.length - 1);
            }
            if(content.charAt(content.length - 1) === '"') {
                content = content.substr(0, content.length - 1);
            }

            var index = parseInt(content);
            if(index !== breakpointIndex) {
                if((breakpointIndex < 2) && (index >= 2)) {
                    $('.markets .country').removeClass('open').removeAttr('style');
                    $('.markets .retailers').removeClass('open').removeAttr('style');
                    $('.markets .retailers .inner').removeAttr('style');
                }

                breakpointIndex = index;
                if(breakpointIndex >= 2) {
                    hamburger_close();
                }
            }
        }

        var windowCenter = $(this).scrollTop() + ($(this).height() * 0.5);

        var globeSection = $('#world-markets');
        if(globeSection.length) {
            var globeSectionCenter = $(globeSection).offset().top + ($(globeSection).height() * 0.5);
            var threshold = 200;

            if(globeSectionCenter <= (windowCenter + threshold)) {
                $('.globe .pin').addClass('animate');
                $('.globe .label').addClass('animate');
            }
        }

        var flexibleSection = $('#flexible-section');
        if(flexibleSection.length) {
            var sectionCenter = $(flexibleSection).offset().top + ($(flexibleSection).height() * 0.5);
            var threshold = 200;

            if(sectionCenter <= (windowCenter + threshold)) {
                $('#flexible-section .flexible-animation .old-slice').addClass('animate');
                $('#flexible-section .flexible-animation .new-slice').addClass('animate');
            }
        }

        var simpleSection = $('#simple-section');
        if(simpleSection.length) {
            var sectionCenter = $(simpleSection).offset().top + ($(simpleSection).height() * 0.5);
            var threshold = 200;

            if(sectionCenter <= (windowCenter + threshold)) {
                $('#simple-section .simple-animation .outer').addClass('animate');
                $('#simple-section .simple-animation .middle').addClass('animate');
            }
        }
        
        $.each($('.parallax'), function(index, element) {
            var bottomElement = $(element).find('.parallax-bottom');
            var middleElement = $(element).find('.parallax-middle');
            var topElement = $(element).find('.parallax-top');

            if(bottomElement.length && middleElement.length && topElement.length) {
                var middle = $(middleElement).offset().top + ($(middleElement).height() * 0.5);
                if(middle != 0) {
                    $(bottomElement).css('top', ((windowCenter - middle) * 0.05)+'px');
                    $(topElement).css('top', ((windowCenter - middle) * 0.15)+'px');
                }
            }
        });

        var scrollTop = $(this).scrollTop();
        if((scrollTop < 50) && $('main').hasClass('scroll')) {
            $('#header').removeClass('scroll');
            $('main').removeClass('scroll');

            setTimeout(function() {
                update_in_page_nav_location($(window).scrollTop());
            }, 250);
        } else if((scrollTop >= 50) && !$('main').hasClass('scroll')) {
            $('#header').addClass('scroll');
            $('main').addClass('scroll');

            setTimeout(function() {
                update_in_page_nav_location($(window).scrollTop());
            }, 250);
        } else {
            update_in_page_nav_location(scrollTop);
        }

        meet_the_flux_screen_scroll();
    });

    var hamburgerTimer = -1;
    function hamburger_open() {
        if(hamburgerTimer >= 0) {
            clearTimeout(hamburgerTimer);
        }
        $('.hamburger').addClass('open');
        $('nav.nav').addClass('open').addClass('mobile');
    }

    function hamburger_close() {
        $('.hamburger').removeClass('open');
        $('nav.nav').removeClass('open');

        hamburgerTimer = setTimeout(function() {
            $('nav.nav').removeClass('mobile');
            hamburgerTimeer = -1;
        }, 500)
    }

    function meet_the_flux_screen_scroll() {
        var meet = $('.meet-the-flux-screens');
        if(meet.length) {
            var screenImage = $('.meet-the-flux-screens .overlay img');
            var screenImageHeight = screenImage.height();
            var overlayHeight = $('.meet-the-flux-screens .overlay').height();

            var screenImageOffset = screenImageHeight - overlayHeight;

            var windowHeight = $(window).height();

            var topLimit = -windowHeight * 0.1;
            var bottomLimit = windowHeight * 0.6;

            var position = meet.offset().top - $(document).scrollTop();

            var offset = 0;
            if(position > bottomLimit) {
                // offset stays at 0px
            } else if(position < topLimit) {
                offset = -screenImageOffset;
            } else {
                var ratio = (position - topLimit) / (bottomLimit - topLimit);
                offset = -(1.0 - ratio) * screenImageOffset;
            }

            $(screenImage).css('top', offset+'px');
        }
    }

    function update_in_page_nav_location(scrollTop) {
        var header = $('#header');
        var headerOffset = 0;
        if(header.css('position') === 'fixed') {
            headerOffset = header.outerHeight();
        }

        var masthead = $('#masthead');
        var mastheadBottom = $(masthead).position().top + $(masthead).outerHeight();

        var inPageNav = $('#in-page-nav');
        var inPageNavHeight = inPageNav.outerHeight();
        var inPageNavOffset = mastheadBottom - scrollTop;

        var spacer = $('#in-page-nav-spacer');

        if(inPageNavOffset <= headerOffset) {
            inPageNav.css({
                position: 'fixed',
                top: headerOffset+'px',
                zIndex: 4
            });

            inPageNav.addClass('fixed');

            if(!spacer.length) {
                spacer = $('<div id="in-page-nav-spacer" />');
                masthead.after(spacer);
            }
            spacer.css('height', inPageNavHeight+'px');
        } else {
            inPageNav.css({
                position: 'relative',
                top: 'auto'
            });

            inPageNav.removeClass('fixed');

            if(spacer.length) {
                spacer.detach();
            }
        }
    }

    function import_svg(img, callback) {
        if(img.length) {
            var imgID = $(img).attr('id');
            var imgClass = $(img).attr('class');
            var imgURL = $(img).attr('src');

            jQuery.get(imgURL, function(data) {
                var svg = $(data).find('svg');
                if(typeof imgID !== 'undefined') {
                    $(svg).attr('id', imgID);
                }
                if(typeof imgClass !== 'undefined') {
                    $(svg).attr('class', imgClass+' replaced-svg');
                }
                $(svg).removeAttr('xmlns:a');
                if(!$(svg).attr('viewBox') && $(svg).attr('height') && $(svg).attr('width')) {
                    $(svg).attr('viewBox', '0 0 ' + $(svg).attr('height') + ' ' + $(svg).attr('width'));
                }
                
                $(img).replaceWith($(svg));

                if(callback !== undefined) {
                    callback(svg);
                }
            }, 'xml');
        }
    }

    function animate_arrows(parent, index) {
        // show closest
        $(parent+' .arrows3').show();

        // animate all three
        // var duration = 500;

        // if(index > 3) {
        //     index = 1;
        // }

        // $(parent+' .arrows'+index).fadeIn(duration, function() {
        //     $(parent+' .arrows'+index).fadeOut(duration);
        //     animate_arrows(parent, index+1);
        // });
    }
})(jQuery);

function create_office_maps() {
    create_office_map('nz-map', -41.285402, 174.776642);
    create_office_map('aust-map', -37.816193, 144.962947);
    create_office_map('uk-map', 52.477391, -1.911156);
}

function create_office_map(containerID, latitude, longitude) {
    var mapContainer = document.getElementById(containerID);
    var mapCenter = {lat: latitude, lng: longitude};
    var mapStyles = [
        {"elementType": "geometry","stylers": [{"color": "#f5f5f5"}]},
        {"elementType": "labels.icon","stylers": [{"visibility": "off"}]},
        {"elementType": "labels.text.fill","stylers": [{"color": "#616161"}]},
        {"elementType": "labels.text.stroke","stylers": [{"color": "#f5f5f5"}]},
        {"featureType": "administrative.land_parcel","elementType": "labels.text.fill","stylers": [{"color": "#bdbdbd"}]},
        {"featureType": "poi","elementType": "geometry","stylers": [{"color": "#eeeeee"}]},
        {"featureType": "poi","elementType": "labels.text.fill","stylers": [{"color": "#757575"}]},
        {"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#e5e5e5"}]},
        {"featureType": "poi.park","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]},
        {"featureType": "road","elementType": "geometry","stylers": [{"color": "#ffffff"}]},
        {"featureType": "road.arterial","elementType": "labels.text.fill","stylers": [{"color": "#757575"}]},
        {"featureType": "road.highway","elementType": "geometry","stylers": [{"color": "#dadada"}]},
        {"featureType": "road.highway","elementType": "labels.text.fill","stylers": [{"color": "#616161"}]},
        {"featureType": "road.local","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]},
        {"featureType": "transit.line","elementType": "geometry","stylers": [{"color": "#e5e5e5"}]},
        {"featureType": "transit.station","elementType": "geometry","stylers": [{"color": "#eeeeee"}]},
        {"featureType": "water","elementType": "geometry","stylers": [{"color": "#c9c9c9"}]},
        {"featureType": "water","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]}
    ];
    var mapOptions = {
        center: new google.maps.LatLng(mapCenter.lat, mapCenter.lng),
        scrollwheel: false,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoomControl: true,
        draggable: true,
        scaleControl: true,
        keyboardShortcuts: false,
        mapTypeControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        disableDefaultUI: true,
        styles: mapStyles,
    };

    var map = new google.maps.Map(mapContainer, mapOptions);

    var mapPin = {
        url: '/library/img/contact-flux-pin.svg',
        scaledSize: new google.maps.Size(30, 41),
    };

    var mapMarker = new google.maps.Marker({
                        position: mapCenter,
                        optimized: false,
                        icon: mapPin,
                    });
    mapMarker.setMap(map);
}

function get_first_url_param() {
    var pageURL = decodeURIComponent(window.location.search.substring(1));
    var variables = pageURL.split('&');
    var result = undefined;

    if(variables != '') {
        result = variables;
    }
    return(result);
}

function get_url_param(parameterName) {
    var pageURL = decodeURIComponent(window.location.search.substring(1));
    var variables = pageURL.split('&');
    var result = undefined;
    for(var i = 0; i < variables.length; ++i) {
        var values = variables[i].split('=');
        if(values[0] === parameterName) {
            result = values[1];
            break;
        }
    }
    return(result);
}

jQuery.validator.addMethod("emailBetterDomain", function(value, element) {
    var result = this.optional(element);
    if(result === false) {
        var sides = value.split("@");
        if(sides.length == 2) {
            var count = sides[1].split(".").length;
            result = count > 1;
        }
    }
    return(result);
}, "");

jQuery.validator.addMethod("noNumbers", function(value, element) {
    var result = this.optional(element);
    if(result === false) {
        var regex = new RegExp("[0-9]");
        var match = parseInt(regex.exec(value));
        result = isNaN(match);
    }
    return(result);
}, "");