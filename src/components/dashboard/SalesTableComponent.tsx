import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { exportSalesToPDF } from '@/utils/pdfExport';
import { Plus, Download, Trash2, Search } from 'lucide-react';

interface Sale {
  id: string;
  user_id: string;
  amount: number;
  client_name: string;
  month_year: string;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

interface SalesTableProps {
  sales: Sale[];
  onAddSale?: (sale: { amount: number; client_name: string; month_year: string }) => void;
  onDeleteSale?: (id: string) => void;
}

const SalesTableComponent = ({ sales, onAddSale, onDeleteSale }: SalesTableProps) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSale, setNewSale] = useState({
    amount: '',
    client_name: '',
    month_year: format(new Date(), 'yyyy-MM'),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const filteredSales = sales.filter(sale =>
    sale.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSale = () => {
    const amount = parseFloat(newSale.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid positive number', variant: 'destructive' });
      return;
    }
    if (!newSale.client_name.trim()) {
      toast({ title: 'Invalid client name', description: 'Please enter a client name', variant: 'destructive' });
      return;
    }

    onAddSale?.({
      amount,
      client_name: newSale.client_name.trim(),
      month_year: newSale.month_year,
    });

    setNewSale({ amount: '', client_name: '', month_year: format(new Date(), 'yyyy-MM') });
    setIsAddDialogOpen(false);
  };

  const handleExport = () => {
    exportSalesToPDF(sales, { title: 'My Sales Report' });
    toast({ title: 'Report exported', description: 'Your sales report has been downloaded' });
  };

  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Sales</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Add Sale
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Sale</DialogTitle>
                <DialogDescription>Enter the details of your new sale</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    value={newSale.client_name}
                    onChange={(e) => setNewSale({ ...newSale, client_name: e.target.value })}
                    placeholder="Enter client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newSale.amount}
                    onChange={(e) => setNewSale({ ...newSale, amount: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    type="month"
                    value={newSale.month_year}
                    onChange={(e) => setNewSale({ ...newSale, month_year: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddSale} variant="gradient" className="flex-1">
                    Add Sale
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No sales found matching your search' : 'No sales recorded yet'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.slice(0, 10).map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {format(new Date(sale.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">{sale.client_name}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(Number(sale.amount))}
                    </TableCell>
                    <TableCell className="text-center">
                      {sale.is_locked ? (
                        <Badge variant="secondary">Locked</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-600">Open</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSale?.(sale.id)}
                        disabled={sale.is_locked}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesTableComponent;
