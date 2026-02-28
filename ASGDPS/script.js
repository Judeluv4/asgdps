// DEMONS
const DEMONS=[
 {rank:1,name:"Cosmos",creator:"Judeluv4",thumbnail:"https://i.ytimg.com/vi/mL0y4HWpPlU/maxresdefault.jpg",youtube:"mL0y4HWpPlU"},
 {rank:2,name:"Wacced out murals",creator:"Nightrider"},
 {rank:3,name:"Hailfire",creator:"Judeluv4"}
];

// PLAYERS
const PLAYERS=[
 {name:"Judeluv4",completions:["Cosmos","Wacced out murals","Hailfire"]},
 {name:"Nightrider",completions:["Wacced out murals"]},
 {name:"Jacoma",completions:["Hailfire"]}
];

// POINTERCRATE STYLE POINTS
function basePoints(rank){
 const maxPoints=100;
 const decay=0.94;
 return Math.round(maxPoints*Math.pow(decay,rank-1));
}

const hardestRank=Math.min(...DEMONS.map(d=>d.rank));
const hardestDemonName=DEMONS.find(d=>d.rank===hardestRank).name;

const list=document.getElementById("list");

function renderList(data){
 list.innerHTML="";
 data.forEach(d=>{
  const card=document.createElement("div");
  card.className="card"+(d.name===hardestDemonName?" hardestCard":"");

  card.innerHTML=`
   <div class="thumb" style="${d.thumbnail?`background-image:url('${d.thumbnail}')`:''}">
    ${!d.thumbnail?'Thumbnail':''}
   </div>
   <div>
    <h2><span class="rank">#${d.rank}</span> – ${d.name}</h2>
    <div class="publisher">Published by ${d.creator}</div>
    <div class="points">${basePoints(d.rank)} points</div>
   </div>`;

  // Thumbnail opens YouTube
  if(d.youtube){
   card.querySelector(".thumb").onclick=e=>{
    e.stopPropagation();
    window.open(`https://www.youtube.com/watch?v=${d.youtube}`,"_blank");
   };
  }

  // Card opens level page
  card.onclick=()=>showLevel(d.name);

  list.appendChild(card);
 });
}

renderList(DEMONS);

document.getElementById("searchInput").addEventListener("input",e=>{
 const val=e.target.value.toLowerCase();
 renderList(val?DEMONS.filter(d=>d.name.toLowerCase().includes(val)):DEMONS);
});

// STATS CALC
PLAYERS.forEach(p=>{
 p.score=0;
 p.beaten=[];
 p.completions.forEach(name=>{
  const lvl=DEMONS.find(d=>d.name===name);
  if(lvl){
   const pts=basePoints(lvl.rank);
   p.score+=pts;
   p.beaten.push({name:lvl.name,rank:lvl.rank,points:pts});
  }
 });
 p.beaten.sort((a,b)=>a.rank-b.rank);
 p.hardest=p.beaten[0];
});
PLAYERS.sort((a,b)=>b.score-a.score);

const playerList=document.getElementById("playerList");
const profile=document.getElementById("profile");

function renderProfile(p){
 profile.innerHTML=`
  <h2>${p.name}</h2>
  <p>Rank: #${PLAYERS.indexOf(p)+1}</p>
  <p>Total Score: ${p.score}</p>`;

 if(p.hardest){
  profile.innerHTML+=`
   <div class="hardestProfileCard">
    <div class="hardestTitle">Hardest Demon</div>
    <div class="hardestName">#${p.hardest.rank} ${p.hardest.name}</div>
   </div>`;
 }

 profile.innerHTML+="<h3>Beaten Levels</h3>";

 p.beaten.forEach(b=>{
  profile.innerHTML+=`
   <div class="beatEntry" onclick="showLevel('${b.name}')">
    #${b.rank} ${b.name} — ${b.points} pts
   </div>`;
 });
}

PLAYERS.forEach((p,i)=>{
 const div=document.createElement("div");
 div.className="player"+(i===0?" active":"");
 div.innerHTML=`<span>#${i+1} ${p.name}</span><span>${p.score}</span>`;
 div.onclick=()=>{
  document.querySelectorAll(".player").forEach(x=>x.classList.remove("active"));
  div.classList.add("active");
  renderProfile(p);
  switchView("statsView");
 };
 playerList.appendChild(div);
});
renderProfile(PLAYERS[0]);

function goToPlayer(name){
 const playerDiv=[...playerList.children].find(div=>div.textContent.includes(name));
 if(playerDiv){
  playerDiv.click();
  switchView("statsView");
 }
}

// LEVEL PAGE
function showLevel(name){
 const d=DEMONS.find(l=>l.name===name);
 if(!d)return;

 document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));

 let levelView=document.getElementById("levelView");
 if(!levelView){
  levelView=document.createElement("div");
  levelView.id="levelView";
  levelView.className="view";
  document.body.insertBefore(levelView,document.querySelector("footer"));
 }

 levelView.classList.add("active");

 const victors=PLAYERS.filter(p=>p.completions.includes(d.name));

 const victorsHTML=victors.map(v=>
  `<div class="victorCard" onclick="goToPlayer('${v.name}')">${v.name}</div>`
 ).join("");

 levelView.innerHTML=`
  <div class="levelPage">
   <button class="backBtn" onclick="switchView('demonView')">← Back</button>

   ${d.youtube?`
   <div class="videoWrapper">
    <iframe src="https://www.youtube.com/embed/${d.youtube}?rel=0"
     frameborder="0" allowfullscreen></iframe>
   </div>`:""}

   <h1>#${d.rank} ${d.name}</h1>
   <p class="publisher">Published by <strong>${d.creator}</strong></p>
   <p>Points: ${basePoints(d.rank)}</p>

   <h3>Victors:</h3>
   <div class="victors">${victorsHTML||"None yet"}</div>
  </div>`;
}

function switchView(id){
 document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 document.getElementById("tabList").classList.toggle("active",id==="demonView");
 document.getElementById("tabStats").classList.toggle("active",id==="statsView");
}

document.getElementById("tabList").onclick=()=>switchView("demonView");
document.getElementById("tabStats").onclick=()=>switchView("statsView");
document.getElementById("themeToggle").onclick=()=>document.body.classList.toggle("light");