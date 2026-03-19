document.addEventListener("DOMContentLoaded", function(){

  const dropArea = document.getElementById("dropArea");
  const fileInput = document.getElementById("fileInput");
  const selectBtn = document.getElementById("selectBtn");
  const preview = document.getElementById("preview");
  const text = document.getElementById("text");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const downloadBtn = document.getElementById("downloadBtn");
  const hueRange = document.getElementById("hueRange");
  
  let img = new Image();
  
  selectBtn.onclick = () => fileInput.click();
  fileInput.onchange = () => load(fileInput.files[0]);
  
  dropArea.ondragover = e => { 
   e.preventDefault(); 
  };
  
  dropArea.ondrop = e => {
   e.preventDefault();
   load(e.dataTransfer.files[0]);
  };
  
  function load(file){
  
   if(!file || !file.type.startsWith("image/")){
     alert("Only JPG / JPEG allowed");
     return;
   }
  
   const reader = new FileReader();
  
   reader.onload = () => {
     img.src = reader.result;
     preview.src = reader.result;
     preview.hidden = false;
     text.style.display = "none";
   };
  
   img.onload = draw;
  
   reader.readAsDataURL(file);
  }
  
  function draw(){
  
   canvas.width = img.width;
   canvas.height = img.height;
  
   ctx.clearRect(0,0,canvas.width,canvas.height);
  
   ctx.filter = `hue-rotate(${hueRange.value}deg)`;
  
   ctx.drawImage(img,0,0);
  
   preview.style.filter = ctx.filter;
  
   downloadBtn.href = canvas.toDataURL("image/png");
  }
  
  hueRange.oninput = draw;
  
  });

/* ================= UNICODE → KURTIDEV ================= */

const MAP = {
  'अ':'v','आ':'vk','इ':'b','ई':'B','उ':'m','ऊ':'M','ए':',','ऐ':'<','ओ':'vks','औ':'vkS',
  'क':'d','ख':'[k','ग':'x','घ':'?','च':'p','छ':'P','ज':'t','झ':'T',
  'ट':'V','ठ':'B','ड':'M','ढ':'<','ण':'N',
  'त':'l','थ':'b','द':'n','ध':'j','न':'u',
  'प':'i','फ':'Q','ब':'c','भ':'H','म':'e',
  'य':';','र':':','ल':'y','व':'o',
  'श':'"','ष':'L','स':'l','ह':'g',
  'ा':'k','ि':'f','ी':'h','ु':'q','ू':'Q','े':'s','ै':'S','ो':'ks','ौ':'kS'
};

function convert(){
  let t = document.getElementById("input").value;
  let out = t;

  out = out.replace(/र्(.)/g,"Z$1");
  out = out.replace(/(.)(ि)/g,"f$1");

  Object.keys(MAP).sort((a,b)=>b.length-a.length).forEach(k=>{
    out = out.split(k).join(MAP[k]);
  });

  out = out.replace(/्/g,"");
  document.getElementById("output").value = out;
}

/* ================= ENGLISH ↔ HINDI TRANSLATOR ================= */

