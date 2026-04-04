import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    
    const paymentStatus = params.get('payment_status');
    const txnId = params.get('txn_id');
    const payerEmail = params.get('payer_email');
    const mcGross = params.get('mc_gross');
    const itemName = params.get('item_name');
    
    if (paymentStatus === 'Completed' || paymentStatus === 'Processed') {
      await prisma.donation.create({
        data: {
          transactionId: txnId,
          donorEmail: payerEmail,
          amount: parseFloat(mcGross) || 0,
          type: itemName || 'one-time',
          status: paymentStatus
        }
      });
      
      console.log(`Donation received: ${mcGross} from ${payerEmail}`);
    }
    
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
