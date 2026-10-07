import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const rooms=sqliteTable('rooms',{code:text('code').primaryKey(),state:text('state').notNull(),revision:integer('revision').notNull().default(0),updated:integer('updated').notNull()});
export const sessions=sqliteTable('sessions',{id:text('id').primaryKey(),room:text('room'),created:integer('created').notNull()});
