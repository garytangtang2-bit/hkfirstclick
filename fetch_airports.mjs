import fs from 'fs';
import https from 'https';

https.get('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const airports = JSON.parse(data);
            const filtered = [];
            for (const key in airports) {
                const a = airports[key];
                // Only include airports with IATA codes to keep size small (~9000 entries)
                if (a.iata && a.iata !== '\\N' && a.iata !== '') {
                    filtered.push({
                        code: a.iata,
                        city: a.city,
                        name: a.name,
                        country: a.country
                    });
                }
            }
            fs.mkdirSync('public', { recursive: true });
            fs.writeFileSync('public/airports.json', JSON.stringify(filtered));
            console.log(`Saved ${filtered.length} airports to public/airports.json.`);
        } catch (e) {
            console.error(e);
        }
    });
}).on('error', err => console.error(err));
