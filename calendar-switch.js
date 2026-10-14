/* Vàng Bạc - two independent calendars in one swipeable panel. */
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
  let active=0,scrollFrame=0;
  const labels=["LỊCH CỦA TÔI","LỊCH THÀNH VIÊN"];
  function height(){
    const h=Math.ceil(panels[active].scrollHeight);
    if(h>0)viewport.style.height=h+"px";
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
    requestAnimationFrame(height);
  }
  function go(i,behavior="smooth"){
    i=Math.max(0,Math.min(panels.length-1,i));
    state(i);
    viewport.scrollTo({left:i*viewport.clientWidth,behavior});
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
      const w=viewport.clientWidth;
      if(w>0){const candidate=Math.max(0,Math.min(1,Math.round(viewport.scrollLeft/w)));if(candidate!==active)state(candidate);}
    });
  },{passive:true});
  window.addEventListener("resize",()=>{
    viewport.scrollLeft=active*viewport.clientWidth;
    requestAnimationFrame(height);
  },{passive:true});
  if("ResizeObserver" in window){
    const observer=new ResizeObserver(()=>requestAnimationFrame(height));
    panels.forEach(panel=>observer.observe(panel));
  }
  panels.forEach(panel=>panel.querySelectorAll("img").forEach(img=>img.addEventListener("load",height,{once:true})));
  state(0);
  viewport.scrollLeft=0;
  window.addEventListener("load",height,{once:true});
})();
