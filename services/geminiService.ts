
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Category, Transaction, WeeklyReport } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const categorizeExpense = async (description: string): Promise<Category> => {
  try {
    const prompt = `Categorize the following expense: "${description}". Respond with only one of these exact categories: "Needs", "Wants", or "Savings/Investments". Do not add any explanation, punctuation, or formatting.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
          temperature: 0,
          thinkingConfig: { thinkingBudget: 0 }
        }
    });

    const categoryText = response.text.trim().replace(/"/g, '');

    if (categoryText === 'Needs' || categoryText === 'Wants' || categoryText === 'Savings/Investments') {
      return categoryText as Category;
    } else {
      console.warn(`Unexpected category from AI: "${categoryText}". Defaulting to 'Wants'.`);
      return 'Wants';
    }
  } catch (error) {
    console.error("Error categorizing expense:", error);
    // Fallback in case of API error
    return 'Wants';
  }
};

export const generateWeeklyReport = async (
  currentWeekTransactions: Transaction[],
  previousWeekTransactions: Transaction[]
): Promise<WeeklyReport> => {
    const currentWeekExpenses = currentWeekTransactions.filter(t => t.type === 'expense');
    const previousWeekExpenses = previousWeekTransactions.filter(t => t.type === 'expense');

    const totalCurrentSpend = currentWeekExpenses.reduce((sum, t) => sum + t.amount, 0);
    const totalPreviousSpend = previousWeekExpenses.reduce((sum, t) => sum + t.amount, 0);

    const prompt = `
    You are a 24/7 Personal Finance Advisor. Analyze the user's financial data for the past week and generate a report.

    **Current Week's Transactions:**
    ${JSON.stringify(currentWeekTransactions, null, 2)}

    **Previous Week's Total Spend:** ${totalPreviousSpend.toFixed(2)}

    **Your Task:**
    Generate a JSON object with the following structure. Do not include any markdown fences or other text outside the JSON object.

    {
      "grade": "Assign a financial health grade from 'A' (excellent) to 'F' (poor) based on spending habits, savings, and income vs. expenses.",
      "summary": "Provide a 1-2 sentence concise summary of the week's financial activity.",
      "topExpenses": [
        // List the top 5 individual expense transactions by amount this week.
        // For each, calculate the week-over-week percentage change compared to the *total* spend of the previous week if that item existed. Since individual item comparison is hard, let's simplify: calculate WoW change for the top categories if possible, or just note the amount. For this exercise, just focus on description and amount.
        { "description": "Expense description", "amount": 120.50 },
        { "description": "Another expense", "amount": 95.00 }
      ],
      "suggestion": {
        "area": "Highlight one specific area (e.g., 'Dining Out', 'Subscriptions', 'Investing') to either cut back on or invest more in.",
        "reason": "Explain why this suggestion is important for their financial health."
      },
      "tips": [
        // Provide 3-4 concise, tailored, and actionable bullet-point tips based on the grade and spending data.
        "Tip 1...",
        "Tip 2...",
        "Tip 3..."
      ]
    }
    `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.5,
        }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);
    
    // Data validation
    if (!parsedData.grade || !parsedData.summary || !parsedData.topExpenses || !parsedData.suggestion || !parsedData.tips) {
        throw new Error("Generated report is missing required fields.");
    }
    
    return parsedData as WeeklyReport;

  } catch (error) {
    console.error("Error generating weekly report:", error);
    throw new Error("Failed to communicate with the AI Advisor. Please check your connection or API key.");
  }
};

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const expenseByCategory: { [key: string]: number } = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
        });

    const prompt = `
    You are an expert Personal Finance Advisor. A user, likely in their early 20s, provides their recent transaction summary.

    **User's Financial Data:**
    - Total Income (this period): $${totalIncome.toFixed(2)}
    - Total Expenses (this period): $${totalExpenses.toFixed(2)}
    - Expense Breakdown by Category: ${JSON.stringify(expenseByCategory)}

    **Your Task:**
    Generate a comprehensive and encouraging financial advice report in plain text. Use markdown for clear formatting (headings with **, lists with -). The response should be structured into three sections and should not be in JSON format.

    **1. Your Financial Snapshot & Advice**
    - Analyze their income-to-expense ratio. Provide a clear verdict (e.g., "Healthy", "Needs Attention").
    - Based on their spending categories, offer one specific, actionable piece of feedback. For example, if 'Wants' are high, suggest a specific strategy to manage it.

    **2. General Investment Plan (For a 20-25 Year Old)**
    - Recommend two diverse investment strategies suitable for long-term growth (e.g., "Low-Cost Index Fund ETFs" and "Roth IRA Contributions").
    - For each, briefly explain what it is, its typical risk level (e.g., "Medium", "Low"), and why it's a good choice for someone starting out.

    **3. Your 6-Month Financial Action Plan**
    - Create a simple, step-by-step 6-month plan based on their stated income.
    - The plan must be concrete. For example: "Month 1 Goal: Save 15% of your income ($XXX) into a high-yield savings account." or "Month 2 Goal: Open a Roth IRA and contribute $YYY."
    - Make the plan feel achievable and motivating.
    `;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
            config: {
                temperature: 0.6,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting financial advice:", error);
        throw new Error("Failed to communicate with the AI Advisor for financial advice.");
    }
};
