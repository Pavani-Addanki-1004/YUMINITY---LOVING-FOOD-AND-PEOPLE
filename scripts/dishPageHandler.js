// Handling Dish Details
// ----------------------
// Support opening dish.html via direct link like dish.html?id=123.
// We will read the id from URL if WATCH_DISH_ID is not already in localStorage.
function getQueryParam(name){
    const m = new RegExp('(?:[?&])' + name + '=([^&]+)').exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
}

// Simple toast notification
function showToast(message, type = 'success'){
    try {
        const containerId = 'fl-toast-container';
        let container = document.getElementById(containerId);
        if (!container){
            container = document.createElement('div');
            container.id = containerId;
            container.style.position = 'fixed';
            container.style.right = '16px';
            container.style.bottom = '16px';
            container.style.zIndex = '9999';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '8px';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.padding = '10px 14px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        toast.style.color = '#0f172a';
        toast.style.fontSize = '14px';
        toast.style.fontWeight = '500';
        toast.style.backgroundColor = (type === 'success') ? '#bbf7d0' : (type === 'error') ? '#fecaca' : '#e2e8f0';
        toast.style.border = '1px solid rgba(0,0,0,0.05)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'opacity .2s ease, transform .2s ease';
        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 200);
        }, 1800);
    } catch(e) { console.warn('Toast failed', e); }
}

function ensureWatchDishIdFromUrl(){
    try {
        const lsKey = 'WATCH_DISH_ID';
        const urlId = getQueryParam('id');
        if (urlId && String(urlId).trim() !== ''){
            // Always sync with URL to avoid stale dish id across navigations
            window.localStorage.setItem(lsKey, String(urlId));
        }
    } catch(e) {}
}

// Backward-compatible alias used in a few places below
function ensureWatchDishIdFromUrlIfMissing(){
    ensureWatchDishIdFromUrl();
}

function getCurrentDishId(){
    ensureWatchDishIdFromUrl();
    return window.localStorage.getItem('WATCH_DISH_ID');
}
function fetchDishDetails(){
    let dish_id = getCurrentDishId();
    let dishPromise = $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/getDish',
        contentType: 'application/json',
        data: JSON.stringify({"dish_id": dish_id}),
        async: false,
        success: function(res) {
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });

    if(dishPromise.status === 200){
        let data = JSON.parse(dishPromise.responseText);
        let dishId = String(data["DISH_ID"]);
        let dishName = String(data["DISH_NAME"]);
        let cuisineType = String(data["CUISINE_TYPE"]);
        let dishImage = String(data["DISH_IMG_URL"]);
        let dishIngredients = data["DISH_INGREDIENTS"];
        let dishDirections = data["DISH_DIRECTIONS"];
        let dishVideo = data["DISH_VIDEO_URL"];
        let dishOwnerId = data["OWNER_ID"];
        let dishPrepTime = data["PREP_TIME"];
        let dishPostedAt = data["DISH_POSTED_AT"];
        return [dishId, dishName, cuisineType, dishImage, dishIngredients, dishDirections, dishVideo, dishOwnerId, dishPrepTime, dishPostedAt];
    }
}

function onProfileClick(email){
    window.localStorage.setItem('WATCH_PROFILE_EMAIL', email);
    window.location.href = 'otherprofile.html'; 
}

function onSelfProfileClick(){
    window.location.href = "profile.html";
}

async function populateDishVideo(dishVideo){
    document.getElementById('dish-page-video-present').style.display = 'inline-block';
    document.getElementById('dish-page-video').style.display = 'block';
    let videoSource = document.createElement('source');
    videoSource.src = dishVideo;
    document.getElementById('dish-page-video').appendChild(videoSource);
}

