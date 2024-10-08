const { error } = require('console');
const express = require('express')
const app = express()
const TorrentSearchApi = require('torrent-search-api');
// Enable public providers
TorrentSearchApi.enablePublicProviders();

//ne pas modifier cette ligne 
const providers1 = TorrentSearchApi.getProviders();

let cherch = '';
let providers = [];
let cat = [];

/**
 * This function retrieves the details of a specific torrent using the provided torrent hash.
 *
 * @param {string} torrent - The hash of the torrent to retrieve details for.
 * @returns {Promise<Object>} A promise that resolves to an object containing the details of the torrent.
 * If an error occurs during the request, the promise will reject with the error.
 */
app.get('/torrents', (req, res) => {
  cherch = req.query.cherch;
  if (typeof req.query.prov !== "object") { providers.push(req.query.prov); } else { providers = req.query.prov; }
  if (typeof req.query.cat === Array) {
    if (providers.includes("Eztv") || providers.includes("TorrentProject") || providers.includes("Torrentz2") || req.query.cat === undefined) {
      cat.push("all")
    } else {
      cat = req.query.cat;
    }
  } else {
    cat = req.query.cat;
  }
  /* search torrent */
  const torrents = TorrentSearchApi.search(providers, cherch, cat, 200)
    .then(torrents => {
      console.log(torrents);
      res.status(200).json(torrents);
    })
    .catch(error => {
      console.log(error);
    });
});
/**
 * This function retrieves the details of a specific torrent using the provided torrent hash.
 *
 * @param {Object} req - The Express request object containing the query parameters.
 * @param {Object} res - The Express response object to send the result back to the client.
 * @returns {Promise<Object>} A promise that resolves to an object containing the details of the torrent.
 * If an error occurs during the request, the promise will reject with the error.
 */
/* torrent detail */
app.get('/torrent', (req, res) => {
  torrent = req.query.torrent
  const result = TorrentSearchApi.getTorrentDetails(torrent)
    .then(result => { res.status(200).json(result) })
    .catch(error => { res.status(200).json(error) })
})

/* download torrent buffer */
app.get('/downtorrent', (req, res) => {
  torrent = req.query.torrent
  const result = TorrentSearchApi.downloadTorrent(torrent)
    .then(result => { res.status(200).json(result); })
    .catch(error => { res.status(200).json(error) })
})

/* download torrent */
app.get('/downtorrentfils', (req, res) => {
  torrent = req.query.torrent
  const result = TorrentSearchApi.downloadTorrent(torrent, "tmp/" + torrent.title + ".torrent")
    .then(result => { res.status(200).json(result) })
    .catch(error => { res.status(200).json(error) })
})

app.get('/magnet', (req, res) => {
  torrent = req.query.torrent;
  const result = TorrentSearchApi.getMagnet(torrent)
    .then(result => { res.status(200).json(result) })
    .catch(error => { res.status(200).json(error) })
})

app.listen(process.env.PORT, function () {
  console.log(providers1)
})