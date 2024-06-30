const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Mark';
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '8.8.8.8';
    console.log(`Client IP: ${clientIp}`);

    try {
        const geoRes = await axios.get(`https://ipapi.co/${clientIp}/json/`);
        console.log(geoRes.data);
        const location = geoRes.data.city || 'Kampalay';
        const latitude = geoRes.data.latitude || '40.7128';
        const longitude = geoRes.data.longitude || '-74.0060';
        const tempRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        console.log(tempRes.data);
        const temperature = tempRes.data.current_weather.temperature;

        res.json({
            client_ip: clientIp,
            location: location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving location or weather data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
