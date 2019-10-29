var curLocation = 'kharkov';

function leafletMap(selector, options) {
   this.mapCnt = document.querySelector(selector);
   if (this.mapCnt) {
      this.clusters = L.markerClusterGroup({
         showCoverageOnHover: false
      });
      this.cfg = extend({
         districts: false,
         groupMarkers: false,
         zoom: 12, 
         pinPopup: 'empty',
         initCenterCity: false, 
         districtsButton: false,
         pinIcon: this.mapCnt.getAttribute('data-icon') || './img/leaflet/marker-icon.png',
         geolocationBtnIcon: this.mapCnt.getAttribute('data-icon-geolocation-btn') || './img/location.svg',
         geolocationPin: this.mapCnt.getAttribute('data-icon-geolocation-pin') || './img/leaflet/location-marker.png',
         distStyle: {
            chosen: {
               weight: 2,
               opacity: 1,
               color: '#33384c',
               fillOpacity: 0.1,
            },
            active: {
               weight: 2,
               opacity: 1,
               color: '#33384c',
               fillOpacity: 0,
            },
            inactive: {
               weight: 2,
               opacity: 1,
               color: '#a6b4af',
               fillOpacity: 0,
            }
         }, 
      }, options);

      if (this.cfg.districts === true) {
         
         this.cfg.geoJson = {
            kharkov: path1 + '/js/kharkiv.geojson'
         }

         this.cfg.subway = {
            kharkov: path1 + '/js/kharkiv-subway.json'
         }

         if (curLocation === 'kharkov') {
            this.districtsGeo = this.cfg.geoJson.kharkov;
            this.subway = this.cfg.subway.kharkov;
         }
      }

      if (curLocation === 'kharkov') {
         this.initCenterCoords = [49.989593, 36.261777];
      }

      if (this.cfg.initCenterCity) {
         this.cfg.initView = this.initCenterCoords;
      } else {
         this.cfg.initView = data[0].coordinates;
      }
      
      this.init();

      function extend(obj1, obj2) {
         for (var key in obj2) {
            obj1[key] = obj2[key];
         }
         return obj1;
      }
   }
}

