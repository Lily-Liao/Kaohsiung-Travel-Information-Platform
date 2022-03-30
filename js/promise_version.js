const requestURL = "https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c";

let data = [];
let administrativeAreas_obj = {};

fetch(requestURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        var resText = myJson.data.XML_Head.Infos.Info;
        let data = resText;
        // get all zone data from this api response
        for (var i = 0; i < resText.length; i++) {
            var zipcode = resText[i].Zipcode;
            var str = resText[i].Add;
            var areaStr = str.split(/(\d){3}/)[2].split(/區/)[0] + '區';
            if (typeof administrativeAreas_obj.zipcode === 'undefined') {
                administrativeAreas_obj[zipcode] = areaStr;
            }
        }
        // add zone data to dropdownlist
        for (let index of Object.entries(administrativeAreas_obj)) {
            var area_selection = document.createElement('option');
            area_selection.textContent = index[1];
            area_selection.value = index[0];
            var select_bar = document.querySelector('.header__selection');
            select_bar.appendChild(area_selection);
        }

        // get selected zone info
        function getInfo(e) {
            if (!(e.target.nodeName == "BUTTON" || e.target.nodeName == "SELECT")) return
            var select_area = e.target.value;
            var area_title = document.querySelector('.content__title');
            area_title.textContent = administrativeAreas_obj[select_area];
            
            let dataList = [];
            for (const index of data) {
                if (index.Zipcode === select_area) {
                   dataList.push(index); 
                }
            }
            var current_page = 1;
            let pageSize = Math.ceil(dataList.length/4);
            console.log(pageSize)
            var content__pageBtns = document.querySelector('.content__pageBtns');
            content__pageBtns.innerHTML=''
            for (let i =0; i<= pageSize+1;i++){
                switch(i){
                    case 0:
                        var pageBtn = document.createElement('button');
                        pageBtn.setAttribute('class','content__prePage');
                        pageBtn.textContent="<<";
                        content__pageBtns.style.display = 'block';
                        content__pageBtns.appendChild(pageBtn);
                        break;
                    case (pageSize+1):
                        var pageBtn = document.createElement('button');
                        pageBtn.setAttribute('class','content__nextPage');
                        pageBtn.textContent=">>";
                        content__pageBtns.style.display = 'block';
                        content__pageBtns.appendChild(pageBtn);
                        break;
                    default:
                        var pageBtn = document.createElement('button');
                        pageBtn.setAttribute('class','content__page');
                        pageBtn.value=i;
                        pageBtn.textContent=i;
                        content__pageBtns.style.display = 'block';
                        content__pageBtns.appendChild(pageBtn);
                        break;
                }
                
                
            }
            console.log(dataList);
            function showData(current_page){
                document.querySelectorAll('.content__page').forEach(
                    (el) => {
                        el.classList.remove('content__page--active');
                        if (el.value ==current_page){
                            el.classList.add('content__page--active');
                        }
                    }
                );
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
            
            // 監聽煥頁btn
            var pageButton = document.querySelector('.content__pageBtns');
            pageButton.addEventListener('click',function(e){
                // console.log(e)
                if (e.target.nodeName !== "BUTTON") return;
                if (e.target.className == "content__prePage"){
                    
                    current_page -= 1;
                    if (current_page == 0){
                        current_page = 1;
                    }
                    showData(current_page);
                    
                }
                else if (e.target.className == "content__nextPage"){
                    
                    current_page += 1;
                    if (current_page == pageSize+1){
                        current_page = pageSize;
                    }
                    showData(current_page);
                    
                }
                else{
                    current_page = e.target.value;
                    showData(current_page);
                }
                
                
            });

           
            
        }
        // 下拉式選單監聽
        var selected = document.querySelector('#areaId');
        selected.addEventListener('change', getInfo, false);

        // 熱門行政區事件監聽
        let hotAreaBtn = document.querySelector('.hotArea__btns');
        hotAreaBtn.addEventListener('click',getInfo);

    });
    




