// Aggregate usage only: never send names, stamp content, photos or counter values.
const appId=document.querySelector('meta[name="app-insights-id"]')?.content;
if(appId&&!['localhost','127.0.0.1',''].includes(location.hostname))start().catch(()=>{});
async function start(){
 const [{initializeApp},{getAuth,signInAnonymously,browserLocalPersistence,setPersistence},{getFunctions,httpsCallable}]=await Promise.all([
 import('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js'),import('https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/11.6.1/firebase-functions.js')]);
 const firebaseConfig = {

  apiKey:
    "AIzaSyDX1C1kdKW0_xD4WMWmui9ltUnG1WjO9mA",

  authDomain:
    "maths-adventure-f4d17.firebaseapp.com",

  projectId:
    "maths-adventure-f4d17",

  storageBucket:
    "maths-adventure-f4d17.firebasestorage.app",

  messagingSenderId:
    "3583493206",

  appId:
    "1:3583493206:web:a6d2d61e7e8665cf2127f7"
};

 const app=initializeApp(firebaseConfig,'insights-'+appId),auth=getAuth(app);
 await setPersistence(auth,browserLocalPersistence);if(!auth.currentUser)await signInAnonymously(auth);
 const data={appId,sessionId:crypto.randomUUID(),activeSeconds:0,studySeconds:0,studyStarts:0,clears:0,unlocks:0,gameEntries:0,games:{},returnedToStudy:false};
 let last=Date.now(),input=last,sending=false;
 function tick(){const now=Date.now();if(!document.hidden&&now-input<60000)data.activeSeconds+=Math.min(5,Math.max(0,(now-last)/1000));last=now;}
 for(const name of ['pointerdown','keydown'])addEventListener(name,()=>{tick();input=Date.now();},{passive:true});
 const send=httpsCallable(getFunctions(app,'asia-northeast1'),'recordUsage');
 async function flush(){if(sending)return;tick();sending=true;try{await send({...data,activeSeconds:Math.floor(data.activeSeconds)});}catch{}finally{sending=false;}}
 document.addEventListener('visibilitychange',()=>{tick();if(!document.hidden)input=Date.now();void flush();});
 setInterval(tick,5000);setInterval(()=>{if(!document.hidden)void flush();},30000);void flush();
}
