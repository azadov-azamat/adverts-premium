const fetch = require('node-fetch');

const getGeolocationData = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        const location = {
            address: data.display_name, // To'liq manzil
            district: data.address.suburb || data.address.city_district, // Tuman
            street: data.address.road || data.address.street // Ko'cha
            // Siz qo'shimcha ma'lumotlarni ham qaytarishingiz mumkin
        };

        return location;
    } catch (error) {
        console.error('Geolocation data retrieval failed:', error);
        return null;
    }
};

// Funksiyani sinab ko'rish
const latitude = 40.712776; // Misol: New York City
const longitude = -74.005974;
getGeolocationData(latitude, longitude)
    .then(location => console.log(location))
    .catch(error => console.error(error));
