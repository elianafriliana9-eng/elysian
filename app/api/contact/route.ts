import { NextRequest, NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  email: string;
  business: string;
  projectType: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactPayload = await request.json();

    const { name, email, business, projectType, message } = body;

    // Basic validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "A valid name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Please tell us a bit more about your project (at least 10 characters).",
        },
        { status: 400 }
      );
    }

    // Log the submission (in production you'd send an email or save to DB)
    console.log("=== New Contact Submission ===");
    console.log("Name:", name.trim());
    console.log("Email:", email.trim());
    console.log("Business:", business?.trim() || "Not provided");
    console.log("Project Type:", projectType || "Not specified");
    console.log("Message:", message.trim());
    console.log("Timestamp:", new Date().toISOString());
    console.log("==============================");

    return NextResponse.json(
      {
        success: true,
        message: "We'll be in touch soon!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
