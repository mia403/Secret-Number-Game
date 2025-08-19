//Getting HTML by DOm
let secretNumber;
let triesLeft=5;
const level = document.getElementById("difficulty");
const userGuess = document.getElementById("guess");
const check = document.getElementById("Checkbtn");
const reset = document.getElementById("restartbtn");
const message = document.getElementById("message");
const hint = document.getElementById("hint");
const attemptleft = document.getElementById("Attempt");
const startBtn = document.getElementById("start");
const startBox = document.getElementById("startBox");
const gameArea = document.getElementById("gameArea");
const backgroundSound = document.getElementById("bgsound");
const error = document.getElementById("soundFalse");
const success = document.getElementById("soundCorrect");
const close = document.getElementById("soundClose");

// Leaderboard list
function leaderboardData(score){
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  scores.push(score);
  scores.sort((a,b)=>b-a);
  scores = scores.slice(0,5);
  localStorage.setItem("leaderboard", JSON.stringify(scores));
  renderLeaderboardData();
}
function renderLeaderboardData(){
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const leaderboardEl = document.getElementById("leaderboard");
  leaderboardEl.innerHTML = scores.map(sc=>`<li>${sc} points</li>`).join("");
}

// Confetti thing
function confettiExplosion(){
  const defaults={spread:360,ticks:50,gravity:0,decay:0.94,startVelocity:30,shapes:["star"],colors:["FFE400","FFBD00","E89400","FFCA6C","FDFFB8"]};
  function shoot(){
    confetti({...defaults, particleCount:40, scalar:1.2, shapes:["star"]});
    confetti({...defaults, particleCount:10, scalar:0.75, shapes:["circle"]});
  }
  setTimeout(shoot,0); setTimeout(shoot,100); setTimeout(shoot,200);
}

// Secret Number Generating
function secretNumberGenerator(){
  const max=parseInt(level.value);
  secretNumber=Math.floor(Math.random()*max)+1;
  console.log(secretNumber);
}

// Restart Game
function restartGame(){
  secretNumberGenerator();
  triesLeft=5;
  attemptleft.textContent=triesLeft;
  message.innerHTML="";
  hint.innerHTML="";
  userGuess.value="";
  check.disabled=false;
}

// Start Game
startBtn.addEventListener("click", ()=>{
  startBox.classList.add("hidden");
  gameArea.style.display = "flex"; // <-- side by side
  backgroundSound.volume=0.5;
  backgroundSound.play();
  restartGame();
  renderLeaderboardData();
});

// Buttons
reset.addEventListener("click", restartGame);
level.addEventListener("change", restartGame);

// Check Guess
check.addEventListener("click", ()=>{
  let guess=parseInt(userGuess.value);
  message.style.color="#fff";
  hint.style.opacity=1;

  if(!guess){ message.innerText="Enter a valid number!"; hint.innerText=""; error.play(); return; }
  if(guess>Number(level.value)){ message.innerText="Number exceeds level!"; error.play(); return; }

  if(guess===secretNumber){
    message.innerText="You Won!";
    hint.innerText="";
    success.play();
    check.disabled=true;
    confettiExplosion();
    leaderboardData(triesLeft);
  } else {
    triesLeft--; 
    attemptleft.textContent=triesLeft;
    message.innerText=guess<secretNumber?"Too Low":"Too High";
    let distance=Math.abs(guess-secretNumber);
    if(distance<=2){ hint.innerText="Hint: Very Close!"; hint.style.color="yellow"; close.play(); }
    else if(distance<=5){ hint.innerText="Hint: Close"; hint.style.color="orange"; error.play(); }
    else{ hint.innerText="Hint: Far Away"; hint.style.color="purple"; error.play(); }

    if(triesLeft===0){
      message.innerText="You lost all your chances!";
      check.disabled=true;
      leaderboardData(0);
    }
  }
});
