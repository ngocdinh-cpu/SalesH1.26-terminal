/*
  SALES H1 TERMINAL v2

  USER:
    0807 -> dducanhlee

  ADMIN:
    ADMIN2026

  IMPORTANT:
  This is a static Netlify demo. Admin changes are stored in the
  browser's localStorage. To publish a ticket to ALL visitors,
  add the final ticket object to STATIC_TICKETS below and commit
  this file to GitHub.
*/

const ADMIN_KEY = "ADMIN2026";

const STATIC_TICKETS = {
  "0807": {
    name: "dducanhlee",
    event: "SALES H1 BONDING 2026",
    date: "19:00 • 05.09.2026",
    location: "HANOI, VIETNAM",
    note: "FULL ACCESS",
    tag: "AUTHORIZED PERSONNEL",
    color: "#b6ff00",
    opacity: 0.72,
    image: "",
    id: "0807"
  }
};

const $ = id => document.getElementById(id);
const STORAGE_KEY = "sales_h1_terminal_tickets";
let currentTicket = null;

function getTickets(){
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return {...STATIC_TICKETS, ...saved};
}

function saveTickets(tickets){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function rgb(hex){
  const n=parseInt(hex.replace("#",""),16);
  return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
}

function applyTicket(t, prefix="p"){
  const target = prefix === "p" ? $("ticket") : document.querySelector("#adminTicketMount .ticket");
  if(!target) return;

  const ids = prefix === "p"
    ? {event:"pEvent",date:"pDate",location:"pLocation",tag:"pTag",name:"pName",note:"pNote",id:"pId",bg:"ticketBg"}
    : null;

  if(prefix === "p"){
    $(ids.event).textContent = "EVENT/// " + t.event.toUpperCase();
    $(ids.date).textContent = t.date.toUpperCase();
    $(ids.location).textContent = t.location.toUpperCase();
    $(ids.tag).textContent = t.tag.toUpperCase();
    $(ids.name).textContent = t.name.toUpperCase();
    $("pNote").textContent = "NOTE: " + (t.note || "—");
    $(ids.id).textContent = t.id;
    const c=rgb(t.color);
    $("ticket").querySelector(".ticket-overlay").style.background =
      `rgba(${c.r},${c.g},${c.b},${t.opacity})`;
    if(t.image){
      $("ticketBg").src=t.image;
      $("ticketBg").classList.remove("hidden");
    }else{
      $("ticketBg").classList.add("hidden");
    }
  }
}

function showUserTicket(t){
  currentTicket=t;
  $("loginView").classList.add("hidden");
  $("adminView").classList.add("hidden");
  $("ticketView").classList.remove("hidden");
  $("welcomeText").textContent="WELCOME, "+t.name;
  applyTicket(t);
}

function logout(){
  $("ticketView").classList.add("hidden");
  $("adminView").classList.add("hidden");
  $("loginView").classList.remove("hidden");
  $("accessKey").value="";
  $("loginMsg").textContent="";
}

$("initBtn").onclick=()=>{
  const key=$("accessKey").value.trim();
  const t=getTickets()[key];
  if(!t){
    $("loginMsg").textContent="ACCESS DENIED /// INVALID KEY";
    return;
  }
  showUserTicket(t);
};

$("accessKey").addEventListener("keydown",e=>{
  if(e.key==="Enter") $("initBtn").click();
});

$("logoutBtn").onclick=logout;

$("adminBtn").onclick=()=>{
  const key=prompt("ENTER ADMIN ACCESS KEY");
  if(key!==ADMIN_KEY) return;
  openAdmin();
};

$("adminLogoutBtn").onclick=logout;

function openAdmin(){
  $("loginView").classList.add("hidden");
  $("ticketView").classList.add("hidden");
  $("adminView").classList.remove("hidden");
  renderGuestList();
  clearAdminForm();
}

function clearAdminForm(){
  $("aKey").value="";
  $("aName").value="";
  $("aEvent").value="SALES H1 BONDING 2026";
  $("aDate").value="19:00 • 05.09.2026";
  $("aLocation").value="HANOI, VIETNAM";
  $("aNote").value="FULL ACCESS";
  $("aTag").value="AUTHORIZED PERSONNEL";
  $("aColor").value="#b6ff00";
  $("aOpacity").value=".72";
  $("aImage").value="";
  $("adminMsg").textContent="";
}

function formTicket(){
  const key=$("aKey").value.trim();
  return {
    name:$("aName").value.trim(),
    event:$("aEvent").value.trim(),
    date:$("aDate").value.trim(),
    location:$("aLocation").value.trim(),
    note:$("aNote").value.trim(),
    tag:$("aTag").value.trim(),
    color:$("aColor").value,
    opacity:Number($("aOpacity").value),
    image:window.adminImage||"",
    id:key
  };
}

function renderAdminPreview(t){
  const mount=$("adminTicketMount");
  mount.innerHTML=`
    <div class="ticket">
      <img class="ticket-bg ${t.image?"":"hidden"}" src="${t.image||""}" alt="">
      <div class="ticket-overlay"></div>
      <div class="ticket-content">
        <div class="ticket-top"><span>EVENT/// ${escapeHtml(t.event.toUpperCase())}</span><span>/// SALES H1 TERMINAL</span></div>
        <div class="ticket-line"></div>
        <div class="ticket-meta"><span>${escapeHtml(t.date.toUpperCase())}</span><span>${escapeHtml(t.location.toUpperCase())}</span></div>
        <div class="spacer"></div>
        <div class="authorized">${escapeHtml(t.tag.toUpperCase())}</div>
        <div class="guest">${escapeHtml(t.name.toUpperCase()||"YOUR NAME")}</div>
        <div class="note">NOTE: ${escapeHtml(t.note||"—")}</div>
        <div class="ticket-line"></div>
        <div class="ticket-bottom"><div><div class="barcode"></div><span>ID: <b>${escapeHtml(t.id||"000000")}</b></span></div><div class="access">FULL<br>ACCESS</div></div>
      </div>
    </div>`;
  const c=rgb(t.color);
  mount.querySelector(".ticket-overlay").style.background=`rgba(${c.r},${c.g},${c.b},${t.opacity})`;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

$("aImage").onchange=e=>{
  const file=e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    window.adminImage=ev.target.result;
    renderAdminPreview(formTicket());
  };
  reader.readAsDataURL(file);
};

["aKey","aName","aEvent","aDate","aLocation","aNote","aTag","aColor","aOpacity"].forEach(id=>{
  $(id).addEventListener("input",()=>renderAdminPreview(formTicket()));
});

$("previewBtn").onclick=()=>{
  renderAdminPreview(formTicket());
  $("adminMsg").textContent="PREVIEW UPDATED";
};

$("saveTicketBtn").onclick=()=>{
  const t=formTicket();
  if(!t.id||!t.name){
    $("adminMsg").textContent="ENTER ACCESS KEY + GUEST NAME";
    return;
  }
  const tickets=getTickets();
  tickets[t.id]=t;
  saveTickets(tickets);
  $("adminMsg").textContent=`SAVED /// ${t.id} → ${t.name}`;
  renderGuestList();
};

$("newTicketBtn").onclick=()=>{
  window.adminImage="";
  clearAdminForm();
  renderAdminPreview(formTicket());
};

function renderGuestList(){
  const list=$("guestList");
  const tickets=getTickets();
  const keys=Object.keys(tickets);
  list.innerHTML="";
  keys.forEach(key=>{
    const t=tickets[key];
    const row=document.createElement("div");
    row.className="guest-item";
    row.innerHTML=`<div><strong>${escapeHtml(t.name)}</strong><small>KEY: ${escapeHtml(key)}</small></div><button>EDIT</button>`;
    row.querySelector("button").onclick=()=>{
      $("aKey").value=key;
      $("aName").value=t.name;
      $("aEvent").value=t.event;
      $("aDate").value=t.date;
      $("aLocation").value=t.location;
      $("aNote").value=t.note||"";
      $("aTag").value=t.tag||"AUTHORIZED PERSONNEL";
      $("aColor").value=t.color||"#b6ff00";
      $("aOpacity").value=t.opacity??.72;
      window.adminImage=t.image||"";
      renderAdminPreview(t);
    };
    list.appendChild(row);
  });
}

$("exportBtn").onclick=()=>{
  const data=JSON.stringify(getTickets(),null,2);
  const blob=new Blob([data],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="sales-h1-tickets.json";
  a.click();
  URL.revokeObjectURL(a.href);
};

$("saveBtn").onclick=async()=>{
  if(!currentTicket)return;
  const canvas=await html2canvas($("ticket"),{backgroundColor:null,scale:2});
  const a=document.createElement("a");
  a.download=(currentTicket.name||"ticket").replace(/\s+/g,"-").toLowerCase()+".png";
  a.href=canvas.toDataURL("image/png");
  a.click();
};

$("soundBtn").onclick=()=>{
  const on=$("soundBtn").textContent.includes("ON");
  $("soundBtn").textContent=on?"[SOUND: OFF]":"[SOUND: ON]";
};

window.adminImage="";
renderAdminPreview(STATIC_TICKETS["0807"]);
