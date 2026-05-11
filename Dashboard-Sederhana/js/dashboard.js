import { dataTracking } from "./data.js";
import { initTheme } from "./theme.js";

initTheme();

const greetings = document.querySelector('.greetings');
const dropdown = document.querySelector('.dropdown')
const dropdownOption = document.querySelector('.option');
const tbody = document.querySelector('.tracking-info')
const searchInput = document.querySelector('#name-search')
const searchBtn = document.querySelector('.track-search')

const greetUser = document.createElement('h2');
greetings.appendChild(greetUser);
const hour = new Date().getHours();

function activeDropdown() {
    dropdownOption.style.display = 'flex';
}

function morningGreetings(){
    greetUser.textContent = 'Selamat Pagi!'
}

function afternoonGreetings(){
    greetUser.textContent = 'Selamat Siang!'
}

function eveningGreetings(){
    greetUser.textContent = 'Selamat Malam!'
}


dropdown.addEventListener('click', ()=>{
    dropdownOption.classList.toggle('active');
    
})

if (hour < 12) {
  morningGreetings();
} else if (hour < 18) {
  afternoonGreetings();
} else {
  eveningGreetings();
}

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  const result = dataTracking[query];

  if (result) {
    displayResult(result);
  } else {
    alert('Nomor DO tidak ditemukan');
  }
});



function displayResult (user){
    tbody.innerHTML = '';
        const tr = document.createElement('tr') 
        tr.innerHTML = `<td>${user.nama}</td>
        <td>${user.nomorDO}</td>
        <td>${user.status}</td>
        <td>${user.ekspedisi}</td>  
        <td>${user.tanggalKirim}</td>
        <td>${user.paket}</td>
        <td>${user.total}</td>`;
    tbody.appendChild(tr)
}


