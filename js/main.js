var allGeoTweets;

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
        this.geoLatLng = new L.latLng(geo[0], geo[1]);
        this.marker = new L.marker(L.latLng(geo[0], geo[1]), {
            title: this.tweetId
        });
        this.marker.bindPopup("<div class='text-center'><img src='" + this.userIconUrl + "' class='user-icon'><br>" + this.userName + "</div>");
        // this is not good code, fix!
        // pan to marker when clicked
        this.marker.on('click', function(e) {
            e.target._map.panTo(e.target._latlng)
        })
    }
    GeoTweet.prototype.createTweet = function() {
        var tweetContainer = $('<div>', {
            class: 'row tweet-container',
            'data-tweet-id': this.tweetId
        });
        var userIcon = $('<img>', {
            class: 'user-icon',
            src: this.userIconUrl
        });
        var userNameSpan = $('<span>', {
            class: "userName",
            text: this.userName + " @" + this.userScreenName
        });
        var tweetDateSpan = $('<span>', {
            class: "date-span",
            text: this.tweetDate
        });
        var theTweet = $('<span>', {
            class: "tweet-text",
            text: this.tweet
        });
        var tweetIconContainer = $('<div class="small-2 columns"></div>');
        var tweetInfoContainer = $('<div class="small-10 columns"></div>')
        var tweetHeadContainer = $('<div class="row"></div>');
        var tweetFootContainer = $('<div class="row"></div>');

        var tweetNameContainer = $('<div class="small-6 columns"></div>');
        var tweetDateContainer = $('<div class="small-6 columns"></div>');
        var tweetTextContainer = $('<div class="small-12 columns"></div>');

        tweetIconContainer.append(userIcon);
        tweetHeadContainer.append(tweetNameContainer.append(userNameSpan),
            tweetDateContainer.append(tweetDateSpan));
        tweetFootContainer.append(tweetTextContainer.append(theTweet));
        tweetInfoContainer.append(tweetHeadContainer, tweetFootContainer);
        //compile full tweet
        tweetContainer.append(tweetIconContainer, tweetInfoContainer);
        return tweetContainer;
    };
    return GeoTweet;
})();

// create list of tweets class
var ListOfGeoTweets = (function() {
    function ListOfGeoTweets(mapObj) {
        this.geoTweets = [];
        this.map = mapObj;
    }
    ListOfGeoTweets.prototype.addGeoTweetsArray = function(geoTweetsArray) {
        this.geoTweets = this.geoTweets.concat(geoTweetsArray);
    };
    ListOfGeoTweets.prototype.renderTweetsOnMap = function() {

        for (var i = 0; i < this.geoTweets.length; i++) {
            this.geoTweets[i].marker.addTo(this.map);
        };
    };
    ListOfGeoTweets.prototype.emptyTweetList = function() {
        this.GeoTweets = [];
    };
    ListOfGeoTweets.prototype.clearMapOfCurrentMarkers = function() {
        for (var i = 0; i < this.geoTweets.length; i++) {
            this.map.removeLayer(this.geoTweets[i].marker);
        };
    };
    ListOfGeoTweets.prototype.setMarkerIcons = function(icon) {
        for (var i = 0; i < this.geoTweets.length; i++) {
            this.geoTweets[i].marker.setIcon(icon);
        };
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


$(document).on('ready', function() {

    //setup initial loading of basemap
    var theMap = initialLoadMap('map', 39.7482097, -104.9950172, 14, "Gray", "GrayLabels");


    // setup initial GeoTweets and ListOfGeoTweets
    allGeoTweets = new ListOfGeoTweets(theMap);




    // pan to clicked on tweet and open pop-up info
    $(document).on('click', '.tweet-container', function() {
        var tweetId = $(this).attr('data-tweet-id')
        console.log(tweetId);
        var foundTweet = allGeoTweets.geoTweets.filter(function(geoTweet) {
            return geoTweet.tweetId === tweetId;
        })[0];
        allGeoTweets.map.panTo(foundTweet.geoLatLng);
        foundTweet.marker.openPopup();
    });
    // pan to clicked marker
    $(document).on('click', '.leaflet-marker-icon', function() {
        console.log('pooque');
    })

    // submit search api request 
    // then switch to tweet view
    // populate map with tweet markers
    $(document).on('click', '#search-twitter', function() {



        allGeoTweets.addGeoTweetData(demoTweets);
        allGeoTweets.setMarkerIcons(tweetIcon);

        allGeoTweets.renderTweetsOnMap();

        // display feed
        $('#tweet-feed').append(allGeoTweets.createFeed());

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