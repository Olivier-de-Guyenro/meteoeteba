exports.handler = async (event) => {
  const p = event.queryStringParameters || {};
  const { lat, lon, start, end, past_days } = p;
  if (!lat || !lon) {
    return { statusCode: 400, body: JSON.stringify({ error: 'lat/lon requis' }) };
  }

  let url;
  if (past_days) {
    url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_mean&timezone=auto&past_days=${past_days}&forecast_days=1`;
  } else if (start && end) {
    url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=temperature_2m_mean&timezone=auto`;
  } else {
    return { statusCode: 400, body: JSON.stringify({ error: 'start/end ou past_days requis' }) };
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=7200',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
