$(window).load(function() {
    $('.video-list-item').each(function(){
        var _this = $(this);
        var videoid = _this.attr('data-id');
        $.get('https://www.googleapis.com/youtube/v3/videos?part=statistics&id='+videoid+'&key=AIzaSyBc50oq-F7_OKjkX002-itENPKY2RwNH4w').then(
            function(response) {
                // console.info(response)
                viewCount = response.items[0].statistics.viewCount;
                _this.find('.viewsnumber').text(viewCount+' views');
            }, function() {
                console.info( "failed!" );
            }
        );
    });

    $('.video-list-item a').on('click', function(){
        var videoviews = $(this).find('.viewsnumber').text();
        $('i.icon-views').attr('data-original-title', videoviews+' views');
    });

    $('.video-list-item a').eq(0).click();
    $('[data-toggle="tooltip"]').tooltip();
});
