import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || searchParams.get('type');
    const paymentId = searchParams.get('data.id') || searchParams.get('id');

    console.log(`Webhook MP recibido. Acción: ${action}, ID: ${paymentId}`);

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json({ error: 'Mercado Pago token not configured' }, { status: 500 });
    }

    if (action === 'payment' || action === 'payment.created' || action === 'payment.updated' || !action) {
      // 1. Fetch payment from Mercado Pago API
      const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!paymentRes.ok) {
        throw new Error(`Error al consultar pago ${paymentId} en MP: ${paymentRes.status}`);
      }

      const paymentData = await paymentRes.json();
      const status = paymentData.status;
      const userId = paymentData.metadata?.user_id;
      const planId = paymentData.metadata?.plan_id;
      const amount = paymentData.transaction_amount;

      console.log(`Pago ${paymentId}: status=${status}, user=${userId}, monto=${amount}`);

      // 2. Verify with merchant_order if available (security: double-check)
      const merchantOrderId = paymentData.order?.id;
      if (merchantOrderId) {
        const orderRes = await fetch(`https://api.mercadopago.com/v1/merchant_orders/${merchantOrderId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          const orderTotal = orderData.total_amount;
          if (Math.abs(orderTotal - amount) > 1) {
            console.warn(`DISCREPANCIA: merchant_order total ${orderTotal} !== payment amount ${amount}`);
          }
        }
      }

      // 3. Store in Supabase payments table
      if (status === 'approved' && userId && supabaseAdmin) {
        const paymentRecord = {
          user_id: userId,
          plan_id: planId,
          amount: amount,
          status: 'approved',
          mp_payment_id: String(paymentId),
          mp_merchant_order_id: merchantOrderId ? String(merchantOrderId) : null,
        };

        const { error: insertError } = await supabaseAdmin
          .from('payments')
          .insert([paymentRecord]);

        if (insertError) {
          console.error('Error al insertar payment en Supabase:', insertError.message);
        } else {
          // Update user profile status to active
          await supabaseAdmin
            .from('profiles')
            .update({ status: 'active' })
            .eq('id', userId);

          console.log(`Suscripción activada para usuario ${userId}`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
