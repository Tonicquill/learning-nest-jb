/* Edusky Private School — Interactive Features */

document.addEventListener('DOMContentLoaded',function(){

  // Scroll reveal
  const reveals=document.querySelectorAll('.reveal');
  if(reveals.length){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
    },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(el=>io.observe(el));
  }

  // Nav scroll shadow
  const nav=document.getElementById('nav');
  if(nav){
    window.addEventListener('scroll',()=>{
      nav.classList.toggle('scrolled',window.scrollY>10);
    },{passive:true});
  }

  // Mobile nav toggle
  const toggle=document.getElementById('navToggle');
  const mobileNav=document.getElementById('mobileNav');
  if(toggle&&mobileNav){
    toggle.addEventListener('click',()=>{
      mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-label',mobileNav.classList.contains('open')?'Close menu':'Open menu');
    });
    mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));
  }

  // Counter animation
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=parseInt(el.dataset.count,10);
    if(!target)return;
    let started=false;
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting&&!started){
          started=true;
          let current=0;
          const duration=1800;
          const start=performance.now();
          const tick=now=>{
            const p=Math.min((now-start)/duration,1);
            const ease=1-Math.pow(1-p,3);
            current=Math.floor(ease*target);
            el.textContent=current+'+';
            if(p<1)requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    },{threshold:0.5});
    observer.observe(el);
  });

  // Accordion
  document.querySelectorAll('.accordion-header').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const parent=btn.closest('.accordion');
      const wasOpen=parent.classList.contains('open');
      document.querySelectorAll('.accordion.open').forEach(a=>a.classList.remove('open'));
      if(!wasOpen)parent.classList.add('open');
    });
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const tabs=btn.closest('.tabs');
      if(!tabs)return;
      const container=tabs.parentElement;
      tabs.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      container.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      const panel=container.querySelector('#'+btn.dataset.tab);
      if(panel)panel.classList.add('active');
    });
  });

  // Smooth scroll with nav offset
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const id=this.getAttribute('href').slice(1);
      const target=document.getElementById(id);
      if(target){
        e.preventDefault();
        const y=target.getBoundingClientRect().top+window.scrollY-80;
        window.scrollTo({top:y,behavior:'smooth'});
      }
    });
  });

  // Active nav link detection
  const links=document.querySelectorAll('.nav-links a');
  if(links.length>1){
    const sections=document.querySelectorAll('section[id]');
    const onScroll=()=>{
      let current='';
      sections.forEach(s=>{
        if(window.scrollY>=s.offsetTop-120)current=s.id;
      });
      links.forEach(l=>{
        l.classList.remove('active');
        if(current&&l.getAttribute('href')==='#'+current)l.classList.add('active');
      });
    };
    window.addEventListener('scroll',onScroll,{passive:true});
  }

});
