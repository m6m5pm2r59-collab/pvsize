const form = document.getElementById('calc-form');
const resultsSection = document.getElementById('results');
const resultsLoading = document.getElementById('results-loading');
const resultsContent = document.getElementById('results-content');
const locateBtn = document.getElementById('locate-btn');
const addressInput = document.getElementById('address');
const latInput = document.getElementById('latitude');
const lonInput = document.getElementById('longitude');

// Geolocation button
locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by your browser. Please enter your address manually.');
    return;
  }
  locateBtn.disabled = true;
  locateBtn.textContent = 'Locating...';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      latInput.value = pos.coords.latitude.toFixed(6);
      lonInput.value = pos.coords.longitude.toFixed(6);
      addressInput.value = `Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`;
      locateBtn.textContent = 'Location Found';
      locateBtn.style.background = '#059669';
      locateBtn.style.color = 'white';
      locateBtn.style.borderColor = '#059669';
    },
    (err) => {
      alert('Could not get location. Please enter your address manually.');
      locateBtn.disabled = false;
      locateBtn.textContent = 'Use My Location';
    },
    { timeout: 10000 }
  );
});

// Geocode address to lat/lon using free Nominatim API
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length === 0) throw new Error('Address not found');
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

// Form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('calculate-btn');
  btn.disabled = true;
  btn.textContent = 'Calculating...';

  resultsSection.style.display = 'block';
  resultsLoading.style.display = 'block';
  resultsContent.style.display = 'none';
  resultsSection.scrollIntoView({ behavior: 'smooth' });

  try {
    const roofArea = parseInt(document.getElementById('roof-area').value);
    const panelWattage = parseInt(document.getElementById('panel-wattage').value);
    let lat, lon;

    if (latInput.value && lonInput.value) {
      lat = parseFloat(latInput.value);
      lon = parseFloat(lonInput.value);
    } else {
      const coords = await geocodeAddress(addressInput.value);
      lat = coords.lat;
      lon = coords.lon;
    }

    // Call Vercel serverless function which wraps PVWatts API
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon, roofArea, panelWattage })
    });

    if (!response.ok) throw new Error('Calculation failed');
    const data = await response.json();

    renderResults(data, roofArea, panelWattage, addressInput.value);
  } catch (err) {
    if (err.message === 'Address not found') {
      alert('Address not found. Try entering an English address (e.g. "Chengdu, Sichuan, China") or click "Use My Location" for automatic GPS coordinates.');
    } else {
      alert('Error: ' + err.message + '. Please check your inputs and try again.');
    }
    resultsSection.style.display = 'none';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Calculate My Solar Potential';
  }
});

function renderResults(data, roofArea, panelWattage, address) {
  resultsLoading.style.display = 'none';
  resultsContent.style.display = 'block';

  const usableArea = roofArea * 0.75;
  const panelArea = panelWattage / 19; // ~19 W/sq ft for modern panels
  const panelCount = Math.floor(usableArea / panelArea);
  const systemKW = (panelCount * panelWattage / 1000).toFixed(1);
  const annualKWh = data.annual_kwh || Math.round(systemKW * data.solar_hours * 365);
  const annualSavings = Math.round(annualKWh * 0.15);
  const installCost = Math.round(systemKW * 2500); // ~$2.5/W installed
  const payback = (installCost / annualSavings).toFixed(1);
  const co2Offset = Math.round(annualKWh * 0.00092 * 100) / 100; // tons CO2

  document.getElementById('result-address').textContent = 'Location: ' + address;
  document.getElementById('result-panels').textContent = panelCount;
  document.getElementById('result-kw').textContent = systemKW + ' kW system';
  document.getElementById('result-energy').textContent = annualKWh.toLocaleString();
  document.getElementById('result-co2').textContent = co2Offset + ' tons CO₂ offset';
  document.getElementById('result-savings').textContent = '$' + annualSavings.toLocaleString();

  document.getElementById('breakdown-area').textContent = roofArea + ' sq ft (' + Math.round(usableArea) + ' sq ft usable)';
  document.getElementById('breakdown-panel').textContent = panelWattage + 'W panels';
  document.getElementById('breakdown-capacity').textContent = systemKW + ' kW';
  document.getElementById('breakdown-production').textContent = annualKWh.toLocaleString() + ' kWh/year';
  document.getElementById('breakdown-co2').textContent = co2Offset + ' metric tons/year';
  document.getElementById('breakdown-cost').textContent = '$' + installCost.toLocaleString() + ' (estimated installed)';
  document.getElementById('breakdown-payback').textContent = payback + ' years';
}
