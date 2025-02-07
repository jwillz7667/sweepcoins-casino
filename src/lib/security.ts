import { toast } from "sonner";

// Types
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

interface CSRFConfig {
  tokenLength: number;
  cookieName: string;
  headerName: string;
}

interface SessionConfig {
  maxAge: number; // in milliseconds
  inactivityTimeout: number; // in milliseconds
}

interface Transaction {
  from: string;
  to: string;
  value: string;
  data?: string;
  nonce?: number;
  gasLimit?: string;
  gasPrice?: string;
}

// Configurations
const rateLimitConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // maximum requests per window
};

const csrfConfig: CSRFConfig = {
  tokenLength: 32,
  cookieName: 'csrf-token',
  headerName: 'X-CSRF-Token'
};

const sessionConfig: SessionConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  inactivityTimeout: 30 * 60 * 1000 // 30 minutes
};

// Rate Limiting Implementation
const rateLimitStore: RateLimitStore = {};

export const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  
  // Clean up expired entries
  Object.keys(rateLimitStore).forEach(k => {
    if (rateLimitStore[k].resetTime < now) {
      delete rateLimitStore[k];
    }
  });
  
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + rateLimitConfig.windowMs
    };
    return true;
  }
  
  if (rateLimitStore[key].count >= rateLimitConfig.maxRequests) {
    toast.error('Rate limit exceeded. Please try again later.');
    return false;
  }
  
  rateLimitStore[key].count++;
  return true;
};

// CSRF Protection
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(csrfConfig.tokenLength);
  crypto.getRandomValues(array);
  const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  document.cookie = `${csrfConfig.cookieName}=${token}; path=/; SameSite=Strict; Secure`;
  return token;
};

export const validateCSRFToken = (token: string): boolean => {
  const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${csrfConfig.cookieName}=`))
    ?.split('=')[1];
  
  return token === cookieToken;
};

// Session Management
export const initializeSession = async (): Promise<void> => {
  const sessionStart = Date.now();
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const sessionId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  localStorage.setItem('sessionStart', sessionStart.toString());
  localStorage.setItem('sessionId', sessionId);
  localStorage.setItem('lastActivity', sessionStart.toString());
};

export const validateSession = (): boolean => {
  const sessionStart = parseInt(localStorage.getItem('sessionStart') || '0');
  const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
  const now = Date.now();
  
  // Check session age
  if (now - sessionStart > sessionConfig.maxAge) {
    clearSession();
    return false;
  }
  
  // Check inactivity
  if (now - lastActivity > sessionConfig.inactivityTimeout) {
    clearSession();
    return false;
  }
  
  // Update last activity
  localStorage.setItem('lastActivity', now.toString());
  return true;
};

export const clearSession = (): void => {
  localStorage.removeItem('sessionStart');
  localStorage.removeItem('sessionId');
  localStorage.removeItem('lastActivity');
};

// Wallet Connection Security
export const verifyWalletSignature = async (
  address: string,
  signature: string,
  message: string
): Promise<boolean> => {
  try {
    // Use ethers.js to verify the signature
    const signerAddr = await window.ethereum.request({
      method: 'personal_ecRecover',
      params: [message, signature]
    });
    
    return signerAddr.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};

export const validateWalletConnection = async (address: string): Promise<boolean> => {
  try {
    // Check if the wallet is still connected
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    });
    
    return accounts.some((acc: string) => 
      acc.toLowerCase() === address.toLowerCase()
    );
  } catch (error) {
    console.error('Wallet validation failed:', error);
    return false;
  }
};

// Transaction Signing Verification
export const verifyTransactionSignature = async (
  transaction: Transaction,
  signature: string
): Promise<boolean> => {
  try {
    // Create transaction hash using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(transaction));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const txHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Verify the signature matches the transaction
    const recoveredAddress = await window.ethereum.request({
      method: 'personal_ecRecover',
      params: [txHash, signature]
    });
    
    return recoveredAddress.toLowerCase() === transaction.from.toLowerCase();
  } catch (error) {
    console.error('Transaction signature verification failed:', error);
    return false;
  }
};

// Security Context Provider Helper
export const initializeSecurity = (): void => {
  // Initialize CSRF token
  generateCSRFToken();
  
  // Initialize session
  initializeSession();
  
  // Set up activity listener for session management
  document.addEventListener('click', () => {
    if (validateSession()) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }
  });
  
  // Set up wallet connection listener
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length === 0) {
        clearSession();
        toast.error('Wallet disconnected');
      }
    });
  }
};

/**
 * Generates a secure hash using the Web Crypto API
 */
export async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a secure random string
 */
export function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
}

/**
 * Validates input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '');
}

export const security = {
  generateHash,
  generateRandomString,
  sanitizeInput,
  checkRateLimit,
  generateCSRFToken,
  validateCSRFToken,
  initializeSession,
  validateSession,
  clearSession,
  verifyWalletSignature,
  validateWalletConnection,
  verifyTransactionSignature,
  initializeSecurity,
}; 