function populateDishDetails(){
    let [dishId, dishName, cuisineType, dishImage, dishIngredients, dishDirections, dishVideo, dishOwnerId, dishPrepTime, dishPostedAt] = fetchDishDetails();

    window.lazyLoadOptions = {
        elements_selector: ".lazyloadvideo"
      };    
    
    // Image selection: reuse the same logic as Home cards
    function getDishImageSrc(dish){
        const fallback = '../assets/images/hero-dish.png';
        const url = dish && dish["DISH_IMG_URL"] ? String(dish["DISH_IMG_URL"]).trim() : '';
        const isPlaceholderUrl = (() => {
            if (!url) return true;
            const u = url.toLowerCase();
            const known = ['hero-dish.png','default.jpg','default.png','placeholder','fl_concept_1.png','fl_logo_final.png'];
            return known.some(k => u.includes(k));
        })();
        const name = (dish && dish["DISH_NAME"]) ? String(dish["DISH_NAME"]).toLowerCase() : '';
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
        for (const m of map){ if (m.k.some(kw => name.includes(kw))) return m.v; }
        if (url && url !== 'null' && url !== 'undefined' && !isPlaceholderUrl) return url;
        return fallback;
    }

    // Set image on the page using the shared logic
    const dishImgEl = document.getElementById('dish-page-image');
    if (dishImgEl){
        const src = getDishImageSrc({ 'DISH_IMG_URL': dishImage, 'DISH_NAME': dishName });
        dishImgEl.src = src;
        dishImgEl.alt = dishName || 'Dish image';
        dishImgEl.onerror = function(){ this.onerror = null; this.src = '../assets/images/hero-dish.png'; };
    }

    document.getElementById('dish-page-name').textContent = dishName;
    document.getElementById('dish-page-prep-time').textContent = dishPrepTime;
    document.getElementById('dish-page-cuisine-type').textContent = cuisineType;
    let ingredientsP = document.getElementById('dish-page-ingredients');
    let ingredients = dishIngredients.split('$');
    for(let i=0;i<ingredients.length;i++){
        if(ingredients[i].trim().length > 0){
            let ingr = document.createElement('span');
            let ingli = document.createElement('li');
            ingli.className = 'text-base font-regular';
            ingli.textContent = ingredients[i].trim();
            ingr.appendChild(ingli);
            ingredientsP.appendChild(ingr);
        }
    }

    document.getElementById('dish-page-direction-text').textContent = dishDirections;
    [profileUrl, fullName, email, caption] = fetchCommentorDetails(dishOwnerId);
    if(profileUrl !== '' && profileUrl !== 'null'){
        document.getElementById('dish-page-owner-image').src = profileUrl;
    }
    document.getElementById('dish-page-owner-image').style.border = getBorderBadgeForUser(email);
    document.getElementById('dish-page-owner-image').onclick = () => {
        if('EMAIL' in window.localStorage && window.localStorage.getItem('EMAIL') === email) {
            onSelfProfileClick();
        }
        else{
            onProfileClick(email);
        }
    }
    document.getElementById('dish-page-owner-name').textContent = fullName;
    document.getElementById('dish-page-owner-name').onclick = (element) => {
        if('EMAIL' in window.localStorage && window.localStorage.getItem('EMAIL') === email) {
            onSelfProfileClick();
        }
        else{
            onProfileClick(email);
        }
    }
    if(caption === 'null'){
        caption = '';
    }
    document.getElementById('dish-page-owner-caption').textContent = caption;

    if(dishVideo !== ''){
        populateDishVideo(dishVideo);
    }

    // Load similar dishes by cuisine (excluding current dish)
    try { loadSimilarDishes(cuisineType, dishId); } catch (e) { console.error(e); }
}


