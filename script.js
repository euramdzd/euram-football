
let APIkey = "54005a89d767a637e08895f2008dd5764d00e3d6f4c36822f451ae2186e09f87";

// 1 - دخول في موقع https://allsportsapi.com/

// 2 - انشاء حساب و أخد key خاص بنتائج كرة قدم 

// 3 - شهر فقط من استخدام مجاني لهدا   API


// من أجل معرفة تاريخ اليوم

var today = new Date();

var Dat_e = ` ${today.getDate()} / ${today.getMonth()+1} / ${today.getFullYear()} `

document.querySelector('.date span').innerHTML = Dat_e;

let d = ` ${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} `

// جلب قائمة مباريات اليوم

fetch('https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey='+APIkey+'&timezone=Africa/Algiers&from='+d+'&to='+d)
.then(res=>res.json())
.then(res=>{
  let match = res.result;
  let country = match.filter(i => i.country_name != "Israel" ).map(i => i.country_name) // تحديد دول مقام فيها مباريات
  // ارجاع  دول بدون تكرار
    country = [...new Set(country)]

  country = country.map(i => `<option value="${i}">${i}</option>`).join('')

  document.getElementById('country').innerHTML = country
  let m  = ""
  for(let i=0;i<match.length;i++){
    m  += `<div class="box" data-country="${match[i].country_name}" data-id="${match[i].event_key}">
              <p>${match[i].event_status ? match[i].event_status : match[i].event_time}</p>
              <p><img src="${match[i].away_team_logo}" class="logo" alt="-"> ${match[i].event_away_team}</p>
              <p style="direction: rtl;">${match[i].event_final_result}</p>
              <p><img src="${match[i].home_team_logo}" class="logo" alt="-">${match[i].event_home_team}</p>
          </div>`
  }
  document.querySelector('.match').innerHTML = m;
  // console.log(match)

let optionSelect = document.querySelector("#country");
let arrBoxMatch = document.querySelectorAll(".match .box")

if(localStorage.getItem('country')){
  showMatch(localStorage.getItem('country') , arrBoxMatch)
  optionSelect.value = localStorage.getItem('country') 

}else{
showMatch(optionSelect.value , arrBoxMatch)

}

optionSelect.onchange = () => {
  showMatch(optionSelect.value , arrBoxMatch)
  localStorage.setItem('country',optionSelect.value)
}

showDetails(arrBoxMatch ,match);

}).catch(err => "err")


function showMatch(country , arr){
    arr.forEach(i=>{
      i.classList.remove('hidd')
      }
    )
    arr.forEach(i => {
    if(country != i.getAttribute('data-country')){
      i.classList.add("hidd")
    }      
    });

}

