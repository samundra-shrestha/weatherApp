

// giphy API example
// const API_KEY = 'l3RBKqTMbdpCAECt6n6Sf8V2H0aNCHXl'

// const img = document.querySelector('img');
// const btn = document.querySelector('button');
// Using fetch to get a random GIF from Giphy API
// function changeImage() {
//   fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=cats`, { mode: 'cors' })
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (response) {
//       img.src = response.data.images.original.url;
//     });
// };

// Using async/await for better readability
// async function changeImage() {
//   const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=cats`, { mode: 'cors' });
//   const catData = await response.json();
//   btn.disabled = true;
//   console.log(catData.data, );
//   if(catData.meta.status === 200)  setTimeout(()=>{btn.disabled = false}, 100);
//  img.src = catData.data.images.original.url;
// };

// changeImage();

// btn.addEventListener('click', changeImage);


// const server = {
//   people: [
//     {
//       name: "Odin",
//       age: 20,
//     },
//     {
//       name: "Thor",
//       age: 35,
//     },
//     {
//       name: "Freyja",
//       age: 29,
//     },
//   ],

//   getPeople() {

//     return new Promise((resolve, reject) => {
//       // Simulating a delayed network call to the server
//       setTimeout(() => {

//         resolve(this.people);
//       }, 2000);
//     });
//   },
// };


// function getPersonsInfo(name) {
//   return server.getPeople().then(people => {
//     return people.find(person => { return person.name === name });
//   });
// }

// getPersonsInfo("Odin").then(person => {
//   console.log("Person found:", person);
// }).catch(err => {
//   console.error("Error fetching person info:", err);
// });


// Fetching weather data for places using Visual Crossing Weather API
const API_KEY = 'L3MXYMR9MGLV5Q5YF7BU7AZK8';

const unit = 'celsius';
const defaultLocation = 'Kathmandu';
let selectedLocation;

const searchBtn = document.querySelector('.search');
const inputSearch = searchBtn.querySelector('input');


async function fetchWeatherData(places) {
  addLoader();
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${places}?unitGroup=us&key=${API_KEY}&contentType=json`, {
      "method": "GET",
      "headers": {
      }
    })
    const data = await response.json();


    if (data) {
      document.querySelectorAll('.skeleton').forEach(el => el.classList.remove('skeleton-active'));
    }

    const currentConditions = data.currentConditions;
    const currentWeatherInfo = {
      location: data.resolvedAddress,
      temperature: currentConditions.temp,
      description: currentConditions.conditions,
      icon: currentConditions.icon,
      feelsLike: currentConditions.feelslike,
      date: data.days[0].datetime,
    };

    const hourlyWeatherInfo = data.days[0].hours;
    const weeklyWeatherInfo = data.days.slice(1, 7);
     changeBackground(currentWeatherInfo.icon);
    currentDayWeather(currentWeatherInfo);
    hourlyForecast(hourlyWeatherInfo);
    weeklyForecast(weeklyWeatherInfo);
  } catch (error) {

    fetchWeatherData(defaultLocation);
  }

}




const searchInput = document.querySelector('.search button');

searchInput.addEventListener('click', () => {
  searchInput.parentElement.classList.toggle('active');
});


// current day weather DOM

function currentDayWeather(currentWeatherInfo) {
  document.querySelector('.today .current').innerHTML = "";
  const content =
    `
   <div class="location">
     <div class="place">${currentWeatherInfo.location}</div>
     <h5 class="weekday">${dayName(currentWeatherInfo.date)}</h5>
 </div>

<h5 class="weather__description">
  ${currentWeatherInfo.description}
</h5>
<div class="weather__icon">
    <img src="./icons/${currentWeatherInfo.icon}.svg" alt="">
</div>
<div class="temprature">
     <span class="temp">${tempConversion(currentWeatherInfo.temperature, unit)}°<span>${unit === 'celsius' ? 'C' : 'F'}</span></span>
     <span class="feels-like">RealFeel <span class="value">${tempConversion(currentWeatherInfo.feelsLike, unit)}°</span></span>
</div>
  `
  document.querySelector('.today .current').insertAdjacentHTML("beforeend", content);
}

// Hourly forecast

function hourlyForecast(hourlyWeatherInfo) {
  document.querySelector('.hourly .hourly__items').innerHTML = "";
  hourlyWeatherInfo.map((hour, i) => {

    const newHourContent = `
    <div class="item ${currentTime(hour.datetime)}">
      <span class="time ">${convertTo12Hour(hour.datetime)}</span>
      <div class="weather">
              <img src="./icons/${hour.icon}.svg" alt="">
             <span class="temp">${tempConversion(hour.temp, unit)}<span>°${unit === 'celsius' ? 'C' : 'F'}</span></span>
         </div>
          <span class="feels-like">RealFeel <span class="value">${tempConversion(hour.feelslike, unit)}°</span></span>
     </div>
      `
    document.querySelector('.hourly .hourly__items').insertAdjacentHTML("beforeend", newHourContent);
  });
}
const itemWeekly = document.querySelectorAll('.weekly .item');
// weekly forecast
function weeklyForecast(weeks) {

  itemWeekly.forEach(item => item.innerHTML = "");
  weeks.map((day, i) => {
    const newDayContent = `
      <div class="location">
        <h5 class="weekday">${dayName(day.datetime)}</h5>
      </div>

      <h5 class="weather__description">${day.conditions}</h5>
      <div class="weather__icon">
        <img src="./icons/${day.icon}.svg" alt="">
      </div>
      <div class="temprature">
        <span class="temp">${tempConversion(day.temp, unit)}<span>°${unit === 'celsius' ? 'C' : 'F'}</span></span>
        <span class="feels-like">RealFeel <span class="value">${tempConversion(day.feelslike, unit)}°</span></span>
      </div>
    `
    itemWeekly[i].insertAdjacentHTML("beforeend", newDayContent);
  })
}















// Helper function

// day finder comparing to number date
function dayName(dynamicDate) {
  const date = new Date(dynamicDate);
  const dayOfWeekIndex = date.getDay();

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = weekdays[dayOfWeekIndex];

  return dayName;
}

// Temp conversion function
function tempConversion(degree, unit) {
  if (unit === 'celsius') {
    const celsius = (degree - 32) * 5 / 9;
    return celsius.toFixed(1);
  }
  return degree.toFixed(1);

}

function convertTo12Hour(timeStr) {
  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
}

function currentTime(timestr) {
  const [hours] = timestr.split(':');
  const now = new Date();
  const nowHours = now.getHours();
  if (parseInt(hours) === nowHours) {
    return 'active'
  };
  return '';
}


function addLoader() {
  document.querySelectorAll('.skeleton').forEach(el => el.classList.add('skeleton-active'));
}


function changeBackground(icon){
  document.querySelector('.weather__container .bg').innerHTML="";
  const content =
   `
    <img src="./bg/${icon}.jpg" alt="">
   `
   document.querySelector('.weather__container .bg').insertAdjacentHTML("afterbegin", content);
}



window.onload = () => {
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      selectedLocation = data.city;
      fetchWeatherData(selectedLocation);
    });
}


setInterval(() => {
  fetchWeatherData(selectedLocation);
}, 60000);




inputSearch.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (inputSearch.value.length === 0) return;
    selectedLocation = inputSearch.value
    fetchWeatherData(selectedLocation);
    inputSearch.value = "";
    searchBtn.classList.remove('active');
  }
});