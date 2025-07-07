
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50 // Limit to last 50 transactions
        }
      }
    });

    if (!user) {
      return NextResponse.json({ transactions: [] });
    }

    return NextResponse.json({ transactions: user.transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      type,
      poolId,
      poolName,
      tokenA,
      tokenB,
      amountA,
      amountB,
      lpTokenAmount,
      signature
    } = body;

    if (!walletAddress || !type || !poolId || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user if doesn't exist
    const user = await prisma.user.upsert({
      where: { walletAddress },
      create: { walletAddress },
      update: {}
    });

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type,
        poolId,
        poolName,
        tokenA,
        tokenB,
        amountA,
        amountB,
        lpTokenAmount,
        signature,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
