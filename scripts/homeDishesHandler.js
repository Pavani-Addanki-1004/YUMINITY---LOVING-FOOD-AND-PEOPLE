
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Version banner to help with cache-busting verification
window.__HOME_DISHES_HANDLER_VERSION__ = '2025-09-22 02:11';
try { console.log('[HomeDishesHandler]', window.__HOME_DISHES_HANDLER_VERSION__); } catch (e) {}

// Demo fallback data to avoid empty-looking sections
const demoTrending = [
    { 'DISH_ID': -101, 'DISH_NAME': 'Spicy Ramen', 'CUISINE_TYPE': 'Japanese', 'DISH_IMG_URL': 'https://3f4c2184e060ce99111b-f8c0985c8cb63a71df5cb7fd729edcab.ssl.cf2.rackcdn.com/media/15684/ramenbowls.jpg', 'DISH_INGREDIENTS': 'Ramen noodles$Broth$Chili oil$Egg$Scallions' },
    { 'DISH_ID': -102, 'DISH_NAME': 'Paneer Tikka', 'CUISINE_TYPE': 'Indian', 'DISH_IMG_URL': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToeBoVqXmwjEjpYEGK1Y1AZi964zw-iK-Vqg&s', 'DISH_INGREDIENTS': 'Paneer$Yogurt$Spices$Onion$Capsicum' },
    { 'DISH_ID': -103, 'DISH_NAME': 'Avocado Toast', 'CUISINE_TYPE': 'American', 'DISH_IMG_URL': 'https://whatsgabycooking.com/wp-content/uploads/2023/01/Master.jpg', 'DISH_INGREDIENTS': 'Sourdough$Avocado$Lemon$Chili flakes' },
    { 'DISH_ID': -104, 'DISH_NAME': 'Veggie Stir Fry', 'CUISINE_TYPE': 'Asian', 'DISH_IMG_URL': 'https://images.themodernproper.com/production/posts/VegetableStirFry_9.jpg?w=1200&h=1200&q=60&fm=jpg&fit=crop&dm=1703377301&s=79d95f7318643d92c30863f226d5eb8e', 'DISH_INGREDIENTS': 'Broccoli$Peppers$Soy sauce$Garlic$Ginger' }
];

const demoForYou = [
    { 'DISH_ID': -201, 'DISH_NAME': 'Margherita Pizza', 'CUISINE_TYPE': 'Italian', 'DISH_IMG_URL': 'https://uk.ooni.com/cdn/shop/articles/20220211142645-margherita-9920_e41233d5-dcec-461c-b07e-03245f031dfe.jpg?v=1737105431&width=1080', 'DISH_INGREDIENTS': 'Tomato$Mozzarella$Basil$Olive oil' },
    { 'DISH_ID': -202, 'DISH_NAME': 'Butter Chicken', 'CUISINE_TYPE': 'Indian', 'DISH_IMG_URL': 'https://images.immediate.co.uk/production/volatile/sites/30/2021/02/butter-chicken-ac2ff98.jpg?quality=90&resize=440,400', 'DISH_INGREDIENTS': 'Chicken$Butter$Tomato$Cream$Spices' },
    { 'DISH_ID': -203, 'DISH_NAME': 'Sushi Rolls', 'CUISINE_TYPE': 'Japanese', 'DISH_IMG_URL': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80', 'DISH_INGREDIENTS': 'Rice$Nori$Veggies$Soy sauce' }
];

const demoRecent = [
    { 'DISH_ID': -301, 'DISH_NAME': 'Greek Salad', 'CUISINE_TYPE': 'Greek', 'DISH_IMG_URL': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80', 'DISH_INGREDIENTS': 'Tomato$Cucumber$Feta$Olives$Onion' },
    { 'DISH_ID': -302, 'DISH_NAME': 'Tacos', 'CUISINE_TYPE': 'Mexican', 'DISH_IMG_URL': 'https://images.unsplash.com/photo-1543352634-8732b1c5fe2c?auto=format&fit=crop&w=800&q=80', 'DISH_INGREDIENTS': 'Tortilla$Beans$Lettuce$Salsa' },
    { 'DISH_ID': -303, 'DISH_NAME': 'Pancakes', 'CUISINE_TYPE': 'American', 'DISH_IMG_URL': 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=800&q=80', 'DISH_INGREDIENTS': 'Flour$Eggs$Milk$Maple syrup' }
];

function getDishImageSrc(dish){
    const placeholder = '../assets/images/hero-dish.png';
    const url = dish && dish["DISH_IMG_URL"] ? String(dish["DISH_IMG_URL"]).trim() : '';
    // If URL exists but points to a generic/placeholder image, treat it as missing
    const isPlaceholderUrl = (() => {
        if (!url) return true;
        const u = url.toLowerCase();
        const known = [
            'hero-dish.png',
            'default.jpg',
            'default.png',
            'placeholder',
            'fl_concept_1.png',
            'fl_logo_final.png'
        ];
        return known.some(k => u.includes(k));
    })();
    const name = (dish && dish["DISH_NAME"]) ? String(dish["DISH_NAME"]).toLowerCase() : '';
    // Simple keyword map for nicer defaults when backend doesn't provide images
    const map = [
        { k: ['pizza','margherita'], v: 'https://uk.ooni.com/cdn/shop/articles/20220211142645-margherita-9920_e41233d5-dcec-461c-b07e-03245f031dfe.jpg?v=1737105431&width=1080' },
        { k: ['butter chicken','chicken'], v: 'https://images.immediate.co.uk/production/volatile/sites/30/2021/02/butter-chicken-ac2ff98.jpg?quality=90&resize=440,400' },
        { k: ['sushi','roll'], v: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80' },
        { k: ['ramen'], v: 'https://3f4c2184e060ce99111b-f8c0985c8cb63a71df5cb7fd729edcab.ssl.cf2.rackcdn.com/media/15684/ramenbowls.jpg' },
        { k: ['paneer','tikka'], v: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToeBoVqXmwjEjpYEGK1Y1AZi964zw-iK-Vqg&s' },
        { k: ['avocado','avacado','toast'], v: 'https://whatsgabycooking.com/wp-content/uploads/2023/01/Master.jpg' },
        { k: ['salad','greek'], v: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80' },
        { k: ['taco','tacos'], v: 'https://images.unsplash.com/photo-1543352634-8732b1c5fe2c?auto=format&fit=crop&w=800&q=80' },
        { k: ['pancake','pancakes'], v: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=800&q=80' },
        { k: ['stir fry','stir-fry','veggie'], v: 'https://images.themodernproper.com/production/posts/VegetableStirFry_9.jpg?w=1200&h=1200&q=60&fm=jpg&fit=crop&dm=1703377301&s=79d95f7318643d92c30863f226d5eb8e' },
    ];
    // If the dish name matches any keyword, prefer the mapped image
    for (const m of map){
        if (m.k.some(kw => name.includes(kw))){
            try { console.debug('[DishImage] mapped', dish["DISH_NAME"], '=>', m.v); } catch(e){}
            return m.v;
        }
    }
    // Otherwise, if a non-placeholder URL was provided, use it
    if (url && url !== 'null' && url !== 'undefined' && !isPlaceholderUrl){
        try { console.debug('[DishImage] provided', dish["DISH_NAME"], '=>', url); } catch(e){}
        return url;
    }
    try { console.debug('[DishImage] fallback', dish && dish["DISH_NAME"], '=> placeholder'); } catch(e){}
    return placeholder;
}

function buildDishCard(dish){
    // Card div
    let postCard = document.createElement('div');
    postCard.id = dish["DISH_ID"];
    // Use dedicated CSS class to prevent flex shrinking and unify styling
    postCard.className = 'dish-card';
    postCard.onclick = () => {
        window.localStorage.setItem('WATCH_DISH_ID', dish["DISH_ID"]);
        window.location.href = 'dish.html'; 
    }

    // Image
    let dishImageWrapper = document.createElement('div');
    dishImageWrapper.className = 'relative';
    let dishImage = document.createElement('img');
    dishImage.className = 'dish-image';
    dishImage.src = getDishImageSrc(dish);
    dishImage.alt = dish["DISH_NAME"];
    // fallback
    dishImage.onerror = function(){ this.onerror = null; this.src = '../assets/images/hero-dish.png'; };
    // cuisine badge
    let badge = document.createElement('span');
    badge.className = 'cuisine-badge';
    badge.textContent = dish["CUISINE_TYPE"] || '';
    // like button (heart) top-right
    const likeBtn = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    likeBtn.setAttribute('viewBox', '0 0 24 24');
    likeBtn.setAttribute('class', 'absolute top-2 right-2 w-7 h-7 drop-shadow cursor-pointer');
    likeBtn.setAttribute('fill', '#FFFFFF');
    likeBtn.setAttribute('stroke', '#EC4899');
    likeBtn.setAttribute('stroke-width', '1.5');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.53C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
    likeBtn.appendChild(path);
    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLikeHome(likeBtn, dish["DISH_ID"]);
    });
    // initialize like state for logged-in user
    initializeLikeStateHome(likeBtn, dish["DISH_ID"]);

    dishImageWrapper.appendChild(dishImage);
    dishImageWrapper.appendChild(badge);
    dishImageWrapper.appendChild(likeBtn);

    // Text div
    let textDiv = document.createElement('div');
    textDiv.className = 'dish-body';
    let titleText = document.createElement('div');
    titleText.className = 'dish-title';
    titleText.textContent = dish["DISH_NAME"];
    textDiv.appendChild(titleText);
    let captionText = document.createElement('p');
    captionText.className = 'dish-desc';
    let ings = dish["DISH_INGREDIENTS"] || '';
    if (typeof ings === 'string') {
        ings = ings.replaceAll('$', ', ').trim(', ');
    }
    captionText.textContent = ings;
    textDiv.appendChild(captionText);

    postCard.appendChild(dishImageWrapper);
    postCard.appendChild(textDiv);
    return postCard;
}

function populateSection(containerId, data){
    let section = document.getElementById(containerId);
    if(!section) return;
    removeAllChildNodes(section);
    for(let i = 0; i < data.length; i++){
        section.appendChild(buildDishCard(data[i]));
    }
}

// ---------------- Likes on Home Cards ----------------
function getHomeLikePayload(dishId, showAlert=true){
    const email = window.localStorage.getItem('EMAIL');
    if(!email){
        if(showAlert){ alert('Please log in to like dishes.'); }
        return null;
    }
    return { email: email, dish_id: String(dishId) };
}

function likeDishHome(dishId, svgEl){
    const payload = getHomeLikePayload(dishId);
    if(!payload) return;
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/likeDish',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(){
            svgEl.setAttribute('fill', '#EC4899');
            // refresh personalized and trending sections
            try { fetchForYou(); } catch(e) {}
            try { fetchTrending(); } catch(e) {}
        },
        error: function(err){ console.log('Error', JSON.stringify(err)); }
    });
}

function unlikeDishHome(dishId, svgEl){
    const payload = getHomeLikePayload(dishId);
    if(!payload) return;
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/unlikeDish',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(){
            svgEl.setAttribute('fill', '#FFFFFF');
            try { fetchForYou(); } catch(e) {}
            try { fetchTrending(); } catch(e) {}
        },
        error: function(err){ console.log('Error', JSON.stringify(err)); }
    });
}

