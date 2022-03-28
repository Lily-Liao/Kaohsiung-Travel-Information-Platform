const requestURL = "https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c";

// GET URL DATA BY XHR
let data = [];
let administrativeAreas_obj = {};

function loadData(requestURL) {
    xhr = new XMLHttpRequest();
    xhr.open('GET', requestURL, true);
    xhr.send();
    xhr.onload = function () {
        data = JSON.parse(xhr.responseText).data.XML_Head.Infos.Info;
        // console.log(data);
        for (var i = 0; i < data.length; i++) {
            var zipcode = data[i].Zipcode;
            var str = data[i].Add;
            var areaStr = str.split(/(\d){3}/)[2].split(/區/)[0] + '區';
          if (typeof administrativeAreas_obj.zipcode === 'undefined') {
              administrativeAreas_obj[zipcode] = areaStr;
          }
      }
      for (let index of Object.entries(administrativeAreas_obj)) {
    var area_selection = document.createElement('option');
    area_selection.textContent = index[1];
    area_selection.value = index[0];
    var select_bar = document.querySelector('.header__selection');
    select_bar.appendChild(area_selection);
    }

    var selected = document.querySelector('#areaId');
    selected.addEventListener('change', getInfo, false);

    function getInfo(e) {
        var select_area = e.target.value;
        var area_title = document.querySelector('.content__title');
        area_title.textContent = administrativeAreas_obj[select_area];
        
        let dataList = [];
        for (const index of data) {
            if (index.Zipcode === select_area) {
               dataList.push(index); 
            }
        }
        let current_page = 1;
        let pageSize = Math.ceil(dataList.length/4);
        console.log(pageSize)
        var content__pageBtns = document.querySelector('.content__pageBtns');
        content__pageBtns.innerHTML=''
        for (let i =1; i<= pageSize;i++){
            var pageBtn = document.createElement('button');
            pageBtn.setAttribute('class','content__page');
            pageBtn.value=i;
            pageBtn.textContent=i;
            content__pageBtns.style.display = 'block';
            content__pageBtns.appendChild(pageBtn);
        }
        console.log(dataList);
        function showData(current_page){
            var listStr = "";
            for(let i = (current_page-1)*4;i<current_page*4;i++){
                if (dataList.length == i) {break;}
                listStr += `
                    <div class="content__detail">
                        <div class="detail__top">
                            <img src=${dataList[i].Picture1}>
                                <div class="detail__place">
                                    <p class="detail__name">${dataList[i].Name}</p>
                                    <p class="detail__location">${administrativeAreas_obj[select_area]}</p>
                                </div>
                        </div>
                        <div class="detail__opentime">
                            <img src="images/icons_clock.png" alt="" class="detail__opentimeImg">
                            <p class="detail__opentimeText">${dataList[i].Opentime}</p>
                        </div>
                        <div class="detail__address">
                            <img src="images/icons_pin.png" alt="" class="detail__addressImg">
                            <p class="detail__addressText">${dataList[i].Add}</p>
                        </div>
                        <div class="detail__phonenticket">
                            <div class="detail__phone">
                                <img src="images/icons_phone.png" alt="" class="detail__phoneImg">
                                    <p class="detail__phoneText">${dataList[i].Tel}</p>
                            </div>
                            <div class="detail__ticket">
                                <img src="images/icons_tag.png" alt="" class="detail__ticketImg">
                                <p class="detail__ticketText">${dataList[i].Ticketinfo}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            var content_lists = document.querySelector('.content__lists');
            content_lists.innerHTML = listStr;
        }
        showData(current_page);

        var pageButton = document.querySelector('.content__pageBtns');
        pageButton.addEventListener('click',function(e){
            console.log(e.target.value);
            showData(e.target.value);
        });
        
    }
    // 熱門行政區事件監聽
    let hotAreaBtn = document.querySelector('.hotArea__btns');
    hotAreaBtn.addEventListener('click',getInfo);
    };
}
loadData(requestURL);

// setTimeout(function(){
//     // console.log(data);
//     // console.log(administrativeAreas_obj);
    
// }, 3000);


// function (e) {
//     console.log(e.target.nodeName);
//     if (e.target.nodeName !== "BUTTON") return;
// }