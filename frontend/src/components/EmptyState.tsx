type Props = {
    title: string;
    subtitle?: string;
  };
  
  const EmptyState = ({ title, subtitle }: Props) => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-3">⚽</div>
        <div className="text-sm text-zinc-300 font-semibold">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-zinc-500 mt-1">
            {subtitle}
          </div>
        )}
      </div>
    );
  };
  
  export default EmptyState;
  