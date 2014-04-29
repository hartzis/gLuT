var GeoCity = (function() {
    function GeoCity(name) {
        this.name = name;
        this.state = null;
        this.country = null;
        this.geoLocation = null;
    };
    GeoCity.prototype.setGeoLocation = function(geoLat, geoLong) {
        this.geoLocation = new L.latLong(geoLat, geoLong);
    };

    return GeoCity;
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