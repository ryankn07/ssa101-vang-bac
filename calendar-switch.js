/* Vàng Bạc - two Vang Bac team-member calendars in one swipeable panel. */
(() => {
  "use strict";
  const root=document.getElementById("vb-calendar-switcher");
  const viewport=document.getElementById("vb-slide-viewport");
  if(!root||!viewport)return;
  const panels=[...root.querySelectorAll(".vb-calendar-slide")];
  const tabs=[...root.querySelectorAll("[data-vb-slide]")];
  const prev=root.querySelector("[data-vb-prev]");
  const next=root.querySelector("[data-vb-next]");
  const counter=document.getElementById("vb-switch-counter");
  if(panels.length!==2||tabs.length!==2)return;
  let active=0,scrollFrame=0,heightFrame=0,lastHeight=0;
  const labels=["THÀNH VIÊN 01","THÀNH VIÊN 02"];
  // Layout-neutral optimization: write the same height only when it changes.
  // Repeated identical writes can retrigger ResizeObserver and force layout work.
  function height(){
    const h=Math.ceil(panels[active].scrollHeight);
    if(h>0 && h!==lastHeight){
      viewport.style.height=h+"px";
      lastHeight=h;
    }
  }
  function requestHeight(){
    if(heightFrame)return;
    heightFrame=requestAnimationFrame(()=>{
      heightFrame=0;
      height();
    });
  }
  function state(i){
    i=Math.max(0,Math.min(panels.length-1,i));
    if(active!==i)active=i;
    tabs.forEach((t,n)=>{
      t.setAttribute("aria-selected",String(n===i));
      t.tabIndex=n===i?0:-1;
    });
    panels.forEach((p,n)=>{
      p.setAttribute("aria-hidden",String(n!==i));
      if(n===i)p.removeAttribute("inert");
      else p.setAttribute("inert","");
    });
    if(prev)prev.disabled=i===0;
    if(next)next.disabled=i===panels.length-1;
    if(counter)counter.textContent=String(i+1).padStart(2,"0")+" / 02 · "+labels[i];
    requestHeight();
  }
  // Changing a tall calendar into a shorter one changes document height.
  // Return to the calendar controls BEFORE collapsing the old slide; otherwise
  // a click from the bottom lands at the unrelated video section below.
  let switching=false;
  function topOfCalendar(){
    const header=document.querySelector(".site-header");
    const offset=(header?header.getBoundingClientRect().height:0)+14;
    return Math.max(0,Math.round(root.getBoundingClientRect().top+window.scrollY-offset));
  }
  function go(i){
    i=Math.max(0,Math.min(panels.length-1,i));
    if(i===active)return;
    const targetY=topOfCalendar();
    switching=true;
    window.scrollTo({top:targetY,left:0,behavior:"instant"});
    viewport.scrollTo({left:i*viewport.clientWidth,behavior:"instant"});
    state(i);
    height();
    requestAnimationFrame(()=>{
      // Re-assert the viewport position after the slide has changed height.
      window.scrollTo({top:targetY,left:0,behavior:"instant"});
      switching=false;
    });
  }
  tabs.forEach((t,i)=>{
    t.addEventListener("click",()=>go(i));
    t.addEventListener("keydown",event=>{
      if(event.key!=="ArrowRight"&&event.key!=="ArrowLeft")return;
      event.preventDefault();
      const nextIndex=(i+(event.key==="ArrowRight"?1:-1)+panels.length)%panels.length;
      go(nextIndex);tabs[nextIndex].focus();
    });
  });
  if(prev)prev.addEventListener("click",()=>go(active-1));
  if(next)next.addEventListener("click",()=>go(active+1));
  viewport.addEventListener("scroll",()=>{
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{
      scrollFrame=0;
      if(switching)return;
      const w=viewport.clientWidth;
      if(w>0){const candidate=Math.max(0,Math.min(1,Math.round(viewport.scrollLeft/w)));if(candidate!==active)state(candidate);}
    });
  },{passive:true});
  window.addEventListener("resize",()=>{
    viewport.scrollLeft=active*viewport.clientWidth;
    requestHeight();
  },{passive:true});
  if("ResizeObserver" in window){
    const observer=new ResizeObserver(()=>requestHeight());
    panels.forEach(panel=>observer.observe(panel));
  }
  panels.forEach(panel=>panel.querySelectorAll("img").forEach(img=>img.addEventListener("load",requestHeight,{once:true})));
  state(0);
  viewport.scrollLeft=0;
  window.addEventListener("load",height,{once:true});
})();
