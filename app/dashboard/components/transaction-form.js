'use client'

import Label from "@/components/label";
import Select from "@/components/select";
import Input from "@/components/input";
import Button from "@/components/button";
import { categories,types } from "@/lib/consts" 
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { transactionSchema } from "@/lib/validation"
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import FormError from "@/components/form-error";
import { createTransaction, updateTransaction } from "@/lib/actions"

export default function TransactionForm({initialData}) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
      } = useForm({
        mode: "onTouched",
        resolver: zodResolver(transactionSchema),
        defaultValues: initialData ?? {
            created_at: new Date().toISOString().split("T")[0],
        }
      })

      const router = useRouter()
      const [isSaving, setSaving] = useState(false)
      const [lastError, setLastError] = useState()
      const type = watch("type")
      const editing = Boolean(initialData)

      const onSubmit = async (data) => {
        setSaving(true)
        setLastError()
        try {
            if (editing) {
                await updateTransaction(initialData.id, data)
            } else {
                await createTransaction(data)
            }
            router.push("/dashboard")
        }
        catch (error) {
            setLastError(error?.message)
        }
        finally {
            setSaving(false)
        }
    }
  return <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label className="mb-1">Type</Label>
            <Select {...register("type", {
                onChange: (e) => {
                    if (e.target.value !== "Expense") {
                        setValue("category", "")
                    }
                }
            })}>
                {types.map(type => <option key={type}>{type}</option>)}
            </Select>
            <FormError error={errors.type?.message} />
        </div>
        
        <div>
            <Label className="mb-1">Category</Label>
            <Select {...register("category") } disabled={type !== "Expense"}>
                <option value="">Select a category</option>
                {categories.map(category => <option key={category}>{category}</option>)}
            </Select>
            <FormError error={errors.category?.message} />
        </div>

        <div>
            <Label className="mb-1">Transaction Date</Label>
            <Input {...register("created_at")} disabled={editing} />
            <FormError error={errors.created_at?.message} />
        </div>

        <div>
            <Label className="mb-1">Amount</Label>
            <Input type="number" {...register("amount")} />
            <FormError error={errors.amount?.message} />
        </div>

        <div className="col-span-1 md:col-span-2">
            <Label className="mb-1">Description</Label>
            <Input {...register("description")} />
            <FormError error={errors.description?.message} />
        </div>
    </div>

    <div className="flex justify-between items-center">
        <div>
            {lastError && <FormError error={lastError} />}
        </div>
        <Button variant="ghost" size="sm" type="submit" disabled={isSaving}>Save</Button>
    </div>
  </form>
}