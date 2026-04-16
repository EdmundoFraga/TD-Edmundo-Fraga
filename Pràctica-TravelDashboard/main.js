const cities = {
  barcelona: {
    name: "Barcelona",
    country: "España",
    lat: 41.3851,
    lon: 2.1734,
    currency: "EUR"
  },
  london: {
    name: "London",
    country: "Inglaterra",
    lat: 51.5072,
    lon: -0.1276,
    currency: "GBP"
  },
  paris: {
    name: "Paris",
    country: "Francia",
    lat: 48.8566,
    lon: 2.3522,
    currency: "EUR"
  },
  newyork: {
    name: "New York",
    country: "EU",
    lat: 40.7128,
    lon: -74.0060,
    currency: "USD"
  },
  tokyo: {
    name: "Tokyo",
    country: "Japon",
    lat: 35.6762,
    lon: 139.6503,
    currency: "JPY"
  }
};

const selector = document.getElementById("citySelector");

function loadSelector() {
  for (let key in cities) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = cities[key].name;
    selector.appendChild(option);
  }
}

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation_probability`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      temp: data.current.temperature_2m,
      rain: data.current.precipitation_probability
    };
  } catch (error) {
    console.error("Error weather:", error);
  }
}

function getRainMessage(prob) {
  if (prob < 20) return "☀️ Sin lluvia";
  if (prob < 50) return "🌦️ Posible lluvia";
  return "🌧️ Alta probabilidad de lluvia";
}

async function convertCurrency(amount, currency) {
  const url = `https://api.exchangerate-api.com/v4/latest/EUR`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const rate = data.rates[currency];
    return amount * rate;
  } catch (error) {
    console.error("Error currency:", error);
  }
}

async function updateDashboard(cityKey) {
  const city = cities[cityKey];

  document.getElementById("summary").innerHTML = "Carregant...";
  document.getElementById("weather").innerHTML = "";

  const weather = await getWeather(city.lat, city.lon);

  document.getElementById("summary").innerHTML = `
    <h2>${city.name}, ${city.country}</h2>
    <p>🌡️ ${weather.temp}°C</p>
    <p>💱 Moneda: ${city.currency}</p>
  `;

  document.getElementById("weather").innerHTML = `
    <h3>Temps</h3>
    <p>${getRainMessage(weather.rain)}</p>
  `;

  let msg = "";

  if (weather.temp < 10) {
    msg = "🧥 Hace frio, lleva chaqueta!";
  } else if (weather.temp > 25) {
    msg = "😎 Hace calor, ideal para pasear!";
  } else {
    msg = "🌤️ Buen tiempo par visitar la ciudad!";
  }

  document.getElementById("message").textContent = msg;
}

selector.addEventListener("change", () => {
  updateDashboard(selector.value);
});

document.getElementById("convertBtn").addEventListener("click", async () => {
  const amount = document.getElementById("amount").value;
  const city = cities[selector.value];

  if (!amount) return;

  const result = await convertCurrency(amount, city.currency);

  document.getElementById("result").textContent =
    `${amount} EUR = ${result.toFixed(2)} ${city.currency}`;
});

loadSelector();
updateDashboard("barcelona");