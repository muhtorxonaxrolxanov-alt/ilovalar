/* Kirish tekshiruvi. Har sahifaning boshida ulanadi. */
(function(){
  var PROD=(window.HK_PROD==='nv'||window.HK_PROD==='ed')?window.HK_PROD:'hk',K=PROD==='hk'?'hk_lic':PROD+'_lic';
  window.HK_VER=29;
  window.HK={VER:25,FAR:4102444800000,PROD:PROD,
    lic:function(){try{return JSON.parse(localStorage.getItem(K)||'null')}catch(e){return null}},
    set:function(o){try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}},
    clear:function(){try{localStorage.removeItem(K)}catch(e){}},
    trade:function(){var l=window.HK.lic();return(l&&l.trade)||'elektrik'},
    TRADES:{elektrik:'Elektrik',santexnik:'Santexnik',quruvchi:'Quruvchi',boshqa:'Boshqa soha'}};

  /* Bot bilan gaplashish (Firestore gate/{raqam}) va parol xeshi */
  var CFG={apiKey:'AIzaSyDENPKhLmgEFNOW13lCIlHkXF6loJ87UuU',projectId:'elektrik-hisob'},G={idt:'',exp:0},stopF=false;
  function jf(url,opt){return fetch(url,opt).then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(!r.ok){var e=new Error((j.error&&(j.error.message||j.error.status))||('HTTP '+r.status));e.code=r.status;throw e}return j})})}
  function gtok(){if(G.idt&&Date.now()<G.exp-60000)return Promise.resolve(G.idt);
    return jf('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+CFG.apiKey,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'gate@hisobkitob.app',password:'hk-gate-7421',returnSecureToken:true})}).then(function(j){G.idt=j.idToken;G.exp=Date.now()+(+j.expiresIn||3600)*1000;return G.idt})}
  function dU(p){return 'https://firestore.googleapis.com/v1/projects/'+CFG.projectId+'/databases/(default)/documents/gate/'+p}
  function nn(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
  window.HK.cfg=CFG;window.HK.jf=jf;window.HK.nn=nn;
  window.HK.cancel=function(){stopF=true};
  window.HK.dev=function(){try{var d=localStorage.getItem('hk_dev');if(!d){d=(Math.random().toString(36).slice(2)+Date.now().toString(36)).slice(0,20);localStorage.setItem('hk_dev',d)}return d}catch(e){return 'x'+Math.random().toString(36).slice(2,10)}};
  window.HK.poll=function(phone,n,maxMs,skipWait){var t0=Date.now();maxMs=maxMs||25000;
    return new Promise(function(ok,no){(function tick(){if(stopF)return no(new Error('stop'));
      gtok().then(function(t){return jf(dU(phone),{headers:{Authorization:'Bearer '+t}})}).then(function(j){var f=j.fields||{},r=null;try{r=JSON.parse((f.res||{}).stringValue)}catch(e){}
        if(r&&r.nonce===n&&!(skipWait&&r.st==='wait'))return ok(r);if(Date.now()-t0>maxMs)return no(new Error('Javob kelmadi. Bot ishlayotganini tekshiring.'));setTimeout(tick,Date.now()-t0>30000?4000:1500)}).catch(function(e){if(e.code===404){if(Date.now()-t0>maxMs)return no(new Error('Javob kelmadi'));return setTimeout(tick,Date.now()-t0>30000?4000:1500)}no(e)})})()})};
  window.HK.call=function(phone,obj,maxMs){stopF=false;var n=nn();obj.nonce=n;if(PROD!=='hk')obj.prod=PROD;
    /* req bilan birga server vaqti (t) yoziladi: bot faqat yangi so'rovlarni so'raydi (bepul limit tejaladi) */
    var base='projects/'+CFG.projectId+'/databases/(default)/documents';
    return gtok().then(function(t){return jf('https://firestore.googleapis.com/v1/'+base+':commit',{method:'POST',headers:{'content-type':'application/json',Authorization:'Bearer '+t},
      body:JSON.stringify({writes:[{update:{name:base+'/gate/'+phone,fields:{req:{stringValue:JSON.stringify(obj)}}},updateMask:{fieldPaths:['req']},updateTransforms:[{fieldPath:'t',setToServerValue:'REQUEST_TIME'}]}]})})}).then(function(){return window.HK.poll(phone,n,maxMs)})};
  /* SHA-256 (parol xeshi: telefon+parol; bot uni yana alohida saqlaydi) */
  function sha(s){var u=unescape(encodeURIComponent(s)),b=[],i,K=[],H=[],w=[];for(i=0;i<u.length;i++)b[i>>2]|=u.charCodeAt(i)<<(24-8*(i%4));
    var L=u.length*8;b[L>>5]|=0x80<<(24-L%32);b[(((L+64)>>9)<<4)+15]=L;
    var pr=[],c=2;while(pr.length<64){var is=1;for(var q=0;q<pr.length;q++)if(c%pr[q]===0){is=0;break}if(is)pr.push(c);c++}
    for(i=0;i<64;i++)K[i]=(Math.pow(pr[i],1/3)%1)*4294967296|0;for(i=0;i<8;i++)H[i]=(Math.pow(pr[i],1/2)%1)*4294967296|0;
    function R(x,n){return(x>>>n)|(x<<(32-n))}
    for(var o=0;o<b.length;o+=16){var a=H.slice(0),t;for(i=0;i<64;i++){if(i<16)w[i]=b[o+i]|0;else{var s0=R(w[i-15],7)^R(w[i-15],18)^(w[i-15]>>>3),s1=R(w[i-2],17)^R(w[i-2],19)^(w[i-2]>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)|0}
      var S1=R(a[4],6)^R(a[4],11)^R(a[4],25),ch=(a[4]&a[5])^(~a[4]&a[6]),t1=(a[7]+S1+ch+K[i]+w[i])|0,S0=R(a[0],2)^R(a[0],13)^R(a[0],22),mj=(a[0]&a[1])^(a[0]&a[2])^(a[1]&a[2]),t2=(S0+mj)|0;
      a=[(t1+t2)|0,a[0],a[1],a[2],(a[3]+t1)|0,a[4],a[5],a[6]]}
      for(i=0;i<8;i++)H[i]=(H[i]+a[i])|0}
    return H.map(function(x){return('00000000'+(x>>>0).toString(16)).slice(-8)}).join('')}
  window.HK.hash=function(phone,pw){return sha('hk1:'+phone+':'+pw)};
  var l=window.HK.lic();
  var ok=l&&l.ok&&l.until>Date.now();
  if(PROD==='hk'&&!ok&&!/gate\.html$/.test(location.pathname)){location.replace('gate.html')}
})();
