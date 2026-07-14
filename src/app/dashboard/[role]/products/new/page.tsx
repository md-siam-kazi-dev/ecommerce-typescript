"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Loader2, Plus, Check, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Types based on the provided CJ Dropshipping JSON structure
interface CJProduct {
  id: string;
  nameEn: string;
  sku: string;
  bigImage: string;
  sellPrice: string;
  threeCategoryName: string;
}

interface CJContentWrapper {
  productList: CJProduct[];
  keyWord: string;
}

export default function AdminCJImport() {
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  // Track which product ids have already been added successfully
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Pagination & Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch products from CJ Dropshipping API
 // Fetch products from CJ Dropshipping API
  const fetchProducts = async (keyword: string, currentPage: number) => {
    setLoading(true);
    try {
      const baseUrl = `https://developers.cjdropshipping.com/api2.0/v1/product/listV2`;
      const url = keyword.trim() !== "" 
        ? `${baseUrl}?page=${currentPage}&size=15&keyWord=${keyword}`
        : `${baseUrl}?page=${currentPage}&size=15`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "CJ-Access-Token": process.env.NEXT_PUBLIC_CJ_TOKEN || "",
        },
      });

      const json = await response.json();

      if (json.code === 200 && json.data) {
        console.log("CJ API Response Data:", json.data); // Helpful for debugging
        
        // Extract the products. Usually CJ API returns them in 'list' or 'content' directly.
        const extractedProducts = json.data.content[0]?.productList || []
        setProducts(extractedProducts);
        
        // CJ API usually returns 'total' items, so calculate total pages if 'totalPages' isn't explicitly provided
        const totalItems = json.data.tota;
        const calculatedTotalPages = json.data.totalPages || Math.ceil(totalItems / 15) || 1;
        setTotalPages(calculatedTotalPages);
      } 
    } catch (error) {
      console.error("Error fetching CJ products:", error);
      setProducts([]); // Ensure it resets on error
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts(searchQuery, page);
  }, [searchQuery, page]);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    setSearchQuery(searchInput);
  };

  // Add Product POST Request
  const handleAddProduct = async (productId: string) => {
    setAddingId(productId);
    try {
      const response = await fetch("https://developers.cjdropshipping.com/api2.0/v1/product/addToMyProduct", {
        method: "POST",
        headers: {
          "CJ-Access-Token": process.env.NEXT_PUBLIC_CJ_TOKEN || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        // Mark this product as added so its button stays disabled
        setAddedIds((prev) => new Set(prev).add(productId));
        toast.success("Product added successfully.");
      } else {
        toast.error("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred while adding the product.");
    } finally {
      setAddingId(null);
    }
  };

  // Renders the correct button state: idle / adding / added
  const renderAddButton = (product: CJProduct, fullWidth = false) => {
    const isAdding = addingId === product.id;
    const isAdded = addedIds.has(product.id);

    return (
      <Button
        variant={isAdded ? "secondary" : "default"}
        size="sm"
        onClick={() => handleAddProduct(product.id)}
        disabled={isAdding || isAdded}
        className={fullWidth ? "w-full" : "w-[120px]"}
      >
        {isAdding ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : isAdded ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Added
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </>
        )}
      </Button>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Add product from CJ Dropshipping
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9"
          />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      {/* Loading state (shared) */}
      {loading && (
        <div className="rounded-md border bg-card">
          <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            Loading products...
          </div>
        </div>
      )}

      {/* Empty state (shared) */}
      {!loading && products.length === 0 && (
        <div className="rounded-md border bg-card">
          <div className="h-48 flex items-center justify-center text-center text-muted-foreground px-4">
            {searchQuery
              ? `No products found for "${searchQuery}".`
              : "No products found."}
          </div>
        </div>
      )}

      {/* Mobile Card List (below md) */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-md border bg-card p-3 flex gap-3"
            >
              <div className="h-16 w-16 shrink-0 rounded overflow-hidden border bg-muted">
                <img
                  src={product.bigImage}
                  alt={product.nameEn}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium leading-snug line-clamp-2" title={product.nameEn}>
                  {product.nameEn}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  SKU: {product.sku}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {product.threeCategoryName}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-semibold">
                    ${product.sellPrice}
                  </span>
                </div>
                <div className="pt-1">
                  {renderAddButton(product, true)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Table (md and up) */}
      {!loading && products.length > 0 && (
        <div className="hidden md:block rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded overflow-hidden border bg-muted">
                      <img
                        src={product.bigImage}
                        alt={product.nameEn}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px]">
                    <div className="truncate" title={product.nameEn}>
                      {product.nameEn}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.threeCategoryName}
                  </TableCell>
                  <TableCell>
                    ${product.sellPrice}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderAddButton(product)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}