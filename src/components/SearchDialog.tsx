
import { useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gameCategories } from "@/data/gameCategories";
import { Link } from "react-router-dom";

export function SearchDialog() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const allGames = Object.values(gameCategories).flatMap(category => 
    category.games.map(game => ({
      ...game,
      category: category.title
    }))
  );

  const filteredGames = allGames.filter(game =>
    game.title.toLowerCase().includes(search.toLowerCase()) ||
    game.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4">
          <Input
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
            autoFocus
          />
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredGames.map((game) => (
              <Link
                key={game.title}
                to={`/dashboard?game=${encodeURIComponent(game.title)}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center p-2 hover:bg-accent rounded-md"
              >
                <div>
                  <div className="font-medium">{game.title}</div>
                  <div className="text-sm text-muted-foreground">{game.category}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
