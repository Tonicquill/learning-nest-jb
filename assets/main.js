/* Edusky Private School — Interactive Features */

document.addEventListener('DOMContentLoaded',function(){

  /* ===== CRAYON SCRATCH BACKGROUND ===== */
  if(document.body.classList.contains('crayon-theme')){
    const scratch=document.createElement('div');
    scratch.className='crayon-scratch';
    document.body.appendChild(scratch);
  }

  /* ===== SCROLL REVEAL ===== */
  const reveals=document.querySelectorAll('.reveal');
  if(reveals.length){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
    },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(el=>io.observe(el));
  }

  /* ===== NAV SCROLL SHADOW ===== */
  const nav=document.getElementById('nav');
  if(nav){
    window.addEventListener('scroll',()=>{
      nav.classList.toggle('scrolled',window.scrollY>10);
    },{passive:true});
  }

  /* ===== MOBILE NAV TOGGLE ===== */
  const toggle=document.getElementById('navToggle');
  const mobileNav=document.getElementById('mobileNav');
  if(toggle&&mobileNav){
    toggle.addEventListener('click',()=>{
      mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-label',mobileNav.classList.contains('open')?'Close menu':'Open menu');
    });
    mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));
  }

  /* ===== COUNTER ANIMATION ===== */
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

  /* ===== ACCORDION ===== */
  document.querySelectorAll('.accordion-header').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const parent=btn.closest('.accordion');
      const wasOpen=parent.classList.contains('open');
      document.querySelectorAll('.accordion.open').forEach(a=>a.classList.remove('open'));
      if(!wasOpen)parent.classList.add('open');
    });
  });

  /* ===== TABS ===== */
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

  /* ===== SMOOTH SCROLL WITH OFFSET ===== */
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

  /* ===== ACTIVE NAV LINK DETECTION ===== */
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

  /* ===== BACK-TO-TOP ===== */
  const backToTop=document.querySelector('.back-to-top');
  if(backToTop){
    window.addEventListener('scroll',()=>{
      backToTop.classList.toggle('visible',window.scrollY>600);
    },{passive:true});
    backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  /* ===== PLANNING POPUP (NOT FOR PUBLIC) ===== */
  const planningOverlay=document.getElementById('planningOverlay');
  const planningModal=document.getElementById('planningModal');
  const planningClose=document.getElementById('planningClose');
  if(planningOverlay&&planningModal){
    planningOverlay.style.display='block';
    planningModal.style.display='block';
    const hidePlanning=()=>{
      planningOverlay.style.display='none';
      planningModal.style.display='none';
    };
    if(planningClose)planningClose.addEventListener('click',hidePlanning);
    planningOverlay.addEventListener('click',hidePlanning);
  }

  /* ===== LIGHTBOX ===== */
  const lightbox=document.getElementById('lightbox');
  const lbImg=document.getElementById('lightboxImg');
  const lbCap=document.getElementById('lightboxCaption');
  const lbClose=document.getElementById('lightboxClose');
  const lbPrev=document.getElementById('lightboxPrev');
  const lbNext=document.getElementById('lightboxNext');
  let lbItems=[];
  let lbIndex=0;
  function openLightbox(src,caption,i,items){
    if(!lightbox||!lbImg)return;
    lbItems=items||[];
    lbIndex=i||0;
    lbImg.src=src;
    lbCap.textContent=caption||'';
    lightbox.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeLightbox(){
    if(!lightbox)return;
    lightbox.classList.remove('open');
    document.body.style.overflow='';
  }
  function lbStep(dir){
    if(!lbItems.length)return;
    lbIndex=(lbIndex+dir+lbItems.length)%lbItems.length;
    const item=lbItems[lbIndex];
    lbImg.src=item.src;
    lbCap.textContent=item.caption||'';
  }
  if(lbClose)lbClose.addEventListener('click',closeLightbox);
  if(lbPrev)lbPrev.addEventListener('click',e=>{e.stopPropagation();lbStep(-1);});
  if(lbNext)lbNext.addEventListener('click',e=>{e.stopPropagation();lbStep(1);});
  if(lightbox)lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
  document.addEventListener('keydown',e=>{
    if(!lightbox||!lightbox.classList.contains('open'))return;
    if(e.key==='Escape')closeLightbox();
    if(e.key==='ArrowLeft')lbStep(-1);
    if(e.key==='ArrowRight')lbStep(1);
  });

  /* ===== GALLERY FILTERS ===== */
  const masonryWrap=document.querySelector('.masonry');
  if(masonryWrap){
    const items=Array.from(masonryWrap.querySelectorAll('.masonry-item'));
    const allItems=items.map(it=>({el:it,src:it.querySelector('img')?.src||'',caption:it.querySelector('.masonry-cap')?.textContent||'',cat:it.dataset.category||'all'}));
    document.querySelectorAll('.gallery-filter-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.gallery-filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const filter=btn.dataset.filter||'all';
        allItems.forEach(it=>{
          const show=filter==='all'||it.cat===filter;
          it.el.classList.toggle('masonry-hidden',!show);
          if(show){it.el.classList.add('visible');}
        });
        // force masonry reflow for CSS columns
        masonryWrap.style.transform='translateZ(0)';
        requestAnimationFrame(()=>{
          masonryWrap.style.transform='';
        });
      });
    });
    items.forEach((it,idx)=>{
      it.addEventListener('click',()=>{
        const visible=allItems.filter(x=>!x.el.classList.contains('masonry-hidden'));
        const vIdx=visible.findIndex(x=>x.el===it);
        openLightbox(allItems[idx].src,allItems[idx].caption,vIdx,visible);
      });
    });
  }

  /* ===== DIRECTORY FILTERS ===== */
  const directoryWrap=document.querySelector('.directory-grid');
  if(directoryWrap){
    const cards=Array.from(directoryWrap.querySelectorAll('.directory-card'));
    document.querySelectorAll('.directory-filter-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.directory-filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const filter=btn.dataset.filter||'all';
        cards.forEach(card=>{
          const cat=card.dataset.category||'all';
          card.style.display=(filter==='all'||cat===filter)?'block':'none';
        });
      });
    });
  }

  /* ===== FEE CALCULATOR ===== */
  const feeCalcWrap=document.getElementById('feeCalculator');
  if(feeCalcWrap){
    const stdSelect=document.getElementById('calcStandard');
    const mealsCheck=document.getElementById('calcMeals');
    const transportCheck=document.getElementById('calcTransport');
    const siblingCheck=document.getElementById('calcSibling');
    const outTotal=document.getElementById('calcTotal');
    const outBreakdown=document.getElementById('calcBreakdown');
    const baseFees={1:8000,2:9000,3:10000,4:12000,5:14000,6:15000};
    const regFee=500,deposit=1500,matFee=800,mealFee=1200,transportFee=1500;
    function updateFee(){
      const std=parseInt(stdSelect?.value||0,10);
      let tuition=baseFees[std]||0;
      let meals=mealsCheck?.checked?mealFee:0;
      let transport=transportCheck?.checked?transportFee:0;
      let discount=siblingCheck?.checked?Math.round(tuition*0.1):0;
      let total=regFee+deposit+matFee+tuition+meals+transport-discount;
      if(outTotal)outTotal.textContent='RM '+total.toLocaleString();
      if(outBreakdown){
        outBreakdown.innerHTML=
          '<div class="fee-calc-row"><span class="fee-label">Registration</span><span class="fee-val">RM '+regFee.toLocaleString()+'</span></div>'+
          '<div class="fee-calc-row"><span class="fee-label">Deposit</span><span class="fee-val">RM '+deposit.toLocaleString()+'</span></div>'+
          '<div class="fee-calc-row"><span class="fee-label">Materials & Books</span><span class="fee-val">RM '+matFee.toLocaleString()+'</span></div>'+
          '<div class="fee-calc-row"><span class="fee-label">Tuition (Std '+std+')</span><span class="fee-val">RM '+tuition.toLocaleString()+'</span></div>'+
          (meals?'<div class="fee-calc-row"><span class="fee-label">Meals</span><span class="fee-val">RM '+meals.toLocaleString()+'</span></div>':'')+
          (transport?'<div class="fee-calc-row"><span class="fee-label">Transport</span><span class="fee-val">RM '+transport.toLocaleString()+'</span></div>':'')+
          (discount?'<div class="fee-calc-row"><span class="fee-label">Sibling Discount</span><span class="fee-val" style="color:var(--green)">-RM '+discount.toLocaleString()+'</span></div>':'')+
          '<div class="fee-calc-total"><span class="fee-label">Estimated Total</span><span class="fee-val">RM '+total.toLocaleString()+'</span></div>';
      }
    }
    [stdSelect,mealsCheck,transportCheck,siblingCheck].forEach(el=>{if(el)el.addEventListener('change',updateFee);});
    updateFee();
  }

  /* ===== NEWSLETTER MODAL ===== */
  const nlModal=document.getElementById('newsletterModal');
  if(nlModal&&!localStorage.getItem('nlDismissed')){
    setTimeout(()=>{
      if(!document.getElementById('planningModal')||getComputedStyle(document.getElementById('planningModal')).display==='none'){
        nlModal.classList.add('open');
      }
    },8000);
    nlModal.querySelector('.nl-close')?.addEventListener('click',()=>{nlModal.classList.remove('open');localStorage.setItem('nlDismissed','1');});
    nlModal.addEventListener('click',e=>{if(e.target===nlModal){nlModal.classList.remove('open');localStorage.setItem('nlDismissed','1');}});
  }

  /* ===== COOKIE BANNER ===== */
  const cookieBanner=document.getElementById('cookieBanner');
  if(cookieBanner&&!localStorage.getItem('cookiesAccepted')){
    cookieBanner.style.display='flex';
    document.getElementById('cookieAccept')?.addEventListener('click',()=>{
      cookieBanner.style.display='none';
      localStorage.setItem('cookiesAccepted','1');
    });
  }else if(cookieBanner){
    cookieBanner.style.display='none';
  }

  /* ===== CALENDAR TOGGLE ===== */
  const calToggle=document.querySelector('.calendar-toggle');
  if(calToggle){
    calToggle.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click',()=>{
        calToggle.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const view=btn.dataset.view;
        document.querySelectorAll('.calendar-view').forEach(v=>v.classList.toggle('active',v.id==='cal'+view.charAt(0).toUpperCase()+view.slice(1)));
      });
    });
  }

  /* ===== INJECT BUILDER CREDIT ===== */
  const credit=document.createElement('div');
  credit.className='builder-credit';
  credit.innerHTML='Built by <strong>Teacher Bryan</strong>';
  document.body.appendChild(credit);

  /* ===== HERO PARALLAX ===== */
  document.querySelectorAll('.hero-bg-parallax').forEach(bg=>{
    const parent=bg.closest('.hero')||bg.closest('.page-hero');
    if(!parent)return;
    parent.addEventListener('mousemove',e=>{
      const x=(e.clientX/window.innerWidth-0.5)*-12;
      const y=(e.clientY/window.innerHeight-0.5)*-12;
      bg.style.transform=`translate(${x}px,${y}px) scale(1.04)`;
    },{passive:true});
    window.addEventListener('scroll',()=>{
      const rect=parent.getBoundingClientRect();
      if(rect.bottom>0&&rect.top<window.innerHeight){
        bg.style.transform=`translateY(${rect.top*0.25}px) scale(1.04)`;
      }
    },{passive:true});
  });

  /* ===== CRAYON CURSOR TRAIL ===== */
  const trailColors=['#4A90D9','#F9A107','#FF6B6B','#669F38'];
  const trailShapes=['✦','⭐','✨','\u{1F31F}','\u{1F4AB}'];
  let trailIdx=0,lastTrail=0;
  document.addEventListener('mousemove',e=>{
    const now=performance.now();
    if(now-lastTrail<30)return;
    lastTrail=now;
    const d=document.createElement('div');
    d.className='crayon-trail';
    const size=Math.random()*24+20;
    d.style.fontSize=size+'px';
    d.style.left=e.clientX+'px';
    d.style.top=e.clientY+'px';
    d.style.color=trailColors[trailIdx%trailColors.length];
    d.textContent=trailShapes[Math.floor(Math.random()*trailShapes.length)];
    d.style.transform=`translate(-50%,-50%) rotate(${Math.random()*360}deg)`;
    d.style.animation=`trailSpinFade ${0.6+Math.random()*0.4}s cubic-bezier(0.16,1,0.3,1) forwards`;
    trailIdx++;
    document.body.appendChild(d);
    setTimeout(()=>d.remove(),1100);
  });

  /* ===== FLIP-BOOK RANDOM DELAYS ===== */
  const flipSelectors=['.scribble-underline-jagged','.scribble-underline-wavy','.scribble-underline-double','.pencil-underline','.art-highlight','.art-highlight-messy','.crayon-star-hand','.crayon-star','.crayon-smudge','.crayon-circle-hand','.crayon-box','.crayon-stamp','.crayon-check','.crayon-quote','.crayon-dot'];
  flipSelectors.forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>{
      el.style.setProperty('--flip-delay',(Math.random()*0.4).toFixed(3)+'s');
    });
  });

  /* ===== STAGGER REVEAL OBSERVER ===== */
  document.querySelectorAll('.stagger-reveal').forEach(el=>{
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
    },{threshold:0.1});
    io.observe(el);
  });

  /* ===== SCROLL DRAW-ON OBSERVER ===== */
  const drawOnSelectors=['.scribble-underline-jagged','.scribble-underline-wavy','.scribble-underline-double','.pencil-underline','.art-highlight','.art-highlight-messy'];
  drawOnSelectors.forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>{
      const parent=el.closest('section')||el.closest('div')||el.parentElement;
      if(!parent)return;
      parent.classList.add('draw-on-target');
    });
  });
  const drawIo=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('drawn');
        drawIo.unobserve(e.target);
      }
    });
  },{threshold:0.15,rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.draw-on-target').forEach(el=>drawIo.observe(el));

});
