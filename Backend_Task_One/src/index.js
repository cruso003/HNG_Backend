const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Task 1 Response</title>
            </head>
            <body>
                <p>Kindly click this link:</p>
                <p><a href="https://hng-backend-awmi-dvxxabzyz-cruso003s-projects.vercel.app/api/hello">https://hng-backend-awmi-dvxxabzyz-cruso003s-projects.vercel.app/api/hello</a></p>
                <p> to see task 1 response.</p>
            </body>
        </html>
    `);
});

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name ? decodeURIComponent(req.query.visitor_name) : 'Mark';
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '8.8.8.8';
    console.log(`Client IP: ${clientIp}`);

    try {
        const geoRes = await axios.get(`https://ipapi.co/${clientIp}/json/`);
        console.log(geoRes.data);
        const location = geoRes.data.city || 'Kampala';
        const latitude = geoRes.data.latitude || '0.3195080739328954';
        const longitude = geoRes.data.longitude || '32.59220969763057';
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