// Handling comments
function onCommentSubmitted(){
    let commentBox = document.getElementById('dish-new-comment-text');
    let commentsData = {};

    if(commentBox.value.trim() === ''){
        alert('Comment must be non-empty.');
        return;
    }
    commentsData["comment_text"] = commentBox.value.trim();

    // Pull email from localStorage; if missing, try cookie, else block
    let email = null;
    try { email = window.localStorage.getItem('EMAIL'); } catch(e) {}
    if (!email || email === 'null' || email === 'undefined'){
        try { if (typeof $.cookie === 'function') { email = $.cookie('FOOD_LOVERS_LOGIN'); } } catch(e) {}
    }
    if (email && email !== 'null' && email !== 'undefined'){
        commentsData["email"] = email;
    } else {
        alert("You must be logged in to comment");
        return;
    }

    if("WATCH_DISH_ID" in window.localStorage){
        commentsData["dish_id"] = window.localStorage.getItem('WATCH_DISH_ID');
    }
    else{
        alert("You must be watching the dish page while commenting");
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/postDishComment',
        contentType: 'application/json',
        dataType: 'json',
        headers: { 'Accept': 'application/json' },
        crossDomain: true,
        data: JSON.stringify(commentsData),
        success: function(res) {
            try {
                // If Laravel returned a JSON string, parse it
                if (typeof res === 'string') res = JSON.parse(res);
            } catch(e) {}
            try { commentBox.value = ''; } catch(e) {}
            // Ensure comments area is visible before refreshing
            try {
                const noC = document.getElementById('dish-no-comments');
                const yesC = document.getElementById('dish-comments');
                if (noC) noC.style.display = 'none';
                if (yesC) yesC.style.display = 'block';
            } catch(e) {}
            // Refresh comments, then scroll to newest and highlight it
            populateDishComments();
            setTimeout(function(){
                try {
                    const container = document.getElementById('dish-comments');
                    if (container && container.lastElementChild){
                        const el = container.lastElementChild;
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        const oldBg = el.style.backgroundColor;
                        el.style.backgroundColor = '#fffbdd';
                        setTimeout(function(){ el.style.backgroundColor = oldBg || 'transparent'; }, 1500);
                    }
                    showToast('Comment posted');
                } catch(e) {}
            }, 250);
        },
        error: function(error){
            console.log('Error posting comment');
            console.log(JSON.stringify(error));
            try {
                const msg = error?.responseJSON?.error || error?.responseText || 'Failed to post comment. Please check your connection or try again.';
                alert(msg);
            } catch(e) {}
        }
    });
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function populateCommentCards(data){
    let commentSection = document.getElementById('dish-comments');
    removeAllChildNodes(commentSection);

    for(let i = 0; i < data.length; i++){
        commentDetails = data[i];

        // Comment card
        let commentCard = document.createElement('div');
        commentCard.className = 'flex flex-row w-full p-2';

        // Commentor details
        [profileUrl, fullName, email, caption] = fetchCommentorDetails(commentDetails["OWNER_ID"]);

        // Commentor Profile;
        let commentorImage = document.createElement('img');
        commentorImage.className = 'w-14 md:w-20 h-14 md:h-20 mr-2 object-cover rounded-full cursor-pointer';
        if(profileUrl === 'null' || !profileUrl){
            commentorImage.src = '../assets/images/default-profile.jpeg';
        }
        else{
            commentorImage.src = profileUrl;
        }
        // Fallback if loaded URL fails
        commentorImage.onerror = function(){ this.onerror = null; this.src = '../assets/images/default-profile.jpeg'; };
        commentorImage.id = email;
        commentorImage.style.border = getBorderBadgeForUser(email);
        commentorImage.onclick = (element) => {
            if('EMAIL' in window.localStorage && window.localStorage.getItem('EMAIL') === element.target.id) {
                onSelfProfileClick();
            }
            else{
                onProfileClick(element.target.id);
            }
        }

        // Commentor Name-Comment Div
        let commentorNestedDiv = document.createElement('div');
        commentorNestedDiv.className = 'ml-2';

        let commentorName = document.createElement('h2');
        commentorName.className = 'text-gray-800 text-lg font-medium mb-2 cursor-pointer';
        commentorName.textContent = fullName;
        commentorName.id = email;
        commentorName.onclick = (element) => {
            if('EMAIL' in window.localStorage && window.localStorage.getItem('EMAIL') === element.target.id) {
                onSelfProfileClick();
            }
            else{
                onProfileClick(element.target.id);
            }
        }
        commentorNestedDiv.appendChild(commentorName);

        let commentP = document.createElement('p');
        commentP.className = 'font-regular text-gray-600';
        commentP.textContent = commentDetails["COMMENT_TEXT"];
        commentorNestedDiv.appendChild(commentP);

        commentCard.appendChild(commentorImage);
        commentCard.appendChild(commentorNestedDiv);

        commentSection.appendChild(commentCard);
    }
}

function fetchCommentorDetails(userId){
    let userPromise = $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/getUserFromId',
        contentType: 'application/json',
        async: false,
        data: JSON.stringify({'id': userId}),
        success: function(res) {
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });

    if(userPromise.status === 200){
        let data = JSON.parse(userPromise.responseText);
        let profileUrl = String(data["profile"]);
        let fullName = String(data["name"]);
        let email = String(data["email"]);
        let caption = String(data["caption"])
        return [profileUrl, fullName, email, caption];
    }
}