leafletMap.prototype = {
  
   init: function () {
      //create map
      this.map = L.map(this.mapCnt, {
         zoomControl: true,
         scrollWheelZoom: false,
      }).setView(this.cfg.initView, this.cfg.zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
         maxZoom: 18,
         accessToken: 'pk.eyJ1IjoiZGVuaXM4OSIsImEiOiJjanF4c3B0djgwMjJyNDNwcHFnbm1mNWMyIn0.uMcaDzsYAFaVoLgQPP5TBQ'
      }).addTo(this.map);

      this.createLocationButton();
      this.createPins();

      if (this.cfg.districts === true) {
         this.drawDistricts();
         if (this.cfg.districtsButton) {
            this.createDistrictsButton(); 
         }
         this.createMapEvents();
         this.createSubwayStations();
      };
   },
   invalidateSize: function() {
      this.map.invalidateSize();
   },
   createLocationButton: function() { 
      var self = this;

      var location = L.Control.extend({
         options: {
            position: 'topleft' 
         },

         onAdd: function () {
            var locationBtn = L.DomUtil.create('div', 'leaflet-control-location');
            locationBtn.setAttribute('title', 'Geolocation');
            locationBtn.setAttribute('aria-label', 'Geolocation');

            var icon = document.createElement('img');

            icon.setAttribute('src', self.cfg.geolocationBtnIcon);
            locationBtn.appendChild(icon)
            locationBtn.onclick = function(){
               self.map.locate();
            }
            return locationBtn;
          }
      })
      this.map.addControl(new location());
      this.watchLocation();
   },
   watchLocation: function() {
      var self = this;
      var marker;
      var locationPin = L.icon({
         iconUrl: this.cfg.geolocationPin,
         iconSize: [20, 20],
      });
      
      this.map.on('locationfound', function(e){
         if (marker) {
            self.map.removeLayer(marker);
         }
         marker = L.marker([e.latitude, e.longitude], {icon: locationPin});
         self.map.setView([e.latitude, e.longitude], 20)
         self.map.addLayer(marker);
      })
      this.map.on('locationerror', function(e){
         alert("Не удалось определить местоположение");
      });
   },
   createDistrictsButton: function() {
     var self = this;
     this.distBtnState = false;
      var districts = L.Control.extend({
        options: {
            position: 'topleft' 
        },

        onAdd: function () {
          self.districtsBtn = L.DomUtil.create('div', 'leaflet-control-districts');
          self.districtsBtn.setAttribute('title', 'Select area');
          self.districtsBtn.setAttribute('aria-label', 'Select area');
          self.districtsBtn.innerHTML = '<i class="icon-pin"></i>Выбрать<br>район';

          self.districtsBtn.onclick = function(){
            if (self.distBtnState) {
              self.resetDistricts.apply(self);
              self.districtsBtn.classList.remove('active');
            }
          }

          return self.districtsBtn;
        }
    });
    this.map.addControl(new districts());
   },
   createPins: function () {
      var self = this;
      var icon = L.icon({
         iconUrl: this.cfg.pinIcon,
         iconSize: [25, 41],
         iconAnchor: [12.5, 41]
      });

      if (data.length === 0) {
         return false;
      }

      data.forEach(function (item) {
         if (self.cfg.groupMarkers) {
            var marker = L.marker(item.coordinates, {price: item.price, icon: icon});

            if (self.cfg.pinPopup !== 'empty') {
               marker.bindPopup(self.createPopup(item));
            }
            self.clusters.addLayer(marker);
         } else if (!self.cfg.groupMarkers) {
            var marker = L.marker(item.coordinates, {icon: icon});

            if (self.cfg.pinPopup !== 'empty') {
               marker.bindPopup(self.createPopup(item));
               if (self.cfg.pinPopup === 'address') {
                  marker.bindPopup(self.createPopup(item), {'className': 'leaflet-contact'});
               }
            }
            if (self.cfg.pinPopupActive) {
               marker.addTo(self.map).openPopup();
            } else {
               marker.addTo(self.map);
            }
         }
         if (self.cfg.pinPopup === 'appartment') {
            marker.on('click', onClick);

            function onClick(e) {
               var popup = e.target.getPopup();
               var content = popup.getContent();

               self.checkFavorite(content);
            }
         }
      });
      if (self.cfg.groupMarkers) {
         this.map.addLayer(this.clusters);
         this.createClustersEvents(); 
      }   
   },
   createPopup: function(data) {
         var tmp;
         var wrap = document.createElement('div');

         wrap.classList.add('pin-popup');

         if (this.cfg.pinPopup === 'appartment') {
            tmp = document.createElement('div');
            tmp.classList.add('leaflet-popup-card')

            tmp.innerHTML = '' +
            '<div class="event-item">'+
            '<a href="' + data.href + '" class="event-item-img">'+
               '<strong class="event-price">$' + this.formatPrice(data.price) + '</strong>'+
               '<img src="'+ data.pic + '" alt="' + data.title + '">'+
               '<span class="event-location">'+
                  '<i class="icon-pin"></i>' + data.location + '</span>'+
            '</a>'+
            '<div class="event-item-content">'+
               '<div class="event-item-content-head">'+
                  '<h3><a href="#">' + data.title + '</a></h3>'+
                  '<a href="#" class="event-favorites" data-id="' + data.id + '">'+ 
                     '<i class="icon-star-outline"></i>'+
                  '</a>'+
               '</div>'+
               '<ul class="event-contact">'+
                  '<li><i class="icon-apartments"></i>' + data.complex + '</li>'+
                  '<li><i class="icon-pin"></i>' + data.address + '</li>'+
               '</ul>'+
            '</div>'+
            '<ul class="event-option">'+
               '<li><a href="#"><i class="icon-area"></i>' + data.size + '</a></li>'+
               '<li><a href="#"><i class="icon-bed"></i>' + data.rooms + '</a></li>'+
               '<li><a href="#"><i class="icon-shower"></i>' + data.baths + '</a></li>'+
               '<li><a href="#"><i class="icon-floor"></i>' + data.floor + '</a></li>'+
            '</ul>'+
         '</div>'
         } else if (this.cfg.pinPopup === 'address') {
            tmp = document.createElement('div');

            tmp.classList.add('leaflet-popup-contact');
            tmp.innerHTML = ''+
               '<h2>' + data.title + '</h2>'+
               '<address>' + data.address + '</address>'
         }
         wrap.appendChild(tmp);
         //this.setFavorite(wrap);
         return (wrap);
   },
   checkFavorite: function(el) {
      var button = el.querySelector('.event-favorites')
      var favStorage = localStorage.getItem('favorites');
      var favId = [];
      
      if (favStorage) {
         favId = JSON.parse(localStorage.getItem('favorites'));
      }
     
      if (button.getAttribute('data-id') && checkId(button.getAttribute('data-id'))) {
         button.classList.add('active');
      }

      function checkId(id) {
         var res = false;

         favId.forEach(function(item) {
            if (item === id) {
               res = true;
            }
         })

         return res;
      }
   },
   setFavorite: function(el) {
      var cards = document.querySelectorAll('.event-list .event-favorites');
      var button = el.querySelector('.event-favorites');
      var favStorage = localStorage.getItem('favorites');
      var favId = [];
      var counter = document.querySelectorAll('.favorites-link span');
      if (favStorage) {
         favId = JSON.parse(localStorage.getItem('favorites'));
         setOnLoad();
      }
     
      button.addEventListener('click', function(e) {
         e.preventDefault();

         var listCard = document.querySelector('.event-list  .event-favorites[data-id="' + button.getAttribute('data-id') + '"]');

         if (!e.currentTarget.classList.contains('active') && button.getAttribute('data-id')) {
            e.currentTarget.classList.add('active');
            if (listCard) {
               listCard.classList.add('active');
            }
            favorites.add(button.getAttribute('data-id'));
         } else if (e.currentTarget.classList.contains('active') && button.getAttribute('data-id')) {
            e.currentTarget.classList.remove('active');
            if (listCard) {
               listCard.classList.remove('active');
            }
            favorites.remove(button.getAttribute('data-id'));
         }

         for (var a = 0; a < counter.length; a++) {
            counter[a].innerHTML = '(' + favId.length + ')';
         }       
      })
      
      function setOnLoad() {
         if (button.getAttribute('data-id') && checkId(button.getAttribute('data-id'))) {
            button.classList.add('active');
         }
      }

      function checkId(id) {
         var res = false;

         favId.forEach(function(item) {
            if (item === id) {
               res = true;
            }
         })

         return res;
      }

      function setlocalStorageItem(el) {
         localStorage.setItem('favorites', JSON.stringify(el));
      }

      var favorites = {
         add: function(id) {
            if (favStorage) {
               favId = JSON.parse(localStorage.getItem('favorites'));
            }
            favId.push(id);
            setlocalStorageItem(favId);
         },
         remove: function(id) { 
            if (favId) {
               if (favStorage) {
                  favId = JSON.parse(localStorage.getItem('favorites'));
               }
               favId.forEach(function(item,i) {
                  if(id === item) {
                     console.log(item)
                     favId.splice(i, 1);
                  }
               })
               setlocalStorageItem(favId);
            }
         }
      }
   },
   createClustersEvents: function() {
      var self = this;

      this.clusters.on('clustermouseover', function(a) {
        a.propagatedFrom.bindTooltip(self.getClusterPrice(a.layer.getAllChildMarkers()), {
          sticky: false,
          direction: 'top'
        }).openTooltip();}).on('clustermouseout', function(a) {
          a.propagatedFrom.unbindTooltip();
      });
      
    },
    getClusterPrice: function(items) {
      var arr = [];
      var min = 0;
      var max = 0;
      var price;

      items.forEach(function(item) {
        arr.push(item.options.price);
      })
      return ('$' + this.formatPrice(Math.min.apply(null, arr)) + ' - ' + '$' + this.formatPrice(Math.max.apply(null, arr))); 
   },
   formatPrice: function(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
   },
   createDistricts: function () {
      var self = this;

      $.getJSON(this.districtsGeo, function (data) {
         L.geoJson(data, { style: self.cfg.style }).addTo(self.map);
      });
   },
   createMapEvents: function() {
      var self = this;
      var i;

      document.addEventListener("DOMContentLoaded", function() {
         self.mapCnt.addEventListener('mouseover', function(e) {
            if (i !== e.target && self.dataLayers) {
               if (!(e.target.closest('.leaflet-marker-pane'))) {
                  self.dataLayers.eachLayer(function(layer){
                     layer._path.classList.remove('hover');
                   }); 
                   e.target.classList.add('hover');
               }
            }
            i = e.target;
         })
       });
      
   },
   drawDistricts: function () {
      var self = this;
      var layers = [];
      this.dataLayers;

      $.getJSON(this.districtsGeo, function (data) {
         self.dataLayers = L.geoJSON(data, {
            filter: function(feature,layer){
               //return checkLayer(feature); 
               return true;
            },
            style: function (feature, layer) {
               return self.cfg.distStyle.inactive;
            },
            onEachFeature: function (feature, layer) {
               var label = L.marker(layer.getBounds().getCenter(), {
                  icon: L.divIcon({
                    className: 'leaflet-district-label',
                    html: feature.properties.Title_reg_,
                    iconSize: [100, 40]
                  })
                }).addTo(self.map);
               layers.push(layer);

               layer.on('mouseover', function () {
                 layer.bringToFront()
               });

               layer.on('click', function (e) {
                  clearActive()
                  layer._path.classList.add('active');
                  if (self.cfg.districtsButton && checkActive()) {
                     self.districtsBtn.classList.add('active');
                     self.distBtnState = true;
                  }
               });
             }
         }).addTo(self.map);
      });

      function checkLayer(feature, layer) {
         var res = false;

         districts.forEach(function (district, i) {
            if (feature.properties.Title_reg_ === district.name) {
               res = true;
            }
         });
         return res;
      }

      function checkActive() {
        var res = false;

        self.dataLayers.eachLayer(function(layer){
          if (layer._path.classList.contains('active')) {
            res = true;
          }
        }); 
        return res;
      }

      function clearActive() {
        self.dataLayers.eachLayer(function(layer){
          layer.setStyle(self.cfg.distStyle.inactive);
          layer._path.classList.remove('active');
        }); 
      }
   },
   resetDistricts: function() {
     var self = this;

     this.dataLayers.eachLayer(function(layer){
        layer.setStyle(self.cfg.distStyle.inactive);
        layer._path.classList.remove('active');
    }); 
   },
   createSubwayStations: function() {
      var self = this;

      $.getJSON(this.subway, function (data) {
         data.lines.forEach(function(item) {
            createStation(item);
         }) 
      });
      
      function createStation(line) {
         line.stations.forEach(function(item) {
            var station = L.marker(item.coords, {
               icon: L.divIcon({
                  className: 'leaflet-subway-station',
                  html: '<i class="icon-underground" style="color: #'+ line.hex_color +'"></i>',
                  iconSize: [30, 30]
               })
            }).addTo(self.map).on('click', function(e) {
               // console.log(item.name);
           });
         });
      }
   }
}