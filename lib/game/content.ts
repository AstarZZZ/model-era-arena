export const VERSION = '1.0.0';
export const DOMAINS = [
 {id:'brain',name:'脑机接口',en:'NEURO INTERFACE',color:'#69e7cd',hint:'序列 × 信号 · 跨被试泛化',icon:'brain'},
 {id:'vision',name:'医学影像',en:'MEDICAL VISION',color:'#b69aff',hint:'视觉 × 分割 · 精准边界',icon:'vision'},
 {id:'omics',name:'多组学',en:'MULTI OMICS',color:'#f6b76c',hint:'图谱 × 融合 · 细胞世界',icon:'dna'},
 {id:'reason',name:'推理智能',en:'REASONING SYSTEMS',color:'#7bbcff',hint:'检索 × 验证 · 可靠推理',icon:'network'},
 {id:'robot',name:'具身智能',en:'EMBODIED AI',color:'#fa8fa5',hint:'交互 × 时序 · 闭环控制',icon:'robot'},
 {id:'table',name:'数据科学',en:'DATA SCIENCE',color:'#e9df91',hint:'表格 × 小样本 · 数据效率',icon:'grid'}
];
export const LEADERS = [
 {id:'weaver',name:'脑波织者',title:'把杂乱的电波，织成认知。',domain:'brain',color:'#69e7cd',hair:0,skill:'神经共鸣',desc:'本回合序列与信号卡贡献 +20%／25%／30%。',passive:'自监督训练成长额外 +10%。',paper:'LaBraM · EEG foundation models',url:'https://arxiv.org/abs/2405.18765'},
 {id:'duality',name:'双域学者',title:'时域与频域，终将相遇。',domain:'brain',color:'#80cce8',hair:1,skill:'双域协同',desc:'本回合信号卡贡献 +20%／25%／30%。',passive:'拥有两张不同信号卡时，泛化 +5。',paper:'Multi-scale neural signal modeling',url:''},
 {id:'dino',name:'视觉导师',title:'在未被标注的世界中学习。',domain:'vision',color:'#b69aff',hair:2,skill:'教师视野',desc:'本回合视觉卡贡献 +20%／25%／30%。',passive:'自监督训练获得额外 15% 成长。',paper:'DINOv2 · Self-supervised vision',url:'https://arxiv.org/abs/2304.07193'},
 {id:'sam',name:'边界工匠',title:'每一条边界，都值得认真。',domain:'vision',color:'#ed9cd4',hair:3,skill:'精准提示',desc:'本回合主任务 +8／10／12 分。',passive:'拥有分割卡时，稳健性 +6。',paper:'MedSAM · Segment Anything in Medical Images',url:'https://doi.org/10.1038/s41467-024-44824-z'},
 {id:'mamba',name:'序列行者',title:'记住长河，而不是每一滴水。',domain:'brain',color:'#71cdd1',hair:4,skill:'状态压缩',desc:'本回合运行算力减少 20%／25%／30%。',passive:'序列卡贡献 +10%。',paper:'Mamba · Selective state spaces',url:'https://arxiv.org/abs/2312.00752'},
 {id:'tab',name:'小样本策士',title:'数据不多，也有赢的可能。',domain:'table',color:'#e9df91',hair:5,skill:'快速适应',desc:'本回合下一次训练成本减少 1／2／2。',passive:'阵容不超过 5 张时，主任务 +5。',paper:'TabPFN · Small-data tabular learning',url:'https://doi.org/10.1038/s41586-024-08328-6'},
 {id:'cell',name:'细胞编织者',title:'读懂细胞之间的无声对话。',domain:'omics',color:'#f6b76c',hair:6,skill:'跨组学对齐',desc:'本回合组学与融合卡贡献 +20%／25%／30%。',passive:'首次部署融合卡获得 2 经验。',paper:'scGPT · Single-cell foundation model',url:'https://doi.org/10.1038/s41592-024-02201-0'},
 {id:'genome',name:'调控先知',title:'从序列，望见生命的下一章。',domain:'omics',color:'#daca86',hair:7,skill:'调控视野',desc:'本回合组学卡贡献 +20%／25%／30%。',passive:'同时拥有图谱和序列卡，泛化 +6。',paper:'Long-context genomic modeling',url:''},
 {id:'r1',name:'验证先知',title:'每一个答案，都需要证据。',domain:'reason',color:'#7bbcff',hair:8,skill:'再想一步',desc:'消耗 2 算力，本回合推理主任务 +10／12／14。',passive:'部署验证器后，校准 +8。',paper:'DeepSeek-R1 · Reinforcement learning for reasoning',url:'https://arxiv.org/abs/2501.12948'},
 {id:'curator',name:'数据策展人',title:'模型的上限，藏在数据里。',domain:'table',color:'#a6d797',hair:9,skill:'精细策展',desc:'本回合下一次数据清洗免费，并额外提升 5% 质量。',passive:'每次清洗额外获得 1 经验。',paper:'Data-centric AI',url:''},
 {id:'pilot',name:'闭环领航员',title:'在试错中，学会抵达。',domain:'robot',color:'#fa8fa5',hair:10,skill:'探索回路',desc:'消耗 2 算力，本回合交互卡贡献 +30%／40%／50%。',passive:'每回合首次训练交互卡，成长 +15%。',paper:'Reinforcement learning & embodied agents',url:''},
 {id:'cluster',name:'集群指挥官',title:'让每一份算力，都用在刀刃上。',domain:'reason',color:'#b9b9e9',hair:11,skill:'节点协同',desc:'消耗 2 算力，本回合吞吐 +2／3／4；六阶额外 +4。',passive:'散热效率 +3。',paper:'Efficient distributed inference',url:''}
];
export type CardDef={id:string;name:string;tier:number;kind:string;tags:string[];domain:string;power:number;run:number;mem:number;desc:string;lesson:string;art:string;effect?:string};
const c=(id:string,name:string,tier:number,tags:string[],domain:string,power:number,run:number,mem:number,desc:string,lesson:string,art='network',kind='module',effect?:string):CardDef=>({id,name,tier,tags,domain,power,run,mem,desc,lesson,art,kind,effect});
export const CARDS:CardDef[]=[
 c('linear','线性学徒',1,['高效'],'all',7,1,1,'轻盈的基础模型，建立可靠基线。','简单基线可以揭示数据是否包含有效信号。','grid','model'),
 c('conv','卷积研究员',2,['视觉','多尺度'],'vision',11,1,2,'视觉任务贡献；与多尺度卡组成羁绊。','局部感受野和权重共享适合提取局部模式。','vision','model'),
 c('sequence','序列编码器',3,['序列','信号'],'brain',15,2,3,'长序列任务贡献，适配脑机与交互。','时序结构不能靠打乱样本顺序的评估来验证。','brain','model'),
 c('fusion','跨模态学者',4,['融合','稳健'],'all',18,2,4,'融合多个有效模态，数据质量决定收益。','模态对齐、缺失模态和分布偏移会限制融合收益。','network','model'),
 c('cellcore','细胞大模型',5,['组学','图谱'],'omics',22,3,5,'擅长细胞图谱和跨组织表征。','预训练不等于对每个组织、平台都能直接泛化。','dna','model'),
 c('experts','专家议会',6,['推理','高效'],'reason',27,4,6,'多专家路由，高上限与显存需求并存。','稀疏激活降低每次计算量，但参数仍占用内存。','network','model'),
 c('quality','数据质检',1,['稳健'],'all',3,0,1,'稳健性 +5；清洗和去重提高数据可信度。','去重和质量筛选应在分割与来源追踪下进行。','grid'),
 c('norm','标准化',1,['高效','信号'],'all',4,0,1,'校准 +3；低成本预处理。','归一化统计必须只由训练集估计，防止泄漏。','wave'),
 c('local','局部卷积',1,['视觉','多尺度'],'vision',6,0,1,'为局部结构提供轻量视觉贡献。','局部归纳偏置对小数据和空间结构任务常有帮助。','vision'),
 c('timefreq','时频变换',2,['序列','信号'],'brain',8,1,1,'序列与信号双羁绊，解析节律结构。','频谱和时频分解是描述信号的工具，不等于因果解释。','wave'),
 c('topology','空间拓扑',2,['图谱','信号'],'brain',7,0,1,'将电极或传感器的空间关系纳入模型。','错误的空间关系也可能引入错误的归纳偏置。','network'),
 c('multiscale','多尺度金字塔',2,['视觉','多尺度'],'vision',9,1,1,'结合局部边缘和较大范围上下文。','不同尺度的信息互补性需要用消融实验验证。','vision'),
 c('attention','注意力引擎',3,['序列','推理'],'all',12,1,2,'捕捉长程依赖，也增加资源负担。','标准注意力的开销随序列长度增加；具体实现会改变效率。','network'),
 c('ssm','选择性状态空间',3,['序列','高效'],'all',11,1,2,'流式序列建模；高效与序列双羁绊。','状态空间模型通过状态更新传播序列信息。','wave'),
 c('gnn','图神经网络',3,['图谱','组学'],'omics',12,1,2,'在邻接图上学习关系和局部环境。','图的构造会影响结果，错误边与泄漏边都需要检查。','dna'),
 c('cross','跨模态注意力',3,['融合','推理'],'all',13,1,2,'融合任务贡献；低质量数据会削弱收益。','跨模态注意力不自动解决数据配对或时间对齐问题。','network'),
 c('drop','模态保险',2,['融合','稳健'],'all',6,0,1,'稳健性 +7，减少缺失模态事件惩罚。','训练时模拟缺失模态能提高缺失输入时的稳健性。','shield'),
 c('domain','跨域适应',3,['稳健','自监督'],'all',8,0,1,'泛化 +7；迎接跨中心和跨被试任务。','跨域评估应按被试、机构或时间真正隔离。','network'),
 c('batch','批次整合',3,['组学','稳健'],'omics',9,1,1,'组学贡献，并提供稳健性 +5。','消除技术批次差异时，应保留真实生物差异。','dna'),
 c('calibrate','温度校准',2,['稳健'],'all',3,0,1,'校准维度 +12。','校准数据应独立于训练，校准不一定提高分类准确率。','grid'),
 c('lora','低秩适配',2,['高效'],'all',5,0,1,'训练成本 -20%；不会降低运行成本。','LoRA 减少可训练参数量，不等于所有推理开销都下降。','network'),
 c('ssl','掩码自监督',2,['自监督','序列'],'all',7,0,1,'训练成长 +15%；善用未标注数据。','自监督目标应与下游任务适配，需要独立评估迁移效果。','brain'),
 c('rag','检索增强',2,['推理','图谱'],'reason',10,1,1,'为推理提供检索证据。','检索结果的相关性和可信度决定增强是否有效。','grid'),
 c('verify','候选验证器',2,['推理','稳健'],'reason',7,1,1,'校准 +6；与推理卡共同提升可靠性。','测试时多算几次只有在验证信号可靠时才更有效。','shield'),
 c('segment','边界解码器',3,['视觉','多尺度'],'vision',12,1,2,'影像分割任务专家。','Dice、边界距离和跨中心测试反映不同的质量维度。','vision'),
 c('replay','经验回放',2,['交互','稳健'],'robot',8,0,1,'保存经验；交互任务泛化 +4。','离策略训练利用过去经验，但数据分布偏差仍需处理。','robot'),
 c('policy','策略网络',3,['交互','序列'],'robot',14,2,2,'面向连续决策的主干模型。','奖励设计会影响策略行为，仿真表现不能替代真实评估。','robot','model'),
 c('small','小样本先验',2,['高效','自监督'],'table',11,1,1,'小数据表格任务专长。','预训练先验的适用范围受任务、数据类型与规模约束。','grid','model'),
 c('burst','算力大爆发',4,[],'all',0,0,0,'连续 3 回合获得 6 临时算力；只能用于计算。','临时算力不能用于购买、升阶与拍卖。','bolt','event','burst'),
 c('cool','液冷回路',4,[],'all',0,0,0,'永久散热 +8，每人最多安装 1 件。','散热决定持续算力，而不只看峰值性能。','snow','hardware','cool'),
 c('cloud','云端支援',3,[],'all',0,0,0,'本回合吞吐 +8、显存 +4；不免除运行支出。','可用容量和可支付预算是两个不同的约束。','cloud','event','cloud'),
 c('overclock','极限超频',2,[],'all',0,0,0,'本回合吞吐 +50%，结算热量 +25。','短期吞吐提升会带来热量和下一回合降频代价。','bolt','event','overclock'),
 c('golden','黄金标注',3,[],'all',0,0,0,'标注覆盖率 +20%，最多 100%。','标注数量和标注可靠性都影响有效数据量。','dna','data','label'),
 c('multicenter','多中心队列',4,[],'all',0,0,0,'泛化覆盖 +15%，最多 100%。','跨中心数据应保留独立测试中心，以评估真实迁移。','network','data','coverage'),
 c('open','开放数据洪流',2,[],'all',0,0,0,'样本量 +50%；质量降低 5%，需要清洗。','更多低质量数据不必然带来更好模型。','wave','data','data')
];
export const CARD_MAP=Object.fromEntries(CARDS.map(c=>[c.id,c]));
export const TALENTS=[
 {id:'mentor',name:'专精导师',desc:'你的第一张模型贡献 +15%。'},
 {id:'lean',name:'小而精',desc:'阵容不超过 5 张时，训练成本 -20%。'},
 {id:'repro',name:'复现实验室',desc:'消融与重复实验各只需 1 算力。'},
 {id:'patient',name:'长期主义',desc:'从选择后的下一回合起，固定收入 +1。'},
 {id:'robust',name:'稳健研究',desc:'稳健性 +8。'},
 {id:'scholar',name:'研究积累',desc:'每轮额外获得 1 经验。'},
 {id:'exclusive',name:'专属共鸣',desc:'角色主动技能的贡献或主任务增益再提高 5 个百分点／2 分。'}
];
export const TAG_COLORS:Record<string,string>={'序列':'#6fd7dc','信号':'#69e7cd','视觉':'#b69aff','多尺度':'#d3a2ee','图谱':'#e5c178','组学':'#f6b76c','融合':'#dd9dcb','稳健':'#8cbbdf','推理':'#7bbcff','高效':'#c6d596','自监督':'#b9a6dd','交互':'#fa8fa5'};
export const CHALLENGES=[
 {name:'基线试验',desc:'建立有效流程，观察各维度如何改变。',kind:'normal'},
 {name:'小样本试炼',desc:'有限标注下的学习效率。数据质量贡献更高。',kind:'small'},
 {name:'跨中心迁移',desc:'测试分布发生偏移。泛化维度权重提高。',kind:'domain'},
 {name:'噪声突袭',desc:'传感器噪声与图像伪影。稳健维度更重要。',kind:'noise'},
 {name:'长程依赖',desc:'利用较长的上下文和时间关系。',kind:'long'},
 {name:'效率竞速',desc:'在有限计算中找到性能与开销的平衡。',kind:'efficient'},
 {name:'缺失模态',desc:'部分输入缺失，稳健融合接受考验。',kind:'missing'},
 {name:'分布漂移',desc:'训练和测试不再同分布。',kind:'domain'},
 {name:'置信度审查',desc:'不仅要答对，还要知道自己有多确定。',kind:'calibration'},
 {name:'复现危机',desc:'独立分割、消融与重复试验决定可信度。',kind:'repro'},
 {name:'综合评测',desc:'最后一次拍卖后，检验完整系统。',kind:'normal'},
 {name:'终局 · 未知世界',desc:'所有维度同时接受考验。',kind:'final'}
];
export const UPGRADE_XP=[0,4,4,6,6,8];
export const UPGRADE_COST=[0,3,5,7,9,12];
export const ODDS=[[100,0,0,0,0,0],[65,35,0,0,0,0],[45,35,20,0,0,0],[25,35,30,10,0,0],[15,25,30,25,5,0],[8,15,25,30,17,5]];
