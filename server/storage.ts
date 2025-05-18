import { db } from "./db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from 'nanoid';
import { 
  quotes, 
  InsertQuote, 
  Quote, 
  InsuranceCategory
} from "@shared/schema";

// Extended user input schema for auth functionality
export const userAuthSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string().nullable(), // Nullable for social auth
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional(),
  googleId: z.string().nullable().optional(),
  role: z.enum(["user", "admin", "company"]).default("user"),
  username: z.string().optional(), // Make username optional for backward compatibility
});

// Define user schema for database
export const users = {
  id: { name: "id", type: "text" },
  username: { name: "username", type: "text" },
  email: { name: "email", type: "text" },
  password: { name: "password", type: "text" },
  firstName: { name: "first_name", type: "text" },
  lastName: { name: "last_name", type: "text" },
  profileImageUrl: { name: "profile_image_url", type: "text" },
  googleId: { name: "google_id", type: "text" },
  role: { name: "role", type: "text" },
  createdAt: { name: "created_at", type: "timestamp" },
  updatedAt: { name: "updated_at", type: "timestamp" }
};

export type User = {
  id: string;
  username: string;
  email: string | null;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  googleId: string | null;
  role: "user" | "admin" | "company";
  createdAt: Date;
  updatedAt: Date;
};

export type UserAuth = z.infer<typeof userAuthSchema>;
export type UserUpdate = Partial<Omit<UserAuth, "id">>;

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: UserAuth): Promise<User>;
  updateUser(id: string, updates: UserUpdate): Promise<User>;
  
  // Quote operations
  createQuote(quoteData: InsertQuote): Promise<Quote>;
  getQuoteById(id: number): Promise<Quote | undefined>;
  getQuoteByReference(reference: string): Promise<Quote | undefined>;
  getUserQuotes(userId: string): Promise<Quote[]>;
  updateQuoteStatus(id: number, status: string): Promise<Quote>;
  markQuoteNotificationSent(id: number): Promise<Quote>;
}

// Implementation for PostgreSQL database
export class DatabaseStorage implements IStorage {
  // Helper function to generate unique quote reference
  private generateQuoteReference(): string {
    // Format: BRK-{random 8 char alphanumeric}-{timestamp}
    const randomPart = nanoid(8).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `BRK-${randomPart}-${timestamp}`;
  }
  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.query.raw(`
        SELECT * FROM users WHERE id = $1 LIMIT 1
      `, [id]);
      
      return result.rows[0] as User || undefined;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.query.raw(`
        SELECT * FROM users WHERE username = $1 LIMIT 1
      `, [username]);
      
      return result.rows[0] as User || undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    
    try {
      const result = await db.query.raw(`
        SELECT * FROM users WHERE email = $1 LIMIT 1
      `, [email]);
      
      return result.rows[0] as User || undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    try {
      const result = await db.query.raw(`
        SELECT * FROM users WHERE google_id = $1 LIMIT 1
      `, [googleId]);
      
      return result.rows[0] as User || undefined;
    } catch (error) {
      console.error("Error getting user by Google ID:", error);
      return undefined;
    }
  }

