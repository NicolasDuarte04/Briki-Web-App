import { 
  User, InsertUser, 
  Trip, InsertTrip, 
  InsurancePlan, InsertInsurancePlan,
  Order, InsertOrder,
  users, trips, insurancePlans, orders
} from "@shared/schema";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { db } from "./db";
import { pool } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Session store setup for Postgres
const PgSessionStore = connectPgSimple(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Trip methods
  getTrip(id: number): Promise<Trip | undefined>;
  getTripsByUserId(userId: number): Promise<Trip[]>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  
  // Insurance plan methods
  getInsurancePlan(id: number): Promise<InsurancePlan | undefined>;
  getAllInsurancePlans(): Promise<InsurancePlan[]>;
  
  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;

  // Session store
  sessionStore: any;
  
  // Seed necessary data
  seedDataIfNeeded(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PgSessionStore({ 
      pool,
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const results = await db.insert(users).values(insertUser).returning();
    return results[0];
  }
  
  // Trip methods
  async getTrip(id: number): Promise<Trip | undefined> {
    const results = await db.select().from(trips).where(eq(trips.id, id));
    return results[0];
  }
  
  async getTripsByUserId(userId: number): Promise<Trip[]> {
    return await db.select().from(trips)
      .where(eq(trips.userId, userId))
      .orderBy(desc(trips.createdAt));
  }
  
  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const results = await db.insert(trips).values(insertTrip).returning();
    return results[0];
  }
  
  // Insurance plan methods
  async getInsurancePlan(id: number): Promise<InsurancePlan | undefined> {
    const results = await db.select().from(insurancePlans).where(eq(insurancePlans.id, id));
    return results[0];
  }
  
  async getAllInsurancePlans(): Promise<InsurancePlan[]> {
    return await db.select().from(insurancePlans);
  }
  
  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    const results = await db.select().from(orders).where(eq(orders.id, id));
    return results[0];
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const results = await db.insert(orders).values(insertOrder).returning();
    return results[0];
  }
  
  // Seed insurance plans for Colombia and Mexico
  async seedDataIfNeeded(): Promise<void> {
    try {
      // Check if plans already exist
      const existingPlans = await db.select().from(insurancePlans);
      
      if (existingPlans.length === 0) {
        console.log('No existing plans found, seeding database...');
        
        // Insert Colombia plans
        await db.insert(insurancePlans).values({
          name: "Seguro Mundial Premium",
          provider: "Seguros Mundial",
          basePrice: 99,
          medicalCoverage: 250000,
          tripCancellation: "100% del costo del viaje",
          baggageProtection: 2500,
          emergencyEvacuation: 500000,
          adventureActivities: true,
          rentalCarCoverage: 50000,
          rating: "4.7",
          reviews: 182,
          country: "Colombia"
        });

        await db.insert(insurancePlans).values({
          name: "Assist Card Oro",
          provider: "Assist Card",
          basePrice: 85,
          medicalCoverage: 150000,
          tripCancellation: "100% del costo del viaje",
          baggageProtection: 1800,
          emergencyEvacuation: 300000,
          adventureActivities: true,
          rentalCarCoverage: 35000,
          rating: "4.6",
          reviews: 245,
          country: "Colombia"
        });

        // Insert Mexico plans
        await db.insert(insurancePlans).values({
          name: "GNP Básico",
          provider: "GNP Seguros",
          basePrice: 65,
          medicalCoverage: 100000,
          tripCancellation: "75% del costo del viaje",
          baggageProtection: 1000,
          emergencyEvacuation: 250000,
          adventureActivities: false,
          rentalCarCoverage: 0,
          rating: "4.2",
          reviews: 156,
          country: "Mexico"
        });

        await db.insert(insurancePlans).values({
          name: "AXA Elite",
          provider: "AXA Seguros",
          basePrice: 129,
          medicalCoverage: 500000,
          tripCancellation: "100% del costo del viaje",
          baggageProtection: 3000,
          emergencyEvacuation: 750000,
          adventureActivities: true,
          rentalCarCoverage: 75000,
          rating: "4.8",
          reviews: 203,
          country: "Mexico"
        });
        
        console.log('Database seeded with insurance plans for Colombia and Mexico');
      } else {
        console.log('Plans already exist, skipping seed');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
}

export const storage = new DatabaseStorage();
