import React,{useEffect,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Search,ShoppingBag,LayoutGrid,Settings,Package,ShieldCheck,Plus,ExternalLink} from 'lucide-react'
import './style.css'
const API_BASE = 'https://employee-flower-conventional-right.trycloudflare.com/api';

const api = async (path, opt = {}) => {
  const r = await fetch(API_BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(opt.headers || {})
    },
    ...opt
  });

  if (!r.ok) {
    throw Error(await r.text());
  }

  return r.json();
};
const demoCats=Array.from({length:50},(_,i)=>({id:i+1,name:`Category ${String(i+1).padStart(2,'0')}`,slug:`category-${i+1}`,icon:'grid'}))
function App(){
 const [cats,setCats]=useState([]),[cat,setCat]=useState(null),[products,setProducts]=useState([]),[search,setSearch]=useState(''),[admin,setAdmin]=useState(false),[orders,setOrders]=useState([])
 useEffect(()=>{api('/categories').then(x=>{setCats(x.length?x:demoCats);setCat((x[0]||demoCats[0]).id) }).catch(()=>{setCats(demoCats);setCat(1)})},[])
 useEffect(()=>{if(cat)api('/products?category_id='+cat).then(setProducts).catch(()=>setProducts([]))},[cat])
 const shown=products.filter(p=>(p.name||'').toLowerCase().includes(search.toLowerCase()))
 return <div className="app">
  <aside className="side"><div className="brand"><div className="logo">D</div><div><b>DigitalVault</b><small>PRODUCT MARKET</small></div></div>
   <div className="sideTitle">CATEGORIES <span>{cats.length}</span></div><div className="catList">{cats.map(c=><button className={cat===c.id?'active':''} onClick={()=>setCat(c.id)} key={c.id}><LayoutGrid size={16}/>{c.name}<i>›</i></button>)}</div>
   <button className="adminBtn" onClick={()=>setAdmin(!admin)}><Settings size={17}/> Admin Panel</button>
  </aside>
  <main><header><div><span className="eyebrow">DIGITAL MARKETPLACE</span><h1>Premium digital products.</h1></div><div className="headerRight"><div className="search"><Search size={17}/><input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/></div><button className="iconBtn"><ShoppingBag size={20}/></button></div></header>
   {admin?<Admin orders={orders} setOrders={setOrders}/>:<><section className="hero"><div><span>CURATED COLLECTION</span><h2>Build your digital<br/><em>toolkit.</em></h2><p>Instant access to premium software, templates, assets and resources.</p></div><div className="heroOrb">50<span>+</span><small>CATEGORIES</small></div></section>
   <div className="toolbar"><div><span>Showing</span> <b>{cats.find(x=>x.id===cat)?.name||'Products'}</b></div><span>{shown.length} products</span></div>
   <div className="grid">{shown.length?shown.map(p=><Product key={p.id} p={p}/>):Array.from({length:12},(_,i)=><DemoProduct key={i} i={i}/>)}</div></>}
  </main>
 </div>
}
function DemoProduct({i}){return <div className="card"><div className="cover"><div className="coverIcon"><Package size={30}/></div><span>DIGITAL</span></div><div className="cardBody"><small>PRODUCT {String(i+1).padStart(2,'0')}</small><h3>Premium Digital Resource</h3><p>Ready-to-use digital product for your workflow.</p><div className="buyRow"><strong>{[5,8,12,15][i%4]} USDT</strong><button>BUY NOW <ExternalLink size={14}/></button></div></div></div>}
function Product({p}){return <div className="card"><div className="cover">{p.image_url?<img src={p.image_url}/>:<div className="coverIcon"><Package size={30}/></div>}<span>DIGITAL</span></div><div className="cardBody"><small>PRODUCT #{p.id}</small><h3>{p.name}</h3><p>{p.description}</p><div className="buyRow"><strong>{p.price} {p.currency}</strong><button onClick={()=>alert('Payment flow: add QR + payment reference in the next setup step.')}>BUY NOW <ExternalLink size={14}/></button></div></div></div>}
function Admin({orders,setOrders}){useEffect(()=>{api('/orders').then(setOrders).catch(()=>{})},[]);return <section className="admin"><div className="adminHead"><div><span className="eyebrow">CONTROL CENTER</span><h2>Admin Panel</h2></div><button className="primary"><Plus size={17}/> Add Product</button></div><div className="stats"><div><Package/><b>2,500</b><span>Product capacity</span></div><div><LayoutGrid/><b>50</b><span>Categories</span></div><div><ShoppingBag/><b>{orders.length}</b><span>Orders</span></div><div><ShieldCheck/><b>Manual</b><span>Payment verification</span></div></div><div className="panel"><h3>Recent Orders</h3>{orders.length?orders.map(o=><div className="order"><b>{o.order_code}</b><span>{o.status}</span><small>{o.customer_email||'Customer'}</small></div>):<div className="empty">No orders yet. Orders will appear here after customers submit payment references.</div>}</div></section>}
createRoot(document.getElementById('root')).render(<App/>)
