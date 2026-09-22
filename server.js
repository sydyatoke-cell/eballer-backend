<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Eballer - Pool Tables</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:system-ui}
body{background:#0f1215;color:#fff}
.h{background:#151a1f;padding:15px;display:flex;justify-content:space-between;border-bottom:2px solid #00ff88;position:sticky;top:0;z-index:10}
.logo{color:#00ff88;font-weight:900;font-size:20px}
.bal{background:#00ff88;color:#000;padding:6px 14px;border-radius:20px;font-weight:800}
.c{max-width:600px;margin:15px auto;padding:0 12px}
.card{background:#1c232a;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #2a3440}
.pb{background:linear-gradient(135deg,#00ff88,#00cc6a);color:#000;border-radius:12px;padding:14px;font-weight:800}
.v{background:#000;color:#00ff88;padding:4px 10px;border-radius:6px;font-family:monospace}
input{width:100%;padding:14px;background:#0f1215;border:1px solid #2a3440;border-radius:10px;color:#fff;margin:8px 0}
.btn{width:100%;padding:14px;border:none;border-radius:12px;font-weight:900;cursor:pointer}
.btn-g{background:#00ff88;color:#000}
.btn-dark{background:#2a3440;color:#fff}
.locked{position:relative}
.lock-overlay{position:absolute;inset:0;background:rgba(15,18,21,0.92);backdrop-filter:blur(6px);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;z-index:5}
.table{width:100%;height:180px;background:radial-gradient(#1a5c2a,#0f3d1a);border:8px solid #5a2d0c;border-radius:12px;display:flex;align-items:center;justify-content:center;position:relative;margin:10px 0}
.ball{width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:900;margin:4px;font-size:14px}
.fixture{display:flex;justify-content:space-between;align-items:center;padding:12px;background:#151a1f;border-radius:10px;margin:8px 0}
</style>
</head>
<body>
<div class="h"><div class="logo">EBALLER POOL</div><div class="bal">KES <span id="bal">0</span></div></div>

<div class="c">

<!-- DEPOSIT CARD - ALWAYS VISIBLE -->
<div class="card" id="depositCard">
<h3 style="color:#00ff88">💰 Deposit to Play</h3>
<div class="pb">
<div style="display:flex;justify-content:space-between"><span>Paybill</span><span class="v">714777</span></div>
<div style="display:flex;justify-content:space-between;margin-top:8px"><span>Account</span><span class="v">0141939000</span></div>
</div>
<input id="p" placeholder="Phone 07...">
<input id="a" type="number" value="150">
<input id="c" placeholder="M-Pesa Code TJ..." style="text-transform:uppercase;border:2px solid #00ff88">
<button class="btn btn-g" onclick="deposit()">SUBMIT CODE</button>
<div id="status" style="margin-top:10px;font-size:13px;color:#ffa500"></div>
</div>

<!-- TABLES & FIXTURES - LOCKED UNTIL APPROVED -->
<div class="card locked" id="gameCard">
<div class="lock-overlay" id="lockOverlay">
<div style="font-size:50px">🔒</div>
<h3>Tables Locked</h3>
<p style="color:#8a9bb0;font-size:13px;margin:10px 0">Deposit 150 KES via Paybill 714777<br>Account 0141939000 and submit M-Pesa code</p>
<p style="font-size:12px;color:#ffa500">Waiting for Admin approval in Loop 0141939000</p>
</div>

<h3 style="color:#00ff88">🎱 Pool Tables</h3>
<div class="table">
<span class="ball" style="background:#fff;color:#000">8</span>
<span class="ball" style="background:#ff4444">3</span>
<span class="ball" style="background:#4444ff">2</span>
<span style="color:#fff;font-weight:800;margin-left:10px">TABLE 1 - OPEN</span>
</div>
<div class="table" style="height:120px">
<span style="color:#00ff88;font-weight:800">TABLE 2 - TOURNAMENT</span>
</div>

<h3 style="color:#00ff88;margin-top:15px">📅 Today's Fixtures</h3>
<div class="fixture"><span>Brian vs Otieno</span><span style="color:#00ff88">7:00 PM</span></div>
<div class="fixture"><span>Kisumu Kings vs Lakers</span><span style="color:#00ff88">8:30 PM</span></div>
<div class="fixture"><span>Final - Winner Takes 1000</span><button class="btn btn-g" style="width:auto;padding:6px 12px;font-size:12px" onclick="joinGame()">JOIN - 150</button></div>

<button class="btn btn-dark" style="margin-top:15px" onclick="logout()">Logout / New Deposit</button>
</div>

</div>

<script>
let ds=JSON.parse(localStorage.getItem('eb_d')||'[]');
let bal=parseInt(localStorage.getItem('eb_b')||0);
let approved = ds.some(x=>x.status=='APPROVED') || bal>0;

function update(){
document.getElementById('bal').innerText=bal;
let pend = ds.filter(x=>x.status=='PENDING');
document.getElementById('status').innerHTML = pend.length>0 ? `⏳ Pending: ${pend[0].amount} KES - Code ${pend[0].code} - Waiting admin to check Loop 0141939000` : (approved? '✅ Approved - Tables Unlocked':'');
if(approved){
document.getElementById('lockOverlay').style.display='none';
document.getElementById('depositCard').style.display='none';
}else{
document.getElementById('lockOverlay').style.display='flex';
}
}
function deposit(){
let ph=document.getElementById('p').value,am=document.getElementById('a').value,cd=document.getElementById('c').value.toUpperCase().trim();
if(!ph||!cd)return alert('Enter phone & M-Pesa code');
ds.unshift({id:Date.now().toString(),phone:ph,amount:parseInt(am),code:cd,status:'PENDING',time:new Date().toLocaleString()});
localStorage.setItem('eb_d',JSON.stringify(ds));
document.getElementById('c').value='';
update();
alert('Code '+cd+' submitted. Admin will verify in Loop and unlock your tables.');
}
function joinGame(){if(!approved)return alert('Deposit first');alert('Joined! Game starts 7PM at your pool hall');}
function logout(){if(confirm('Clear balance?')){localStorage.clear();ds=[];bal=0;location.reload();}}
update();
// auto-check every 3 sec if admin approved you
setInterval(()=>{ds=JSON.parse(localStorage.getItem('eb_d')||'[]');bal=parseInt(localStorage.getItem('eb_b')||'0');let nowApproved=ds.some(x=>x.status=='APPROVED')||bal>0;if(nowApproved && !approved){approved=true;update();alert('🎉 PAYMENT APPROVED! Tables unlocked!');}},3000);
</script>
</body>
</html>