function populateDishComments(){
    let noComments = document.getElementById('dish-no-comments');
    let yesComments = document.getElementById('dish-comments');
    noComments.style.display = 'block';
    yesComments.style.display = 'none';
    ensureWatchDishIdFromUrlIfMissing();
    if("WATCH_DISH_ID" in window.localStorage){
        let dish_id = window.localStorage.getItem('WATCH_DISH_ID');
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/getDishComments',
            contentType: 'application/json',
            dataType: 'json',
            headers: { 'Accept': 'application/json' },
            data: JSON.stringify({'dish_id': dish_id}),
            success: function(res) {
                try { if (typeof res === 'string') res = JSON.parse(res); } catch(e) {}
                const arr = (res && Array.isArray(res.data)) ? res.data : [];
                if(arr.length > 0){
                    noComments.style.display = 'none';
                    yesComments.style.display = 'block';
                    populateCommentCards(arr);
                } else {
                    noComments.style.display = 'block';
                    yesComments.style.display = 'none';
                }
            },
            error: function(error){
                console.log('Error fetching comments');
                console.log(JSON.stringify(error));
            }
        });
    }
}

// Like functionality
function fetchLikeRelatedDetails(showElert=true){
    let likeData = {};
    let email = null;
    try { email = window.localStorage.getItem('EMAIL'); } catch(e) {}
    if (!email || email === 'null' || email === 'undefined'){
        try { if (typeof $.cookie === 'function') { email = $.cookie('FOOD_LOVERS_LOGIN'); } } catch(e) {}
    }
    if (email && email !== 'null' && email !== 'undefined'){
        likeData["email"] = email;
    } else {
        if(showElert){ alert("You must be logged in to like dishes"); }
        return null;
    }

    ensureWatchDishIdFromUrlIfMissing();
    if("WATCH_DISH_ID" in window.localStorage){
        likeData["dish_id"] = window.localStorage.getItem('WATCH_DISH_ID');
    } else {
        if(showElert){
            alert("You must be on a dish page to like it");
        }
        return null;
    }
    return likeData;
}

function likeDish(element){
    let likeData = fetchLikeRelatedDetails();
    if(likeData === null){
        return null;
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/likeDish',
        contentType: 'application/json',
        dataType: 'json',
        headers: { 'Accept': 'application/json' },
        crossDomain: true,
        data: JSON.stringify(likeData),
        success: function(res) {
            try { if (typeof res === 'string') res = JSON.parse(res); } catch(e) {}
            element.setAttribute('fill', '#EC4899');
            displayLikesCount();
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
            try {
                const msg = error?.responseJSON?.error || error?.responseText || 'Failed to like this dish. Please ensure the server is running and you are logged in.';
                alert(msg);
            } catch(e) {}
        }
    });
}

function unlikeDish(element){
    let likeData = fetchLikeRelatedDetails();
    if(likeData === null){
        return null;
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/unlikeDish',
        contentType: 'application/json',
        dataType: 'json',
        headers: { 'Accept': 'application/json' },
        crossDomain: true,
        data: JSON.stringify(likeData),
        success: function(res) {
            try { if (typeof res === 'string') res = JSON.parse(res); } catch(e) {}
            element.setAttribute('fill', '#FFFFFF');
            displayLikesCount();
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
            try {
                const msg = error?.responseJSON?.error || error?.responseText || 'Failed to unlike this dish. Please check your connection and try again.';
                alert(msg);
            } catch(e) {}
        }
    });
}

function toggleLikeButton(element){
    if(element.getAttribute('fill') === '#FFFFFF'){
        likeDish(element);
    }
    else{
        unlikeDish(element);
    }
}

function displayLikesCount(){
    let countLikes = document.getElementById('dish-page-num-likes');
    ensureWatchDishIdFromUrlIfMissing();
    if("WATCH_DISH_ID" in window.localStorage){
        let dish_id = window.localStorage.getItem('WATCH_DISH_ID');
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/countLikes',
            contentType: 'application/json',
            dataType: 'json',
            headers: { 'Accept': 'application/json' },
            crossDomain: true,
            data: JSON.stringify({"dish_id": dish_id}),
            success: function(res) {
                try { if (typeof res === 'string') res = JSON.parse(res); } catch(e) {}
                countLikes.textContent = (res && typeof res.likes !== 'undefined') ? res["likes"] : '0';
            },
            error: function(error){
                console.log('Error');
                console.log(JSON.stringify(error));
            }
        });
    }
}

