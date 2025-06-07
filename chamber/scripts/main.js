document.addEventListener('DOMContentLoaded', function() {

    const apiKey = 'c361c5c24d6b1847ed10198170de5ce5';
    const lat = -3.73186;
    const lon = -38.5267;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const spotlightContainer = document.querySelector('.spotlight-grid');
    const directoryContainer = document.querySelector('.directory-section article');
    
    async function getMembers() {
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching member data:', error);
        }
    }

    function displaySpotlights(members) {
        const highLevelMembers = members.filter(m => m.membershipLevel === "Gold" || m.membershipLevel === "Silver");
        const shuffled = highLevelMembers.sort(() => 0.5 - Math.random());
        const numToDisplay = Math.floor(Math.random() * 2) + 2;
        const selected = shuffled.slice(0, numToDisplay);
        
        selected.forEach(member => {
            const card = document.createElement('section');
            card.classList.add('spotlight-card', 'card');
            card.innerHTML = `<img src="${member.image}" alt="Logo for ${member.name}" loading="lazy"><h3>${member.name}</h3><p class="address">${member.address}</p><p class="phone">${member.phone}</p><a href="${member.website}" target="_blank">Visit Website</a><p class="membership-level ${member.membershipLevel.toLowerCase()}">${member.membershipLevel} Member</p>`;
            spotlightContainer.appendChild(card);
        });
    }

    function displayAllMembers(members) {
        members.forEach(member => {
            const memberSection = document.createElement('section');
            memberSection.innerHTML = `<img src="${member.image}" alt="Logo of ${member.name}" loading="lazy"><h3>${member.name}</h3><p>${member.address}</p><p>${member.phone}</p><a href="${member.website}" target="_blank">Visit Website</a><p class="membership-level ${member.membershipLevel.toLowerCase()}">${member.membershipLevel} Member</p>`;
            directoryContainer.appendChild(memberSection);
        });
    }

    async function fetchWeather() {
        try {
            const response = await fetch(weatherApiUrl);
            if (!response.ok) throw new Error(`Weather fetch error! status: ${response.status}`);
            const data = await response.json();
            const weatherInfoContainer = document.getElementById('weather-info');
            if (weatherInfoContainer) {
                const temp = data.main.temp.toFixed(0);
                const description = data.weather[0].description;
                const iconCode = data.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                weatherInfoContainer.innerHTML = `<img src="${iconUrl}" alt="${description}"><p class="temp">${temp}°C</p><p>${description}</p>`;
            }
        } catch (error) { console.error('Error fetching current weather:', error); }
    }
    
    async function fetchForecast() {
        try {
            const response = await fetch(forecastApiUrl);
            if (!response.ok) throw new Error(`Forecast fetch error! status: ${response.status}`);
            const data = await response.json();
            const forecastContainer = document.getElementById('weather-forecast');
            if (forecastContainer) {
                const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
                forecastContainer.innerHTML = '';
                dailyForecasts.forEach(forecast => {
                    const date = new Date(forecast.dt * 1000);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const temp = forecast.main.temp.toFixed(0);
                    const forecastElement = document.createElement('div');
                    forecastElement.classList.add('forecast-day');
                    forecastElement.innerHTML = `<p><strong>${dayName}:</strong> ${temp}°C</p>`;
                    forecastContainer.appendChild(forecastElement);
                });
            }
        } catch (error) { console.error('Error fetching forecast:', error); }
    }
    
    if (spotlightContainer) {
        getMembers().then(data => {
            if (data) displaySpotlights(data.members);
        });
        fetchWeather();
        fetchForecast();
    }

    if (directoryContainer) {
        const gridbutton = document.querySelector("#grid");
        const listbutton = document.querySelector("#list");
        
        getMembers().then(data => {
            if (data) displayAllMembers(data.members);
        });

        if (gridbutton && listbutton) {
            gridbutton.addEventListener("click", () => {
                directoryContainer.classList.add("grid");
                directoryContainer.classList.remove("list");
            });
            listbutton.addEventListener("click", () => {
                directoryContainer.classList.add("list");
                directoryContainer.classList.remove("grid");
            });
        }
    }
    
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) currentYearElement.textContent = new Date().getFullYear();
    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) lastModifiedElement.textContent = document.lastModified;
});