import { CikLogo } from "./cik-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground border-b border-primary-border sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-6 gap-4">
        <div className="flex items-center gap-3">
          <CikLogo className="h-10 w-10" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold leading-tight">Centralna izborna komisija BiH</h1>
            <p className="text-xs text-primary-foreground/90">Revizijski Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Revizor: Amir Hasanović</p>
              <p className="text-xs text-primary-foreground/80">Glavni revizor</p>
            </div>
            <Avatar data-testid="avatar-user">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary-foreground text-primary">AH</AvatarFallback>
            </Avatar>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            data-testid="button-logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
