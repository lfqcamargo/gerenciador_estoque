import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const recentMovements = [
  {
    id: "1",
    material: "Parafuso M6x20",
    type: "entrada",
    quantity: 100,
    user: "João Silva",
    time: "2 min atrás",
  },
  {
    id: "2",
    material: "Chapa de Aço 2mm",
    type: "saida",
    quantity: 5,
    user: "Maria Santos",
    time: "15 min atrás",
  },
  {
    id: "3",
    material: "Tinta Branca 1L",
    type: "entrada",
    quantity: 20,
    user: "Pedro Costa",
    time: "1 hora atrás",
  },
  {
    id: "4",
    material: "Cabo Elétrico 2.5mm",
    type: "saida",
    quantity: 50,
    user: "Ana Lima",
    time: "2 horas atrás",
  },
  {
    id: "5",
    material: "Porca M6",
    type: "entrada",
    quantity: 200,
    user: "Carlos Oliveira",
    time: "3 horas atrás",
  },
];

export function RecentMovements() {
  return (
    <div className="space-y-8">
      {recentMovements.map((movement) => (
        <div key={movement.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {movement.user
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {movement.material}
            </p>
            <p className="text-sm text-muted-foreground">
              {movement.user} • {movement.time}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <span
              className={
                movement.type === "entrada" ? "text-green-600" : "text-red-600"
              }
            >
              {movement.type === "entrada" ? "+" : "-"}
              {movement.quantity}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
