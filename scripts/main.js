// Pour debugger

let debug = false;


// https://home.openweathermap.org/

const KEYAPI = '91d441805ebfaedeb9e8e538894bc254';

// Recupere les éléments
let input = document.querySelector('.inputAdresse')
let title = document.querySelector('.title')
let title2 = document.querySelector('.title2')
let form = document.querySelector('#form')
let logo = document.querySelector('.logo');

// Initialise les variables
let lat = 0;
let lon = 0;
let date = new Date();
let day = new Date().getDay();
const week= ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
let hours = new Date().getHours();
let population,cityContext
let nameCity ="";



// Pour rechercher la commune avec un rayon
let r = 0.01
let angle = 0
let isOK = false
let nbIteration = 1

// Evement sur le bouton envoyer du formulaire
form.addEventListener('submit',(e)=>{
   e.preventDefault()
   searchMap(input.value)
})

// Au chargement de la page on récupere la géolocalisation
if (navigator.geolocation){
   navigator.geolocation.getCurrentPosition(position =>{
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      //  console.dir(lat)
      title.innerText = `${lat} et ${lon}`
      console.dir(position)
      start()
   },
   ()=>alert("Vous avez désactivé la geolocalisation, vous ne pourrez pas utiliser la position de votre appareil"
   ))
}

initFirtPage();



// Les fonctions



function start(){
   isOK = false
   debug ? initDebug():searchGPS(lon,lat)
}
function initFirtPage(){
   let options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
   date = date.toLocaleDateString('fr-FR', options);
   // let iconPath = `ressources/jour/50d.svg`
   // logo.style.backgroundImage =`url(${iconPath})`
}
function initDebug(){
   
   today()
   initDays()
}
function searchGPS(pLon,pLat){
    // recherche avec les coordonnée gps
//   console.log(pLon,pLat)
   if (isOK) return;
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${pLon}&lat=${pLat}`)
   .then(r => r.json())
   .then(data =>{
      console.log("data with searchGPS")
     // console.dir(data)
      getData(data)
      connect();
      isOK=true;
   })
   .catch(error =>{
      console.log('Il y a eu un putain problème avec l\'opération fetch: ' + error.message);
      title.innerText= `Searching`
      let x = lon + r*Math.cos(angle)
      let y = lat + r*Math.sin(angle)
      angle += Math.PI/8 // prend 16 points sur le cercle
      if (angle>=(2*Math.PI)) {
         angle = 0;
         r += 0.01 // augmente de 0.01 le rayon lorsqu'on a fait le tour du cercle
      }
      console.log('iteration: '+nbIteration)
      nbIteration += 1
      searchGPS(x,y)
      // console.dir(error)
   })
}
function searchMap(city){
   // recherche avec la ville
   fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
   .then(r => r.json())
   .then(data =>{
      console.log("data with searchMap")
      getData(data)
      connect();
   })
   .catch(error =>{
      console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
      console.dir(error)})

}
function getData(data){
   // Actualise le front avec les données

   let d = data.features[0]
   nameCity = d.properties.city
   cityContext = d.properties.context
   population = d.properties.population
   lat = d.geometry.coordinates[1];
   lon = d.geometry.coordinates[0];
   title.innerText= `Météo à ${nameCity}` 
   title2.innerText = `en ${nbIteration} itération`
   console.log("Ville :")
   console.log(`
   ${nameCity}, departement ${cityContext}, avec ${population} habitants
   `)
   console.dir(data)
}
function connect(){
   // Connection a l'Api de météo

   fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${KEYAPI}&exclude=minutely`)
   .then(response => response.json())
   .then( data => {

      // Actualise la carte de la journée
      let textHours = document.querySelector('.hours')
      textHours.innerText = `Heure: ${hours} H`
      let textDate = document.querySelector('.date')
      textDate.innerText = `${date}`
      let temp = document.querySelector('.temp')
      temp.innerText = `Temperature : ${Math.round(data.current.temp)}°`
      let ciel = document.querySelector('.ciel')
      ciel.innerText = `${data.current.weather[0].description}`
      let iconPath = `ressources/jour/${data.current.weather[0].icon}.svg`
      let logo = document.querySelector('.logo');
      logo.style.backgroundImage =`url(${iconPath})`

      // Actualise les informations pour la journée et pour la semaine 
      today(data.hourly)
      initDays(data.daily)
   });
}
function today(hourly){
   // Actualise le resumé pour la journée

   let time = new Date().getHours();
   let today = document.querySelector('.today')
   today.innerHTML = ""
   const stepHour = 3
   for (let i=0 ; i<(24) ;i+=stepHour){
      let temp = debug? i:Math.round(hourly[i].temp)
      let v = `<div class="cardDay">
                  <div class="day">${time} H</div>
                  <div class="dayWeather logo"></div>
                  <div class="tempMin">${temp}°</div>
               </div>`
      today.insertAdjacentHTML('beforeend',v);
      time += stepHour
      if (time>24) time=time-24;
      if (time===24) time = 0
      // Actualise le logo
      let path = debug? '50d':hourly[i].weather[0].icon
      today.lastChild.children[1].style.backgroundImage = `url(ressources/jour/${path}.svg)`
   }
}
function initDays(daily){
   // Actualise les données pour la semaine 

   day = new Date().getDay();
   let days = document.querySelector('.days')
   days.innerHTML = ""
   day += 1; // commence au jour suivant
   if (day>6) day=0; // reboucle la semaine
   for (let i=1 ; i<8 ;i++){
      let tempMin = debug? i:daily[i].temp.min
      let v = `<div class="cardDay">
      <div class="day">${week[day]}</div>
      <div class="dayWeather logo"></div>
      <div class="tempMin">min: ${Math.round(tempMin)}°</div>
      </div>`
      days.insertAdjacentHTML('beforeend',v);
      day += 1
      if (day>6) day=0;
      // actualise le logo
      let path = debug? '02d':daily[i].weather[0].icon
      days.lastChild.children[1].style.backgroundImage = `url(ressources/jour/${path}.svg)`
   }
}