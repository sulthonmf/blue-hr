import midtransClient from 'midtrans-client';
import { OrderRepository } from '../repositories';

export class MidtransService {
  private static getSnapClient() {
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const clientKey = process.env.MIDTRANS_CLIENT_KEY || '';
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

    return new (midtransClient as any).Snap({
      isProduction,
      serverKey,
      clientKey,
    });
  }

  static async createSnapTransaction(orderData: {
    planId: string;
    planName: string;
    billingCycle: 'monthly' | 'annual';
    amount: number;
    companyName: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
  }) {
    const snap = this.getSnapClient();
    const orderId = `BHR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const adminFee = 4500;
    const tax = Math.round(orderData.amount * 0.11);
    const totalAmount = orderData.amount + adminFee + tax;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      item_details: [
        {
          id: orderData.planId,
          price: orderData.amount,
          quantity: 1,
          name: `${orderData.planName} (${orderData.billingCycle === 'annual' ? 'Tahunan' : 'Bulanan'})`.slice(0, 50),
        },
        {
          id: 'PPN-11',
          price: tax,
          quantity: 1,
          name: 'PPN (11%)',
        },
        {
          id: 'ADMIN-FEE',
          price: adminFee,
          quantity: 1,
          name: 'Biaya Penanganan',
        },
      ],
      customer_details: {
        first_name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone || '081234567890',
        billing_address: {
          first_name: orderData.companyName,
          address: 'Indonesia',
        },
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // Save order record to database
    await OrderRepository.create({
      order_id: orderId,
      plan_id: orderData.planId,
      plan_name: orderData.planName,
      billing_cycle: orderData.billingCycle,
      amount: orderData.amount,
      admin_fee: adminFee,
      tax,
      total_amount: totalAmount,
      company_name: orderData.companyName,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      snap_token: transaction.token,
      snap_redirect_url: transaction.redirect_url,
      payment_status: 'PENDING',
    });

    return {
      orderId,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      totalAmount,
    };
  }

  static async handleWebhook(notificationPayload: any) {
    const snap = this.getSnapClient();
    const statusResponse = await snap.transaction.notification(notificationPayload);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;
    const settlementTime = statusResponse.settlement_time || new Date().toISOString();

    console.log(`[Midtrans Webhook] Order: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

    let finalStatus = 'PENDING';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        finalStatus = 'CHALLENGE';
      } else if (fraudStatus === 'accept') {
        finalStatus = 'PAID';
      }
    } else if (transactionStatus === 'settlement') {
      finalStatus = 'PAID';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      finalStatus = 'FAILED';
    } else if (transactionStatus === 'pending') {
      finalStatus = 'PENDING';
    }

    await OrderRepository.updateStatus(
      orderId,
      finalStatus,
      paymentType,
      settlementTime,
      JSON.stringify(statusResponse)
    );

    return { orderId, finalStatus, paymentType };
  }
}
