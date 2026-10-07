'use client';

import {createContext, useContext, type CSSProperties} from 'react';
import {Waves, Radio, Eye, Layers, Network, Dna, Combine, ShieldCheck, BrainCircuit, Zap, ScanEye, Bot, Hexagon, Database, Server, ChartNoAxesCombined, type LucideIcon} from 'lucide-react';
import {CARD_MAP, DOMAINS, TAG_COLORS} from '@/lib/game/content';
import {SYNERGY_RULES} from '@/lib/game/synergies';

const TRAIT_ICONS:Record<string,LucideIcon>={
 '序列':Waves,'信号':Radio,'视觉':Eye,'多尺度':Layers,'图谱':Network,'组学':Dna,
 '融合':Combine,'稳健':ShieldCheck,'推理':BrainCircuit,'高效':Zap,'自监督':ScanEye,'交互':Bot,
};
const DOMAIN_ICONS:Record<string,LucideIcon>={brain:Waves,vision:Eye,omics:Dna,reason:BrainCircuit,robot:Bot,table:ChartNoAxesCombined};
export const TraitContext=createContext<{counts:Record<string,number>}>({counts:{}});

export function TraitGlyph({tag,size=18}:{tag:string;size?:number}){
 const Icon=TRAIT_ICONS[tag]||Hexagon;
 return <Icon size={size} strokeWidth={1.8} aria-hidden="true"/>;
}

export function DomainEmblem({domain}:{domain:string}){
 const d=DOMAINS.find(x=>x.id===domain),Icon=DOMAIN_ICONS[domain]||Hexagon;
 return <span className="domain-emblem" style={{'--domain-color':d?.color||'#a6a8b9'} as CSSProperties}><Icon size={16} aria-hidden="true"/>{d?.name||'通用'}</span>;
}

export function TraitEmblem({tag,withLabel=false}:{tag:string;withLabel?:boolean}){
 const {counts}=useContext(TraitContext),count=counts[tag]||0,tiers=SYNERGY_RULES[tag]||[];
 const active=!!tiers.length&&count>=tiers[0].at;
 const next=tiers.find(t=>t.at>count),threshold=next?.at||tiers.at(-1)?.at||2;
 const description=`${tag} · 场上 ${count} / ${threshold} 种 · ${active?'已激活':'未激活'}`;
 return <span className={'trait-emblem'+(active?' is-active':'')+(withLabel?' with-label':'')} data-trait={tag} data-active={active} style={{'--trait-color':TAG_COLORS[tag]} as CSSProperties} title={description} aria-label={description}>
  <TraitGlyph tag={tag}/>{withLabel&&<span>{tag}</span>}
 </span>;
}

export function CardEmblems({id,compact=false}:{id:string;compact?:boolean}){
 const c=CARD_MAP[id],resource=['data','hardware','event'].includes(c.kind);
 const d=DOMAINS.find(x=>x.id===c.domain);
 const Icon=c.kind==='data'?Database:c.kind==='hardware'?Server:c.kind==='event'?Zap:DOMAIN_ICONS[c.domain]||Hexagon;
 const label=resource?({data:'数据',hardware:'设备',event:'事件'} as Record<string,string>)[c.kind]:d?.name||'通用';
 return <span className={'card-emblems'+(compact?' compact':'')} aria-label="卡牌领域与羁绊">
  <span className={'card-affiliation'+(resource?' is-resource':'')} title={resource?`${label}卡 · 购买后生效`:`${label}卡 · ${d?'适配'+d.name:'适配所有领域'}`}><Icon size={14} aria-hidden="true"/><span>{label}</span></span>
  <span className="card-trait-icons">{c.tags.map(tag=><TraitEmblem key={tag} tag={tag}/>)}</span>
 </span>;
}
