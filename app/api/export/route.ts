import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import ExcelJS from "exceljs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all transactions with related data
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        category: true,
        account: true,
      },
      orderBy: { date: "desc" },
    });

    const dataToExport = transactions.map((t) => ({
      Date: t.date.toISOString().split("T")[0],
      Description: t.description,
      Amount: t.amount,
      Type: t.type,
      Category: t.category.name,
      Account: t.account.name,
    }));

    const format = request.nextUrl.searchParams.get("format") || "csv";

    if (format === "csv") {
      const csv = Papa.unparse(dataToExport);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="transactions.csv"`,
        },
      });
    }

    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Transactions");

      worksheet.columns = [
        { header: "Date", key: "Date", width: 15 },
        { header: "Description", key: "Description", width: 40 },
        {
          header: "Amount",
          key: "Amount",
          width: 15,
          style: { numFmt: "$#,##0.00" },
        },
        { header: "Type", key: "Type", width: 15 },
        { header: "Category", key: "Category", width: 25 },
        { header: "Account", key: "Account", width: 25 },
      ];

      worksheet.addRows(dataToExport);

      worksheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="transactions.xlsx"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (error) {
    console.error("Export failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
