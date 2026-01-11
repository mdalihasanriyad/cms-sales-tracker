import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, DollarSign, User, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sale } from '@/types';
import { toast } from '@/hooks/use-toast';

interface SalesTableProps {
  sales: Sale[];
  onAddSale?: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditSale?: (sale: Sale) => void;
  onDeleteSale?: (id: string) => void;
}

const SalesTable = ({ sales, onAddSale, onEditSale, onDeleteSale }: SalesTableProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    clientName: '',
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatCurrency(sale.amount).includes(searchTerm)
  );

  const handleAddSale = () => {
    if (!newSale.amount || !newSale.clientName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(newSale.date);
    
    if (selectedDate > today) {
      toast({
        title: 'Invalid Date',
        description: 'Cannot add sales for future dates',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Sale Added!',
      description: `Successfully added ${formatCurrency(parseFloat(newSale.amount))} sale`,
    });

    setNewSale({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      clientName: '',
    });
    setIsAddDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    toast({
      title: 'Sale Deleted',
      description: 'The sale has been removed',
    });
    onDeleteSale?.(id);
  };

  return (
    <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cms-pink/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-cms-pink" />
            </div>
            <div>
              <CardTitle className="text-xl">Sales Records</CardTitle>
              <p className="text-sm text-muted-foreground">January 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl gradient-text">Add New Sale</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-cms-purple" />
                      Date
                    </label>
                    <Input
                      type="date"
                      value={newSale.date}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-cms-pink" />
                      Amount (USD)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter amount"
                      value={newSale.amount}
                      onChange={(e) => setNewSale({ ...newSale, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-cms-blue" />
                      Client Name
                    </label>
                    <Input
                      placeholder="Enter client name"
                      value={newSale.clientName}
                      onChange={(e) => setNewSale({ ...newSale, clientName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="hero" onClick={handleAddSale}>
                    Add Sale
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No sales found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{formatDate(sale.date)}</TableCell>
                    <TableCell>{sale.clientName}</TableCell>
                    <TableCell className="text-right font-semibold gradient-text">
                      {formatCurrency(sale.amount)}
                    </TableCell>
                    <TableCell>
                      {sale.isLocked ? (
                        <Badge variant="secondary">Locked</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-cms-blue hover:text-cms-blue hover:bg-cms-blue/10"
                          disabled={sale.isLocked}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={sale.isLocked}
                          onClick={() => handleDelete(sale.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default SalesTable;
