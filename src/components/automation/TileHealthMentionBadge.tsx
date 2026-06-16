import { Badge } from '@/components/ui';

interface TileHealthMentionBadgeProps {
  mentionsTileHealth: boolean | null;
}

export function TileHealthMentionBadge({
  mentionsTileHealth,
}: TileHealthMentionBadgeProps): React.ReactNode {
  if (mentionsTileHealth === null) {
    return <span className="text-muted-foreground/70 text-xs">Unknown</span>;
  }

  if (mentionsTileHealth) {
    return <Badge variant="success">Tile Health</Badge>;
  }

  return <Badge variant="default">No mention</Badge>;
}