function toggleLikeHome(svgEl, dishId){
    if(svgEl.getAttribute('fill') === '#FFFFFF'){
        likeDishHome(dishId, svgEl);
    } else {
        unlikeDishHome(dishId, svgEl);
    }
}

function initializeLikeStateHome(svgEl, dishId){
    const payload = getHomeLikePayload(dishId, false);
    if(!payload){
        svgEl.setAttribute('fill', '#FFFFFF');
        return;
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/countUserLikes',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(res){
            let data = (typeof res === 'string') ? JSON.parse(res) : res;
            if(data && data["likes"] && Number(data["likes"]) > 0){
                svgEl.setAttribute('fill', '#EC4899');
            } else {
                svgEl.setAttribute('fill', '#FFFFFF');
            }
        },
        error: function(err){ svgEl.setAttribute('fill', '#FFFFFF'); }
    });
}

function populateRecentPostedDishes(data) {
    populateSection('home-posts', data);
}

function fetchDishes(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8000/getRecentPostedDishes',
        success: function(res) {
            data = JSON.parse(res);
            const arr = data["data"] || [];
            if (arr.length === 0){
                // Show demo recent items so page doesn\'t look empty
                document.getElementById('home-no-posts').style.display = 'none';
                populateRecentPostedDishes(demoRecent);
            } else {
                populateRecentPostedDishes(arr);
            }
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    })
}

