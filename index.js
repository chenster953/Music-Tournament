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

searchBox.addEventListener('keypress', (e)=> {
  if (e.key === 'Enter') {
    search();
  }
});
searchButton.addEventListener('click', ()=> {
  search();
})
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
  .then(data => searchedAlbums.push(data.items))
  // display albums to list
  console.log(searchedAlbums)
}