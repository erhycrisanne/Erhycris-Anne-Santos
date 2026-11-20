(function(){
  var r=document.documentElement,b=document.getElementById('theme');
  try{var s=localStorage.getItem('theme');if(s)r.setAttribute('data-theme',s)}catch(e){}
  b.addEventListener('click',function(){
    var cur=r.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
    var nx=cur==='dark'?'light':'dark';r.setAttribute('data-theme',nx);
    try{localStorage.setItem('theme',nx)}catch(e){}
  });
  document.getElementById('y').textContent=new Date().getFullYear();
})();

// Simple page router using #home, #about, #portfolio, #contact
var net;
(function(){
  var ids=['home','about','portfolio','contact'];
  function route(){
    var h=(location.hash||'#home').slice(1);if(ids.indexOf(h)<0)h='home';
    ids.forEach(function(i){
      document.getElementById(i).hidden=(i!==h);
      var l=document.querySelector('nav a[href="#'+i+'"]');
      if(i===h)l.setAttribute('aria-current','page');else l.removeAttribute('aria-current');
    });
    window.scrollTo(0,0);
    document.title=(h==='home'?'':h.charAt(0).toUpperCase()+h.slice(1)+' | ')+'Erhycris Anne Santos';
    document.querySelectorAll('.bar i').forEach(function(i){i.style.width='0'});
    if(h==='about')setTimeout(function(){document.querySelectorAll('.bar i').forEach(function(i){i.style.width=i.dataset.w+'%'})},150);
    if(h==='home'&&net)net();
  }
  addEventListener('hashchange',route);route();
})();

// Home: network of dots that moves away from the cursor
(function(){
  var c=document.getElementById('net'),x=c.getContext('2d'),P=[],m={x:-999,y:-999},W,H,D;
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches,run=false;
  function col(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
  function size(){D=Math.min(devicePixelRatio||1,2);W=c.clientWidth;H=c.clientHeight;if(!W)return;c.width=W*D;c.height=H*D;x.setTransform(D,0,0,D,0,0);
    P=[];var n=Math.round(W*H/16000);for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35})}
  function draw(){
    if(document.getElementById('home').hidden){run=false;return}
    x.clearRect(0,0,W,H);var a=col('--a'),b=col('--b');
    P.forEach(function(p){
      if(!still){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
      var dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);
      if(d<140&&!still){p.x+=dx/d*1.6;p.y+=dy/d*1.6}
      x.fillStyle=a;x.globalAlpha=.8;x.beginPath();x.arc(p.x,p.y,1.8,0,6.283);x.fill()});
    for(var i=0;i<P.length;i++)for(var j=i+1;j<P.length;j++){
      var d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);
      if(d<130){x.globalAlpha=(1-d/130)*.45;x.strokeStyle=b;x.lineWidth=1;x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(P[j].x,P[j].y);x.stroke()}}
    x.globalAlpha=1;if(!still)requestAnimationFrame(draw);else run=false}
  c.parentNode.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
  c.parentNode.addEventListener('pointerleave',function(){m.x=m.y=-999});
  net=function(){size();if(!run){run=true;draw()}};
  addEventListener('resize',function(){if(!document.getElementById('home').hidden)size()});
  if(!document.getElementById('home').hidden)net();
})();
