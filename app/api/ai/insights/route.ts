import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's recent transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        category: true,
        account: true,
      },
      orderBy: { date: "desc" },
      take: 50, // Last 50 transactions
    });

    // Get user's budgets
    const budgets = await prisma.budget.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // Prepare data for AI analysis
    const transactionSummary = transactions.map((t) => ({
      amount: t.amount,
      type: t.type,
      category: t.category.name,
      date: t.date.toISOString().split("T")[0],
    }));

    const budgetSummary = budgets.map((b) => ({
      name: b.name,
      amount: b.amount,
      period: b.period,
    }));

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
    As a financial advisor, analyze the following user's financial data and provide insights:

    Recent Transactions (last 50):
    ${JSON.stringify(transactionSummary, null, 2)}

    Current Budgets:
    ${JSON.stringify(budgetSummary, null, 2)}

    Please provide:
    1. Spending pattern analysis
    2. Budget performance insights
    3. Recommendations for improvement
    4. Potential savings opportunities
    5. Financial health score (1-10)

    Keep the response concise, actionable, and user-friendly. Format as JSON with the following structure:
    {
      "spendingPatterns": "analysis of spending habits",
      "budgetInsights": "budget performance analysis",
      "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
      "savingsOpportunities": ["opportunity 1", "opportunity 2"],
      "financialHealthScore": 8,
      "summary": "overall financial health summary"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    let insights;
    try {
      insights = JSON.parse(text);
    } catch (error) {
      insights = {
        spendingPatterns: "Unable to analyze spending patterns at this time.",
        budgetInsights: "Budget analysis unavailable.",
        recommendations: [
          "Review your recent transactions",
          "Set up budgets for major categories",
        ],
        savingsOpportunities: [
          "Track daily expenses",
          "Review subscription services",
        ],
        financialHealthScore: 7,
        summary: text.substring(0, 200) + "...",
      };
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error("AI insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
