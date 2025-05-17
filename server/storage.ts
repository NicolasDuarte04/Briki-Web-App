import { 
  User, InsertUser, UpsertUser,
  Trip, InsertTrip, 
  InsurancePlan, InsertInsurancePlan,
  Order, InsertOrder,
  users, trips, insurancePlans, orders, sessions
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
  getUser(id: string | null | undefined): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Trip methods
  getTrip(id: number): Promise<Trip | undefined>;
  getTripsByUserId(userId: string): Promise<Trip[]>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  
  // Insurance plan methods
  getInsurancePlan(id: number): Promise<InsurancePlan | undefined>;
  getAllInsurancePlans(): Promise<InsurancePlan[]>;
  getInsurancePlansByCategory(category: string): Promise<InsurancePlan[]>;
  
  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;

  // Session store
  sessionStore: any;
  
  // Seed and reset data
  seedDataIfNeeded(): Promise<void>;
  resetUsers(): Promise<void>;
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
  async getUser(id: string | null | undefined): Promise<User | undefined> {
    if (id === null || id === undefined) {
      return undefined;
    }
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
  
  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Trip methods
  async getTrip(id: number): Promise<Trip | undefined> {
    const results = await db.select().from(trips).where(eq(trips.id, id));
    return results[0];
  }
  
  async getTripsByUserId(userId: string): Promise<Trip[]> {
    return await db.select().from(trips)
      .where(eq(trips.userId, userId))
      .orderBy(desc(trips.createdAt));
  }
  
  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    console.log("DatabaseStorage.createTrip - Inserting trip:", insertTrip);
    
    try {
      // Make sure the userId is valid and exists
      if (insertTrip.userId === undefined) {
        throw new Error("User ID is required to create a trip");
      }
      
      const user = await this.getUser(insertTrip.userId);
      if (!user) {
        throw new Error(`User with ID ${insertTrip.userId} not found`);
      }
      
      // Verify the data is valid
      if (!insertTrip.destination || !insertTrip.countryOfOrigin || 
          !insertTrip.departureDate || !insertTrip.returnDate) {
        throw new Error("Missing required trip fields");
      }
      
      // Insert the trip with only the fields that exist in the database schema
      const results = await db.insert(trips).values({
        userId: insertTrip.userId,
        destination: insertTrip.destination,
        countryOfOrigin: insertTrip.countryOfOrigin,
        departureDate: insertTrip.departureDate,
        returnDate: insertTrip.returnDate,
        travelers: insertTrip.travelers
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
    // Use a raw query that excludes the category field since it doesn't exist in the DB yet
    const plans = await db.execute(
      `SELECT 
        id, name, provider, base_price as "basePrice", 
        medical_coverage as "medicalCoverage", trip_cancellation as "tripCancellation", 
        baggage_protection as "baggageProtection", emergency_evacuation as "emergencyEvacuation",
        adventure_activities as "adventureActivities", rental_car_coverage as "rentalCarCoverage",
        rating, reviews, country, created_at as "createdAt"
      FROM insurance_plans`
    );
    return plans.rows as InsurancePlan[];
  }
  
  async getInsurancePlansByCategory(category: string): Promise<InsurancePlan[]> {
    // Since we don't have a category column in the database yet, we'll simulate it
    // based on other fields for now until we can migrate the database
    const allPlans = await this.getAllInsurancePlans();
    
    if (category === 'travel') {
      // For travel, return plans that have tripCancellation
      return allPlans.filter(plan => plan.tripCancellation !== null);
    } else if (category === 'auto') {
      // For auto, return plans with rental car coverage
      return allPlans.filter(plan => typeof plan.rentalCarCoverage === 'number' && plan.rentalCarCoverage > 10000);
    } else if (category === 'pet') {
      // For pet, select a subset of plans (in a real implementation, we'd have actual pet insurance)
      return allPlans.slice(0, 2);
    } else if (category === 'health') {
      // For health, return plans with high medical coverage
      return allPlans.filter(plan => plan.medicalCoverage > 200000);
    }
    
    // Default: return all plans
    return allPlans;
  }
  
  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    const results = await db.select().from(orders).where(eq(orders.id, id));
    return results[0];
  }
  
  async getOrdersByUserId(userId: string): Promise<Order[]> {
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
      // First check if users table exists
      try {
        // Use a raw query to check if the table exists to avoid schema errors
        const usersTableQuery = await db.execute(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
          );
        `);
        
        if (!usersTableQuery.rows[0]?.exists) {
          console.log('Users table does not exist yet, skipping seed');
          return;
        }
      } catch (error) {
        console.error('Error checking if users table exists:', error);
        return;
      }
      
      // Check if the test user exists using a direct query to avoid schema issues
      const userExistsQuery = await db.execute(`
        SELECT COUNT(*) as count FROM users WHERE username = 'demo';
      `);
      
      const userExists = userExistsQuery.rows[0]?.count 
        ? parseInt(userExistsQuery.rows[0].count as string) > 0
        : false;
      
      // Create test user if it doesn't exist
      if (!userExists) {
        console.log('Creating test user: demo');
        
        await db.execute(`
          INSERT INTO users (id, username, email, role, "firstName", "lastName")
          VALUES ('demo123', 'demo', 'demo@example.com', 'user', 'Demo', 'User');
        `);
        
        console.log('Test user created successfully');
      }
      
      // Check if plans already exist using raw SQL to avoid schema mismatch
      const existingPlansQuery = await db.execute(`SELECT COUNT(*) as count FROM insurance_plans`);
      const existingPlans = existingPlansQuery.rows[0]?.count ? parseInt(existingPlansQuery.rows[0].count as string) : 0;
      
      if (existingPlans === 0) {
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
  
  async resetUsers(): Promise<void> {
    try {
      console.log('Resetting users database...');
      
      // Delete all orders
      await db.delete(orders);
      console.log('Deleted all orders');
      
      // Delete all trips
      await db.delete(trips);
      console.log('Deleted all trips');
      
      // Delete all users
      await db.delete(users);
      console.log('Deleted all users');
      
      console.log('All user data has been reset successfully');
    } catch (error) {
      console.error('Error resetting user database:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
