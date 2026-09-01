import { collection, addDoc, serverTimestamp, db } from '../lib/firebase';
import { AuditActionType, AuditLog } from '../types';

export async function logAuditEvent(params: {
  userId: string;
  userEmail?: string;
  userName?: string;
  actionType: AuditActionType;
  description: string;
  relatedProductId?: string;
  relatedProductName?: string;
  relatedOrderId?: string;
  metadata?: Record<string, any>;
}): Promise<AuditLog> {
  const timestamp = new Date().toISOString();
  const logData: Omit<AuditLog, 'id'> = {
    userId: params.userId || 'guest_user',
    userEmail: params.userEmail || 'guest@coremay.ai',
    userName: params.userName || 'Guest Shopper',
    actionType: params.actionType,
    description: params.description,
    relatedProductId: params.relatedProductId || '',
    relatedProductName: params.relatedProductName || '',
    relatedOrderId: params.relatedOrderId || '',
    timestamp,
    metadata: params.metadata || {}
  };

  try {
    const docRef = await addDoc(collection(db, 'auditLogs'), {
      ...logData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...logData };
  } catch (error) {
    console.warn('[Audit Logger] Firestore write skipped/fallback:', error);
    // Fallback local memory log id
    return {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...logData
    };
  }
}