function fetchTrending(){
    const days = window.__TRENDING_DAYS__ || 7;
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8000/getTrendingDishes' + (days ? ('?days=' + days) : ''),
        success: function(res){
            let data = (typeof res === 'string') ? JSON.parse(res) : res;
            const arr = data["data"] || [];
            if(arr.length === 0){
                // If backend has no trending yet, showcase demo cards
                const msg = document.getElementById('home-trending-empty');
                if (msg) msg.style.display = 'none';
                populateSection('home-trending', demoTrending);
            } else {
                const msg = document.getElementById('home-trending-empty');
                if (msg) msg.style.display = 'none';
                populateSection('home-trending', arr);
            }
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });
}

function fetchForYou(){
    // Personalized only if user is known
    const email = window.localStorage.getItem('EMAIL');
    if(!email){
        const wrapper = document.getElementById('home-for-you-wrapper');
        const msg = document.getElementById('home-for-you-empty');
        if (wrapper) wrapper.style.display = 'block';
        // Show a subtle message and still populate with generic picks
        if (msg) msg.style.display = 'block';
        populateSection('home-for-you', demoForYou);
        return;
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/getForYouDishes',
        contentType: 'application/json',
        data: JSON.stringify({ email }),
        success: function(res){
            let data = (typeof res === 'string') ? JSON.parse(res) : res;
            const arr = data["data"] || [];
            const wrapper = document.getElementById('home-for-you-wrapper');
            const msg = document.getElementById('home-for-you-empty');
            if(arr.length === 0){
                // Show demo personalized items (generic) instead of empty
                if (wrapper) wrapper.style.display = 'block';
                if (msg) msg.style.display = 'none';
                populateSection('home-for-you', demoForYou);
            } else {
                if (wrapper) wrapper.style.display = 'block';
                if (msg) msg.style.display = 'none';
                populateSection('home-for-you', arr);
            }
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
            // Fallback to demo items on error for a better UX
            const wrapper = document.getElementById('home-for-you-wrapper');
            const msg = document.getElementById('home-for-you-empty');
            if (wrapper) wrapper.style.display = 'block';
            if (msg) msg.style.display = 'none';
            populateSection('home-for-you', demoForYou);
        }
    });
}

