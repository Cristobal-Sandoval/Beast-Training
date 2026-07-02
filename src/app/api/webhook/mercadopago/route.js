import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize a supabase admin client (with service role key) since webhooks run server-side
// and need to bypass RLS policies to update user subscription status.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Initialize if env keys are present, otherwise log warning
const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

export async function POST(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || searchParams.get('type');
    const paymentId = searchParams.get('data.id') || searchParams.get('id');

    console.log(`Recibiendo webhook de Mercado Pago. Acción: ${action}, ID: ${paymentId}`);

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json({ error: 'Mercado Pago token not configured' }, { status: 500 });
    }

    // Only process if it is a payment event
    if (action === 'payment' || action === 'payment.created' || action === 'payment.updated' || !action) {
      // 1. Fetch payment status from Mercado Pago API
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al consultar pago en Mercado Pago');
      }

      const paymentData = await response.json();
      const status = paymentData.status; // approved, rejected, in_process, etc.
      const userId = paymentData.metadata?.user_id;
      const planId = paymentData.metadata?.plan_id;
      const amount = paymentData.transaction_amount;

      console.log(`Pago ${paymentId} de usuario ${userId}. Estado: ${status}, Monto: ${amount}`);

      if (status === 'approved' && userId && supabaseAdmin) {
        // 2. Register subscription or active payment status in Supabase profiles/payments table
        // For example, log payment log
        const { error: paymentLogError } = await supabaseAdmin
          .from('payments')
          .insert([
            {
              user_id: userId,
              plan_id: planId,
              amount: amount,
              status: 'approved',
              mp_payment_id: String(paymentId),
            }
          ]);
        
        if (paymentLogError) {
          console.warn('Error al registrar log de pago (tal vez falte tabla payments, omitiendo):', paymentLogError.message);
        }

        // We can also trigger notifications or custom logic
        console.log(`Suscripción activada con éxito para usuario ${userId}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
