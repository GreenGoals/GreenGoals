import { NextResponse } from 'next/server';
import braintree from 'braintree';
import connectToDatabase from '../../../../lib/db';
import Transaction from '../../../../models/Transaction';

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { paymentMethodNonce, amount } = body;

    if (!paymentMethodNonce || !amount) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      );
    }

    const saleRequest = {
      amount,
      paymentMethodNonce,
      options: {
        submitForSettlement: true,
      },
    };

    const result = await gateway.transaction.sale(saleRequest);

    if (result.success) {
      const transaction = new Transaction({
        transactionId: result.transaction.id,
        amount,
        paymentMethodNonce,
      });

      await transaction.save();

      return NextResponse.json(
        { success: true, transactionId: result.transaction.id },
        { status: 200 }
      );
    } else {
      console.error('Braintree Error:', result.message);
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed. Please try again.' },
      { status: 500 }
    );
  }
}