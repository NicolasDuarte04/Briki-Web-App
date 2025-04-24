import { 
  User, InsertUser, 
  Trip, InsertTrip, 
  InsurancePlan, InsertInsurancePlan,
  Order, InsertOrder
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

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
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trips: Map<number, Trip>;
  private insurancePlans: Map<number, InsurancePlan>;
  private orders: Map<number, Order>;
  
  sessionStore: session.SessionStore;
  
  currentUserId: number;
  currentTripId: number;
  currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.trips = new Map();
    this.insurancePlans = new Map();
    this.orders = new Map();
    
    this.currentUserId = 1;
    this.currentTripId = 1;
    this.currentOrderId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24h, prune expired entries
    });
    
    // Seed insurance plans
    this.seedInsurancePlans();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id } as User;
    this.users.set(id, user);
    return user;
  }
  
  // Trip methods
  async getTrip(id: number): Promise<Trip | undefined> {
    return this.trips.get(id);
  }
  
  async getTripsByUserId(userId: number): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(
      (trip) => trip.userId === userId,
    );
  }
  
  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = this.currentTripId++;
    const trip: Trip = { ...insertTrip, id } as Trip;
    this.trips.set(id, trip);
    return trip;
  }
  
  // Insurance plan methods
  async getInsurancePlan(id: number): Promise<InsurancePlan | undefined> {
    return this.insurancePlans.get(id);
  }
  
  async getAllInsurancePlans(): Promise<InsurancePlan[]> {
    return Array.from(this.insurancePlans.values());
  }
  
  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { ...insertOrder, id } as Order;
    this.orders.set(id, order);
    return order;
  }
  
  // Seed data
  private seedInsurancePlans() {
    const plans: InsurancePlan[] = [
      {
        id: 1,
        name: "TravelGuard Gold",
        provider: "TravelGuard",
        basePrice: 149,
        description: "Comprehensive coverage for all your travel needs",
        medicalCoverage: 250000,
        tripCancellation: "100% of trip cost",
        baggageProtection: 2500,
        emergencyEvacuation: 500000,
        adventureActivities: true,
        rentalCarCoverage: 50000,
        rating: "4.8",
        reviews: 235
      },
      {
        id: 2,
        name: "SafeJourney Premium",
        provider: "SafeJourney",
        basePrice: 129,
        description: "Premium protection for worry-free travel",
        medicalCoverage: 150000,
        tripCancellation: "100% of trip cost",
        baggageProtection: 1500,
        emergencyEvacuation: 300000,
        adventureActivities: true,
        rentalCarCoverage: 35000,
        rating: "4.5",
        reviews: 189
      },
      {
        id: 3,
        name: "GlobalProtect Essentials",
        provider: "GlobalProtect",
        basePrice: 99,
        description: "Essential coverage at an affordable price",
        medicalCoverage: 100000,
        tripCancellation: "75% of trip cost",
        baggageProtection: 1000,
        emergencyEvacuation: 250000,
        adventureActivities: false,
        rentalCarCoverage: 0,
        rating: "4.0",
        reviews: 156
      },
      {
        id: 4,
        name: "WorldTravel Elite",
        provider: "WorldTravel",
        basePrice: 179,
        description: "Elite protection for discerning travelers",
        medicalCoverage: 500000,
        tripCancellation: "100% of trip cost",
        baggageProtection: 3000,
        emergencyEvacuation: 750000,
        adventureActivities: true,
        rentalCarCoverage: 75000,
        rating: "4.9",
        reviews: 312
      },
      {
        id: 5,
        name: "SecureTravel Basic",
        provider: "SecureTravel",
        basePrice: 79,
        description: "Basic coverage for budget travelers",
        medicalCoverage: 50000,
        tripCancellation: "50% of trip cost",
        baggageProtection: 750,
        emergencyEvacuation: 100000,
        adventureActivities: false,
        rentalCarCoverage: 0,
        rating: "3.7",
        reviews: 95
      },
      {
        id: 6,
        name: "Voyager Plus",
        provider: "Voyager",
        basePrice: 139,
        description: "Enhanced coverage for frequent travelers",
        medicalCoverage: 200000,
        tripCancellation: "100% of trip cost",
        baggageProtection: 2000,
        emergencyEvacuation: 400000,
        adventureActivities: true,
        rentalCarCoverage: 40000,
        rating: "4.6",
        reviews: 207
      }
    ];
    
    plans.forEach(plan => {
      this.insurancePlans.set(plan.id, plan);
    });
  }
}

export const storage = new MemStorage();
