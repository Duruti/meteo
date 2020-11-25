let debug = false;


// https://home.openweathermap.org/
const KEYAPI = '91d441805ebfaedeb9e8e538894bc254';
let lat = 44.97 //47.50;
let lon = 3.45 //6.86;
let date = new Date();
let day = new Date().getDay();
const week= ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
let hours = new Date().getHours();
var options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
date = date.toLocaleDateString('fr-FR', options);
let dataMeteo
// connect()
 let iconPath = `ressources/jour/01d.svg`
 let logo = document.querySelector('.logo');
 logo.style.backgroundImage =`url(${iconPath})`

let input = document.querySelector('.inputAdresse')
let title = document.querySelector('.title')
let form = document.querySelector('#form')
let nameCity ="";
let population,cityContext

console.log(title.classList.contains('title'));
form.addEventListener('submit',(e)=>{
   e.preventDefault()
   console.dir(input.value)
   searchMap(input.value)
  
})

if (navigator.geolocation){
   navigator.geolocation.getCurrentPosition(position =>{
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    //  console.dir(lat)
    title.innerText = `${lat} et ${lon}`
      console.dir(position)
      //start()
      },
      ()=>alert("Vous avez désactivé la geolocalisation, vous ne pourrez pas utiliser la position de votre appareil")
       )
}

function start(){

   debug ? init():searchGPS()
}
//connect()
//
function init(){
   today()
   initDays()
}
function searchGPS(){
  console.log(lon,lat)
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`)
  // fetch("https://api-adresse.data.gouv.fr/reverse/?lon=2.37&lat=48.357")
   .then(r => r.json())
   .then(data =>{
      let d = data.features[0]
      nameCity = d.properties.city
      cityContext = d.properties.context
      population = d.properties.population
      lat = d.geometry.coordinates[1];
      lon = d.geometry.coordinates[0];
      title.innerText= `Météo à ${nameCity}`
      console.log("Ville :")
      console.dir(data)
      console.log(`
      ${nameCity}, departement ${cityContext}, avec ${population} habitants
      `)
      connect();
   })
   .catch(error =>{
      console.log('Il y a eu un putain problème avec l\'opération fetch: ' + error.message);
      title.innerText= `Error`
      console.dir(error)})
}
function searchMap(city){
   fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
   .then(r => r.json())
   .then(data =>{
      let d = data.features[0]
      nameCity = d.properties.city
      cityContext = d.properties.context
      population = d.properties.population
      lat = d.geometry.coordinates[1];
      lon = d.geometry.coordinates[0];
      title.innerText= `Météo à ${nameCity}`
      console.log("Ville :")
      console.dir(data)
      console.log(`
      ${nameCity}, departement ${cityContext}, avec ${population} habitants
      `)
      connect();
   })
   .catch(error =>{
      console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
      console.dir(error)})

}

function connect(){
   fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${KEYAPI}&exclude=minutely`)
   .then(response => response.json())
   .then( data => {
      console.log(data);
      dataMeteo = data;
      let textHours = document.querySelector('.hours')
      textHours.innerText = `Heure: ${hours} H`
      let textDate = document.querySelector('.date')
      textDate.innerText = `${date}`
      let temp = document.querySelector('.temp')
      temp.innerText = `Temperature : ${Math.trunc(dataMeteo.current.temp)}°`
      let ciel = document.querySelector('.ciel')
      ciel.innerText = `${dataMeteo.current.weather[0].description}`
      let iconPath = `ressources/jour/${dataMeteo.current.weather[0].icon}.svg`
      let logo = document.querySelector('.logo');
      logo.style.backgroundImage =`url(${iconPath})`

      console.dir(data)
      today(data.hourly)
      initDays(data.daily)
   });
}
function today(hourly){
   hours = new Date().getHours();
   let today = document.querySelector('.today')
   today.innerHTML = ""
   let time = hours
   const stepHour = 3
   for (let i=0 ; i<(24) ;i+=stepHour){
      let temp = debug? i:Math.trunc(hourly[i].temp)
      let icons = ['01d','02d','03d','04d','09d','10d','11d','50d']
      let v = `<div class="cardDay">
                  <div class="day">${time} H</div>
                  <div class="dayWeather logo"></div>
                  <div class="tempMin">${temp}°</div>
               </div>`
      today.insertAdjacentHTML('beforeend',v);
      time += stepHour
      if (time>24) time=time-24;
      if (time===24) time = 0
      // logo
      let path = debug? '01d':hourly[i].weather[0].icon

      today.lastChild.children[1].style.backgroundImage = `url(ressources/jour/${path}.svg)`
   }
}

function initDays(daily){
   day = new Date().getDay();
   let days = document.querySelector('.days')
   days.innerHTML = ""
   day += 1;
   if (day>6) day=0;
   for (let i=1 ; i<8 ;i++){
      let tempMin = debug? i:daily[i].temp.min
      let icons = ['01d','02d','03d','04d','09d','10d','11d','50d']
      let v = `<div class="cardDay">
      <div class="day">${week[day]}</div>
      <div class="dayWeather logo"></div>
      <div class="tempMin">min: ${Math.trunc(tempMin)}°</div>
      </div>`
      days.insertAdjacentHTML('beforeend',v);
      day += 1
      if (day>6) day=0;
      // logo
      let path = debug? '02d':daily[i].weather[0].icon
      days.lastChild.children[1].style.backgroundImage = `url(ressources/jour/${path}.svg)`
   }
}