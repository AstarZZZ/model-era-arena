import {CARDS,CARD_MAP,LEADERS,DOMAINS,CHALLENGES,TALENTS,UPGRADE_COST,UPGRADE_XP,ODDS,VERSION} from './content.ts';
export type Unit={uid:string;id:string;star:number;growth:number;trains:number;paid:number};
export type Player={id:string;name:string;leader:string;domain:string;bot:boolean;hp:number;gold:number;temp:number;xp:number;level:number;heat:number;cool:number;memory:number;quality:number;labels:number;coverage:number;size:number;board:Unit[];bench:Unit[];shop:(string|null)[];locked:boolean;ready:boolean;talents:string[];offer:string[];total:number;score:number;loss:number;skill:boolean;skillUsed:boolean;used:number;runSpent:number;trainRound:number;buyxp:number;refreshFree:boolean;cloud:boolean;overclock:boolean;burst:number;bursts:number;repeat:boolean;ablation:boolean;cellGift:boolean;bid:{lot:number;amount:number}|null;log:string[];detail:any;deadRound:number};
export type Game={version:string;code:string;seed:number;host:string;status:string;phase:string;round:number;deadline:number;players:Player[];pool:Record<string,number>;lots:string[];auctionLog:any[];battle:any[];events:string[];event:string;seen:string[];created:number};
const clamp=(v:number,a=0,b=100)=>Math.min(b,Math.max(a,v));
const round=(x:number)=>Math.round(x*100)/100;
const need=(b:any,msg:string)=>{if(!b)throw new Error(msg)};
function rand(g:Game){g.seed=(Math.imul(1664525,g.seed)+1013904223)>>>0;return g.seed/4294967296}
function pick<T>(g:Game,a:T[]):T{return a[Math.floor(rand(g)*a.length)]}
const tags=(p:Player)=>Array.from(new Set(p.board.map(u=>u.id))).flatMap(id=>CARD_MAP[id].tags);
export const tagCounts=(p:Player)=>tags(p).reduce((s:Record<string,number>,t)=>(s[t]=(s[t]||0)+1,s),{});
export function capacity(p:Player,g:Game){let n=4+p.level*2;if(p.overclock)n*=1.5;const derate=p.heat>=90?.6:p.heat>=70?.8:1;return Math.floor(n*Math.min(derate,g.event==='overheat'?.7:1))+(p.cloud?8:0)+(p.skill&&p.leader==='cluster'?(p.level<3?2:p.level<5?3:p.level===5?4:8):0)}
export const slots=(p:Player)=>Math.min(8,p.level+3);
export function usage(p:Player){let run=p.board.reduce((v,u)=>v+CARD_MAP[u.id].run*[1,1.2,1.4][u.star-1],0);if(p.skill&&p.leader==='mamba')run*=1-(p.level<3?.2:p.level<5?.25:.3);return {run:round(run),mem:p.board.reduce((v,u)=>v+Math.ceil(CARD_MAP[u.id].mem*[1,1.2,1.4][u.star-1]),0)}}
export function limits(p:Player,g:Game){const u=usage(p);return {capacity:capacity(p,g),slots:slots(p),memory:Math.floor((p.memory+(p.cloud?4:0))*(g.event==='memory'?.75:1)),...u}}
function note(p:Player,s:string){p.log=[s,...p.log].slice(0,18)}
function available(p:Player){return p.gold-(p.bid?.amount||0)}
function pay(p:Player,n:number){need(available(p)+.001>=n,'可用算力不足');p.gold=round(p.gold-n)}
function op(p:Player,g:Game,n:number,reserve=true){need(p.used+n+(reserve?usage(p).run:0)<=capacity(p,g)+.001,'本回合吞吐不足，请减少运行开销或扩容');const temp=Math.min(p.temp,n);need(available(p)+p.temp>=n+(reserve?Math.max(0,usage(p).run-(p.temp-temp)):0),'请保留阵容运行所需的算力');p.temp=round(p.temp-temp);pay(p,round(n-temp));p.used=round(p.used+n)}
function makeUnit(g:Game,id:string,paid:number):Unit{return {uid:`u${g.seed.toString(36)}${Math.floor(rand(g)*1e9).toString(36)}`,id,star:1,growth:0,trains:0,paid}}
export function makePlayer(id:string,name:string,leader:string,domain:string,bot=false):Player {need(LEADERS.some(x=>x.id===leader),'请选择有效角色');need(DOMAINS.some(x=>x.id===domain),'请选择有效领域');return {id,name:name.trim().slice(0,16)||'研究员',leader,domain,bot,hp:60,gold:10,temp:0,xp:0,level:1,heat:0,cool:0,memory:8,quality:.7,labels:.55,coverage:.5,size:100,board:[{uid:'base'+crypto.randomUUID(),id:'linear',star:1,growth:0,trains:0,paid:0}],bench:[],shop:[],locked:false,ready:false,talents:[],offer:[],total:0,score:0,loss:0,skill:false,skillUsed:false,used:0,runSpent:0,trainRound:0,buyxp:0,refreshFree:true,cloud:false,overclock:false,burst:0,bursts:0,repeat:false,ablation:false,cellGift:false,bid:null,log:[],detail:null,deadRound:0}}
export function newGame(code:string,id:string,name:string,leader:string,domain:string,solo=false,now=Date.now()):Game{const g:Game={version:VERSION,code,seed:Math.floor(Math.random()*0xffffffff),host:id,status:'lobby',phase:'lobby',round:0,deadline:0,players:[makePlayer(id,name,leader,domain)],pool:Object.fromEntries(CARDS.map(c=>[c.id,[30,24,18,15,12,9][c.tier-1]])),lots:[],auctionLog:[],battle:[],events:[],event:'normal',seen:[],created:now};if(solo)startGame(g,id,now);return g}
function returnShop(g:Game,p:Player){p.shop.forEach(id=>{if(id)g.pool[id]++});p.shop=[]}
function drawShop(g:Game,p:Player){returnShop(g,p);for(let i=0;i<5;i++){let choices=CARDS.filter(c=>g.pool[c.id]>0&&(c.domain==='all'||c.domain===p.domain||(p.level>=3))&&c.tier<=p.level);let weights=choices.map(c=>ODDS[p.level-1][c.tier-1]/Math.max(1,choices.filter(x=>x.tier===c.tier).length));let z=rand(g)*weights.reduce((a,b)=>a+b,0),j=0;while(j<weights.length-1&&z>=weights[j])z-=weights[j++];const card=choices[j];p.shop.push(card?.id||null);if(card)g.pool[card.id]--}}
function offers(g:Game,p:Player){if([1,5,9].includes(g.round)){const a=TALENTS.filter(t=>!p.talents.includes(t.id)&&!(g.round===1&&t.id==='exclusive'));p.offer=[];while(p.offer.length<3&&a.length)p.offer.push(a.splice(Math.floor(rand(g)*a.length),1)[0].id)}}
function roundStart(g:Game,now:number){g.event=g.round===4||g.round===10?'overheat':g.round===8?'memory':'normal';g.events=[];g.players.filter(p=>p.hp>0).forEach(p=>{p.gold+=8+(p.talents.includes('patient')?1:0);p.temp=p.burst>0?6:0;p.burst=Math.max(0,p.burst-1);p.used=0;p.runSpent=0;p.trainRound=0;p.buyxp=0;p.skill=false;p.skillUsed=false;p.refreshFree=true;p.cloud=false;p.overclock=false;p.ready=false;p.bid=null;if(!p.locked||!p.shop.length)drawShop(g,p);p.locked=false;offers(g,p);note(p,`第 ${g.round} 回合：基础收入 +8${p.talents.includes('patient')?'，长期主义 +1':''}`)});g.phase=[3,7,11].includes(g.round)?'auction':'shop';if(g.phase==='auction'){const tier=g.round===3?3:g.round===7?5:6;g.lots=[pick(g,CARDS.filter(c=>c.kind==='data')).id,pick(g,CARDS.filter(c=>c.kind==='hardware'||c.kind==='event')).id,pick(g,CARDS.filter(c=>(c.kind==='model'||c.kind==='module')&&c.tier===tier)).id,pick(g,CARDS.filter(c=>c.tier>=Math.max(2,tier-2)&&c.tier<=tier)).id];g.deadline=now+60000}else g.deadline=now+150000;}
export function startGame(g:Game,id:string,now=Date.now()){need(g.host===id,'只有房主可以开局');need(g.status==='lobby','已经开局');const names=['柚子实验室','张量漫游者','夜航研究所','松鼠算力站','像素与诗','第七个神经元','白噪声'];while(g.players.length<8){const l=LEADERS[(g.players.length*3)%LEADERS.length];g.players.push(makePlayer('bot'+g.players.length,names[g.players.length-1],l.id,l.domain,true))}g.status='playing';g.round=1;roundStart(g,now)}
function merge(g:Game,p:Player,trackedUid?:string){
 let again=true;
 while(again){
  again=false;
  const all=[...p.board,...p.bench];
  for(const u of all){
   if(u.star>=3)continue;
   const same=all.filter(x=>x.id===u.id&&x.star===u.star);
   if(same.length<3)continue;
   const chosen=same.slice(0,3),ids=new Set(chosen.map(x=>x.uid));
   const boardIndex=p.board.findIndex(x=>ids.has(x.uid));
   const benchIndex=p.bench.findIndex(x=>ids.has(x.uid));
   const merged={...chosen[0],star:u.star+1,growth:Math.max(...chosen.map(x=>x.growth)),trains:Math.max(...chosen.map(x=>x.trains)),paid:chosen.reduce((n,x)=>n+x.paid,0)};
   if(trackedUid&&ids.has(trackedUid))trackedUid=merged.uid;
   p.board=p.board.filter(x=>!ids.has(x.uid));
   p.bench=p.bench.filter(x=>!ids.has(x.uid));
   // Keep the earliest deployed copy in place, including through chain upgrades.
   if(boardIndex>=0)p.board.splice(boardIndex,0,merged);
   else p.bench.splice(Math.max(0,benchIndex),0,merged);
   p.repeat=false;p.ablation=false;
   note(p,`合成成功：${CARD_MAP[u.id].name} 升至 ${merged.star} 星`);
   again=true;break;
  }
 }
 return trackedUid;
}
function deploy(p:Player,uid:string,index?:number){
 const u=p.bench.find(x=>x.uid===uid);
 need(u,'请从备战区选择卡牌');
 if(index!==undefined)need(Number.isInteger(index)&&index>=0&&index<slots(p),'阵容位置无效');
 const target=index===undefined?undefined:p.board[index];
 need(target||p.board.length<slots(p),'阵容位置已满');
 const benchIndex=p.bench.indexOf(u!);
 if(target){p.bench[benchIndex]=target;p.board[index!]=u!;}
 else{p.bench.splice(benchIndex,1);p.board.push(u!);}
 p.repeat=false;p.ablation=false;
 if(p.leader==='cell'&&!p.cellGift&&CARD_MAP[u!.id].tags.includes('融合')){p.xp+=2;p.cellGift=true;}
}
function acquire(g:Game,p:Player,id:string,paid:number,allowOverflow=false){const c=CARD_MAP[id];if(c.kind==='event'||c.kind==='hardware'||c.kind==='data'){switch(c.effect){case'burst':need(p.burst===0&&p.temp===0&&p.bursts<2,'算力爆发仍生效或已使用两次');p.temp+=6;p.burst=2;p.bursts++;break;case'cool':need(!p.cool,'液冷回路最多安装一件');p.cool=8;break;case'cloud':need(!p.cloud,'本回合已有云端支援');p.cloud=true;break;case'overclock':need(!p.overclock,'本回合已超频');p.overclock=true;break;case'label':p.labels=clamp(p.labels+.2,0,1);break;case'coverage':p.coverage=clamp(p.coverage+.15,0,1);break;case'data':p.size+=50;p.quality=clamp(p.quality-.05,.1,1);break}note(p,`使用：${c.name}`);return}need(allowOverflow||p.bench.length<8||[...p.board,...p.bench].filter(x=>x.id===id&&x.star===1).length>=2,'备战区已满，请部署或出售卡牌');const unit=makeUnit(g,id,paid);p.bench.push(unit);return merge(g,p,unit.uid)}
export function evaluate(g:Game,p:Player){const t=tagCounts(p),ch=CHALLENGES[g.round-1]||CHALLENGES[0],u=usage(p);let P=20,G=22+p.coverage*30,R=20+p.quality*25,E=0,C=30,V=60;const rows:any[]=[];let factor=1;const mem=Math.floor((p.memory+(p.cloud?4:0))*(g.event==='memory'?.75:1));if(u.mem>mem)factor*=.6;if(u.run+p.used>capacity(p,g))factor*=.65;if(p.gold+p.temp+0.001<u.run)factor*=.5;const tier=p.level<3?0:p.level<5?1:2;let leaderTags:string[]=[];if(p.skill){leaderTags=p.leader==='weaver'?['序列','信号']:p.leader==='duality'?['信号']:p.leader==='dino'?['视觉']:p.leader==='cell'?['组学','融合']:p.leader==='genome'?['组学']:p.leader==='pilot'?['交互']:[]}
for(const [i,x]of p.board.entries()){const c=CARD_MAP[x.id];let buff=0;if(c.tags.some(t=>leaderTags.includes(t)))buff+=(p.leader==='pilot'?[.3,.4,.5]:[.2,.25,.3])[tier]+(p.talents.includes('exclusive')?.05:0);if(p.leader==='mamba'&&c.tags.includes('序列'))buff+=.1;if(i===0&&p.talents.includes('mentor'))buff+=.15;if(c.tags.includes('序列')&&(t['序列']||0)>=2)buff+=(t['序列']>=4?.2:.1);if(c.tags.includes('融合')&&(t['融合']||0)>=2)buff+=(t['融合']>=3?.18:.1);const match=c.domain==='all'||c.domain===p.domain?1:.62;const n=c.power*[1,1.6,2.2][x.star-1]*(1+x.growth/100)*match*(1+Math.min(.6,buff))*(.65+.35*p.quality);P+=n;rows.push({name:c.name,amount:round(n),match});if(c.id==='domain')G+=7;if(c.id==='quality'||c.id==='batch')R+=5;if(c.id==='drop')R+=7;if(c.id==='calibrate')C+=12;if(c.id==='verify')C+=6;if(c.id==='norm')C+=3;if(c.id==='replay'&&p.domain==='robot')G+=4}
if((t['信号']||0)>=2)P+=6;if((t['视觉']||0)>=2)P+=6;if((t['组学']||0)>=2)G+=6;if((t['交互']||0)>=2)G+=6;if((t['推理']||0)>=2)C+=6;if((t['稳健']||0)>=2)R+=t['稳健']>=4?10:6;if((t['多尺度']||0)>=2)P+=5;if((t['图谱']||0)>=2)G+=5;if(p.skill&&p.leader==='sam')P+=[8,10,12][tier]+(p.talents.includes('exclusive')?2:0);if(p.skill&&p.leader==='r1')P+=[10,12,14][tier]+(p.talents.includes('exclusive')?2:0);if(p.leader==='duality'&&(t['信号']||0)>=2)G+=5;if(p.leader==='sam'&&p.board.some(u=>u.id==='segment'))R+=6;if(p.leader==='tab'&&p.board.length<=5)P+=5;if(p.leader==='genome'&&t['图谱']&&t['序列'])G+=6;if(p.leader==='r1'&&p.board.some(u=>u.id==='verify'))C+=8;if(p.talents.includes('robust'))R+=8;
if(ch.kind==='small')P*=.8+.2*p.labels;if(ch.kind==='long'&&t['序列'])P+=6;if(ch.kind==='domain')G-=12*(1-p.coverage);if(ch.kind==='noise')R-=10*(1-p.quality);if(ch.kind==='missing'&&!p.board.some(u=>u.id==='drop'))R-=12;E=clamp(100*(1-(.5*u.run/16+.3*u.mem/20+.2*p.board.length/8)));if(P<50)E*=P/50;V+=(p.repeat?20:0)+(p.ablation?20:0);const dims=[P*factor,G*factor,R*factor,E,C*factor,V].map(n=>round(clamp(n)));let weights=[35,20,15,10,10,10];if(ch.kind==='domain')weights=[25,30,15,10,10,10];if(ch.kind==='efficient')weights=[25,20,15,20,10,10];if(ch.kind==='calibration')weights=[25,20,15,10,20,10];if(ch.kind==='repro')weights=[25,20,15,10,10,20];if(ch.kind==='noise'||ch.kind==='missing')weights=[25,20,25,10,10,10];return {score:round(dims.reduce((v,x,i)=>v+x*weights[i]/100,0)),dims,weights,rows,factor,run:u.run,mem:u.mem}}
function botShop(g:Game,p:Player){if(p.offer.length){p.talents.push(p.offer[0]);p.offer=[]}try{if(p.level<6&&p.xp>=UPGRADE_XP[p.level]&&p.gold>=UPGRADE_COST[p.level]+6)act(g,p.id,{type:'upgrade'},true)}catch{}for(let k=0;k<3;k++){const idx=p.shop.findIndex(id=>id&&CARD_MAP[id].tier<=p.gold-4&&['module','model'].includes(CARD_MAP[id].kind));if(idx<0)break;try{act(g,p.id,{type:'buy',index:idx},true)}catch{break}}for(const x of [...p.bench]){if(p.board.length>=slots(p))break;const m=usage(p);if(m.mem+CARD_MAP[x.id].mem<=p.memory&&m.run+CARD_MAP[x.id].run<=capacity(p,g)&&m.run+CARD_MAP[x.id].run<=p.gold){try{act(g,p.id,{type:'deploy',uid:x.uid},true)}catch{}}}if(p.board.length>=slots(p)&&p.bench.length){const weak=[...p.board].sort((a,b)=>CARD_MAP[a.id].power-CARD_MAP[b.id].power)[0],strong=[...p.bench].sort((a,b)=>CARD_MAP[b.id].power-CARD_MAP[a.id].power)[0];if(CARD_MAP[strong.id].power>CARD_MAP[weak.id].power){try{act(g,p.id,{type:'bench',uid:weak.uid},true);act(g,p.id,{type:'deploy',uid:strong.uid},true)}catch{}}}try{act(g,p.id,{type:'skill'},true)}catch{}try{if(p.gold>6)act(g,p.id,{type:'train',uid:p.board[p.board.length-1].uid},true)}catch{}if(p.quality<.85&&p.gold>8){try{act(g,p.id,{type:'clean'},true)}catch{}}if(p.bench.length>5){try{act(g,p.id,{type:'sell',uid:p.bench[0].uid},true)}catch{}}}
function resolveAuction(g:Game,now:number){for(const p of g.players.filter(x=>x.bot&&x.hp>0)){if(rand(g)>.2){const reserve=usage(p).run;const amount=Math.min(Math.floor(p.gold-reserve),Math.floor(2+g.round/2+rand(g)*5));if(amount>=(g.round===3?2:g.round===7?4:6))p.bid={lot:Math.floor(rand(g)*4),amount}}}const results=[];for(let i=0;i<g.lots.length;i++){const bidders=g.players.filter(p=>p.hp>0&&p.bid?.lot===i).map(p=>({p,tie:rand(g)})).sort((a,b)=>(b.p.bid?.amount||0)-(a.p.bid?.amount||0)||a.p.hp-b.p.hp||a.p.score-b.p.score||a.tie-b.tie);if(bidders.length){let won=false;for(const {p}of bidders){const amount=p.bid!.amount;p.bid=null;try{pay(p,amount);acquire(g,p,g.lots[i],amount);results.push({card:g.lots[i],name:p.name,amount});won=true;break}catch{p.gold+=amount;note(p,'拍品不适用或备战区已满，出价已退回')}}if(!won)results.push({card:g.lots[i],name:'流拍',amount:0})}else results.push({card:g.lots[i],name:'流拍',amount:0})}g.auctionLog.push({round:g.round,results});g.players.forEach(p=>{p.bid=null;p.ready=false});g.phase='shop';g.deadline=now+150000;}
function resolveBattle(g:Game,now:number){g.players.filter(p=>p.bot&&p.hp>0).forEach(p=>botShop(g,p));const alive=g.players.filter(p=>p.hp>0);for(const p of alive){p.detail=evaluate(g,p);p.score=p.detail.score;p.total=round(p.total+p.score);let n=usage(p).run;const actual=Math.min(n,p.temp+p.gold,Math.max(0,capacity(p,g)-p.used));const t=Math.min(p.temp,actual);p.temp=round(p.temp-t);p.gold=round(p.gold-(actual-t));p.runSpent=actual;p.heat=clamp(p.heat+2*(p.used+actual)*(p.cloud?.5:1)+(p.overclock?25:0)-12-p.cool-(p.leader==='cluster'?3:0));p.xp+=2+(p.talents.includes('scholar')?1:0)}const order=[...alive].sort((a,b)=>a.id.localeCompare(b.id));for(let i=order.length-1;i>0;i--){const j=Math.floor(rand(g)*(i+1));[order[i],order[j]]=[order[j],order[i]]}g.battle=[];for(let i=0;i<order.length;i+=2){const a=order[i],b=order[i+1]||order[0];if(a===b)break;const gap=round(a.score-b.score),damage=g.round<=2?0:Math.min(14,4+Math.floor(Math.abs(gap)/5));if(Math.abs(gap)<.01){a.loss=0;if(order[i+1])b.loss=0}else{const loser=gap<0?a:b,winner=gap>0?a:b;if(loser===a||order[i+1]){loser.hp=clamp(loser.hp-damage,0,60);loser.loss++;if(loser.loss>=2)loser.gold++;if(!loser.hp)loser.deadRound=g.round}if(winner===a||order[i+1]){winner.gold++;winner.loss=0}}g.battle.push({a:a.id,b:b.id,scoreA:a.score,scoreB:b.score,gap,damage,ghost:!order[i+1]})}g.players.forEach(p=>p.ready=false);g.phase='battle';g.deadline=now+20000;}
export function tick(g:Game,now=Date.now()){if(g.status!=='playing')return false;const alive=g.players.filter(p=>p.hp>0&&!p.bot);if(g.deadline>now&&alive.some(p=>!p.ready))return false;if(g.phase==='auction')resolveAuction(g,now);else if(g.phase==='shop')resolveBattle(g,now);else if(g.phase==='battle'){if(g.round>=12||g.players.filter(p=>p.hp>0).length<=1){g.status='finished';g.phase='finished'}else{g.round++;roundStart(g,now)}}return true}
export function act(g:Game,id:string,a:any,bot=false){const p=g.players.find(x=>x.id===id);need(p,'你还没有加入这个房间');if(!p)return;need(g.status==='playing','当前不在对局中');if(a.type==='ready'){p.ready=!p.ready;return}need(p.hp>0,'你已进入观战');need(!p.ready||bot,'已就绪，取消就绪后才能修改');if(g.phase==='auction'){need(a.type==='bid','当前为拍卖阶段');if(a.amount===0){p.bid=null;return}need(Number.isInteger(a.amount)&&a.amount>=(g.round===3?2:g.round===7?4:6),'出价低于起拍价');need(Number.isInteger(a.lot)&&a.lot>=0&&a.lot<4,'拍品不存在');need(a.amount<=p.gold-Math.max(0,usage(p).run-p.temp),'请保留运行预算');p.bid={lot:a.lot,amount:a.amount};return}need(g.phase==='shop','请等待下一回合');const all=[...p.board,...p.bench],u=all.find(x=>x.uid===a.uid);switch(a.type){case'buy':{need(Number.isInteger(a.index)&&a.index>=0&&a.index<5,'卡牌位置无效');const id=p.shop[a.index];need(id,'卡牌已售出');const c=CARD_MAP[id!];pay(p,c.tier);acquire(g,p,id!,c.tier);p.shop[a.index]=null;break}
case'buyDeploy':{
 // Purchase, possible chain merge and placement are one validated transaction.
 const next=structuredClone(g),buyer=next.players.find(x=>x.id===id)!;
 need(Number.isInteger(a.index)&&a.index>=0&&a.index<5,'卡牌位置无效');
 const cardId=buyer.shop[a.index];
 need(cardId&&cardId===a.cardId,'商店卡牌已更新，请重新拖动');
 need(['model','module'].includes(CARD_MAP[cardId!].kind),'这张卡购买后立即生效，无需部署');
 if(a.targetIndex!==undefined)need(Number.isInteger(a.targetIndex)&&a.targetIndex>=0&&a.targetIndex<slots(buyer),'阵容位置无效');
 const cost=CARD_MAP[cardId!].tier;
 pay(buyer,cost);
 const uid=acquire(next,buyer,cardId!,cost,true)!;
 buyer.shop[a.index]=null;
 if(buyer.bench.some(x=>x.uid===uid))deploy(buyer,uid,a.targetIndex);
 need(buyer.bench.length<=8,'备战区已满，请先腾出替换卡牌的位置');
 Object.assign(g,next);
 return;
}
case'move':{
 need(u&&p.board.includes(u),'卡牌不在阵容中');
 need(Number.isInteger(a.targetIndex)&&a.targetIndex>=0&&a.targetIndex<slots(p),'阵容位置无效');
 const from=p.board.indexOf(u!),to=Math.min(a.targetIndex,p.board.length-1);
 [p.board[from],p.board[to]]=[p.board[to],p.board[from]];
 p.repeat=false;p.ablation=false;merge(g,p);break;
}
case'refresh':if(!p.refreshFree)pay(p,2);p.refreshFree=false;drawShop(g,p);break;
case'lock':p.locked=!p.locked;break;
case'upgrade':need(p.level<6,'实验室已达六阶');need(p.xp>=UPGRADE_XP[p.level],'研究经验不足');pay(p,UPGRADE_COST[p.level]);p.xp-=UPGRADE_XP[p.level];p.level++;note(p,`实验室升至 ${p.level} 阶`);break;
case'xp':need(p.buyxp<2,'每回合最多购买两次经验');pay(p,2);p.xp+=2;p.buyxp++;break;
case'deploy':deploy(p,a.uid,a.targetIndex);merge(g,p);break;
case'bench':need(u&&p.board.includes(u),'卡牌不在阵容中');need(p.board.length>1,'阵容至少保留一张卡牌');need(p.bench.length<8,'备战区已满');p.board=p.board.filter(x=>x!==u);p.bench.push(u!);p.repeat=false;p.ablation=false;merge(g,p);break;
case'sell':need(u,'卡牌不存在');need(p.board.length>1||!p.board.includes(u!),'请保留一个基础模型');p.board=p.board.filter(x=>x!==u);p.bench=p.bench.filter(x=>x!==u);p.gold+=Math.floor(u!.paid*.5);g.pool[u!.id]+=3**(u!.star-1);break;
case'train':{need(u&&p.board.includes(u),'请先将卡牌部署到阵容');need(u!.trains<5,'这张卡已训练五次，收益达到上限');let cost=2*((tagCounts(p)['高效']||0)>=3?.75:(tagCounts(p)['高效']||0)>=2?.85:1)*(p.board.some(x=>x.id==='lora')?.8:1)*(p.talents.includes('lean')&&p.board.length<=5?.8:1);if(p.skill&&p.leader==='tab'&&p.trainRound===0)cost=Math.max(0,cost-(p.level<3?1:2));cost=round(Math.max(p.skill&&p.leader==='tab'&&p.trainRound===0?0:1.2,cost));op(p,g,cost);let boost=1+((tagCounts(p)['自监督']||0)>=4?.2:(tagCounts(p)['自监督']||0)>=2?.1:0)+(p.board.some(x=>x.id==='ssl')?.15:0)+(p.leader==='weaver'&&p.board.some(x=>x.id==='ssl')?.1:p.leader==='dino'&&p.board.some(x=>x.id==='ssl')?.15:p.leader==='pilot'&&CARD_MAP[u!.id].tags.includes('交互')&&p.trainRound===0?.15:0);u!.growth=round(u!.growth+10*p.quality*(.5+.5*p.labels)*Math.min(1,Math.log(1+p.size)/Math.log(201))*[1,.6,.35,.2,.1][u!.trains]*boost);u!.trains++;p.trainRound++;p.repeat=false;p.ablation=false;note(p,`${CARD_MAP[u!.id].name} 完成训练，累计成长 +${u!.growth}%`);break}
case'clean':{p.repeat=false;p.ablation=false;const free=p.skill&&p.leader==='curator';op(p,g,free?0:2);p.quality=round(clamp(p.quality+(free?.15:.1),.1,1));if(free)p.skill=false;if(p.leader==='curator')p.xp++;break}
case'label':op(p,g,2);p.repeat=false;p.ablation=false;p.labels=round(clamp(p.labels+.15,0,1));break;
case'memory':need(p.memory<20,'显存已达 20');pay(p,4);p.memory+=4;break;
case'cooldown':op(p,g,1);p.heat=clamp(p.heat-20);break;
case'repeat':need(!p.repeat,'已完成重复实验');op(p,g,p.talents.includes('repro')?1:2);p.repeat=true;break;
case'ablation':need(!p.ablation,'已完成消融实验');op(p,g,p.talents.includes('repro')?1:2);p.ablation=true;break;
case'skill':need(!p.skillUsed,'本回合技能已使用');if(['r1','pilot','cluster'].includes(p.leader))op(p,g,2);p.skill=true;p.skillUsed=true;note(p,`激活角色技能：${LEADERS.find(l=>l.id===p.leader)!.skill}`);break;
case'talent':need(p.offer.includes(a.id),'天赋不在候选中');need(!p.talents.includes(a.id),'已拥有此天赋');p.talents.push(a.id);p.offer=[];note(p,`选择天赋：${TALENTS.find(t=>t.id===a.id)!.name}`);break;
default:throw new Error('不支持的操作')}need(p.gold>=-.01,'算力预算不能为负数')}
export function view(g:Game,id:string){const p=g.players.find(x=>x.id===id);return {...g,seed:undefined,pool:undefined,seen:undefined,host:g.host===id?'you':'other',me:p?{...p,id:'you',limits:limits(p,g),preview:g.status==='playing'?evaluate(g,p):null}:null,players:g.players.map(x=>({id:x.id===id?'you':x.bot?x.id:'p'+g.players.indexOf(x),name:x.name,leader:x.leader,domain:x.domain,bot:x.bot,hp:x.hp,level:x.level,ready:x.ready,score:x.score,total:x.total,board:g.phase==='battle'||g.status==='finished'?x.board:[],deadRound:x.deadRound})),battle:g.battle.map(b=>({...b,a:b.a===id?'you':g.players.find(x=>x.id===b.a)?.bot?b.a:'p'+g.players.findIndex(x=>x.id===b.a),b:b.b===id?'you':g.players.find(x=>x.id===b.b)?.bot?b.b:'p'+g.players.findIndex(x=>x.id===b.b)}))}}
