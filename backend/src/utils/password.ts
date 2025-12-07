import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export class PasswordUtil {
  private static getSaltRounds(): number {
    return parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  }

  static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.getSaltRounds());
    return bcrypt.hash(password, salt);
  }

  static async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
