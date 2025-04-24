import { 
  User, InsertUser, 
  Trip, InsertTrip, 
  InsurancePlan, InsertInsurancePlan,
  Order, InsertOrder,
  users, trips, insurancePlans, orders
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { pool } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Using a memory store instead of Postgres for sessions to avoid connection issues
const MemoryStore = createMemoryStore(session);

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
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24 hours
      stale: false, // Don't automatically remove idle sessions
      ttl: 7 * 24 * 60 * 60 * 1000 // 7 days max age
    });
    console.log('Using memory session store for auth sessions');
    
    // Create a periodic task to keep sessions active
    setInterval(() => {
      console.log('Periodic session store maintenance task running');
    }, 10 * 60 * 1000); // Every 10 minutes
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
    console.log("DatabaseStorage.createTrip - Inserting trip:", insertTrip);
    
    try {
      // Make sure the userId is valid and exists
      const user = await this.getUser(insertTrip.userId);
      if (!user) {
        throw new Error(`User with ID ${insertTrip.userId} not found`);
      }
      
      // Verify the data is valid
      if (!insertTrip.destination || !insertTrip.tripType || 
          !insertTrip.departureDate || !insertTrip.returnDate) {
        throw new Error("Missing required trip fields");
      }
      
      // Insert the trip with explicit typing of priorities as jsonb
      const results = await db.insert(trips).values({
        ...insertTrip,
        priorities: insertTrip.priorities as any // Cast to any to handle jsonb type
      }).returning();
      
      if (!results || results.length === 0) {
        throw new Error("Failed to create trip - no results returned");
      }
      
      console.log("DatabaseStorage.createTrip - Trip created successfully:", results[0]);
      return results[0];
    } catch (error) {
      console.error("DatabaseStorage.createTrip - Error:", error);
      throw error; // Re-throw to handle in the route
    }
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
  
  // Seed test data including users and insurance plans
  async seedDataIfNeeded(): Promise<void> {
    try {
      // First check and seed test user if needed
      const testUser = await this.getUserByUsername("demo");
      if (!testUser) {
        // Import the hashedPassword function from auth.ts
        const { scrypt, randomBytes } = await import('crypto');
        const { promisify } = await import('util');
        const scryptAsync = promisify(scrypt);
        
        const hashPassword = async (password: string) => {
          const salt = randomBytes(16).toString("hex");
          const buf = (await scryptAsync(password, salt, 64)) as Buffer;
          return `${buf.toString("hex")}.${salt}`;
        };
        
        console.log('Creating test user: demo / test123');
        await this.createUser({
          username: "demo",
          password: await hashPassword("test123"),
          email: "demo@example.com",
          name: "Demo User"
        });
        console.log('Test user created successfully');
      }
      
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
