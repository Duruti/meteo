// https://home.openweathermap.org/
const KEYAPI = '91d441805ebfaedeb9e8e538894bc254';
let lat = 44.97 //47.50;
let lon = 3.45 //6.86;
let date = new Date();
let hours = new Date().getHours();
var options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
date = date.toLocaleDateString('fr-FR', options)
let dataMeteo
 connect()
//  let iconPath = `ressources/jour/01d.svg`
//  let logo = document.querySelector('.logo');
//  logo.style.backgroundImage =`url(${iconPath})`

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

      console.log(logo)
   });
}
