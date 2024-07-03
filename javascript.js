"use strict";

const API = "3.0."; // Replace with your actual API key

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");

const btnEl = document.querySelector(".btn_search");

const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");

const dayInfoEl = document.querySelector(".day_info");

const listContentEl = document.querySelector(".list_content ul");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Display the current day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// Display the date as "21 June 2024"
const formattedDate = "21 June 2024";
dateEl.textContent = formattedDate;

// Add event listener for search button
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  // Check if input field is not empty
  if (inputEl.value !== "") {
    const search = inputEl.value.trim();
    inputEl.value = "";

    findLocation(search);
  } else {
    console.log("Chennai");
  }
});

async function findLocation(name) {
  try {
    const result = await fetchWeatherData(name, API);

    // Clear previous content
    iconsContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    listContentEl.innerHTML = "";

    if (result.cod === 200) {
      const imageContent = displayImageContent(result);
      iconsContainer.insertAdjacentHTML("afterbegin", imageContent);

      const rightSideContent = displayRightSideContent(result);
      dayInfoEl.insertAdjacentHTML("afterbegin", rightSideContent);

      displayForecast(result.coord.lat, result.coord.lon);
    } else {
      const message = `
        <h2 class="weather_temp">${result.cod}</h2>
        <h3 class="cloudtxt">${result.message}</h3>
      `;
      iconsContainer.insertAdjacentHTML("afterbegin", message);
    }
  } catch (error) {
    console.error("Error fetching the weather data:", error);
    const errorMessage = `
      <h2 class="weather_temp">Error</h2>
      <h3 class="cloudtxt">${error.message}</h3>
    `;
    iconsContainer.insertAdjacentHTML("afterbegin", errorMessage);
  }
}

async function fetchWeatherData(name, apiKey) {
  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}`;
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
}

// Function to display image content and temperature
function displayImageContent(data) {
  return `
    <img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }@2x.png" alt="" />
    <h2 class="weather_temp">${Math.round(data.main.temp - 273.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>
  `;
}

// Function to display right side content (name, humidity, wind speed, etc.)
function displayRightSideContent(data) {
  return `
    <div class="content">
      <p class="title">NAME</p>
      <span class="value">${data.name}, ${data.sys.country}</span>
    </div>
    <div class="content">
      <p class="title">TEMP</p>
      <span class="value">${Math.round(data.main.temp - 273.15)}°C</span>
    </div>
    <div class="content">
      <p class="title">HUMIDITY</p>
      <span class="value">${data.main.humidity}%</span>
    </div>
    <div class="content">
      <p class="title">WIND SPEED</p>
      <span class="value">${data.wind.speed.toFixed(2)} Km/h</span>
    </div>
  `;
}

// Function to display forecast (optional, depending on your implementation)
function displayForecast(latitude, longitude) {
  // Implement your forecast display logic here, using latitude and longitude
  // This function is assumed to be implemented separately based on your needs.
}
