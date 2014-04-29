var theMap, allGeoTweets;

var loadData = function(callback) {
    callback(data);
    // $.ajax('url/api', callback);
};

// create tweet class
var GeoTweet = (function() {
    function TweetObj(tweet, tweetDate, userName, userIconUrl, geo) {
        this.tweet = tweet;
        this.tweetDate = tweetDate;
        this.userName = userName;
        this.userIconUrl = userIconUrl;
        this.geoLocation = geo;
        this.marker = new L.marker(L.latLng(geo[0], geo[1]), {
            'title': this.userName
        });
    }

    return TweetObj;
})();

// create list of tweets class
var ListOfGeoTweets = (function() {
    function ListOfGeoTweets() {
        this.geoTweets = [];
    }
    ListOfGeoTweets.prototype.addGeoTweet = function(geoTweet) {
        this.geoTweets.unshift(geoTweet);
    };
    return ListOfGeoTweets;
})();


$(document).on('ready', function() {

    //setup initial loading of basemap
    theMap = initialLoadMap('map', 39.7482097, -104.9950172, 14, "Gray", "GrayLabels");


    // setup initial GeoTweets and ListOfGeoTweets
    allGeoTweets = new ListOfGeoTweets();
    for (var i = 0; i < demoTweets.statuses.length; i++) {
        var newGeoTweet = new GeoTweet(demoTweets.statuses[i].text,
            demoTweets.statuses[i].created_at,
            demoTweets.statuses[i].user.screen_name,
            demoTweets.statuses[i].user.profile_image_url,
            demoTweets.statuses[i].geo.coordinates);
        console.log(newGeoTweet);
        allGeoTweets.addGeoTweet(newGeoTweet)
    };

    for (var i = 0; i < allGeoTweets.geoTweets.length; i++) {
        allGeoTweets.geoTweets[i].marker.addTo(theMap);
    };

    // submit search api request 
    // then switch to tweet view
    // populate map with tweet markers
    $(document).on('click', '#search-twitter', function() {



        // load data from 'server'
        // loadData(function(data){
        // 	populate the map stuff
        // });

        return false;
    })

    $(document).on('click', '#login', function() {



        return false;
    })


});