  async createUser(userData: UserAuth): Promise<User> {
    try {
      // Set current timestamp for created_at and updated_at
      const now = new Date();
      
      const result = await db.query.raw(`
        INSERT INTO users 
        (id, username, email, password, first_name, last_name, profile_image_url, google_id, role, created_at, updated_at)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        userData.id, 
        userData.username, 
        userData.email, 
        userData.password,
        userData.firstName || null,
        userData.lastName || null,
        userData.profileImageUrl || null,
        userData.googleId || null,
        userData.role || 'user',
        now,
        now
      ]);
      
      return result.rows[0] as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, updates: UserUpdate): Promise<User> {
    try {
      // Prepare the SET part of the SQL query dynamically
      const setValues: string[] = [];
      const queryParams: any[] = [id]; // First param is the ID
      let paramCounter = 2; // Start from 2 since ID is $1
      
      // Add each update field
      if (updates.username !== undefined) {
        setValues.push(`username = $${paramCounter++}`);
        queryParams.push(updates.username);
      }
      
      if (updates.email !== undefined) {
        setValues.push(`email = $${paramCounter++}`);
        queryParams.push(updates.email);
      }
      
      if (updates.password !== undefined) {
        setValues.push(`password = $${paramCounter++}`);
        queryParams.push(updates.password);
      }
      
      if (updates.firstName !== undefined) {
        setValues.push(`first_name = $${paramCounter++}`);
        queryParams.push(updates.firstName);
      }
      
      if (updates.lastName !== undefined) {
        setValues.push(`last_name = $${paramCounter++}`);
        queryParams.push(updates.lastName);
      }
      
      if (updates.profileImageUrl !== undefined) {
        setValues.push(`profile_image_url = $${paramCounter++}`);
        queryParams.push(updates.profileImageUrl);
      }
      
      if (updates.googleId !== undefined) {
        setValues.push(`google_id = $${paramCounter++}`);
        queryParams.push(updates.googleId);
      }
      
      if (updates.role !== undefined) {
        setValues.push(`role = $${paramCounter++}`);
        queryParams.push(updates.role);
      }
      
      // Always update the updated_at timestamp
      setValues.push(`updated_at = $${paramCounter++}`);
      queryParams.push(new Date());
      
      // Execute the update query
      const result = await db.query.raw(`
        UPDATE users
        SET ${setValues.join(', ')}
        WHERE id = $1
        RETURNING *
      `, queryParams);
      
      return result.rows[0] as User;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Quote operations
  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    try {
      // Generate a unique reference number for this quote
      const quoteReference = this.generateQuoteReference();
      
      // Set expiration date (30 days from now by default)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      // Insert the quote with the generated reference
      const [quote] = await db
        .insert(quotes)
        .values({
          ...quoteData,
          quoteReference,
          status: "pending",
          notificationSent: false,
          expiresAt
        })
        .returning();
      
      return quote;
    } catch (error) {
      console.error("Error creating quote:", error);
      throw error;
    }
  }

  async getQuoteById(id: number): Promise<Quote | undefined> {
    try {
      const [quote] = await db
        .select()
        .from(quotes)
        .where(eq(quotes.id, id));
      
      return quote;
    } catch (error) {
      console.error("Error getting quote by ID:", error);
      return undefined;
    }
  }

  async getQuoteByReference(reference: string): Promise<Quote | undefined> {
    try {
      const [quote] = await db
        .select()
        .from(quotes)
        .where(eq(quotes.quoteReference, reference));
      
      return quote;
    } catch (error) {
      console.error("Error getting quote by reference:", error);
      return undefined;
    }
  }

  async getUserQuotes(userId: string): Promise<Quote[]> {
    try {
      const userQuotes = await db
        .select()
        .from(quotes)
        .where(eq(quotes.userId, userId))
        .orderBy(quotes.createdAt);
      
      return userQuotes;
    } catch (error) {
      console.error("Error getting user quotes:", error);
      return [];
    }
  }

  async updateQuoteStatus(id: number, status: string): Promise<Quote> {
    try {
      const [updatedQuote] = await db
        .update(quotes)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(quotes.id, id))
        .returning();
      
      return updatedQuote;
    } catch (error) {
      console.error("Error updating quote status:", error);
      throw error;
    }
  }

  async markQuoteNotificationSent(id: number): Promise<Quote> {
    try {
      const [updatedQuote] = await db
        .update(quotes)
        .set({ 
          notificationSent: true,
          updatedAt: new Date()
        })
        .where(eq(quotes.id, id))
        .returning();
      
      return updatedQuote;
    } catch (error) {
      console.error("Error marking quote notification sent:", error);
      throw error;
    }
  }
}

// Export a singleton instance of the storage
export const storage = new DatabaseStorage();