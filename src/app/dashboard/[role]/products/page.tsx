"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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

// Types based on the provided CJ Dropshipping My Product List JSON structure
interface CJMyProduct {
  productId: string;
  nameEn: string;
  sku: string;
  bigImage: string;
  totalPrice: string;
  sellPrice: string;
  listedShopNum: string;
  createAt: number;
}

export default function AdminMyProducts() {
  const [products, setProducts] = useState<CJMyProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Pagination & Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Fetch products from CJ Dropshipping "My Product" API
  const fetchMyProducts = async (keyword: string, currentPage: number) => {
    setLoading(true);
    try {
      // Build URL with query parameters
      const url = new URL("https://developers.cjdropshipping.com/api2.0/v1/product/myProduct/query");
      if (keyword) {
        url.searchParams.append("keyword", keyword);
      }
      url.searchParams.append("page", currentPage.toString());
      url.searchParams.append("size", "15"); // Enforce 15 items per page

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "CJ-Access-Token": process.env.NEXT_PUBLIC_CJ_TOKEN || "",
        },
      });

      const json = await response.json();

      if (json.code === 200 && json.data) {
        setProducts(json.data.content || []);
        setTotalPages(json.data.totalPages || 1);
        setTotalRecords(json.data.totalRecords || 0);
      } else {
        console.error("Failed to fetch my products:", json.message);
        setProducts([]);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching CJ my products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts(searchQuery, page);
  }, [searchQuery, page]);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    setSearchQuery(searchInput);
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Added Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage products you have imported from CJ Dropshipping. Total: {totalRecords}
          </p>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by SKU or Name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9"
          />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      {/* Products Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Added Date</TableHead>
              <TableHead>Total Price</TableHead>
             
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    Loading imported products...
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  {searchQuery 
                    ? `No products found for "${searchQuery}".` 
                    : "You haven't added any products from CJ Dropshipping yet."}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.productId}>
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
                    {formatDate(product.createAt)}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${product.totalPrice || product.sellPrice}
                  </TableCell>
                  
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="flex items-center justify-between">
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