$(document).ready(function() {
    $('.inpage-nav__link').bind('click', function(e) {
        e.preventDefault(); // prevent hard jump, the default behavior

        var target = $(this).attr("href"); // Set the target as variable

        // perform animated scrolling by getting top-position of target-element and set it as scroll
        $('html, body').stop().animate({
                scrollTop: $(target).offset().top
        }, 600, function() {
                location.hash = target; //attach the hash (#jumptarget) to the pageurl
        });

        return false;
    });
});

$(window).scroll(function() {
    var scrollDistance = $(window).scrollTop();

    // Show/hide menu on scroll
    if (scrollDistance >= 850) {
        $('.inpage-nav').addClass("is-visible");
    } else {
        $('.inpage-nav').removeClass("is-visible");
    }

    // Assign active class to nav links while scolling
    $('.podcast-section').each(function(i) {
        if ($(this).position().top <= scrollDistance + 150) {
                $('.inpage-nav__link.active').removeClass('active');
                $('.inpage-nav__link').eq(i).addClass('active');
        }
    });
}).scroll();