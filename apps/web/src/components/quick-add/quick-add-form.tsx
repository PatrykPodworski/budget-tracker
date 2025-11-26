"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { CategorySelect } from "@/components/category-select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { LoadingButton } from "@/components/ui/loading-button";
import { CurrencyToggle } from "./currency-toggle";
import { PaidBy } from "@/components/receipt/receipt-details/receipt/paid-by";
import { Person } from "@/data/people";
import { PaymentParticipant } from "@budget-tracker/shared/enriched-receipt-data-schema";
import {
  Currency,
  convertToBaseCurrency,
} from "@budget-tracker/shared/currency";
import { upsertQuickExpense } from "@/lib/quick-expense/upsert";
import { writeQuickExpense } from "@/lib/google-spreadsheet/write-quick-expense";
import { categories } from "@/data/categories";

export const QuickAddForm = ({ people, defaultUserId }: QuickAddFormProps) => {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(() =>
    getInitialState(defaultUserId)
  );
  const [isSaving, startSaving] = useTransition();

  const isFormValid =
    formState.name.trim() !== "" &&
    formState.amount > 0 &&
    formState.paidBy.length > 0;

  const handleSaveDraft = () => {
    if (!isFormValid) {
      return;
    }

    // TODO: P2 Add toast notifications
    startSaving(async () => {
      try {
        await upsertQuickExpense({
          ...formState,
          isSentToBudget: false,
          createdAt: new Date(),
        });
        router.push("/");
      } catch (error) {
        console.error("Error saving quick expense:", error);
      }
    });
  };

  const handleSaveAndSend = () => {
    if (!isFormValid) {
      return;
    }

    startSaving(async () => {
      try {
        // Save first without marking as sent
        const expense = await upsertQuickExpense({
          ...formState,
          isSentToBudget: false,
          createdAt: new Date(),
        });

        // Write to Google Sheets (this also marks as sent on success)
        await writeQuickExpense({
          ...formState,
          expenseId: expense.id,
          userId: defaultUserId,
        });

        router.push("/");
      } catch (error) {
        console.error("Error saving and sending quick expense:", error);
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="sm:pb-0">
        <h1 className="text-xl font-semibold">Quick Add Expense</h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g., Grab taxi"
            value={formState.name}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <CategorySelect
            id="category"
            value={formState.category}
            onValueChange={(category) =>
              setFormState((prev) => ({ ...prev, category }))
            }
          />
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formState.amount || ""}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
          <CurrencyToggle
            value={formState.currency}
            onChange={(currency) =>
              setFormState((prev) => ({ ...prev, currency }))
            }
          />
        </div>
        <div>
          <Label>Date</Label>
          <DateTimePicker
            defaultValue={formState.transactionDate}
            onChange={(date) =>
              date &&
              setFormState((prev) => ({ ...prev, transactionDate: date }))
            }
          />
        </div>
        <PaidBy
          paidBy={formState.paidBy}
          total={convertToBaseCurrency(formState.amount, formState.currency)}
          people={people}
          onChange={async (paidBy) =>
            setFormState((prev) => ({ ...prev, paidBy }))
          }
        />
        <div className="flex gap-2 mt-2">
          <LoadingButton
            onClick={handleSaveDraft}
            loading={isSaving}
            disabled={!isFormValid || isSaving}
            variant="outline"
            className="flex-1"
          >
            Save Draft
          </LoadingButton>
          <LoadingButton
            onClick={handleSaveAndSend}
            loading={isSaving}
            disabled={!isFormValid || isSaving}
            className="flex-1"
          >
            Save and Send
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  );
};

type QuickAddFormProps = {
  people: readonly Person[];
  defaultUserId: string;
};

type FormState = {
  name: string;
  category: string;
  amount: number;
  currency: Currency;
  transactionDate: Date;
  paidBy: PaymentParticipant[];
};

const getInitialState = (defaultUserId: string): FormState => ({
  name: "",
  category: categories[0],
  amount: 0,
  currency: "PLN",
  transactionDate: new Date(),
  paidBy: [{ personId: defaultUserId, sharePercentage: 100 }],
});
