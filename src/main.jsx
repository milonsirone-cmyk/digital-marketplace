import React,{useEffect,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Search,ShoppingBag,LayoutGrid,Settings,Package,ShieldCheck,Plus,ExternalLink} from 'lucide-react'
import './style.css'

const api=async(path,opt={})=>{const r=await fetch('/api'+path,{headers:{'Content-Type':'application/json'},...opt}); if(!r.ok) throw Error(await r.text()); return r.json()}
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
function Product({ p }) {
  const [showPayment, setShowPayment] = React.useState(false);
  const [customerName, setCustomerName] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [paymentReference, setPaymentReference] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const walletAddress = '0xa984e6afb2cc69ad1d7431132f4eb95b9c0fe78a';

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      alert('Wallet address copied!');
    } catch (error) {
      alert('Address copy করা যায়নি।');
    }
  };

  const handleOrder = async () => {
    if (!customerName.trim()) {
      alert('আপনার নাম লিখুন।');
      return;
    }

    if (!customerEmail.trim()) {
      alert('আপনার Email লিখুন।');
      return;
    }

    if (!paymentReference.trim()) {
      alert('Payment Reference / TXID লিখুন।');
      return;
    }

    try {
      setSubmitting(true);

      const order = await api('/orders', {
        method: 'POST',
        body: JSON.stringify({
          product_id: p.id,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          payment_reference: paymentReference.trim()
        })
      });

      alert(
        `Order submitted successfully!\n\n` +
        `Order: ${order.order_code}\n` +
        `Status: ${order.status}\n` +
        `Amount: ${order.amount} ${order.currency}`
      );

      setShowPayment(false);
      setCustomerName('');
      setCustomerEmail('');
      setPaymentReference('');

    } catch (error) {
      console.error(error);
      alert('Order তৈরি করা যায়নি।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="cover">
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} />
          ) : (
            <div className="coverIcon">
              <Package size={30} />
            </div>
          )}

          <span>DIGITAL</span>
        </div>

        <div className="cardBody">
          <small>PRODUCT #{p.id}</small>

          <h3>{p.name}</h3>

          <p>{p.description}</p>

          <div className="buyRow">
            <strong>
              {p.price} {p.currency}
            </strong>

            <button
              onClick={() => setShowPayment(true)}
            >
              BUY NOW <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 99999,
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '95vh',
              overflowY: 'auto',
              background: '#fff',
              color: '#111',
              borderRadius: '20px',
              padding: '25px',
              boxSizing: 'border-box'
            }}
          >

            <button
              onClick={() => setShowPayment(false)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '12px',
                width: '38px',
                height: '38px',
                border: 'none',
                borderRadius: '50%',
                background: '#eee',
                fontSize: '25px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>

            <h2>Complete Your Payment</h2>

            <p>
              Product: <strong>{p.name}</strong>
            </p>

            <p>
              Amount:
              <strong>
                {' '}{p.price} {p.currency}
              </strong>
            </p>

            <hr />

            <h3>1. Your Information</h3>

            <input
              type="text"
              placeholder="আপনার নাম"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '13px',
                marginBottom: '12px',
                boxSizing: 'border-box',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />

            <input
              type="email"
              placeholder="আপনার Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '13px',
                marginBottom: '20px',
                boxSizing: 'border-box',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />

            <h3>2. Pay USDT</h3>

            <p>
              <strong>Network:</strong> BNB Smart Chain (BEP20)
            </p>

            <div
              style={{
                background: '#f5f5f5',
                padding: '12px',
                borderRadius: '10px',
                marginBottom: '15px'
              }}
            >
              <strong>Wallet Address:</strong>

              <div
                style={{
                  marginTop: '8px',
                  wordBreak: 'break-all',
                  fontSize: '13px'
                }}
              >
                {walletAddress}
              </div>

              <button
                onClick={copyAddress}
                style={{
                  marginTop: '10px',
                  padding: '9px 15px',
                  border: 'none',
                  borderRadius: '7px',
                  background: '#222',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Copy Address
              </button>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '15px 0'
              }}
            >
              <p>
                <strong>Scan QR Code to Pay</strong>
              </p>

              <img
                src="/payment-qr.jpg"
                alt="USDT BEP20 QR Code"
                style={{
                  width: '240px',
                  maxWidth: '100%',
                  height: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: '10px'
                }}
              />
            </div>

            <div
              style={{
                background: '#fff4d6',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '18px',
                fontSize: '14px'
              }}
            >
              ⚠️ শুধু <strong>USDT</strong> পাঠাবেন এবং অবশ্যই
              <strong> BEP20 / BNB Smart Chain</strong> network ব্যবহার করবেন।
            </div>

            <h3>3. Payment Reference / TXID</h3>

            <input
              type="text"
              placeholder="Payment TXID / Reference"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              style={{
                width: '100%',
                padding: '13px',
                marginBottom: '15px',
                boxSizing: 'border-box',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />

            <button
              onClick={handleOrder}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '15px',
                border: 'none',
                borderRadius: '10px',
                background: '#111',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {submitting
                ? 'Submitting...'
                : 'I HAVE PAID — SUBMIT ORDER'}
            </button>

            <p
              style={{
                textAlign: 'center',
                color: '#777',
                fontSize: '13px',
                marginTop: '12px'
              }}
            >
              Order will remain Pending until payment is verified.
            </p>

          </div>
        </div>
      )}
    </>
  );
}
function Admin({orders,setOrders}){useEffect(()=>{api('/orders').then(setOrders).catch(()=>{})},[]);return <section className="admin"><div className="adminHead"><div><span className="eyebrow">CONTROL CENTER</span><h2>Admin Panel</h2></div><button className="primary"><Plus size={17}/> Add Product</button></div><div className="stats"><div><Package/><b>2,500</b><span>Product capacity</span></div><div><LayoutGrid/><b>50</b><span>Categories</span></div><div><ShoppingBag/><b>{orders.length}</b><span>Orders</span></div><div><ShieldCheck/><b>Manual</b><span>Payment verification</span></div></div><div className="panel"><h3>Recent Orders</h3>{orders.length?orders.map(o=><div className="order"><b>{o.order_code}</b><span>{o.status}</span><small>{o.customer_email||'Customer'}</small></div>):<div className="empty">No orders yet. Orders will appear here after customers submit payment references.</div>}</div></section>}
createRoot(document.getElementById('root')).render(<App/>)