function translateText(){
  let text = document.getElementById("inputarea").value;
  let direction = document.getElementById("direction").value;

  if(text.trim()===""){
    alert("write some text");
    return;
  }

  let from = direction==="hi-en" ? "hi" : "en";
  let to   = direction==="hi-en" ? "en" : "hi";

  fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`)
    .then(r=>r.json())
    .then(d=>{
      document.getElementById("outputarea").value =
        d[0].map(i=>i[0]).join("");
    })
    .catch(()=>{
      document.getElementById("outputarea").value="Error";
    });
}


window.onload = ()=>{
  if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
  }
};
//voice assistant 

function listen(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){
    alert("Speech support नहीं है");
    return;
  }
  const rec = new SR();
  rec.lang = "en-IN";
  rec.start();
  rec.onresult = e=>{
    const cmd = e.results[0][0].transcript.toLowerCase().trim();
    document.getElementById("text").innerText = "सुना: " + cmd;
    run(cmd);
  };
}

function run(cmd){

  /* 🎵 SONG → YOUTUBE ONLY */
  if(cmd.includes("song") || cmd.includes("gana") || cmd.includes("play")){
    location.href =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(cmd);
    return;
  }

  if(cmd === "open youtube"){
    location.href="https://m.youtube.com"; return;
  }

  /* 📱 SOCIAL */
  if(cmd.includes("open instagram")){location.href="https://www.instagram.com";return;}
  if(cmd.includes("open facebook")){location.href="https://m.facebook.com";return;}
  if(cmd.includes("open whatsapp")){location.href="https://wa.me";return;}
  if(cmd.includes("open telegram")){location.href="https://t.me";return;}
  if(cmd.includes("open snapchat")){location.href="https://www.snapchat.com";return;}
  if(cmd.includes("open twitter")||cmd.includes("open x")){location.href="https://x.com";return;}
  if(cmd.includes("open linkedin")){location.href="https://www.linkedin.com";return;}

  /* 🛒 SHOPPING (UPDATED LINKS) */
  if(cmd.includes("shopping karo 3")){
    location.href="https://aarambhadaksh-web7.netlify.app"; return;
  }
  if(cmd.includes("shopping karo 2")){
    location.href="https://aarambh-web-project6.netlify.app"; return;
  }
  if(cmd.includes("shopping karo")){
    location.href="https://aarambhdaksh-web-project.netlify.app"; return;
  }

  /* 🛠️ TOOLS (UPDATED LINKS) */
  if(cmd.includes("translator")){
    location.href="https://aarambhdaksh-translator.netlify.app"; return;
  }
  if(cmd.includes("jpg to png") || cmd.includes("jpeg to png")){
    location.href="https://jpeg-to-png.netlify.app"; return;
  }

  /* 📷 CAMERA */
  if(cmd.includes("camera")){
    openCam(); return;
  }

  alert("❌ Command samajh nahi aaya");
}

function openCam(){
  const v=document.getElementById("cam");
  v.style.display="block";
  navigator.mediaDevices.getUserMedia({video:true})
    .then(s=>v.srcObject=s)
    .catch(()=>alert("Camera allow नहीं"));
}

function showCommands(){
 let commenderdiv = document.getElementById('commands');
 commenderdiv.style.visibility === "visible";
 
}

//QR CODE MAKER//

let qr;

function makeQR(){

 let text = document.getElementById("qrarea").value;

 if(text.trim() === ""){
   alert("write some text");
   return;
 }

 document.getElementById("qrBox").innerHTML = "";

 qr = new QRCode(document.getElementById("qrBox"), {
   text: text,
   width: 200,
   height: 200
 });

}

function downloadQR(){

 let img = document.querySelector("#qrBox img");

 if(!img){
   alert("Pehle QR banao");
   return;
 }

 let a = document.createElement("a");
 a.href = img.src;
 a.download = "qr-code.png";
 a.click();

}

async function shareQR(){

 let img = document.querySelector("#qrBox img");

 if(!img){
   alert("Pehle QR banao");
   return;
 }

 if(navigator.share){

   const res = await fetch(img.src);
   const blob = await res.blob();
   const file = new File([blob], "qr.png", {type:"image/png"});

   navigator.share({
     files:[file],
     title:"QR Code",
     text:"Mera QR Code"
   });

 }else{

   alert("Share supported nahi hai is browser mein");

 }

}
//vocal remover code
let audioContext = new AudioContext();
let source;

function loadAudio(file){
  let url = URL.createObjectURL(file);
  let audio = new Audio(url);
  document.getElementById("audio").src = url;

  source = audioContext.createMediaElementSource(audio);
  return audio;
}

let fileInput = document.getElementById("file");
let currentAudio;

fileInput.addEventListener("change", function(){
  currentAudio = loadAudio(this.files[0]);
});

function playOriginal(){
  if(currentAudio){
    currentAudio.currentTime = 0;
    currentAudio.play();
  }
}

function playNoVocal(){
  if(!currentAudio) return;

  let splitter = audioContext.createChannelSplitter(2);
  let merger = audioContext.createChannelMerger(2);

  source.connect(splitter);

  let inverter = audioContext.createGain();
  inverter.gain.value = -1;

  splitter.connect(inverter, 1);
  splitter.connect(merger, 0);
  inverter.connect(merger, 0);

  merger.connect(audioContext.destination);

  currentAudio.currentTime = 0;
  currentAudio.play();
}

// 🔴 Stop Function
function stopAudio(){
  if(currentAudio){
    currentAudio.pause();      // stop playback
    currentAudio.currentTime = 0; // reset to start
  }
}function downloadAudio() {
  let audio = document.getElementById("audio");
  if (!audio.src) return;

  let a = document.createElement("a");
  a.href = audio.src;
  a.download = "my-audio.mp3"; // file naam change kar sakta hai
  a.click();
}



function aboutPage(){
 let  myAbout = document.getElementById('about');

 window.location.href = "about.html";
 }

 function contactPage(){
   let contact = document.getElementById('contact')
   window.location.href = "contact.html"
 }
 function loginPage (){
   let login = document.getElementById('loginwebpage')
   window.location.href = "login.html"
 }
 function hamburgerIcon() {
  document.getElementById("sideMenu").classList.toggle("active");
  document.querySelector(".hamburger").classList.toggle("active");
}




function dayNightButton(){
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark")?"dark":"light");
}
//=================cookies notice===============//
function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "yes");
  document.getElementById("cookieNotice").style.display = "none";
}

if(localStorage.getItem("cookiesAccepted") === "yes") {
  document.getElementById("cookieNotice").style.display = "none";
}