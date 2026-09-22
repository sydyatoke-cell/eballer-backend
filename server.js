const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let deposits = [];
let balances = {};

app.get('/', (req,res)=>{
  res.send('Eballer Backend LIVE - LOOP 0141939000 - Ready for Player + Admin');
});

app.post('/api/deposit', (req,res)=>{
  const {phone, amount, mpesaCode} = req.body;
  const dep = {
    id: Date.now().toString(),
    phone,
    amount: parseInt(amount)||150,
    mpesaCode: (mpesaCode||'').toUpperCase(),
    status: 'PENDING',
    time: new Date().toLocaleString()
  };
  deposits.unshift(dep);
  res.json({success:true, dep});
});

app.get('/api/deposits', (req,res)=>{
  res.json(deposits);
});

app.post('/api/approve/:id', (req,res)=>{
  const d = deposits.find(x=>x.id===req.params.id);
  if(d){
    d.status='APPROVED';
    balances[d.phone]=(balances[d.phone]||0)+d.amount;
  }
  res.json({success:true});
});

app.get('/api/check/:phone', (req,res)=>{
  const phone = req.params.phone;
  const my = deposits.filter(d=>d.phone===phone);
  const approved = my.some(d=>d.status==='APPROVED');
  res.json({
    approved,
    balance: balances[phone]||0,
    deposits: my
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log('Backend LIVE on '+PORT));