const throttledFunction = (func, limit) => {
    let flag = true;
    return function(element) {
        if(flag){
            func(element);
            flag = false;
            setTimeout(() => { flag = true; }, limit);
        }
    }
}

function onSearchChange(element){
    // console.log('Hi');
    if(element.target.value.trim() === ''){
        // console.log('Hi2');
        fetchDishes();
        fetchTrending();
        fetchForYou();

        return;
    }
    let pattern = "%" + element.target.value + "%";
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/searchDishes',
        contentType: 'application/json',
        data: JSON.stringify({"pattern": pattern}),
        success: function(res) {
            data = JSON.parse(res);
            if(data["data"].length === 0){
                document.getElementById('home-no-posts').style.display = 'block';
                populateRecentPostedDishes([]);
            }
            else{
                document.getElementById('home-no-posts').style.display = 'none';
                populateRecentPostedDishes(data["data"]);
            }
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    })
}

const throttledSearch = throttledFunction(onSearchChange, 500);

let searchBar = document.getElementById('home-dish-search-bar');
if (searchBar) {
    searchBar.addEventListener('input', throttledSearch);
}

// Initial loads
fetchDishes();
fetchTrending();
fetchForYou();

// Trending timeframe switcher
function setActiveTrendButton(activeId){
    const ids = ['trend-1d','trend-7d','trend-30d','trend-all'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(!el) return;
        if (id === activeId){
            el.classList.add('bg-green-600','text-white');
            el.classList.remove('bg-gray-200');
        } else {
            el.classList.remove('bg-green-600','text-white');
            el.classList.add('bg-gray-200');
        }
    });
}

function wireTrendingButtons(){
    const btn1 = document.getElementById('trend-1d');
    const btn7 = document.getElementById('trend-7d');
    const btn30 = document.getElementById('trend-30d');
    const btnAll = document.getElementById('trend-all');
    if(btn1){ btn1.onclick = () => { window.__TRENDING_DAYS__ = 1; setActiveTrendButton('trend-1d'); fetchTrending(); } }
    if(btn7){ btn7.onclick = () => { window.__TRENDING_DAYS__ = 7; setActiveTrendButton('trend-7d'); fetchTrending(); } }
    if(btn30){ btn30.onclick = () => { window.__TRENDING_DAYS__ = 30; setActiveTrendButton('trend-30d'); fetchTrending(); } }
    if(btnAll){ btnAll.onclick = () => { window.__TRENDING_DAYS__ = null; setActiveTrendButton('trend-all'); fetchTrending(); } }
}

// Default active is 7d button present in markup
window.__TRENDING_DAYS__ = 7;
wireTrendingButtons();