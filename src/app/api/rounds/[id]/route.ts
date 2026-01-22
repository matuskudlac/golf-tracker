import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id } = await params;

        // Delete the round (RLS will ensure user can only delete their own rounds)
        const { error } = await supabase
            .from('rounds')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting round:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Failed to delete round' },
            { status: 500 }
        );
    }
}