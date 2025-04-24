import { pgTable, index, varchar, json, timestamp, unique, serial, text, foreignKey, integer, date, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const session = pgTable("session", {
	sid: varchar().primaryKey().notNull(),
	sess: json().notNull(),
	expire: timestamp({ precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	password: text().notNull(),
	name: text(),
	email: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("users_username_key").on(table.username),
]);

export const trips = pgTable("trips", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	destination: text().notNull(),
	departureDate: date("departure_date").notNull(),
	returnDate: date("return_date").notNull(),
	travelers: integer().notNull(),
	countryOfOrigin: text("country_of_origin").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "trips_user_id_fkey"
		}),
]);

export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	tripId: integer("trip_id"),
	insurancePlanId: integer("insurance_plan_id"),
	totalPrice: integer("total_price").notNull(),
	status: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_fkey"
		}),
	foreignKey({
			columns: [table.tripId],
			foreignColumns: [trips.id],
			name: "orders_trip_id_fkey"
		}),
	foreignKey({
			columns: [table.insurancePlanId],
			foreignColumns: [insurancePlans.id],
			name: "orders_insurance_plan_id_fkey"
		}),
]);

export const insurancePlans = pgTable("insurance_plans", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	provider: text().notNull(),
	basePrice: integer("base_price").notNull(),
	medicalCoverage: integer("medical_coverage").notNull(),
	tripCancellation: text("trip_cancellation").notNull(),
	baggageProtection: integer("baggage_protection").notNull(),
	emergencyEvacuation: integer("emergency_evacuation"),
	adventureActivities: boolean("adventure_activities").default(false),
	rentalCarCoverage: integer("rental_car_coverage"),
	rating: text(),
	reviews: integer().default(0),
	country: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
