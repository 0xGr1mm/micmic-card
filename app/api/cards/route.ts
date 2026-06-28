import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase');
    const supabase = getSupabaseAdmin();

    const formData = await req.formData();
    const username = formData.get('username') as string;
    const magnitude = parseInt(formData.get('magnitude') as string);
    const pfpFile = formData.get('pfp') as File;

    if (!username || !magnitude || !pfpFile) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const fileExt = pfpFile.name.split('.').pop() ?? 'png';
    const fileName = `${nanoid()}.${fileExt}`;
    const arrayBuffer = await pfpFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('pfps')
      .upload(fileName, buffer, { contentType: pfpFile.type, upsert: false });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from('pfps').getPublicUrl(fileName);

    const cardId = nanoid(10);
    const { error: insertError } = await supabase
      .from('micmic_cards')
      .insert({ id: cardId, username, magnitude, pfp_url: publicUrl, view_count: 0 });

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    return NextResponse.json({ cardId, pfpUrl: publicUrl });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase');
    const supabase = getSupabaseAdmin();

    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get('id');
    if (!cardId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { data, error } = await supabase
      .from('micmic_cards')
      .select('*')
      .eq('id', cardId)
      .single();

    if (error || !data) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

    await supabase
      .from('micmic_cards')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', cardId);

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
