import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch rounds with course information joined
    const { data: rounds, error } = await supabase
        .from('rounds')
        .select(`
      id,
      date_played,
      total_score,
      course_id,
      courses!inner (
        id,
        name,
        course_holes (
          par
        )
      )
    `)
        .eq('user_id', user.id)
        .order('date_played', { ascending: false });

    if (error) {
        console.error('Error fetching rounds:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the data to include calculated fields
    const transformedRounds = rounds?.map((round: any) => {
        // Calculate total par from course holes
        const totalPar = round.courses?.course_holes?.reduce(
            (sum: number, hole: any) => sum + (hole.par || 0),
            0
        ) || 0;

        // Calculate relative to par
        const toPar = round.total_score - totalPar;

        return {
            id: round.id,
            date_played: round.date_played,
            course_name: round.courses?.name || 'Unknown Course',
            course_id: round.course_id,
            total_score: round.total_score,
            total_par: totalPar,
            to_par: toPar,
            holes_played: round.courses?.course_holes?.length || 0,
        };
    });

    return NextResponse.json(transformedRounds || []);
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { course_id, date_played, weather, notes, holes } = body;

        // Calculate total score
        const total_score = holes.reduce((sum: number, hole: any) => sum + (hole.score || 0), 0);

        // Create the round (user_id will be auto-set by database trigger)
        const { data: round, error: roundError } = await supabase
            .from('rounds')
            .insert([{
                course_id,
                date_played,
                total_score,
                weather_conditions: weather || null,
                notes: notes || null,
            }])
            .select()
            .single();

        if (roundError) {
            console.error('Error creating round:', roundError);
            return NextResponse.json({ error: roundError.message }, { status: 500 });
        }

        // Create hole scores
        const holeScoresData = holes.map((hole: any) => ({
            round_id: round.id,
            course_hole_id: hole.course_hole_id,
            score: hole.score,
        }));

        const { error: holesError } = await supabase
            .from('round_holes')
            .insert(holeScoresData);

        if (holesError) {
            console.error('Error creating hole scores:', holesError);
            return NextResponse.json({ error: holesError.message }, { status: 500 });
        }

        return NextResponse.json(round, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Failed to create round' },
            { status: 500 }
        );
    }
}