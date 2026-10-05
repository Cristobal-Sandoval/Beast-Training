import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  const startTime = Date.now();
  try {
    // 1. Query plans table
    const { data: plansData, error: plansError } = await supabase
      .from('plans')
      .select('id, name')
      .limit(2);

    if (plansError) throw plansError;

    // 2. Query about_info table
    const { data: aboutData, error: aboutError } = await supabase
      .from('about_info')
      .select('id, title')
      .limit(1);

    const latency = Date.now() - startTime;

    return NextResponse.json({
      status: 'active',
      timestamp: new Date().toISOString(),
      latency_ms: latency,
      plans_count: plansData ? plansData.length : 0,
      supabase_connected: true,
      message: '✅ Supabase keep-alive ping executed successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
        supabase_connected: false,
      },
      { status: 500 }
    );
  }
}
