
let APIkey = "54005a89d767a637e08895f2008dd5764d00e3d6f4c36822f451ae2186e09f87";

var today = new Date();

var Dat_e = ` ${today.getDate()} / ${today.getMonth()+1} / ${today.getFullYear()} `

document.querySelector('.date span').innerHTML = Dat_e;



// setInterval(()=>{ 
let d = ` ${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} `


let url = 'https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey='+APIkey+'&timezone=Africa/Algiers&from='+d+'&to='+d

fetch(url)
.then(res=>res.json())
.then(res=>{
  let match = res.result;
  if(!location.search){
    let country = match.filter(i => i.country_name != "Israel" && i.event_country_key!= null ).map(i => i.country_name) // تحديد دول مقام فيها مباريات
    country = [...new Set(country)]


    country.forEach((i,index)=>{
      match.forEach(j=>{
        if(j.country_name == i && j.event_country_key != null ){
          country[index] = [i,j.country_logo,j.event_country_key]
        }
      })
    })
    console.log(country)

    country = country.map((i) => `<a href="?id=${i[0]}" class="box-country">
                                    <img src="${i[1]?i[1]:'https://apiv2.allsportsapi.com/logo/logo_country/'+i[2]+'_'+i[0].toLowerCase().replaceAll(' ','-')+'.png'}"/>
                                    <span>${i[0]}</span>
                                  </a>`).join('')

    document.querySelector('.match').innerHTML = country;}
    
else{

  if(location.search.split('=')[0] == "?id"){

    let name = location.search.split('=')[1].replaceAll('%20'," ") 
    document.querySelector('.nav').classList.add("act")
    document.querySelector('.nav').innerHTML = `
          <div class="container">
          <a href="index.html">  قائمة الدول</a>
          <span> / </span>
          <a href="?id=${name}"> ${name} </a>
          </div>
          `
    let league = match.filter(i => i.country_name != "Israel" && i.country_name == name).map(i => i.league_name) // تحديد دول مقام فيها مباريات
    
    let matchCountry = match.filter(i => i.country_name != "Israel" && i.country_name == name).map(i => i) // تحديد دول مقام فيها مباريات

    league = [...new Set(league)]

    // league.sort();

    let arrM=[]
    console.log(matchCountry)
    for(let j = 0 ; j < league.length ; j++){

      let m = '';

      for(let i = 0 ; i < matchCountry.length  ; i++){

        if(matchCountry[i].league_name == league[j])

          m  += `<a class="box" href='?match=${matchCountry[i].event_key}' data-country="${matchCountry[i].country_name}" data-id="${matchCountry[i].event_key}">
                  <p>${matchCountry[i].event_status ? matchCountry[i].event_status : matchCountry[i].event_time}</p>
                  <p><img src="${matchCountry[i].away_team_logo}" class="logo" alt="-"> ${matchCountry[i].event_away_team}</p>
                  <p style="direction: rtl;">${matchCountry[i].event_final_result}</p>
                <p><img src="${matchCountry[i].home_team_logo}" class="logo" alt="-">${matchCountry[i].event_home_team}</p>
        </a>`
      } 
      arrM[j] = `<h2 class="title">${league[j]}</h2><div>${m}</div>`;
    }
    document.querySelector('.match').innerHTML = arrM.join('');
  
  }else if(location.search.split('=')[0] == "?match"){

    

    let id = location.search.split('=')[1].replaceAll('%20'," ") 

    let matchSelect = match.filter(i => i.country_name != "Israel" && i.event_key == id).map(i => i)[0]
    console.log(matchSelect)
    document.querySelector('.nav').classList.add("act") 
    document.querySelector('.nav').innerHTML = `
          <div class="container">
          <a href="index.html">  قائمة الدول</a>
          <span> / </span>
          <a href="?id=${matchSelect.country_name}"> ${matchSelect.country_name} </a>
          </div>
          `
    showDetails(matchSelect,match)

  }
}


}).catch(err =>console.log( "err"))

// },500) 



function showDetails(match , arrMatch){


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
      let boxCardsA = match.cards.filter(i => i.home_fault.length > 0 ).map(i=>`<p > <span style="color:var(--main-color); padding-right:6px">${i.time}</span> <span>${i.home_fault}</span> <span class="${i.card}"></span></p>`)
      let boxCardsB = match.cards.filter(i => i.home_fault.length <= 0 ).map(i=>`<p > <span style="color:var(--main-color); padding-right:6px">${i.time}</span> <span>${i.away_fault}</span> <span class="${i.card}"></span></p>`)

      // الاهداف
      let boxGolA = match.goalscorers.filter(i=>i.home_scorer.length > 0).map(i=>`<p class="gool" > 
                                                                                    <span>${i.time}</span> 
                                                                                    <span>${i.home_scorer}</span>  
                                                                                    <span>
                                                                                      <img src="football.png">
                                                                                    </span>
                                                                                  </p>`)
      let boxGolB = match.goalscorers.filter(i=>i.home_scorer.length <= 0).map(i=>`<p class="gool" >
                                                                                    <span>${i.time}</span>
                                                                                      <span>${i.away_scorer}</span> 
                                                                                    <span><img src="football.png"> <span>
                                                                                  </p>`)

      document.querySelector('.match').innerHTML =`

        <div class="match-details">
          <div class="header">
          <img src=${match.country_logo} class="country">
          ${match.league_logo?`<div style="background: var(--main-color);border-radius: 6px;margin: 55px 0 10px 0;display: flex;align-items: center;justify-content: center;"><img src="${match.league_logo}" class="leaguelogo"></div>` : ""}
          <p>${match.league_name}</p>
          <div class="box" data-country="${match.country_name}" data-id="${match.event_key}">
              <p>${match.event_status ? match.event_status : match.event_time}</p>
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

      `
    }

