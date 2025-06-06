"use client";

import { CategoryForm } from "@/components/dashboard/category-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { addCategory } from "@/lib/features/categorySlice";

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, categoryFetchLoading, categoryAddLoading } = useSelector(
    (state: RootState) => state.categories
  );

  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const handleCreateCategory = async (categoryData: any) => {
    await dispatch(addCategory(categoryData));
    setShowCategoryForm(false);
  };

  if (categoryFetchLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Categories
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Add and manage your categories
          </p>
        </div>

        <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleCreateCategory}
              loading={categoryAddLoading}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border border-slate-200/60 dark:border-slate-700 rounded-md p-4 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 flex items-center justify-center text-2xl rounded-full shadow"
              style={{ backgroundColor: category.color }}
            >
              {category.icon}
            </div>

            <div>
              <h2 className="text-lg font-semibold capitalize">
                {category.name}
              </h2>
              <p className="text-sm text-muted-foreground">{category.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
