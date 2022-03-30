var requestURL = "https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c";

// // GET URL DATA BY XHR
// xhr = new XMLHttpRequest();
// xhr.open('GET', requestURL, true);
// xhr.send();
// xhr.onload = function () {
//   console.log(JSON.parse(xhr.responseText));
// };

// var administrative_area = [];
var administrativeAreas_obj = {};
// GET URL DATA BY FETCH AND SAVE ADMINISTRATIVE AREA

fetch(requestURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
      var resText = myJson.data.XML_Head.Infos.Info;
      for (var i = 0; i < resText.length; i++) {
          var zipcode = resText[i].Zipcode;
            var str = resText[i].Add;
            var areaStr = str.split(/(\d){3}/)[2].split(/區/)[0] + '區';
        //   if (administrative_area.indexOf(areaStr) == -1) {
        //       administrative_area.push(areaStr);
        //     }
          if (typeof administrativeAreas_obj.zipcode === 'undefined') {
              administrativeAreas_obj[zipcode] = areaStr;
          }
      }
      localStorage.setItem('administrativeAreas_obj', JSON.stringify(administrativeAreas_obj));
      localStorage.setItem('allData', JSON.stringify(resText));
  });

var areas = JSON.parse(localStorage.getItem('administrativeAreas_obj'));

// js load drawdownlist data 
for (let index of Object.entries(areas)) {
    var area_selection = document.createElement('option');
    area_selection.textContent = index[1];
    area_selection.value = index[0];
    var select_bar = document.querySelector('.header__selection');
    select_bar.appendChild(area_selection);
}

var allData = JSON.parse(localStorage.getItem('allData'));
// drawdownlist data change
var selected = document.querySelector('#areaId');
selected.addEventListener('change', getInfo, false);

function getInfo(e) {
    var select_area = e.target.value;
    var area_title = document.querySelector('.content__title');
    area_title.textContent = areas[select_area];
    var listStr = "";
    for (const index of allData) {
        if (index.Zipcode === select_area) {
            listStr += '<div class="content__detail"> <div class="detail__top"><img src=' + index.Picture1 + '> <div class="detail__place"><p class="detail__name">' +
                index.Name+'</p ><p class="detail__location">'+areas[select_area]+'</p></div></div> <div class="detail__opentime"><img src="images/icons_clock.png" alt="" class="detail__opentimeImg"><p class="detail__opentimeText">' +
                index.Opentime + '</p ></div><div class="detail__address"><img src="images/icons_pin.png" alt="" class="detail__addressImg"><p class="detail__addressText">' +
                index.Add + '</p ></div><div class="detail__phonenticket"><div class="detail__phone"><img src="images/icons_phone.png" alt="" class="detail__phoneImg"><p class="detail__phoneText">' +
                index.Tel + '</p ></div><div class="detail__ticket"><img src="images/icons_tag.png" alt="" class="detail__ticketImg"><p class="detail__ticketText">' +
                index.Ticketinfo + '</p ></div></div></div>';
        }
        
    }
    var content_lists = document.querySelector('.content__lists');
    content_lists.innerHTML = listStr;
}