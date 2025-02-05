export function AIThinking() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0">
          <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        CrypGod is thinking...
      </div>
    </div>
  );
}
