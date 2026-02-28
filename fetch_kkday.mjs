import https from 'https';
import http from 'http';
import fs from 'fs';

const url = "https://www.kkday.com/zh-tw/blog/61627/kkday-self-guided-trip-sop";

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        // Extract text from paragraphs
        const paragraphs = data.match(/<p[^>]*>(.*?)<\/p>/g) || [];
        const headings = data.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g) || [];
        let text = headings.join('\n') + '\n\n' + paragraphs.join('\n');
        text = text.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\n\s*\n/g, '\n');
        fs.writeFileSync('kkday_content.txt', text);
        console.log("Successfully fetched KKday content. Saved to kkday_content.txt.");
        console.log("Length: " + text.length + " characters.");
    });
}).on('error', (err) => {
    console.error("Error fetching KKday:", err);
});
