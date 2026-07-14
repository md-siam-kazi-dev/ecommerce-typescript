"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";

// Updated interface to match your exact data structure requirements
interface Customer {
  _id: string;
  name: string;
  email: string;
  img?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const {data:tokenData} = await authClient.token()
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/admin/customer`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenData?.token}`, 
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch customers");
        
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error(error);
        // Fallback mock data matching your new schema
       
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className=" w-full  mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F150C]">Customers</h1>
          <p className="text-muted-foreground">Manage your registered users.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8 bg-[#E1DCC9]/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 p-12 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm">Loading customers...</span>
        </div>
      ) : (
        <>
          {/* DESKTOP VIEW: Tabular Data */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader className="bg-[#E1DCC9]/40">
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">No customers found.</TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-[#E1DCC9]">
                            <AvatarImage src={customer.img} alt={customer.name} />
                            <AvatarFallback className="bg-[#1F150C] text-[#E1DCC9] uppercase">
                              {customer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-[#412D15]">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* MOBILE VIEW: Card Based */}
          <div className="block md:hidden space-y-4">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-md">
                No customers found.
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <Card key={customer._id} className="border-[#E1DCC9]">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <Avatar className="h-12 w-12 border border-[#E1DCC9]">
                      <AvatarImage src={customer.img} alt={customer.name} />
                      <AvatarFallback className="bg-[#1F150C] text-[#E1DCC9] text-lg uppercase">
                        {customer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-[#1F150C]">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full text-[#412D15] border-[#412D15]">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}