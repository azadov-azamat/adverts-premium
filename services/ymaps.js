const axios = require('axios');

async function getGeolocationData(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        const address = data.address;
        // const district = address.county.substring(0, address.county.indexOf(' '));
        const district = address.county;
        const street = `${address.suburb || address.neighbourhood}, ${address?.house_number}`;
        // const city = address.city || address.town;

        return {street, district};
    } catch (error) {
        console.error('Geocode request failed:', error);
    }
}

module.exports = {getGeolocationData}

