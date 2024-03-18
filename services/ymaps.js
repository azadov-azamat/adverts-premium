const axios = require('axios');

async function fetchGeo(lat, long) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&accept-language=ru`;

    try {
        const response = await axios.get(url);
        return response.data
    } catch (error) {
        console.error('Geocode request failed:', error);
    }
}

async function getGeolocationData(latitude, longitude) {
    let data = await fetchGeo(latitude, longitude)

    const address = data.address;
    // const district = address.county.substring(0, address.county.indexOf(' '));
    const district = address.county;
    const street = `${address.suburb || address.neighbourhood}, ${address?.house_number}`;
    // const city = address.city || address.town;

    return {street, district};
}

module.exports = {getGeolocationData}

