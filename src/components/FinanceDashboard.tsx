import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingDown, Wallet, AlertTriangle, Plus, Trash2, Pencil, Check } from "lucide-react";
import { useFinances, type Expense } from "@/hooks/useFinances";
import { cn } from "@/lib/utils";

const COLORS = [
  "hsl(24, 80%, 62%)",
  "hsl(270, 25%, 72%)",
  "hsl(152, 55%, 52%)",
  "hsl(210, 60%, 58%)",
  "hsl(340, 60%, 65%)",
  "hsl(45, 70%, 55%)",
  "hsl(190, 50%, 50%)",
  "hsl(0, 60%, 60%)",
];

const CATEGORIES = ["Moradia", "Utilidades", "Alimentação", "Transporte", "Lazer", "Saúde", "Educação", "Outros"];

export function FinanceDashboard() {
  const {
    income, setIncome,
    expenses, addExpense, removeExpense, updateExpense,
    totalExpenses, balance, usagePercent,
  } = useFinances();

  const [editingIncome, setEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState(String(income));
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newCategory, setNewCategory] = useState("Outros");
  const [newType, setNewType] = useState<"fixa" | "variavel">("fixa");

  const handleSaveIncome = () => {
    setIncome(Number(incomeInput) || 0);
    setEditingIncome(false);
  };

  const handleAddExpense = () => {
    if (!newName.trim() || !newValue) return;
    addExpense({ name: newName.trim(), value: Number(newValue), category: newCategory, type: newType });
    setNewName("");
    setNewValue("");
    setNewCategory("Outros");
    setNewType("fixa");
  };

  const pieData = expenses.map((e) => ({ name: e.name, value: e.value }));

  const balanceColor = balance > 0
    ? "text-green-600 dark:text-green-400"
    : balance === 0
      ? "text-yellow-600 dark:text-yellow-400"
      : "text-red-600 dark:text-red-400";

  const balanceBg = balance > 0
    ? "border-green-300 dark:border-green-700"
    : balance === 0
      ? "border-yellow-300 dark:border-yellow-700"
      : "border-red-300 dark:border-red-700";

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Renda Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {editingIncome ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                  className="h-8"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveIncome()}
                />
                <Button size="sm" variant="ghost" onClick={handleSaveIncome}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">R$ {income.toLocaleString("pt-BR")}</span>
                <Button size="sm" variant="ghost" onClick={() => { setIncomeInput(String(income)); setEditingIncome(true); }}>
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">R$ {totalExpenses.toLocaleString("pt-BR")}</span>
            {income > 0 && (
              <p className="text-xs text-muted-foreground mt-1">{usagePercent}% da renda</p>
            )}
          </CardContent>
        </Card>

        <Card className={cn("border-2", balanceBg)}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Restante</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <span className={cn("text-2xl font-bold", balanceColor)}>
              R$ {balance.toLocaleString("pt-BR")}
            </span>
            {balance < 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3 w-3" />
                Você está gastando mais do que ganha!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Expense list + form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Despesas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add form */}
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="Nome da despesa" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Input type="number" placeholder="Valor (R$)" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={newType} onValueChange={(v) => setNewType(v as "fixa" | "variavel")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixa">Fixa</SelectItem>
                  <SelectItem value="variavel">Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddExpense} className="w-full" disabled={!newName.trim() || !newValue}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar Despesa
            </Button>

            {/* List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {expenses.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma despesa cadastrada.</p>
              )}
              {expenses.map((exp) => (
                <ExpenseRow key={exp.id} expense={exp} onRemove={removeExpense} onUpdate={updateExpense} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">Adicione despesas para visualizar o gráfico.</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={600}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ExpenseRow({
  expense,
  onRemove,
  onUpdate,
}: {
  expense: Expense;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Partial<Omit<Expense, "id">>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(expense.value));

  const handleSave = () => {
    onUpdate(expense.id, { value: Number(editValue) || expense.value });
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border bg-card p-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{expense.name}</p>
        <p className="text-xs text-muted-foreground">
          {expense.category} · {expense.type === "fixa" ? "Fixa" : "Variável"}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {editing ? (
          <>
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-7 w-24 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}>
              <Check className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold whitespace-nowrap">R$ {expense.value.toLocaleString("pt-BR")}</span>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditValue(String(expense.value)); setEditing(true); }}>
              <Pencil className="h-3 w-3" />
            </Button>
          </>
        )}
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onRemove(expense.id)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
