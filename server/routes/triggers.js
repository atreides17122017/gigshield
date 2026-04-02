import express from 'express';
import db from '../db.js';
import axios from 'axios';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY || 'dummy_key';
const AQI_KEY = process.env.AQI_KEY || 'dummy_key';

router.get('/status', async (req, res) => {
  try {
    const city = req.query.city || 'Delhi';
    
    let rain = 0;
    let temp = 0;
    let aqi = 0;
    let fallbackUsed = false;

    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${OPENWEATHER_KEY}&units=metric`;
        const response = await axios.get(weatherUrl, { timeout: 3000 });
        rain = response.data.rain?.['1h'] || 0;
        temp = response.data.main?.temp || 0;
    } catch(e) { fallbackUsed = true; }

    try {
        const aqiUrl = `https://api.waqi.info/feed/${city}/?token=${AQI_KEY}`;
        const aqiResponse = await axios.get(aqiUrl, { timeout: 3000 });
        aqi = aqiResponse.data?.data?.aqi || 0;
    } catch(e) { fallbackUsed = true; }

    // Fallbacks if APIs are actually dead
    if (fallbackUsed) {
        rain = rain || 65;
        temp = temp || 32;
        aqi = aqi || 320;
    }

    res.json({
        success: true,
        message: fallbackUsed ? 'Fallback invoked due to API issues' : 'Live telemetry fetched',
        data: {
          city,
          rainfall: rain,
          temperature: temp,
          aqi: aqi,
          status: fallbackUsed ? 'fallback' : 'live',
          warning: fallbackUsed ? 'Live APIs slow or unstable. Running on baseline mock metrics.' : null,
          last_updated: 'Just now'
        }
    });

  } catch (error) {
    console.error('Trigger Status Endpoint Failed', error);
    // Extremely safe fallback explicitly guaranteed not to crash
    res.json({
      success: true,
      message: 'Emergency Fallback Array',
      data: { city: 'Fallback Zone', rainfall: 65, temperature: 32, aqi: 320, status: 'fallback', last_updated: 'Just now' }
    });
  }
});

router.get('/log', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.query('SELECT zone_id FROM users WHERE id = ?', [userId]);
    
    const [logs] = await db.query('SELECT * FROM triggers_log WHERE zone_id = ? ORDER BY recorded_at DESC LIMIT 20', [users[0].zone_id]);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed logging generic trigger stats' });
  }
});

export default router;
