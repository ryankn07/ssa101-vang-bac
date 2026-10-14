/* Vàng Bạc | Static public-safe display from the calendar owner's own events.
   Week: Oct 12-18, 2026 (Asia/Ho_Chi_Minh). Not live sync, not completion data.
   Individual event IDs, links, account details, descriptions and places omitted. */
(() => {
  "use strict";
  const items = [[0,360,450,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[0,450,740,"Đi học trên trường (Slot 1 & 2)"],[0,740,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[0,915,960,"Tập đàn"],[0,975,1065,"Tự học"],[0,1065,1155,"Tập thể dục, tắm rửa & ăn tối"],[0,1155,1305,"Làm bài tập ưu tiên & ôn bài"],[0,1305,1365,"Thư giãn & chuẩn bị đi ngủ"],[1,360,450,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[1,450,740,"Đi học trên trường (Slot 1 & 2)"],[1,740,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[1,915,960,"Tập đàn"],[1,975,1065,"Tự học"],[1,1065,1155,"Tập thể dục, tắm rửa & ăn tối"],[1,1155,1305,"Làm bài tập ưu tiên & ôn bài"],[1,1305,1365,"Thư giãn & chuẩn bị đi ngủ"],[2,360,450,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[2,450,740,"Đi học trên trường (Slot 1 & 2)"],[2,740,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[2,915,960,"Tập đàn"],[2,975,1065,"Tự học"],[2,1065,1155,"Tập thể dục, tắm rửa & ăn tối"],[2,1155,1290,"Ôn bài & chuẩn bị cho Lab2 CSI106 trên lớp ngày mai"],[2,1290,1320,"Time Audit"],[2,1320,1380,"Thư giãn & chuẩn bị đi ngủ"],[3,360,450,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[3,450,740,"Đi học trên trường (Slot 1 & 2)"],[3,740,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[3,915,960,"Tập đàn"],[3,975,1065,"Tự học"],[3,1065,1155,"Tập thể dục, tắm rửa & ăn tối"],[3,1155,1245,"Assignment 2 & PT2: Ôn Chương 3 (Algorithms)"],[3,1260,1320,"Pre-class Prep: Đọc bài & chuẩn bị bài ngày mai"],[3,1320,1380,"Thư giãn & chuẩn bị đi ngủ"],[4,360,450,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[4,450,740,"Đi học trên trường (Slot 1 & 2)"],[4,740,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[4,915,960,"Tập đàn"],[4,975,1065,"Tự học"],[4,1065,1155,"Tập thể dục, tắm rửa & ăn tối"],[4,1155,1245,"Assignment 2 & PT2: Ôn Chương 4 & làm bài tập"],[4,1260,1320,"Post-class Review: Hệ thống ghi chép tuần"],[4,1320,1380,"Thư giãn & chuẩn bị đi ngủ"],[5,420,510,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[5,510,660,"Assignment 2 & PT2: Ôn Chương 7 & đọc sách"],[5,690,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[5,915,960,"Tập đàn"],[5,975,1080,"Tự học"],[5,1080,1170,"Tập thể dục, tắm rửa & ăn tối"],[5,1170,1305,"Thưởng cuối tuần & giải trí cá nhân (Reward Time)"],[5,1320,1380,"Thư giãn & chuẩn bị đi ngủ"],[6,420,510,"Thức dậy, vệ sinh cá nhân & ăn sáng"],[6,510,660,"Học ngoại ngữ & đọc sách"],[6,690,900,"Nấu ăn, ăn trưa & nghỉ ngơi"],[6,915,960,"Tập đàn"],[6,975,1080,"Dự phòng & xử lý việc tồn đọng (Buffer Time)"],[6,1080,1170,"Tập thể dục, tắm rửa & ăn tối"],[6,1170,1290,"Hoàn thiện bài tập Assignment 2 & chuẩn bị tuần mới"],[6,1290,1320,"Time Audit"],[6,1320,1380,"Thư giãn & chuẩn bị đi ngủ"]];
  const allDayItems = [[2,"Demo SSA"],[3,"Lab2 CSI106"]];
  const days = ["THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY", "CHỦ NHẬT"];
  const host = document.getElementById("vb-week-calendar");
  if (!host) return;
  const minStart=360, pxPerMinute=0.9, laneHeight=17*60*pxPerMinute;
  const c=(tag,cls,text) => {let el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
  const time=x=>String(Math.floor(x/60)).padStart(2,"0")+":"+String(x%60).padStart(2,"0");
  const cat=n=>/Time Audit/i.test(n)?"audit":/trường/i.test(n)?"school":/Assignment|PT2|Lab|bài tập|ôn bài|ôn tập|Pre-class|Post-class|chuẩn bị bài|hoàn thiện bài/i.test(n)?"assign":/tự học|ngoại ngữ/i.test(n)?"self":/đàn|đọc sách|Reward Time|giải trí cá nhân/i.test(n)?"hobby":/thể dục/i.test(n)?"sport":/Buffer Time|dự phòng/i.test(n)?"audit":"rest";
  const wrapper=c("div","vb-calendar-scroll");wrapper.id="vb-calendar-scroll";wrapper.tabIndex=0;wrapper.setAttribute("aria-label","Lịch tuần từ ngày 12 đến 18 tháng 10, chọn từng ngày bằng các nút ngay phía trên để xem trên điện thoại");
  const grid=c("div","vb-calendar-grid");
  const corner=c("div","vb-calendar-corner","GMT+7");grid.append(corner);
  for(let d=0;d<7;d++) {
    const header=c("div","vb-calendar-dayhead");header.dataset.day=String(d);
    header.append(c("b","",days[d]),c("span","",String(d+12).padStart(2,"0")+"/10"));
    for(const [day,label] of allDayItems){
      if(day===d){
        const marker=c("span","vb-calendar-allday",label);
        marker.title="Sự kiện cả ngày: "+label;
        header.append(marker);
      }
    }
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
  function showDay(d){
    if(!Number.isInteger(d)||d<0||d>6)return;
    grid.querySelectorAll("[data-day]").forEach(el=>el.classList.toggle("vb-day-active",Number(el.dataset.day)===d));
    buttons.forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.vbDay)===d)));
    if(!window.matchMedia("(max-width:640px)").matches){
      const header=grid.querySelector('.vb-calendar-dayhead[data-day="'+d+'"]');
      if(header)wrapper.scrollTo({left:Math.max(0,header.offsetLeft-52),behavior:"smooth"});
    }
  }
  buttons.forEach(b=>b.addEventListener("click",()=>showDay(Number(b.dataset.vbDay))));
  showDay(0);
})();