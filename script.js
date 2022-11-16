const mapDiv = document.querySelector("[data-map]")
const dataDivs = document.querySelectorAll("[data-in]")
const input = document.querySelector("[data-input]")
const submit = document.querySelector("[data-submit]")

const API_KEY = 'e08a37d7f9d54287b031e8df856a534a'
const GEO_URL = 'https://api.ipgeolocation.io/ipgeo?'

const DIVS = {
  IP: "ip", 
  LOCATION: "location", 
  ISP: "isp", 
  TIMEZONE:"timezone"}

submit.addEventListener("click", async () => {
  const searchTerm = input.value
  const data = await apiCall(searchTerm)
  if (!data) return
  populate(data)
})

async function apiCall(search) {
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