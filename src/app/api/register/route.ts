import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {connectToDatabase} from '@/lib/mongodb';
import Enterprise from '@/models/enterprise';
import Deployment from '@/models/deployment';
import Subscription from '@/models/subscription';
import Counter from '@/models/counter';
import {OnboardingSchema} from '@/lib/schema';

// Helper function to get the next sequence value
async function getNextSequenceValue(sequenceName: string, startValue: number) {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
     if (sequenceDocument.sequence_value === 1 && startValue !== 1) {
        // First time, set the start value if it's not the default
        sequenceDocument.sequence_value = startValue;
        await sequenceDocument.save();
        return startValue;
    }
    return sequenceDocument.sequence_value;
}


export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const validation = OnboardingSchema.safeParse(body);

    if (!validation.success) {
      const errorMessages = validation.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({success: false, message: `Datos inválidos: ${errorMessages}`}, {status: 400});
    }

    const {
      businessName,
      businessAddress,
      businessIndustry,
      email,
      password,
    } = validation.data;
    
    const userEmail = email || 'admin@example.com';
    const userPassword = password || '1234';

    const existingUser = await Enterprise.findOne({email: userEmail});
    if (existingUser) {
      return NextResponse.json({success: false, message: 'El email ya está registrado.'}, {status: 409});
    }
    
    // Create related documents first
    const newSubscription = new Subscription({ status: 'Pendiente' });
    await newSubscription.save();
    
    // Get next port numbers
    const appPort = await getNextSequenceValue('app_port', 3001);
    const dbPort = await getNextSequenceValue('db_port', 27018);

    const newDeployment = new Deployment({
      app_port: appPort,
      db_port: dbPort,
      status: 'funcionando'
    });
    await newDeployment.save();

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newEnterprise = new Enterprise({
      businessName,
      businessAddress,
      businessIndustry,
      email: userEmail,
      password: hashedPassword,
      subscription: newSubscription._id,
      deployment: newDeployment._id,
    });

    await newEnterprise.save();

    return NextResponse.json({
      success: true,
      message: '¡Registro completado con éxito!',
    });
  } catch (error) {
    console.error('Registration error:', error);
    let message =
      'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.';

    // Check for MongoDB duplicate key error (code 11000)
    if (error instanceof Error && (error as any).code === 11000) {
      message = 'El email ya está en uso. Por favor, intente con otro.';
    } else if (error instanceof Error) {
      // Capture a more specific message if available
      message = error.message;
    }
    
    return NextResponse.json({success: false, message}, {status: 500});
  }
}
