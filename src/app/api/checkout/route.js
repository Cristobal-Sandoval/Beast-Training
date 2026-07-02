import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { planId, planName, price, userId, userEmail } = body;

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    // If no access token is set, we return an indicator to use local simulation
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Mercado Pago token not configured, using local simulation mode.' },
        { status: 500 }
      );
    }

    // Call Mercado Pago API to create preference
    // API endpoint: https://api.mercadopago.com/checkout/preferences
    const preference = {
      items: [
        {
          id: planId,
          title: `Beast Training - ${planName}`,
          quantity: 1,
          unit_price: Number(price),
          currency_id: 'CLP',
        },
      ],
      payer: {
        email: userEmail,
      },
      back_urls: {
        // Replace with your production domain in deployment
        success: `${request.headers.get('origin') || 'http://localhost:3000'}/dashboard?payment=success`,
        failure: `${request.headers.get('origin') || 'http://localhost:3000'}/planes?payment=failure`,
        pending: `${request.headers.get('origin') || 'http://localhost:3000'}/planes?payment=pending`,
      },
      auto_return: 'approved',
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://beasttraining.cl'}/api/webhook/mercadopago`,
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al generar la preferencia de Mercado Pago');
    }

    // Return initPoint (URL to redirect user to complete payment on Mercado Pago)
    return NextResponse.json({
      preferenceId: data.id,
      initPoint: data.init_point, // For production/live wallets
      sandboxInitPoint: data.sandbox_init_point, // For sandbox testing
    });
  } catch (error) {
    console.error('Mercado Pago Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
