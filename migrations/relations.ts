import { relations } from "drizzle-orm/relations";
import { users, trips, orders, insurancePlans } from "./schema";

export const tripsRelations = relations(trips, ({one, many}) => ({
	user: one(users, {
		fields: [trips.userId],
		references: [users.id]
	}),
	orders: many(orders),
}));

export const usersRelations = relations(users, ({many}) => ({
	trips: many(trips),
	orders: many(orders),
}));

export const ordersRelations = relations(orders, ({one}) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	trip: one(trips, {
		fields: [orders.tripId],
		references: [trips.id]
	}),
	insurancePlan: one(insurancePlans, {
		fields: [orders.insurancePlanId],
		references: [insurancePlans.id]
	}),
}));

export const insurancePlansRelations = relations(insurancePlans, ({many}) => ({
	orders: many(orders),
}));