function showDetails(arr , arrMatch){
  arr.forEach(i=>{
    i.onclick=()=>{
      let match;
      arrMatch.forEach(j=>{
        if(j.event_key == (+i.getAttribute("data-id"))){
          match = j;
        }
      })

      //احصائيات
      let statistics = match.statistics;
      let Attacks          = statistics.filter(i => i.type=="Attacks")          .map(i => `<div><p>${i.away}</p><p>  هجمات</p><p>${i.home}</p></div>`).join('')

      let DangerousAttacks = statistics.filter(i => i.type=="Dangerous Attacks").map(i => `<div><p>${i.away}</p><p>هجمات خطيرة</p><p>${i.home}</p></div>`).join('')

      let Saves            = statistics.filter(i => i.type=="Saves")           .map(i => `<div><p>${i.away}</p><p> التصديات</p><p>${i.home}</p></div>`).join('')

      let YellowCard       = statistics.filter(i => i.type=="Yellow Cards")     .map(i => `<div><p>${i.away}</p><p>البطاقات صفراء</p><p>${i.home}</p></div>`).join('')

      let OnTarget         = statistics.filter(i=> i.type=="On Target")         .map(i => `<div><p>${i.away}</p><p>تسديدات على مرمي</p><p>${i.home}</p></div>`).join('') 

      let OffTarget       =  statistics.filter(i=> i.type=="Off Target")        .map(i => `<div><p>${i.away}</p><p>تسديدات خارج مرمى</p><p>${i.home}</p></div>`).join('')

      let Fouls           =  statistics.filter(i=>i.type=="Fouls")               .map(i => `<div><p>${i.away}</p><p>  الاخطاء</p><p>${i.home}</p></div>`).join('')

      let Corners         =  statistics.filter(i=>i.type=="Corners")              .map(i => `<div><p>${i.away}</p><p>  ركنيات</p><p>${i.home}</p></div>`).join('')

      let BallPossession  =  statistics.filter(i=>i.type=="Ball Possession")      .map(i => `<div><p>${i.away}</p><p>  الاستحواد</p><p>${i.home}</p></div>`).join('')
      //بطاقات
      let boxCardsA = match.cards.filter(i => i.home_fault.length > 0 ).map(i=>`<p> ${i.time} <span>${i.home_fault}</span> <span class="${i.card}"></span></p>`)
      let boxCardsB = match.cards.filter(i => i.home_fault.length <= 0 ).map(i=>`<p> ${i.time} <span>${i.away_fault}</span> <span class="${i.card}"></span></p>`)

      // الاهداف
      let boxGolA = match.goalscorers.filter(i=>i.home_scorer.length > 0).map(i=>`<p> ${i.time} <span>${i.home_scorer}</span>  <span style="background: white;width: 15px;height: 15px;display: inline-block;border-radius: 50%;"><img src="football.png"width="15" height="15"></span></p>`)
      let boxGolB = match.goalscorers.filter(i=>i.home_scorer.length <= 0).map(i=>`<p> ${i.time} <span>${i.away_scorer}</span> <span style="background: white;width: 15px;height: 15px;display: inline-block;border-radius: 50%;"><img src="football.png" width="15" height="15"/> <span></p>`)

      document.querySelector('.container').innerHTML +=`
      <div class="box-match">
        <div class="match-details">
        <div class="close"><a href='index.html'>X</a></div>
        <div style="    max-height: 500px;overflow-y: auto;  padding: 20px;  position: relative;        overflow-x: hidden;">
          <div class="header">
          <img src=${match.country_logo} class="country">
          ${match.league_logo?`<div style="background: var(--main-color);border-radius: 6px;margin: 55px 0 10px 0;display: flex;align-items: center;justify-content: center;"><img src="${match.league_logo}" class="leaguelogo"></div>` : ""}
          <p>${match.league_name}</p>
          <div class="box" data-country="${match.country_name}" data-id="${match.event_key}">
              <p>${match.event_status}</p>
              <p><img src="${match.away_team_logo}" class="logo" alt="-"> ${match.event_away_team}</p>
              <p style="direction: rtl;">${match.event_final_result}</p>
              <p><img src="${match.home_team_logo}" class="logo" alt="-">${match.event_home_team}</p>
          </div>
          <div class="cards">
          <div>${boxCardsB.join('')}${boxGolB.join('')}</div>
          <div>${boxCardsA.join('')}${boxGolA.join('')}</div>
          </div>
          <div class="stats">
          ${Attacks}
          ${DangerousAttacks}
          ${OnTarget}
          ${OffTarget}
          ${Saves}
          ${Fouls}
          ${YellowCard}
          ${Corners}
          ${BallPossession}
          </div>
          <div class="infomatch">
          <p >
          <span>حكم المباراة</span>
          ${match.event_referee.length > 0 ? match.event_referee : "حكم غير معروف"}
          </p>
          <p>
          <span>ملعب المباراة</span>
          ${match.event_stadium.length > 0 ? match.event_stadium: "ملعب غير معروف"}
          </p>
          </div>
          </div>
          </div>
        </div>
      </div>
      `
    }
  })
}
