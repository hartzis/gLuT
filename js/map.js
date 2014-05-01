var MapObjects = (function() {
    function MapObjects(mapId, geoLat, geoLong, zoomLevel, esriBaseMap, esriBaseMapLabels) {
        // setup initial map
        var mapsInitialLatLng = new L.latLng(geoLat, geoLong);
        this.map = L.map(mapId).setView(mapsInitialLatLng, zoomLevel);
        L.esri.basemapLayer(esriBaseMap).addTo(this.map);
        L.esri.basemapLayer(esriBaseMapLabels).addTo(this.map);
        // set up marker stuff
        this.markers = [];
        this.markersFeatureGroup = new L.featureGroup();
    };
    MapObjects.prototype.renderMarkersOnMap = function() {
        this.markersFeatureGroup.addTo(this.map);
    };
    MapObjects.prototype.removeCurrentMarkers = function() {
        this.map.removeLayer(this.markersFeatureGroup);
        this.markersFeatureGroup.clearLayers();
        this.markers = [];
    };
    MapObjects.prototype.setMarkerIcons = function(icon) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setIcon(icon);
        };
    };
    MapObjects.prototype.panToMarkers = function() {
        this.map.fitBounds(this.markersFeatureGroup.getBounds());
    };
    MapObjects.prototype.createMarkers = function(geoTweets) {
        for (var i = 0; i < geoTweets.length; i++) {
            var thisTweet = geoTweets[i];
            var thisTweetsGeo = L.latLng(thisTweet.geoLatLng[0], thisTweet.geoLatLng[1]);
            var newMarker = new L.marker(thisTweetsGeo, {
                title: "@" + thisTweet.userScreenName,
                alt: thisTweet.tweetId
            });
            newMarker.bindPopup("<div class='text-center'><img src='" + thisTweet.userIconUrl + "' class='user-icon'><br>" + thisTweet.userName + "</div>");
            this.markers.unshift(newMarker);
        };
    };
    MapObjects.prototype.createMarkersFeatureGroup = function() {
        for (var i = 0; i < this.markers.length; i++) {
            this.markersFeatureGroup.addLayer(this.markers[i]);
        };
    };
    MapObjects.prototype.createMarkersFeatureOnClickEvent = function(tweetFeed, $tweetsContainer) {
        var thisMap = this.map;
        this.markersFeatureGroup.on('click', function(e) {
            // get tweet id and find tweet DOM element
            var tweetId = e.layer.options.alt;
            thisMap.panTo(e.latlng);
            theTweetDom = $tweetsContainer.find('[data-tweet-id="' + tweetId + '"]');
            theTweetDom.addClass('callout').siblings().removeClass('callout');
            tweetFeed.scrollTop(theTweetDom.position().top);
        });
    };

    return MapObjects;
})();


var tweetIcon = L.icon({
    iconUrl: "./img/bird_blue_32.png",
    shadowUrl: "./img/bird_gray_32.png",
    iconSize: [32, 25],
    shadowSize: [32, 25],
    shadowAnchor: [12, 10]
});

var tweetIconDiv = L.divIcon();

var initialLoadMap = function(mapId, geoLat, geoLong, zoomLevel, esriBaseMap, esriBaseMapLabels) {
    var latLng = new L.latLng(geoLat, geoLong);
    var map = L.map(mapId).setView(latLng, zoomLevel);

    L.esri.basemapLayer(esriBaseMap).addTo(map);

    L.esri.basemapLayer(esriBaseMapLabels).addTo(map);

    return map;
}