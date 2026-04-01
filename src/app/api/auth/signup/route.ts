import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Organization from "@/models/Organization";
import Settings from "@/models/Settings";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, organizationName } = body;

    // Validation
    if (!email || !password || !organizationName) {
      return NextResponse.json(
        { error: "Email, password, and organization name are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create organization
    const organization = await Organization.create({
      name: organizationName,
    });

    // Create default settings for organization
    await Settings.create({
      organizationId: organization._id,
      defaultLowStockThreshold: 10,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      organizationId: organization._id,
    });

    // Don't return the password
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      organizationId: user.organizationId,
    };

    return NextResponse.json(
      {
        message: "User and organization created successfully",
        user: userWithoutPassword,
        organization,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong during signup" },
      { status: 500 }
    );
  }
}
