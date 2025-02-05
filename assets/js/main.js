/*show menu*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

if(navClose){
    navClose.addEventListener('click', ()=>{
        navMenu.classList.remove('show-menu')
    })
}

const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))


const shadowHeader = () =>{
    const header = document.getElementById('header')
    this.scrollY >= 50 ? header.classList.add('shadow-header') 
                       : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)

const swiperPopular = new Swiper('.popular__swiper', {
    loop: true,
    grabCursor: true,
    slidesPerView: 'auto',
    centeredSlides: 'auto',
})

const scrollUp = () =>{
    const scrollUp = document.getElementById('scroll-up')
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll'):scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)


const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () => {
    const scrollDown = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');
        const sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (sectionsClass) {
            if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link');
            } else {
                sectionsClass.classList.remove('active-link');
            }
        }
    });
};
window.addEventListener('scroll', scrollActive);

/*scroll leveal*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 300,
    reset: true, 
})

sr.reveal('.home__data, .popular__container. footer')
sr.reveal('.home__board', {delay: 700, distance: '100px', origin: 'right'})
sr.reveal('.home__pizza', {delay: 1400, distance: '100px', origin: 'bottom', rotate: {z: -90}})
sr.reveal('.home__ingredient', {delay: 2000, interval: 100})
sr.reveal('.about__data, .recipe__list .contact__data', {origin: 'right'})
sr.reveal('.about__img, .recipe__img. .contact__image', {origin: 'left'})
sr.reveal('.products__card', {interval: 100})
sr.reveal('.recipe__card', {interval: 100})


/*form validation*/
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.match(emailRegex)) {
      errorMessage.textContent = 'Please enter a valid email address';
      return;
    }
    if (password.value.length < 6) {
      errorMessage.textContent = 'Password must be at least 6 characters';
      return;
    }
    errorMessage.textContent = '';
    alert('Registration successful!');
    this.reset();
  });
  
  /*password show/hide*/
  document.getElementById('togglePassword').addEventListener('click', function() {
    const password = document.getElementById('password');
    if (password.type === 'password') {
      password.type = 'text';
      this.textContent = 'Hide';
    } else {
      password.type = 'password';
      this.textContent = 'Show';
    }
  });
/*cookies*/
document.addEventListener('DOMContentLoaded', () => {
    const cookieNotification = document.getElementById('cookie-notification');
    const acceptCookies = document.getElementById('accept-cookies');

    if (cookieNotification && acceptCookies) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieNotification.style.display = 'block';
        }

        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieNotification.style.display = 'none';
        });
    }
});


  

/*fetch pizza recipes*/
const apiKey = 'a89d2a43b54a43b790bf088fda98da14'; 
const recipesContainer = document.getElementById("recipes-container");

async function fetchPizzaRecipes() {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=pizza&number=6&apiKey=${apiKey}`);
        
        const remainingRequests = response.headers.get('X-RateLimit-Remaining');
        const resetTime = response.headers.get('X-RateLimit-Reset');
        
        if (remainingRequests === '0') {
            const resetDate = new Date(parseInt(resetTime) * 1000);
            const waitTime = resetDate - new Date(); 
            console.log(`Rate limit exceeded. Waiting until ${resetDate}`);
            await new Promise(resolve => setTimeout(resolve, waitTime)); 
        }

        const data = await response.json();
        displayPizzaRecipes(data.results);
    } catch (error) {
        console.error('Error fetching pizza recipes:', error);
    }
}


function displayPizzaRecipes(recipes) {
    recipesContainer.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        recipesContainer.innerHTML = "<p>No pizza recipes available at the moment.</p>";
        return;
    }

    recipes.forEach(async (recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        const recipeInfo = await fetchRecipeDetails(recipe.id);
        
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <a href="${recipeInfo}" target="_blank">View Recipe</a>
        `;

        recipesContainer.appendChild(recipeCard);
    });
}

async function fetchRecipeDetails(recipeId) {
    const apiKey = 'a89d2a43b54a43b790bf088fda98da14'; 

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const data = await response.json();

        return data.sourceUrl; 
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        return "#"; 
    }
}

fetchPizzaRecipes();

