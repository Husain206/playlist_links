const fs = require('fs');
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const PLID = process.env.PLAYLIST_ID;

async function fetchPlaylist(playlistId, apiKey) {
  let nextPageToken = "";
  let urls = [];

  do {
    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}&pageToken=${nextPageToken}`
    );
    const data = await res.json();

    const pageUrls = data.items.map(
      item => `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
    );
    urls.push(...pageUrls);

    nextPageToken = data.nextPageToken || "";
  } while (nextPageToken);

  return urls;
}

fetchPlaylist(PLID, API_KEY)
  .then(urls => fs.writeFileSync('songs.txt', urls.join('\n')));
