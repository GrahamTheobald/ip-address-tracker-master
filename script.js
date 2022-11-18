const dataDivs = document.querySelectorAll("[data-in]")
const input = document.querySelector("[data-input]")
const form = document.querySelector("[data-form]")

const API_KEY = 'e08a37d7f9d54287b031e8df856a534a'
const GEO_URL = 'https://api.ipgeolocation.io/ipgeo?'

const DIVS = {
  IP: "ip", 
  LOCATION: "location", 
  ISP: "isp", 
  TIMEZONE:"timezone"}

var map = L.map('map', {zoomControl: false})

form.addEventListener("submit", e => {
  e.preventDefault()
  render()
})

async function render() {
  const searchTerm = input.value
  const data = await apiCall(searchTerm)
  if (!data) return
  populate(data)
  setMap(data.latitude, data.longitude)
}

async function apiCall(search = '') {
  try {
    const response = await fetch(`${GEO_URL}apiKey=${API_KEY}&ip=${search}`)
    if (response.status === 404 || response.status === 403) return false
    return await response.json()
  } 
  catch(error) {
    console.log(error)
    return false
  }
}

function setMap(latitude, longitude) {
  map.setView([latitude, longitude], 17);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var myIcon = L.icon({
    iconUrl: './images/icon-location.svg',
  })
  
  L.marker([latitude, longitude], {icon: myIcon}).addTo(map);
  }

function populate(data) {
  const {
    ip, 
    city, 
    continent_code, 
    zipcode, 
    isp, 
    time_zone: {offset}} = data

    dataDivs.forEach(div => {
      if (div.dataset.in === DIVS.IP) {
        div.innerText = ip
      }
      else if (div.dataset.in === DIVS.ISP) {
        div.innerText = isp
      }
      else if (div.dataset.in === DIVS.LOCATION) {
        div.innerText = `${city}, ${continent_code} \n ${zipcode}`
      }
      else if (div.dataset.in === DIVS.TIMEZONE) {
        div.innerText = `UCT -${offset < 10 ? '0'+ offset : offset}:00`
      }
    })
}

render()