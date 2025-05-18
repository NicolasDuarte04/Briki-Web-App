import { db } from "./db";
import { eq, and, asc, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from 'nanoid';
import { 
  users,
  quotes, 
  InsertQuote, 
  Quote, 
  InsuranceCategory,
  CustomUser
} from "@shared/schema";

// Extended user input schema for auth functionality - matching actual DB schema
export const userAuthSchema = z.object({
  // id is number in the actual DB and auto-generated
  id: z.number().optional(),
  email: z.string().email(),
  password: z.string().nullable(), // Nullable for social auth
  name: z.string().nullable().optional(),
  role: z.string().default("user"),
  username: z.string().nullable().optional(), // Make username optional for backward compatibility
  company_profile: z.any().optional(),
  // No firstName, lastName, profileImageUrl, or googleId in actual DB
});

// We're using the CustomUser type from shared/schema.ts to match DB fields precisely
export type User = CustomUser;

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
      // Convert string id to number since database uses integer ids
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        console.error("Invalid user ID format:", id);
        return undefined;
      }
      
      // Use SQL template for explicit type conversion
      const result = await db.execute(sql`
        SELECT * FROM users WHERE id = ${numericId} LIMIT 1
      `);
      
      if (!result || !result.rows || result.rows.length === 0) {
        return undefined;
      }
      
      return result.rows[0] as User;
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
      // Select only fields that exist in the actual database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      return user || undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  // Since we don't have a dedicated googleId column in the database,
  // we need to search in the company_profile JSON field where we store it
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    try {
      // Using a simple query with the Pool directly for JSON field querying
      const result = await db.execute(sql`
        SELECT * FROM users 
        WHERE company_profile->>'googleProfileId' = ${googleId}
        LIMIT 1
      `);
      
      // Check if we got any rows back
      if (result && result.rows && result.rows.length > 0) {
        return result.rows[0] as User;
      }
      
      console.log(`No user found with Google ID: ${googleId}`);
      return undefined;
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
      
      console.log("Attempting to create user with email:", userData.email);
      
      // Use proper Drizzle ORM insert syntax matching the actual DB schema
      // Only using fields that exist in the database
      const [user] = await db
        .insert(users)
        .values({
          email: userData.email,
          username: username,
          password: userData.password,
          role: userData.role || 'user',
          name: userData.name || 'New User', // Use provided name or default
          company_profile: userData.company_profile || {} // Use provided company_profile or empty object
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

  // Updated to match interface with two parameters
  async updateUser(idParam: any, updates?: UserUpdate): Promise<User> {
    try {
      // Support both update patterns: updateUser(id, updates) and updateUser({id, ...updates})
      let id: number;
      let updateData: any = {};
      
      // Check if first parameter is an object containing id and updates
      if (typeof idParam === 'object' && idParam !== null) {
        // Extract id from the object
        id = typeof idParam.id === 'number' ? idParam.id : parseInt(idParam.id, 10);
        
        // Copy all other properties as updates
        updateData = {...idParam};
        delete updateData.id; // Remove id from updates object
      } else {
        // Traditional approach: separate id and updates parameters
        id = typeof idParam === 'number' ? idParam : parseInt(idParam, 10);
        updateData = updates || {};
      }
      
      if (isNaN(id)) {
        throw new Error(`Invalid user ID: ${idParam}`);
      }
      
      // Using Drizzle ORM for the update - only include fields that exist in the actual DB
      const updateValues: any = {};
      
      // Build the update object with only fields that exist in our actual database
      if (updateData.username !== undefined) updateValues.username = updateData.username;
      if (updateData.email !== undefined) updateValues.email = updateData.email;
      if (updateData.password !== undefined) updateValues.password = updateData.password;
      if (updateData.name !== undefined) updateValues.name = updateData.name;
      if (updateData.role !== undefined) updateValues.role = updateData.role;
      
      // Special handling for company_profile to merge with existing data
      if (updateData.company_profile !== undefined) {
        console.log("Updating company_profile with:", updateData.company_profile);
        
        // First get the current user to properly merge profiles
        const result = await db.execute(sql`
          SELECT company_profile FROM users WHERE id = ${id} LIMIT 1
        `);
        
        let existingProfile = {};
        if (result?.rows?.[0]?.company_profile) {
          existingProfile = result.rows[0].company_profile;
          console.log("Retrieved existing company_profile:", existingProfile);
        }
        
        // Merge the existing profile with new updates
        updateValues.company_profile = {
          ...existingProfile,
          ...updateData.company_profile
        };
        
        console.log("Merged company_profile:", updateValues.company_profile);
      }
      
      if (Object.keys(updateValues).length === 0) {
        console.log("No updates provided for user", id);
        const user = await this.getUser(id.toString());
        return user as User;
      }
      
      console.log(`Updating user ${id} with:`, updateValues);
      
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