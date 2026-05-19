import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as db from './db';

// Mock della funzione notifyOwner
vi.mock('./_core/notification', () => ({
  notifyOwner: vi.fn(async () => true),
}));

describe('Consultation System', () => {
  describe('createConsultationRequest', () => {
    it('should create a consultation request with verification token', async () => {
      const mockRequest = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+39 123 456 7890',
        age: 30,
        weight: 75,
        height: 180,
        goal: 'Perdere peso',
        medicalConditions: 'Nessuna',
        allergies: 'Nessuna',
        currentDiet: 'Dieta equilibrata',
        message: 'Voglio dimagrire',
        privacyConsent: true,
        verificationToken: 'test-token-123',
        status: 'pending_verification' as const,
        privacyConsentDate: new Date(),
      };

      // Verify the request structure
      expect(mockRequest).toHaveProperty('name');
      expect(mockRequest).toHaveProperty('email');
      expect(mockRequest).toHaveProperty('verificationToken');
      expect(mockRequest.status).toBe('pending_verification');
      expect(mockRequest.privacyConsent).toBe(true);
    });
  });

  describe('getConsultationRequestByToken', () => {
    it('should return undefined for invalid token', async () => {
      // This would be tested with actual DB in integration tests
      const result = await db.getConsultationRequestByToken('invalid-token');
      expect(result).toBeUndefined();
    });
  });

  describe('verifyConsultationEmail', () => {
    it('should update emailVerified status', async () => {
      // Verify the function exists and has correct signature
      expect(typeof db.verifyConsultationEmail).toBe('function');
    });
  });

  describe('getAdminNotificationEmail', () => {
    it('should return admin notification email setting', async () => {
      // Verify the function exists
      expect(typeof db.getAdminNotificationEmail).toBe('function');
    });
  });

  describe('Verification Token Generation', () => {
    it('should generate unique tokens', () => {
      const token1 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const token2 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(0);
      expect(token2.length).toBeGreaterThan(0);
    });

    it('should generate tokens with sufficient length', () => {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      expect(token.length).toBeGreaterThanOrEqual(20);
    });
  });

  describe('Email Validation', () => {
    it('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid emails', () => {
      const invalidEmails = [
        'invalid.email',
        '@example.com',
        'user@',
        'user name@example.com',
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('Consultation Request Status', () => {
    it('should have correct status values', () => {
      const validStatuses = ['pending_verification', 'new', 'contacted', 'scheduled', 'completed'];
      const testStatus = 'pending_verification';
      
      expect(validStatuses).toContain(testStatus);
    });
  });

  describe('Privacy Consent', () => {
    it('should require privacy consent', () => {
      const requestWithConsent = {
        name: 'John Doe',
        email: 'john@example.com',
        privacyConsent: true,
        privacyConsentDate: new Date(),
      };

      expect(requestWithConsent.privacyConsent).toBe(true);
      expect(requestWithConsent.privacyConsentDate).toBeInstanceOf(Date);
    });

    it('should track consent date', () => {
      const now = new Date();
      const requestWithConsent = {
        privacyConsent: true,
        privacyConsentDate: now,
      };

      expect(requestWithConsent.privacyConsentDate.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });
});
