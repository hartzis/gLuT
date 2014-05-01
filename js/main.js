var allGeoTweets, theMapObjects;


// helper function to serialize form into an object
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var loadData = function(callback) {
    callback(data);
    // $.ajax('url/api', callback);
};


// create tweet class
var GeoTweet = (function() {
    function GeoTweet(tweetId, tweet, tweetDate, userName, userScreenName, userIconUrl, geo) {
        this.tweetId = tweetId;
        this.tweet = tweet;
        var splitDate = tweetDate.split(' ');
        this.tweetDate = [splitDate[1], splitDate[2], splitDate[3], splitDate[5]].join(" ");
        this.userName = userName;
        this.userScreenName = userScreenName;
        this.userIconUrl = userIconUrl;
        this.geoLatLng = geo;
        // moving to listofgeos

    }
    GeoTweet.prototype.createTweet = function() {
        var $tweetContainer = $('#tweet-container').clone().removeAttr('id');
        $tweetContainer.attr('data-tweet-id', this.tweetId);
        $tweetContainer.find('.user-icon').attr('src', this.userIconUrl);
        $tweetContainer.find('.user-name').text(this.userName);
        $tweetContainer.find('.user-screen-name').text(" @" + this.userScreenName);
        $tweetContainer.find('.date-span').text(this.tweetDate);
        $tweetContainer.find('.tweet-text').text(this.tweet);

        $tweetContainer.toggle()

        return $tweetContainer;
    };

    return GeoTweet;
})();

// create list of tweets class
var ListOfGeoTweets = (function() {
    function ListOfGeoTweets() {
        this.geoTweets = [];
    }
    ListOfGeoTweets.prototype.addGeoTweetsArray = function(geoTweetsArray) {
        this.geoTweets = this.geoTweets.concat(geoTweetsArray);
    };
    ListOfGeoTweets.prototype.emptyGeoTweets = function() {
        this.geoTweets = [];
    };
    // setup tweet list and tweet objects
    ListOfGeoTweets.prototype.addGeoTweetData = function(returnedGeoTweets) {
        for (var i = 0; i < returnedGeoTweets.statuses.length; i++) {
            var newGeoTweet = new GeoTweet(returnedGeoTweets.statuses[i].id_str,
                returnedGeoTweets.statuses[i].text,
                returnedGeoTweets.statuses[i].created_at,
                returnedGeoTweets.statuses[i].user.name,
                returnedGeoTweets.statuses[i].user.screen_name,
                returnedGeoTweets.statuses[i].user.profile_image_url,
                returnedGeoTweets.statuses[i].geo.coordinates);
            this.geoTweets.unshift(newGeoTweet);
        };
    }
    ListOfGeoTweets.prototype.createFeed = function() {
        var newFeed = [];
        for (var i = 0; i < this.geoTweets.length; i++) {
            newFeed.unshift(this.geoTweets[i].createTweet());
        };
        return newFeed;
    };

    return ListOfGeoTweets;
})();

// fake tweet functions
var fakeTweets = function(testCity, allGeoTweets, theMapObjects, tweetIcon, tweetFeed, tweetsContainer, callback) {

    allGeoTweets.addGeoTweetData(window[testCity]);
    theMapObjects.createMarkers(allGeoTweets.geoTweets);
    theMapObjects.setMarkerIcons(tweetIcon);
    theMapObjects.createMarkersFeatureGroup();
    theMapObjects.createMarkersFeatureOnClickEvent(tweetFeed, tweetsContainer);
    theMapObjects.renderMarkersOnMap();

    /* need to have a container position
		relative to get the position of tweets from*/
    tweetsContainer.append(allGeoTweets.createFeed());

    callback();
    // $.getJSON(getThisJson, function(json) {
    //     console.log(json);
    // });

}

$(document).on('ready', function() {

    //setup initial loading of basemap
    theMapObjects = new MapObjects('map', 0, 0, 1, "Gray", "GrayLabels");

    // setup initial GeoTweets and ListOfGeoTweets
    allGeoTweets = new ListOfGeoTweets();

    // pan to clicked on tweet text and open pop-up info
    $(document).on('click', '.tweet-container', function() {
        // get tweet by data-tweet-id
        var tweetId = $(this).attr('data-tweet-id')
        $(this).addClass('callout').siblings().removeClass('callout');
        var foundMarker = theMapObjects.markers.filter(function(marker) {
            return marker.options.alt === tweetId;
        })[0];
        theMapObjects.map.panTo(foundMarker.getLatLng());
        foundMarker.openPopup();
    });

    // submit search api request 
    // then switch to tweet view
    // populate map with tweet markers
    $(document).on('click', '#search-twitter', function() {

        //clear all tweets in tweets DOM container element
        var tweetsContainer = $('#tweets-container');
        tweetsContainer.empty();

        // tweet feed dom element
        var tweetFeed = $('#tweet-feed');

        //clear markers and empty current tweets
        theMapObjects.removeCurrentMarkers();
        allGeoTweets.emptyGeoTweets();

        //get object for server side
        var formObject = $('#search-form form').serializeObject();
        console.log(formObject);

        // load fake tweet data
        fakeTweets(formObject.testCity, allGeoTweets, theMapObjects, tweetIcon, tweetFeed, tweetsContainer, function() {
            theMapObjects.panToMarkers();
        });

        $('#view-tweets').addClass("disabled");
        $('#search-tweets').removeClass('disabled')
        // animate transition
        $('#search-form').slideToggle(750, function() {
            // display feed
            $('#tweet-feed').slideDown(750);
        });

        return false;
    })

    // switch to search form
    $('#search-tweets').on('click', function() {
        if (!($(this).hasClass("disabled"))) {
            $(this).addClass("disabled");
            $('#view-tweets').removeClass('disabled')
            // animate trasition
            $('#tweet-feed').slideToggle(750, function() {
                // display search form
                $('#search-form').slideToggle(750);
            });
        }
    });

    // switch to tweet feed
    $('#view-tweets').on('click', function() {
        if (!($(this).hasClass("disabled"))) {
            $(this).addClass("disabled");
            $('#search-tweets').removeClass('disabled')
            // animate trasition
            $('#search-form').slideToggle(750, function() {
                // display feed
                $('#tweet-feed').slideToggle(750);
            });
        }
    })

    $(document).on('click', '#login', function() {



        return false;
    })


});