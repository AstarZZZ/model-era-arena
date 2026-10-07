import {CARD_MAP, TAG_COLORS} from './content.ts';

// These are the existing evaluation/training bonuses, shown at their actual thresholds.
export const SYNERGY_RULES:Record<string,{at:number;effect:string}[]>={
 '序列':[{at:2,effect:'序列卡贡献 +10%'},{at:4,effect:'序列卡贡献 +20%'}],
 '信号':[{at:2,effect:'主任务 +6'}],
 '视觉':[{at:2,effect:'主任务 +6'}],
 '多尺度':[{at:2,effect:'主任务 +5'}],
 '图谱':[{at:2,effect:'泛化 +5'}],
 '组学':[{at:2,effect:'泛化 +6'}],
 '融合':[{at:2,effect:'融合卡贡献 +10%'},{at:3,effect:'融合卡贡献 +18%'}],
 '稳健':[{at:2,effect:'稳健 +6'},{at:4,effect:'稳健 +10'}],
 '推理':[{at:2,effect:'校准 +6'}],
 '高效':[{at:2,effect:'训练成本 −15%'},{at:3,effect:'训练成本 −25%'}],
 '自监督':[{at:2,effect:'训练成长 +10%'},{at:4,effect:'训练成长 +20%'}],
 '交互':[{at:2,effect:'泛化 +6'}],
};

export function getSynergies(board:{id:string}[],includeEmpty=false){
 const cards=[...new Set(board.map(u=>u.id))];
 return Object.entries(SYNERGY_RULES).map(([tag,tiers])=>{
  const members=cards.filter(id=>CARD_MAP[id].tags.includes(tag));
  const count=members.length;
  const level=tiers.filter(t=>count>=t.at).length;
  return {tag,color:TAG_COLORS[tag],members,count,level,tiers,effect:level?tiers[level-1].effect:'',next:tiers[level]};
 }).filter(s=>includeEmpty||s.count>0).sort((a,b)=>b.level-a.level||b.count-a.count);
}
