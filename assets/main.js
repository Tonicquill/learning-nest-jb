/* Edusky Private School — Interactive Features */

document.addEventListener('DOMContentLoaded',function(){

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
          it.el.style.display=(filter==='all'||it.cat===filter)?'block':'none';
        });
      });
    });
    items.forEach((it,idx)=>{
      it.addEventListener('click',()=>{
        const visible=allItems.filter(x=>x.el.style.display!=='none');
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

  /* ===== SCROLL-SCRUB VIDEOS (Approach A) ===== */
  const scrubVideos=Array.from(document.querySelectorAll('video[data-scroll-video]'));
  if(scrubVideos.length){
    const scrubData=[];
    scrubVideos.forEach(v=>{
      const section=v.closest('section');
      if(!section)return;
      v.pause();v.muted=true;v.playsInline=true;v.preload='auto';
      scrubData.push({v,section});
    });
    let ticking=false;
    function onScrollScrub(){
      if(!ticking){
        requestAnimationFrame(()=>{
          const wh=window.innerHeight;
          scrubData.forEach(({v,section})=>{
            if(!v.duration)return;
            const rect=section.getBoundingClientRect();
            const visible=rect.bottom>0&&rect.top<wh;
            if(!visible)return;
            const progress=Math.max(0,Math.min(1,(wh-rect.top)/(wh+rect.height)));
            const target=progress*v.duration;
            if(Math.abs(v.currentTime-target)>0.03){v.currentTime=target;}
          });
          ticking=false;
        });
        ticking=true;
      }
    }
    window.addEventListener('scroll',onScrollScrub,{passive:true});
    window.addEventListener('resize',onScrollScrub,{passive:true});
    onScrollScrub();
  }

  /* ===== STAGGER REVEAL OBSERVER ===== */
  document.querySelectorAll('.stagger-reveal').forEach(el=>{
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
    },{threshold:0.1});
    io.observe(el);
  });

});
