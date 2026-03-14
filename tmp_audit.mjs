// Script to audit which cityPhotos keys exist in cityDataTranslations
// Run with: node tmp_audit.mjs

import { cityPhotos } from './src/data/cityPhotos.ts';

// We can't easily import TS from a .mjs directly, so let's just manually
// define the mapping and check it.

// The new cityPhotos keys (English lowercase):
const cityPhotoKeys = Object.keys({
    "hongkong": 1, "bangkok": 1, "tokyo": 1, "paris": 1, "london": 1,
    "singapore": 1, "newyork": 1, "dubai": 1, "rome": 1, "barcelona": 1,
    "seoul": 1, "taipei": 1, "osaka": 1, "kyoto": 1, "sydney": 1,
    "amsterdam": 1, "venice": 1, "prague": 1, "kualalumpur": 1, "vienna": 1,
    "berlin": 1, "madrid": 1, "lisbon": 1, "athens": 1, "hochiminhcity": 1,
    "stockholm": 1, "copenhagen": 1, "munich": 1, "brussels": 1, "zurich": 1,
    "toronto": 1, "losangeles": 1, "sanfrancisco": 1, "riodejaneiro": 1,
    "buenosaires": 1, "melbourne": 1, "auckland": 1, "capetown": 1,
    "marrakech": 1, "cairo": 1, "sapporo": 1, "fukuoka": 1, "hakone": 1,
    "okinawa": 1, "lasvegas": 1, "chicago": 1, "miami": 1, "seattle": 1,
    "edinburgh": 1, "florence": 1, "nice": 1, "santorini": 1, "reykjavik": 1,
    "bali": 1,
});

console.log("Total cityPhotos keys:", cityPhotoKeys.length);
console.log(cityPhotoKeys);