function initializeLikeButton(){
    let likeButton = document.getElementById('dish-page-like-btn');
    let likeData = fetchLikeRelatedDetails(false);
    if(likeData === null){
        likeButton.setAttribute('fill', '#FFFFFF');
        return null;
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/countUserLikes',
        contentType: 'application/json',
        dataType: 'json',
        headers: { 'Accept': 'application/json' },
        crossDomain: true,
        data: JSON.stringify(likeData),
        success: function(res) {
            try { if (typeof res === 'string') res = JSON.parse(res); } catch(e) {}
            const likes = (res && typeof res.likes !== 'undefined') ? res.likes : 0;
            if(likes===0){
                likeButton.setAttribute('fill', '#FFFFFF');
            }
            else {
                likeButton.setAttribute('fill', '#EC4899');
            }
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });
}

function getBorderBadgeForUser(userEmail){
    let likes = fetchTotalUserLikes(userEmail);
    let badgeColor = getBadgeColorFromLikes(likes);
    return "2px solid " + badgeColor;
}

function fetchTotalUserLikes(userEmail){
    let likesPromise = $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/countTotalLikesUser',
        contentType: 'application/json',
        data: JSON.stringify({"user_email": userEmail}),
        async: false,
        success: function(res) {
        },
        error: function(error){
            console.log('Error');
            console.log(JSON.stringify(error));
        }
    });

    if(likesPromise.status === 200){
        let data = JSON.parse(likesPromise.responseText);
        return data["likes"];
    }
    return 0;
}

function getBadgeColorFromLikes(numLikes){
    if(numLikes < 5){
        return "#2563EB";
    }
    if(numLikes < 20){
        return "#059669";
    }
    if(numLikes < 100){
        return "#D97706";
    }
    return "#DC2626";
}

// ---------------- Similar Dishes ----------------
function buildSimilarDishCard(dish){
    const card = document.createElement('div');
    card.className = 'rounded overflow-hidden shadow-lg cursor-pointer transition duration-300 transform hover:-translate-y-1 hover:scale-105';
    card.onclick = () => {
        window.localStorage.setItem('WATCH_DISH_ID', String(dish["DISH_ID"]));
        window.location.href = 'dish.html';
    };

    const img = document.createElement('img');
    img.className = 'w-full h-48 object-cover';
    const placeholder = '../assets/images/hero-dish.png';
    const dishUrl = dish["DISH_IMG_URL"];
    if (!dishUrl || dishUrl === 'null' || String(dishUrl).trim() === '') {
        img.src = placeholder;
    } else {
        img.src = dishUrl;
    }
    img.onerror = function(){ this.onerror = null; this.src = placeholder; };
    img.alt = dish["DISH_NAME"]; 
    const text = document.createElement('div');
    text.className = 'px-4 py-3';
    const title = document.createElement('div');
    title.className = 'font-medium text-lg mb-1 truncate';
    title.textContent = dish["DISH_NAME"];
    const sub = document.createElement('p');
    sub.className = 'text-gray-600 text-sm h-10 overflow-ellipsis overflow-hidden';
    let ings = dish["DISH_INGREDIENTS"] || '';
    if (typeof ings === 'string') ings = ings.replaceAll('$', ', ').trim(', ');
    sub.textContent = ings;
    text.appendChild(title);
    text.appendChild(sub);
    card.appendChild(img);
    card.appendChild(text);
    return card;
}

function loadSimilarDishes(cuisineType, excludeDishId){
    const container = document.getElementById('similar-dishes');
    const emptyMsg = document.getElementById('similar-dishes-empty');
    if (!container) return;
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/getDishesByCuisine',
        data: JSON.stringify({ cuisine: cuisineType, exclude_dish_id: Number(excludeDishId), limit: 8 }),
        success: function(res){
            const data = (typeof res === 'string') ? JSON.parse(res) : res;
            const arr = data && data.data ? data.data : [];
            while (container.firstChild) container.removeChild(container.firstChild);
            if (arr.length === 0) {
                if (emptyMsg) emptyMsg.style.display = 'block';
                return;
            }
            if (emptyMsg) emptyMsg.style.display = 'none';
            arr.forEach(d => container.appendChild(buildSimilarDishCard(d)));
        },
        error: function(err){
            console.error('Failed to load similar dishes', err);
            if (emptyMsg) emptyMsg.style.display = 'block';
        }
    });
}

initializeLikeButton();
displayLikesCount();
populateDishDetails();
populateDishComments();