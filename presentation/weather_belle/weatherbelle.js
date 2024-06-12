const apiKey = '1da183f71d1b58d9a76f882b6308d319';

        // Fetch current location and display weather when page loads
        window.onload = function() {
            //check to see if the browser supports geolocation
            if (navigator.geolocation) {
                //requests the current position
                navigator.geolocation.getCurrentPosition(async function(position) {
                    // extract latitude and longitude from the position object
                    const { latitude, longitude } = position.coords;
                    // fetch weather data using the user's current coordinates
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
                    // parse the response JSON data
                    const data = await response.json();
                    // display weather data for the current location
                    displayCurrentLocation(data);
                });
            } else {
                // log an error message if geolocation is not supported
                console.error("Geolocation is not supported by this browser.");
            }
        }

        function getWeather() {
         // gets the value from the input field entered by the user   
            const locationInput = document.getElementById('location-input').value.trim();
            // validates the input to ensure it only contains letters and spaces
            if (!locationInput.match(/^[a-zA-Z\s]+$/)) {
                // If the validation fails, show an alert to the user
                alert('Please enter a city name');
                return;
            }

            // Fetch the weather data for the entered location
            fetchWeatherData(locationInput);
        }

         // fetch weather data from the OpenWeatherMap API using the provided location
        async function fetchWeatherData(location) {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
            // parse the JSON response from the API
            const data = await response.json();
            // display the fetched weather data
            displayWeather(data);
        }

        function displayWeather(data) {
            // extracts the city name, temperature, and weather condition ID from the data object, 
            //then updates specific DOM elements to display the city name, temperature, and the appropriate weather icon.
            const location = data.name;
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const weatherId = data.weather[0].id;
            const iconClass = `owf-${weatherId}`;
            const recommendation = getRecommendation(temperature, weatherId);

            //updates the text content of the DOM element with ID to display info
            document.getElementById('location').textContent = location;
            document.getElementById('temperature').textContent = `${temperature}°C`;
            document.getElementById('description').textContent = "";
            const weatherIcon = document.getElementById('weather-icon');
            weatherIcon.className = `owf ${iconClass} icon-large`;
            document.getElementById('recommendation').textContent = recommendation;
        }
        
        // extracts the city name, temperature, and weather condition ID from the data object, 
        //then updates specific DOM elements to display the city name, temperature, and the appropriate weather icon.
        function displayCurrentLocation(data) {
            const location = data.name;
            const temperature = data.main.temp;
            const weatherId = data.weather[0].id;
            const iconClass = `owf-${weatherId}`;

            document.getElementById('current-location').textContent = location;
            document.getElementById('current-temp').textContent = `${temperature}°C`;
            const currentWeatherIcon = document.getElementById('current-weather-icon');
            currentWeatherIcon.className = `owf ${iconClass} icon-large`;
        }


        //provides clothing and accessory recommendations based on the temperature and weather conditions
        function getRecommendation(temp, weatherId) {
            let recommendation = '';

            if (temp < 10) {
                recommendation = 'It\'s quite cold! Wear a warm coat, scarf, and gloves.';
            } else if (temp < 20) {
                recommendation = 'A bit chilly. A jacket or sweater would be a good choice.';
            } else if (temp < 30) {
                recommendation = 'Nice weather! Light clothing is recommended.';
            } else if (temp >= 30) {
                recommendation = 'It\'s hot outside! Stay cool with shorts and a t-shirt. Remember to stay hydrated!';
            }

            if (weatherId >= 200 && weatherId < 600) {
                recommendation += ' Don\'t forget to carry an umbrella!';
            }

            return recommendation;
        }
        
        // retrieves the current time, formats it into a specific string format, and then updates the corresponding DOM element to display
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.getElementById('current-time').textContent = `${timeString}`;
        }

        // updates the time every second
        setInterval(updateTime, 1000);

        // Initial call to set the time immediately when page loads
        updateTime();