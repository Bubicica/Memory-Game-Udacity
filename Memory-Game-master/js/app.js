// Creating a cards array and converting to Array
const cards = document.getElementsByClassName("card");
let cardsArray = Array.from(cards);

// declaring a list for the opened cards to act as a buffer
let cardList = [];

// declaring a global moves counter
let movesNum = 0;

// declaring a global star counter
let starsNum = 5;

// declaring global for the time
let time = 0;

// detecting the end of animations - from the very popular repo: https://github.com/daneden/animate.css
const animationEnd = (function(el) {
  const animations = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'mozAnimationEnd',
    WebkitAnimation: 'webkitAnimationEnd',
  };
  for (var t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
})(document.createElement('div'));

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// shuffle the cards after page loads
function shuffleDeck () {
	shuffle(cardsArray);
	const theDeck = document.querySelector(".deck");
	while (theDeck.firstChild) {
		theDeck.removeChild(theDeck.firstChild);
	}
	for (let i = 0; i < cardsArray.length; i++){
		theDeck.appendChild(cardsArray[i]);
	}
}

 // reveals the cards that are clicked
 function reveal (){
	event.target.classList.add("open");
	event.target.classList.add("show");
	event.target.classList.add("locked");	
}

// adds the cards to a buffer where they are checked
function addToMatchBuffer(){
	if (cardList.length < 2){
		cardList.push(event.target);
	}
}

// animate all the things
function animate(node, animation){
	node.classList.add("animated");	
	node.classList.add(animation);
	node.addEventListener(animationEnd, function (){
		node.classList.remove("animated");	
		node.classList.remove(animation);
	});
}

// matching function - checks and animates if match
function match() {
	if (cardList[0].innerHTML === cardList[1].innerHTML){
			for (let i = 0; i < 2; i++){
				cardList[i].classList.add("match");
				animate(cardList[i], "tada");
				
			}
		cardList.length = 0;
	}
	else {
		animate(event.target, "flipInY");
		setTimeout(function() {
			for (let i = 0; i < 2; i++){
				cardList[i].classList.remove("open");
				cardList[i].classList.remove("show");
				cardList[i].classList.remove("locked");
				animate(cardList[i], "flipInY");
			}
			cardList.length = 0;
		}, 1200);
	}	
}

// counter increment
function increaseCounter(number){
	number += 1;
	movesNum = number;
	document.querySelector(".moves").textContent = number;
}

// changes the stars to empty or full ones
function exchangeStar (ele, starType){
	const newStar = document.createElement("I");
	newStar.classList.add("fa");
	newStar.classList.add(starType);
	ele.appendChild(newStar);
}

// configure start rating
function decreaseStars () {
		const stars = document.querySelector(".stars");
		if (stars.lastElementChild.innerHTML === '<i class="fa fa-star-o"></i>'){
			stars.getElementsByTagName('li')[1].removeChild(stars.getElementsByTagName('li')[1].lastElementChild);
			exchangeStar(stars.getElementsByTagName('li')[1], "fa-star-o"); 	
		}
		else {
			stars.lastElementChild.removeChild(stars.lastElementChild.lastElementChild);
			exchangeStar(stars.lastElementChild, "fa-star-o");
		}
}

// Reset function used in plain reset and at game end
function reset() {
	// resetting globals
	cardList.length = 0;
	movesNum = 0;
	starsNum = 5;
	time = 0;
	
	// resetting moves displayed
	document.querySelector(".moves").textContent = movesNum;
	
	// resetting stars displayed
	const starsList = document.querySelector(".stars");
	const starsElems = starsList.getElementsByTagName("li");
	for (i = 0; i < starsElems.length; i++) {
		starsElems[i].removeChild(starsElems[i].firstElementChild);
		exchangeStar(starsElems[i], "fa-star")
	}
	
	// resetting End div if any
	const endNode = document.querySelector(".game-end");
	if (endNode != null) {
		while (endNode.firstChild) {
			endNode.removeChild(endNode.firstChild);
		}
		endNode.parentNode.removeChild(endNode.parentNode.lastElementChild);
	}

	// removing all show, match and open classes
	const cardElems = document.getElementsByClassName("card");
	for (let i = 0; i < cardElems.length; i++) {
		cardElems[i].classList.remove("show");
		cardElems[i].classList.remove("match");
		cardElems[i].classList.remove("open");
		cardElems[i].classList.remove("locked");
		animate(cardElems[i], "flipInY");
	}
	shuffleDeck();
}

function gameWon () {
	// creating the pop-up div
	const theBody = document.querySelector("body");
	const endDiv = document.createElement("DIV");
	theBody.appendChild(endDiv);
	endDiv.classList.add("game-end");
	endDiv.classList.add("container");
	
	const theEndDiv = document.querySelector(".game-end");
	
	// adding an image to it
	const endImg = document.createElement("IMG");
	endImg.setAttribute("src","img/fire-works.jpg")
	theEndDiv.appendChild(endImg);
	endImg.classList.add("end-img");
	
	// adding a header
	const endHeader = document.createElement("H1");
	endHeader.textContent = "Nice job!";
	theEndDiv.appendChild(endHeader);
	
	// adding moves and stars
	const endFirstPara = document.createElement("P");
	endFirstPara.textContent = `You used ${movesNum} Moves and got ${starsNum} Stars`;
	theEndDiv.appendChild(endFirstPara);
	endFirstPara.classList.add("end-para");
	
	// adding time
	const endSecondPara = document.createElement("P");
	endSecondPara.textContent = `Your completion time is ${time} seconds`;
	theEndDiv.appendChild(endSecondPara);
	endSecondPara.classList.add("end-para");
	
	// adding reset button
	const endButton = document.createElement("BUTTON");
	endButton.textContent = "New game +"
	theEndDiv.appendChild(endButton);
	endButton.classList.add("end-button");
	
	// adding an event Listener to the New game button
	endButton.addEventListener('click', function(){
		reset();
	});
}

// main
shuffleDeck ();

// adding the reset feature to the reset button
const restartDiv = document.querySelector(".restart");
restartDiv.addEventListener('click', function(){
	reset();
});

const theDeck = document.querySelector(".deck");
theDeck.addEventListener('click', function (event){
    if (event.target.nodeName === 'LI') {
		if (time === 0){
			time = Math.floor(new Date().getTime() / 1000);
		}
		
		if (event.target.classList.contains("locked") != true) {
			reveal();
			addToMatchBuffer();
			
			// increase moves and adjust stars and check for match
			if (cardList.length === 2) {
				match();
				increaseCounter(movesNum);
			} 	
			else {
				animate(event.target, "flipInY");
			}
			
			switch (movesNum) {
			case 11:
				if (document.querySelector(".stars").lastElementChild.innerHTML === '<i class="fa fa-star"></i>')
				decreaseStars();
				starsNum -= 1;
				break;
			case 13:
				decreaseStars();
				starsNum -= 1;
			}

			if (document.getElementsByClassName("match").length === 16) {
				time = Math.floor(new Date().getTime() / 1000) - time;
				gameWon ();
			}
		}
	};	
})