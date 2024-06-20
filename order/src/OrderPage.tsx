import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from 'app_shell/AuthContext';
import { axiosClient } from './lib/axios';

export interface OrderProps {
  orderId: string;
  customerId: string;
  totalPrice: number;
  status: string;
  orderDate: string;
}

export default function OrderPage() {
  const { user, jwt } = useContext(AuthContext);
  const [refetch, setRefetch] = useState(0);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  console.log('🚀 ~ OrderPage ~ orders:', orders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedOrders: OrderProps[] = useMemo(() => {
    return orders?.sort((a, b) => {
      return (
        new Date(b.orderDate).getTime() ||
        0 - new Date(a.orderDate).getTime() ||
        0
      );
    });
  }, [orders]);

  const filteredOrders: OrderProps[] = useMemo(() => {
    return sortedOrders.filter((order) => {
      return order.customerId.toLowerCase().includes(search.toLowerCase()) &&
        user?.role === 'admin'
        ? true
        : order.customerId == user?.customer_id;
    });
  }, [search, sortedOrders]);

  const paginatedOrders: OrderProps[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [currentPage, filteredOrders]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const fetchOrders = async () => {
    if (!refetch) {
      setLoading(true);
      setSearch('');
    }
    try {
      const response = await axiosClient('/api/orders', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setOrders(response.data?.orders);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refetch]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        {/* <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="#">Dashboard</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="#">Orders</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Recent Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {/* <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Your Orders</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Introducing Our Dynamic Orders Dashboard for Seamless
                  Management and Insightful Analysis.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Create New Order</Button>
              </CardFooter>
            </Card> */}
          </div>
          <div className="flex items-center"></div>
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Orders</CardTitle>
              <CardDescription>Recent orders from your store.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => {
                    return (
                      <TableRow key={order.orderId}>
                        <TableCell>
                          <div className="font-medium">{order.customerId}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {order.customerId}
                          </div>
                        </TableCell>

                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {order.orderDate}
                        </TableCell>
                        <TableCell className="text-right">
                          ${order.totalPrice}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
