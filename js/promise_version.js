const requestURL = "https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c";

let administrativeAreasObj = {};

fetch(requestURL)
    .then((response) => response.json())
    .then((myJson) => {
        const resText = myJson.data.XML_Head.Infos.Info;
        // get all zone data from this api response
        resText.forEach((resData)=>{
            const {Zipcode, Add} = resData;
            const areaStr = Add.split(/(\d){3}/)[2].split(/區/)[0] + '區';
            if (typeof administrativeAreasObj.Zipcode === 'undefined') {
                administrativeAreasObj[Zipcode] = areaStr;
            }
        });
        // add zone data to dropdownlist
        for (let index of Object.entries(administrativeAreasObj)) {
            const areaSelection = document.createElement('option');
            areaSelection.textContent = index[1];
            areaSelection.value = index[0];
            const selectBar = document.querySelector('.header__selection');
            selectBar.appendChild(areaSelection);
        }

        // get selected zone info
        const getInfo = (e) => {
            if (!(e.target.nodeName === "BUTTON" || e.target.nodeName == "SELECT")) return
            const selectArea = e.target.value;
            const areaTitle = document.querySelector('.content__title');
            areaTitle.textContent = administrativeAreasObj[selectArea];
            
            let dataList = [];
            resText.forEach((data)=>{
                if (data.Zipcode === selectArea) {
                    dataList.push(data); 
                 }
            });
            let currentPage = 1;
            let pageSize = Math.ceil(dataList.length/4);
            console.log(pageSize)
            const contentPageBtns = document.querySelector('.content__pageBtns');
            contentPageBtns.innerHTML=''
            for (let i =0; i<= pageSize+1;i++){
                const pageBtn = document.createElement('button');
                switch(i){
                    case 0:
                        pageBtn.setAttribute('class','content__prePage');
                        pageBtn.textContent="<<";
                        break;
                    case (pageSize+1):
                        pageBtn.setAttribute('class','content__nextPage');
                        pageBtn.textContent=">>";
                        break;
                    default:
                        pageBtn.setAttribute('class','content__page');
                        pageBtn.value=i;
                        pageBtn.textContent=i;
                        break;
                }
                contentPageBtns.style.display = 'block';
                contentPageBtns.appendChild(pageBtn);
            }
            console.log(dataList);
            const showData = (currentPage) => {
                window.document.body.scrollTop = 0;
                window.document.documentElement.scrollTop = 0;
                document.querySelectorAll('.content__page').forEach(
                    (el) => {
                        el.classList.remove('content__page--active');
                        if (Number(el.value) === currentPage){
                            el.classList.add('content__page--active');
                        }
                    }
                );
                let listStr = "";
                for(let i = (currentPage-1)*4;i<currentPage*4;i++){
                    console.log('1.',dataList.length,i,currentPage);
                    console.log(typeof(dataList.length),typeof(i));
                    if (dataList.length === i) {break;}
                    listStr += `
                        <div class="content__detail">
                            <div class="detail__top">
                                <div class="detail__imgContainer">
                                    <img src=${dataList[i].Picture1} class="detail__img">
                                </div>
                                <div class="detail__place">
                                    <p class="detail__name">${dataList[i].Name}</p>
                                    <p class="detail__location">${administrativeAreasObj[selectArea]}</p>
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
                const contentLists = document.querySelector('.content__lists');
                contentLists.innerHTML = listStr;
            };
            showData(currentPage);
            
            // 監聽換頁btn
            const pageButton = document.querySelector('.content__pageBtns');
            pageButton.addEventListener('click',(e)=>{
                // console.log(e)
                if (e.target.nodeName !== "BUTTON") return;
                if (e.target.className === "content__prePage"){
                    
                    currentPage -= 1;
                    console.log('2.',currentPage);
                    if (currentPage === 0){
                        currentPage = 1;
                    }
                    showData(currentPage);
                    
                }
                else if (e.target.className === "content__nextPage"){
                    
                    currentPage += 1;
                    console.log('3.', currentPage);
                    if (currentPage === pageSize+1){
                        currentPage = pageSize;
                    }
                    showData(currentPage);
                    
                }
                else{
                    currentPage = Number(e.target.value);
                    showData(currentPage);
                }
                
                
            });

           
            
        };
        // 下拉式選單監聽
        const selected = document.querySelector('#areaId');
        selected.addEventListener('change', getInfo, false);

        // 熱門行政區事件監聽
        let hotAreaBtn = document.querySelector('.hotArea__btns');
        hotAreaBtn.addEventListener('click',getInfo);

    });
    




