"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useFormContext,
  useFormState,
  Controller,
} from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { CategorySelect } from "@/components/category-select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { LoadingButton } from "@/components/ui/loading-button";
import { CurrencyToggle } from "@/components/quick-add/currency-toggle";
import { PaidBy } from "@/components/receipt/receipt-details/receipt/paid-by";
import { Person } from "@/data/people";
import { QuickExpense } from "@budget-tracker/shared/quick-expense-schema";
import { upsertQuickExpense } from "@/lib/quick-expense/upsert";
import { writeQuickExpense } from "@/lib/google-spreadsheet/write-quick-expense";
import { deleteQuickExpense } from "@/lib/quick-expense/delete";
import type { QuickExpenseFormData } from "@/lib/quick-expense/quick-expense-form-schema";

export type QuickExpenseFormContentProps = {
  quickExpense?: QuickExpense;
  people: readonly Person[];
  defaultUserId: string;
  isEditMode: boolean;
  router: ReturnType<typeof useRouter>;
};

export const QuickExpenseFormContent = ({
  quickExpense,
  people,
  defaultUserId,
  isEditMode,
  router,
}: QuickExpenseFormContentProps) => {
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, control, getValues } = useFormContext<QuickExpenseFormData>();
  const { isDirty, isValid } = useFormState({ control });

  const hasChanges = isDirty;
  const isFormValid = isValid;
  const isSentToBudget = quickExpense ? quickExpense.isSentToBudget : false;

  const handleSave = () => {
    if (!isFormValid || (isEditMode && !hasChanges)) {
      return;
    }

    startSaving(async () => {
      try {
        const formData = getValues();
        const payload = {
          name: formData.name,
          category: formData.category,
          amount: formData.total,
          currency: formData.currency,
          transactionDate: formData.transactionDate,
          paidBy: formData.paidBy,
        };

        if (quickExpense) {
          await upsertQuickExpense({
            id: quickExpense.id,
            ...payload,
            isSentToBudget: quickExpense.isSentToBudget,
            createdAt: quickExpense.createdAt,
          });
          router.refresh();
        } else {
          await upsertQuickExpense({
            ...payload,
            isSentToBudget: false,
            createdAt: new Date(),
          });
          router.push("/");
        }
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
        const formData = getValues();
        const payload = {
          name: formData.name,
          category: formData.category,
          amount: formData.total,
          currency: formData.currency,
          transactionDate: formData.transactionDate,
          paidBy: formData.paidBy,
        };

        const expense = await upsertQuickExpense({
          ...(quickExpense && { id: quickExpense.id }),
          ...payload,
          isSentToBudget: false,
          createdAt: quickExpense ? quickExpense.createdAt : new Date(),
        });

        await writeQuickExpense({
          ...payload,
          expenseId: expense.id,
          userId: defaultUserId,
        });

        if (isEditMode) {
          router.refresh();
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error saving and sending quick expense:", error);
      }
    });
  };

  const handleDelete = async () => {
    if (!quickExpense) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteQuickExpense(quickExpense.id);
      router.push("/");
    } catch (error) {
      console.error("Error deleting quick expense:", error);
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="sm:pb-0">
        <h1 className="text-xl font-semibold">
          {isEditMode ? "Edit Quick Expense" : "Quick Add Expense"}
        </h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g., Grab taxi"
            {...register("name")}
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <CategorySelect
                id="category"
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="total">Amount</Label>
            <Input
              id="total"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              {...register("total", {
                setValueAs: (v) =>
                  v === "" || Number.isNaN(Number(v)) ? 0 : Number(v),
              })}
            />
          </div>
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <CurrencyToggle value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <div>
          <Label>Date</Label>
          <Controller
            control={control}
            name="transactionDate"
            render={({ field }) => (
              <DateTimePicker
                defaultValue={field.value}
                onChange={(date) => date && field.onChange(date)}
              />
            )}
          />
        </div>
        <PaidBy people={people} />
        <div className="flex gap-2 mt-2">
          <LoadingButton
            onClick={handleSave}
            loading={isSaving}
            disabled={
              !isFormValid ||
              (isEditMode && !hasChanges) ||
              isSaving ||
              isDeleting
            }
            variant="outline"
            className="flex-1"
          >
            Save
          </LoadingButton>
          <LoadingButton
            onClick={handleSaveAndSend}
            loading={isSaving}
            disabled={!isFormValid || isSaving || isDeleting || isSentToBudget}
            className="flex-1"
          >
            Save and Send
          </LoadingButton>
        </div>
        {isEditMode && (
          <LoadingButton
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isSaving || isDeleting}
            variant="destructive"
            className="w-full"
          >
            Delete Expense
          </LoadingButton>
        )}
      </CardContent>
    </Card>
  );
};
