export async function POST(req) {
  try {
    console.log("REGISTER ROUTE HIT");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log("BASE URL:", baseUrl);

    await connectdb();
    console.log("DB CONNECTED");

    const { username, email, password } = await req.json();
    console.log("REQUEST BODY:", { username, email });

    const findUser = await User.findOne({ email });
    console.log("FOUND USER:", !!findUser);

    if (findUser) {
      return NextResponse.json({ error: "User exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken: token,
      verificationTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    console.log("USER CREATED:", user._id);

    const verifiLink = `${baseUrl}/verify?token=${token}`;
    console.log("VERIFY LINK:", verifiLink);

    await sendEmail(email, verifiLink);
    console.log("EMAIL SENT");

    return NextResponse.json(
      { message: "User created. Check your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error full:", error);
    return NextResponse.json(
      { error: error.message || "  error" },
      { status: 500 }
    );
  }
}
