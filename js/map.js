var GeoLocation = (function() {
    function GeoLocation() {
        this.geoLat = null;
        this.geoLong = null;
    };
    GeoLocation.prototype.assignCoords = function(geoLat, geoLong) {
        this.geoLat = geoLat;
        this.geoLong = geoLong;
    };
    return GeoLocation;
})();

var GeoCity = (function() {
    function GeoCity(name) {
        this.name = name;
        GeoLocation.call(this);
    };
    GeoCity.prototype = new GeoLocation();

    return GeoLocation;
})();

var map = L.map('map').setView([51.505, -0.09], 13);


L.esri.basemapLayer("Gray").addTo(map);