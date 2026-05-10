const greetings = document.querySelector('.greetings');
const dropdown = document.querySelector('.dropdown')
const dropdownOption = document.querySelector('.option');

const greetUser = document.createElement('h2');
greetings.appendChild(greetUser);
const hour = new Date().getHours();

function activeDropdown() {
    dropdownOption.style.display = 'flex';
}

function morningGreetings(){
    greetUser.textContent = 'Selamat Pagi!'
}

function eveningGreetings(){
    greetUser.textContent = 'Selamat Malam!'
}


dropdown.addEventListener('click', ()=>{
    dropdownOption.classList.toggle('active');
    
})

if (hour < 12){
    morningGreetings();
} else {
    eveningGreetings();
}

console.log(new Date())
