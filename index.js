// competitors selectors
const ten = document.querySelector('.ten');
const twenty = document.querySelector('.twenty');
const fifty = document.querySelector('.fifty');
const hundred = document.querySelector('.hundred');

// add page scroll
let competitors = 0;
ten.addEventListener('click', ()=> competitors = 10);
twenty.addEventListener('click', ()=> competitors = 20);
fifty.addEventListener('click', ()=> competitors = 50);
hundred.addEventListener('click', ()=> competitors = 100);

// search list selectors
const searchBox = document.querySelector('.searchbox');
const searchButton = document.querySelector('.searchbutton');
const list = document.querySelector('.list');
const viewlist = document.querySelector('.viewlist');

// auth
const CLIENT_ID = '379e6d47191c45c29ad700947d53d268';
const CLIENT_SECRET = '0a9062fd5d014a65a91d5a2c651627f2';
const searchedAlbums = [];
let accessToken = '';

const authParameters = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
}

const next = document.querySelector('.continue')
next.addEventListener('click', ()=>{
  fetch('https://accounts.spotify.com/api/token', authParameters)
  .then(res => res.json())
  .then(data => {
    accessToken = data.access_token;
    console.log(accessToken)
  })
})


// controls
searchBox.addEventListener('keypress', (e)=> {
  if (e.key === 'Enter') {
    search();
  }
});
searchButton.addEventListener('click', ()=> {
  search();
})
let albumsList = [];
async function search() {
  const searchInput = searchBox.value;
  // get req using search to get artist ID
  const searchParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }
  const artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
    .then(res => res.json())
    .then(data => { return data.artists.items[0].id })
  // get req with artist ID to get albums from artist
  const albums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
  .then(res => res.json())
  .then(data => { return data.items })
  // display albums to list

  console.log(albums);

  albums.forEach((album)=> {
    const listItem = document.createElement('div');
    listItem.classList.add('listitem');
    listItem.innerHTML = `
    <img src=${album.images[0].url}>
    <h1>${album.name}</h1>
    <h3>${album.release_date}</h3>
    <h4><a href=${album.external_urls.spotify}>Spotify Link</a></h4>
    <button class=${album.id} onclick="albumsList.push(this.className)">+</button>`
    list.appendChild(listItem);
  })
};

viewlist.addEventListener('click', ()=> console.log(albumsList));