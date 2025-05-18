import { db } from "./db";
import { eq, and, asc, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from 'nanoid';
import { 
  users,
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

// We're using the users schema from shared/schema.ts instead of defining it here

export type User = {
  id: string;
  username?: string;
  email: string;
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
  
  // Utility function to generate a username from email
  private generateUsernameFromEmail(email: string): string {
    if (!email) return 'user';
    
    // Take part before the @ symbol
    const localPart = email.split('@')[0];
    // Remove special characters and spaces
    const sanitized = localPart.replace(/[^a-zA-Z0-9]/g, '');
    // Ensure it's not empty
    return sanitized || 'user';
  }
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return user;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      return user;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.googleId, googleId))
        .limit(1);
      
      return user;
    } catch (error) {
      console.error("Error getting user by Google ID:", error);
      return undefined;
    }
  }

  async createUser(userData: UserAuth): Promise<User> {
    try {
      // Generate a username from email if not provided
      let username = userData.username;
      if (!username && userData.email) {
        // Take part before the @ symbol
        const localPart = userData.email.split('@')[0];
        // Remove special characters and spaces
        username = localPart.replace(/[^a-zA-Z0-9]/g, '');
        // Ensure it's not empty
        if (!username) username = 'user';
      } else if (!username) {
        username = 'user';
      }
      
      // Use proper Drizzle ORM insert syntax - only using fields that exist in the DB
      const [user] = await db
        .insert(users)
        .values({
          // id is an integer in the DB according to schema check
          // username as text
          username: username,
          // email as text
          email: userData.email,
          // password as text
          password: userData.password,
          // role as varchar
          role: userData.role || 'user',
          // Name field (combined first/last name)
          name: userData.firstName ? (userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.firstName) : 'User',
          // created_at will be handled by defaultNow()
        })
        .returning();
      
      console.log("User created successfully:", { id: user.id, email: user.email });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      // Log more detailed error information for debugging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
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
      
      // Using Drizzle ORM for the update
      const updateValues: any = {};
      
      // Build the update object dynamically
      if (updates.username !== undefined) updateValues.username = updates.username;
      if (updates.email !== undefined) updateValues.email = updates.email;
      if (updates.password !== undefined) updateValues.password = updates.password;
      if (updates.firstName !== undefined) updateValues.firstName = updates.firstName;
      if (updates.lastName !== undefined) updateValues.lastName = updates.lastName;
      if (updates.profileImageUrl !== undefined) updateValues.profileImageUrl = updates.profileImageUrl;
      if (updates.googleId !== undefined) updateValues.googleId = updates.googleId;
      if (updates.role !== undefined) updateValues.role = updates.role;
      
      // Always update updatedAt
      updateValues.updatedAt = new Date();
      
      const [user] = await db
        .update(users)
        .set(updateValues)
        .where(eq(users.id, id))
        .returning();
      
      return user;
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