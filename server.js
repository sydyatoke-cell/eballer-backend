const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let deposits = [];
let users = {};

app.get('/', (req,res)=>res.send('Eballer Backend Live'));

app.post('/api/deposit', (req,res)=>{
  const {phone,amount,mpesaCode}=req.body;
  const dep={id:Date.now().toString(),phone,amount:parseInt(amount),mpesaCode:mpesaCode.toUpperCase(),status:'PENDING',time:new Date().toLocaleString()};
  deposits.push(dep);
  console.log('New deposit',dep);
  res.json({success:true,deposit:dep});
});

app.get('/api/deposits',(req,res)=>res.json(deposits));

app.post('/api/approve/:id',(req,res)=>{
  const dep=deposits.find(d=>d.id===req.params.id);
  if(!dep) return res.status(404).json({error:'Not found'});
  dep.status='APPROVED';
  users[dep.phone]=(users[dep.phone]||0)+dep.amount;
  res.json({success:true});
});

app.get('/api/check/:phone',(req,res)=>{
  const phone=req.params.phone;
  const approved=deposits.some(d=>d.phone===phone && d.status==='APPROVED');
  res.json({approved,balance:users[phone]||0});
});

const PORT=process.env.PORT||10000;
app.listen(PORT,()=>console.log('Backend on '+PORT));
