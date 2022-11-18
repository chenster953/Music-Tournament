// competitors selectors
const ten = document.querySelector('.ten');
const twenty = document.querySelector('.twenty');
const fifty = document.querySelector('.fifty');
const hundred = document.querySelector('.hundred');

// search list selectors
const searchBox = document.querySelector('.searchbox');
const searchButton = document.querySelector('.searchbutton');
const list = document.querySelector('.list');
const viewlist = document.querySelector('.viewlist');
const savedList = document.querySelector('.savedlist');

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
let competitors = 0;
ten.addEventListener('click', ()=> {
  fetch('https://accounts.spotify.com/api/token', authParameters)
  .then(res => res.json())
  .then(data => {
    accessToken = data.access_token;
  })
  competitors = 10;
});
twenty.addEventListener('click', ()=> {
  fetch('https://accounts.spotify.com/api/token', authParameters)
  .then(res => res.json())
  .then(data => {
    accessToken = data.access_token;
  })
  competitors = 20;
});
fifty.addEventListener('click', ()=> {
  fetch('https://accounts.spotify.com/api/token', authParameters)
  .then(res => res.json())
  .then(data => {
  })
  competitors = 50;
});
hundred.addEventListener('click', ()=> {
  fetch('https://accounts.spotify.com/api/token', authParameters)
  .then(res => res.json())
  .then(data => {
    accessToken = data.access_token;
  })
  competitors = 100;
});

// controls
searchBox.addEventListener('keypress', (e)=> {
  if (e.key === 'Enter') {
    search();
  }
});
searchButton.addEventListener('click', ()=> {
  search();
})
let savedAlbums = [];
let newSavedAlbums;
let albumsList = [];
let savedCount = 0;
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
  list.innerHTML = ''
  albums.forEach((album)=> {
    const listItem = document.createElement('div');
    listItem.classList.add('listitem');
    listItem.innerHTML = `
    <img src=${album.images[0].url}>
    <h1>${album.name}</h1>
    <h3>${album.release_date}</h3>
    <h4><a href=${album.external_urls.spotify}>Spotify Link</a></h4>
    <button class=${album.id} onclick="
      albumsList.push(this.className); 
      this.innerHTML = 'Added';
      const newAlbumName = document.createElement('li');
      newAlbumName.innerText = '${album.artists[0].name} - ${album.name}';
      savedList.appendChild(newAlbumName);
      savedCount++;
      if (savedCount != 0 && savedCount == competitors) {
        console.log('here') 
       }
      ">+</button>`;
    list.appendChild(listItem);
  })
};
viewlist.addEventListener('click', ()=> console.log(albumsList));

const left = document.querySelector('.left');
const right = document.querySelector('.right');
const next = document.querySelector('.continue');

let i = 0;

next.addEventListener('click', async ()=> {
  const searchParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }}
  for (let i= 0; i < albumsList.length; i++) {
    await fetch('https://api.spotify.com/v1/albums/' + albumsList[i], searchParameters)
      .then(res => res.json())
      .then(data => {
        savedAlbums.push({
          image: data.images[0].url,
          name: data.name,
          date: data.release_date,
          tracks: data.total_tracks,
          artist: data.artists[0].name,
          link: data.external_urls.spotify
        });
      });
  };
  // SHUFFLE SAVED ALBUMS ARRAY
  let shuffle = function(arr) {
    let newPos, temp;
    for (let i = arr.length - 1; i > 0; i--) {
      newPos = Math.floor(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[newPos];
      arr[newPos] = temp;
    }
    return savedAlbums;
  };
  newSavedAlbums = shuffle(savedAlbums);
  renderMatchups();
});

left.addEventListener('click', ()=> {
  newSavedAlbums.splice(1,1);
  renderMatchups();
})
right.addEventListener('click', ()=> {
  newSavedAlbums.splice(0,1);
  renderMatchups();
})

function renderMatchups () {
  if (savedAlbums.length <= 1) {
    const winnerAlbum = document.querySelector('.winneralbum');
    const winnerTitle = document.querySelector('.winnertitle');
    const winnerArtist = document.querySelector('.winnerartist');
    const winnerLink = document.querySelector('.winnerlink');
    winnerAlbum.innerHTML = `<img src="${newSavedAlbums[0].image}"/>`;
    winnerTitle.innerHTML = newSavedAlbums[0].name;
    winnerArtist.innerHTML = newSavedAlbums[0].artist;
    winnerLink.innerHTML = `<h4><a href=${newSavedAlbums[0].link}>Spotify Link</a></h4>`;
  } else {
    left.innerHTML = `
    <img src="${newSavedAlbums[0].image}"/>
    <h1>${newSavedAlbums[0].name}</h1>
    <h3>${newSavedAlbums[0].date}</h3>
    <h4>Total Tracks: ${newSavedAlbums[0].tracks}</h4>
    `
    right.innerHTML = `
    <img src="${newSavedAlbums[1].image}"/>
    <h1>${newSavedAlbums[1].name}</h1>
    <h3>${newSavedAlbums[1].date}</h3>
    <h4>Total Tracks: ${newSavedAlbums[1].tracks}</h4>
    `
  }
}


const test1 = document.querySelector('.test');
test1.addEventListener('click', ()=> {
  console.log(savedAlbums);
  setTimeout(() => {
    console.log(newSavedAlbums);
  }, 1000);
})

// STYLE & ADD ANCHORTAGS & REQUIRED FIELDS
// SPOTIFY LINKS OPEN NEW WINDOW