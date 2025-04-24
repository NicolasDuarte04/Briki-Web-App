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
    // Check if plans already exist
    const existingPlans = await db.select().from(insurancePlans);
    
    if (existingPlans.length === 0) {
      // Colombia and Mexico specific insurance plans
      const plans = [
        {
          name: "Seguro Mundial Premium",
          provider: "Seguros Mundial",
          basePrice: 99,
          description: "Cobertura completa para viajeros colombianos",
          medicalCoverage: 250000,
          tripCancellation: "100% del costo del viaje",
          baggageProtection: 2500,
          emergencyEvacuation: 500000,
          adventureActivities: true,
          rentalCarCoverage: 50000,
          rating: "4.7",
          reviews: 182
        },
        {
          name: "Assist Card Oro",
          provider: "Assist Card",
          basePrice: 85,
          description: "Protección premium para viajeros latinoamericanos",
          medicalCoverage: 150000,
          tripCancellation: "100% del costo del viaje",
          baggageProtection: 1800,
          emergencyEvacuation: 300000,
          adventureActivities: true,
          rentalCarCoverage: 35000,
          rating: "4.6",
          reviews: 245
        },
        {
          name: "GNP Básico",
          provider: "GNP Seguros",
          basePrice: 65,
          description: "Cobertura esencial para viajeros mexicanos",
          medicalCoverage: 100000,
          tripCancellation: "75% del costo del viaje",
          baggageProtection: 1000,
          emergencyEvacuation: 250000,
          adventureActivities: false,
          rentalCarCoverage: 0,
          rating: "4.2",
          reviews: 156
        },
        {
          name: "AXA Elite",
          provider: "AXA Seguros",
          basePrice: 129,
          description: "Protección elite para viajeros exigentes",
          medicalCoverage: 500000,
          tripCancellation: "100% del costo del viaje",
          baggageProtection: 3000,
          emergencyEvacuation: 750000,
          adventureActivities: true,
          rentalCarCoverage: 75000,
          rating: "4.8",
          reviews: 203
        },
        {
          name: "Allianz Básico",
          provider: "Allianz",
          basePrice: 60,
          description: "Cobertura básica para viajeros con presupuesto ajustado",
          medicalCoverage: 50000,
          tripCancellation: "50% del costo del viaje",
          baggageProtection: 750,
          emergencyEvacuation: 100000,
          adventureActivities: false,
          rentalCarCoverage: 0,
          rating: "3.9",
          reviews: 112
        },
        {
          name: "Liberty Plus",
          provider: "Liberty Seguros",
          basePrice: 89,
          description: "Cobertura mejorada para viajeros frecuentes",
          medicalCoverage: 200000,
          tripCancellation: "100% del costo del viaje",
          baggageProtection: 2000,
          emergencyEvacuation: 400000,
          adventureActivities: true,
          rentalCarCoverage: 40000,
          rating: "4.5",
          reviews: 178
        },
        {
          name: "Mapfre Premium",
          provider: "Mapfre",
          basePrice: 109,
          description: "Protección integral para viajeros latinoamericanos",
          medicalCoverage: 300000,
          tripCancellation: "100% del costo del viaje",
          baggageProtection: 2500,
          emergencyEvacuation: 550000,
          adventureActivities: true,
          rentalCarCoverage: 60000,
          rating: "4.7",
          reviews: 215
        },
        {
          name: "HDI Básico",
          provider: "HDI Seguros",
          basePrice: 69,
          description: "Cobertura esencial a precio accesible",
          medicalCoverage: 75000,
          tripCancellation: "60% del costo del viaje",
          baggageProtection: 900,
          emergencyEvacuation: 175000,
          adventureActivities: false,
          rentalCarCoverage: 0,
          rating: "4.0",
          reviews: 133
        }
      ];
      
      // Insert plans
      for (const plan of plans) {
        await db.insert(insurancePlans).values(plan);
      }
      
      console.log('Database seeded with insurance plans for Colombia and Mexico');
    }
  }
}

export const storage = new DatabaseStorage();
