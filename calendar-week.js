/* Vàng Bạc | Static public-safe display from the calendar owner's own events.
   Week: Oct 5-11, 2026 (Asia/Ho_Chi_Minh). Not live sync, not completion data.
   Individual event IDs, links, account details, descriptions and places omitted. */
(() => {
  "use strict";
  const items = [[0,360,450,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[0,450,740,"Đi học trên trường (Slot 1 & 2)"],[0,740,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[0,915,960,"Tập đàn"],[0,975,1080,"Tự học"],[0,1080,1170,"Tập thể dục, tắm rửa & ăn tối"],[0,1170,1320,"Làm bài tập & ôn bài"],[0,1320,1380,"Thư giãn & chuẩn bị đi ngủ"],[1,360,450,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[1,450,740,"Đi học trên trường (Slot 1 & 2)"],[1,740,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[1,915,960,"Tập đàn"],[1,975,1080,"Tự học"],[1,1080,1170,"Tập thể dục, tắm rửa & ăn tối"],[1,1170,1320,"Làm bài tập & ôn bài"],[1,1320,1380,"Thư giãn & chuẩn bị đi ngủ"],[2,360,450,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[2,450,740,"Đi học trên trường (Slot 1 & 2)"],[2,740,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[2,915,960,"Tập đàn"],[2,975,1080,"Tự học"],[2,1080,1170,"Tập thể dục, tắm rửa & ăn tối"],[2,1170,1320,"Làm bài tập & ôn bài"],[2,1320,1380,"Thư giãn & chuẩn bị đi ngủ"],[3,360,450,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[3,450,740,"Đi học trên trường (Slot 1 & 2)"],[3,740,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[3,915,960,"Tập đàn"],[3,975,1080,"Tự học"],[3,1080,1170,"Tập thể dục, tắm rửa & ăn tối"],[3,1170,1290,"Làm bài tập & ôn bài"],[3,1290,1335,"Time Audit"],[3,1335,1380,"Thư giãn & chuẩn bị đi ngủ"],[4,360,450,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[4,450,740,"Đi học trên trường (Slot 1 & 2)"],[4,740,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[4,915,960,"Tập đàn"],[4,975,1065,"Tự học"],[4,1065,1155,"Tập thể dục, tắm rửa & ăn tối"],[4,1155,1305,"Làm bài tập ưu tiên & ôn bài"],[4,1305,1365,"Thư giãn & chuẩn bị đi ngủ"],[5,420,510,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[5,510,660,"Học ngoại ngữ & đọc sách"],[5,690,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[5,915,960,"Tập đàn"],[5,975,1080,"Tự học"],[5,1080,1170,"Tập thể dục, tắm rửa & ăn tối"],[5,1170,1305,"Giải trí & sinh hoạt cá nhân"],[5,1320,1380,"Thư giãn & chuẩn bị đi ngủ"],[6,420,510,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[6,510,660,"Học ngoại ngữ & đọc sách"],[6,690,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[6,915,960,"Tập đàn"],[6,975,1080,"Tự học"],[6,1080,1170,"Tập thể dục, tắm rửa & ăn tối"],[6,1170,1320,"Ôn tập & chuẩn bị bài tuần mới"],[6,1320,1380,"Thư giãn & chuẩn bị đi ngủ"]];
  const days = ["THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY", "CHỦ NHẬT"];
  const host = document.getElementById("vb-week-calendar");
  if (!host) return;
  const minStart=360, pxPerMinute=0.9, laneHeight=17*60*pxPerMinute;
  const c=(tag,cls,text) => {let el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
  const time=x=>String(Math.floor(x/60)).padStart(2,"0")+":"+String(x%60).padStart(2,"0");
  const cat=n=>/Time Audit/i.test(n)?"audit":/trường/i.test(n)?"school":/bài tập|ôn bài|ôn tập/i.test(n)?"assign":/tự học|ngoại ngữ/i.test(n)?"self":/đàn|đọc sách/i.test(n)?"hobby":/thể dục/i.test(n)?"sport":"rest";
  const wrapper=c("div","vb-calendar-scroll");wrapper.id="vb-calendar-scroll";wrapper.tabIndex=0;wrapper.setAttribute("aria-label","Lịch tuần từ ngày 5 đến 11 tháng 10, vuốt ngang để xem từng ngày");
  const grid=c("div","vb-calendar-grid");
  const corner=c("div","vb-calendar-corner","GMT+7");grid.append(corner);
  for(let d=0;d<7;d++) {
    const header=c("div","vb-calendar-dayhead");header.dataset.day=String(d);
    header.append(c("b","",days[d]),c("span","",String(d+5).padStart(2,"0")+"/10"));
    grid.append(header);
  }
  const timeRail=c("div","vb-time-rail");timeRail.style.height=laneHeight+"px";
  for(let h=6;h<=23;h++) {
    const tick=c("span","vb-time-tick",String(h).padStart(2,"0")+":00");
    tick.style.top=((h-6)*60*pxPerMinute)+"px";
    timeRail.append(tick);
  }
  grid.append(timeRail);
  for(let d=0;d<7;d++){
    const lane=c("div","vb-calendar-lane");lane.style.height=laneHeight+"px";lane.dataset.day=String(d);
    for(const [day,start,end,name] of items){
      if(day!==d)continue;
      const e=c("div","vb-calendar-event cat-"+cat(name));
      const top=(start-minStart)*pxPerMinute;
      const height=Math.max(32,(end-start)*pxPerMinute-4);
      e.style.top=top+"px";e.style.height=height+"px";
      e.title=name+" ("+time(start)+"–"+time(end)+")";
      e.setAttribute("aria-label",e.title);
      e.append(c("strong","",name),c("small","",time(start)+"–"+time(end)));
      lane.append(e);
    }
    grid.append(lane);
  }
  wrapper.append(grid);host.replaceChildren(wrapper);
  const buttons=document.querySelectorAll("[data-vb-day]");
  buttons.forEach(b=>b.addEventListener("click",()=>{
    const d=Number(b.dataset.vbDay),lane=grid.querySelector('.vb-calendar-dayhead[data-day="'+d+'"]');
    if(!lane)return;
    wrapper.scrollTo({left:Math.max(0,lane.offsetLeft-52),behavior:"smooth"});
    buttons.forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
  }));
})();