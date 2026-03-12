import { pgTable, uuid, varchar, text, decimal, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('OPERATOR').notNull(),
});

export const categories = pgTable('categories', {
  id: integer('id').primaryKey(), // Using integer to match SERIAL id in db
  type: varchar('type', { length: 20 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  type: varchar('type', { length: 20 }).notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  date: timestamp('date', { withTimezone: true, mode: 'date' }).defaultNow(),
  hectares: decimal('hectares', { precision: 10, scale: 2 }),
  description: text('description'),
});
