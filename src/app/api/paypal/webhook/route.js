import { NextResponse } from 'next/server';
import { openDb } from '../../../../lib/database';

export async function POST(request) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    
    // PayPal IPN verification (in production, you should verify with PayPal)
    const paymentStatus = params.get('payment_status');
    const txnId = params.get('txn_id');
    const payerEmail = params.get('payer_email');
    const mcGross = params.get('mc_gross');
    const itemName = params.get('item_name');
    const subscriptionId = params.get('subscr_id');
    
    if (paymentStatus === 'Completed' || paymentStatus === 'Processed') {
      const db = await openDb();
      
      // Log the donation
      await db.run(`
        INSERT INTO donations (
          transaction_id, 
          payer_email, 
          amount, 
          item_name, 
          payment_status,
          subscription_id,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `, [txnId, payerEmail, mcGross, itemName, paymentStatus, subscriptionId]);
      
      // You could also send a thank you email here
      console.log(`Donation received: $${mcGross} from ${payerEmail}`);
    }
    
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}