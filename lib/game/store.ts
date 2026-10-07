import {env} from 'cloudflare:workers';
export function database(){if(!env.DB)throw new Error('游戏存储暂时不可用，请稍后重试。');return env.DB}
