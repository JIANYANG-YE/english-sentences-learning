import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const learningData = await prisma.learningData.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        lastUpdated: 'desc',
      },
    });

    if (!learningData) {
      return new NextResponse('No learning data found', { status: 404 });
    }

    return NextResponse.json(learningData);
  } catch (error) {
    console.error('Error fetching learning data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 